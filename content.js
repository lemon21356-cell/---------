(function() {
    console.log("엔트리 클린업 엔진 준비 완료");

    window.addEventListener('EXECUTE_ENTRY_CLEANUP', () => {
        // 엔트리 전역 객체 확보
        const entry = window.Entry;

        if (!entry || !entry.mainWorkspace) {
            alert("엔트리 워크스페이스를 찾을 수 없습니다. 페이지를 완전히 로딩한 후 다시 시도해 주세요.");
            return;
        }

        const board = entry.mainWorkspace.board;
        const allBlocks = board.code.getObjects();
        
        // 필터: 시작 블록이 아니고, 위에 연결된 블록이 없는 블록 뭉치의 최상단 블록
        const toDelete = allBlocks.filter(block => {
            return !block.prevBlock && !block.isStartBlock();
        });

        if (toDelete.length === 0) {
            alert("삭제할 미사용 블록이 없습니다.");
            return;
        }

        if (confirm(`연결되지 않은 블록 ${toDelete.length}뭉치를 정말 삭제할까요?`)) {
            toDelete.forEach(block => {
                // 엔트리 내부 실행 취소(Undo) 시스템에 등록하며 삭제
                if (entry.do) {
                    entry.do('destroyBlock', block);
                } else {
                    block.destroy();
                }
            });
            // 화면 물리적 갱신
            board.rebuildVisual();
            console.log(`${toDelete.length}개의 블록 뭉치 삭제됨`);
        }
    });
})();
