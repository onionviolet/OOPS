const E={label:'seeded-native',cases:[]};
await reload();await importFile('/private/tmp/r15-g10-g2-fixtures/TEST-FIXTURE-R15-G2-reserve.txt');await page.evaluate(()=>G.character.name='TEST FIXTURE R15 G10 keyboard reserve');
for(const [text,key] of [['Keep a finite survey-kit reserve','Enter'],['Pause kit reserve','Space'],['Resume kit reserve','Enter'],['Cancel reserve and refund','Space']])E.cases.push(await keyAction('#feature_expansion_panel',text,key));
await reload();await fixture('g2','fixture/TEST-FIXTURE-R15-G2-retort.txt');await page.evaluate(()=>G.character.name='TEST FIXTURE R15 G10 keyboard retort');
E.cases.push(await keyAction('#feature_expansion_panel','Plan three retort batches'));await advance(3);
for(const [text,key] of [['Collect the resin','Enter'],['Dispose','Space'],['Resume retort plan','Enter'],['Stop future retort batches','Space']]){E.cases.push(await keyAction('#feature_expansion_panel',text,key));if(text==='Dispose')await advance(1);}
await advance(3);E.cases.push(await keyAction('#feature_expansion_panel','Collect the resin'));
await reload();await fixture('g1','fixture/fa07-base-new-game-export.txt');await page.evaluate(()=>G.character.name='TEST FIXTURE R15 G10 keyboard');
for(const [text,key] of [['Visit the market courtyard','Enter'],['Buy one Rough wood log','Space'],['Inspect Orin','Enter'],['Fund one production share','Space'],['Make Orin','Enter']])E.cases.push(await keyAction('#management_panel',text,key));
E.cases.push(await keyAction('#management_panel','Cancel Make Orin','Space'));
const attached=await page.locator('#management_panel').evaluate(p=>p.isConnected);assert.ok(attached);E.reattached=attached;
E.persists=await persist('keyboard-courtyard');h.write('keyboard.json',E);await openPanels();await page.screenshot({path:path.join(h.evidence,'keyboard-1600x1100.jpg'),type:'jpeg',quality:65});return E;
