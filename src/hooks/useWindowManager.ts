'use client';

import { useState, useCallback, useRef } from 'react';
import { WindowId, WindowState } from '@/types/os';

const INITIAL_WINDOWS: Record<WindowId, WindowState> = {
  'about-window': {
    isOpen: true,
    isMinimized: false,
    isMaximized: false,
    zIndex: 10,
    position: null,
    size: null,
  },
  'about-me-window': {
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 1,
    position: null,
    size: null,
  },
  'projects-window': {
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 1,
    position: null,
    size: null,
  },
  'skills-window': {
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 1,
    position: null,
    size: null,
  },
  'contact-window': {
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 1,
    position: null,
    size: null,
  },
  'games-window': {
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 1,
    position: null,
    size: null,
  },
  'behance-window': {
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 1,
    position: null,
    size: null,
  },
};

export function useWindowManager() {
  const [windows, setWindows] = useState<Record<WindowId, WindowState>>(INITIAL_WINDOWS);
  const [activeWindowId, setActiveWindowId] = useState<WindowId | null>('about-window');
  const topZRef = useRef(15);

  const focusWindow = useCallback((id: WindowId) => {
    topZRef.current += 1;
    const nextZ = topZRef.current;
    setWindows((curr) => ({
      ...curr,
      [id]: {
        ...curr[id],
        isMinimized: false,
        zIndex: nextZ,
      },
    }));
    setActiveWindowId(id);
  }, []);

  const openWindow = useCallback((id: WindowId) => {
    topZRef.current += 1;
    const nextZ = topZRef.current;
    setWindows((curr) => ({
      ...curr,
      [id]: {
        ...curr[id],
        isOpen: true,
        isMinimized: false,
        zIndex: nextZ,
      },
    }));
    setActiveWindowId(id);
  }, []);

  const closeWindow = useCallback((id: WindowId) => {
    setWindows((curr) => ({
      ...curr,
      [id]: {
        ...curr[id],
        isOpen: false,
      },
    }));
    setActiveWindowId((curr) => (curr === id ? null : curr));
  }, []);

  const minimizeWindow = useCallback((id: WindowId) => {
    setWindows((curr) => ({
      ...curr,
      [id]: {
        ...curr[id],
        isMinimized: true,
      },
    }));
    setActiveWindowId((curr) => (curr === id ? null : curr));
  }, []);

  const toggleMinimize = useCallback(
    (id: WindowId) => {
      setWindows((curr) => {
        const win = curr[id];
        if (!win.isOpen) {
          openWindow(id);
          return curr;
        }
        if (win.isMinimized || activeWindowId !== id) {
          focusWindow(id);
          return {
            ...curr,
            [id]: {
              ...win,
              isMinimized: false,
            },
          };
        } else {
          return {
            ...curr,
            [id]: {
              ...win,
              isMinimized: true,
            },
          };
        }
      });
    },
    [activeWindowId, focusWindow, openWindow]
  );

  const toggleMaximize = useCallback((id: WindowId) => {
    setWindows((curr) => ({
      ...curr,
      [id]: {
        ...curr[id],
        isMaximized: !curr[id].isMaximized,
      },
    }));
  }, []);

  const updateWindowPosition = useCallback(
    (id: WindowId, position: { x: number; y: number }) => {
      setWindows((curr) => ({
        ...curr,
        [id]: {
          ...curr[id],
          position,
        },
      }));
    },
    []
  );

  const updateWindowSize = useCallback(
    (id: WindowId, size: { width: number; height: number }) => {
      setWindows((curr) => ({
        ...curr,
        [id]: {
          ...curr[id],
          size,
        },
      }));
    },
    []
  );

  return {
    windows,
    activeWindowId,
    openWindow,
    closeWindow,
    minimizeWindow,
    toggleMinimize,
    toggleMaximize,
    focusWindow,
    updateWindowPosition,
    updateWindowSize,
  };
}
