// sudokuAdvancedGenerator.js

// ---------------------------
// 1. Funções utilitárias
// ---------------------------

// Verifica se é seguro colocar "num" em board[row][col]
function isSafe( board, row, col, num ) {
  // Verifica se "num" já está na linha
  for ( let x = 0; x < 9; x++ ) {
    if ( board[ row ][ x ] === num ) {
      return false;
    }
  }

  // Verifica se "num" já está na coluna
  for ( let x = 0; x < 9; x++ ) {
    if ( board[ x ][ col ] === num ) {
      return false;
    }
  }

  // Verifica se "num" já está no quadrante 3x3
  const startRow = row - ( row % 3 );
  const startCol = col - ( col % 3 );

  for ( let i = 0; i < 3; i++ ) {
    for ( let j = 0; j < 3; j++ ) {
      if ( board[ startRow + i ][ startCol + j ] === num ) {
        return false;
      }
    }
  }

  return true;
}

// ---------------------------
// 2. Geração de solução completa
// ---------------------------

// Preenche o board inteiro usando backtracking
function fillBoard( board ) {
  let row = -1;
  let col = -1;
  let foundEmpty = false;

  // Localiza uma célula vazia (que esteja com 0)
  for ( let i = 0; i < 9 && !foundEmpty; i++ ) {
    for ( let j = 0; j < 9 && !foundEmpty; j++ ) {
      if ( board[ i ][ j ] === 0 ) {
        row = i;
        col = j;
        foundEmpty = true;
      }
    }
  }

  // Se não encontrou célula vazia, significa que o board está completo
  if ( !foundEmpty ) {
    return true;
  }

  // Embaralha a sequência de tentativas [1..9] para garantir aleatoriedade
  const numbers = [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ];
  numbers.sort( () => Math.random() - 0.5 );

  for ( let num of numbers ) {
    if ( isSafe( board, row, col, num ) ) {
      board[ row ][ col ] = num;

      // Chama recursivamente para a próxima célula
      if ( fillBoard( board ) ) {
        return true;
      }

      // Se não deu certo, reseta para 0 (backtrack)
      board[ row ][ col ] = 0;
    }
  }

  // Se não conseguiu preencher, volta (backtrack)
  return false;
}

// Gera uma solução completa, retornando o board preenchido
function generateFullSolution() {
  const board = Array.from( { length: 9 }, () => Array( 9 ).fill( 0 ) );
  fillBoard( board );
  return board;
}

// ---------------------------
// 3. Remoção de elementos com verificação de unicidade
// ---------------------------

// Conta quantas soluções um board possui (pode parar em 2, se preferir, para detectar "mais de 1")
function countSolutions( board ) {
  let row = -1;
  let col = -1;
  let foundEmpty = false;

  for ( let i = 0; i < 9 && !foundEmpty; i++ ) {
    for ( let j = 0; j < 9 && !foundEmpty; j++ ) {
      if ( board[ i ][ j ] === 0 ) {
        row = i;
        col = j;
        foundEmpty = true;
      }
    }
  }

  // Se não encontrou célula vazia, significa que temos 1 solução válida
  if ( !foundEmpty ) {
    return 1;
  }

  let solutions = 0;
  for ( let num = 1; num <= 9; num++ ) {
    if ( isSafe( board, row, col, num ) ) {
      board[ row ][ col ] = num;
      solutions += countSolutions( board );
      board[ row ][ col ] = 0;

      // Se quisermos apenas saber se há mais de uma, podemos parar se solutions > 1
      if ( solutions > 1 ) {
        break;
      }
    }
  }
  return solutions;
}

// Remove elementos e mantém unicidade
function removeCellsKeepUnique( board, attempts = 50 ) {
  // Copia o board
  const puzzle = board.map( ( row ) => row.slice() );

  // O "attempts" aqui controla quantas remoções tentaremos fazer.
  while ( attempts > 0 ) {
    const row = Math.floor( Math.random() * 9 );
    const col = Math.floor( Math.random() * 9 );

    // Se já estiver vazio, continue
    if ( puzzle[ row ][ col ] === 0 ) {
      attempts--;
      continue;
    }

    const backup = puzzle[ row ][ col ];
    puzzle[ row ][ col ] = 0;

    // Verifica se ainda tem solução única
    const solutionsCount = countSolutions( puzzle );
    if ( solutionsCount !== 1 ) {
      // Se não é única, restaura e diminui a tentativas
      puzzle[ row ][ col ] = backup;
      attempts--;
    }
  }

  return puzzle;
}

// ---------------------------
// 4. Geração final do Sudoku
// ---------------------------

// Exemplos de escalas de remoção (há várias formas de controlar dificuldade)
function generateSudoku( difficulty = 'medium' ) {
  // 1) Gera a solução completa
  const solution = generateFullSolution();

  // 2) Remove de acordo com a dificuldade
  let attempts;
  switch ( difficulty ) {
    case 'easy':
      attempts = 40;
      break;
    case 'medium':
      attempts = 50;
      break;
    case 'hard':
      attempts = 70;
      break;
    default:
      attempts = 50;
      break;
  }

  // Remove as células, garantindo que o Sudoku permanece com uma única solução
  const puzzle = removeCellsKeepUnique( solution, attempts );

  return { puzzle, solution };
}

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

function clearUserInput( currentBoard, puzzle ) {
  return currentBoard.map( ( row, i ) =>
    row.map( ( cell, j ) => ( puzzle[ i ][ j ] === 0 ? 0 : cell ) )
  );
}


module.exports = { generateSudoku, isBoardCorrect, clearUserInput };
