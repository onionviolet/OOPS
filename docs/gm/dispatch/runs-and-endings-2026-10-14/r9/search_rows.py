"""Read-only per-row discovery search; matches are leads, not classifications."""
import collections
import hashlib
import json
import re
from pathlib import Path

LANE = Path(__file__).parent
final_pass = (LANE / 'FINAL_CORPUS_MANIFEST.json').exists()
rows = json.loads((LANE / ('CURRENT_ROW_INVENTORY.json' if final_pass else 'ROW_INVENTORY.json')).read_text())
manifest = json.loads((LANE / ('FINAL_CORPUS_MANIFEST.json' if final_pass else 'CORPUS_MANIFEST.json')).read_text())
stop = set('the and from with this that world worlds game per can for one two its your you into rows code default none when where why matters keep what how new first same part save source files by are as at of to on or a an no not id own row more all has other after before using shown proposal plain layer line allows follows existing ends days year'.split())
index = collections.defaultdict(set)
records = []
for entry in manifest:
    for number, line in enumerate(Path(entry['path']).read_text().splitlines(), 1):
        key = len(records)
        records.append((entry['path'], number, line))
        for word in set(w.lower().rstrip('s') for w in re.findall(r'[A-Za-z]{4,}', line)):
            index[word].add(key)
results = []
for row in rows:
    title = re.search(r'\*\*(.*?)\*\*', row['text'])
    basis = row['text'] if final_pass else title.group(1) if title else row['text'].split('|')[2]
    terms = sorted(set(w.lower().rstrip('s') for w in re.findall(r'[A-Za-z]{4,}', basis) if w.lower() not in stop))
    scores = collections.Counter(key for term in terms for key in index[term])
    by_file = collections.Counter()
    hits = []
    for key, score in sorted(scores.items(), key=lambda pair: (-pair[1], pair[0])):
        path, number, line = records[key]
        if score < min(2, len(terms)) or by_file[path] >= 2:
            continue
        by_file[path] += 1
        hits.append({'path': path, 'line': number, 'score': score,
                     'line_sha256': hashlib.sha256(line.encode()).hexdigest()})
        if len(hits) == 25:
            break
    results.append({'code': row['code'], 'terms': terms, 'searched_files': len(manifest), 'hits': hits})
(LANE / ('FINAL_SEARCH_EVIDENCE.json' if final_pass else 'SEARCH_EVIDENCE.json')).write_text(json.dumps(results, indent=2) + '\n')
print(f'{len(rows)} rows searched across {len(manifest)} files; results are discovery leads only.')
