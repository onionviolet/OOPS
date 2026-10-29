#!/usr/bin/env python3
"""Census lane v2: per-chapter chunks, schema-constrained output, script rows for known names, deterministic locator repair,
candidate-coverage retry. usage: lane.py <model> <tag> <key> <seed> <temp>
Env: LEADRUN_DIR (briefs, shards, outputs), LOCAL_WORLD (id prefix, default lotm), LOCAL_NUM_PREDICT (default 8000),
LOCAL_THINK=1 turns on the model's thinking, LOCAL_KEEP=1 keeps the model loaded between calls (the overnight driver unloads it). Chapter headers may be Chinese or English."""
import json,sys,time,urllib.request,os,re
model,tag,key,seed,temp=sys.argv[1],sys.argv[2],sys.argv[3],int(sys.argv[4]),float(sys.argv[5])
P=os.environ.get('LEADRUN_DIR','/Users/weiwei/code/yet-another-idle-rpg/docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/')
brief=open(P+f'brief_{key}.md').read()
shardf=P+[f for f in sorted(os.listdir(P)) if f.startswith(f'shard_{key}_')][0]
chap={};ch=None
for line in open(shardf):
    h=re.match(r'^=== (?:.*?第(\d+)章|Chapter (\d+))',line)
    if h: ch=int(h.group(1) or h.group(2));chap[ch]=[];continue
    m=re.match(r'^p(\d+): (.*)$',line)
    if m: chap[ch].append((int(m.group(1)),m.group(2)))
known=[]
for l in brief.split('# Known names in this shard')[1].split('# Candidates')[0].split('\n'):
    if l.startswith('| ') and not l.startswith('| zh') and not l.startswith('| ---'):
        zh,id_,label,kind,src=[c.strip() for c in l.split('|')[1:-1]]
        if id_ and kind: known.append((zh,id_,label,kind,src))
cands=[]
for l in brief.split('# Candidates found')[1].split('\n'):
    if l.startswith('| ') and not l.startswith('| kind') and not l.startswith('| ---'):
        k,v,loc=[c.strip() for c in l.split('|')[1:-1]]; cands.append((k,v,loc))
KINDS=["person","place","organization","deity","item","price","law","calendar","clock","event","language","measure","document","note","creature"]
SCHEMA={"type":"object","properties":{"rows":{"type":"array","items":{"type":"object","properties":{
 "id":{"type":"string"},"label":{"type":"string"},"zh":{"type":"string"},"kind":{"type":"string","enum":KINDS},
 "firstMention":{"type":"string","pattern":"^zh 第\\d+章 p\\d+$"},"note":{"type":"string"},"amountValue":{"type":"number"},"amountUnit":{"type":"string","enum":["penny","soli","pound","lb","none"]}},
 "required":["id","label","zh","kind","firstMention","note"]}}},"required":["rows"]}
def call(prompt):
    body={"model":model,"stream":False,"think":os.environ.get('LOCAL_THINK')=='1',"format":SCHEMA,"keep_alive":"2m","options":{"num_ctx":16384,"temperature":temp,"seed":seed,"num_predict":int(os.environ.get('LOCAL_NUM_PREDICT','8000'))},"messages":[{"role":"user","content":prompt}]}
    req=urllib.request.Request('http://localhost:11434/api/chat',json.dumps(body).encode(),{'Content-Type':'application/json'})
    d=json.load(urllib.request.urlopen(req,timeout=3600))
    try: rows=json.loads(d['message']['content']).get('rows',[])
    except Exception: rows=[]
    return rows,d.get('prompt_eval_count',0),d.get('eval_count',0)
D={'零':0,'一':1,'二':2,'两':2,'三':3,'四':4,'五':5,'六':6,'七':7,'八':8,'九':9}
def num(t):
    if re.fullmatch(r'\d+(\.\d+)?',t): return float(t)
    if t=='半': return 0.5
    if not t or not all(c in D or c in '十百' for c in t): return None
    tot=0;cur=0
    for c in t:
        if c in D: cur=D[c]
        elif c=='十': tot+=(cur or 1)*10;cur=0
        elif c=='百': tot+=(cur or 1)*100;cur=0
    return float(tot+cur)
UN={'便士':'penny','苏勒':'soli','金镑':'pound','镑':'pound'}
def amount(zh,r):
    m=re.search(r'([\d.]+|[零一二两三四五六七八九十百半]+)(?:个|枚|张)?(?:铜)?(便士|苏勒|金镑|镑)',zh)
    if m and num(m.group(1)) is not None and '分之' not in zh: return {"value":num(m.group(1)),"unit":UN[m.group(2)],"per":None,"cap":None}
    if r.get('amountUnit') in ('penny','soli','pound') and isinstance(r.get('amountValue'),(int,float)): return {"value":r['amountValue'],"unit":r['amountUnit'],"per":None,"cap":None}
    return None
norm=lambda s:s.replace('.','·').replace('．','·')
t0=time.time();pt=ot=0;calls=0;retries=0
out=[];seen_zh=set();dropped=0;fixed=0
for c,ps in chap.items():
    text='\n'.join(f'p{n}: {t}' for n,t in ps)
    # script rows for known names (first paragraph in this chapter, once per shard)
    inch=[k for k in known if any(k[0] in t or norm(k[0]) in norm(t) for _,t in ps)]
    for zh,id_,label,kind,src in inch:
        if zh in seen_zh: continue
        n=next(n for n,t in ps if zh in t or norm(zh) in norm(t))
        seen_zh.add(zh)
        prev=next((o for o in out if o['id']==id_),None)
        if prev: prev['aliases'].append(zh);continue
        out.append({"schema":"census/1.3","id":id_,"label":label,"zh":zh,"nameSource":"repo" if 'census' in src else "wiki","kind":kind,"rung":"M0","whereabouts":[],"firstMention":f"zh 第{c}章 p{n}","firstVolume":None,"touchedByLead":False,"aliases":[],"claimant":"narration","note":"Mentioned by name."})
    cc=[x for x in cands if f'第{c}章' in x[2]]
    listed=', '.join(k[0] for k in inch)
    def prompt(missing=None):
        cl='\n'.join(f'- {k} {v} ({loc})' for k,v,loc in (missing if missing is not None else cc))
        return f"""Census task for one chapter of a novel. List rows for (a) the candidates below that are real prices, measures, clock times or durations and (b) every other named person, place, organization, deity, item, creature, document or event in the text that is NOT in the already-listed names. Each row: id `lotm.<kind>.<english-slug>`, label (English), zh copied exactly from the text, kind, firstMention `zh 第N章 pM` for the paragraph that contains that exact zh, note of at most 15 words using only facts in that paragraph. Skip pronouns, kinship words and generic nouns.
Already listed (skip): {listed}
Candidates:
{cl}
Chapter {c}:
{text}"""
    rows,a,b=call(prompt());calls+=1;pt+=a;ot+=b
    def covered(r): return any(v in x.get('zh','') or x.get('zh','') in v for x in rows for _,v,_ in [r])
    miss=[x for x in cc if not any(x[1] in r.get('zh','') or r.get('zh','') in x[1] for r in rows)]
    if cc and len(miss)/len(cc)>0.3:
        r2,a,b=call(prompt(miss));calls+=1;retries+=1;pt+=a;ot+=b;rows+=r2
    idset={r['id'] for r in out}
    for r in rows:
        zh=r.get('zh','')
        if not zh or zh in seen_zh: continue
        m=re.match(r'zh 第(\d+)章 p(\d+)$',r.get('firstMention',''))
        para=dict(ps)
        ok=m and int(m.group(1))==c and zh in para.get(int(m.group(2)),'')
        if not ok:
            hit=next((n for n,t in ps if zh in t),None)
            if hit is None: dropped+=1;continue
            r['firstMention']=f'zh 第{c}章 p{hit}';fixed+=1
        slug=re.sub(r'[^a-z0-9]+','-',r['id'].lower().split('.')[-1]).strip('-') or 'x'
        r['id']=f"{os.environ.get('LOCAL_WORLD','lotm')}.{r['kind']}.{slug}"
        while r['id'] in idset: r['id']+='-x'
        idset.add(r['id']);seen_zh.add(zh)
        row_amt=amount(zh,r)
        if r['kind']=='price' and not row_amt: r['kind']='note';r['id']=r['id'].replace('.price.','.note.')
        out.append({**({"amount":row_amt} if row_amt else {}),"schema":"census/1.3","id":r['id'],"label":r['label'],"zh":zh,"nameSource":"pinyin-unconfirmed","kind":r['kind'],"rung":"M0","whereabouts":[],"firstMention":r['firstMention'],"firstVolume":None,"touchedByLead":False,"aliases":[],"claimant":"narration","note":' '.join(r.get('note','').split()[:15])})
base=P+f'localai-{tag}-{key}'
open(base+'_census.jsonl','w').write('\n'.join(json.dumps(x,ensure_ascii=False) for x in out)+'\n');open(base+'_scenes.jsonl','w').write('');open(base+'_fills.jsonl','w').write('')
info={"model":model,"key":key,"seed":seed,"temp":temp,"wall_s":round(time.time()-t0,1),"calls":calls,"retries":retries,"prompt_tokens":pt,"out_tokens":ot,"rows":len(out),"locator_fixed":fixed,"dropped_not_in_text":dropped}
json.dump(info,open(base+'_run.json','w'),indent=1);print(json.dumps(info))
# Free the model's memory (the weights stay resident for the keep-alive otherwise, and a second model adds to swap).
if os.environ.get('LOCAL_KEEP')!='1': urllib.request.urlopen(urllib.request.Request('http://localhost:11434/api/generate',json.dumps({'model':model,'keep_alive':0}).encode(),{'Content-Type':'application/json'}))
