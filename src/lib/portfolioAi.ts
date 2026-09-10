import { BEHANCE_PROJECTS } from '@/data/behanceProjects';
import { TECH_STACK, SKILL_METERS, CAPABILITY_FOCUS } from '@/data/skillsData';
import { GitHubRepo } from '@/types/os';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

export const SYSTEM_PROMPT = `You are "JA-OS AI Copilot", the intelligent retro-virtual assistant for Joseph Amandy's portfolio operating system.
Your mission is to represent Joseph Amandy professionally, highlight his technical and creative capabilities, answer questions about his GitHub repositories and Behance creative work, and assist prospective clients or recruiters.

### ABOUT JOSEPH AMANDY:
- **Profile**: Full-Stack Software Developer & UI/UX Designer specializing in dynamic web systems, automations, and retro/neo-brutalist digital experiences.
- **Education**: IT Graduate from ICCT Colleges.
- **Core Languages & Frameworks**: JavaScript (ES6+), TypeScript, Next.js, React, PHP, Python, SQL (MySQL, PostgreSQL), Google Apps Script, HTML5/CSS3, Tailwind CSS.
- **Tools & Systems**: Linux/Server Administration, Git & GitHub, Docker, REST APIs, Webhooks, Automation scripts.
- **Creative & Design Toolkit**: Adobe Photoshop, Adobe Illustrator, Figma, Canva, Affinity Designer, CapCut. Passionate about street & wildlife photography.
- **Video Editing**: CapCut, Adobe Premiere Pro — capable of producing short-form social media reels, long-form YouTube/documentary edits, brand commercials, event highlight reels, and any custom video of any length with motion graphics, color grading, and sound design.

### BEHANCE PORTFOLIO (12 Featured Projects):
${BEHANCE_PROJECTS.map((p) => `- ${p.title} (${p.projectUrl})`).join('\n')}

### INSTRUCTIONS FOR RESPONDING:
1. **Tone**: Helpful, confident, retro-cool, tech-savvy, and professional.
2. **When asked about his GitHub Repos or Coding**: Reference his GitHub profile (github.com/Tephdy) and his software development expertise across full-stack web systems, CRUD architectures, and automation scripts.
3. **When asked about his Behance work or Graphic Design**: Highlight his visual design projects such as Eve's Residences promotional campaign, UI/UX design systems, branding posters, photo manipulation, 3D product mockups, and brutalist layouts.
4. **When asked about Video Editing or Video Production**: Explain that Joseph can produce and edit videos of ANY length — from 15-second Instagram Reels to full 2-hour documentary-style productions — using CapCut and Adobe Premiere Pro. Detail the creative process: consultation, script/storyboard, footage/asset gathering, editing, color grading, sound design, motion graphics, and final delivery in any format.
5. **CRITICAL REQUIREMENT — Graphic Design Requests**: If someone asks Joseph to design a logo, poster, banner, flyer, branding kit, social media graphics, UI/UX mockup, product mockup, or any visual asset — affirm he can do it, outline the creative workflow (Brief → Moodboard → Sketching → Digital execution → Revisions → Delivery), and list his tools.
6. **CRITICAL REQUIREMENT — Video Editing Requests**: If someone asks for a video edit, reel, commercial, highlight video, YouTube video, or any video production of any length — affirm Joseph can produce it, detail the video production workflow with phases, specify CapCut and Adobe Premiere Pro as tools, and invite them to the Outlook Express email tab.
7. **CRITICAL REQUIREMENT — Dev Projects Not Yet In Portfolio**: If asked about building a software system/app/tool not in the portfolio — enthusiastically affirm, provide a full architectural blueprint and phased roadmap, and invite them to email via the Outlook Express tab.
8. Format responses neatly with clear bullet points, bold highlights, and friendly sign-offs.`;

/**
 * Built-in intelligent portfolio knowledge engine.
 * Guarantees instant, accurate answers and project proposals without needing an external API key.
 */
export function generatePortfolioAiResponse(
  userQuery: string,
  repos: GitHubRepo[] = []
): string {
  const query = userQuery.toLowerCase().trim();

  // ─── Detect request type ─────────────────────────────────────────────────
  const isActionVerb =
    query.includes('can you') ||
    query.includes('could you') ||
    query.includes('i need') ||
    query.includes('i want') ||
    query.includes('build') ||
    query.includes('make') ||
    query.includes('create') ||
    query.includes('design') ||
    query.includes('edit') ||
    query.includes('produce') ||
    query.includes('develop') ||
    query.includes('how will you') ||
    query.includes('how would you');

  const isVideoRequest =
    query.includes('video') ||
    query.includes('reel') ||
    query.includes('montage') ||
    query.includes('commercial') ||
    query.includes('short film') ||
    query.includes('youtube') ||
    query.includes('tiktok') ||
    query.includes('highlight video') ||
    query.includes('documentary') ||
    query.includes('motion graphic') ||
    query.includes('color grade') ||
    query.includes('color grading') ||
    query.includes('sound design') ||
    query.includes('capcut') ||
    query.includes('premiere') ||
    (query.includes('edit') && (query.includes('clip') || query.includes('footage') || query.includes('film')));

  const isGraphicDesignRequest =
    query.includes('logo') ||
    query.includes('flyer') ||
    query.includes('brand kit') ||
    query.includes('brand identity') ||
    query.includes('infographic') ||
    query.includes('thumbnail') ||
    query.includes('illustration') ||
    (query.includes('poster') && isActionVerb) ||
    (query.includes('banner') && isActionVerb) ||
    (query.includes('branding') && isActionVerb) ||
    (query.includes('mockup') && isActionVerb) ||
    (query.includes('wireframe') && isActionVerb) ||
    (query.includes('ui') && query.includes('design') && isActionVerb) ||
    (query.includes('ux') && isActionVerb) ||
    (query.includes('social media') && (query.includes('graphic') || query.includes('post')) && isActionVerb);

  const isDevProjectInquiry =
    !isVideoRequest &&
    !isGraphicDesignRequest &&
    (
      query.includes('can you build') ||
      query.includes('can you make') ||
      query.includes('can you create') ||
      query.includes('can you develop') ||
      query.includes('how will you do') ||
      query.includes('how would you build') ||
      query.includes('i need a') ||
      query.includes('build a') ||
      query.includes('make a') ||
      query.includes('create a') ||
      query.includes('develop a')
    );

  const isGitHubQuery =
    !isVideoRequest && !isGraphicDesignRequest && (
      query.includes('github') ||
      query.includes('repo') ||
      query.includes('repository') ||
      query.includes('code')
    );

  const isBehanceQuery =
    !isGraphicDesignRequest && !isVideoRequest && (
      query.includes('behance') ||
      query.includes('graphic') ||
      query.includes('photo') ||
      query.includes('poster') ||
      query.includes('banner')
    );

  const isSkillsQuery =
    query.includes('skill') ||
    query.includes('tech stack') ||
    query.includes('technologies') ||
    query.includes('stack') ||
    query.includes('what can you do') ||
    query.includes('language');

  const isBioQuery =
    query.includes('who are you') ||
    query.includes('who is joseph') ||
    query.includes('about you') ||
    query.includes('background') ||
    query.includes('education');

  // ─── Video Editing / Production request ─────────────────────────────────
  if (isVideoRequest && isActionVerb) {
    const topic = extractCreativeTopic(userQuery, 'video');
    return `### 🎬 Absolutely! Joseph can edit & produce that video for you.

Joseph produces videos of **any length** — from a punchy 15-second Instagram Reel to a full-scale 2-hour documentary — using **CapCut** (fast turnaround, mobile-first) and **Adobe Premiere Pro** (professional, complex long-form).

---

#### 🎯 Your Project: **${topic}**

---

#### Phase 1 — Creative Brief & Pre-Production
- **Discovery Call / Questionnaire**: Understand your brand, message, audience, tone, and target platform.
- **Script or Shot-List**: Draft a narrative script or visual shot-list to align creative direction before editing begins.
- **Storyboard / Mood Board**: Visual reference board to lock in style, pacing, and aesthetic mood.
- **Asset Gathering**: You supply raw footage, photos, music preferences, logos, and brand guidelines; Joseph handles the rest.

---

#### Phase 2 — Editing & Production
- **Rough Cut**: Assemble timeline, cut pacing, and lock structure.
- **Motion Graphics & Titles**: Animated intro/outro, lower thirds, kinetic text overlays, and transition effects.
- **Color Grading**: Apply professional LUT-based color grading to match brand palette or cinematic tone.
- **Sound Design**: Audio mixing, background music, SFX layering, voiceover syncing, and noise reduction.
- **Captions / Subtitles**: Auto-synced burned-in captions for accessibility and social media reach.

---

#### Phase 3 — Review & Final Delivery
- **Revision Rounds**: Up to 2–3 structured revision cycles for adjustments and feedback.
- **Export Formats**: Delivered in your required format — MP4 (H.264/H.265), MOV, 4K/1080p, optimized for YouTube, Instagram, TikTok, Facebook, or broadcast.
- **Turnaround**: Short reels (15–90 sec) — 2–3 days · Medium videos (2–10 min) — 3–5 days · Long-form (10 min+) — timeline agreed upon in brief.

---

🎥 **Tools Used**: CapCut Pro (Desktop/Mobile) · Adobe Premiere Pro · Motion Graphics Templates

Ready to roll? **Switch to the "Outlook Express" tab** to send Joseph your brief, or email **[tephdytech@gmail.com](mailto:tephdytech@gmail.com)** — include your raw footage, reference videos, and deadline!`;
  }

  // ─── Graphic Design request ──────────────────────────────────────────────
  if (isGraphicDesignRequest) {
    const topic = extractCreativeTopic(userQuery, 'design');
    return `### 🎨 Yes! Joseph can design that for you.

Joseph is a professional graphic designer with a rich portfolio on **[Behance](https://www.behance.net/sephamandy)**, covering brand identities, marketing materials, UI/UX systems, editorial layouts, and photo manipulation.

---

#### 🖌️ Your Project: **${topic}**

---

#### Phase 1 — Creative Brief & Discovery
- **Brief Questionnaire**: Understand your brand personality, target audience, industry, competitors, and aesthetic preferences.
- **Mood Board**: Curate visual references (color palettes, typography styles, layout inspirations) to align creative direction.
- **Concept Exploration**: Develop 2–3 initial concept directions for your review and selection.

---

#### Phase 2 — Design Execution
- **Digital Drafts**: High-fidelity design in the appropriate tool (see toolkit below).
- **Typography & Color System**: Select or establish a consistent type hierarchy and color palette aligned to your brand.
- **Iteration & Refinement**: Incorporate your feedback across up to 3 structured revision rounds.

---

#### Phase 3 — Final Delivery
- **Export Packages**: Print-ready PDF (CMYK), web-optimized PNG/SVG/WebP, and editable source files (AI, PSD, Figma).
- **Brand Style Guide** *(for branding projects)*: Document color codes, fonts, logo usage rules, and spacing guidelines.
- **Turnaround**: Logo / icon — 2–4 days · Poster / flyer — 1–2 days · Full brand kit — 5–10 days · UI/UX screens — quoted per scope.

---

🛠️ **Design Toolkit**:
- **Adobe Photoshop** — Photo manipulation, compositing, raster graphics, social media creatives.
- **Adobe Illustrator** — Vector logos, icons, illustrations, and print-ready artwork.
- **Figma** — UI/UX wireframes, design systems, and interactive prototypes.
- **Canva Pro** — Fast-turnaround social media templates and marketing materials.
- **Affinity Designer** — Complex editorial layouts and alternative vector/raster design.

---

📂 **See past design work**: Open the **Behance.art** icon on the desktop or visit **[behance.net/sephamandy](https://www.behance.net/sephamandy)**.

Ready to start? **Switch to the "Outlook Express" tab** to send a brief, or email **[tephdytech@gmail.com](mailto:tephdytech@gmail.com)** with your project details, deadline, and any reference images!`;
  }

  // ─── Dev / Software project inquiry ──────────────────────────────────────
  if (isDevProjectInquiry) {
    const topic = extractProjectTopic(userQuery);
    return `### 🚀 Yes! Joseph can definitely build that for you.

Joseph has extensive experience in full-stack engineering, API integrations, and intuitive UI/UX design. Here is an architectural blueprint and roadmap for how Joseph would approach building your **${topic}**:

---

#### 1. 🏗️ Proposed Architecture & Tech Stack
- **Frontend / Client Experience**: Next.js 15 (App Router) / React with TypeScript & Tailwind CSS for lightning-fast server rendering, SEO, and responsive cross-device usability.
- **Backend & Logic**: Node.js / Next.js Server Actions or Python / PHP REST APIs for robust business logic, validations, and secure data pipelines.
- **Database & State**: PostgreSQL or MySQL with Prisma ORM / SQL query optimization, paired with Redis for caching if high throughput is needed.
- **Authentication & Security**: Role-based access control (OAuth, NextAuth, or JWT sessions) with strict CSRF protection, input sanitization, and data encryption.
- **Integrations**: Stripe/PayPal payment webhooks, Cloudinary/AWS S3 for asset storage, and automated email/SMS notifications.

---

#### 2. 📦 Core Deliverables & Key Modules
1. **Interactive Client Interface**: Clean, accessible, mobile-first design with smooth state transitions.
2. **Administrative Control Center**: Dedicated admin dashboard for analytics, management, user auditing, and configuration.
3. **Secure API Layer**: Fully documented RESTful endpoints with rate limiting and automated logging.
4. **Automated Workflows**: Webhooks, scheduled cron tasks, and real-time event updates.

---

#### 3. 📅 Phased Implementation Roadmap
- **Phase 1: Discovery & UX Design (Week 1)**: Requirements gathering, wireframing, high-fidelity design mockups, and database schema planning.
- **Phase 2: Core Engineering & Integrations (Weeks 2–3)**: Database migrations, frontend component development, API routing, and third-party integrations.
- **Phase 3: QA, Optimization & Deployment (Week 4)**: Cross-browser testing, automated linting, security audits, and production deployment on Vercel/Cloud infrastructure.

---

Ready to bring this project to life? **Click over to the "Outlook Express" tab right here** to send Joseph a message, or drop him an email at **[tephdytech@gmail.com](mailto:tephdytech@gmail.com)**!`;
  }

  // ─── GitHub query ─────────────────────────────────────────────────────────
  if (isGitHubQuery) {
    const repoHighlights =
      repos.length > 0
        ? repos
          .slice(0, 5)
          .map(
            (r) =>
              `- **[${r.name}](${r.html_url})** (${r.language || 'Full-Stack'}): ${r.description || 'Public repository by @Tephdy'
              }${r.homepage ? ` — [Live Demo](${r.homepage})` : ''}`
          )
          .join('\n')
        : `- **Automations & Web Portals**: API-driven web systems, database integrations, and automated workflows.\n- **Full-Stack Projects**: Built using JavaScript, Next.js, PHP, Python, and SQL.`;

    return `### 💻 Joseph's GitHub Repositories & Engineering Portfolio

Joseph actively develops and shares open-source and client projects on GitHub under **[@Tephdy](https://github.com/Tephdy)**.

#### Featured Repositories:
${repoHighlights}

**What he can build for you in code:**
- Dynamic web applications using **Next.js, React, and Tailwind CSS**.
- Backend services & secure CRUD APIs with **PHP, Python, or Node.js**.
- Database architectures with **MySQL, PostgreSQL, and complex SQL queries**.
- Automation scripts using **Python and Google Apps Script**.

Want to explore all repositories? Visit **[github.com/Tephdy](https://github.com/Tephdy)** or open the **Projects/** window on the desktop!`;
  }

  // ─── Behance / general design showcase query ─────────────────────────────
  if (isBehanceQuery) {
    return `### 🎨 Joseph's Behance Visual & Creative Design Work

Beyond software engineering, Joseph has an extensive visual design portfolio hosted on **[Behance](https://www.behance.net/sephamandy)** spanning brand assets, UI/UX, and photography.

#### Selected Showcase Highlights:
- **Promotional Materials for Eve's Residences**: Comprehensive marketing campaign, commercial banners, and branding layouts.
- **UI/UX Design Systems**: Clean, component-focused digital product interfaces and usability workflows.
- **Brutalism & Typography**: Experimental brutalist poster design, typography compositions, and editorial layouts.
- **3D Product Mock-ups & Photo Manipulation**: Realistic packaging composites and surreal digital art.
- **Street & Wildlife Photography**: Dynamic compositions framing raw urban life and natural landscapes.

**Design Toolkit**: Adobe Photoshop, Illustrator, Figma, Canva, Affinity Designer, and CapCut.

You can inspect the full gallery by clicking the **Behance.art** icon on the desktop or visiting **[behance.net/sephamandy](https://www.behance.net/sephamandy)**!`;
  }

  // ─── Skills / tech stack query ───────────────────────────────────────────
  if (isSkillsQuery) {
    const stackSummary = TECH_STACK.map((t) => `**${t.name}** (${t.category})`).join(', ');
    const metersSummary = SKILL_METERS.map((m) => `\n- ${m.label}: **${m.percentage}%**`).join('');

    return `### 🛠️ Joseph Amandy's Technical Skillset & Diagnostic Profile

Joseph is a versatile full-stack engineer and digital creator:

#### ⚡ Core Stack:
${stackSummary}

#### 📊 Proficiency Metrics:
${metersSummary}

#### 🚀 Systems & Capabilities:
${CAPABILITY_FOCUS.map((c) => `- **${c.label}**: ${c.percentage}% relative focus`).join('\n')}

#### 🎬 Creative Services:
- **Graphic Design**: Logos, brand kits, posters, UI/UX, social media graphics — Adobe Photoshop, Illustrator, Figma, Canva.
- **Video Editing**: Any length — short reels to long-form productions — CapCut & Adobe Premiere Pro.

Looking for something specific? Ask me to plan a **custom web app**, a **graphic design project**, or a **video edit** — and I will generate a full creative brief and roadmap!`;
  }

  // ─── Bio / background query ──────────────────────────────────────────────
  if (isBioQuery) {
    return `### 👤 About Joseph Amandy

**Joseph Amandy** is an IT graduate from **ICCT Colleges**, a full-stack software developer, and a digital creator based in the Philippines.

- **Development Philosophy**: Translating complex business and operational challenges into smooth, robust, and user-friendly digital portals.
- **Versatility**: Capable of taking a project from initial concept, wireframing, and Figma mockups all the way through backend database design and live production deployment.
- **Creative Services**: Graphic design (logos, branding, UI/UX, posters) and video editing (any length — reels to long-form) using professional tools.
- **Interests**: Outdoor hiking, wildlife exploration, and street photography.

Feel free to ask me about his projects, or switch to the **Outlook Express** tab to contact him directly!`;
  }

  // ─── Default fallback ─────────────────────────────────────────────────────
  return `### Hello! I am the JA-OS AI Copilot.

I can help you navigate Joseph Amandy's work and plan your next project:

- **Dive into GitHub**: Ask *"What projects did Joseph build on GitHub?"*
- **Explore Behance**: Ask *"Show me his graphic design and branding work."*
- **Technical Skills**: Ask *"What is Joseph's primary tech stack?"*
- **Plan a Web App**: Ask *"Can you build an e-commerce platform / booking app / custom CRM?"*
- **Plan a Graphic Design**: Ask *"Can you design a logo / brand kit / poster for me?"*
- **Plan a Video Edit**: Ask *"Can you edit a 2-minute Instagram Reel / YouTube video / commercial?"*

How can I help you today?`;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function extractProjectTopic(query: string): string {
  const clean = query
    .replace(/^(can you build|can you make|can you create|can you develop|i need|build|make|create|how would you build|how will you build)/i, '')
    .replace(/^(a|an|the|for me|for my company|for us)/i, '')
    .trim();

  if (!clean || clean.length < 3) {
    return 'Custom Web Application';
  }

  return clean.charAt(0).toUpperCase() + clean.slice(1);
}

function extractCreativeTopic(query: string, type: 'video' | 'design'): string {
  const clean = query
    .replace(/^(can you|could you|i need|i want|please|help me|make me|create|design|edit|produce|do)/i, '')
    .replace(/^(a|an|the|for me|for my company|for us|me)/i, '')
    .trim();

  if (!clean || clean.length < 3) {
    return type === 'video' ? 'Custom Video Production' : 'Custom Graphic Design Project';
  }

  return clean.charAt(0).toUpperCase() + clean.slice(1);
}
