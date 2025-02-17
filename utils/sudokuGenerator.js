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

// Função auxiliar para identificar o índice do quadrante (0 a 8)
function getQuadrant( row, col ) {
  return Math.floor( row / 3 ) * 3 + Math.floor( col / 3 );
}

// Função auxiliar que verifica a distribuição das dicas dentro do quadrante,
// simulando a remoção da célula (removalRow, removalCol).
// Se o quadrante possuir mais de uma dica, exige que elas estejam em pelo menos 2 linhas e 2 colunas.
function checkQuadrantDistribution( puzzle, quadrant, removalRow, removalCol ) {
  const startRow = Math.floor( quadrant / 3 ) * 3;
  const startCol = ( quadrant % 3 ) * 3;

  const rowsWithClues = new Set();
  const colsWithClues = new Set();
  let totalClues = 0;

  // Varre as células do quadrante simulando a remoção na posição (removalRow, removalCol)
  for ( let i = 0; i < 3; i++ ) {
    for ( let j = 0; j < 3; j++ ) {
      const r = startRow + i;
      const c = startCol + j;
      // Ignora a célula que pretendemos remover
      if ( r === removalRow && c === removalCol ) continue;
      if ( puzzle[ r ][ c ] !== 0 ) {
        rowsWithClues.add( i );
        colsWithClues.add( j );
        totalClues++;
      }
    }
  }

  // Se houver mais de uma dica, exigimos que elas estejam distribuídas em pelo menos 2 linhas e 2 colunas.
  if ( totalClues > 1 && ( rowsWithClues.size < 2 || colsWithClues.size < 2 ) ) {
    return false;
  }
  return true;
}

// Remove células garantindo solução única e uma distribuição mínima de pistas por quadrante,
// além de verificar a distribuição interna dentro do quadrante.
function removeCellsKeepUnique( board, minClues = 36, minPerQuadrant = 4 ) {
  // Cria uma cópia do board
  const puzzle = board.map( row => row.slice() );

  // Contador total de pistas (inicialmente 81, pois o board está completo)
  let currentClues = 81;

  // Contador de pistas por quadrante (cada quadrante inicia com 9 pistas)
  const quadrantClues = Array( 9 ).fill( 9 );

  // Lista todas as posições do board
  const positions = [];
  for ( let i = 0; i < 9; i++ ) {
    for ( let j = 0; j < 9; j++ ) {
      positions.push( { row: i, col: j } );
    }
  }

  // Embaralha as posições para remoção aleatória
  positions.sort( () => Math.random() - 0.5 );

  // Tenta remover células enquanto houver pistas a remover e sem violar as restrições
  for ( const { row, col } of positions ) {
    // Se já removemos o suficiente, para
    if ( currentClues <= minClues ) break;

    // Se já estiver removida, pula
    if ( puzzle[ row ][ col ] === 0 ) continue;

    const quadrant = getQuadrant( row, col );

    // Garante o mínimo por quadrante
    if ( quadrantClues[ quadrant ] <= minPerQuadrant ) continue;

    // Verifica a distribuição interna no quadrante simulando a remoção desta célula
    if ( !checkQuadrantDistribution( puzzle, quadrant, row, col ) ) continue;

    // Backup do valor atual e tenta remover a célula
    const backup = puzzle[ row ][ col ];
    puzzle[ row ][ col ] = 0;

    // Verifica se a remoção mantém a unicidade da solução
    if ( countSolutions( puzzle ) !== 1 ) {
      // Se não, restaura o valor
      puzzle[ row ][ col ] = backup;
    } else {
      // Remoção bem-sucedida: atualiza os contadores
      quadrantClues[ quadrant ]--;
      currentClues--;
    }
  }

  return puzzle;
}

// ---------------------------
// 4. Geração final do Sudoku
// ---------------------------

// Exemplos de escalas de remoção (há várias formas de controlar dificuldade)
function generateSudoku( difficulty = 'easy' ) {
  // 1) Gera a solução completa
  const solution = generateFullSolution();
  // 2) Define o número mínimo de dicas de acordo com a dificuldade
  let minClues;
  let minPerQuadrant;
  switch ( difficulty ) {
    case 'easy':
      minClues = 36; // mais dicas = quebra-cabeça mais fácil
      minPerQuadrant = 4;
      break;
    case 'medium':
      minClues = 28;
      minPerQuadrant = 3;
      break;
    case 'hard':
      minClues = 20;
      minPerQuadrant = 2;
      break;
    default:
      minClues = 46;
      break;
  }

  // Remove as células, garantindo que o Sudoku permanece com uma única solução e com pelo menos "minClues" dicas
  const puzzle = removeCellsKeepUnique( solution, minClues, minPerQuadrant );


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
