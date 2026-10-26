// Disclosed supplied-stock fixture from L2's real-command builder. Root native
// calendar and the separate retained Cyoria calendar are distinct authorities.
import fs from 'node:fs';
import {fixture,envelope} from '../L2/fixture.mjs';
import {Game_Time} from '../../../../../../../src/game_time.js';
import {observeLifeSave} from '../../../../../../../src/life_record.js';
const p=fixture(),raw=envelope(p),native=new Game_Time(p.raw['current time']);
const elapsed=p.state.clock-p.raw.expansion.clock;
if(!Number.isSafeInteger(elapsed)||elapsed<0)throw Error('Fixture requires an actual forward command-clock delta.');
native.goUp(elapsed);
raw['current time']={year:native.year,month:native.month,day:native.day,hour:native.hour,minute:native.minute,day_count:native.day_count};
// Preserve the original biography and all dates; simply check that this real
// native clock supports eventual Village observation rather than clamping it.
observeLifeSave(raw.life_record,{...raw,expansion:{...raw.expansion,actors:{...raw.expansion.actors,player:{...raw.expansion.actors.player,worldId:'base.frontier'}}}});
fs.mkdirSync(new URL('./evidence/',import.meta.url),{recursive:true});
fs.writeFileSync(new URL('./evidence/TEST-FIXTURE-G7-L3-pre-assembly.txt',import.meta.url),'YAIR-UTF8-1:'+Buffer.from(JSON.stringify(raw)).toString('base64')+'\n');
console.log(JSON.stringify({fixture:'G7-L3 native-clock-correct pre-assembly supplied-stock QA',earnedClockDelta:elapsed,nativeCalendar:raw['current time'],cyoriaCalendar:raw.book_world_mol_native.worldOwners[0].calendar,lifeRecordUnchanged:JSON.stringify(raw.life_record)===JSON.stringify(p.raw.life_record)}));
