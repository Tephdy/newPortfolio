'use client';

import React, { useEffect } from 'react';
import { ExternalLink, X } from 'lucide-react';

interface LiveViewModalProps {
  isOpen: boolean;
  title: string;
  url: string;
  onClose: () => void;
}

export function LiveViewModal({
  isOpen,
  title,
  url,
  onClose,
}: LiveViewModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="live-view-overlay"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="retro-window live-view-window shadow-2xl">
        <div className="retro-titlebar blue">
          <span className="truncate pr-4 text-xs font-mono font-bold">
            Live View - {title}
          </span>
          <div className="window-controls">
            <button
              type="button"
              onClick={() => {
                if (url) window.open(url, '_blank', 'noopener,noreferrer');
              }}
              title="Open in new tab"
            >
              <ExternalLink size={10} />
            </button>
            <button type="button" onClick={onClose} title="Close">
              <X size={10} strokeWidth={3} />
            </button>
          </div>
        </div>
        <iframe
          src={url}
          className="live-view-frame"
          title={`Live preview of ${title}`}
          loading="lazy"
        />
      </div>
    </div>
  );
}
