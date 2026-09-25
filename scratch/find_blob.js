const { execSync } = require('child_process');

const output = execSync('git fsck --lost-found', { encoding: 'utf8' });
const blobs = output
  .split('\n')
  .filter(l => l.startsWith('dangling blob'))
  .map(l => l.split(' ')[2].trim());

console.log('Total dangling blobs:', blobs.length);

for (const blob of blobs) {
  try {
    const size = parseInt(execSync(`git cat-file -s ${blob}`, { encoding: 'utf8' }).trim(), 10);
    // workbooks_keys.js is > 1000000 bytes
    if (size > 1000000) {
      console.log(`Blob ${blob} size: ${size}`);
      const content = execSync(`git cat-file -p ${blob}`, { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
      if (content.includes('window.WORKBOOKS_KEYS')) {
        console.log(`Blob ${blob} is window.WORKBOOKS_KEYS!`);
        if (content.includes('a2_p22_ex4')) {
          console.log(`>>> FOUND TARGET BLOB WITH a2_p22_ex4: ${blob}`);
        }
        if (content.includes('a2_p21_ex6')) {
          console.log(`>>> FOUND TARGET BLOB WITH a2_p21_ex6: ${blob}`);
        }
      }
    }
  } catch (e) {
    console.error(e.message);
  }
}
