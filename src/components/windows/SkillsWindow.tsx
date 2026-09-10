'use client';

import React from 'react';
import { WindowFrame } from '@/components/os/WindowFrame';
import { TECH_STACK, SKILL_METERS, CAPABILITY_FOCUS } from '@/data/skillsData';
import {
  Cpu,
  Code2,
  Database,
  Network,
  Server,
  GitBranch,
  Palette,
  Terminal,
} from 'lucide-react';

interface SkillsWindowProps {
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onFocus: () => void;
}

export function SkillsWindow({
  isOpen,
  isMinimized,
  isMaximized,
  zIndex,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
}: SkillsWindowProps) {
  const getTechIcon = (name: string) => {
    switch (name) {
      case 'PHP':
        return <Code2 size={26} className="text-indigo-600 mb-1" />;
      case 'JavaScript':
        return <Terminal size={26} className="text-yellow-600 mb-1" />;
      case 'Python':
        return <Code2 size={26} className="text-blue-600 mb-1" />;
      case 'SQL & MySQL':
        return <Database size={26} className="text-green-600 mb-1" />;
      case 'Networking':
        return <Network size={26} className="text-[#3d5a80] mb-1" />;
      case 'Server Admin':
        return <Server size={26} className="text-[#e07a5f] mb-1" />;
      case 'Git & Automation':
        return <GitBranch size={26} className="text-[#90be6d] mb-1" />;
      case 'UI / Graphics':
        return <Palette size={26} className="text-[#f4a261] mb-1" />;
      default:
        return <Cpu size={26} className="text-gray-700 mb-1" />;
    }
  };

  return (
    <WindowFrame
      id="skills-window"
      title="Skills & System Diagnostics"
      icon={<Cpu size={14} />}
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
        {/* Tech Stack Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          {TECH_STACK.map((tech) => (
            <div
              key={tech.name}
              className="retro-window p-3 bg-white border-2 border-[#1e1e1e] flex flex-col items-center justify-center shadow-[2px_2px_0px_#1e1e1e] hover:translate-y-[-1px] transition-transform"
            >
              {getTechIcon(tech.name)}
              <span className="text-xs font-bold font-mono block text-[#1e1e1e]">
                {tech.name}
              </span>
              <span className="text-[9px] font-mono text-gray-500">
                {tech.category}
              </span>
            </div>
          ))}
        </div>

        {/* Skill Levels Meters */}
        <div className="retro-window p-4 bg-white border-2 border-[#1e1e1e] shadow-[2px_2px_0px_#1e1e1e]">
          <div className="retro-titlebar yellow mb-4 text-xs font-mono flex items-center justify-between">
            <span>Skill Levels</span>
            <span>0 - 100%</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-[11px] font-bold font-mono">
            {SKILL_METERS.map((skill) => (
              <label key={skill.label} className="block">
                <div className="flex justify-between mb-1">
                  <span>{skill.label}</span>
                  <span className="text-[#3d5a80]">{skill.percentage}%</span>
                </div>
                <meter
                  className="skill-meter block w-full"
                  min="0"
                  max="100"
                  value={skill.percentage}
                >
                  {skill.percentage}%
                </meter>
              </label>
            ))}
          </div>
        </div>

        {/* Capability Graph */}
        <div className="retro-window p-4 bg-white border-2 border-[#1e1e1e] shadow-[2px_2px_0px_#1e1e1e]">
          <div className="retro-titlebar blue mb-4 text-xs font-mono flex items-center justify-between">
            <span>Capability Graph</span>
            <span>Relative Focus</span>
          </div>
          <div className="space-y-3 text-[11px] font-bold font-mono">
            {CAPABILITY_FOCUS.map((item) => (
              <div key={item.label}>
                <div className="flex justify-between mb-1">
                  <span>{item.label}</span>
                  <span>{item.percentage}%</span>
                </div>
                <div className="skill-bar">
                  <span
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: item.color || '#e07a5f',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Graphics Toolkit */}
        <div className="retro-window p-4 bg-[#e9e0d0] border-2 border-[#1e1e1e] shadow-[2px_2px_0px_#1e1e1e]">
          <p className="text-xs font-bold font-mono mb-1.5 text-[#1e1e1e]">
            Creative & Graphics Toolkit
          </p>
          <p className="text-[11px] text-gray-800 leading-relaxed font-mono">
            Photoshop, Illustrator, Canva, Affinity Designer, and CapCut for visual
            design, brand assets, layouts, photo editing, and short-form creative
            content.
          </p>
        </div>
      </div>
    </WindowFrame>
  );
}
