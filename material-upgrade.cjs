const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src', 'App.tsx');
let content = fs.readFileSync(file, 'utf8');

// 1. Root Layout & Sidebar Separation
content = content.replace('className="min-h-screen bg-white font-sans', 'className="min-h-screen bg-slate-50 font-sans');
content = content.replace('bg-slate-50 border-r border-slate-100 z-30', 'bg-white border-r border-slate-200 z-30 shadow-[4px_0_24px_rgba(0,0,0,0.02)]');
content = content.replace('bg-white border-b border-slate-100 z-40', 'bg-white border-b border-slate-200 z-40 shadow-sm');

// Fix sidebar active state
content = content.replaceAll("bg-slate-100 text-slate-900 ${!sidebarCollapsed ? 'border-l-2 border-[#2563EB] pl-[10px]' : ''}", "bg-blue-50 text-blue-700 font-semibold");

// 2. Organisation Page
// Miller columns container
content = content.replace('border border-slate-100 rounded-xl bg-white overflow-hidden h-[calc(100vh-220px)]', 'rounded-2xl bg-white shadow-sm border border-slate-200 overflow-hidden h-[calc(100vh-220px)]');
// Miller columns active items
content = content.replaceAll("bg-slate-100 border-l-2 border-l-blue-500 pl-[14px]", "bg-blue-50/60");

// 3. Fleet OTA & Status Page
// Fix the micro-bars
content = content.replaceAll('bg-[#27272A]', 'bg-slate-100');

// Fix KPI cards in Fleet
content = content.replace('border-l-2 border-l-blue-500', '');
content = content.replace('border-l-2 border-l-[#10B981]', '');
content = content.replace('border-l-2 border-l-amber-500', '');
content = content.replace('border-l-2 border-l-red-500', '');

// Add shadow-sm and padding to KPI cards (it has p-4, let's make it p-5 rounded-2xl shadow-sm)
content = content.replaceAll('p-4 rounded-xl bg-white border border-slate-100 flex flex-col gap-1', 'p-5 rounded-2xl bg-white shadow-sm border border-slate-200 flex flex-col gap-1');

// Redesign table headers for Material (remove tracking-wider and uppercase where it looks too hacker)
content = content.replaceAll('text-xs font-mono uppercase tracking-wider text-slate-400', 'text-xs font-medium text-slate-500');

// Redesign standard buttons
content = content.replaceAll('px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-mono font-bold rounded-lg', 'px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-full shadow-sm');
content = content.replaceAll('px-4 py-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-mono font-bold rounded-lg', 'px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-full shadow-sm');
content = content.replaceAll('px-2.5 py-1 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs rounded transition-base font-bold', 'px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-full font-medium shadow-sm');

// Clean up waiting room banner
content = content.replace('p-5 rounded-xl border-2 border-[rgba(245,158,11,0.25)] bg-[rgba(245,158,11,0.03)] shadow-lg', 'p-5 rounded-2xl border border-amber-200 bg-amber-50/50 shadow-sm');

// Change "font-display uppercase tracking-wider" to standard Material Headline
content = content.replaceAll('text-xl font-display uppercase tracking-wider text-slate-900', 'text-2xl font-bold tracking-tight text-slate-900');

fs.writeFileSync(file, content, 'utf8');
console.log('Material Design upgrade script applied.');
