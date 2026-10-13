import json,hashlib
from pathlib import Path
out=Path(__file__).parent
read=lambda n:json.load(open('/tmp/yairpg-foundation-continuity-'+n+'.json'))
method=lambda s:s['expansion']['simulation']['powers']['player']['tidemark.counterweight']
kit='{"id":"Prepared survey kit"}'
count=lambda s:s['inventories']['person']['main_character'].get(kit,{}).get('count',0)
checks=[]
def check(label,ok):
 assert ok,label
 checks.append(label)
a,b=read('lesson-before-return'),read('learned-return')
check('actual lesson learned owned revision1, spent2 coins',method(a)['owned'] and a['character']['money']==91 and method(a)['cause']=='simulation:620')
check('actual return retains authoritative method unchanged',method(a)==method(b) and b['current location']=='Village')
r=b['expansion']['featureDestination']['receipts'][-1]
check('actual return receipt binds learned method/current connection revision',r['retainedMethods']==[{'domain':'method','id':'tidemark.counterweight','revision':1}] and r['connectionRevision']==2)
c=read('used-collected')
check('actual local execution and reserve settlement',method(c)['executions']==1 and count(c)==1 and c['expansion']['worlds']['feature.tidemark']['facts']['tidemark.collected'])
d=read('loan-inspected')
check('actual inspection preserves borrowed custody and quantity',count(d)==2 and d['expansion']['simulation']['custody']['tidemark.inspection_loan']['count']==1)
e=read('before-refused-return')
check('actual exact loan returned with no copied kit',count(e)==1 and e['expansion']['simulation']['custody']=={})
f=read('new-refusal-before');j=json.load(open(out/'SNAPSHOTS.json'))
refused=next(x['result'] for x in j if x['cmd'].get('action')=='click' and x['cmd'].get('name')=='Do this: Return to Village · keep your belongings')
check('refused durable passage preserves location sequence bag power visit receipts native revision',refused['location']==f['current location'] and refused['sequence']==f['expansion']['sequence'] and refused['inventory']==f['inventories']['person']['main_character'] and refused['powers']==f['expansion']['simulation']['powers'] and refused['destination']==f['expansion']['featureDestination'])
g=read('new-refusal-reloaded')
check('reload restores retained state after refused passage',g['current location']=='Tidemark landing' and g['expansion']['sequence']==629 and method(g)==method(f))
h=read('exact-export-imported');k=read('final-return')
check('actual exported file native import retains bag money method custody facts receipts',h['inventories']['person']['main_character']==k['inventories']['person']['main_character'] and method(h)==method(k) and h['expansion']['featureDestination']['receipts']==k['expansion']['featureDestination']['receipts'] and h['expansion']['worlds']['feature.tidemark']['facts']==k['expansion']['worlds']['feature.tidemark']['facts'])
l,m,n=read('pending-left'),read('pending-absent'),read('pending-reentry')
check('actual absence freezes local clock and real pending agreement while Frontier advances',l['expansion']['featureDestination']['instance']['clock']['elapsed']==m['expansion']['featureDestination']['instance']['clock']['elapsed']==n['expansion']['featureDestination']['instance']['clock']['elapsed'] and m['expansion']['clock']>l['expansion']['clock'] and l['expansion']['worlds']['feature.tidemark']['facts']==m['expansion']['worlds']['feature.tidemark']['facts']==n['expansion']['worlds']['feature.tidemark']['facts'])
result={'status':'PASS','bundle':hashlib.sha256(Path('dist/bundle.js').read_bytes()).hexdigest(),'checks':checks,'nativeFailures':['initial hardcoded revision repaired by root','aria-disabled loan passage prevented click as intended'],'harnessDiscard':['initial startup timeouts','first reload re-seeded checkpoint; corrected one-time session seed'],'unrun':['actual stale sequence/cargo route injection','incapacitated/immobile live Tidemark rejection','missing-content routing for compiled original destination','second continuation policy native consumer']}
(out/'RESULT.json').write_text(json.dumps(result,indent=2));print(json.dumps(result))
