"""Read-only metadata/source capture. Never downloads weights or calls inference."""
import concurrent.futures, datetime, hashlib, json, pathlib, urllib.request

ROOT = pathlib.Path(__file__).resolve().parent
MODELS = ['Qwen/Qwen3.8-27B', 'Altworld/Hemmingway-1',
 'darrellbest/Hemmingway-1-Heretic', 'Naphula/Goetia-26B-A4B-v1.3-Absolute-Heretic-ARA',
 'Naphula/Goetia-26B-A4B-v1.7', 'meta-models/Muse-Glimmer-30B',
 'meta-models/Muse-Glimmer-30B-GGUF', 'Qwen/Qwen3.5-9B',
 'MRockatansky/Gemma-4-31B-Storymaxxed3-GGUF', 'UltimateIntent/GemStrike-31B-GGUF',
 'orcarouter/Qwen3.8-27B-Uncensored-MLX', 'LessThanThreeAI/Qwen3.8-27B-Humanlike-Chat-GGUF',
 'Gryphe/Pantheon-Reasoning-26B-A4B-1.1-V2', 'prism-ml/Bonsai-27B-mlx-1bit']
SOURCES = {
 'eq-writing': 'https://raw.githubusercontent.com/EQ-bench/EQ-bench-site/main/creative_writing.js',
 'ugi': 'https://huggingface.co/spaces/DontPlanToEnd/UGI-Leaderboard/resolve/main/ugi-leaderboard-data.csv',
 'llama-muse': 'https://raw.githubusercontent.com/ggml-org/llama.cpp/master/src/models/muse.cpp',
 'llama-gemma4': 'https://raw.githubusercontent.com/ggml-org/llama.cpp/master/src/models/gemma4.cpp',
 'llama-grammar': 'https://raw.githubusercontent.com/ggml-org/llama.cpp/master/grammars/README.md',
 'vtuber': 'https://raw.githubusercontent.com/Open-LLM-VTuber/Open-LLM-VTuber/main/README.md',
 'airi': 'https://raw.githubusercontent.com/moeru-ai/airi/main/README.md',
 'miru': 'https://raw.githubusercontent.com/kiyotakali/Miru/main/README.md',
 'independent-comparison': 'https://raw.githubusercontent.com/dakshjain-1616/qwen-3.8-27-B-vs-qwen-3.6-27-B-vs-meta-glimmer-30B/main/README.md',
}

def fetch(url):
    with urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent':'YAIR-research/1'}), timeout=30) as r:
        return r.read()

def model(name):
    result = {'id':name}
    try:
        meta = json.loads(fetch('https://huggingface.co/api/models/'+name))
        result.update(revision=meta.get('sha'), modified=meta.get('lastModified'),
                      card=meta.get('cardData'), files=[f['rfilename'] for f in meta.get('siblings',[])])
        revision = result['revision']
        for filename in ['README.md','config.json']:
            try:
                data=fetch(f'https://huggingface.co/{name}/resolve/{revision}/{filename}')
                out=ROOT/'sources'/(name.replace('/','__')+'__'+filename)
                out.write_bytes(data)
                result[filename]={'sha256':hashlib.sha256(data).hexdigest(),'path':str(out.relative_to(ROOT))}
            except Exception as exc:result[filename]={'unavailable':str(exc)}
    except Exception as exc:result['error']=str(exc)
    return result

def source(item):
    key,url=item
    try:
        data=fetch(url); path=ROOT/'sources'/(key+'.txt');path.write_bytes(data)
        return {'id':key,'url':url,'sha256':hashlib.sha256(data).hexdigest(),'bytes':len(data)}
    except Exception as exc:return {'id':key,'url':url,'error':str(exc)}

if __name__=='__main__':
    (ROOT/'sources').mkdir(exist_ok=True)
    with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
        models=list(pool.map(model,MODELS)); sources=list(pool.map(source,SOURCES.items()))
    record={'captured_utc':datetime.datetime.now(datetime.timezone.utc).isoformat(),'models':models,'sources':sources}
    (ROOT/'public-evidence.json').write_text(json.dumps(record,indent=2))
    for m in models:print(m['id'],m.get('revision',m.get('error')), (m.get('card') or {}).get('license'))
    for s in sources:print(s['id'],s.get('bytes',s.get('error')))
