import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabase } from '../contexts/SupabaseContext';
import { UsersIcon } from 'lucide-react';

const JoinGame = () => {
  const [gameId, setGameId] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState('');
  const { supabase } = useSupabase();
  const navigate = useNavigate();

  const handleJoinGame = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!gameId.trim()) {
      setError('Veuillez entrer un ID de partie');
      return;
    }
    
    try {
      setIsJoining(true);
      setError('');
      
      const { data, error } = await supabase
        .from('games')
        .select('id, game_status')
        .eq('id', gameId)
        .single();
        
      if (error) {
        setError('Partie non trouvée');
        return;
      }
      
      if (data.game_status === 'game_over') {
        setError('Cette partie est déjà terminée');
        return;
      }
      
      navigate(`/game/${gameId}`);
    } catch (error) {
      console.error('Error joining game:', error);
      setError('Impossible de rejoindre la partie');
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="bg-slate-700 p-6 rounded-lg shadow-lg w-full max-w-md">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <UsersIcon size={20} />
        Rejoindre une Partie
      </h2>
      
      <form onSubmit={handleJoinGame}>
        <div className="mb-4">
          <label htmlFor="gameId" className="block text-sm font-medium text-slate-300 mb-2">
            ID de la Partie
          </label>
          <input
            type="text"
            id="gameId"
            value={gameId}
            onChange={(e) => setGameId(e.target.value)}
            placeholder="Entrez l'ID de la partie"
            className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-md 
                      text-white placeholder-slate-400 focus:outline-none focus:ring-2 
                      focus:ring-blue-500 focus:border-transparent"
          />
          {error && <p className="mt-2 text-red-400 text-sm">{error}</p>}
        </div>
        
        <button
          type="submit"
          disabled={isJoining || !gameId.trim()}
          className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-md 
                    font-medium shadow-md hover:from-green-600 hover:to-green-700 transition-all
                    disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isJoining ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
              Connexion...
            </span>
          ) : (
            'Rejoindre la Partie'
          )}
        </button>
      </form>
    </div>
  );
};

export default JoinGame;