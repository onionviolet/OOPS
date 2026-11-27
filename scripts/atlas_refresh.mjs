import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {existsSync,mkdirSync,mkdtempSync,readFileSync,realpathSync,renameSync,rmdirSync,writeFileSync,copyFileSync} from 'node:fs';
import {dirname,join,relative,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=fileURLToPath(new URL('../',import.meta.url));
const privateDir=/^docs\/research\/novels\/[\w-]+\/private\/lead-run-[\w-]+$/;
// Collected outputs, migration headers and qualification markers. Prepared
// source, prompts, batch logs and source folders are outside this contract.
const output=/^[\w-]+c\d{3,}[A-Za-z0-9]*(?:_(?:m13_)?(?:census|scenes|fills|rules|people|places|services|customs|news|[a-z]+_other)\.jsonl|_header\.json|_(?:full|census|scenes|rules|people|places|texture)\.partial)$/;
const digest=bytes=>createHash('sha256').update(bytes).digest('hex');
const json=file=>JSON.parse(readFileSync(file,'utf8'));
const registry='docs/gm/dispatch/batch-reading-2026-10-27/plans/books.json';

export function validateManifest(rows,dirs){
    const seen=new Set();
    for(const {path,size,hash} of rows){
        const i=path.lastIndexOf('/');
        if(!dirs.has(path.slice(0,i))||!output.test(path.slice(i+1))||seen.has(path)||
            !Number.isSafeInteger(size)||size<0||!/^[0-9a-f]{64}$/.test(hash))throw Error('Invalid private reader manifest entry');
        seen.add(path);
    }
    return rows.sort((a,b)=>a.path.localeCompare(b.path));
}

export function selectChanges(rows,localHash){
    return rows.filter(row=>localHash(row.path)!==row.hash);
}

export function adopt(stage,live,previous,move=renameSync){
    const hadLive=existsSync(live);
    if(hadLive)move(live,previous);
    try{move(stage,live);}
    catch(error){
        if(hadLive)move(previous,live);
        throw error;
    }
}

const remoteCode=`
import hashlib, io, json, pathlib, re, sys, tarfile
root = (pathlib.Path.home() / 'code/yet-another-idle-rpg').resolve(strict=True)
def folder(rel):
    path = root / rel
    return path if path.is_dir() and path.resolve() == path else None
def output_files(directory):
    path = folder(directory)
    if path is not None:
        yield from (file for file in path.iterdir() if file.is_file() and not file.is_symlink() and re.fullmatch(request['pattern'], file.name))
def describe(file):
    body = file.read_bytes()
    return dict(path=str(file.relative_to(root)), size=len(body), hash=hashlib.sha256(body).hexdigest())
if request['mode'] == 'list':
    queue = root / '.local/atlas-refresh/world-finished.jsonl'
    finished = {}
    if queue.is_file():
        for line in queue.read_text().splitlines():
            try:
                row = json.loads(line)
                if re.fullmatch(r'[a-zA-Z0-9._-]+', row['world']) and isinstance(row['finishedAt'], str):
                    finished[row['world']] = row['finishedAt']
            except (json.JSONDecodeError, KeyError, TypeError):
                continue
    print(json.dumps(dict(finished=finished, files=[describe(f) for d in request['dirs'] for f in output_files(d)])))
else:
    with tarfile.open(fileobj=sys.stdout.buffer, mode='w|') as archive:
        for row in request['files']:
            relative = pathlib.PurePosixPath(row['path'])
            path = folder(str(relative.parent))
            if path is None or str(relative.parent) not in request['dirs'] or not re.fullmatch(request['pattern'], relative.name):
                raise ValueError('Private output outside approved folders')
            file = path / relative.name
            if file.is_symlink():
                raise ValueError('Private output is a symlink')
            body = file.read_bytes()
            if len(body) != row['size'] or hashlib.sha256(body).hexdigest() != row['hash']:
                raise ValueError('Private output changed during transfer; retry after collection')
            info = tarfile.TarInfo(row['path'])
            info.size = len(body)
            archive.addfile(info, io.BytesIO(body))
`;

function ssh(request,maxBuffer){
    const input='import json\nrequest=json.loads(bytes.fromhex("'+Buffer.from(JSON.stringify({...request,pattern:output.source})).toString('hex')+'"))\n'+remoteCode;
    return execFileSync('ssh',['-o','BatchMode=yes','-o','ConnectTimeout=10','mac','python3 -'],
        {cwd:root,input,windowsHide:true,maxBuffer,timeout:300_000});
}

function chooseArgs(args){
    if(args.some(arg=>!['--dry-run','--rebuild'].includes(arg)))throw Error('Usage: npm run atlas:refresh -- [--dry-run] [--rebuild]');
    return {dry:args.includes('--dry-run'),rebuild:args.includes('--rebuild')};
}

function run(args){
    const {dry,rebuild}=chooseArgs(args);
    const local=join(root,'.local/atlas-refresh'), live=join(root,'work/atlas-snapshot');
    const dirs=new Set(json(join(root,registry)).books.map(book=>book.dir).filter(dir=>privateDir.test(dir)));
    const timings={}, start=performance.now();
    const timed=(key,fn)=>{const since=performance.now();try{return fn();}finally{timings[key]=Math.round(performance.now()-since);}};
    let lock;
    try{
        if(!dry){
            mkdirSync(local,{recursive:true});
            const path=join(local,'lock');
            mkdirSync(path);
            lock=path;
        }
        const {files,finished}=timed('inventory',()=>JSON.parse(ssh({mode:'list',dirs:[...dirs]},64e6)));
        const rows=validateManifest(files,dirs);
        const changed=selectChanges(rows,path=>existsSync(join(root,path))?digest(readFileSync(join(root,path))):null);
        const input=digest(JSON.stringify(rows));
        const accepted=existsSync(join(live,'refresh-input.json'))?json(join(live,'refresh-input.json')):null;
        const needsBuild=rebuild||changed.length>0||accepted?.input!==input||!existsSync(join(live,'snapshot.json'));
        const result={mode:dry?'dry-run':needsBuild?'refresh':'unchanged',finished,remoteFiles:rows.length,
            filesPlanned:changed.length,bytesPlanned:changed.reduce((sum,row)=>sum+row.size,0),bytesMoved:0,needsBuild,timings};
        if(dry||!needsBuild)return {...result,totalMs:Math.round(performance.now()-start)};
        const runDir=mkdtempSync(join(local,'refresh-'));
        const incoming=join(runDir,'incoming'), stage=join(runDir,'snapshot');
        mkdirSync(incoming);
        timed('transfer',()=>{
            for(let i=0;i<changed.length;i+=100){
                const batch=changed.slice(i,i+100);
                const bytes=ssh({mode:'fetch',dirs:[...dirs],files:batch},batch.reduce((n,row)=>n+row.size,4e6));
                execFileSync('tar',['-xf','-','-C',incoming],{input:bytes,windowsHide:true,stdio:['pipe','ignore','pipe']});
            }
            // Validate every received file before installing any. Transfers are
            // additive; absent remote files never remove local readings.
            for(const row of changed){
                const file=join(incoming,row.path), body=readFileSync(file);
                if(body.length!==row.size||digest(body)!==row.hash)throw Error('Private transfer did not match the manifest');
                execFileSync('git',['check-ignore','-q','--',row.path],{cwd:root,windowsHide:true});
                const target=join(root,row.path);
                mkdirSync(dirname(target),{recursive:true});
                const real=relative(realpathSync(root),realpathSync(dirname(target))).replaceAll('\\','/');
                if(real!==row.path.slice(0,row.path.lastIndexOf('/')))throw Error('Private destination resolves outside its reader folder');
            }
            for(const row of changed){
                const target=join(root,row.path), temp=target+'.atlas-refresh-'+process.pid;
                copyFileSync(join(incoming,row.path),temp);
                renameSync(temp,target);
                result.bytesMoved+=row.size;
            }
        });
        const snapshot=join(stage,'snapshot.json');
        const env={...process.env,ATLAS_SNAPSHOT:snapshot,ATLAS_STARTUP_RECEIPT:join(runDir,'startup.json')};
        delete env.ATLAS_READER_ROOT;
        const node=(file,args=[])=>JSON.parse(execFileSync(process.execPath,[file,...args],
            {cwd:root,env,encoding:'utf8',windowsHide:true,maxBuffer:64e6}));
        result.build=timed('build',()=>node('prototypes/world-atlas/build.mjs'));
        const labels=timed('labels',()=>node('scripts/check_atlas_play_labels.mjs'));
        result.labels=labels.counts;
        const proof=timed('startup',()=>node('prototypes/world-atlas/prove-archive-startup.mjs',[snapshot]));
        result.startup={readyMs:proof.readyMs,worlds:proof.worlds,snapshot:proof.snapshot};
        writeFileSync(join(stage,'refresh-input.json'),JSON.stringify({input}));
        const previous=resolve(dirname(live),'atlas-snapshot-before-'+runDir.split(/[/\\]/).at(-1));
        timed('adopt',()=>adopt(stage,live,previous));
        result.previous=relative(root,previous).replaceAll('\\','/');
        return {...result,totalMs:Math.round(performance.now()-start)};
    }finally{if(lock)rmdirSync(lock);}
}

if(import.meta.main){
    try{console.log(JSON.stringify(run(process.argv.slice(2)),null,2));}
    catch(error){console.error('Atlas refresh:',error.message);process.exitCode=1;}
}
