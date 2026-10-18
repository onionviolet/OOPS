from pathlib import Path
import hashlib, json, re, subprocess

repo=Path('/Users/weiwei/code/yet-another-idle-rpg')
lane=repo/'docs/gm/dispatch/ui-foundation-2026-10-15/next-parts/around-you-sims.md'
text=lane.read_text()
labelled_links=re.findall(r'\[([^\]]+)\]\(([^)]+)\)',text)
links=[link for _,link in labelled_links]
missing=[]
for link in links:
    if not link.startswith(('http:', 'https:')):
        if not (lane.parent/link.split('#')[0]).resolve().exists():
            missing.append(link)
assert not missing, missing
for label,link in labelled_links:
    match=re.search(r':(\d[\d–,\-]*)$',label)
    if match and not link.startswith(('http:', 'https:')):
        count=len((lane.parent/link.split('#')[0]).resolve().read_text().splitlines())
        assert all(int(n)<=count for n in re.findall(r'\d+',match.group(1))),(label,count)
for section in ['## Summary','## Findings table','## Proposed plan edits','## Settled without asking','## Questions for Weibao']:
    assert section in text, section
summary=text.split('## Summary\n',1)[1].split('\n## ',1)[0]
assert len([s for s in summary.splitlines() if s.strip()])<=5
counts={i:len(re.findall(rf'\| \*\*AS\d+\*\* \| {i} ',text)) for i in range(1,6)}
assert counts=={1:4,2:5,3:5,4:4,5:0}, counts
manifests=[]
for game in ['tale-of-immortal','amazing-cultivation-simulator','caves-of-qud','dwarf-fortress','rimworld','immortal-life','warsim','stardew-valley','project-zomboid','rain-world']:
    p=repo/'docs/research'/game/'private/around-you-sims-2026-10-16/PROVENANCE.json'
    rows=json.loads(p.read_text())
    for row in rows:
        source=Path(row['source'])
        assert hashlib.sha256(source.read_bytes()).hexdigest()==row['sha256'],source
        snap=repo/row['snapshot']
        assert snap.exists() and snap.stat().st_size,snap
        assert row.get('exit_code',0)==0,row
    manifests.append(str(p.relative_to(repo)))
ignored=subprocess.run(['git','check-ignore','--',*manifests],cwd=repo,text=True,capture_output=True,check=True).stdout.splitlines()
assert set(ignored)==set(manifests)
result=dict(local_links=len(links),missing_links=missing,cited_line_bounds='pass',summary_lines=5,triage_counts=counts,private_manifests=len(manifests),source_records=sum(len(json.loads((repo/p).read_text())) for p in manifests),private_paths_ignored=True)
(lane.parent/'scratch/around-you-sims/document-checks.json').write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps(result))
