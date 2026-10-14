await boot2('retort-merchant');page.setDefaultTimeout(60000);
const before=await save();const text=await rowText('factorio_retort.batch');
assert.equal(inv(before,'Empty retort resin tray'),0);
assert.equal(before.inventories.trader.villageTrader[JSON.stringify({id:'Empty retort resin tray'})].count,1);
const r=await row('factorio_retort.batch');assert.equal(await r.locator('button').first().isDisabled(),true);
const j={label:'seeded-native',built:built(),playerReceiver:0,merchantReceiver:1,batchText:text,batchDisabled:true,sourceRefresh:'fixture/MERCHANT-SOURCE.json (source only)'};
j.restoration=await restoration('current-merchant-receiver');record('CURRENT-MERCHANT',j);return j;
