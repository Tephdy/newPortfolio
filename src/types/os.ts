export type WindowId =
  | 'about-window'
  | 'about-me-window'
  | 'projects-window'
  | 'skills-window'
  | 'contact-window'
  | 'games-window'
  | 'behance-window';

export type TitleBarColor = 'blue' | 'yellow' | 'coral';

export interface WindowConfig {
  id: WindowId;
  title: string;
  iconName: string;
  color: TitleBarColor;
  defaultPosition?: { x: number; y: number };
  defaultSize?: { width: number; height: number };
}

export interface WindowState {
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: { x: number; y: number } | null;
  size: { width: number; height: number } | null;
}

export interface GitHubRepo {
  id?: number;
  name: string;
  description: string | null;
  language: string | null;
  homepage: string | null;
  html_url: string;
  stargazers_count?: number;
  forks_count?: number;
}

export interface BehanceProject {
  title: string;
  imageUrl: string;
  projectUrl: string;
}

export interface ContactStatus {
  isOpen: boolean;
  isSuccess: boolean;
  message: string;
}
