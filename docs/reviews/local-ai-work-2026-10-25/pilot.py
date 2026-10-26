"""Two synthetic qualification probes; no tools, game data, or repository writes by model."""
import argparse
import hashlib
import json
import time
import urllib.request
from pathlib import Path

parser = argparse.ArgumentParser()
parser.add_argument('--run', action='store_true')
parser.add_argument('--out', type=Path, default=Path('/tmp/yair-local-ai-pilot.json'))
args = parser.parse_args()
fixtures = [
    ('extract', 'Return JSON only with keys cost, minutes, output, source_id, unknown. Source P17: The kiln consumes 3 clay and 2 fuel. After 8 minutes it produces 1 tile. The text does not specify resale price. cost is an object with clay and fuel. output is an object with tile. unknown is a list of unknown field names, using resale_price.',
     {'cost': {'clay': 3, 'fuel': 2}, 'minutes': 8, 'output': {'tile': 1}, 'source_id': 'P17', 'unknown': ['resale_price']}),
    ('contradiction', 'Return JSON only with keys conflicts and unknown. Each is a list of strings. Source A paragraph 4 says the gate costs 3 coins. Source B paragraph 9 says the same gate costs 5 coins. Neither source has a date or precedence. Use conflict string gate_cost and unknown string authoritative_cost. Preserve the conflict rather than resolving it.',
     {'conflicts': ['gate_cost'], 'unknown': ['authoritative_cost']}),
]
if not args.run:
    print('Dry run: 2 requests, qwen3.8:27b, sequential, 90-second timeout each, 256 output tokens each.')
    raise SystemExit()
results = []
for name, prompt, expected in fixtures:
    payload = {'model': 'qwen3.8:27b', 'messages': [{'role': 'user', 'content': prompt}],
               'stream': False, 'think': False, 'format': 'json', 'keep_alive': 0,
               'options': {'temperature': 0, 'seed': 42, 'num_ctx': 4096, 'num_predict': 256}}
    started = time.monotonic()
    row = {'fixture': name, 'prompt': prompt, 'prompt_sha256': hashlib.sha256(prompt.encode()).hexdigest(), 'expected': expected,
           'request': {k: v for k, v in payload.items() if k != 'messages'}}
    try:
        req = urllib.request.Request('http://127.0.0.1:11434/api/chat', json.dumps(payload).encode(), {'Content-Type': 'application/json'})
        with urllib.request.urlopen(req, timeout=90) as response:
            data = json.load(response)
        content = data.get('message', {}).get('content', '')
        row.update(output=content, done=data.get('done'), done_reason=data.get('done_reason'),
                   metrics={k: data.get(k) for k in ['total_duration', 'load_duration', 'prompt_eval_count', 'prompt_eval_duration', 'eval_count', 'eval_duration']})
        row['pass'] = json.loads(content) == expected and data.get('done') is True and data.get('done_reason') == 'stop'
    except Exception as exc:
        row.update(error=str(exc), **{'pass': False})
    row['elapsed_seconds'] = round(time.monotonic() - started, 3)
    results.append(row)
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(results, indent=2) + '\n')
    print(json.dumps({k: row[k] for k in ['fixture', 'pass', 'elapsed_seconds']}), flush=True)
