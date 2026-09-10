'use client';

import React, { useRef, useState } from 'react';
import { TitleBarColor } from '@/types/os';
import { Minus, Square, X } from 'lucide-react';

interface WindowFrameProps {
  id: string;
  title: string;
  icon?: React.ReactNode;
  color?: TitleBarColor;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onFocus: () => void;
  children: React.ReactNode;
  toolbar?: React.ReactNode;
  className?: string;
}

export function WindowFrame({
  id,
  title,
  icon,
  color = 'blue',
  isOpen,
  isMinimized,
  isMaximized,
  zIndex,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  children,
  toolbar,
  className = '',
}: WindowFrameProps) {
  const windowRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

  // Dragging logic
  const handleTitlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (
      (e.target as HTMLElement).closest('.window-controls') ||
      isMaximized ||
      window.innerWidth < 768
    ) {
      return;
    }

    const win = windowRef.current;
    if (!win) return;

    const host = win.closest('.window-host') as HTMLElement;
    if (!host) return;

    const hostRect = host.getBoundingClientRect();
    const winRect = win.getBoundingClientRect();

    const offsetX = e.clientX - winRect.left;
    const offsetY = e.clientY - winRect.top;

    const currentLeft = winRect.left - hostRect.left;
    const currentTop = winRect.top - hostRect.top;

    setPosition({ x: currentLeft, y: currentTop });
    setSize({ width: winRect.width, height: winRect.height });

    const target = e.currentTarget;
    target.setPointerCapture(e.pointerId);
    setIsDragging(true);
    document.body.classList.add('is-dragging');

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const maxLeft = Math.max(0, host.clientWidth - (win.offsetWidth || 320));
      const maxTop = Math.max(0, host.clientHeight - (win.offsetHeight || 240));
      const newX = Math.min(maxLeft, Math.max(0, moveEvent.clientX - hostRect.left - offsetX));
      const newY = Math.min(maxTop, Math.max(0, moveEvent.clientY - hostRect.top - offsetY));
      setPosition({ x: newX, y: newY });
    };

    const handlePointerUp = () => {
      target.releasePointerCapture(e.pointerId);
      setIsDragging(false);
      document.body.classList.remove('is-dragging');
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  // Resizing logic
  const handleResizePointerDown = (e: React.PointerEvent<HTMLSpanElement>) => {
    e.stopPropagation();
    if (isMaximized || window.innerWidth < 768) return;

    const win = windowRef.current;
    if (!win) return;

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = win.offsetWidth;
    const startHeight = win.offsetHeight;

    const target = e.currentTarget;
    target.setPointerCapture(e.pointerId);
    setIsResizing(true);
    document.body.classList.add('is-resizing');

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const newWidth = Math.max(320, startWidth + moveEvent.clientX - startX);
      const newHeight = Math.max(240, startHeight + moveEvent.clientY - startY);
      setSize({ width: newWidth, height: newHeight });
    };

    const handlePointerUp = () => {
      target.releasePointerCapture(e.pointerId);
      setIsResizing(false);
      document.body.classList.remove('is-resizing');
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  if (!isOpen || isMinimized) {
    return null;
  }

  const titleBarClass =
    color === 'blue'
      ? 'retro-titlebar blue'
      : color === 'yellow'
      ? 'retro-titlebar yellow'
      : 'retro-titlebar coral';

  const inlineStyles: React.CSSProperties = {
    zIndex,
  };

  if (!isMaximized && position) {
    inlineStyles.left = `${position.x}px`;
    inlineStyles.top = `${position.y}px`;
    inlineStyles.right = 'auto';
    inlineStyles.bottom = 'auto';
  } else if (!isMaximized) {
    // Default desktop layout coordinates
    inlineStyles.top = '1.5rem';
    inlineStyles.left = '7.5rem';
    inlineStyles.right = '1.5rem';
    inlineStyles.bottom = '1.5rem';
  }

  if (!isMaximized && size) {
    inlineStyles.width = `${size.width}px`;
    inlineStyles.height = `${size.height}px`;
  }

  return (
    <div
      ref={windowRef}
      id={id}
      style={inlineStyles}
      onPointerDown={onFocus}
      className={`retro-window app-window shadow-2xl flex flex-col ${
        isMaximized ? 'is-maximized' : ''
      } ${isDragging ? 'is-dragging opacity-95' : ''} ${
        isResizing ? 'is-resizing' : ''
      } ${className}`}
    >
      {/* Title bar */}
      <div
        className={titleBarClass}
        onPointerDown={handleTitlePointerDown}
      >
        <div className="flex items-center space-x-2 min-w-0 pr-2">
          {icon && <span className="flex-shrink-0 text-sm">{icon}</span>}
          <span className="truncate text-xs font-bold font-mono tracking-wide">
            {title}
          </span>
        </div>
        <div className="window-controls flex items-center flex-shrink-0">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onMinimize();
            }}
            title="Minimize"
          >
            <Minus size={10} strokeWidth={3} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onMaximize();
            }}
            title={isMaximized ? 'Restore' : 'Maximize'}
          >
            <Square size={9} strokeWidth={2.5} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            title="Close"
          >
            <X size={10} strokeWidth={3} />
          </button>
        </div>
      </div>

      {/* Optional Toolbar (e.g. Browser bar) */}
      {toolbar}

      {/* Content Area */}
      <div className="window-body bg-[#f4eee2] flex-1 overflow-y-auto">
        {children}
      </div>

      {/* Resize handle */}
      {!isMaximized && (
        <span
          className="resize-grip"
          aria-hidden="true"
          onPointerDown={handleResizePointerDown}
        />
      )}
    </div>
  );
}
