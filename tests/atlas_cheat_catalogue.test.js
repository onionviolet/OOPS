import test from 'node:test';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {loadCheatCatalogue,parseCheatCatalogue} from '../prototypes/world-atlas/cheat-catalogue.mjs';

test('each design catalogue family has unique expandable cheats with source and status',async()=>{
    const sections=await loadCheatCatalogue(fileURLToPath(new URL('..',import.meta.url)));
    assert.equal(sections.map(s=>s.id).join(''),'ABCDEFGHIJ');
    const cheats=sections.flatMap(s=>s.cheats);
    assert.equal(new Set(cheats.map(c=>c.id)).size,cheats.length);
    assert.ok(sections.every(s=>s.cheats.length && s.cheats.every(c=>c.effect && c.source && c.status)));
    for (const section of sections) {
        const compared=section.examples.map(example=>example.ordinary.split(' · ')[0]).sort();
        assert.deepEqual(compared,section.cheats.map(c=>c.id).sort(),section.name+' decision coverage');
        assert.ok(section.examples.every(e=>e.advantage && e.evidence));
    }
    assert.match(cheats.find(c=>c.id==='CTC1').status,/appraisal/i);
});

test('comparison examples stay with their family and unrelated tables are excluded',()=>{
    const [family]=parseCheatCatalogue([
        '## A. Information','| Ordinary decision | With the advantage | Evidence |',
        '| --- | --- | --- |','| Take the left route | Read the sign | Demonstrated |','',
        '| Other | Unrelated | Table |','## How to draw from it','| CTC1 | Stray |',
    ].join('\n'));
    assert.deepEqual(family.examples,[{ordinary:'Take the left route',advantage:'Read the sign',evidence:'Demonstrated'}]);
});
