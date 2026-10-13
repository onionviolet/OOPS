import json
from pathlib import Path
ROOT=Path(__file__).resolve().parent
load=lambda rel:json.loads((ROOT/rel).read_text())
A='foundation.probe.a';B='foundation.probe.b';S='foundation.probe.control'
results=[]
def gate(code,condition,evidence):
    results.append({'code':code,'passed':bool(condition),'evidence':evidence})
r2=[load(f'run2/receipt-{i}.json') for i in range(1,8)]
gate('N01_PA',r2[1]['arenaPeople'][A]['vitals']['health']==40 and r2[1]['arena']['history'][-1]['operation']=='blocked' and r2[2]['arena']['history'][-1]['operation']=='blocked' and r2[5]['arenaPeople'][A]['vitals']['health']==35,'run2/receipt-1..7.json')
seq=load('run4/sequence-0.json');e=lambda i:seq[i]['save']['expansion'];m=lambda i:e(i)['simulation']['foundationInteraction']
gate('N02_PB_AID',e(0)['simulation']['people'][A]['vitals']['health']==35 and e(2)['simulation']['people'][A]['vitals']['health']==40 and m(2)['history'][-1]['operation']=='delivered' and m(3)['history'][-1]['operation']=='blocked','run4/sequence-0.json rows0..3')
gate('N03_SWAP',m(6)['history'][-1]['operation']=='blocked' and m(6)['history'][-1]['actorId']==A,'run4/sequence-0.json rows5..6')
gate('N04_OVERLAPS',m(11)['history'][-1]['operation']=='delivered' and m(13)['history'][-1]['operation']=='delivered' and m(15)['history'][-1]['operation']=='blocked' and m(8)['instances'][B+'.barrier.p-b']==m(15)['instances'][B+'.barrier.p-b'],'run4/sequence-0.json rows8..15')
dup=load('run4/DUPLICATE.json');pure=load('run4/PURE.json')
gate('N05_STALE_DUPLICATE',dup['unchanged'] and 'stale' in dup['panel'],'run4/DUPLICATE.json')
gate('N06_PURE_OBSERVER',pure['unchanged'] and 'observed lifecycle and aftermath' in pure['text'],'run4/PURE.json')
r5=[load(f'run5/receipt-{i}.json') for i in range(1,8)]
h=r5[1]['arena']['history'];blocked=[x for x in h if x.get('reason')=='activation-blocked']
gate('N07_ACTIVATION_PARITY',all(any(x['id']==id for x in blocked) for id in [A+'.hit',A+'.encounter.hit',A+'.construct']) and r5[0]['jobs'][0]['effects'][0]['delivery']['activationBlockedBy']==[B+'.activation'],'run5/sequence-0.json and receipt-1..2.json')
seq5=load('run5/sequence-2.json');hist=seq5[3]['save']['expansion']['simulation']['foundationInteraction']['history']
gate('N08_DELIVERY_PARITY',hist[-1]['id']==A+'.encounter.hit' and hist[-1]['operation']=='blocked' and any(x['id']==A+'.hit' and x['operation']=='blocked' and x.get('reason')=='blocked' for x in hist),'run5/sequence-2.json rows0..3')
h=r5[3]['arena']['history'];impact=next(x for x in h if x['id']==A+'.impact');construct=next(x for x in h if x['id']==B+'.construct')
gate('N09_PHYSICAL_SUSTAINED',r5[3]['arenaPeople'][B]['vitals']['health']==35 and r5[3]['arenaPeople'][A]['vitals']['health']==40 and impact['at']==construct['at']==7 and construct['reason']=='support-lost' and not r5[3]['arenaActors'][A]['sources'] and not r5[3]['arenaActors'][B]['sources'],'run5/receipt-3..4.json')
gate('N10_AFTER_RELOAD_IMPORT',all(x['arena']==r5[3]['arena'] for x in r5[4:]) and all(x['arenaPeople']==r5[3]['arenaPeople'] for x in r5[4:]),'run5/receipt-4..7.json')
mid=json.loads(Path('/tmp/yairpg-foundation-interaction-mid-suppression-real.json').read_text())['expansion']['simulation']['foundationInteraction'];r30=load('run3/receipt-0.json');r36=load('run3/receipt-6.json')
gate('N11_MID_LOAD_IMPORT',r30['arena']==mid==r36['arena'] and r36['arena']['instances'][B+'.s1']['status']=='present','run3/receipt-0,6.json and generated actual mid-suppression save')
gate('N12_MID_RELOAD',load('run3/receipt-4.json')['arena']==load('run3/receipt-5.json')['arena'],'run3/receipt-4..5.json')
neg=list((ROOT/'run7').glob('negative-*.json'))
gate('N13_NEGATIVE_GUARDS',len(neg)==9 and all(load(str(f.relative_to(ROOT)))['disabled'] and load(str(f.relative_to(ROOT)))['unchanged'] and 'Published experimental action' not in load(str(f.relative_to(ROOT)))['panel'].split('\n\n')[2] for f in neg),'run7/negative-*.json, CONTROLLED_FIXTURES.json: disabled handler dispatch actually exercised root guard')
r7=load('run7/receipt-22.json');bar=r7['arena']['instances'][A+'.barrier.p-b']
gate('N14_PB_SOURCE_LOSS',bar['status']=='support-lost' and bar['endedAt']==3 and bar['expiresAt']>bar['endedAt'] and r7['arenaPeople'][A]['vitals']['health']==35,'run7/receipt-20..25.json')
f=load('run8/FAILED_WRITE.json');r82=load('run8/receipt-2.json');r84=load('run8/receipt-4.json')
gate('N15_REJECTION_RETRY',f['rejected']==1 and f['unchanged'] and f['before']['expansion']==f['after']['expansion'] and r82['arenaActors'][B]['resources']['demonstrationFuel']==29 and r84['arenaActors'][B]['resources']['demonstrationFuel']==28 and r84['arenaPeople'][A]['vitals']['health']==35,'run8/FAILED_WRITE.json, receipt-2..4.json')
r85=load('run8/receipt-5.json');r86=load('run8/receipt-6.json');r88=load('run8/receipt-8.json');r91=load('run9/receipt-1.json')
si=r85['arena']['instances'][B+'.s1'];ba=r88['arena']['instances'][A+'.barrier.p-a']
gate('N16_EXACT_EXPIRY',si['endedAt']==si['expiresAt']==7 and r86['arena']['history'][-1]['operation']=='blocked' and r86['arena']['history'][-1]['at']==7 and ba['endedAt']==ba['expiresAt']==12 and r91['arenaPeople'][A]['vitals']['health']==30 and r91['arena']['history'][-1]['operation']=='delivered','run8/receipt-5..8.json, run9/receipt-1.json')
gate('N17_EXPIRY_STALE',r88['arenaActors'][B]['resources']['demonstrationFuel']==load('run8/receipt-7.json')['arenaActors'][B]['resources']['demonstrationFuel'] and 'stale' in r88['panelText'].split('\n\n')[2],'run8/receipt-7..8.json')
old=load('receipt-3.json');gate('N18_OLD_ABSENT',not old.get('arena') and not old['arenaActors'] and old['schema']==5 and old['money']==102,'receipt-3.json: actual old absent save reload before successful atomic drill')
gate('N19_NATIVE_MONEY_PRESERVED',all(load(f'run9/receipt-{i}.json')['money']==102 for i in range(6)),'run9/receipt-0..5.json')
final=load('run9/receipt-2.json');gate('N20_FINAL_RELOAD_IMPORT',all(load(f'run9/receipt-{i}.json')['arena']==final['arena'] and load(f'run9/receipt-{i}.json')['arenaPeople']==final['arenaPeople'] for i in [3,4,5]),'run9/receipt-2..5.json')
sessions=[load(str(f.relative_to(ROOT))) for f in ROOT.glob('run[4-9]/NATIVE_SESSION.json')]
gate('N21_HASH_ERRORS_PROCESSES',len(sessions)==6 and all(x['startedHash']==x['endedHash']=='a4e84278059a711738b9149a331f916496dee79140384c021e11052187baef26' and not x['errors'] and not x.get('failures') for x in sessions),'run4..9/NATIVE_SESSION.json, all exited')
(ROOT/'ASSERTIONS.json').write_text(json.dumps({'bundle':'a4e84278059a711738b9149a331f916496dee79140384c021e11052187baef26','results':results,'nativePassed':all(r['passed'] for r in results),'authoringDefect':'Named-instance suppressor self-reference/missing-target needs root validation repair; native arena body-scoped consumers unaffected'},indent=2))
print(json.dumps(results,indent=2));assert all(r['passed'] for r in results)
