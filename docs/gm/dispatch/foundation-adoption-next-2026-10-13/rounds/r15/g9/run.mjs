// Usage: start harness.mjs in this checkout, then node run.mjs.
// Harness requires the ignored private pack and retained private recipe.
import fs from 'node:fs';
const files=['helpers.js','controlled-clock.js','provider-fixture.js','n1.js','n2.js','n3.js','n4.js','n5.js','n4-fuel.js'];
for(const file of files){const response=await fetch('http://127.0.0.1:19191',{method:'POST',body:fs.readFileSync(new URL(file,import.meta.url),'utf8')});const result=await response.json();if(result?.error)throw Error(file+': '+result.error);console.log(file+': PASS');}
