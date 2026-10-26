"""One-shot additive authoring patch; apply only with released source and slot custody."""
import json, copy
from pathlib import Path
p=Path('src/world_packs/book_mol_pack.js')
head,body=p.read_text().split('export default ',1)
d=json.loads(body.rstrip().rstrip(';'));commands=d['native']['definitions']['commands']
P='book.mol.lore.';W='book.mol.cyoria';WS='Cyoria formula workshop';A='Cyoria academy guest desk'
N='book.mol.nora';I='book.mol.ilsa';key=lambda name:json.dumps({'id':name},separators=(',',':'))
paper=key('Cyorian research paper');lamp=key('Cyorian keyed formula lamp')
eq=lambda fact,value=True:{'fact':fact,'op':'eq','value':value}
know=lambda suffix:eq('knowledge.'+P+suffix+'.seen')
base=[eq('mol.nativeBound'),eq('mol.playerSupported'),eq('mol.local.'+W),eq('actor.book.mol.guestPermit')]
resource=lambda actor,name,n:{'type':'resource','actor':actor,'key':'book.mol.'+name,'amount':n}
item=lambda k,n:{'type':'item','actor':'player','key':k,'amount':n}
world=lambda name,v:{'type':'world','worldId':W,'key':P+name,'value':v}

def account(suffix,claim,kind='observation',speaker='player',place=WS,extra=None):
    id=P+suffix
    r={'schema':1,'id':id,'kind':kind,'origin':id,'copyOf':None,'supersedes':None,
       'author':'Your workshop observation' if speaker=='player' else ('Nora Boole' if speaker==N else 'Ilsa Zileti'),
       'speaker':speaker,'era':'Independent Cyoria guest branch (ORIGINAL workshop scene)',
       'edition':'r2' if suffix.endswith('r2') else 'r1','language':'Cyorian common, translated for this account',
       'place':place,'referents':[P+'alignment_stop',lamp], 'claim':claim,
       'confidence':'Observed in this stated setup' if kind=='observation' else 'Attributed scoped account, not material truth',
       'coverage':[{'scope':'the stated apparatus, device and conditions','status':'observed'},{'scope':'other devices, operators and scales','status':'unread'}]}
    r.update(extra or {})
    return {'type':'knowledge','actor':'player','key':id,'stage':'seen','value':json.dumps(r,ensure_ascii=False,separators=(',',':')),
            'basis':{'kind':'observation' if kind=='observation' else 'instruction','attributedTo':speaker,'situationId':'book.mol.visitor_branch'}}

def command(suffix,label,desc,place,requires,effects,costs=None,duration=0,target=None):
    assert not any(c['id']==P+suffix for c in commands), 'Do not apply this authoring patch twice'
    c={'id':P+suffix,'revision':1,'label':label,'description':desc,'group':'book_mol','actorId':'player','worldId':W,'location':place,'once':True,
       'costs':costs or [],'effects':effects,'visibleWhen':eq('actor.book.mol.guestPermit'),
       'requires':{'all':base+requires,'reason':desc},'claim':P+'receipt.'+suffix}
    if target:c.update(targetId=target,coLocated=True,participants=['$target'])
    if duration:c.update(duration=duration,reservationReturns=1,completionRequires=copy.deepcopy(c['requires']),completionFailure='refund',cancellation='refund',completionCoLocated=bool(target))
    commands.append(c);return c

command('trace','Study the old alignment-stop sketch · 1 min',
 'Spend one minute comparing the surviving stop marks with the old workshop sketch. This retains a historical claim; it does not establish the jig’s present condition.',WS,[],
 [account('trace.r1','The surviving stop marks follow an earlier workshop sketch for a single-cube ruling jig. The copied sketch describes its earlier aligned stop, not present usability. Its circular and copied diagram share one source, so they are not independent witnesses. No ink, tool, skill or stock was acquired.',kind='document',speaker=N,
  extra={'origin':'book.mol.lore.circular','copyOf':P+'print.r1','era':'Earlier workshop setup, before the worn stop (ORIGINAL history)','coverage':[{'scope':'earlier alignment-stop arrangement','status':'observed'},{'scope':'present apparatus suitability','status':'unread'}]})],duration=1)
command('inspect_worn_jig','Check the current alignment stop · 1 min',
 'Check the present stop before using the historical design. Its worn gap prevents the jig method until repaired; a practiced manual method remains possible.',WS,
 [know('trace.r1'),eq('mol.lore.jigWorn')],
 [account('jig.worn','The current alignment stop has a worn gap. The old sketch still describes an earlier arrangement, but cannot certify present support. The jig method is unavailable; a learned manual guide uses different actual support.')],duration=1)
command('repair_jig','Shim the alignment stop with Nora · paper + 1 crown, 3 min',
 'Nora offers to fit your paper shim to her observed worn stop. The joint three-minute repair costs one paper, one stamina, one crown and her attention; it restores this jig without creating ink, guides or skill.',WS,
 [know('jig.worn'),eq('mol.lore.jigWorn'),eq('mol.support.'+N)],
 [resource(N,'crowns',1),world('jigRestored',True),account('jig.repair','One owned paper became the alignment-stop shim after three minutes of work with Nora. The actual jig now supports the single-cube ruling method. The consumed paper, payment and installed modification remain on revisit; the earlier sketch and worn-stop observation remain historical evidence.')],
 [item(paper,-1),resource('player','crowns',-1),resource(N,'attention',-1),{'type':'vital','actor':'player','key':'stamina','amount':-1}],3,N)
command('inspect_restored_jig','Check the repaired alignment stop · 1 min',
 'Check the installed shim against the earlier account. This records current suitability without erasing the old worn-stop observation or replenishing supplies.',WS,
 [know('jig.repair'),eq('world.'+P+'jigRestored')],
 [account('jig.restored','The installed paper shim still closes the observed alignment gap. This current check supports the ruling jig for the demonstrated one-cube preparation. It does not certify other inks or scales; the old worn-stop record remains valid history.')],duration=1)

device=[eq('mol.deviceSupported'),eq('actor.book.mol.lampTested'),{'fact':'power.book.mol.formula_operator.mastery','op':'gte','value':1}]
methods={'any':[know('method.jig'),know('method.folded')]}
command('witness_device','Ask Nora to record your observed device test · 1 min',
 'Nora records your existing lamp test and guide evidence while the owned device is present. Her witnessed account is useful evidence, rather than an academy device certificate.',WS,
 device+[methods,eq('mol.support.'+N)],
 [account('credential.nora.r1','Nora witnessed the retained operational lamp test and received your preparation account. This device evidence covers the original workshop-built lamp, not all lamps or an operator licence. The academy may consider it but Nora does not issue its allocation certificate.',kind='document',speaker=N,
 extra={'credential':{'issuer':N,'scope':'device_batch','standard':1,'subject':lamp,'sourceCommand':P+'witness_device','conditions':'Original unique workshop assembly; observed one-cube preparation and lamp test'}})],
 [resource(N,'attention',-1)],1,N)
command('clarify_scope','Ask Ilsa which evidence the academy accepts · 1 min',
 'Ilsa distinguishes Nora’s witness account, your demonstrated manual operation, and her academy’s device review. Her operator record alone cannot obtain a device allocation.',A,
 device+[know('credential.nora.r1'),eq('mol.support.'+I)],
 [account('credential.operator.r1','Ilsa recognizes your previously demonstrated keyed-lamp manual operation. This operator record grants no new mastery, fuel, casting or property. Nora’s device witness has another issuer, and this academy operator record has the wrong scope for the academy’s device allocation. The first allocation standard needs your demonstrated ruling-jig preparation and a current device examination. Ilsa can consider a revised standard after receiving your actual comparison of both methods. Ordinary supported lamp use needs neither paper.',kind='document',speaker=I,place=A,
 extra={'credential':{'issuer':I,'scope':'operator','standard':1,'subject':'player','sourceCommand':P+'clarify_scope','conditions':'Existing trained manual control; no commercial mage qualification'}})],
 [resource(I,'attention',-1)],1,I)

for version in [1,2]:
    suffix='certify_device_r'+str(version)
    req=device+[eq('mol.support.'+I),know('credential.operator.r1'),eq('mol.lore.institutionStandard',version)]
    req += [know('method.jig')] if version==1 else [know('standard.r2'),methods]
    command(suffix,f'Examine this device under academy standard {version} · 1 charge, 2 min',
      ('Bring a demonstrated ruling-jig preparation and your supported owned lamp for the first device review. ' if version==1 else 'Bring the revised method review and your supported owned lamp. ') + 'The two-minute test consumes one charge and Ilsa’s attention; no material property, mastery or wider licence changes.',A,req,
      [dict(item(lamp,1),reservationReturn=True),account('credential.academy.r'+str(version),
       f'Ilsa witnessed this original workshop-built lamp under academy allocation standard {version}. This dated device record covers the demonstrated single-cube preparation and present manual lamp test. It is neither commercial mage qualification nor ownership. Changed custody or a later allocation standard requires reevaluation; ordinary supported operation remains possible.',kind='document',speaker=I,place=A,
       extra={'credential':{'issuer':I,'scope':'device_batch','standard':version,'subject':lamp,'sourceCommand':P+suffix,'conditions':'Original unique workshop assembly; owned device; trained supported operator; actual observed preparation and current lamp test'},'supersedes':P+'credential.academy.r1' if version==2 else None})],
      [item(lamp,-1),resource('player','deviceFuel',-1),resource(I,'attention',-1)],2,I)

command('review_standard','Show Ilsa both methods for a revised review · paper, 3 min',
 'Submit your observed comparison of both guide methods. Ilsa revises her finite research-allocation standard to accept either demonstrated setup with a current device test. Older papers remain, but their prior standard no longer obtains this allocation.',A,
 [know('credential.academy.r1'),know('method.comparison'),eq('mol.lore.institutionStandard',1),eq('mol.support.'+I)],
 [world('institutionStandard',2),account('standard.r2','Ilsa received your actual two-method comparison and revised the academy’s bounded research-allocation review. Either demonstrated single-cube setup can be considered with a fresh present-device test. The older jig-only certificate remains historical evidence, but its allocation applicability expired with this announced revision. The device, learned methods and stock did not change.',kind='document',speaker=I,place=A,
 extra={'supersedes':P+'credential.academy.r1','credential':{'issuer':I,'scope':'method','standard':2,'subject':P+'method.comparison','sourceCommand':P+'review_standard','conditions':'The two observed one-cube guide setups; current supported device examination still separate'}})],[item(paper,-1),resource(I,'attention',-1)],3,I)
c=command('research_allocation','Collect one reviewed research paper · 1 crown, finite stock',
 'A current academy device certificate and the owned supported lamp admit one paper from actual academy stock for one crown. Wrong issuer, operator-only scope, superseded standard or missing custody cannot obtain it. Ordinary lamp use remains independent.',A,
 [eq('mol.lore.currentDeviceCertificate'),eq('mol.deviceSupported'),eq('mol.support.'+I),{'fact':'mol.stock.book.mol.academy.shop.'+paper,'op':'gte','value':1}],
 [resource(N,'crowns',1),item(paper,1),account('institution.allocation','The academy transferred one counted research paper for one crown under its current device-evidence review. It did not change the lamp or grant skill; this finite allocation cannot be claimed again. The paper is available for existing guide preparation or notebook research.',speaker=I,place=A)],
 [resource('player','crowns',-1)])
c['molStock']=[{'owner':'book.mol.academy.shop','key':paper,'count':-1}]
p.write_text(head+'export default '+json.dumps(d,indent=1,ensure_ascii=False)+';\n')
print('Added 10 trace/institution commands; all prior definitions preserved')
