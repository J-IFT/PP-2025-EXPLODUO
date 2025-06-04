import React, { useEffect, useState } from 'react';
import Cell from './Cell';
import { useGameStore } from '../stores/gameStore';
import { useSupabase } from '../contexts/SupabaseContext';
import { GAME_STATUS } from '../constants';
import { BombIcon, Award } from 'lucide-react';

const Board = ({ gameId }: { gameId: string }) => {
  const { supabase } = useSupabase();
  const { 
    board, 
    revealCell, 
    gameStatus, 
    playerScores, 
    playerId, 
    setPlayerId,
    initializeGame
  } = useGameStore();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        // Get player ID from local storage or generate a new one
        const storedPlayerId = localStorage.getItem(`minesweeper_player_${gameId}`);
        const currentPlayerId = storedPlayerId || `player_${Math.random().toString(36).substring(2, 9)}`;
        
        if (!storedPlayerId) {
          localStorage.setItem(`minesweeper_player_${gameId}`, currentPlayerId);
        }
        
        setPlayerId(currentPlayerId);
        
        // Get game data
        const { data, error } = await supabase
          .from('games')
          .select('*')
          .eq('id', gameId)
          .single();
          
        if (error) {
          console.error('Error fetching game:', error);
          return;
        }
        
        if (data) {
          initializeGame(data.board, data.mines, data.game_status, data.player_scores || {}, gameId);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing game:', error);
        setIsLoading(false);
      }
    };

    fetchGame();

    // Subscribe to game changes
    const subscription = supabase
      .channel(`game_${gameId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'games',
        filter: `id=eq.${gameId}`
      }, (payload) => {
        const { board, game_status, player_scores } = payload.new;
        initializeGame(board, null, game_status, player_scores || {}, gameId);
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [gameId, supabase, initializeGame, setPlayerId]);

  const handleCellClick = async (row: number, col: number) => {
    if (gameStatus !== GAME_STATUS.PLAYING || isLoading) return;
    
    const result = await revealCell(row, col, playerId);
    
    if (result) {
      // Update game in Supabase
      await supabase
        .from('games')
        .update({
          board: board,
          game_status: gameStatus,
          player_scores: playerScores,
          updated_at: new Date()
        })
        .eq('id', gameId);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex justify-between w-full max-w-md bg-slate-700 rounded-lg p-4 shadow-lg">
        {Object.entries(playerScores).map(([id, score], index) => (
          <div 
            key={id} 
            className={`flex items-center gap-2 ${id === playerId ? 'text-blue-400 font-bold' : 'text-yellow-400'}`}
          >
            <Award size={18} />
            <div>
              <div className="text-xs opacity-70">
                {id === playerId ? 'You' : 'Opponent'}
              </div>
              <div className="text-lg">{score}</div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-slate-700 p-4 rounded-lg shadow-lg">
        <div 
          className="grid gap-1"
          style={{ 
            gridTemplateColumns: `repeat(${board[0]?.length || 0}, minmax(0, 1fr))` 
          }}
        >
          {board.map((row, rowIndex) => 
            row.map((cell, colIndex) => (
              <Cell 
                key={`${rowIndex}-${colIndex}`} 
                cell={cell} 
                onClick={() => handleCellClick(rowIndex, colIndex)}
                isCurrentPlayer={cell.revealedBy === playerId}
              />
            ))
          )}
        </div>
      </div>
      
      {gameStatus === GAME_STATUS.GAME_OVER && (
        <div className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-md shadow-md animate-bounce">
          <BombIcon size={18} />
          <span>Game Over! Someone hit a mine!</span>
        </div>
      )}
      
      {gameStatus === GAME_STATUS.WIN && (
        <div className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-md shadow-md animate-bounce">
          <Award size={18} />
          <span>Game Won! All safe cells revealed!</span>
        </div>
      )}
    </div>
  );
};

export default Board;