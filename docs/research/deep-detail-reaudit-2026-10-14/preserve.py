#!/usr/bin/env python3
"""Copy explicitly selected read-only reference inputs; never execute game code."""
from pathlib import Path
import hashlib
import json
import subprocess
from datetime import datetime

REPO = Path(__file__).resolve().parents[3]
OUT = Path(__file__).resolve().parent
HOME = Path.home()
WORK = HOME / '.codex/research'
TMP = Path('/private/tmp/claude-501')
DATE = 'deep-detail-2026-10-14'
EXCLUDED = {'academagia', 'immortal-life', 'scroll-of-taiwu', 'warsim', 'hogwarts-legacy', 'proto23'}
TEXT = {'.json', '.jsonl', '.csv', '.tsv', '.txt', '.xml', '.xsd', '.lua', '.gd', '.js', '.ts', '.tsx', '.cs', '.java', '.c', '.h', '.inc', '.html', '.md', '.mdx', '.yml', '.yaml', '.scss', '.css', '.vue'}

def sha(p):
    return hashlib.sha256(p.read_bytes()).hexdigest()

def candidates(root, suffixes=TEXT):
    return sorted(p for p in root.rglob('*') if p.is_file() and not p.is_symlink()
                  and not any(x in p.parts for x in ('.git', 'node_modules', 'bin', 'obj'))
                  and (p.suffix.lower() in suffixes or p.name.lower().startswith(('license', 'copying'))))

def source_group(root, label, suffixes=TEXT):
    return [(p, Path(label) / p.relative_to(root)) for p in candidates(root, suffixes)]

def exact(root, names, label):
    return [(root / n, Path(label) / n) for n in names if (root / n).is_file()]

plans = {}
def add(game, group, purpose):
    files, purposes = plans.setdefault(game, ([], []))
    files.extend(group)
    purposes.append(purpose)

add('heavens-vault', source_group(WORK/'heavens-vault/extract/textassets', 'textassets'), 'All ten retained TextAssets, including compiled story and complete knowledge/timeline tables.')
add('heavens-vault', source_group(WORK/'heavens-vault/extract/csharp', 'flows/csharp'), 'Existing managed export, including story host and translation consumers; preservation is not semantic review.')
add('ngu-idle', source_group(WORK/'ngu-idle/extract/assembly', 'flows/assembly'), 'Entire small managed export retains formulas, unlocks, restrictions, XP and reset consumers.')
add('idle-reincarnator', source_group(WORK/'idle-reincarnator/extract/pack', 'tables', {'.json'}), 'All 75 authored JSON files with descriptions, costs, conditions and progression rows.')
add('idle-reincarnator', source_group(WORK/'idle-reincarnator/extract/decoded', 'flows/decoded'), 'All token renderings and token records, retaining original line identities; not buildable source.')
add('legends-of-idleon', source_group(WORK/'idleon/extract', 'source', {'.js', '.txt', '.xml', '.json'}), 'Full retained official JavaScript and wiki article/generated-table exports. Wiki data remains a separate authority.')
add('legends-of-idleon', source_group(WORK/'idleon/notes', 'flows/selected', {'.txt'}), 'Existing selected AFK/divinity contexts, not proof of complete reward settlement.')
add('vagrus', source_group(WORK/'vagrus-2/extract', 'source', {'.json', '.cs', '.csproj', '.txt'}), 'Full recovered events/AirTable and managed code, including choice conditions, companion gates and economy consumers. DLL excluded.')
add('your-chronicle', source_group(WORK/'your-chronicle-2/extract', 'source'), 'All retained readable TextAssets and decoded setting/translation JSON, preserving full text and IDs. No new native-body recovery.')
add('tale-of-immortal', source_group(WORK/'tale-of-immortal-2/extract', 'tables/round2'), 'Eleven full official backup-derived tables. Current-build/native consumer compatibility remains unknown.')
prior_validation=WORK/'tale-of-immortal-2/extract/VALIDATION.json'
if prior_validation.exists():
    prior_rows=json.loads(prior_validation.read_text())
    add('tale-of-immortal', [(Path(row['official_json']),Path('tables/official')/Path(row['official_json']).name) for row in prior_rows if Path(row['official_json']).is_file()], 'All 22 official companion JSONs validated by the prior workbook pass, preserved with row IDs and full values.')
add('groundhog-life', exact(WORK/'idle-depth/extract', ['app.v2.js','app.v2.pretty.js','groundhog-vendor.js'], 'flows'), 'Complete retained later-build JS and vendor dependency for Loop Trap transform. No game code execution.')
add('immortality-idle', source_group(WORK/'idle-depth/repos/immortality-idle-pinned/src', 'source'), 'Complete retained src text, including previously omitted activity prose, catalog definitions and UI; no bulk deployed assets.')
add('immortality-idle', exact(WORK/'idle-depth/repos/immortality-idle-pinned', ['README.md','LICENSE'], 'provenance'), 'Available source notices; absence of a license remains qualified.')
add('cultivation-idlers', source_group(WORK/'path-idle-cultivator/extract', 'path-of-idle-cultivator'), 'Full formatted Path bundle retains specialty breakthroughs, origins, recipes and quest grammar.')
for name in ['cycle-first-dawn','infinite-dao','idle-xanxia']:
    add('cultivation-idlers', source_group(TMP/'cultivation-idlers-src'/name, name), 'Complete existing browser text for '+name+'; no framework execution.')
for name in ['src','shared']:
    add('cividle', source_group(TMP/'cividle-src/repo'/name, 'source/'+name), 'Retained '+name+' definitions and consumer code, excluding media and platform builds.')
add('cividle', exact(TMP/'cividle-src/repo', ['LICENSE','README.md','package.json'], 'provenance'), 'Source/license notices retained. No source reuse in YAIR.')
for name in ['prestige-tree','communitree','profectus']:
    add('modding-tree', source_group(WORK/'prestige-community/repos'/name, 'source/'+name), 'Existing '+name+' layer definitions and requirement/board source.')
for name in ['tmt','pt','profectus']:
    add('modding-tree', source_group(TMP/'modding-tree-src'/name, 'earlier/'+name), 'Earlier pinned '+name+' source snapshot retained separately.')
add('majoras-mask', source_group(TMP/'codex-lanes/majoras-mask-src/mm/src', 'source/src'), 'Schedule interpreter, actors/dialogue branches and reset consumers from retained N64 reconstruction. No ROM/assets.')
add('majoras-mask', source_group(TMP/'codex-lanes/majoras-mask-src/mm/include', 'source/include'), 'Constants and message/schedule grammar declarations.')
add('majoras-mask', exact(TMP/'codex-lanes/majoras-mask-src/mm', ['README.md','LICENSE'], 'provenance'), 'Reconstruction provenance retained; not original Nintendo source or MM3D.')
add('trimps-antimatter', source_group(TMP/'codex-lanes/trimps-antimatter-src/trimps', 'trimps'), 'All existing Trimps text, including full parameter tables and reset/consumer functions.')
for name in ['src','public','javascripts']:
    add('trimps-antimatter', source_group(TMP/'codex-lanes/trimps-antimatter-src/ad'/name, 'antimatter-dimensions/'+name), 'AD '+name+' text, including challenge/perk tables and Automator grammar where present.')
add('trimps-antimatter', exact(TMP/'codex-lanes/trimps-antimatter-src/ad', ['LICENSE','README.md','package.json'], 'antimatter-dimensions/provenance'), 'AD source notices retained; no code incorporated into YAIR.')
add('kingdom-of-loathing', source_group(WORK/'kol-2/repos/kolmafia/src/main/resources/data', 'tables'), 'Complete KoLmafia data tables, a client/community representation rather than server truth.')
add('kingdom-of-loathing', source_group(WORK/'kol-2/repos/kolmafia/src/main/java/net/sourceforge/kolmafia', 'flows/client', {'.java'}), 'Retained client parsers/restriction/reset consumers; no account, network or save access.')
add('kingdom-of-loathing', source_group(WORK/'kol-2/extract', 'reference', {'.json','.tsv','.txt','.html'}), 'Retained archive research and path metadata; narrative text is not complete server dialogue.')
add('free-text-worlds-2026-10-14', exact(WORK/'free-text-worlds/extract', ['urr-disassembly.txt','urr-Religion-__init__.dis.txt','urr-Civilization-__init__.dis.txt','urr-archive-inventory.json','pq-main.js','pq-roster.js','pq-config.js','urr-picture.txt'], 'source'), 'Existing URR module disassembly and Progress Quest source; original exe/ZIP and binary tails stay outside this copy.')
add('free-text-worlds-2026-10-14', source_group(WORK/'free-text-worlds/repos/pq-web-mirror', 'flows/progress-quest', {'.js','.txt','.pas','.md'}), 'Complete available web simulator text and notices; server behavior unavailable.')
add('outer-wilds', source_group(TMP/'codex-lanes/outer-wilds-src/reads', 'community-source'), 'Existing New Horizons ship-log schema/consumers and OWML storage reads with original notices. This is community mod source, not proprietary game code.')
add('outer-wilds', exact(TMP/'codex-lanes/outer-wilds-src', ['source_manifest.json'], 'provenance'), 'Pinned source-read manifest, not a complete checkout or vanilla dialogue/log export.')
hoi = HOME/'Library/Application Support/Steam/steamapps/common/Hearts of Iron IV'
for name in ['common/defines','common/technologies','common/ideas','common/scripted_effects','common/scripted_triggers','common/on_actions','common/production','common/units/equipment','common/decisions']:
    add('hearts-of-iron-iv', source_group(hoi/name, 'tables/'+name, {'.txt','.lua','.json'}), 'Complete loose '+name+' scripts with IDs and predicates; native evaluator still opaque.')
add('hearts-of-iron-iv', source_group(WORK/'hoi4/extract', 'prior-census'), 'Prior complete structural census and selected contexts, kept separate from new loose-script copies.')

def derive_hv(dest):
    core = next((dest/'textassets').glob('*__core.txt'))
    data = json.loads(core.read_text())
    texts, controls = [], []
    def walk(x, path):
        if isinstance(x,list):
            for i,v in enumerate(x): walk(v, path+'/'+str(i))
        elif isinstance(x,dict):
            for k,v in x.items():
                if k in ('->','->t->','*','f()','x()','VAR=','temp=','VAR?','CNT?'):
                    controls.append({'id':path+'/'+k,'opcode':k,'operand':v,'conditional':x.get('c',False),'container':path})
                if isinstance(v,(list,dict)):walk(v,path+'/'+k.replace('~','~0').replace('/','~1'))
        elif isinstance(x,str) and x.startswith('^'):
            texts.append({'id':path,'text':x[1:],'speaker':'unresolved','conditions':'ordered evaluation in original container; not statically resolved'})
    walk(data,'')
    derived=dest/'decoded';derived.mkdir()
    for name,rows in [('story-text-with-locators.jsonl',texts),('story-control-tokens.jsonl',controls)]:
        with (derived/name).open('w') as f:
            for row in rows:f.write(json.dumps(row,ensure_ascii=False)+'\n')
    table_counts={}
    for p in (dest/'textassets').glob('*.txt'):
        if '__core.' in p.name:continue
        try:d=json.loads(p.read_text())
        except (ValueError,UnicodeError):continue
        target=derived/(p.stem+'.json');target.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
        table_counts[p.name]={k:len(v) for k,v in d.items() if isinstance(v,list)} if isinstance(d,dict) else len(d)
    return {'story_text_records':len(texts),'story_control_records':len(controls),'table_array_counts':table_counts,
            'limits':'Structural traversal, not an interpreted branch graph. Speaker, dynamic expression conditions, externals and actual reachability unresolved. Full ordered original program preserved.'}

def derive_idleon(dest):
    results=[]
    for p in (dest/'source').glob('wiki-Module:*_data.json-export.txt'):
        try:d=json.loads(p.read_text())
        except ValueError:continue
        q=dest/'tables'/p.name.replace('-export.txt','.json');q.parent.mkdir(exist_ok=True)
        q.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n');results.append({'file':str(q.relative_to(dest)),'root_keys':list(d) if isinstance(d,dict) else None})
    return {'normalized_wiki_tables':results,'limits':'Wiki generator dataset; version/build parity with official client not established. Full official client also retained.'}

def run():
    receipts=[]
    for game,(files,purposes) in plans.items():
        if game in EXCLUDED:raise RuntimeError('excluded game')
        if not files:continue
        probe=Path('docs/research')/game/'private/probe'
        check=subprocess.run(['git','check-ignore','-v',str(probe)],cwd=REPO,capture_output=True,text=True,check=True)
        dest=REPO/'docs/research'/game/'private'/DATE
        if dest.exists():raise RuntimeError('Snapshot already exists: '+str(dest))
        dest.mkdir(parents=True)
        rows=[]
        for source,rel in sorted(set(files)):
            b=source.read_bytes();h=hashlib.sha256(b).hexdigest()
            q=dest/rel;q.parent.mkdir(parents=True,exist_ok=True);q.write_bytes(b)
            if sha(q)!=h or sha(source)!=h:raise RuntimeError('hash drift: '+str(source))
            rows.append({'source':str(source),'path':str(rel),'bytes':len(b),'sha256':h})
        derived={}
        if game=='heavens-vault':derived=derive_hv(dest)
        if game=='legends-of-idleon':derived=derive_idleon(dest)
        generated=[{'path':str(p.relative_to(dest)),'bytes':p.stat().st_size,'sha256':sha(p)} for folder in ['decoded','tables'] if game in ['heavens-vault','legends-of-idleon'] for p in (dest/folder).rglob('*') if p.is_file()]
        # Only generated folders for the above games, not copied table trees.
        manifest={'schema':1,'game':game,'date':datetime.now().astimezone().isoformat(),'ignore_rule':check.stdout.strip(),'files':rows,'derived':derived,'generated':generated,'verification':'Every copied file source/copy SHA-256 and immediate source readback matched. No game code executed.'}
        (dest/'MANIFEST.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
        n=sum(r['bytes'] for r in rows)
        readme='# Private deep reference: '+game+'\n\n2026-10-14. Read-only source preservation; no source-game or YAIR gameplay acceptance.\n\n'
        readme+='## Index\n\n'+''.join('- '+s+'\n' for s in purposes)
        readme+='\n`MANIFEST.json` binds every copied file to its exact original path, byte length and SHA-256. Copied '+str(len(rows))+' files / '+str(n)+' bytes. Folder names preserve source identity; file/line or serialized IDs remain the lookup route. Full tables/prose are retained only within the selected input families, not claimed exhaustive for the game.\n\n'
        if derived:readme+='`decoded/` or `tables/` contains structural derivatives described in the manifest. '+derived.get('limits','')+'\n\n'
        readme+='## Limits and safe reuse\n\nUnresolved native execution, serialized wiring, dynamic dialogue predicates and server semantics stay unresolved. Decompiled code and token renderings are reference flows, not compile/runtime proof. Use the public dossier and deep-detail ledger to select a named semantic re-pass. Preserve source attribution/notices. No raw code, text or asset is authorized for incorporation into YAIR by this snapshot. Player saves, profiles, account state, binaries and installers were not copied.\n'
        (dest/'README.md').write_text(readme)
        index=dest.parent/'README.md'
        if index.exists():raise RuntimeError('Existing index requires explicit merge, not replacement')
        index.write_text('# Private reference index: '+game+'\n\n[Deep-detail snapshot, 2026-10-14]('+DATE+'/README.md) preserves existing local source/data read-only. See its MANIFEST for hashes and exact scope. This material is ignored by Git. Semantic gaps remain in the public deep-detail audit ledger.\n')
        receipts.append({'game':game,'private_index':str(index.relative_to(REPO)),'snapshot':str(dest.relative_to(REPO)),'copied_files':len(rows),'copied_bytes':n,'generated_files':len(generated),'generated_bytes':sum(r['bytes'] for r in generated),'manifest_sha256':sha(dest/'MANIFEST.json'),'ignore_rule':check.stdout.strip(),'derived_counts':derived})
        print(game,len(rows),n,flush=True)
    (OUT/'DEEP_SAVES.json').write_text(json.dumps(receipts,ensure_ascii=False,indent=2)+'\n')

if __name__=='__main__':run()
