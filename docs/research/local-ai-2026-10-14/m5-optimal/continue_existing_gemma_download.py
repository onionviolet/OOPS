"""Continue only the already-running Gemma transfer after cancelling the shared worker."""
import datetime
import json
from pathlib import Path
import time
import urllib.request

HERE = Path(__file__).resolve().parent
STATUS = HERE / 'gemma-download-continuation.json'


def save(value):
    value['updated_at'] = datetime.datetime.now(datetime.timezone.utc).isoformat()
    temp = STATUS.with_suffix('.tmp')
    temp.write_text(json.dumps(value, indent=2) + '\n')
    temp.replace(STATUS)


try:
    request = urllib.request.Request(
        'http://127.0.0.1:11434/api/pull',
        data=json.dumps({'model': 'gemma4:31b-mlx', 'stream': True}).encode(),
        headers={'Content-Type': 'application/json'},
    )
    last = 0
    with urllib.request.urlopen(request, timeout=86400) as response:
        for line in response:
            event = json.loads(line)
            if 'error' in event:
                raise RuntimeError(event['error'])
            if time.monotonic() - last > 10 or event.get('status') == 'success':
                save({'model': 'gemma4:31b-mlx', 'progress': event})
                last = time.monotonic()
    save({'model': 'gemma4:31b-mlx', 'phase': 'pull_stream_finished'})
except Exception as error:
    save({'model': 'gemma4:31b-mlx', 'phase': 'failed', 'error': str(error)})
    raise
