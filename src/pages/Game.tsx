import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSupabase } from '../contexts/SupabaseContext';
import Board from '../components/Board';
import ShareGame from '../components/ShareGame';
import { BombIcon, HomeIcon } from 'lucide-react';

const Game = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const { supabase } = useSupabase();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [gameExists, setGameExists] = useState(false);

  useEffect(() => {
    const checkGame = async () => {
      if (!gameId) return;
      
      try {
        const { data, error } = await supabase
          .from('games')
          .select('id')
          .eq('id', gameId)
          .single();
          
        if (error || !data) {
          setGameExists(false);
        } else {
          setGameExists(true);
        }
      } catch (error) {
        console.error('Error checking game:', error);
        setGameExists(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkGame();
  }, [gameId, supabase]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!gameExists || !gameId) {
    return (
      <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-screen">
        <div className="bg-red-500 text-white p-6 rounded-lg shadow-lg max-w-md w-full mb-6 flex items-center">
          <BombIcon size={24} className="mr-3" />
          <div>
            <h2 className="text-xl font-bold mb-2">Partie Non Trouvée</h2>
            <p>La partie que vous recherchez n'existe pas ou a été supprimée.</p>
          </div>
        </div>
        
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-all"
        >
          <HomeIcon size={18} />
          Retour à l'Accueil
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col items-center">
      <header className="w-full max-w-md flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <BombIcon size={24} />
          Démineur Multijoueur
        </h1>
        
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1 text-white bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded-md text-sm transition-all"
        >
          <HomeIcon size={16} />
          Accueil
        </button>
      </header>
      
      <div className="mb-6">
        <ShareGame gameId={gameId} />
      </div>
      
      <Board gameId={gameId} />
    </div>
  );
};

export default Game;