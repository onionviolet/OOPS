// Composed capture save: the ri-fang-yuan-wild-gu fixture plus a Moonglow Gu (the opener's requirement) and the feed record the
// day extension's feed row writes (simulation_effects knowledge shape). Composed, not played: the feed row needs Rank Two first.
import {writeFile} from 'node:fs/promises';
const [root, out, fed] = process.argv.slice(2);
const {buildWorldFixture} = await import(`${root}/scripts/headless/world_fixtures.mjs`);
const save = JSON.parse(await buildWorldFixture('ri-fang-yuan-wild-gu', {seed: 7}));
save.inventories.person.main_character[JSON.stringify({id: 'book.ri.lead.moonglow.moonglow_gu'})] = {count: 1};
const x = save.expansion;
if (fed) ((x.simulation.knowledge ||= {}).player ||= {})['book.ri.lead.day.fed.moonglow'] = {stage: 'seen', value: 'The Moonglow Gu has eaten.', at: x.clock, cause: 'composed.capture'};
await writeFile(out, JSON.stringify(save));
