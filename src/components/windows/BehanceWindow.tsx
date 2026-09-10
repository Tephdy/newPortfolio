'use client';

import React from 'react';
import { WindowFrame } from '@/components/os/WindowFrame';
import { BEHANCE_PROJECTS } from '@/data/behanceProjects';
import { Palette, ExternalLink } from 'lucide-react';

interface BehanceWindowProps {
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onFocus: () => void;
}

export function BehanceWindow({
  isOpen,
  isMinimized,
  isMaximized,
  zIndex,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
}: BehanceWindowProps) {
  return (
    <WindowFrame
      id="behance-window"
      title="Behance.art - Joseph Amandy Gallery"
      icon={<Palette size={14} />}
      color="blue"
      isOpen={isOpen}
      isMinimized={isMinimized}
      isMaximized={isMaximized}
      zIndex={zIndex}
      onClose={onClose}
      onMinimize={onMinimize}
      onMaximize={onMaximize}
      onFocus={onFocus}
    >
      <div className="p-4 md:p-6 bg-[#f4eee2] space-y-4">
        <div className="retro-window p-4 bg-white border-2 border-[#1e1e1e] shadow-[4px_4px_0px_#1e1e1e]">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="font-bold text-sm font-mono text-[#1e1e1e]">
                Joseph Amandy - Behance Portfolio
              </h2>
              <p className="text-[11px] text-gray-600 font-mono mt-0.5">
                Browse visual design, branding, photography, and creative work.
              </p>
            </div>
            <a
              href="https://www.behance.net/sephamandy"
              target="_blank"
              rel="noopener noreferrer"
              className="retro-btn px-3 py-1.5 text-xs font-mono bg-[#1769ff] text-white flex items-center space-x-1.5"
            >
              <span>Open Behance</span>
              <ExternalLink size={12} />
            </a>
          </div>

          <div className="behance-gallery">
            {BEHANCE_PROJECTS.map((project) => (
              <a
                key={project.title}
                href={project.projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="behance-project retro-window bg-white border-2 border-[#1e1e1e] group block"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  loading="lazy"
                  className="w-full aspect-[4/3] object-cover border-b-2 border-[#1e1e1e] group-hover:opacity-95 transition-opacity"
                />
                <span className="block p-2.5 text-xs font-bold font-mono text-[#1e1e1e] truncate group-hover:text-[#e07a5f]">
                  {project.title}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </WindowFrame>
  );
}
