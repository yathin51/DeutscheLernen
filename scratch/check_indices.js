const fs = require('fs');
const content = fs.readFileSync('js/workbooks_keys.js', 'utf8');

const a2Index = content.indexOf('"A2": {');
console.log('A2 index:', a2Index);

const p23A1 = content.indexOf('"23": {');
console.log('p23 A1 index:', p23A1);

const p23A2 = content.indexOf('"23": {', a2Index);
console.log('p23 A2 index:', p23A2);

const p24A2 = content.indexOf('"24": {', a2Index);
console.log('p24 A2 index:', p24A2);
