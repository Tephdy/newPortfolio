'use client';

import React from 'react';
import { CheckCircle2, AlertTriangle, X } from 'lucide-react';

interface StatusModalProps {
  isOpen: boolean;
  isSuccess: boolean;
  message: string;
  onClose: () => void;
}

export function StatusModal({
  isOpen,
  isSuccess,
  message,
  onClose,
}: StatusModalProps) {
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
      <div
        className="retro-window live-view-window shadow-2xl"
        style={{ height: 'auto', maxWidth: '460px', minHeight: 0 }}
      >
        <div className={`retro-titlebar ${isSuccess ? 'blue' : 'yellow'}`}>
          <span className="text-xs font-mono font-bold">
            {isSuccess ? 'Message Sent' : 'Message Error'}
          </span>
          <div className="window-controls">
            <button type="button" onClick={onClose} title="Close">
              <X size={10} strokeWidth={3} />
            </button>
          </div>
        </div>
        <div className="p-6 bg-[#f4eee2] text-center flex flex-col items-center">
          {isSuccess ? (
            <CheckCircle2 size={44} className="text-green-600 mb-3" />
          ) : (
            <AlertTriangle size={44} className="text-red-600 mb-3" />
          )}
          <p className="text-xs font-bold font-mono text-[#1e1e1e] leading-relaxed mb-4">
            {message}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="retro-btn px-6 py-1.5 text-xs font-mono"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
