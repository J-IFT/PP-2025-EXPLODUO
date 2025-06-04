import { create } from 'zustand';
import { GAME_STATUS } from '../constants';

interface Cell {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborMineCount: number;
  revealedBy: string | null;
}

interface GameState {
  board: Cell[][];
  mines: number | null;
  gameStatus: string;
  playerScores: Record<string, number>;
  playerId: string;
  gameId: string | null;
  setPlayerId: (id: string) => void;
  initializeGame: (
    board: Cell[][], 
    mines: number | null, 
    gameStatus: string, 
    playerScores: Record<string, number>,
    gameId: string
  ) => void;
  revealCell: (row: number, col: number, playerId: string) => Promise<boolean>;
}

export const useGameStore = create<GameState>((set, get) => ({
  board: [],
  mines: null,
  gameStatus: GAME_STATUS.PLAYING,
  playerScores: {},
  playerId: '',
  gameId: null,
  
  setPlayerId: (id: string) => set({ playerId: id }),
  
  initializeGame: (board, mines, gameStatus, playerScores, gameId) => {
    set({ 
      board: JSON.parse(JSON.stringify(board)), 
      mines, 
      gameStatus, 
      playerScores, 
      gameId 
    });
  },
  
  revealCell: async (row: number, col: number, playerId: string) => {
    const { board, gameStatus, playerScores } = get();
    
    // Don't allow revealing if game is over or cell is already revealed/flagged
    if (
      gameStatus !== GAME_STATUS.PLAYING || 
      board[row][col].isRevealed || 
      board[row][col].isFlagged
    ) {
      return false;
    }
    
    // Clone the board to avoid direct state mutation
    const newBoard = JSON.parse(JSON.stringify(board));
    const cell = newBoard[row][col];
    
    // Reveal the cell
    cell.isRevealed = true;
    cell.revealedBy = playerId;
    
    // Update player scores
    const newPlayerScores = { ...playerScores };
    
    if (!newPlayerScores[playerId]) {
      newPlayerScores[playerId] = 0;
    }
    
    // If not a mine, add a point
    if (!cell.isMine) {
      newPlayerScores[playerId]++;
    }
    
    // Check if game is over (hit a mine)
    let newGameStatus = gameStatus;
    if (cell.isMine) {
      newGameStatus = GAME_STATUS.GAME_OVER;
      
      // Reveal all mines
      for (let r = 0; r < newBoard.length; r++) {
        for (let c = 0; c < newBoard[r].length; c++) {
          if (newBoard[r][c].isMine) {
            newBoard[r][c].isRevealed = true;
          }
        }
      }
    } else {
      // If cell has no adjacent mines, reveal neighboring cells recursively
      if (cell.neighborMineCount === 0) {
        const revealNeighbors = (r: number, c: number) => {
          for (let i = Math.max(0, r - 1); i <= Math.min(newBoard.length - 1, r + 1); i++) {
            for (let j = Math.max(0, c - 1); j <= Math.min(newBoard[0].length - 1, c + 1); j++) {
              const neighbor = newBoard[i][j];
              
              // Skip if already revealed or flagged or is a mine
              if (neighbor.isRevealed || neighbor.isFlagged || neighbor.isMine) continue;
              
              // Reveal the neighbor
              neighbor.isRevealed = true;
              neighbor.revealedBy = playerId;
              
              // Add a point
              newPlayerScores[playerId]++;
              
              // If this neighbor has no adjacent mines, recursively reveal its neighbors
              if (neighbor.neighborMineCount === 0) {
                revealNeighbors(i, j);
              }
            }
          }
        };
        
        revealNeighbors(row, col);
      }
      
      // Check if all non-mine cells are revealed (win condition)
      let allNonMinesRevealed = true;
      for (let r = 0; r < newBoard.length; r++) {
        for (let c = 0; c < newBoard[r].length; c++) {
          if (!newBoard[r][c].isMine && !newBoard[r][c].isRevealed) {
            allNonMinesRevealed = false;
            break;
          }
        }
        if (!allNonMinesRevealed) break;
      }
      
      if (allNonMinesRevealed) {
        newGameStatus = GAME_STATUS.WIN;
        
        // Reveal all mines as flagged
        for (let r = 0; r < newBoard.length; r++) {
          for (let c = 0; c < newBoard[r].length; c++) {
            if (newBoard[r][c].isMine) {
              newBoard[r][c].isFlagged = true;
            }
          }
        }
      }
    }
    
    set({ 
      board: newBoard, 
      gameStatus: newGameStatus,
      playerScores: newPlayerScores
    });
    
    return true;
  }
}));