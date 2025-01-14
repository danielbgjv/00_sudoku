// lib/sudokuGenerator.js

// Tabuleiro base (solução completa). Você pode usar um algoritmo mais sofisticado para gerar aleatoriamente.
function getBaseSolution() {
  return [
    [ 5, 3, 4, 6, 7, 8, 9, 1, 2 ],
    [ 6, 7, 2, 1, 9, 5, 3, 4, 8 ],
    [ 1, 9, 8, 3, 4, 2, 5, 6, 7 ],
    [ 8, 5, 9, 7, 6, 1, 4, 2, 3 ],
    [ 4, 2, 6, 8, 5, 3, 7, 9, 1 ],
    [ 7, 1, 3, 9, 2, 4, 8, 5, 6 ],
    [ 9, 6, 1, 5, 3, 7, 2, 8, 4 ],
    [ 2, 8, 7, 4, 1, 9, 6, 3, 5 ],
    [ 3, 4, 5, 2, 8, 6, 1, 7, 9 ],
  ];
}

// Embaralha linhas e colunas aleatoriamente para gerar variações (simplificado).
function shuffleBoard( board ) {
  let newBoard = board.map( row => [ ...row ] );

  // Embaralhar grupos de linhas (exemplo simples)
  for ( let i = 0; i < 3; i++ ) {
    const start = i * 3;
    const subset = newBoard.slice( start, start + 3 );
    subset.sort( () => Math.random() - 0.5 );
    newBoard.splice( start, 3, ...subset );
  }

  // Poderia embaralhar colunas aqui também, mas vamos manter simples
  return newBoard;
}

// Remove números do tabuleiro conforme a dificuldade
function removeNumbers( board, difficulty ) {
  const newBoard = board.map( row => [ ...row ] );
  let attempts = 0;

  let removals;
  if ( difficulty === 'easy' ) {
    removals = 35;
  } else if ( difficulty === 'medium' ) {
    removals = 45;
  } else {
    removals = 55; // hard
  }

  while ( removals > 0 && attempts < 200 ) {
    const row = Math.floor( Math.random() * 9 );
    const col = Math.floor( Math.random() * 9 );

    if ( newBoard[ row ][ col ] !== 0 ) {
      newBoard[ row ][ col ] = 0;
      removals--;
    }
    attempts++;
  }

  return newBoard;
}

// Verifica se o Sudoku está correto, comparando com a solução.
function isBoardCorrect( userBoard, solution ) {
  for ( let i = 0; i < 9; i++ ) {
    for ( let j = 0; j < 9; j++ ) {
      if ( userBoard[ i ][ j ] !== solution[ i ][ j ] ) {
        return false;
      }
    }
  }
  return true;
}

function generateSudoku( difficulty ) {
  const base = getBaseSolution();
  const shuffled = shuffleBoard( base );
  const puzzle = removeNumbers( shuffled, difficulty );
  return { puzzle, solution: shuffled };
}

function clearUserInput( currentBoard, puzzle ) {
  return currentBoard.map( ( row, i ) =>
    row.map( ( cell, j ) => ( puzzle[ i ][ j ] === 0 ? 0 : cell ) )
  );
}

module.exports = {
  generateSudoku,
  isBoardCorrect,
  clearUserInput
};
