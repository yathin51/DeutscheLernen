const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'js', 'workbooks_keys.js');
const content = fs.readFileSync(filePath, 'utf8');

// Find '"21":' inside the A2 object
const a2Index = content.indexOf('"A2": {');
const p21Index = content.indexOf('"21":', a2Index);
const p23Index = content.indexOf('"23":', a2Index);

console.log('A2 index:', a2Index);
console.log('Page 21 index:', p21Index);
console.log('Page 23 index:', p23Index);

// Let's see the text between end of 21 and start of 23
const snippet = content.substring(p23Index - 50, p23Index + 50);
console.log('Snippet around 23:\n', snippet);
