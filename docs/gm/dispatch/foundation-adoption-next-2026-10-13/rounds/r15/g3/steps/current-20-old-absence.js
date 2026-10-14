globalThis.runName='current-old';globalThis.steps=[];log=[];
await importFile(path.join(dir,'fixture/TEST-FIXTURE-R15-G3-OLD.txt'));
await page.waitForTimeout(1000);await waitPlay();await play();
let s=await save();check(s.character.name==='TEST FIXTURE R15 G3 OLD','old fixture hero');
const absent=e=>!Object.keys(e.actors.player.facts).some(k=>/^(steam\.boh\.|nethack_fieldcraft\.|game_absorption_assay\.)/.test(k)) && !e.referenceGameplay?.fieldcraft && !Object.keys(e.simulation.knowledge?.player||{}).some(k=>/^(steam\.boh\.|nethack_fieldcraft\.|game_absorption_assay\.)/.test(k));
check(absent(s.expansion),'old save has no optional domain');
const before=brief(s),persistence=await checkpoint2('current-old-absent');
s=await stored();check(absent(s.expansion),'render Save reload Export Import never enroll absent domains');
return {label:'seeded-native',result:'PASS',before,persistence,after:brief(s),errors};
