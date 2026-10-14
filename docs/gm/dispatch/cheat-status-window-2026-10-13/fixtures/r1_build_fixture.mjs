// Run before source edits. Real optional start + real clock + real serializer.
import {writeFile} from 'node:fs/promises';
const repo = process.env.REPO;
if(!repo) throw Error('REPO required');
const {cheatGame} = await import(`file://${repo}/tests/helpers/cheat_game.mjs`);
const g = await cheatGame({start:'system-quests'});
try {
 const result = await g.page.evaluate(() => {
  const t=JSON.parse(__cheatTest.create_save())['current time'];
  const minutes=(3-t.day_count)*1440-t.hour*60-t.minute+10;
  const consumed=__cheatTest.advance(minutes);
  return {minutes,consumed,serialized:__cheatTest.create_save()};
 });
 const s=JSON.parse(result.serialized);
 if(result.minutes!==result.consumed || s['current time'].day_count!==3 || s.cheats.held['system-quests'].card.state.awakened!==false || g.errors.length) throw Error('fixture failed');
 await writeFile(new URL('r1_dormant_past_day3.save.txt',import.meta.url),result.serialized+'\n');
 await writeFile(new URL('r1_provenance.md',import.meta.url),'Built on unchanged ui/cheats-r1 cc5fa556 using cheatGame, real optional-start control, update_timer to day 3 00:10, and create_save. Seeded-native prerequisite, no fabricated envelope.\n');
 console.log('Built real dormant past-day-3 fixture');
} finally {await g.close();}
