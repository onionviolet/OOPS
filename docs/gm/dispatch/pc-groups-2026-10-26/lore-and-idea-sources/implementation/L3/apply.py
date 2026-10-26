"""Apply prepared edits after atomic slot/path acquisition; preserves before-images."""
from pathlib import Path
import json,hashlib,subprocess,difflib
here=Path(__file__).parent
locks=json.loads((here/'LOCKS.json').read_text())
for p in [locks['slot']]+locks['paths']:
    assert json.loads((Path(p)/'owner.json').read_text())['thread']=='01a1794a-8b76-7ca3-803b-96d8c1e71dca'
paths=['src/world_packs/book_mol_pack.js','src/book_world_mol_lore.js','src/book_world_mol_actions.js','tests/mol_lore_traces.test.js']
before={p:Path(p).read_text() if Path(p).exists() else '' for p in paths}
assert 'evaluateMolCredential' not in before['src/book_world_mol_lore.js']
(here/'before').mkdir(exist_ok=True)
for p,v in before.items():(here/'before'/Path(p).name).write_text(v)
pack=json.loads(before[paths[0]].split('export default ',1)[1].rstrip().rstrip(';'))
(here/'commands-after-L2.json').write_text(json.dumps(pack['native']['definitions']['commands'],indent=2,ensure_ascii=False)+'\n')
subprocess.run(['python3',str(here/'add-traces.py')],check=True)
p=Path(paths[1]);s=p.read_text()
s=s.replace('    return r;','''    if (r.credential) {
        const c = r.credential;
        if (r.kind !== 'document' || !c || !['device_batch', 'operator', 'method'].includes(c.scope) ||
            !Number.isSafeInteger(c.standard) || c.standard < 1 ||
            !['issuer', 'subject', 'sourceCommand', 'conditions'].every(k => typeof c[k] === 'string' && c[k].length))
            throw Error('Unsupported retained Cyoria credential. Preserve this save for its matching reader.');
    }
    return r;''',1)
s=s.replace('export function validateMolLoreRecords(state) {','''export function validateMolLoreRecords(state) {
    const world = state.worlds?.['book.mol.cyoria']?.facts || {};
    if (world[MOL_LORE_PREFIX + 'jigRestored'] != null && typeof world[MOL_LORE_PREFIX + 'jigRestored'] !== 'boolean' ||
        world[MOL_LORE_PREFIX + 'institutionStandard'] != null && ![1, 2].includes(world[MOL_LORE_PREFIX + 'institutionStandard']))
        throw Error('Unsupported actual Cyoria jig or institution state. Preserve this save for its matching reader.');''',1)
s=s.replace('text: formatMolLore(r),','text: formatMolLore(r) + credentialText(r),')
s=s.replace('` Copy of ${r.copyOf}.`', "' This copies an earlier source; it is not independent corroboration.'")
s=s.replace('` Revises ${r.supersedes}; the earlier account is retained.`', "' This revises an earlier account; the earlier account is retained.'")
s += '''
function credentialText(r) {
    if (!r.credential) return '';
    const c = r.credential;
    const issuer = c.issuer === 'book.mol.ilsa' ? 'Ilsa Zileti' : c.issuer === 'book.mol.nora' ? 'Nora Boole' : 'the stated issuer';
    const scope = {device_batch: 'this device', operator: 'manual operator', method: 'guide methods'}[c.scope];
    return ` Issued at played minute ${r.at}. Issuer: ${issuer}; scope: ${scope}; standard ${c.standard}. ${c.conditions}.`;
}
'''
s+=(here/'institution-reader.pending').read_text();p.write_text(s)
p=Path(paths[2]);s=p.read_text();s="import {molLoreInstitutionFacts} from './book_world_mol_lore.js';\n"+s
s=s.replace(' return f;',' Object.assign(f,molLoreInstitutionFacts(state,{ownedLamp:held(\'player\',K.lamp)+acceptedTool(K.lamp)>=1}));\n return f;',1);p.write_text(s)
Path(paths[3]).write_text((here/'traces.test.pending').read_text().replace('const actual=e=molLoreEvidence','const actual=molLoreEvidence'))
patch=''
for p,v in before.items():patch+=''.join(difflib.unified_diff(v.splitlines(True),Path(p).read_text().splitlines(True),fromfile='a/'+p,tofile='b/'+p))
(here/'L3-source.patch').write_text(patch)
(here/'source-inputs.json').write_text(json.dumps({p:hashlib.sha256(Path(p).read_bytes()).hexdigest() for p in paths},indent=2)+'\n')
print('Applied additive trace/credential commands, strict optional record metadata, pure evaluator and current-owner join; tests installed')
