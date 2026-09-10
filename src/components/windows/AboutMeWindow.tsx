'use client';

import React from 'react';
import { WindowFrame } from '@/components/os/WindowFrame';
import { User } from 'lucide-react';

interface AboutMeWindowProps {
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onFocus: () => void;
}

export function AboutMeWindow({
  isOpen,
  isMinimized,
  isMaximized,
  zIndex,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
}: AboutMeWindowProps) {
  return (
    <WindowFrame
      id="about-me-window"
      title="About Joseph Amandy"
      icon={<User size={14} />}
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
      <div className="p-4 md:p-6 bg-[#f4eee2]">
        <div className="retro-window p-4 md:p-6 bg-white border-2 border-[#1e1e1e] shadow-[4px_4px_0px_#1e1e1e]">
          <div className="retro-titlebar blue mb-4 text-xs">
            <span className="text-xl md:text-2xl font-mono font-bold">About Me</span>
          </div>
          <div className="about-copy space-y-4 text-sm md:text-base leading-relaxed text-gray-800">
            <p>
              <span className="text-[#e07a5f] font-bold">Joseph Amandy</span> is a
              dedicated IT professional, software developer, and lifelong creator whose
              journey is defined by a blend of technical curiosity, creative pursuits, and
              continuous personal growth. Graduating with an IT degree from ICCT, Joseph
              built a robust academic foundation that propelled him directly into the world of
              full-stack software development, system scripting, and database integration. Over
              the years, he has mastered a versatile technical toolkit spanning JavaScript, PHP,
              SQL, Python, and Google Apps Script, allowing him to independently design, deploy,
              and optimize dynamic web solutions, secure CRUD workflows, and automated systems
              from scratch.
            </p>
            <p>
              Beyond his formal education and core programming work, Joseph&apos;s life is
              marked by steady, purposeful milestones and diverse experiences. He has spent
              considerable time refining his craft through hands-on development projects,
              ranging from interactive API-driven web applications to robust digital portals,
              always focusing on translating complex operational challenges into smooth,
              user-friendly experiences. His discipline as a developer is matched by a strong
              drive for professional readiness, which has included rigorous preparation for
              major milestones like the Philippine Civil Service Examination, alongside
              navigating the transition into the professional tech industry.
            </p>
            <p>
              When he steps away from the screen, Joseph maintains a balanced and grounded
              lifestyle rooted in exploration and creativity. He is an avid outdoor enthusiast
              who finds clarity and challenge in hiking, regularly seeking out nature.
              Complementing his technical mind is a deep appreciation for the visual arts,
              expressed through his passion for street and wildlife photography, where he
              captures compelling perspectives of the world around him.
            </p>
            <p>
              Whether he is architecting code, managing version control via Git, or framing a
              shot in the wild, Joseph brings a thoughtful, analytical, and imaginative approach
              to everything he pursues. Continuously evolving as both a technologist and an
              individual, he is driven by a constant desire to learn, build, and make a
              meaningful impact through his work.
            </p>
          </div>
        </div>
      </div>
    </WindowFrame>
  );
}
