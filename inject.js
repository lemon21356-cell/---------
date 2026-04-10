window.addEventListener('ExecuteCleanUp', () => {
    // 1. Entry 객체가 존재하는지 더 정밀하게 확인
    const entryObj = window.Entry || (window.dom && window.dom.Entry);

    if (!entryObj || !entryObj.mainWorkspace || !entryObj.mainWorkspace.board) {
        alert("엔트리 워크스페이스를 완전히 불러온 후 다시 시도해 주세요!");
        return;
    }

    // 2. 모든 블록 가져오기
    const board = entryObj.mainWorkspace.board;
    const allBlocks = board.code.getObjects();
    
    // 3. 삭제 대상 필터링 (머리 블록이면서 시작 블록이 아닌 것)
    const toDelete = allBlocks.filter(block => {
        // block.prevBlock이 없으면 뭉치의 맨 위입니다.
        // block.isStartBlock()이 false면 '시작' 버튼으로 작동하는 블록이 아닙니다.
        return !block.prevBlock && !block.isStartBlock();
    });

    if (toDelete.length === 0) {
        alert("지울 블록이 없습니다. (모든 블록이 연결되어 있거나 시작 블록입니다.)");
        return;
    }

    if (confirm(`연결되지 않은 블록 ${toDelete.length}뭉치를 삭제할까요?`)) {
        // 엔트리 내부 엔진에 맞춰 안전하게 삭제
        toDelete.forEach(block => {
            if (entryObj.do) {
                // 실행 취소(Undo)가 가능하도록 엔트리 명령어로 삭제
                entryObj.do('destroyBlock', block);
            } else {
                block.destroy();
            }
        });
        
        // 화면 갱신
        board.rebuildVisual();
    }
});
