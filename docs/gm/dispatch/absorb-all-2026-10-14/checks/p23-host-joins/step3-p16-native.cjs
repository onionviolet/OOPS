const gate=require('./lib/native-step3-helper.inc');
gate('P16-encounter-profiles',async h=>{const {p,assert,gates,boot,enroll,proto,button,act,save,until,roundtrip,reject,quota,load}=h;
 const old=await boot();assert.equal(old.p23EncounterProfile,undefined);assert.equal(old.p23EncounterReceipt,undefined);
 // Use the actual finite funded native gear stock before choosing this fight.
 // The old fixture carries no weapon; no new combat XP or rewards are seeded.
 await p.evaluate(()=>window.startTrade('villageTrader'));
 const weapon=p.locator('#trader_inventory_div .inventory_item_control').filter({has:p.locator('.item_name').filter({hasText:/Cheap iron (sword|axe|spear|hammer)/})}).first();
 assert.ok(await weapon.count(),'Actual native trader has an affordable starter weapon');await weapon.click();
 const vest=p.locator('#trader_inventory_div .inventory_item_control').filter({has:p.locator('.item_name').filter({hasText:/Cheap leather vest/})}).first();
 if(await vest.count())await vest.click();const shield=p.locator('#trader_inventory_div .inventory_item_control').filter({has:p.locator('.item_name').filter({hasText:/Wooden training shield/})}).first();if(await shield.count())await shield.click();await p.locator('#accept_trade_button').click();await p.locator('#exit_trade_button').click();
 const bought=await save();assert.ok(bought.character.money<old.character.money);
 const newKeys=Object.keys(bought.inventories.person.main_character).filter(key=>!old.inventories.person.main_character[key]);
 const weaponKey=newKeys.find(key=>JSON.parse(key).components?.head);assert.ok(weaponKey,'Paid weapon has its exact native physical key');
 for(const key of [...newKeys,...Object.keys(old.inventories.person.main_character).filter(key=>JSON.parse(key).id==='Cheap leather pants')])await p.evaluate(key=>window.equip_item(key),key);
 const geared=await save();assert.ok(geared.character.equipment.weapon);gates.push('Actual funded native starter weapon and available armor, native equip before training, no feature XP or receipts seeded');
 // Labelled old native experience prerequisite control. This imports existing
 // character/skill history only; no training rank, attempt, kill or reward is set.
 const experienced=await save();experienced.levels.person.main_character.total_xp=1000;experienced.character.xp.total_xp=1000;
 Object.assign(experienced.levels.person.main_character.skill_xp,{Combat:5000,'Shield blocking':2000,Axes:1000});
 experienced.character.hp_to_full=0;experienced.character.stamina_to_full=0;
 await load(experienced,'earned-old-native-combat-prerequisite');
 assert.equal((await save()).p23EncounterProfile,undefined);gates.push('Labelled old native character/Combat/Axes/Shield-blocking experience control; actual purchased gear retained, all new encounters/rewards remain absent');
 await enroll();await proto();await button('Walk to Proto23 Dojo lobby');assert.equal((await save())['current location'],'Proto23 Dojo lobby');
 await quota('[data-encounter-profile="enter"]');assert.equal((await save()).p23EncounterProfile,undefined);
 await act('data-encounter-profile','enter');let s=await save();assert.equal(s['current location'],'Proto23 reed-circle training');assert.ok(s.p23EncounterProfile.pending);assert.equal(s.native_encounter.enemies[0].template,'Reed-circle sparring construct');const level=s.p23EncounterProfile.pending.level;assert.ok(level>=1&&level<=3);assert.equal(s.native_encounter.enemies[0].stats.health,24+(level-1)*8);
 await roundtrip('pending-native-training',s=>({pending:s.p23EncounterProfile.pending,encounter:s.native_encounter,streams:s.expansion.streams}));const first=await until(s=>s.p23EncounterProfile.completed===1,'first actual native construct defeat',180000);assert.equal(first['current location'],'Proto23 Dojo lobby');assert.equal(first.p23EncounterReceipt.level,level);assert.equal(first.p23EncounterProfile.pending,null);assert.equal(first.locations['Proto23 reed-circle training'].enemy_groups_killed,1);gates.push('Native pending rank/HP/cooldown/seed restoration, actual defeat XP and return travel share one receipt');
 await roundtrip('settled-native-training',s=>({profile:s.p23EncounterProfile,receipt:s.p23EncounterReceipt,groups:s.locations['Proto23 reed-circle training'].enemy_groups_killed}));
 for(let target=2;target<=3;target++){await act('data-encounter-profile','enter');s=await until(s=>s.p23EncounterProfile.completed===target,'repeat actual clear '+target,180000);assert.equal(s.locations['Proto23 reed-circle training'].enemy_groups_killed,target);assert.equal(s.p23EncounterReceipt.completed,target);}
 gates.push('Three separately entered real native encounters, repeatable settlement and matching cleared-group owner');const completed=s.p23EncounterProfile.completed;await act('data-encounter-profile','enter');await act('data-encounter-profile','leave');s=await save();assert.equal(s.p23EncounterProfile.completed,completed);assert.equal(s['current location'],'Proto23 Dojo lobby');await roundtrip('abandoned-native-training',s=>({profile:s.p23EncounterProfile,receipt:s.p23EncounterReceipt}));const bad=await save();bad.p23EncounterProfile.schema=999;await reject(bad,'P16-unsupported');
}).catch(e=>{console.error(e);process.exitCode=1;});
