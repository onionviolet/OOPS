// P4 probe: a failed durable save write during a courtyard purchase must leave live and stored state unchanged;
// after storage recovers, one retry buys exactly one log.
const inv = s => s.inventories.person.main_character;
const log = '{"id":"Rough wood log"}';
const before = await h.save();
const purse = () => page.evaluate(() => document.body.innerText.match(/Your purse contains:[^\n]*/)?.[0]);
const purseBefore = await purse();
await page.evaluate(() => {window.__realSet = Storage.prototype.setItem; Storage.prototype.setItem = function (k, v) {if (/save/.test(k)) throw new DOMException('QuotaExceededError (test injection)', 'QuotaExceededError'); return window.__realSet.call(this, k, v);};});
let notice;
try {notice = await h.mg('Buy one Rough wood log');} catch (e) {notice = 'click error: ' + e.message;}
await page.waitForTimeout(1500);
const purseDuring = await purse();
const storedDuring = await h.saved();
await page.evaluate(() => {Storage.prototype.setItem = window.__realSet;});
await page.waitForTimeout(1500);
const afterRecover = await h.save();
const purseAfterRecover = await purse();
const retryNotice = await h.mg('Buy one Rough wood log').catch(e => 'retry error: ' + e.message);
const after = await h.save();
const result = {notice, purseBefore, purseDuring, purseAfterRecover, retryNotice,
    storedUnchanged: JSON.stringify(h.mgState(storedDuring)) === JSON.stringify(h.mgState(before)),
    recoveredSameAsBefore: {money: [before.character.money, afterRecover.character.money], logs: [inv(before)[log]?.count, inv(afterRecover)[log]?.count], mira: [h.mgState(before).npc['mg.mira'].coins, h.mgState(afterRecover).npc['mg.mira'].coins]},
    afterRetry: {money: after.character.money, logs: inv(after)[log]?.count, mira: h.mgState(after).npc['mg.mira'].coins}, errors: h.errors};
h.write('P4-failed-publication.json', result);
return result;
