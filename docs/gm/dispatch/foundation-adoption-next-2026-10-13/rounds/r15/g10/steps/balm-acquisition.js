await reload();await fixture('g1','fixture/fa07-base-new-game-export.txt');
const seed=await page.evaluate(()=>{G.character.name='TEST FIXTURE R15 G10 Swamp acquisition';G.character.money=10000;G.locations['Swampland tribe'].getAvailabilityComponent().setStatus({is_unlocked:true});G.move('Swampland tribe');const t=G.traders['swampland trader'];let tries=0;while(!t.getTradeInventory()[JSON.stringify({id:'Healing balm'})]&&tries<100){t.last_refresh=-1;t.refresh(G.context());tries++;}return {tries,stock:t.getTradeInventory()[JSON.stringify({id:'Healing balm'})]?.count};});
assert.ok(seed.stock>0);await save();const f=await h.exportFile('balm-before-trade.txt');await importFile(f.file);await stop();
await page.evaluate(()=>window.start_trade('swamplandTrader'));await stop();
const before=await save();const buttons=await page.locator('body').innerText();
// Native trade list and native accept control. No player balm seeded.
await page.evaluate(()=>window.add_to_buying_list({item_key:JSON.stringify({id:'Healing balm'}),count:1}));
await page.evaluate(()=>window.accept_trade());await stop();await page.evaluate(()=>window.exit_trade());const after=await save();
assert.equal(inv(before,'Healing balm'),0);assert.equal(inv(after,'Healing balm'),1);assert.ok(after.character.money<before.character.money);
const E={label:'seeded-native',seed:'Swamp access and purse, real probabilistic TraderComponent.refresh until stock; no balm added to player',...seed,money:[before.character.money,after.character.money],balm:[0,1],stockText:buttons.slice(-500),persistence:await persist('balm-acquired')};h.write('balm-acquisition.json',E);return E;
