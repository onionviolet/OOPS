import fs from 'node:fs';
import assert from 'node:assert/strict';
const base=process.argv[2]||'http://127.0.0.1:4187',folder='docs/representations/evidence/atlas-reader-visual-2026-11-25/';
const reasons=['unindexed','missing','unattested','partial','errors'],results=[];
for(const world of ['hp','mol','ri','lotm','ark']){
 const report=JSON.parse(fs.readFileSync('work/atlas-snapshot/readiness/'+world+'.json'));
 const summary=await(await fetch(base+'/reading-readiness?world='+world)).json();assert.equal(summary.status,'measured');assert.equal(summary.report.followups.status,'available');assert.equal(summary.report.followups.files,undefined);
 for(const reason of reasons){
  const reasonMatches=row=>reason==='unindexed'?row.counts.unindexedRows>0:reason==='errors'?(row.counts.parseErrors||0)+(row.counts.readErrors||0)>0:row.counts[reason]>0;
  const expected=report.followups.files.filter(reasonMatches),url=base+'/reading-readiness-followups?world='+world+'&reason='+reason+'&limit=2';
  const page=await(await fetch(url)).json();assert.equal(page.status,'measured');assert.equal(page.availability,'available');assert.equal(page.total,expected.length);assert.ok(page.files.length<=2);
  for(const file of page.files){assert.ok(file.reasons.includes(reason));assert.equal(file.route,'#library/outputs/'+[file.key,file.prefix,file.pass,file.kind].map(encodeURIComponent).join('/'));assert.deepEqual(Object.keys(file).sort(),['counts','key','kind','pass','prefix','reasons','route']);}
  if(reason==='unindexed'&&expected.length){const max=Math.max(...expected.map(row=>row.counts.unindexedRows));assert.equal(page.files[0].counts.unindexedRows,max);}
  let next=null;if(expected.length>2){next=await(await fetch(url+'&offset=2')).json();assert.equal(next.total,page.total);assert.ok(!page.files.some(a=>next.files.some(b=>a.route===b.route)));}
  results.push({world,reason,total:page.total,status:page.status,availability:page.availability,first:page.files,next:next?.files});
 }
}
for(const query of ['world=hp&reason=private','world=hp&limit=51','world=hp&offset=-1'])assert.equal((await fetch(base+'/reading-readiness-followups?'+query)).status,400);
assert.equal((await fetch(base+'/reading-readiness-followups?world=unknown')).status,404);
const before=JSON.parse(fs.readFileSync(folder+'all-world-readiness-census-result.json')),after=JSON.parse(fs.readFileSync(folder+'all-world-readiness-followups-result.json'));
assert.deepEqual(after.totals,before.totals);assert.equal(after.snapshotSha256,before.snapshotSha256);assert.deepEqual(after.summaries.map(row=>[row.world,row.digestSha256]),before.summaries.map(row=>[row.world,row.digestSha256]));
fs.writeFileSync(folder+'reading-followups-api-result.json',JSON.stringify({mode:'Normal default server GET; saved count-only reports, no output parse',results,badQueriesRejected:true,countsUnchanged:after.totals,snapshotAnd44DigestsUnchanged:true},null,2)+'\n');
console.log(JSON.stringify({queries:results.length,countsUnchanged:true,snapshotAnd44DigestsUnchanged:true}));
