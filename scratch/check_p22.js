const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'js', 'workbooks_keys.js');
let content = fs.readFileSync(filePath, 'utf8');

// Load catalog safely
global.window = {};
eval(content);
const catalog = window.WORKBOOKS_KEYS;

console.log('A2 keys before:', Object.keys(catalog.A2));
console.log('Page 21 exists:', !!catalog.A2['21']);
console.log('Page 22 exists:', !!catalog.A2['22']);
console.log('Page 23 exists:', !!catalog.A2['23']);
