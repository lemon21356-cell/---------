(function() {
    let entryObj = null;

    // Entry 객체를 찾을 때까지 반복 확인 (최대 10초)
    const findEntry = setInterval(() => {
        const target = window.Entry || (window.dom && window.dom.Entry);
        if (target && target.mainWorkspace) {
            entryObj = target;
            clearInterval(findEntry);
            console.log("엔트리 클린업 도구가 준비되었습니다.");
        }
    }, 1000);

    window.addEventListener('ExecuteCleanUp', () => {
        if (!entryObj || !entryObj.mainWorkspace) {
            alert("엔트리 워크스페이스를 찾을 수 없습니다. 페이지를 새로고침한 뒤 잠시만 기다려 주세요.");
            return;
        }

        const board = entryObj.mainWorkspace.board;
        const allBlocks = board.code.getObjects();
        
        // 필터: 시작 블록이 아니고 위가 비어있는 블록(뭉치의 최상단)
        const toDelete = allBlocks.filter(block => {
            return !block.prevBlock && !block.isStartBlock();
        });

        if (toDelete.length === 0) {
            alert("정리할 블록이 없습니다. 모든 블록이 사용 중입니다.");
            return;
        }

        if (confirm(`연결되지 않은 블록 ${toDelete.length}뭉치를 삭제하시겠습니까?`)) {
            toDelete.forEach(block => {
                // 엔트리 내부 엔진 명령어로 삭제 (Undo 지원)
                if (entryObj.do) {
                    entryObj.do('destroyBlock', block);
                } else {
                    block.destroy();
                }
            });
            board.rebuildVisual(); // 화면 갱신
        }
    });
})();
