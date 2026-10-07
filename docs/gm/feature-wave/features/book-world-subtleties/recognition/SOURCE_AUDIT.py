"""Read-only source/profile correspondence. Does not exercise gameplay helpers."""
from pathlib import Path
import hashlib
import json

ROOT = Path(__file__).resolve().parents[6]
HERE = Path(__file__).parent
LANES = ROOT / 'docs/research/novels/full-book'

def read(path):
    return json.loads(path.read_text())

def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

module = (ROOT / 'src/feature_expansion_book_recognition.js').read_text()
marker = 'export const BOOK_RECOGNITION_PROFILES = deepFreeze('
start = module.index(marker) + len(marker)
end = module.index(');\n\nexport const BOOK_RECOGNITION_SCENE', start)
profiles = json.loads(module[start:end])
assert len(profiles) == 4
assert len({x['id'] for x in profiles}) == 4
reference_count = 0
for runtime in profiles:
    slug = runtime['id']
    dossier = read(HERE / slug / 'COVERAGE.json')['world']
    assert runtime['source'] == dossier['source'], slug
    assert runtime['nativeBound'] is False
    assert len(runtime['rules']) == len(dossier['rules']) == 3
    assert len(runtime['deepChainDisposition']['phases']) == 5
    assert runtime['topologyDisposition']['activation']
    evidence_index = {}
    def compact(value):
        if isinstance(value,dict) and 'claimId' in value and 'locators' in value:
            evidence_index[value['claimId']] = value
            return value['claimId']
        if isinstance(value,dict):
            return {key:compact(item) for key,item in value.items()}
        if isinstance(value,list):
            return [compact(item) for item in value]
        return value
    expected = compact(dossier)
    expected['evidenceIndex'] = evidence_index
    assert runtime == expected, slug
    filename, key, id_key = {
        'mother-of-learning':('manifest.json','chapters','chapter'),
        'lord-of-mysteries':('chapter_manifest.json','entries','serial'),
        'circle-of-inevitability':('CHAPTER_MANIFEST.json','members','spine_index'),
        'shadow-slave':('chapter_manifest.json','chapters','chapter')
    }[slug]
    rows = {row[id_key]:row for row in read(LANES / slug / filename)[key] if row.get(id_key) is not None}
    coverage_counts = {x['spine_index']:x['paragraph_count'] for x in read(LANES / slug / 'COVERAGE.json')['members']} if slug == 'circle-of-inevitability' else {}
    claim_registry = None
    if slug == 'mother-of-learning':
        claim_registry = {x['id'] for x in read(LANES / slug / 'CLAIM_INDEX.json')['source_claims']}
    elif slug in ('lord-of-mysteries','circle-of-inevitability'):
        claim_registry = {x['id'] for x in read(LANES / slug / 'claims.json')['claims']}
    for cid,evidence in evidence_index.items():
        note = ROOT / evidence['notesPath']
        assert note.is_file(), (slug,cid)
        # COI worker prose abbreviates IDs; its accepted registry owns the full ID.
        assert cid in claim_registry if claim_registry is not None else cid in note.read_text(), (slug,cid)
        assert evidence['sourceSha256'] == runtime['source']['sha256']
        for loc in evidence['locators']:
            loc_id = loc.get('chapter',loc.get('serial',loc.get('spineIndex')))
            member = rows[loc_id]
            assert loc['member'] == member['member']
            assert loc['memberSha256'] == member['member_sha256']
            # Manifests use different count fields but exact edition conventions.
            maximum = member.get('paragraphs',member.get('paragraph_count',coverage_counts.get(loc_id)))
            assert maximum is not None, (slug,cid)
            assert 1 <= loc['paragraphs'][0] <= loc['paragraphs'][1] <= maximum, (slug,cid,loc)
            reference_count += 1
        for rule in runtime['rules']:
            assert all(value in evidence_index for value in rule['evidence'])
pins = read(HERE / 'SOURCE_PINS.json')['inputs']
drift = [path for path,expected in pins.items() if digest(ROOT / path) != expected]
# Active source writers may progress after this captured snapshot. Report drift;
# a future repair must be reviewed rather than silently regenerating the baseline.
print(json.dumps({'profiles':len(profiles),'rules':sum(len(x['rules']) for x in profiles),
                  'chains':len(profiles),'chainPhases':20,'exactLocatorIntervals':reference_count,
                  'sourcePins':len(pins),'currentInputDrift':drift,'status':'static-source-correspondence-pass'}))
