"""Read-only donor capture. Outputs only this lane's authorized private evidence."""
from pathlib import Path
import concurrent.futures
import hashlib
import json
import os
import subprocess

REPO = Path('/Users/weiwei/code/yet-another-idle-rpg')
HOME = Path.home()
RESEARCH = HOME / '.codex/research'
STEAM = HOME / 'Library/Application Support/Steam/steamapps/common'
records = []

def capture(game, source, name=None):
    source = Path(source)
    dest = REPO / 'docs/research' / game / 'private/around-you-sims-2026-10-16' / (name or source.name)
    dest.parent.mkdir(parents=True, exist_ok=True)
    data = source.read_bytes()
    dest.write_bytes(data)
    records.append(dict(game=game, source=str(source), snapshot=str(dest.relative_to(REPO)), sha256=hashlib.sha256(data).hexdigest()))
    return dest

def normalized(game, source, name):
    dest = capture(game, source, 'raw-' + name)
    output = dest.with_name(name)
    output.write_text(json.dumps(json.loads(dest.read_text()), ensure_ascii=False, indent=2) + '\n')
    return output

for fn in ['大地图元素配置表.json', '副本配置表.json', 'MANIFEST.json']:
    normalized('tale-of-immortal', RESEARCH / 'tale-of-immortal-2/extract' / fn, fn)
acs = RESEARCH / 'bf-amazing-cultivation-simulator/extract/managed'
for fn in ['Wnd_GameMain.cs', 'Wnd_World.cs', 'Panel_ThingInfo.cs', 'XiaWorld/World.cs', 'XiaWorld/WorldRegionInfo.cs']:
    capture('amazing-cultivation-simulator', acs / fn)
capture('caves-of-qud', RESEARCH / 'bf-caves-of-qud/extract/Base/Manual.xml')
for fn in ['XRL.World.Parts.Mutation.HeightenedSmell.cs', 'XRL.World.Parts.Mutation.HeightenedHearing.cs']:
    capture('caves-of-qud', RESEARCH / 'caves-of-qud/repass-2026-10-14/decompiled' / fn)
rim = RESEARCH / 'fs-rimworld-features/decompiled'
for fn in ['Verse/MouseoverReadout.cs', 'RimWorld/InspectPaneUtility.cs', 'RimWorld/MainTabWindow_Inspect.cs', 'RimWorld/ResourceReadout.cs', 'RimWorld/ResourceCounter.cs', 'RimWorld/MainTabWindow_Wildlife.cs', 'RimWorld/GlobalControls.cs', 'RimWorld/BeautyUtility.cs', 'RimWorld.Planet/WorldInspectPane.cs', 'RimWorld/RoomStatWorker_Beauty.cs']:
    capture('rimworld', rim / fn)
df = RESEARCH / 'bf-dwarf-fortress/extract/native-strings.json'
data = json.loads(df.read_text())
# Preserve original offsets and make the existing raw census line-addressable.
dest = REPO / 'docs/research/dwarf-fortress/private/around-you-sims-2026-10-16/native-strings.jsonl'
dest.parent.mkdir(parents=True, exist_ok=True)
dest.write_text('\n'.join(json.dumps(x, ensure_ascii=False) for x in data) + '\n')
records.append(dict(game='dwarf-fortress', source=str(df), snapshot=str(dest.relative_to(REPO)), sha256=hashlib.sha256(df.read_bytes()).hexdigest(), transform='one original string/offset record per line'))
capture('dwarf-fortress', RESEARCH / 'bf-dwarf-fortress/extract/payload/data/init/interface.txt')
for fn in ['resources_16994_Scenes', 'resources_16958_SceneMapItem', 'resources_17101_GlobalMapItem']:
    normalized('immortal-life', RESEARCH / 'immortal-life/extract/text' / fn, fn + '.json')
capture('warsim', RESEARCH / 'ds-warsim/extract/_Z9NomadCampv.direct.c.resolved.txt')
capture('warsim', RESEARCH / 'warsim/extract/strings.txt')
pz = STEAM / 'ProjectZomboid/Project Zomboid.app/Contents/Java/media/lua'
for fn in ['client/Foraging/ISSearchWindow.lua', 'client/Foraging/ISSearchManager.lua', 'shared/Foraging/forageSystem.lua']:
    capture('project-zomboid', pz / fn)

env = dict(os.environ, DOTNET_ROOT=str(HOME / '.dotnet'))
jobs = [
    ('caves-of-qud', 'Qud.UI.NearbyItemsWindow', RESEARCH / 'caves-of-qud/repass-2026-10-14/input/Managed/Assembly-CSharp.dll'),
    ('caves-of-qud', 'XRL.UI.ObjectFinderContexts.NearbyItems', RESEARCH / 'caves-of-qud/repass-2026-10-14/input/Managed/Assembly-CSharp.dll'),
    ('caves-of-qud', 'XRL.UI.Look', RESEARCH / 'caves-of-qud/repass-2026-10-14/input/Managed/Assembly-CSharp.dll'),
    ('stardew-valley', 'StardewValley.Menus.MapPage', STEAM / 'Stardew Valley/Contents/MacOS/Stardew Valley.dll'),
    ('rain-world', 'HUD.Map', STEAM / 'Rain World/RainWorld_Data/Managed/Assembly-CSharp.dll'),
    ('rain-world', 'HUD.RainMeter', STEAM / 'Rain World/RainWorld_Data/Managed/Assembly-CSharp.dll'),
]
def decompile(job):
    game, cls, source = job
    output = REPO / 'docs/research' / game / 'private/around-you-sims-2026-10-16' / (cls + '.cs')
    output.parent.mkdir(parents=True, exist_ok=True)
    result = subprocess.run([str(HOME / '.dotnet/tools/ilspycmd'), '--disable-updatecheck', '-t', cls, str(source)], env=env, capture_output=True, timeout=100)
    output.write_bytes(result.stdout)
    output.with_suffix('.stderr.txt').write_bytes(result.stderr)
    return dict(game=game, source=str(source), sha256=hashlib.sha256(source.read_bytes()).hexdigest(), snapshot=str(output.relative_to(REPO)), type=cls, exit_code=result.returncode, bytes=len(result.stdout))
with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
    for result in pool.map(decompile, jobs):
        records.append(result)
        print(json.dumps(result))
for game in sorted({r['game'] for r in records}):
    path = REPO / 'docs/research' / game / 'private/around-you-sims-2026-10-16/PROVENANCE.json'
    path.write_text(json.dumps([r for r in records if r['game'] == game], ensure_ascii=False, indent=2) + '\n')
print('Captured', len(records), 'source records; no game processes started.')
