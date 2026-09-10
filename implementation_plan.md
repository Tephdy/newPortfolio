# Convert Retro OS Portfolio to Next.js / React

Convert the existing static/vanilla Retro OS portfolio (`index.html`, `script.js`, `styles.css`) into a modern, robust, component-driven web application using **Next.js (App Router, React 19, TypeScript, Tailwind CSS)** or **Vite + React (TypeScript, Tailwind CSS)** while preserving 100% of the retro Windows 95/98 / Neo-Brutalist design, interactive window management, GitHub repo integration, Arcade game, Behance gallery, and contact form.

---

## User Review Required

> [!IMPORTANT]
> **Framework Recommendation: Next.js (App Router) vs. Vite + React**
> 
> The prompt asked to convert to "next or react js". We recommend **Next.js 15 (App Router with TypeScript & Tailwind CSS)** for the following reasons:
> 1. **Superior Portfolio SEO & Metadata**: Next.js provides built-in metadata APIs for rich OpenGraph preview cards when sharing on LinkedIn/Twitter/GitHub, as well as automatic `sitemap.xml` and `robots.txt` generation.
> 2. **Flexible Deployment**: Next.js can be deployed with static export (`output: 'export'`) to GitHub Pages or Netlify, or hosted on Vercel with zero configuration.
> 3. **Font & Image Optimization**: Built-in `next/font` for retro fonts (`Space Mono`, `VT323`, `Inter`) prevents layout shifts, and `next/image` ensures sharp loading of Behance artwork.
> 4. **Incremental Server/Client architecture**: Behance project data, static bio copy, and metadata can be prerendered statically, while the retro OS desktop, window manager, and arcade game run smoothly in client components.
>
> *(If you prefer a pure client-side SPA with **Vite + React**, we can initialize with Vite instead.)*

> [!NOTE]
> **Preserving Existing Code**:
> The existing files (`index.html`, `script.js`, `styles.css`) will be safely backed up in a `legacy-vanilla/` folder or preserved in Git history so nothing is lost.

---

## Proposed Architecture & Structure

```
d:/TEPHDYTECH/WEB APP/PORTFOLIO/
├── public/
│   └── (static assets, icons, audio if needed)
├── src/
│   ├── app/
│   │   ├── layout.tsx             # Root layout with fonts (Space Mono, VT323), metadata & SEO
│   │   ├── page.tsx               # Main OS desktop container
│   │   └── globals.css            # Retro OS design tokens, scrollbars, CRT scanlines
│   ├── components/
│   │   ├── os/
│   │   │   ├── Desktop.tsx        # Desktop grid, shortcuts/icons & host container
│   │   │   ├── DesktopIcon.tsx    # Draggable/clickable retro desktop shortcut
│   │   │   ├── Taskbar.tsx        # Bottom taskbar with Start button, active apps, clock
│   │   │   ├── StartMenu.tsx      # Retro Windows 95/98 style Start flyout menu
│   │   │   ├── WindowFrame.tsx    # Reusable draggable/resizable retro window wrapper
│   │   │   └── LoadingScreen.tsx  # Dynamic greeting boot screen with animated progress
│   │   ├── windows/
│   │   │   ├── AboutWindow.tsx    # Internet Explorer style portfolio showcase & music widget
│   │   │   ├── AboutMeWindow.tsx  # Dedicated bio & background story window
│   │   │   ├── ProjectsWindow.tsx # GitHub public repos with search, live preview launcher
│   │   │   ├── SkillsWindow.tsx   # System diagnostics, tech meters & capability graphs
│   │   │   ├── ContactWindow.tsx  # Outlook Express contact form with Web3Forms
│   │   │   ├── ArcadeWindow.tsx   # Tic-Tac-Toe vs CPU game with scorekeeper
│   │   │   └── BehanceWindow.tsx  # Behance 12-project portfolio visual gallery
│   │   └── modals/
│   │       ├── LiveViewModal.tsx  # In-window live project iframe previewer
│   │       └── StatusModal.tsx    # Retro success/error confirmation alert
│   ├── hooks/
│   │   ├── useWindowManager.ts    # Centralized state for open, minimized, active & z-index
│   │   ├── useDraggable.ts        # Pointer-based window dragging with boundary clamping
│   │   └── useResizable.ts        # Pointer-based window resizing handle
│   ├── data/
│   │   ├── behanceProjects.ts     # Typed list of Behance showcase projects
│   │   └── skillsData.ts          # Technical skill metrics & category breakdown
│   └── types/
│       └── os.ts                  # TypeScript interfaces for Windows, GitHub Repos, Game State
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.ts
```

---

## Proposed Changes

### Component 1: Project Initialization & Configuration

- Move current `index.html`, `script.js`, `styles.css` into `legacy-vanilla/` to keep a clean root directory.
- Initialize Next.js 15 with TypeScript, Tailwind CSS, App Router, and npm using non-interactive flags:
  `npx -y create-next-app@latest ./ --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --disable-git`
- Install supporting dependencies:
  `lucide-react` (or `@fortawesome/react-fontawesome` & `@fortawesome/free-solid-svg-icons`) for retro UI icons.
- Configure Tailwind CSS with the retro color palette:
  - Sand / Cream: `#f4eee2`, `#e9e0d0`, `#dcd7cd`
  - Slate Dark Border: `#1e1e1e`
  - Retro Blue: `#3d5a80`
  - Retro Coral / Red: `#e07a5f`
  - Retro Orange / Yellow: `#f4a261`, `#e9c46a`
  - Retro Green: `#90be6d`
  - Desktop Green-Gray: `#66736f`, `#7d7775`

### Component 2: OS State Management & Window Engine

- **`useWindowManager.ts`**:
  - Replaces global DOM manipulations with pure React state.
  - State includes `windows`: dictionary of window definitions with `isOpen`, `isMinimized`, `isMaximized`, `position`, `size`, and `zIndex`.
  - `focusedWindowId`: tracks top-most window; clicking any window raises its `zIndex`.
  - Functions: `openWindow(id)`, `closeWindow(id)`, `minimizeWindow(id)`, `maximizeWindow(id)`, `focusWindow(id)`.
- **`WindowFrame.tsx`**:
  - Encapsulates titlebar with retro controls (`_`, `□`, `×`), title color variants (`blue`, `yellow`, `coral`), draggable titlebar header, and custom retro resize grip.
  - Smooth pointer capture handlers that respect desktop viewport bounds.

### Component 3: Feature Windows & Interactive Apps

- **Internet Explorer Window (`AboutWindow.tsx`)**:
  - Classic browser UI with URL bar (`https://joseph-amandy.dev/os/home`), back/forward buttons, quick launch cards.
  - Interactive Lofi Code Stream audio player widget (play/pause state, progress animation).
- **Projects Window (`ProjectsWindow.tsx`)**:
  - Fetch public repositories dynamically from `https://api.github.com/users/Tephdy/repos`.
  - Add search bar to filter projects by name or language.
  - Repository cards with direct GitHub links and "Live View" button that triggers `LiveViewModal`.
  - Graceful loading skeleton & fallback handling.
- **Arcade Window (`ArcadeWindow.tsx`)**:
  - React-based Tic-Tac-Toe against CPU with interactive board, score tracking (Player, CPU, Draws), and turn indicators.
- **Contact Window (`ContactWindow.tsx`)**:
  - Retro Outlook Express form wired to Web3Forms API with async submission, loading spinner, and retro `StatusModal`.
- **Skills Window (`SkillsWindow.tsx`)**:
  - Tech icons grid, diagnostic meter bars, and capability focus chart.
- **Behance Window (`BehanceWindow.tsx`)**:
  - Responsive gallery grid with 12 Behance creative projects, direct links, and hover effects.

### Component 4: OS Shell & Mobile Responsiveness

- **`Taskbar.tsx`**:
  - Retro Windows taskbar with Start button, active window tabs (click to minimize/restore/focus), and real-time digital clock.
  - Mobile bottom navigation bar matching the existing media query layout.
- **`StartMenu.tsx`**:
  - Click-outside detection, quick launch shortcuts to all apps.
- **`LoadingScreen.tsx`**:
  - OS boot sequence with time-aware greeting ("GOOD MORNING!", etc.), progress bar, and "Skip / Enter" action.

---

## Verification Plan

### Automated Tests & Quality Checks
- `npm run build`: Verify Next.js production build and static analysis pass without errors.
- `npm run lint`: Verify ESLint passes with no warnings/errors.
- TypeScript compiler check: `npx tsc --noEmit`.

### Manual Verification
1. **Desktop & Window Management**:
   - Verify opening, closing, minimizing, maximizing, dragging, and resizing of all windows (`About`, `About Me`, `Projects`, `Skills`, `Contact`, `Arcade`, `Behance`).
   - Verify z-index focusing (clicking a window brings it in front of others).
2. **GitHub API & Live View**:
   - Open Projects window, verify dynamic loading of `Tephdy`'s repositories, search filtering, and live view modal iframe preview.
3. **Contact Form**:
   - Verify form validation, submission handling, and status feedback modal.
4. **Arcade Game**:
   - Play a round of Tic-Tac-Toe against CPU; verify win, loss, draw conditions, and score tallying.
5. **Mobile Responsiveness**:
   - Test in mobile viewport to confirm bottom taskbar navigation adapts cleanly.
