import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabase } from '../contexts/SupabaseContext';
import { Grid3X3Icon } from 'lucide-react';

interface GameSettings {
  rows: number;
  cols: number;
  mines: number;
}

const DIFFICULTY_PRESETS = {
  easy: { rows: 8, cols: 8, mines: 10 },
  medium: { rows: 12, cols: 12, mines: 24 },
  hard: { rows: 16, cols: 16, mines: 40 }
};

const DIFFICULTY_NAMES = {
  easy: 'Facile',
  medium: 'Moyen',
  hard: 'Difficile'
};

const CreateGame = () => {
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [isCreating, setIsCreating] = useState(false);
  const { supabase } = useSupabase();
  const navigate = useNavigate();

  const createBoard = (settings: GameSettings) => {
    const { rows, cols, mines } = settings;
    
    const board = Array(rows).fill(null).map(() => 
      Array(cols).fill(null).map(() => ({
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        neighborMineCount: 0,
        revealedBy: null
      }))
    );
    
    let minesPlaced = 0;
    while (minesPlaced < mines) {
      const row = Math.floor(Math.random() * rows);
      const col = Math.floor(Math.random() * cols);
      
      if (!board[row][col].isMine) {
        board[row][col].isMine = true;
        minesPlaced++;
      }
    }
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (board[row][col].isMine) continue;
        
        let count = 0;
        
        for (let r = Math.max(0, row - 1); r <= Math.min(rows - 1, row + 1); r++) {
          for (let c = Math.max(0, col - 1); c <= Math.min(cols - 1, col + 1); c++) {
            if (r === row && c === col) continue;
            if (board[r][c].isMine) count++;
          }
        }
        
        board[row][col].neighborMineCount = count;
      }
    }
    
    return board;
  };

  const handleCreateGame = async () => {
    try {
      setIsCreating(true);
      
      const settings = DIFFICULTY_PRESETS[difficulty];
      const board = createBoard(settings);
      
      const { data, error } = await supabase
        .from('games')
        .insert({
          board: board,
          mines: settings.mines,
          rows: settings.rows,
          cols: settings.cols,
          game_status: 'playing',
          player_scores: {}
        })
        .select()
        .single();
        
      if (error) throw error;
      
      navigate(`/game/${data.id}`);
    } catch (error) {
      console.error('Error creating game:', error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="bg-slate-700 p-6 rounded-lg shadow-lg w-full max-w-md">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Grid3X3Icon size={20} />
        Créer une Nouvelle Partie
      </h2>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-300 mb-2">Difficulté</label>
        <div className="grid grid-cols-3 gap-3">
          {(Object.keys(DIFFICULTY_PRESETS) as Array<keyof typeof DIFFICULTY_PRESETS>).map((level) => (
            <button
              key={level}
              onClick={() => setDifficulty(level)}
              className={`
                py-2 px-4 rounded-md transition-all text-sm font-medium
                ${difficulty === level 
                  ? 'bg-blue-500 text-white shadow-md' 
                  : 'bg-slate-600 text-slate-200 hover:bg-slate-500'}
              `}
            >
              {DIFFICULTY_NAMES[level]}
            </button>
          ))}
        </div>
      </div>
      
      <div className="text-slate-300 text-sm mb-6">
        <div className="flex justify-between mb-2">
          <span>Taille de la grille :</span>
          <span className="font-medium">
            {DIFFICULTY_PRESETS[difficulty].rows} × {DIFFICULTY_PRESETS[difficulty].cols}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Mines :</span>
          <span className="font-medium">{DIFFICULTY_PRESETS[difficulty].mines}</span>
        </div>
      </div>
      
      <button
        onClick={handleCreateGame}
        disabled={isCreating}
        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-md 
                  font-medium shadow-md hover:from-blue-600 hover:to-blue-700 transition-all
                  disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isCreating ? (
          <span className="flex items-center justify-center gap-2">
            <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
            Création en cours...
          </span>
        ) : (
          'Créer la Partie'
        )}
      </button>
    </div>
  );
};

export default CreateGame;