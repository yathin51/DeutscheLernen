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
    if (size > 1000000) {
      const match = execSync(`git cat-file -p ${blob} | Select-String -Pattern "4.3. Konditionalsätze"`, { encoding: 'utf8', shell: 'powershell' });
      if (match) {
        console.log(`>>> FOUND BLOB WITH '4.3. Konditionalsätze': ${blob}, size: ${size}`);
      }
    }
  } catch (e) {
    // pattern not found
  }
}
