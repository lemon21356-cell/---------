window.addEventListener('ExecuteCleanUp', () => {
  // 엔트리 워크스페이스 확인
  if (typeof Entry === 'undefined' || !Entry.mainWorkspace) {
    alert("엔트리 만들기 화면(워크스페이스)을 열어주세요!");
    return;
  }

  // 모든 블록 객체 가져오기
  const allBlocks = Entry.mainWorkspace.board.code.getObjects();
  
  // 삭제 대상 필터링: 
  // 1. 위에 연결된 블록이 없고(머리 블록)
  // 2. 시작(이벤트) 블록이 아닌 것
  const toDelete = allBlocks.filter(block => {
    return !block.prevBlock && !block.isStartBlock();
  });

  if (toDelete.length === 0) {
    alert("지울 블록이 없습니다. (연결되지 않은 블록이 없음)");
    return;
  }

  if (confirm(`연결되지 않은 블록 ${toDelete.length}뭉치를 삭제할까요?`)) {
    toDelete.forEach(block => {
      // 엔트리의 공식 삭제 커맨드 사용 (Undo 지원 시도)
      if (Entry.do) {
        Entry.do('destroyBlock', block);
      } else {
        block.destroy();
      }
    });
    
    // 화면 새로고침(리렌더링)
    Entry.mainWorkspace.board.rebuildVisual();
    alert("정리가 완료되었습니다!");
  }
});
