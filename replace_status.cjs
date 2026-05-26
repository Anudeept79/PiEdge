const fs = require('fs');
let code = fs.readFileSync('c:/Anudeep/PIEdge app/src/App.tsx', 'utf8');

code = code.replace(/'PROVISIONED'/g, "'ONLINE'");
code = code.replace(/"PROVISIONED"/g, '"ONLINE"');
code = code.replace(/'DISCOVERED'/g, "'OFFLINE'");
code = code.replace(/"DISCOVERED"/g, '"OFFLINE"');

fs.writeFileSync('c:/Anudeep/PIEdge app/src/App.tsx', code);
console.log('Done status replacements');
