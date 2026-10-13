// Prepended to each step body by run-step.sh. Plays real time until courtyard work ends.
const idle = async (limit = 90) => {for (let i = 0; i < limit; i++) {const s = await h.save(); const st = h.mgState(s); if (!st.jobs.length && st.program?.status !== 'running') return s; await page.waitForTimeout(1000);} throw Error('courtyard work did not finish');};
const snap = async label => {const s = await h.save(); const st = h.mgState(s); (globalThis.journal ||= []).push({label, ...st, inventory: Object.fromEntries(Object.entries(s.inventories.person.main_character).filter(([k]) => /Courtyard|courtyard|Rough wood log|Linen cloth/.test(k)).map(([k, v]) => [JSON.parse(k).id, v.count]))}); return {label, st, s};};
const rows = async () => (await h.courtyard()).rows;
const has = async text => (await rows()).some(r => r.includes(text));
const enabled = async text => (await rows()).some(r => r.includes(text) && !r.startsWith('[x]'));
const expect = (ok, msg) => {if (!ok) throw Error('EXPECT: ' + msg);};
