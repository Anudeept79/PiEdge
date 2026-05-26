const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src', 'App.tsx');
let content = fs.readFileSync(file, 'utf8');

// 1. Resolve Conflicting Typography Classes
content = content.replace(/font-sans font-medium/g, 'font-medium');
content = content.replace(/font-medium font-bold/g, 'font-bold');
content = content.replace(/font-medium font-semibold/g, 'font-semibold');
content = content.replace(/font-medium text-xs font-bold/g, 'text-xs font-bold');
content = content.replace(/font-medium text-sm font-bold/g, 'text-sm font-bold');
content = content.replace(/font-medium text-base font-semibold/g, 'text-base font-semibold');
content = content.replace(/font-medium font-bold/g, 'font-bold'); // Catch-all just in case
content = content.replace(/font-sans font-semibold/g, 'font-semibold');
content = content.replace(/font-sans font-bold/g, 'font-bold');

// Replace any remaining font-display or font-heading just in case (should be gone, but just in case)
content = content.replace(/font-display/g, 'font-bold tracking-tight');
content = content.replace(/font-heading/g, 'font-bold tracking-tight');
content = content.replace(/font-sans-body/g, 'font-medium');

// 2. Gateway Status Grid Redesign
// Old: `p-4 rounded-xl border bg-white border-slate-100 hover:border-slate-300 hover:scale-[1.01] transition-base flex flex-col justify-between min-h-[160px] relative`
// New: `p-5 rounded-2xl bg-white shadow-sm border border-slate-200 hover:border-blue-300 hover:shadow-md transition-base flex flex-col justify-between min-h-[160px] relative`
content = content.replace(/p-4 rounded-xl border bg-white border-slate-100 hover:border-slate-300 hover:scale-\[1.01\]/g, 'p-5 rounded-2xl bg-white shadow-sm border border-slate-200 hover:border-blue-300 hover:shadow-md');

// 3. Physical Layout Accordion Redesign
// old: `rounded-xl border border-slate-100 bg-white overflow-hidden`
// new: `rounded-2xl bg-white shadow-sm border border-slate-200 overflow-hidden`
content = content.replace(/rounded-xl border border-slate-100 bg-white overflow-hidden/g, 'rounded-2xl bg-white shadow-sm border border-slate-200 overflow-hidden');

// loc headers: `px-5 py-3.5 bg-white\/40 border-b border-slate-100` -> `px-5 py-4 bg-slate-50\/50 border-b border-slate-200`
content = content.replace(/px-5 py-3.5 bg-white\/40 border-b border-slate-100/g, 'px-5 py-4 bg-slate-50/50 border-b border-slate-200');

// nested groups: `p-4 rounded-lg border border-slate-100 bg-slate-50\/40` -> `p-5 rounded-xl border border-slate-200 bg-slate-50`
content = content.replace(/p-4 rounded-lg border border-slate-100 bg-slate-50\/40/g, 'p-5 rounded-xl border border-slate-200 bg-slate-50');

// 4. Map Container Fix
// map wrapper: `rounded-xl border border-slate-100 overflow-hidden bg-white shadow-sm` -> `rounded-2xl bg-white shadow-sm border border-slate-200 overflow-hidden`
content = content.replace(/rounded-xl border border-slate-100 overflow-hidden bg-white shadow-sm/g, 'rounded-2xl bg-white shadow-sm border border-slate-200 overflow-hidden');
// map header: `px-5 py-3.5 border-b border-slate-100 flex items-center justify-between` -> `px-5 py-4 bg-white border-b border-slate-200 flex items-center justify-between`
content = content.replace(/px-5 py-3.5 border-b border-slate-100 flex items-center justify-between/g, 'px-5 py-4 bg-white border-b border-slate-200 flex items-center justify-between');

// 5. Waiting Room / Discoveries Redesign
content = content.replace(/p-4 bg-white border border-slate-200 rounded-\[8px\]/g, 'p-5 bg-white border border-slate-200 rounded-xl shadow-sm');
content = content.replace(/p-4 bg-white border border-slate-100 rounded-\[8px\]/g, 'p-5 bg-white border border-slate-200 rounded-xl shadow-sm');

// Fix global titles
content = content.replace(/text-xl font-bold tracking-tight uppercase tracking-wider text-slate-900/g, 'text-2xl font-bold tracking-tight text-slate-900');
content = content.replace(/text-xl font-bold tracking-tight text-slate-900/g, 'text-2xl font-bold tracking-tight text-slate-900');

fs.writeFileSync(file, content, 'utf8');
console.log('Component standardization applied.');
