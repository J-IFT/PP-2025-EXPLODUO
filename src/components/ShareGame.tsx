import React, { useState } from 'react';
import { ShareIcon, CheckIcon } from 'lucide-react';

interface ShareGameProps {
  gameId: string;
}

const ShareGame = ({ gameId }: ShareGameProps) => {
  const [copied, setCopied] = useState(false);
  
  const gameUrl = `${window.location.origin}/game/${gameId}`;
  
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(gameUrl);
      setCopied(true);
      
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };
  
  return (
    <div className="w-full max-w-md">
      <div className="flex items-center gap-2 mb-2">
        <ShareIcon size={16} className="text-slate-300" />
        <span className="text-sm font-medium text-slate-300">Partagez cette partie avec un ami</span>
      </div>
      
      <div className="flex">
        <div className="flex-1 bg-slate-800 border border-r-0 border-slate-600 rounded-l-md px-3 py-2 text-slate-300 truncate">
          {gameUrl}
        </div>
        <button
          onClick={handleCopyLink}
          className={`px-4 py-2 rounded-r-md font-medium flex items-center justify-center transition-all ${
            copied 
              ? 'bg-green-500 text-white' 
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          {copied ? <CheckIcon size={18} /> : 'Copier'}
        </button>
      </div>
      
      <div className="mt-2 text-xs text-slate-400">
        ID de la partie : <span className="font-mono">{gameId}</span>
      </div>
    </div>
  );
};

export default ShareGame;