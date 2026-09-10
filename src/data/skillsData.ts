export interface TechIcon {
  name: string;
  category: string;
  color: string;
}

export interface SkillMeter {
  label: string;
  percentage: number;
}

export interface CapabilityFocus {
  label: string;
  percentage: number;
  color?: string;
}

export const TECH_STACK: TechIcon[] = [
  { name: 'PHP', category: 'Backend', color: 'text-indigo-600' },
  { name: 'JavaScript', category: 'Frontend/Node', color: 'text-yellow-600' },
  { name: 'Python', category: 'Automation/Data', color: 'text-blue-600' },
  { name: 'SQL & MySQL', category: 'Database', color: 'text-green-600' },
  { name: 'Networking', category: 'Infrastructure', color: 'text-[#3d5a80]' },
  { name: 'Server Admin', category: 'DevOps/Linux', color: 'text-[#e07a5f]' },
  { name: 'Git & Automation', category: 'Tooling', color: 'text-[#90be6d]' },
  { name: 'UI / Graphics', category: 'Creative', color: 'text-[#f4a261]' },
];

export const SKILL_METERS: SkillMeter[] = [
  { label: 'Web Development', percentage: 92 },
  { label: 'Database Systems', percentage: 86 },
  { label: 'Networking', percentage: 78 },
  { label: 'Server Administration', percentage: 76 },
  { label: 'Automation & Scripting', percentage: 88 },
  { label: 'Graphics & Visual Design', percentage: 84 },
];

export const CAPABILITY_FOCUS: CapabilityFocus[] = [
  { label: 'Software Engineering', percentage: 92, color: '#e07a5f' },
  { label: 'Systems & Networking', percentage: 78, color: '#3d5a80' },
  { label: 'Server Operations', percentage: 76, color: '#90be6d' },
  { label: 'Graphics & Brand Design', percentage: 84, color: '#f4a261' },
];
