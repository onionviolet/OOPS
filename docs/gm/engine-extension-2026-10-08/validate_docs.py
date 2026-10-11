"""Validate this proposal's documents and used schema subset, never game state."""
from pathlib import Path
import copy, datetime, hashlib, json, re
root=Path(__file__).resolve().parent
schema=json.loads((root/'cards.schema.json').read_text())
examples=json.loads((root/'examples.json').read_text())
def validate(value,s,path='$'):
    if '$ref' in s:
        target=schema
        for part in s['$ref'][2:].split('/'):target=target[part]
        return validate(value,target,path)
    if 'oneOf' in s:
        passed=0
        for candidate in s['oneOf']:
            try:validate(value,candidate,path);passed+=1
            except ValueError:pass
        if passed!=1:raise ValueError(f'{path}: oneOf matches {passed}')
        return
    def fail(msg):raise ValueError(f'{path}: {msg}')
    types={'object':lambda v:isinstance(v,dict),'array':lambda v:isinstance(v,list),'string':lambda v:isinstance(v,str),'integer':lambda v:type(v)==int,'number':lambda v:type(v) in [int,float],'boolean':lambda v:type(v)==bool,'null':lambda v:v is None}
    if 'type' in s:
        ts=s['type'] if isinstance(s['type'],list) else [s['type']]
        if not any(types[t](value) for t in ts):fail('type')
    if 'const' in s and value!=s['const']:fail('const')
    if 'enum' in s and value not in s['enum']:fail('enum')
    if type(value) in [int,float]:
        if 'minimum' in s and value<s['minimum']:fail('minimum')
        if 'maximum' in s and value>s['maximum']:fail('maximum')
        if 'exclusiveMinimum' in s and value<=s['exclusiveMinimum']:fail('exclusiveMinimum')
    if isinstance(value,str):
        if len(value)<s.get('minLength',0) or len(value)>s.get('maxLength',float('inf')):fail('length')
        if 'pattern' in s and not re.search(s['pattern'],value):fail('pattern')
    if isinstance(value,list):
        if len(value)<s.get('minItems',0) or len(value)>s.get('maxItems',float('inf')):fail('items count')
        if s.get('uniqueItems') and len({json.dumps(v,sort_keys=True) for v in value})!=len(value):fail('duplicate items')
        for i,v in enumerate(value):validate(v,s.get('items',{}),f'{path}[{i}]')
    if isinstance(value,dict):
        if not set(s.get('required',[]))<=value.keys():fail('required')
        props=s.get('properties',{})
        for key,v in value.items():
            if key in props:validate(v,props[key],f'{path}.{key}')
            elif s.get('additionalProperties') is False:fail(f'unknown {key}')
            elif isinstance(s.get('additionalProperties'),dict):validate(v,s['additionalProperties'],f'{path}.{key}')
for e in examples:validate(e,schema)
negative=[]
for label,mutate in [('unknown field',lambda e:e.update(extra=True)),('missing revision',lambda e:e.pop('revision')),('invalid kind',lambda e:e.update(kind='unknown'))]:
    bad=copy.deepcopy(examples[0]);mutate(bad)
    try:validate(bad,schema)
    except ValueError:negative.append(label)
    else:raise RuntimeError(f'negative example accepted: {label}')
for e in examples:
    if e['kind']=='operation':assert not set(e['data']['restoreDomains']) & set(e['data']['retainDomains'])
missing=[]
for doc in root.glob('*.md'):
    for target in re.findall(r'\]\(([^)]+)\)',doc.read_text()):
        if '://' in target or target.startswith('#'):continue
        if not (doc.parent/target.split('#')[0]).exists():missing.append(f'{doc.name}: {target}')
assert not missing,missing
repo=root.parents[2]
source_missing=[]
for path in re.findall(r'`(src/[^`: ;]+)',(root/'COMPONENTS.md').read_text()):
    if not (repo/path).exists():source_missing.append(path)
assert not source_missing,source_missing
before=json.loads((root/'INPUT_SNAPSHOT.json').read_text())['sha256']
drift=[path for path,digest in before.items() if not (repo/path).exists() or hashlib.sha256((repo/path).read_bytes()).hexdigest()!=digest]
result={'checkedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'exampleCount':len(examples),'schemaCheck':'local validator for schema keywords used here, not a general JSON Schema implementation','negativeExamplesRejected':negative,'operationDomainCheck':'restore/retain disjoint in filled example','localLinks':'all resolve','sourceFileLocators':'all paths exist','inputFilesCompared':len(before),'changedSinceSnapshot':drift,'runtimeTestsRun':False,'buildRun':False,'browserRun':False,'saveAccess':False,'limitations':['Pack references/adapters are proposed and unresolved; no executable pack validation','Source semantics are statically inspected, not exercised','Snapshot began after initial reads; no attribution of external input drift']}
(root/'VALIDATION.json').write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps(result,indent=2))
