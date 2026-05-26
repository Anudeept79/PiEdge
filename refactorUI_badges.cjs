const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'App.tsx');
let content = fs.readFileSync(filePath, 'utf-8');

// Replace conditional badge strings
content = content.replace(/bg-red-50 text-red-700 border border-red-200 shadow-sm/g, 'badge badge-offline');
content = content.replace(/bg-red-50 text-red-700 border border-red-200/g, 'badge badge-offline');
content = content.replace(/bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm/g, 'badge badge-online');
content = content.replace(/bg-emerald-50 text-emerald-700 border border-emerald-200/g, 'badge badge-online');
content = content.replace(/bg-amber-50 text-amber-700 border border-amber-200 shadow-sm/g, 'badge badge-pending');
content = content.replace(/bg-amber-50 text-amber-700 border border-amber-200/g, 'badge badge-pending');
content = content.replace(/bg-\[rgba\(168,85,247,0\.08\)\] text-\[#A855F7\] border-\[rgba\(168,85,247,0\.20\)\]/g, 'badge badge-discovered');

// Replace inline style logic if needed
// Actually we already have badge-offline, etc.

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Badges refactoring complete.');
