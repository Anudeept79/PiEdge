const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src', 'App.tsx');
let content = fs.readFileSync(file, 'utf8');

// Color mapping (Dark to Light)
// We replace exact string matches for safety.
const mappings = {
  'bg-[#09090B]': 'bg-slate-50',
  'text-[#FAFAFA]': 'text-slate-900',
  'bg-[#18181B]': 'bg-white',
  'border-[#27272A]': 'border-slate-200',
  'text-[#52525B]': 'text-slate-400',
  'bg-[#111113]': 'bg-white',
  'border-[#1F1F23]': 'border-slate-100',
  'text-[#E4E4E7]': 'text-slate-800',
  'bg-[#1C1C20]': 'bg-slate-100',
  'text-[#A1A1AA]': 'text-slate-500',
  'hover:bg-[#1C1C20]': 'hover:bg-slate-100',
  'hover:text-[#FAFAFA]': 'hover:text-slate-900',
  'hover:text-[#A1A1AA]': 'hover:text-slate-600',
  'hover:border-[#3F3F46]': 'hover:border-slate-300',
  'border-[#3F3F46]': 'border-slate-300',
  'bg-[#0F0F12]': 'bg-slate-50',
  // Recharts specific colors (if any are hardcoded)
  'stroke="#1F1F23"': 'stroke="#E2E8F0"',
  'fill="#111113"': 'fill="#FFFFFF"',
  
  // Specific tweaks
  'dark_all': 'light_all', // Leaflet map tiles
  'bg-[#18181B]/40': 'bg-slate-50/60',
  'bg-[#09090B]/40': 'bg-white/60',
  'bg-[#09090B]/80': 'bg-white/80',
  'border-l-[#2563EB]': 'border-l-blue-500',
  'border-l-[#EF4444]': 'border-l-red-500',
  'border-l-[#F59E0B]': 'border-l-amber-500',
};

for (const [dark, light] of Object.entries(mappings)) {
  // global replace
  content = content.split(dark).join(light);
}

// Additional UX refinements (Gestalt)
// Elevate cards with softer shadows
content = content.split('shadow-lg').join('shadow-sm'); // Replace stark dark shadows
content = content.split('shadow-2xl').join('shadow-lg');
content = content.split('shadow-xl').join('shadow-md');
content = content.split('rounded-[10px]').join('rounded-xl'); // Softer corners
content = content.split('rounded-[7px]').join('rounded-lg'); // Softer corners
content = content.split('text-[#10B981]').join('text-emerald-600');
content = content.split('text-[#EF4444]').join('text-red-600');
content = content.split('text-[#F59E0B]').join('text-amber-600');

fs.writeFileSync(file, content, 'utf8');
console.log('App.tsx updated successfully for light mode.');
