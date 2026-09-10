'use client';

import React, { useEffect, useRef } from 'react';
import { WindowId } from '@/types/os';
import {
  Globe,
  Folder,
  Cpu,
  Mail,
  User,
  Gamepad2,
  Palette,
} from 'lucide-react';

interface StartMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenWindow: (id: WindowId) => void;
}

export function StartMenu({ isOpen, onClose, onOpenWindow }: StartMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        !target.closest('.mobile-start')
      ) {
        onClose();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('pointerdown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const menuItems: { id: WindowId; label: string; icon: React.ReactNode }[] = [
    { id: 'about-window', label: 'Home / Browser', icon: <Globe size={16} /> },
    { id: 'projects-window', label: 'Projects Folder', icon: <Folder size={16} /> },
    { id: 'skills-window', label: 'Tech Stack & Diagnostics', icon: <Cpu size={16} /> },
    { id: 'contact-window', label: 'Contact Form', icon: <Mail size={16} /> },
    { id: 'about-me-window', label: 'About Joseph Amandy', icon: <User size={16} /> },
    { id: 'games-window', label: 'Arcade Games', icon: <Gamepad2 size={16} /> },
    { id: 'behance-window', label: 'Behance Gallery', icon: <Palette size={16} /> },
  ];

  return (
    <div
      ref={menuRef}
      id="start-menu"
      className="fixed bottom-12 left-4 w-64 retro-window bg-[#f4eee2] border-3 border-[#1e1e1e] shadow-2xl z-50 p-2 space-y-1"
    >
      <div className="bg-[#3d5a80] text-white p-2.5 font-bold text-xs mb-2 flex items-center justify-between border border-[#1e1e1e]">
        <span>Joseph Amandy OS v1.0</span>
        <span className="text-[10px] bg-white text-[#1e1e1e] px-1 py-0.2">95/98</span>
      </div>

      {menuItems.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => {
            onOpenWindow(item.id);
            onClose();
          }}
          className="w-full text-left px-3 py-2 hover:bg-[#e07a5f] hover:text-black text-xs font-bold font-mono flex items-center space-x-2 transition-colors border border-transparent hover:border-[#1e1e1e]"
        >
          <span className="flex-shrink-0">{item.icon}</span>
          <span className="truncate">{item.label}</span>
        </button>
      ))}
    </div>
  );
}
