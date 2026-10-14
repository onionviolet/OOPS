// FA13 natural continuation: literal-file Import of the genuine R8 earned export on a fresh profile.
globalThis.runName = 'fa13'; globalThis.steps = [];
await page.waitForTimeout(1500);
await page.locator('#loading_screen_play_button').click().catch(() => {});
await page.waitForTimeout(500);
await importFile(path.join(dir, '../../r8/final-earned-native.txt'));
await play(); await page.waitForTimeout(1000);
globalThis.fsec = async () => ({clouded: await sec("Eda's clouded batch"), fieldcraft: await sec("Eda's bench fieldcraft"), feats: await sec('Field feats')});
const r = await record('fa13-imported');
const v = await fsec();
const brief2 = x => ({buttons: x.buttons.map(b => b.label), records: x.records.length});
return {name: (await stored()).character.name, clock: r.clock, money: r.money, bundle: await bundleBinding('fa13-start'),
  clouded: brief2(v.clouded), fieldcraft: brief2(v.fieldcraft), feats: v.feats};
