from pathlib import Path
import hashlib, json
home=Path.home()
repo=Path('/Users/weiwei/code/yet-another-idle-rpg')
sources=[
 ('caves-of-qud', home/'.codex/research/caves-of-qud/repass-2026-10-14/decompiled/XRL.World.Zone.cs'),
 ('dwarf-fortress', home/'.codex/research/bf-dwarf-fortress/extract/payload/data/vanilla/vanilla_interface/graphics/graphics_interface.txt'),
 ('project-zomboid', home/'Library/Application Support/Steam/steamapps/common/ProjectZomboid/Project Zomboid.app/Contents/Java/media/lua/client/Foraging/ISZoneDisplay.lua'),
 ('project-zomboid', home/'Library/Application Support/Steam/steamapps/common/ProjectZomboid/Project Zomboid.app/Contents/Java/media/lua/client/ISUI/Maps/ISWorldMap.lua'),
]
for game, source in sources:
 dest=repo/'docs/research'/game/'private/around-you-sims-2026-10-16'/source.name
 data=source.read_bytes(); dest.write_bytes(data)
 manifest=dest.parent/'PROVENANCE.json'
 rows=json.loads(manifest.read_text())
 rows.append(dict(game=game,source=str(source),snapshot=str(dest.relative_to(repo)),sha256=hashlib.sha256(data).hexdigest()))
 manifest.write_text(json.dumps(rows,indent=2,ensure_ascii=False)+'\n')
 print(game, source.name, len(data))
