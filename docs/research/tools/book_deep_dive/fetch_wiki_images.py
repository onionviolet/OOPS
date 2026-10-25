"""Polite, resumable download of a wiki image manifest (allimages API output saved
from the in-app browser). Plain curl, default user agent, 0.3 s apart; skips files
already present; logs failures. Only for a wiki Weibao asked to download.
Usage: python3 -I fetch_wiki_images.py MANIFEST.json OUTDIR
"""
import json, os, sys, time, subprocess, re
man, outdir = sys.argv[1], sys.argv[2]
os.makedirs(outdir, exist_ok=True)
imgs = [x for x in json.load(open(man))['images'] if x['m'].startswith('image/')]
ok = skip = err = 0
log = open(os.path.join(outdir, '_fetch_log.tsv'), 'a')
for i, x in enumerate(imgs):
    name = re.sub(r'[^\w.\-]+', '_', x['n'])[:180]
    path = os.path.join(outdir, name)
    if os.path.exists(path) and os.path.getsize(path) > 0: skip += 1; continue
    r = subprocess.run(['curl', '-sS', '--fail', '-o', path, x['u']], capture_output=True, text=True)
    if r.returncode == 0: ok += 1
    else:
        err += 1; log.write(f"{x['n']}\t{r.stderr.strip()[:200]}\n")
        if os.path.exists(path): os.remove(path)
    if i % 200 == 0: print(f'{i}/{len(imgs)} ok={ok} skip={skip} err={err}', flush=True)
    time.sleep(0.3)
print(f'done {len(imgs)} ok={ok} skip={skip} err={err}', flush=True)
