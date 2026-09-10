'use client';

import React, { useState, useEffect } from 'react';
import { WindowFrame } from '@/components/os/WindowFrame';
import { WindowId } from '@/types/os';
import {
  Globe,
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Lock,
  FolderOpen,
  Code,
  Send,
  Play,
  Pause,
  Heart,
} from 'lucide-react';

interface AboutWindowProps {
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onFocus: () => void;
  onNavigateTo: (id: WindowId) => void;
}

export function AboutWindow({
  isOpen,
  isMinimized,
  isMaximized,
  zIndex,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  onNavigateTo,
}: AboutWindowProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(35);
  const [isLiked, setIsLiked] = useState(true);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setAudioProgress((prev) => (prev >= 100 ? 0 : prev + 1.5));
    }, 400);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const toolbar = (
    <div className="bg-[#e9e0d0] border-b-2 border-[#1e1e1e] p-2 flex items-center space-x-2 text-xs font-mono select-none">
      <button
        type="button"
        className="retro-btn px-2 py-0.5"
        title="Back"
        onClick={() => { }}
      >
        <ArrowLeft size={12} />
      </button>
      <button
        type="button"
        className="retro-btn px-2 py-0.5"
        title="Forward"
        onClick={() => { }}
      >
        <ArrowRight size={12} />
      </button>
      <button
        type="button"
        className="retro-btn px-2 py-0.5"
        title="Refresh"
        onClick={() => { }}
      >
        <RotateCw size={12} />
      </button>
      <div className="flex-1 bg-white border-2 border-[#1e1e1e] px-3 py-1 flex items-center space-x-2 shadow-[inset_2px_2px_0px_rgba(0,0,0,0.1)] min-w-0">
        <Lock size={12} className="text-green-600 flex-shrink-0" />
        <span className="text-gray-600 truncate text-[11px]">
          https://joseph-amandy.dev/os/home
        </span>
      </div>
      <button type="button" className="retro-btn px-3 py-1 bg-[#f4a261] text-xs">
        Go
      </button>
    </div>
  );

  return (
    <WindowFrame
      id="about-window"
      title="Internet Explorer - Joseph Amandy Portfolio"
      icon={<Globe size={14} />}
      color="blue"
      isOpen={isOpen}
      isMinimized={isMinimized}
      isMaximized={isMaximized}
      zIndex={zIndex}
      onClose={onClose}
      onMinimize={onMinimize}
      onMaximize={onMaximize}
      onFocus={onFocus}
      toolbar={toolbar}
    >
      <div className="p-4 md:p-6 space-y-6">
        {/* Hero Header Box */}
        <div className="retro-window p-4 md:p-5 bg-white border-2 border-[#1e1e1e] shadow-[4px_4px_0px_#1e1e1e]">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-[#3d5a80] border-2 border-[#1e1e1e] flex items-center justify-center text-white text-xl md:text-2xl font-bold font-mono shadow-[2px_2px_0px_#1e1e1e] flex-shrink-0">
              JA
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-black uppercase tracking-wide text-[#1e1e1e] font-mono">
                Joseph Amandy
              </h1>
              <p className="text-xs text-gray-700 mt-1 leading-relaxed">
                Full-Stack Software Developer & UI Designer specializing in Web Systems,
                Automations, and Retro UI/UX.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Launch Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div
            className="retro-window p-4 bg-[#e9c46a] border-2 border-[#1e1e1e] shadow-[3px_3px_0px_#1e1e1e] cursor-pointer hover:translate-y-[-2px] transition-transform"
            onClick={() => onNavigateTo('projects-window')}
          >
            <div className="flex justify-between items-center mb-2">
              <FolderOpen size={22} className="text-[#1e1e1e]" />
              <span className="text-xs font-bold font-mono bg-white px-1 border border-[#1e1e1e]">
                repos
              </span>
            </div>
            <h3 className="font-bold text-sm font-mono text-[#1e1e1e]">Software Projects</h3>
            <p className="text-[11px] text-gray-800 mt-1">
              View live GitHub repositories & apps.
            </p>
          </div>

          <div
            className="retro-window p-4 bg-[#e07a5f] text-white border-2 border-[#1e1e1e] shadow-[3px_3px_0px_#1e1e1e] cursor-pointer hover:translate-y-[-2px] transition-transform"
            onClick={() => onNavigateTo('skills-window')}
          >
            <div className="flex justify-between items-center mb-2">
              <Code size={22} className="text-[#1e1e1e]" />
              <span className="text-xs font-bold font-mono bg-white text-[#1e1e1e] px-1 border border-[#1e1e1e]">
                Stack
              </span>
            </div>
            <h3 className="font-bold text-sm font-mono text-[#1e1e1e]">Tech Stack</h3>
            <p className="text-[11px] text-gray-800 mt-1">
              PHP, JS, Python, SQL, Apps Script.
            </p>
          </div>

          <div
            className="retro-window p-4 bg-[#3d5a80] text-white border-2 border-[#1e1e1e] shadow-[3px_3px_0px_#1e1e1e] cursor-pointer hover:translate-y-[-2px] transition-transform"
            onClick={() => onNavigateTo('contact-window')}
          >
            <div className="flex justify-between items-center mb-2">
              <Send size={22} className="text-[#1e1e1e]" />
              <span className="text-xs font-bold font-mono bg-white text-[#1e1e1e] px-1 border border-[#1e1e1e]">
                Message
              </span>
            </div>
            <h3 className="font-bold text-sm font-mono text-[#1e1e1e]">Contact Me</h3>
            <p className="text-[11px] text-gray-800 mt-1">
              Send an inquiry or hire.
            </p>
          </div>
        </div>

        {/* Music Player Widget */}
        <div className="retro-window p-4 border-2 border-[#1e1e1e] bg-[#f4eee2]">
          <div className="retro-titlebar yellow mb-3 text-xs flex items-center justify-between">
            <span className="font-mono truncate">Artist - Lofi Code Stream...</span>
            <div className="window-controls">
              <button type="button">_</button>
              <button type="button">×</button>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="retro-btn w-10 h-10 flex items-center justify-center text-sm flex-shrink-0"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </button>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between text-[11px] font-bold font-mono mb-1">
                <span className="truncate">Track 01: FullStack_Beats.mp3</span>
                <button
                  type="button"
                  onClick={() => setIsLiked(!isLiked)}
                  className="focus:outline-none flex-shrink-0 ml-2"
                >
                  <Heart
                    size={14}
                    className={
                      isLiked
                        ? 'text-red-600 fill-red-600'
                        : 'text-gray-400'
                    }
                  />
                </button>
              </div>
              <div className="w-full bg-white border border-[#1e1e1e] h-3 relative overflow-hidden">
                <div
                  className="h-full bg-[#e07a5f] transition-all duration-300"
                  style={{ width: `${audioProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </WindowFrame>
  );
}
