const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: fs.createReadStream('C:\\Users\\user\\.gemini\\antigravity\\brain\\648a4e2e-1e05-48d1-9776-f1349ccdb3de\\.system_generated\\logs\\transcript_full.jsonl'),
  crlfDelay: Infinity
});

rl.on('line', (line) => {
  if (line.includes('"step_index":1653')) {
    const obj = JSON.parse(line);
    console.log('step 1653 media:', JSON.stringify(obj.media, null, 2));
    console.log('step 1653 user request start:', (obj.content || '').slice(0, 300));
  }
});
