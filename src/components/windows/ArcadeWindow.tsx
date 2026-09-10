'use client';

import React, { useState } from 'react';
import { WindowFrame } from '@/components/os/WindowFrame';
import { Gamepad2, RotateCcw } from 'lucide-react';

interface ArcadeWindowProps {
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onFocus: () => void;
}

const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function checkBoardWinner(currentBoard: string[]) {
  for (const [a, b, c] of WINNING_COMBINATIONS) {
    if (
      currentBoard[a] &&
      currentBoard[a] === currentBoard[b] &&
      currentBoard[a] === currentBoard[c]
    ) {
      return currentBoard[a];
    }
  }
  return currentBoard.every(Boolean) ? 'draw' : null;
}

function calculateCpuMove(currentBoard: string[]): number {
  const available = currentBoard
    .map((val, idx) => (val ? null : idx))
    .filter((idx): idx is number => idx !== null);

  if (available.length === 0) return -1;

  // 1. Check if CPU can win in 1 move
  for (const idx of available) {
    const copy = [...currentBoard];
    copy[idx] = 'O';
    if (checkBoardWinner(copy) === 'O') {
      return idx;
    }
  }

  // 2. Check if CPU must block Player
  for (const idx of available) {
    const copy = [...currentBoard];
    copy[idx] = 'X';
    if (checkBoardWinner(copy) === 'X') {
      return idx;
    }
  }

  // 3. Fallback to random available move
  return available[Math.floor(Math.random() * available.length)];
}

export function ArcadeWindow({
  isOpen,
  isMinimized,
  isMaximized,
  zIndex,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
}: ArcadeWindowProps) {
  const [board, setBoard] = useState<string[]>(Array(9).fill(''));
  const [status, setStatus] = useState<string>('Your turn - X');
  const [active, setActive] = useState<boolean>(true);
  const [playerScore, setPlayerScore] = useState<number>(0);
  const [cpuScore, setCpuScore] = useState<number>(0);
  const [drawScore, setDrawScore] = useState<number>(0);

  const finishGame = (winner: string) => {
    setActive(false);
    if (winner === 'X') {
      setPlayerScore((prev) => prev + 1);
      setStatus('You win! Excellent match!');
    } else if (winner === 'O') {
      setCpuScore((prev) => prev + 1);
      setStatus('CPU wins! Try again!');
    } else {
      setDrawScore((prev) => prev + 1);
      setStatus('Draw game! Well defended!');
    }
  };

  const handleCellClick = (index: number) => {
    if (!active || board[index]) return;

    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);

    const winner = checkBoardWinner(newBoard);
    if (winner) {
      finishGame(winner);
      return;
    }

    setStatus('CPU thinking...');
    setActive(false);

    setTimeout(() => {
      const chosenMove = calculateCpuMove(newBoard);
      if (chosenMove === -1) return;

      const nextBoard = [...newBoard];
      nextBoard[chosenMove] = 'O';
      setBoard(nextBoard);

      const nextWinner = checkBoardWinner(nextBoard);
      if (nextWinner) {
        finishGame(nextWinner);
      } else {
        setStatus('Your turn - X');
        setActive(true);
      }
    }, 350);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(''));
    setActive(true);
    setStatus('Your turn - X');
  };

  return (
    <WindowFrame
      id="games-window"
      title="Arcade.exe - Pixel Games"
      icon={<Gamepad2 size={14} />}
      color="yellow"
      isOpen={isOpen}
      isMinimized={isMinimized}
      isMaximized={isMaximized}
      zIndex={zIndex}
      onClose={onClose}
      onMinimize={onMinimize}
      onMaximize={onMaximize}
      onFocus={onFocus}
    >
      <div className="p-4 md:p-6 bg-[#f4eee2]">
        <div className="retro-window p-5 bg-white border-2 border-[#1e1e1e] shadow-[4px_4px_0px_#1e1e1e] max-w-sm mx-auto">
          <div className="retro-titlebar blue mb-4 text-xs font-mono">
            <span>Tic-Tac-Toe // Player vs CPU</span>
          </div>

          <div className="flex flex-wrap justify-between items-center gap-2 mb-4 text-xs font-bold font-mono">
            <span className="text-[#1e1e1e]">{status}</span>
            <span className="bg-[#f4eee2] px-2 py-0.5 border border-[#1e1e1e] shadow-[1px_1px_0px_#1e1e1e]">
              X: <b>{playerScore}</b> | CPU: <b>{cpuScore}</b> | D: <b>{drawScore}</b>
            </span>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-3 gap-2.5 max-w-xs mx-auto mb-5">
            {board.map((cell, idx) => (
              <button
                key={idx}
                type="button"
                disabled={!active || Boolean(cell)}
                onClick={() => handleCellClick(idx)}
                className={`retro-btn aspect-square text-3xl font-black font-mono flex items-center justify-center select-none ${
                  cell === 'X'
                    ? 'text-[#e07a5f]'
                    : cell === 'O'
                    ? 'text-[#3d5a80]'
                    : 'text-transparent'
                }`}
                aria-label={`Cell ${idx + 1}`}
              >
                {cell || '.'}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={resetGame}
            className="retro-btn px-4 py-1.5 text-xs font-mono font-bold flex items-center space-x-1.5 mx-auto bg-[#f4a261]"
          >
            <RotateCcw size={12} />
            <span>New Round</span>
          </button>
        </div>
      </div>
    </WindowFrame>
  );
}
