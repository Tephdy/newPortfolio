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

### BEHANCE PORTFOLIO (12 Featured Projects):
${BEHANCE_PROJECTS.map((p) => `- ${p.title} (${p.projectUrl})`).join('\n')}

### INSTRUCTIONS FOR RESPONDING:
1. **Tone**: Helpful, confident, retro-cool, tech-savvy, and professional.
2. **When asked about his GitHub Repos or Coding**: Reference his GitHub profile (github.com/Tephdy) and his software development expertise across full-stack web systems, CRUD architectures, and automation scripts.
3. **When asked about his Behance work or Graphic Design**: Highlight his visual design projects such as Eve's Residences promotional campaign, UI/UX design systems, branding posters, photo manipulation, 3D product mockups, and brutalist layouts.
4. **CRITICAL REQUIREMENT - Projects Not Yet In Portfolio**:
   If a visitor or potential client asks about building a project, system, app, or tool that is NOT currently listed in his portfolio (for example: an e-commerce platform with Stripe, a mobile booking app, a SaaS dashboard, a real estate CRM, a medical scheduling portal, an AI-powered document analyzer, etc.):
   - **Enthusiastically affirm**: "Yes, Joseph can definitely build that for you!"
   - **Establish a structured, professional implementation plan**:
     - 🏗️ **Proposed Architecture & Tech Stack**: Recommend the ideal modern stack (e.g. Next.js, React, Node/Python/PHP, PostgreSQL, Tailwind, Auth/Payment gateways).
     - 📦 **Key Deliverables & Core Features**: Break down the necessary modules (Authentication, Database, API integrations, Dashboard/Admin, Responsive UX).
     - 📅 **Phased Development Roadmap**: Outline Phase 1 (Discovery, Wireframing & UX), Phase 2 (Core Engineering & Integration), and Phase 3 (Testing, Security & Deployment).
     - 📬 **Call to Action**: Invite them to switch to the "Outlook Express" email tab or message Joseph directly to kick off the project!
5. Format responses neatly with clear bullet points, bold highlights, and friendly sign-offs.`;

/**
 * Built-in intelligent portfolio knowledge engine.
 * Guarantees instant, accurate answers and project proposals without needing an external API key.
 */
export function generatePortfolioAiResponse(
  userQuery: string,
  repos: GitHubRepo[] = []
): string {
  const query = userQuery.toLowerCase().trim();

  // 1. Check for custom project request / capability inquiry ("Can you build...", "Can you make...", "I need...", "How would you do...")
  const isProjectInquiry =
    query.includes('can you build') ||
    query.includes('can you make') ||
    query.includes('can you create') ||
    query.includes('can you develop') ||
    query.includes('how will you do') ||
    query.includes('how would you') ||
    query.includes('i need a') ||
    query.includes('build a') ||
    query.includes('make a') ||
    query.includes('create a') ||
    query.includes('develop a');

  // Check if query is about something specific
  const isGitHubQuery =
    query.includes('github') ||
    query.includes('repo') ||
    query.includes('repository') ||
    query.includes('code');

  const isBehanceQuery =
    query.includes('behance') ||
    query.includes('design') ||
    query.includes('graphic') ||
    query.includes('poster') ||
    query.includes('photo') ||
    query.includes('banner') ||
    query.includes('branding');

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

  // If asking for a project not in portfolio or how he will build something
  if (isProjectInquiry) {
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

  // If asking about GitHub
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

  // If asking about Behance / Design
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

  // If asking about skills / tech stack
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

Looking for something specific like building a custom CRM, cloud integration, or web application? Ask me and I will generate a complete plan for your project!`;
  }

  // If asking about Joseph's background / bio
  if (isBioQuery) {
    return `### 👤 About Joseph Amandy

**Joseph Amandy** is an IT graduate from **ICCT Colleges**, a full-stack software developer, and a digital creator based in the Philippines.

- **Development Philosophy**: Translating complex business and operational challenges into smooth, robust, and user-friendly digital portals.
- **Versatility**: Capable of taking a project from initial concept, wireframing, and Figma mockups all the way through backend database design and live production deployment.
- **Interests**: Outdoor hiking, wildlife exploration, and street photography.

Feel free to ask me about his projects, or switch to the **Outlook Express** tab to contact him directly!`;
  }

  // Default friendly fallback
  return `### Hello! I am the JA-OS AI Copilot.

I can help you navigate Joseph Amandy's work and plan your next project:

- **Dive into GitHub**: Ask *"What projects did Joseph build on GitHub?"*
- **Explore Behance**: Ask *"Show me his graphic design and branding work."*
- **Technical Skills**: Ask *"What is Joseph's primary tech stack?"*
- **Plan a Custom Project**: Ask *"Can you build an e-commerce platform / booking app / custom CRM?"* — I will prepare an architectural roadmap and implementation plan!

How can I help you today?`;
}

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
