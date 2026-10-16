const fs=require('node:fs'),assert=require('node:assert/strict');
const normalize=v=>Array.isArray(v)?v.map(normalize):v&&typeof v==='object'?Object.fromEntries(Object.entries(v).filter(([k])=>k!=='saved_at').map(([k,v])=>[k,normalize(v)])):v;
const [before,after]=process.argv.slice(2);assert.ok(before&&after,'Provide before and after JSON paths');
assert.deepEqual(normalize(JSON.parse(fs.readFileSync(after))),normalize(JSON.parse(fs.readFileSync(before))));
console.log('PASS: all saved/restored/imported/final envelopes equal; only saved_at ignored.');
