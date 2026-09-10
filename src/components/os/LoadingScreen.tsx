'use client';

import React, { useState, useEffect } from 'react';

interface LoadingScreenProps {
  onComplete?: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [greeting] = useState(() => {
    const hours = new Date().getHours();
    if (hours < 12) return 'GOOD MORNING!';
    if (hours < 18) return 'GOOD AFTERNOON!';
    return 'GOOD EVENING!';
  });
  const [statusText, setStatusText] = useState('Loading Joseph Amandy OS v1.0...');
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 25;
        if (next === 50) setStatusText('Loading system modules & fonts...');
        if (next === 75) setStatusText('Mounting virtual drives & GUI...');
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsDismissed(true);
            onComplete?.();
          }, 500);
          return 100;
        }
        return next;
      });
    }, 450);

    return () => clearInterval(interval);
  }, [onComplete]);

  const handleDismiss = () => {
    setIsDismissed(true);
    onComplete?.();
  };

  if (isDismissed) return null;

  return (
    <div
      id="loading-screen"
      className="fixed inset-0 bg-[#7d7775] z-[9999] flex items-center justify-center transition-opacity duration-500 p-4"
    >
      <div className="retro-window w-full max-w-sm p-6 shadow-2xl">
        <div className="retro-titlebar blue mb-4">
          <span className="text-xs font-mono font-bold">System Initialization</span>
          <div className="window-controls">
            <button type="button">_</button>
            <button type="button">□</button>
            <button type="button" onClick={handleDismiss}>×</button>
          </div>
        </div>

        <div className="text-center">
          <div
            id="greeting-header"
            className="text-3xl font-bold mb-2 font-mono tracking-wider text-[#1e1e1e]"
          >
            {greeting}
          </div>
          <p
            id="loading-status"
            className="text-xs mb-6 text-gray-700 font-mono"
          >
            {statusText}
          </p>

          {/* Progress Bar */}
          <div className="w-full bg-white border-2 border-[#1e1e1e] p-1 h-6 mb-4 shadow-[inset_2px_2px_0px_rgba(0,0,0,0.1)]">
            <div
              id="loading-progress"
              className="h-full bg-[#f4a261] border border-[#1e1e1e] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <button
            type="button"
            onClick={handleDismiss}
            className="retro-btn px-4 py-1.5 text-xs font-mono hover:bg-[#e9e0d0]"
          >
            Skip / Enter
          </button>
        </div>
      </div>
    </div>
  );
}
