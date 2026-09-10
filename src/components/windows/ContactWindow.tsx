'use client';

import React, { useState, useEffect, useRef } from 'react';
import { WindowFrame } from '@/components/os/WindowFrame';
import { GitHubRepo } from '@/types/os';
import { generatePortfolioAiResponse } from '@/lib/portfolioAi';
import {
  Mail,
  Send,
  Loader2,
  Bot,
  User,
  Sparkles,
  RotateCcw,
  ExternalLink,
  MessageSquare,
} from 'lucide-react';

interface ContactWindowProps {
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onFocus: () => void;
  onStatusChange: (isSuccess: boolean, message: string) => void;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export function ContactWindow({
  isOpen,
  isMinimized,
  isMaximized,
  zIndex,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  onStatusChange,
}: ContactWindowProps) {
  const [activeTab, setActiveTab] = useState<'chat' | 'email'>('chat');

  // Email form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // AI Chat state
  const [chatMessages, setChatMessages] = useState<Message[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      content: `### 👋 Welcome to Joseph Amandy's OS!

I am the **JA-OS AI Copilot**. I have access to Joseph's technical background, **GitHub repositories**, and **Behance design projects**.

- 💡 **Ask about GitHub**: *"What projects have you built?"*
- 🎨 **Ask about Behance**: *"Tell me about your visual design work."*
- 🚀 **Pitch a New Project**: *"Can you build a custom booking system / SaaS / mobile app?"* — I will immediately outline an architectural blueprint and roadmap for how Joseph can build it!

How can I assist you today?`,
      timestamp: '12:00 PM',
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Fetch GitHub repos in background for AI grounding
  useEffect(() => {
    async function fetchRepos() {
      try {
        const res = await fetch(
          'https://api.github.com/users/Tephdy/repos?sort=updated&per_page=100'
        );
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) setRepos(data);
        }
      } catch (e) {
        console.warn('Repos fetch for AI grounding skipped:', e);
      }
    }
    fetchRepos();
  }, []);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (activeTab === 'chat') {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, activeTab]);

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || isThinking) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend.trim(),
      timestamp: time,
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsThinking(true);

    try {
      // Call Next.js API route /api/chat
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...chatMessages, userMsg].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          repos,
        }),
      });

      let replyText = '';
      if (response.ok) {
        const data = await response.json();
        replyText = data.reply || '';
      }

      if (!replyText) {
        // Fallback to local engine
        replyText = generatePortfolioAiResponse(textToSend, repos);
      }

      const assistantMsg: Message = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setChatMessages((prev) => [...prev, assistantMsg]);
    } catch {
      // Offline fallback
      const replyText = generatePortfolioAiResponse(textToSend, repos);
      const assistantMsg: Message = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages((prev) => [...prev, assistantMsg]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleResetChat = () => {
    setChatMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content: `### Chat History Reset\n\nReady for new questions! Ask about GitHub, Behance, or request an implementation plan for your next project.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        access_key: '7eced5f1-1e78-4a3f-bc37-3d941ed754fc',
        subject: 'New portfolio contact message',
        from_name: 'Joseph Amandy Portfolio',
        name: formData.name,
        email: formData.email,
        message: formData.message,
      };

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setFormData({ name: '', email: '', message: '' });
        onStatusChange(
          true,
          'Your message was sent successfully. Thank you for reaching out!'
        );
      } else {
        throw new Error(result.message || 'Submission failed.');
      }
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : 'Your message could not be sent. Please try again.';
      onStatusChange(false, errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const quickPrompts = [
    { label: '💻 GitHub Repos', prompt: 'What public projects have you built on GitHub?' },
    { label: '🎨 Behance Showcase', prompt: 'Tell me about your graphic design & branding on Behance.' },
    { label: '⚡ Core Tech Stack', prompt: 'What is your primary programming and tech stack?' },
    { label: '🚀 Build an E-commerce App', prompt: 'Can you build a full-stack e-commerce store with Stripe and Next.js?' },
    { label: '📱 Build a Booking System', prompt: 'Can you build a real-time booking and appointment management portal?' },
  ];

  const toolbar = (
    <div className="bg-[#e9e0d0] border-b-2 border-[#1e1e1e] p-2 flex items-center justify-between text-xs font-mono select-none">
      <div className="flex items-center space-x-2">
        <button
          type="button"
          onClick={() => setActiveTab('chat')}
          className={`retro-btn px-3 py-1 flex items-center space-x-1.5 ${
            activeTab === 'chat'
              ? 'bg-[#f4a261] border-[#1e1e1e] shadow-[inset_1px_1px_0px_rgba(0,0,0,0.2)]'
              : 'bg-white'
          }`}
        >
          <Bot size={13} />
          <span>AI Copilot (Chat)</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('email')}
          className={`retro-btn px-3 py-1 flex items-center space-x-1.5 ${
            activeTab === 'email'
              ? 'bg-[#f4a261] border-[#1e1e1e] shadow-[inset_1px_1px_0px_rgba(0,0,0,0.2)]'
              : 'bg-white'
          }`}
        >
          <Mail size={13} />
          <span>Outlook Express (Email)</span>
        </button>
      </div>

      {activeTab === 'chat' && (
        <button
          type="button"
          onClick={handleResetChat}
          className="retro-btn px-2 py-1 text-[11px] flex items-center space-x-1 bg-white hover:bg-red-50 text-gray-700"
          title="Reset chat conversation"
        >
          <RotateCcw size={11} />
          <span className="hidden sm:inline">Reset</span>
        </button>
      )}
    </div>
  );

  return (
    <WindowFrame
      id="contact-window"
      title="Contact & AI Copilot - Joseph Amandy OS"
      icon={<MessageSquare size={14} />}
      color="yellow"
      isOpen={isOpen}
      isMinimized={isMinimized}
      isMaximized={isMaximized}
      zIndex={zIndex}
      onClose={onClose}
      onMinimize={onMinimize}
      onMaximize={onMaximize}
      onFocus={onFocus}
      toolbar={toolbar}
    >
      {activeTab === 'chat' ? (
        /* AI Chat Assistant View */
        <div className="flex flex-col h-full min-h-[380px] bg-[#f4eee2] font-mono">
          {/* Quick Prompt Pills */}
          <div className="p-3 bg-white/60 border-b border-[#1e1e1e]/20 flex items-center space-x-2 overflow-x-auto select-none flex-shrink-0">
            <span className="text-[10px] font-bold text-gray-600 flex items-center space-x-1 flex-shrink-0">
              <Sparkles size={11} className="text-[#e07a5f]" />
              <span>Prompt:</span>
            </span>
            {quickPrompts.map((q) => (
              <button
                key={q.label}
                type="button"
                onClick={() => handleSendMessage(q.prompt)}
                disabled={isThinking}
                className="retro-btn px-2 py-0.5 text-[10px] whitespace-nowrap bg-white hover:bg-[#f4a261] transition-colors"
              >
                {q.label}
              </button>
            ))}
          </div>

          {/* Chat Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 min-h-0">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start space-x-2.5 ${
                  msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-7 h-7 border-2 border-[#1e1e1e] flex items-center justify-center text-xs font-bold shadow-[1px_1px_0px_#1e1e1e] flex-shrink-0 ${
                    msg.role === 'user'
                      ? 'bg-[#e07a5f] text-white'
                      : 'bg-[#3d5a80] text-white'
                  }`}
                >
                  {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                </div>

                {/* Bubble */}
                <div
                  className={`max-w-[85%] retro-window p-3 text-xs leading-relaxed shadow-[2px_2px_0px_#1e1e1e] ${
                    msg.role === 'user'
                      ? 'bg-[#ffffff] border-[#1e1e1e]'
                      : 'bg-white border-[#1e1e1e]'
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-gray-200 pb-1 mb-2 text-[10px] text-gray-500">
                    <span className="font-bold text-[#1e1e1e]">
                      {msg.role === 'user' ? 'Visitor' : 'JA-OS AI Copilot'}
                    </span>
                    <span>{msg.timestamp}</span>
                  </div>

                  {/* Message Body with Formatted Markdown */}
                  <div className="space-y-2 text-[#1e1e1e] break-words">
                    <FormattedMessage content={msg.content} onSwitchToEmail={() => setActiveTab('email')} />
                  </div>
                </div>
              </div>
            ))}

            {isThinking && (
              <div className="flex items-center space-x-2 text-xs font-mono text-gray-700 bg-white border-2 border-[#1e1e1e] p-2.5 max-w-xs shadow-[2px_2px_0px_#1e1e1e]">
                <Loader2 size={14} className="animate-spin text-[#e07a5f]" />
                <span>AI Copilot is analyzing & planning...</span>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Chat Input Bar */}
          <div className="p-3 bg-[#e9e0d0] border-t-2 border-[#1e1e1e] flex items-center space-x-2 flex-shrink-0">
            <input
              type="text"
              placeholder="Ask about my repos, Behance work, or pitch a project idea..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              disabled={isThinking}
              className="retro-input flex-1 text-xs py-1.5"
            />
            <button
              type="button"
              onClick={() => handleSendMessage()}
              disabled={isThinking || !inputQuery.trim()}
              className="retro-btn px-4 py-1.5 bg-[#f4a261] text-xs font-bold flex items-center space-x-1"
            >
              <Send size={12} />
              <span>Send</span>
            </button>
          </div>
        </div>
      ) : (
        /* Outlook Express Email Form View */
        <div className="p-4 md:p-6 bg-[#f4eee2] space-y-4">
          <div className="retro-window p-3 bg-white border-2 border-[#1e1e1e] shadow-[2px_2px_0px_#1e1e1e] text-xs font-mono flex items-center justify-between">
            <div>
              <span className="font-bold">Outlook Express 6.0</span> - Direct Message to Joseph Amandy
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('chat')}
              className="retro-btn px-2 py-0.5 text-[10px] bg-[#f4a261] flex items-center space-x-1"
            >
              <Bot size={11} />
              <span>Ask AI Copilot instead</span>
            </button>
          </div>

          <form onSubmit={handleEmailSubmit} className="space-y-3 font-mono">
            <div>
              <label className="block text-xs font-bold mb-1 text-[#1e1e1e]">
                Your Name:
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="retro-input w-full text-xs"
                placeholder="e.g. John Doe"
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1 text-[#1e1e1e]">
                Your Email:
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="retro-input w-full text-xs"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1 text-[#1e1e1e]">
                Message:
              </label>
              <textarea
                name="message"
                rows={4}
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="retro-input w-full text-xs"
                placeholder="Hi Joseph, I saw your portfolio and would like to collaborate..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="retro-btn px-6 py-2 bg-[#f4a261] text-xs font-bold flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={13} className="animate-spin" />
                  <span>Sending Message...</span>
                </>
              ) : (
                <>
                  <Send size={13} />
                  <span>Send Message</span>
                </>
              )}
            </button>
          </form>
        </div>
      )}
    </WindowFrame>
  );
}

/**
 * Clean markdown formatter that transforms headers, bolding, links, and lists
 */
function FormattedMessage({
  content,
  onSwitchToEmail,
}: {
  content: string;
  onSwitchToEmail?: () => void;
}) {
  const lines = content.split('\n');

  return (
    <div className="space-y-1.5 text-xs font-mono">
      {lines.map((line, idx) => {
        const trimmed = line.trim();

        if (trimmed.startsWith('### ')) {
          return (
            <h3
              key={idx}
              className="text-sm font-black font-mono text-[#1e1e1e] mt-2 mb-1 border-b border-gray-300 pb-0.5 flex items-center space-x-1"
            >
              <span>{trimmed.replace('### ', '')}</span>
            </h3>
          );
        }

        if (trimmed.startsWith('#### ')) {
          return (
            <h4
              key={idx}
              className="text-xs font-bold font-mono text-[#3d5a80] mt-1.5 mb-0.5"
            >
              {trimmed.replace('#### ', '')}
            </h4>
          );
        }

        if (trimmed.startsWith('---')) {
          return <hr key={idx} className="border-t border-[#1e1e1e]/20 my-2" />;
        }

        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const itemText = trimmed.replace(/^[-*]\s+/, '');
          return (
            <div key={idx} className="flex items-start space-x-1.5 pl-1.5 my-0.5">
              <span className="text-[#e07a5f] font-bold text-xs mt-0.5">▪</span>
              <div className="flex-1 leading-relaxed">
                <ParseInlineMarkdown text={itemText} />
              </div>
            </div>
          );
        }

        if (trimmed.startsWith('1. ') || trimmed.startsWith('2. ') || trimmed.startsWith('3. ') || trimmed.startsWith('4. ')) {
          const num = trimmed.slice(0, 3);
          const itemText = trimmed.slice(3);
          return (
            <div key={idx} className="flex items-start space-x-1.5 pl-1.5 my-0.5">
              <span className="font-bold text-[#3d5a80]">{num}</span>
              <div className="flex-1 leading-relaxed">
                <ParseInlineMarkdown text={itemText} />
              </div>
            </div>
          );
        }

        if (!trimmed) {
          return <div key={idx} className="h-1" />;
        }

        return (
          <p key={idx} className="leading-relaxed">
            <ParseInlineMarkdown text={trimmed} onSwitchToEmail={onSwitchToEmail} />
          </p>
        );
      })}
    </div>
  );
}

function ParseInlineMarkdown({
  text,
  onSwitchToEmail,
}: {
  text: string;
  onSwitchToEmail?: () => void;
}) {
  // Replace links e.g. [text](url)
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts: React.ReactNode[] = [];
  let lastIdx = 0;
  let match;

  while ((match = linkRegex.exec(text)) !== null) {
    const [fullMatch, linkText, url] = match;
    const preText = text.slice(lastIdx, match.index);
    if (preText) {
      parts.push(renderBoldText(preText, `pre-${match.index}`));
    }

    if (url.startsWith('mailto:')) {
      parts.push(
        <button
          key={`mail-${match.index}`}
          type="button"
          onClick={onSwitchToEmail}
          className="text-[#e07a5f] font-bold underline hover:text-[#3d5a80] inline-flex items-center space-x-0.5"
        >
          <span>{linkText}</span>
        </button>
      );
    } else {
      parts.push(
        <a
          key={`link-${match.index}`}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#3d5a80] font-bold underline hover:text-[#e07a5f] inline-flex items-center space-x-0.5"
        >
          <span>{linkText}</span>
          <ExternalLink size={10} className="inline ml-0.5" />
        </a>
      );
    }
    lastIdx = match.index + fullMatch.length;
  }

  const remainder = text.slice(lastIdx);
  if (remainder) {
    parts.push(renderBoldText(remainder, `post-${lastIdx}`));
  }

  return <>{parts}</>;
}

function renderBoldText(text: string, keyPrefix: string): React.ReactNode {
  const boldParts = text.split(/\*\*([^*]+)\*\*/g);
  return (
    <span key={keyPrefix}>
      {boldParts.map((part, i) =>
        i % 2 === 1 ? (
          <strong key={i} className="font-bold text-[#1e1e1e]">
            {part}
          </strong>
        ) : (
          part
        )
      )}
    </span>
  );
}
