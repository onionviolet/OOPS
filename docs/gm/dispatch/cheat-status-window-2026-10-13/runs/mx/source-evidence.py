from pathlib import Path
import subprocess,hashlib,json
r=Path('/tmp/yairpg-mx'); out=Path(__file__).parent
files=['src/status_window.js','src/cheat_cards.js','src/display.js','src/main.js','src/models/combat.js','src/workspace_layout.js','styles/status_window.css','styles/workspace_discovery.css','styles/display_settings.css']
(out/'snapshot.json').write_text(json.dumps({'commit':subprocess.check_output(['git','-C',str(r),'rev-parse','HEAD']).decode().strip(),'files':{f:hashlib.sha256((r/f).read_bytes()).hexdigest() for f in files},'bundle':hashlib.sha256((r/'dist/bundle.js').read_bytes()).hexdigest()},indent=2))
ranges={'src/status_window.js':[(1,43)],'src/cheat_cards.js':[(65,104)],'src/display.js':[(863,905),(963,1043),(3848,3868)],'src/main.js':[(303,317),(3639,3662),(3948,3965)],'src/models/combat.js':[(217,242),(437,455)],'src/workspace_layout.js':[(116,124),(315,329)],'styles/status_window.css':[(1,20)],'styles/workspace_discovery.css':[(1,20)],'styles/display_settings.css':[(15,25)]}
s=[]
for f,rs in ranges.items():
 lines=(r/f).read_text().splitlines()
 for a,b in rs:s.append(f+'\n'+'\n'.join(f'{i+1}: {lines[i]}' for i in range(a-1,min(b,len(lines)))))
(out/'source.txt').write_text('\n\n'.join(s))
