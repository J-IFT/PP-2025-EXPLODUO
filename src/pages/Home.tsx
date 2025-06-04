import React from 'react';
import CreateGame from '../components/CreateGame';
import JoinGame from '../components/JoinGame';
import { BombIcon } from 'lucide-react';

const Home = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-3 flex items-center justify-center gap-3">
          <BombIcon size={32} />
          Démineur Multijoueur
        </h1>
        <p className="text-slate-400 max-w-xl mx-auto">
          Jouez au célèbre jeu du Démineur avec un ami. Révélez les cases sûres pour gagner des points, 
          mais attention à ne pas toucher les mines !
        </p>
      </header>
      
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <CreateGame />
        <JoinGame />
      </div>
      
      <div className="mt-12 bg-slate-800 rounded-lg p-6 max-w-4xl mx-auto">
        <h2 className="text-xl font-bold text-white mb-4">Comment Jouer</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-slate-700 p-4 rounded-md">
            <h3 className="text-lg font-medium text-white mb-2">Règles du Jeu</h3>
            <ul className="text-slate-300 text-sm space-y-2">
              <li>• Les deux joueurs partagent la même grille</li>
              <li>• Cliquez pour révéler les cases</li>
              <li>• Chaque case sûre révélée rapporte 1 point</li>
              <li>• Si quelqu'un touche une mine, la partie se termine pour les deux joueurs</li>
              <li>• Les chiffres indiquent le nombre de mines adjacentes</li>
            </ul>
          </div>
          <div className="bg-slate-700 p-4 rounded-md">
            <h3 className="text-lg font-medium text-white mb-2">Conseils</h3>
            <ul className="text-slate-300 text-sm space-y-2">
              <li>• Commencez par les coins ou le centre du plateau</li>
              <li>• Utilisez les chiffres comme indices pour identifier les cases sûres</li>
              <li>• Vos cases sont en bleu, celles de l'adversaire en jaune</li>
              <li>• Partagez le lien du jeu avec un ami pour jouer ensemble</li>
              <li>• Coordonnez-vous avec votre coéquipier pour la meilleure stratégie</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;