import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import inventory_templates from '../src/data/inventory_templates.js';
// traders.js pulls the whole location graph, which does not load standalone in node,
// so read the declared template names from source instead of importing the module.
test('every trader names an inventory template that exists',()=>{
 const source=readFileSync(new URL('../src/data/traders.js',import.meta.url),'utf8');
 const entries=[...source.matchAll(/traders\["([^"]+)"\]\s*=\s*new TraderComponent\(\{[^}]*?inventory_template:\s*"([^"]+)"/g)];
 assert.ok(entries.length>=5,'trader declarations found');
 for(const [,name,template] of entries)assert.ok(Array.isArray(inventory_templates[template]),`${name} -> ${template}`);
});
