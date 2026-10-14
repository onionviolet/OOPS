from pathlib import Path
import hashlib,json,subprocess
repo=Path('/Users/weiwei/code/yet-another-idle-rpg')
files=['AGENTS.md','PROJECT.md','docs/USER_VISION.md','docs/gm/dispatch/engine-runtime-2026-10-14/COMMON.md','src/save_files.js','src/expansion_persistence.js','src/main.js','docs/research/RUNTIME_HOTSPOT_AUDIT_2026-10-14.md','docs/research/TECH_STACK_OPTIONS_2026-10-14.md']
data={f:hashlib.sha256((repo/f).read_bytes()).hexdigest() for f in files}
data['git_branch']=subprocess.check_output(['git','branch','--show-current'],cwd=repo,text=True).strip()
data['head']=subprocess.check_output(['git','rev-parse','HEAD'],cwd=repo,text=True).strip()
Path('read-provenance.json').write_text(json.dumps(data,indent=2)+'\n')
