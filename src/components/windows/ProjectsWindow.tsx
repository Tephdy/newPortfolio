'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { WindowFrame } from '@/components/os/WindowFrame';
import { GitHubRepo } from '@/types/os';
import { Folder, Search, Eye, Loader2 } from 'lucide-react';

function GithubIcon({ size = 12, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

interface ProjectsWindowProps {
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onFocus: () => void;
  onOpenLiveView: (title: string, url: string) => void;
}

export function ProjectsWindow({
  isOpen,
  isMinimized,
  isMaximized,
  zIndex,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  onOpenLiveView,
}: ProjectsWindowProps) {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function fetchRepos() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          'https://api.github.com/users/Tephdy/repos?sort=updated&per_page=100'
        );

        if (!response.ok) {
          throw new Error(`GitHub API returned ${response.status}`);
        }

        const data = await response.json();
        if (isMounted) {
          if (Array.isArray(data)) {
            setRepos(data);
          } else {
            setRepos([]);
          }
        }
      } catch (err) {
        console.warn('GitHub API fetch failed, falling back:', err);
        if (isMounted) {
          setError(
            'Unable to connect directly to GitHub API right now. Please try again or open GitHub directly.'
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    if (isOpen && repos.length === 0) {
      fetchRepos();
    }

    return () => {
      isMounted = false;
    };
  }, [isOpen, repos.length]);

  const filteredRepos = useMemo(() => {
    if (!searchQuery.trim()) return repos;
    const query = searchQuery.toLowerCase();
    return repos.filter(
      (r) =>
        r.name.toLowerCase().includes(query) ||
        r.description?.toLowerCase().includes(query) ||
        r.language?.toLowerCase().includes(query)
    );
  }, [repos, searchQuery]);

  return (
    <WindowFrame
      id="projects-window"
      title="C:\JosephAmandy\Projects"
      icon={<Folder size={14} />}
      color="yellow"
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
        {/* Search / Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 bg-white border-2 border-[#1e1e1e] p-2.5 shadow-[2px_2px_0px_#1e1e1e]">
          <div className="flex items-center space-x-2 text-xs font-mono">
            <Folder size={16} className="text-[#f4a261]" />
            <span className="font-bold">Public Repositories ({filteredRepos.length})</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 sm:w-60">
              <Search
                size={14}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500"
              />
              <input
                type="text"
                placeholder="Filter projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="retro-input w-full pl-8 py-1 text-xs font-mono"
              />
            </div>
          </div>
        </div>

        {/* Repositories Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 space-y-3">
            <Loader2 size={32} className="animate-spin text-[#e07a5f]" />
            <p className="text-xs font-mono font-bold text-gray-700">
              Querying GitHub API (users/Tephdy/repos)...
            </p>
          </div>
        ) : error && repos.length === 0 ? (
          <div className="retro-window p-6 bg-white border-2 border-[#1e1e1e] text-center space-y-3">
            <p className="text-xs font-mono font-bold text-red-600">{error}</p>
            <a
              href="https://github.com/Tephdy"
              target="_blank"
              rel="noopener noreferrer"
              className="retro-btn inline-flex items-center space-x-2 px-4 py-2 text-xs font-mono bg-[#f4a261]"
            >
              <GithubIcon size={14} />
              <span>Visit GitHub Profile @Tephdy</span>
            </a>
          </div>
        ) : filteredRepos.length === 0 ? (
          <div className="retro-window p-8 bg-white border-2 border-[#1e1e1e] text-center">
            <p className="text-xs font-mono text-gray-700">
              No matching repositories found for &quot;{searchQuery}&quot;.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRepos.map((repo) => {
              const liveUrl = repo.homepage?.trim();

              return (
                <div
                  key={repo.name}
                  className="retro-window p-4 bg-white border-2 border-[#1e1e1e] flex flex-col justify-between shadow-[2px_2px_0px_#1e1e1e] hover:translate-y-[-1px] transition-transform"
                >
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Folder size={20} className="text-[#f4a261] flex-shrink-0" />
                      <h4
                        className="font-bold text-xs font-mono truncate"
                        title={repo.name}
                      >
                        {repo.name}
                      </h4>
                    </div>
                    <p className="text-[11px] text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                      {repo.description || 'No description provided.'}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-200">
                    <span className="text-[9px] font-mono bg-gray-100 px-1.5 py-0.5 border border-gray-400 font-bold">
                      {repo.language || 'Code'}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {liveUrl ? (
                        <button
                          type="button"
                          onClick={() => onOpenLiveView(repo.name, liveUrl)}
                          className="retro-btn px-2.5 py-1 text-[10px] bg-[#f4a261] flex items-center space-x-1 font-mono"
                          title="Open in Live View"
                        >
                          <Eye size={11} />
                          <span>Live View</span>
                        </button>
                      ) : (
                        <span
                          className="text-[10px] text-gray-500 font-mono italic"
                          title="No live preview URL configured"
                        >
                          No live view
                        </span>
                      )}
                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="retro-btn px-2.5 py-1 text-[10px] flex items-center space-x-1 font-mono"
                      >
                        <GithubIcon size={11} />
                        <span>Repo</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </WindowFrame>
  );
}
