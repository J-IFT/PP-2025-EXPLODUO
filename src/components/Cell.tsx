import React, { useMemo } from 'react';
import classNames from 'classnames';
import { BombIcon, FlagIcon } from 'lucide-react';

interface CellProps {
  cell: {
    isMine: boolean;
    isRevealed: boolean;
    isFlagged: boolean;
    neighborMineCount: number;
    revealedBy: string | null;
  };
  onClick: () => void;
  isCurrentPlayer: boolean;
}

const Cell = ({ cell, onClick, isCurrentPlayer }: CellProps) => {
  const { isMine, isRevealed, isFlagged, neighborMineCount } = cell;

  const cellColor = useMemo(() => {
    if (!isRevealed) return 'bg-slate-600 hover:bg-slate-500';
    
    if (isMine) return 'bg-red-500';
    
    if (isCurrentPlayer) {
      return 'bg-blue-100 text-blue-900';
    }
    
    return 'bg-yellow-100 text-yellow-900';
  }, [isRevealed, isMine, isCurrentPlayer]);

  const numberColor = useMemo(() => {
    const colors = [
      'text-transparent', // 0
      'text-blue-600',    // 1
      'text-green-600',   // 2
      'text-red-600',     // 3
      'text-purple-600',  // 4
      'text-yellow-600',  // 5
      'text-pink-600',    // 6
      'text-orange-600',  // 7
      'text-violet-600',  // 8
    ];
    return colors[neighborMineCount] || colors[0];
  }, [neighborMineCount]);
  
  return (
    <button 
      onClick={onClick}
      disabled={isRevealed || isFlagged}
      className={classNames(
        'w-8 h-8 flex items-center justify-center rounded transition-all duration-200',
        'shadow-sm text-sm font-bold',
        cellColor,
        {
          'cursor-pointer': !isRevealed && !isFlagged,
          'cursor-default': isRevealed || isFlagged,
          'animate-reveal': isRevealed
        }
      )}
    >
      {isRevealed && isMine && <BombIcon size={16} className="text-black" />}
      {isRevealed && !isMine && neighborMineCount > 0 && (
        <span className={classNames('font-bold', numberColor)}>
          {neighborMineCount}
        </span>
      )}
      {isFlagged && <FlagIcon size={16} className="text-red-400" />}
    </button>
  );
};

export default Cell;