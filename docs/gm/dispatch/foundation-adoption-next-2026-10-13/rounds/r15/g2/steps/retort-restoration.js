const j=JSON.parse(fs.readFileSync(path.join(out,'CURRENT-RETORT.json'),'utf8'));
assert.equal(cursor(await peek()).status,'complete');
j.prePlayRestoration=await restoration('current-retort-complete-frozen');
assert.deepEqual(j.prePlayRestoration.reloadDiff,[]);assert.deepEqual(j.prePlayRestoration.importDiff,[]);
record('CURRENT-RETORT',j);return j.prePlayRestoration;
