'use client';

import React, { useState } from 'react';
import { useWindowManager } from '@/hooks/useWindowManager';
import { WindowId, ContactStatus } from '@/types/os';
import { DesktopIcon } from '@/components/os/DesktopIcon';
import { Taskbar } from '@/components/os/Taskbar';
import { StartMenu } from '@/components/os/StartMenu';
import { LoadingScreen } from '@/components/os/LoadingScreen';
import { AboutWindow } from '@/components/windows/AboutWindow';
import { AboutMeWindow } from '@/components/windows/AboutMeWindow';
import { ProjectsWindow } from '@/components/windows/ProjectsWindow';
import { SkillsWindow } from '@/components/windows/SkillsWindow';
import { ContactWindow } from '@/components/windows/ContactWindow';
import { ArcadeWindow } from '@/components/windows/ArcadeWindow';
import { BehanceWindow } from '@/components/windows/BehanceWindow';
import { LiveViewModal } from '@/components/modals/LiveViewModal';
import { StatusModal } from '@/components/modals/StatusModal';

import {
  User,
  FolderOpen,
  Cpu,
  Mail,
  Gamepad2,
  Palette,
} from 'lucide-react';

export function Desktop() {
  const {
    windows,
    activeWindowId,
    openWindow,
    closeWindow,
    minimizeWindow,
    toggleMinimize,
    toggleMaximize,
    focusWindow,
  } = useWindowManager();

  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const [liveView, setLiveView] = useState<{
    isOpen: boolean;
    title: string;
    url: string;
  }>({
    isOpen: false,
    title: '',
    url: '',
  });

  const [contactStatus, setContactStatus] = useState<ContactStatus>({
    isOpen: false,
    isSuccess: true,
    message: '',
  });

  const handleOpenLiveView = (title: string, url: string) => {
    setLiveView({
      isOpen: true,
      title,
      url,
    });
  };

  const handleCloseLiveView = () => {
    setLiveView((prev) => ({ ...prev, isOpen: false }));
  };

  const handleContactStatus = (isSuccess: boolean, message: string) => {
    setContactStatus({
      isOpen: true,
      isSuccess,
      message,
    });
  };

  const handleCloseContactStatus = () => {
    setContactStatus((prev) => ({ ...prev, isOpen: false }));
  };

  const desktopShortcuts: {
    id: WindowId;
    label: string;
    icon: React.ReactNode;
    boxColor: string;
    textColor?: string;
  }[] = [
    {
      id: 'about-me-window',
      label: 'About.exe',
      icon: <User size={24} />,
      boxColor: '#f4a261',
      textColor: 'text-[#1e1e1e]',
    },
    {
      id: 'projects-window',
      label: 'Projects/',
      icon: <FolderOpen size={24} />,
      boxColor: '#e07a5f',
      textColor: 'text-[#1e1e1e]',
    },
    {
      id: 'skills-window',
      label: 'Skills.sys',
      icon: <Cpu size={24} />,
      boxColor: '#3d5a80',
      textColor: 'text-white',
    },
    {
      id: 'contact-window',
      label: 'Contact.msg',
      icon: <Mail size={24} />,
      boxColor: '#e9c46a',
      textColor: 'text-[#1e1e1e]',
    },
    {
      id: 'games-window',
      label: 'Arcade.exe',
      icon: <Gamepad2 size={24} />,
      boxColor: '#90be6d',
      textColor: 'text-[#1e1e1e]',
    },
    {
      id: 'behance-window',
      label: 'Behance.art',
      icon: <Palette size={24} />,
      boxColor: '#1769ff',
      textColor: 'text-white',
    },
  ];

  return (
    <div className="h-screen w-screen flex flex-col justify-between overflow-hidden bg-[#7d7775]">
      {/* Boot Loading Screen */}
      <LoadingScreen />

      {/* Desktop Workspace */}
      <main className="window-host flex-1 p-6 relative overflow-y-auto">
        {/* Desktop Icons column */}
        <div className="flex flex-col space-y-4 relative z-0 w-20">
          {desktopShortcuts.map((shortcut) => (
            <DesktopIcon
              key={shortcut.id}
              id={shortcut.id}
              label={shortcut.label}
              icon={shortcut.icon}
              boxColor={shortcut.boxColor}
              textColor={shortcut.textColor}
              onClick={() => openWindow(shortcut.id)}
            />
          ))}
        </div>

        {/* Windows */}
        <AboutWindow
          isOpen={windows['about-window'].isOpen}
          isMinimized={windows['about-window'].isMinimized}
          isMaximized={windows['about-window'].isMaximized}
          zIndex={windows['about-window'].zIndex}
          onClose={() => closeWindow('about-window')}
          onMinimize={() => minimizeWindow('about-window')}
          onMaximize={() => toggleMaximize('about-window')}
          onFocus={() => focusWindow('about-window')}
          onNavigateTo={openWindow}
        />

        <AboutMeWindow
          isOpen={windows['about-me-window'].isOpen}
          isMinimized={windows['about-me-window'].isMinimized}
          isMaximized={windows['about-me-window'].isMaximized}
          zIndex={windows['about-me-window'].zIndex}
          onClose={() => closeWindow('about-me-window')}
          onMinimize={() => minimizeWindow('about-me-window')}
          onMaximize={() => toggleMaximize('about-me-window')}
          onFocus={() => focusWindow('about-me-window')}
        />

        <ProjectsWindow
          isOpen={windows['projects-window'].isOpen}
          isMinimized={windows['projects-window'].isMinimized}
          isMaximized={windows['projects-window'].isMaximized}
          zIndex={windows['projects-window'].zIndex}
          onClose={() => closeWindow('projects-window')}
          onMinimize={() => minimizeWindow('projects-window')}
          onMaximize={() => toggleMaximize('projects-window')}
          onFocus={() => focusWindow('projects-window')}
          onOpenLiveView={handleOpenLiveView}
        />

        <SkillsWindow
          isOpen={windows['skills-window'].isOpen}
          isMinimized={windows['skills-window'].isMinimized}
          isMaximized={windows['skills-window'].isMaximized}
          zIndex={windows['skills-window'].zIndex}
          onClose={() => closeWindow('skills-window')}
          onMinimize={() => minimizeWindow('skills-window')}
          onMaximize={() => toggleMaximize('skills-window')}
          onFocus={() => focusWindow('skills-window')}
        />

        <ContactWindow
          isOpen={windows['contact-window'].isOpen}
          isMinimized={windows['contact-window'].isMinimized}
          isMaximized={windows['contact-window'].isMaximized}
          zIndex={windows['contact-window'].zIndex}
          onClose={() => closeWindow('contact-window')}
          onMinimize={() => minimizeWindow('contact-window')}
          onMaximize={() => toggleMaximize('contact-window')}
          onFocus={() => focusWindow('contact-window')}
          onStatusChange={handleContactStatus}
        />

        <ArcadeWindow
          isOpen={windows['games-window'].isOpen}
          isMinimized={windows['games-window'].isMinimized}
          isMaximized={windows['games-window'].isMaximized}
          zIndex={windows['games-window'].zIndex}
          onClose={() => closeWindow('games-window')}
          onMinimize={() => minimizeWindow('games-window')}
          onMaximize={() => toggleMaximize('games-window')}
          onFocus={() => focusWindow('games-window')}
        />

        <BehanceWindow
          isOpen={windows['behance-window'].isOpen}
          isMinimized={windows['behance-window'].isMinimized}
          isMaximized={windows['behance-window'].isMaximized}
          zIndex={windows['behance-window'].zIndex}
          onClose={() => closeWindow('behance-window')}
          onMinimize={() => minimizeWindow('behance-window')}
          onMaximize={() => toggleMaximize('behance-window')}
          onFocus={() => focusWindow('behance-window')}
        />

        {/* Modals */}
        <LiveViewModal
          isOpen={liveView.isOpen}
          title={liveView.title}
          url={liveView.url}
          onClose={handleCloseLiveView}
        />

        <StatusModal
          isOpen={contactStatus.isOpen}
          isSuccess={contactStatus.isSuccess}
          message={contactStatus.message}
          onClose={handleCloseContactStatus}
        />
      </main>

      {/* Retro Windows Taskbar */}
      <Taskbar
        windows={windows}
        activeWindowId={activeWindowId}
        onOpenWindow={openWindow}
        onToggleMinimize={toggleMinimize}
        onToggleStartMenu={() => setIsStartMenuOpen(!isStartMenuOpen)}
        isStartMenuOpen={isStartMenuOpen}
      />

      {/* Start Menu Flyout */}
      <StartMenu
        isOpen={isStartMenuOpen}
        onClose={() => setIsStartMenuOpen(false)}
        onOpenWindow={openWindow}
      />
    </div>
  );
}
