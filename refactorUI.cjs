const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'App.tsx');
let content = fs.readFileSync(filePath, 'utf-8');

// Phase 2: Cards & Panels
// 1. KPI Cards (4 cards)
content = content.replace(/className="p-5 rounded-xl border flex flex-col gap-2 bg-white border-slate-100 shadow-sm/g, 'className="card-surface flex flex-col gap-2');
// The 4th card has extra classes
content = content.replace(/card-surface flex flex-col gap-2 border-l-2 border-l-red-500 card-4/g, 'card-surface flex flex-col gap-2 border-l-[3px] border-l-red-500 card-4'); // made border thicker for emphasis

// 2. Gateway Status Grid Cards (160px min-h)
content = content.replace(/p-5 rounded-2xl bg-white shadow-sm border border-slate-200 hover:border-blue-300 hover:shadow-md transition-base/g, 'card-surface');
content = content.replace(/p-5 rounded-xl border border-slate-100 bg-white flex flex-col gap-4 animate-\[cardReveal_300ms_ease\] relative overflow-hidden shadow-lg/g, 'card-surface flex flex-col gap-4 animate-[cardReveal_300ms_ease] relative overflow-hidden');
content = content.replace(/p-5 rounded-2xl border border-amber-200 bg-amber-50\/50 shadow-sm animate-\[cardReveal_200ms_ease\] flex flex-col gap-4/g, 'card-surface border-amber-200 bg-amber-50/50 animate-[cardReveal_200ms_ease] flex flex-col gap-4');

// 3. Panels (Map, Accordion containers, Miller columns)
// rounded-2xl bg-white shadow-sm border border-slate-200 overflow-hidden
content = content.replace(/rounded-2xl bg-white shadow-sm border border-slate-200 overflow-hidden/g, 'panel-surface overflow-hidden');
// rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden flex flex-col
content = content.replace(/rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden/g, 'panel-surface overflow-hidden');
// bg-white border border-slate-200 rounded-xl shadow-lg
content = content.replace(/bg-white border border-slate-200 rounded-xl shadow-lg/g, 'glass-panel rounded-xl');


// Phase 3: Buttons
// Primary buttons
// px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-full shadow-sm transition-base
content = content.replace(/px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-full shadow-sm transition-base/g, 'btn-primary btn-sm');
content = content.replace(/px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-full shadow-sm/g, 'btn-primary btn-sm');
content = content.replace(/px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-full font-medium shadow-sm/g, 'btn-primary btn-sm');
content = content.replace(/px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-full shadow-sm/g, 'btn-primary btn-sm');
// px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-full shadow-sm ...
content = content.replace(/px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-full shadow-sm flex items-center gap-1.5 transition-base shadow-sm/g, 'btn-primary btn-lg');
content = content.replace(/px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-full shadow-sm transition-base/g, 'btn-primary btn-lg');

// Secondary buttons / Outline buttons
// px-4 py-1.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-medium rounded-full shadow-sm transition-base
content = content.replace(/px-4 py-1.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-medium rounded-full shadow-sm transition-base/g, 'btn-secondary btn-sm');
content = content.replace(/px-4 py-1.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 text-xs font-medium rounded-full shadow-sm transition-base/g, 'btn-secondary btn-sm');
// px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-full shadow-sm transition-base
content = content.replace(/px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-full shadow-sm transition-base/g, 'btn-secondary btn-lg');

// Phase 4: Headers & Typography
// Section Headers: text-xs font-semibold font-sans uppercase tracking-wider text-slate-500
content = content.replace(/text-xs font-semibold font-sans uppercase tracking-wider text-slate-500/g, 'section-header');
// text-xs uppercase tracking-wider font-semibold text-slate-500
content = content.replace(/text-xs uppercase tracking-wider font-semibold text-slate-500/g, 'section-header');
// text-sm font-bold uppercase tracking-wider text-slate-800 -> text-xs font-semibold uppercase tracking-wider text-slate-800
content = content.replace(/text-sm font-bold uppercase tracking-wider text-slate-800/g, 'section-header text-slate-800');

// Page titles
// text-2xl font-bold tracking-tight text-slate-900
content = content.replace(/text-2xl font-bold tracking-tight text-slate-900/g, 'title-primary');

// Phase 4: Badges (Status badges)
// e.g. text-xs font-medium uppercase bg-blue-50 text-blue-700 border border-blue-200 shadow-sm px-2.5 py-0.5 rounded-full font-bold
content = content.replace(/text-xs font-medium uppercase bg-blue-50 text-blue-700 border border-blue-200 shadow-sm px-2.5 py-0.5 rounded-full font-bold/g, 'badge bg-blue-50 text-blue-700 border-blue-200');
// text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 shadow-sm px-2 py-0.5 rounded uppercase font-bold
content = content.replace(/text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 shadow-sm px-2 py-0.5 rounded uppercase font-bold/g, 'badge bg-blue-50 text-blue-700 border-blue-200');
// px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200
content = content.replace(/px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/g, 'badge badge-online');
// px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200
content = content.replace(/px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200/g, 'badge badge-offline');

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Refactoring complete.');
