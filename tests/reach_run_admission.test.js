import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const source=readFileSync(new URL('../src/main.js',import.meta.url),'utf8');
const body=source.match(/function practiceRunReason\(\{toggle=false\}=\{\}\)\{([\s\S]*?)\n\}/)[1];
function reason({run=true,stamina=1,owns=true,busy=false,toggle=true}={}) {
 return Function('ownsSave','foundationSaveBlocked','importProbeToken','expansionState','current_combat','current_activity','is_reading','is_sleeping','current_dialogue','is_in_trade','nativeOccupationReason','character','revealFacts','toggle',body)(owns,false,false,{actors:{player:{worldId:'base.frontier'}}},busy,false,false,false,false,()=>false,()=>'',{getFullStats:()=>({stamina})},()=>({'reveal.run':run}),toggle);
}
test('real host Run admission allows low-stamina stop while travel continues walking and enabling still refuses',()=>{
 assert.equal(reason(),'');
 assert.match(reason({toggle:false}),/2 stamina.*walking/);
 assert.match(reason({run:false}),/2 stamina.*walking/);
 assert.match(reason({owns:false}),/Saving/);
 assert.match(reason({busy:true}),/current activity/);
 assert.equal(reason({run:false,stamina:2}),'');
});
