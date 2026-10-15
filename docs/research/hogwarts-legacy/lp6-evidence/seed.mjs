// Controlled disposable pre-LP6 setup, not a user save or tutorial-route proof.
// Native envelope comes from this harness's clean-origin fresh character.
import fs from 'node:fs';
import {createFieldFixture,joinField,fieldCommand,fieldAdvance,wood} from '../../../../scripts/field_fixtures.mjs';
const save=JSON.parse(fs.readFileSync('/tmp/lp6-fresh.json','utf8'));
let p=joinField(createFieldFixture(),'craft');p=fieldCommand(p,'party.meet');p=fieldAdvance(fieldCommand(p,'party.prepare'),3);
save.expansion=p.state;save.character.money=p.external.money;
for(const [key,count] of Object.entries(p.gameplay.player.inventory))save.inventories.person.main_character[key]={count};
save.availabilities.textline['oldCraftsman:hello']=7;
save.availabilities.textline['villageElder:hello']=7;
save.availabilities.location.Shack=1;
// Expansion has no chronicle enrollment; align the native played calendar.
save['current time'].minute+=p.state.clock;
fs.writeFileSync('/tmp/lp6-seed.json',JSON.stringify(save));
console.log(JSON.stringify({clock:p.state.clock,logs:p.gameplay.player.inventory[wood],money:p.external.money,lp6Keys:Object.keys(p.state.actors.player.facts).filter(k=>k.includes('lp6'))}));
