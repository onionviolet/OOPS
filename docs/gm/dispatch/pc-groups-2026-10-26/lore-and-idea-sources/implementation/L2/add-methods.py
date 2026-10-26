"""One-shot authoring patch over released plain-data book.mol pack. Not a runtime generator."""
import json,copy
from pathlib import Path
p=Path('src/world_packs/book_mol_pack.js'); text=p.read_text();head,body=text.split('export default ',1);d=json.loads(body.rstrip().rstrip(';'));n=d['native'];commands=n['definitions']['commands'];P='book.mol.lore.'
W='book.mol.cyoria';WS='Cyoria formula workshop';H='Cyoria Imaya household';N='book.mol.nora'
key=lambda name:json.dumps({'id':name},separators=(',',':'))
ink=key('Cyorian formula ink');paper=key('Cyorian research paper');guide=key('Cyorian single-cube tracing guide')
eq=lambda fact,value=True:{'fact':fact,'op':'eq','value':value}
base=[eq('mol.nativeBound'),eq('mol.playerSupported'),eq('mol.local.'+W),eq('actor.book.mol.formulaStudied'),eq('knowledge.'+P+'trial.ink.seen')]
item=lambda key,amount:{'type':'item','actor':'player','key':key,'amount':amount}
vital=lambda amount:{'type':'vital','actor':'player','key':'stamina','amount':amount}
resource=lambda actor,key,amount:{'type':'resource','actor':actor,'key':'book.mol.'+key,'amount':amount}

def account(suffix,claim,kind='observation',place=WS,refs=None,basis='observation',speaker='player'):
 id=P+suffix
 r={'schema':1,'id':id,'kind':kind,'origin':id,'copyOf':None,'supersedes':None,'author':'Your single-cube workshop record (original branch)','speaker':speaker,'era':'Independent Cyoria guest branch','edition':'r1','language':'Cyorian common, translated for this account','place':place,'referents':refs or [ink,guide],'claim':claim,'confidence':'Observed in this stated setup; no universal or isolated-cause claim' if kind=='observation' else 'Interpretation bounded by the retained observations','coverage':[{'scope':'one-cube guide, counted formula ink and paper, stated apparatus and effort','status':'observed'},{'scope':'other inks, batch sizes and environmental tolerances','status':'unread'}]}
 return {'type':'knowledge','actor':'player','key':id,'stage':'seen' if kind=='observation' else 'interpreted','value':json.dumps(r,ensure_ascii=False,separators=(',',':')),'basis':{'kind':basis,'attributedTo':speaker,'situationId':'book.mol.visitor_branch'}}

def command(suffix,label,desc,location,requires,costs,effects,duration=0,once=True,visible=None,target=None):
 c={'id':P+suffix,'revision':1,'label':label,'description':desc,'group':'book_mol','actorId':'player','worldId':W,'location':location,'once':once,'costs':costs,'effects':effects,'visibleWhen':visible or eq('knowledge.'+P+'trial.ink.seen'),'requires':{'all':base+requires,'reason':'Use the studied lamp brief, tested formula ink and the actual stated tools or practiced method here.'}}
 if once:c['claim']=P+'receipt.'+suffix
 if target:c.update(targetId=target,coLocated=True,participants=['$target'])
 if duration:c.update(duration=duration,reservationReturns=1,completionRequires=copy.deepcopy(c['requires']),completionFailure='refund',cancellation='refund',completionCoLocated=bool(target))
 commands.append(c);return c

command('practice_hand_guide','Practice a folded-paper guide with Nora · paper + 1 crown, 3 min','Fold and align a one-cube paper pattern with Nora’s feedback. Costs one paper, one stamina and her attention; actual practice teaches alignment, not casting or lamp control.',WS,[eq('mol.support.'+N)],
 [item(paper,-1),vital(-1),resource('player','crowns',-1),resource(N,'attention',-1)],
 [resource(N,'crowns',1),{'type':'fact','scope':'actor','actor':'player','key':P+'handGuidePracticed','value':True},account('hand.practice','You completed Nora’s three-minute folding and alignment drill on one paper. You can reproduce that one-cube manual guide with your actual hands, ink and new paper; her school title did not supply those means. This taught no personal mana or keyed-lamp control.',speaker=N)],3,target=N)

for method,location,duration,effort,extra,apparatus in [
 ('jig',WS,2,1,[eq('world.'+P+'jigRestored')],'the currently restored academy ruling jig'),
 ('folded',H,4,2,[eq('actor.'+P+'handGuidePracticed')],'your practiced household folded-paper alignment')]:
 suffix='prepare_guide_'+method;record='method.'+method
 desc=f'Prepare one inked guide for a single cube using {apparatus}. One counted formula-ink unit and one paper become the guide; no magic, lamp or mastery is created. The guide can replace loose ink during Nora’s guided reconstruction.'
 claim=f'Using {apparatus}, you prepared one single-cube tracing guide in {duration} played minutes at {effort} stamina. One formula-ink unit and one paper became the physical guide. This tests this apparatus, preparation, location and scale together, not which variable caused the result. It does not establish a larger-batch recipe or anchor a spell.'
 command(suffix,f'Prepare a guide with the {"ruling jig" if method=="jig" else "folded-paper method"} · ink + paper, {duration} min',desc,location,extra,[item(ink,-1),item(paper,-1),vital(-effort)],[item(guide,1),account(record,claim,place=location)],duration)
 command('repeat_guide_'+method,f'Repeat the {"jig" if method=="jig" else "folded-paper"} guide · ink + paper, {duration} min','Repeat the demonstrated one-cube preparation with fresh real materials and the same current support. Your first observed method record stays unchanged; repetition grants no new mastery.',location,extra+[eq('knowledge.'+P+record+'.seen')],[item(ink,-1),item(paper,-1),vital(-effort)],[item(guide,1)],duration,once=False,visible=eq('knowledge.'+P+record+'.seen'))

command('compare_methods','Compare the two guide preparations','Compare your actual one-cube results without treating several changed conditions as one controlled cause.',WS,[eq('knowledge.'+P+'method.jig.seen'),eq('knowledge.'+P+'method.folded.seen')],[],[account('method.comparison','Both actual guide preparations produced a usable one-cube pattern. Ink type, counted amounts and single-cube scale matched; apparatus, location, preparation time and effort differed. The comparison supports those two complete setups, not a claim that school, region, shade or one isolated cause made them work. The earlier printed explanation and oil-strip failure remain separate evidence.',kind='interpretation',basis='inference')])

original=next(c for c in commands if c['id']=='book.mol.assemble_lamp')
c=copy.deepcopy(original);c.update(id=P+'assemble_guided_lamp',label='Reconstruct from your prepared guide with Nora · cube + guide + 3 crowns, 4 min',description='Your prepared paper guide already holds one formula-ink unit. Commit it with a cube, two stamina and three crowns; Nora still supplies her actual attention and two attuned mana. Four-minute reconstruction yields the same empty keyed lamp, with no personal casting or control mastery.',duration=4)
c['costs']=[item(guide,-1) if cost.get('key')==ink else cost for cost in c['costs']]
c['requires']['all'].append({'any':[eq('knowledge.'+P+'method.jig.seen'),eq('knowledge.'+P+'method.folded.seen')]})
c['completionRequires']=copy.deepcopy(c['requires'])
c['effects'].append(account('method.guided_lamp','Your physical guide and cube became one empty keyed lamp with Nora’s actual anchoring. The guide supplied its already committed ink, so reconstruction charged no second ink unit. A supported manual preparation did not replace the specialist’s source, grant personal casting, or grant control mastery. Calibration, control practice and useful operation still use their existing means.'))
commands.append(c)
n['items'].append({'id':'Cyorian single-cube tracing guide','name':'Cyorian single-cube tracing guide','description':'One counted formula-ink unit bound into a prepared paper pattern for a single cube. Nora’s guided reconstruction consumes it instead of loose ink; paper and a pattern do not anchor a spell. Original local workshop adaptation.','value':1,'tags':{'expedition':True,'book_world_mol':True}})
p.write_text(head+'export default '+json.dumps(d,indent=1,ensure_ascii=False)+';\n')
print('Added',len(commands)-67,'commands, one material-bearing intermediate; prior definitions preserved')
