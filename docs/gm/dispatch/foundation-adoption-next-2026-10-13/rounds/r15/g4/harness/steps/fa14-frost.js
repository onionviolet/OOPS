const result=[];for(const [name,text,wait]of [['cover','Cover the warned bed',3],['early','Harvest the warned bed early',1],['neglect','Leave the warned bed',1],['timeout',null,8]]){
 await h.importFile(path.resolve(h.evidence,'../fixture/TEST-FIXTURE-R15-G4-frost.txt'));await h.play();const before=h.digest(await h.save());
 if(text)await h.click(text);await h.advance(wait);const after=await h.record('fa14-current-frost-'+name);await h.advance(8);const later=await h.record('fa14-current-frost-'+name+'-later');result.push({name,before,after,later});
}
h.write('fa14-current-frost-results.json',result);return result.map(r=>({name:r.name,herbs:r.after.herbs,later:r.later.herbs,logsSpent:r.before.logs-r.after.logs}));
