"""Source-only checks for this research dossier. Never loads user saves or builds."""
from pathlib import Path
import hashlib
import json
import re

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[3]
PRIVATE = Path.home() / '.codex/research/kenshi'
FILES = ['gamedata.base', 'Newwworld.mod', 'Dialogue.mod', 'rebirth.mod']
rows = {f: json.loads((PRIVATE / (f + '.json')).read_text())['rows'] for f in FILES}
index = {f: {r['id']: r for r in rs} for f, rs in rows.items()}

def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

# Explicit coordinating-GM readback of key chains, across all three dossiers.
checks = {
 'gamedata.base': [
  ('2287-gamedata.base',1000369),('28-gamedata.quack',978957),
  ('17946-stick_people.mod',356729),('5276-chareditor.mod',2892849),
  ('18960-gamedata.base',4090470),('SHACKLES',3572677),
  ('581-gamedata.base',694500),('110-gamedata.quack',1074793),
  ('4092-TwoStorey.mod',459649),('1509-gamedata.base',3179274),
  ('1863-gamedata.base',4263708)],
 'Newwworld.mod': [
  ('96022-Newwworld.mod',1857359),('95579-Newwworld.mod',1832034),
  ('96020-Newwworld.mod',1855016),('96134-Newwworld.mod',1860032)],
 'Dialogue.mod': [
  ('19364-Dialogue.mod',534461),('5007272-Dialogue.mod',11889621),
  ('19558-Dialogue.mod',5023083),('19560-Dialogue.mod',3772437),
  ('54747-Dialogue.mod',7781862),('54826-Dialogue.mod',7804526),
  ('54807-Dialogue.mod',7781355),('55392-Dialogue.mod',7962597),
  ('42066-Dialogue.mod',3252711),('53396-Dialogue.mod',7370727),
  ('50664-Dialogue.mod',4769419),('61061-Dialogue.mod',9438793),
  ('59668-Dialogue.mod',9044798),('98999-Dialogue.mod',11506083),
  ('60456-Dialogue.mod',9268457)],
 'rebirth.mod': [
  ('2184-gamedata.base',92767),('46039-rebirth.mod',791864),
  ('96022-Newwworld.mod',454029),('95579-Newwworld.mod',448481),
  ('96020-Newwworld.mod',452978),('96134-Newwworld.mod',455534),
  ('17946-stick_people.mod',24498),('5276-chareditor.mod',232486),
  ('18960-gamedata.base',329249),('64614-rebirth.mod',2456212),
  ('64615-rebirth.mod',2458078),('16845-nodes_otto1.mod',307263),
  ('42331-rebirth.mod',1509727),('1532934-rebirth.mod',3324590),
  ('1532935-rebirth.mod',3325365),('1532936-rebirth.mod',3326210),
  ('110-gamedata.quack',78558),('57390-rebirth.mod',2215221),
  ('57367-rebirth.mod',2209092),('97212-rebirth.mod',3019910),
  ('1533782-rebirth.mod',3798816),('61061-Dialogue.mod',610640),
  ('1533495-__world reactions Slavers.mod',3627633),
  ('1533692-__world reactions Slavers.mod',3626635),
  ('51654-rebirth.mod',1703162),('60456-Dialogue.mod',602573)]
}
locator_results = []
for file, pairs in checks.items():
    for record, offset in pairs:
        assert index[file][record]['offset'] == offset, (file,record,offset)
        locator_results.append({'file':file,'id':record,'offset':offset})

# Field checks are bounded assertions, not an attempted native layer merge.
assert index['rebirth.mod']['2184-gamedata.base']['refs']['starting health'][0]['values'][0] == -150
assert index['rebirth.mod']['1532936-rebirth.mod']['props']['slave'] == 1
assert index['rebirth.mod']['1532935-rebirth.mod']['refs']['squad'][0]['values'][0] == 2
assert index['Dialogue.mod']['5007272-Dialogue.mod']['props']['compare by'] == 2
assert index['Dialogue.mod']['54826-Dialogue.mod']['refs']['contract end talk passive'][0]['id'] == '54807-Dialogue.mod'
assert index['Dialogue.mod']['55392-Dialogue.mod']['props']['tag'] == 5
assert index['rebirth.mod']['64615-rebirth.mod']['props']['function'] == 25
assert index['rebirth.mod']['60456-Dialogue.mod']['props']['chance per day'] == 2
assert index['Dialogue.mod']['60456-Dialogue.mod']['props']['target characters'] is True
field_count = 9

retention = json.loads((PRIVATE/'RETENTION.json').read_text())
selected = ['fcs.def','data/gamedata.base','data/Newwworld.mod','data/Dialogue.mod','data/rebirth.mod','data/tips.txt']
retained = []
for file in selected:
    item = next(x for x in retention['files'] if x['path'] == file)
    assert digest(PRIVATE/'inputs'/file) == item['sha256'], file
    retained.append(file)

snapshot = json.loads((HERE/'INPUT_SNAPSHOT.json').read_text())
preserved = []
input_matches = []
for item in snapshot['files']:
    path = Path(item['path']).expanduser()
    if not path.is_absolute():
        path = ROOT/path
    match = digest(path) == item['sha256']
    input_matches.append({'path':item['path'],'matches_snapshot':match})
    if item['path'].startswith('docs/research/kenshi/'):
        assert match, item['path']
        preserved.append(item['path'])
    if item['path'].startswith('~/.codex/'):
        assert match, item['path']

links = []
for md in HERE.glob('*.md'):
    for target in re.findall(r'\]\(([^)]+)\)', md.read_text()):
        if target == 'VALIDATION.json':
            continue  # This artifact is written at the end of this check.
        if target.startswith(('http:','https:','#')):
            continue
        path_part = target.split('#')[0]
        assert (md.parent/path_part).exists(), (md.name,target)
        links.append({'from':md.name,'target':target})

tips = (PRIVATE/'inputs/data/tips.txt').read_text().splitlines()
assert len(tips) == 62
text = (HERE/'SMALL_TOUCHES.md').read_text()
touches = re.findall(r'^\| (T\d\d) \|', text,re.M)
assert len(touches) == len(set(touches)) == 30
proposals = re.findall(r'^\| \d / (O\d) \|',(HERE/'PROPOSALS.md').read_text(),re.M)
assert len(proposals) == 8
result = {
 'date':'2026-10-08','status':'passed source-only artifact checks',
 'locator_checks':locator_results,'locator_count':len(locator_results),
 'field_assertions':field_count,'retained_input_hash_matches':retained,
 'first_pass_snapshot_hash_matches':preserved,'input_snapshot_readback':input_matches,
 'local_link_count':len(links),'local_links':links,
 'tips_read':62,'small_touch_count':30,'ranked_proposal_count':8,
 'excluded':['native gameplay execution','final database merge','build','browser','save/reload/import','human design acceptance'],
}
(HERE/'VALIDATION.json').write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps({'locators':len(locator_results),'fields':field_count,'hashes':len(retained),'links':len(links),'touches':30,'proposals':8}))
