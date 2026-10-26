// Fixture-only regression for the actual global/local clock distinction.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {fixture,envelope,move,act} from './fixture.mjs';
import {Game_Time} from '../../../../../../../src/game_time.js';
import {observeLifeSave} from '../../../../../../../src/life_record.js';
const calendar=t=>({year:t.year,month:t.month,day:t.day,hour:t.hour,minute:t.minute,day_count:t.day_count});
let p=fixture();const originalLife=JSON.stringify(p.raw.life_record),raw=envelope(p),expected=new Game_Time(p.raw['current time']);expected.goUp(p.state.clock-p.raw.expansion.clock);
assert.deepEqual(raw['current time'],calendar(expected));assert.notEqual(raw['current time'].year,raw.book_world_mol_native.worldOwners[0].calendar.year);assert.equal(JSON.stringify(raw.life_record),originalLife);
p=move(p,'station');p=act(p,'book.mol.return');const returned=envelope(p);assert.equal(returned['current location'],'Village');assert.equal(returned.expansion.actors.player.worldId,'base.frontier');assert.doesNotThrow(()=>observeLifeSave(returned.life_record,returned));assert.equal(JSON.stringify(p.raw.life_record),originalLife);
const result={nativeClockPreserved:true,globalCalendar:raw['current time'],cyoriaCalendar:raw.book_world_mol_native.worldOwners[0].calendar,actualReturnEnvelopeChronologyPasses:true,sourceBiographyUnchanged:true,scope:'fixture builder and native envelope, not a browser return claim'};
fs.writeFileSync(new URL('./evidence/fixture-clock-check.json',import.meta.url),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
