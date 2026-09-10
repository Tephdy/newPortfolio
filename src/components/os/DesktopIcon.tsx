'use client';

import React from 'react';

interface DesktopIconProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  boxColor: string;
  textColor?: string;
  onClick: () => void;
}

export function DesktopIcon({
  label,
  icon,
  boxColor,
  textColor = 'text-[#1e1e1e]',
  onClick,
}: DesktopIconProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="desktop-icon flex flex-col items-center group focus:outline-none"
    >
      <div
        className="icon-box transition-transform group-hover:scale-105"
        style={{ backgroundColor: boxColor }}
      >
        <div className={`text-xl ${textColor}`}>{icon}</div>
      </div>
      <span className="text-xs font-bold font-mono bg-[#f4eee2] px-1.5 py-0.5 border border-[#1e1e1e] shadow-[2px_2px_0px_#1e1e1e] group-hover:bg-[#e9e0d0] whitespace-nowrap">
        {label}
      </span>
    </button>
  );
}
