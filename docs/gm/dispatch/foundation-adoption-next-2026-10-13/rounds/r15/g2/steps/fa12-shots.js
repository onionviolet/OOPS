await importFile(path.join(out,'current-retort-complete-frozen.txt'));page.setDefaultTimeout(60000);
await act('factorio_retort.collect_resin');const collect=await row('factorio_retort.collect_residue');await collect.scrollIntoViewIfNeeded();
await page.screenshot({path:path.join(out,'current-fa12-occupied.jpg'),type:'jpeg',quality:60});
const dispose=await row('factorio_retort.dispose_filled_residue');await dispose.scrollIntoViewIfNeeded();
await page.screenshot({path:path.join(out,'current-fa12-dispose.jpg'),type:'jpeg',quality:60});
record('CURRENT-FA12-VISIBLE',{label:'seeded-native',built:built(),viewport:{width:1600,height:1100},collect:await collect.innerText(),dispose:await dispose.innerText(),batch:await rowText('factorio_retort.batch')});return 'visible rows captured';
