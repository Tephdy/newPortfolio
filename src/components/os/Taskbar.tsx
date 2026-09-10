'use client';

import React, { useState, useEffect } from 'react';
import { WindowId, WindowState } from '@/types/os';
import {
  Menu,
  Clock,
  Home,
  Folder,
  Cpu,
  Mail,
  User,
  Gamepad2,
  Palette,
} from 'lucide-react';

interface TaskbarProps {
  windows: Record<WindowId, WindowState>;
  activeWindowId: WindowId | null;
  onOpenWindow: (id: WindowId) => void;
  onToggleMinimize: (id: WindowId) => void;
  onToggleStartMenu: () => void;
  isStartMenuOpen: boolean;
}

export function Taskbar({
  windows,
  activeWindowId,
  onOpenWindow,
  onToggleMinimize,
  onToggleStartMenu,
  isStartMenuOpen,
}: TaskbarProps) {
  const [timeString, setTimeString] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      setTimeString(`${hours}:${minutes} ${ampm}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const navItems: { id: WindowId; label: string; icon: React.ReactNode }[] = [
    { id: 'about-window', label: 'Home', icon: <Home size={14} /> },
    { id: 'projects-window', label: 'Projects', icon: <Folder size={14} /> },
    { id: 'skills-window', label: 'Skills', icon: <Cpu size={14} /> },
    { id: 'contact-window', label: 'Contact', icon: <Mail size={14} /> },
    { id: 'about-me-window', label: 'About', icon: <User size={14} /> },
    { id: 'games-window', label: 'Arcade', icon: <Gamepad2 size={14} /> },
    { id: 'behance-window', label: 'Gallery', icon: <Palette size={14} /> },
  ];

  return (
    <div className="h-12 bg-[#dcd7cd] border-t-4 border-[#1e1e1e] px-4 flex items-center justify-between z-50 mobile-nav select-none flex-shrink-0">
      <div className="mobile-nav-items flex items-center space-x-2 overflow-x-auto py-1">
        {/* Start Button */}
        <button
          type="button"
          onClick={onToggleStartMenu}
          className={`retro-btn px-4 py-1.5 bg-[#e07a5f] text-white flex items-center space-x-1.5 text-xs font-bold font-mono mobile-nav-button mobile-start ${
            isStartMenuOpen ? 'translate-x-[1px] translate-y-[1px] shadow-none' : ''
          }`}
        >
          <Menu size={14} />
          <span>Start</span>
        </button>

        {/* Desktop Taskbar / Mobile shortcuts */}
        {navItems.map((item) => {
          const winState = windows[item.id];
          const isOpen = winState?.isOpen;
          const isActive = activeWindowId === item.id && !winState?.isMinimized;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                if (isOpen) {
                  onToggleMinimize(item.id);
                } else {
                  onOpenWindow(item.id);
                }
              }}
              className={`retro-btn px-3 py-1 text-xs font-bold font-mono mobile-nav-button flex items-center space-x-1.5 ${
                isActive
                  ? 'bg-[#f4a261] border-[#1e1e1e] shadow-[inset_1px_1px_0px_rgba(0,0,0,0.2)]'
                  : 'bg-white hover:bg-[#e9e0d0]'
              }`}
              title={item.label}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              <span className="whitespace-nowrap hidden md:inline">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Clock / Tray */}
      <div className="retro-window px-3 py-1 bg-white border-2 border-[#1e1e1e] text-xs font-bold font-mono flex items-center space-x-2 mobile-clock flex-shrink-0 ml-2">
        <Clock size={12} className="text-gray-700" />
        <span id="os-clock">{timeString || '12:00 PM'}</span>
      </div>
    </div>
  );
}
