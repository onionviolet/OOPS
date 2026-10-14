#!/usr/bin/env node
// P40 PROPOSAL. Read-only lexical triage, not an AST/security/determinism proof.
// No dependencies, source imports, writes, package wiring, or source excerpts.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';

export function tokenize(source) {
    const tokens=[]; let i=0;
    const put=(value,start,kind='code')=>tokens.push({value,start,kind});
    function quoted(q) {
        const start=i++; let value='';
        while(i<source.length && source[i]!==q) {
            if(source[i]==='\\') {value+=source.slice(i,i+2);i+=2;}
            else value+=source[i++];
        }
        if(source[i]!==q) throw Error('Unterminated string');
        i++;put(value,start,'string');
    }
    function template() {
        i++;
        while(i<source.length) {
            if(source[i]==='\\') {i+=2;continue;}
            if(source[i]==='`') {i++;return;}
            if(source.slice(i,i+2)==='${') {i+=2;code(true);continue;}
            i++;
        }
        throw Error('Unterminated template');
    }
    function code(interpolation=false) {
        let depth=0;
        while(i<source.length) {
            const c=source[i],start=i;
            if(/\s/.test(c)){i++;continue;}
            if(source.slice(i,i+2)==='//') {i=source.indexOf('\n',i);if(i<0)i=source.length;continue;}
            if(source.slice(i,i+2)==='/*') {const end=source.indexOf('*/',i+2);if(end<0)throw Error('Unterminated comment');i=end+2;continue;}
            if(c==='"'||c==="'"){quoted(c);continue;}
            if(c==='`'){template();continue;}
            if(c==='}'&&interpolation&&depth===0){i++;return;}
            if(c==='{')depth++;
            if(c==='}')depth--;
            // Best-effort regex-vs-division heuristic. Unsupported syntax remains
            // a review limitation; this lexer cannot replace an ECMAScript parser.
            const previous=tokens.at(-1)?.value;
            if(c==='/' && (!previous || ['=','(','[','{',',',':',';','return','=>','!','&&','||','?'].includes(previous))) {
                i++;let bracket=false,closed=false;
                while(i<source.length) {
                    if(source[i]==='\\'){i+=2;continue;}
                    if(source[i]==='[')bracket=true;
                    if(source[i]===']')bracket=false;
                    if(source[i]==='/'&&!bracket){i++;closed=true;break;}
                    if(source[i]==='\n')break;
                    i++;
                }
                if(!closed)throw Error('Unterminated regex or unsupported slash context');
                while(/[a-z]/i.test(source[i]||'')&&i<source.length)i++;
                put('<regex>',start,'regex');continue;
            }
            if(/[A-Za-z_$]/.test(c)) {
                i++;while(i<source.length&&/[\w$]/.test(source[i]))i++;
                put(source.slice(start,i),start);continue;
            }
            if(/[0-9]/.test(c)) {
                i++;while(i<source.length&&/[\w.]/.test(source[i]))i++;
                put(source.slice(start,i),start,'number');continue;
            }
            const two=source.slice(i,i+2);
            if(['?.','**','=>','&&','||','??','==','!=','<=','>='].includes(two)){put(two,start);i+=2;}
            else {put(c,start);i++;}
        }
        if(interpolation)throw Error('Unterminated template interpolation');
    }
    code();return tokens;
}
const messages={
    L01:'Ambient RNG call or reference requires a saved stream or an exact cosmetic exception.',
    L02:'Wall/performance clock requires an explicit clock-domain classification.',
    L03:'Locale collation requires classification as display-only or replacement in causal order.',
    L04:'Map/Set construction requires review if data or iteration order reaches persistence.',
    L05:'Exponentiation in a weighted-draw module requires a versioned numeric contract.',
    L06:'Default sort requires explicit stable ID ordering if it reaches a draw or saved order.',
    L07:'UI timer in a module with an advance action requires scheduler ownership review.',
    L09:'Raw owner/knowledge access in UI requires an observer projection review.',
    L08:'Entity deletion requires reference/retention review.',
};
function member(tokens,index,owner,property) {
    if(tokens[index]?.value!==owner||tokens[index]?.kind==='string')return false;
    return (['.','?.'].includes(tokens[index+1]?.value)&&tokens[index+2]?.value===property)
        || (tokens[index+1]?.value==='['&&tokens[index+2]?.kind==='string'&&tokens[index+2]?.value===property&&tokens[index+3]?.value===']');
}
export function scanText(source,file='src/fixture.js') {
    let t;try{t=tokenize(source);}catch{return [{rule:'PARSE',file,line:1,column:1,level:'error',message:'Lexical scan failed; no clean result is available.'}];}
    const rows=[],seen=new Set(),ui=/(?:_ui|display|particles)\.js$/.test(file);
    const uiRandom=/^src\/(?:particles|display)\.js$/.test(file);
    const pureTiming=/^src\/(?:verifier|workspace_layout|settled_text_effects)\.js$/.test(file);
    const weighted=/(?:seeded_streams|storylet_deck|simulation_resolution)\.js$/.test(file);
    const hasAdvance=t.some(x=>x.kind==='string'&&x.value==='advance');
    function add(rule,token,level='review') {
        const before=source.slice(0,token.start),line=before.split('\n').length,column=token.start-(before.lastIndexOf('\n')+1)+1;
        const key=rule+':'+line;if(seen.has(key))return;seen.add(key);
        rows.push({rule,file,line,column,level,message:messages[rule]});
    }
    for(let i=0;i<t.length;i++) {
        const a=t[i],v=a.value;if(a.kind==='string'||a.kind==='regex')continue;
        if(member(t,i,'Math','random')&&!uiRandom)add('L01',a,'candidate');
        if((member(t,i,'Date','now')||member(t,i,'performance','now')||(v==='new'&&t[i+1]?.value==='Date'))&&!pureTiming)add('L02',a);
        if((['.','?.'].includes(v)&&t[i+1]?.value==='localeCompare')||member(t,i,'Intl','Collator'))add('L03',a,ui?'display-review':'candidate');
        if(v==='new'&&['Map','Set'].includes(t[i+1]?.value))add('L04',a);
        if(v==='**'&&weighted)add('L05',a);
        if(v==='.'&&t[i+1]?.value==='sort'&&t[i+2]?.value==='('&&t[i+3]?.value===')')add('L06',a);
        if(v==='setInterval'&&ui&&hasAdvance)add('L07',a,'candidate');
        if(ui&&(['getMixtureOwner','queryStoryOutcomes'].includes(v)||(['.','?.'].includes(v)&&['knowledge','log','profiles','products','hiddenMethod'].includes(t[i+1]?.value))))add('L09',a);
        if(v==='delete'&&t.slice(i+1,i+8).some(x=>['events','people','actors','receipts'].includes(x.value)))add('L08',a);
    }
    return rows;
}
function selfTest() {
    let count=0;const test=(fn)=>{fn();count++;};
    test(()=>assert.deepEqual(scanText('// Math.random()\nconst s="Date.now() localeCompare";'),[]));
    test(()=>assert.equal(scanText('Math /* gap */ . random();')[0].rule,'L01'));
    test(()=>assert.equal(scanText('Math["random"]();')[0].rule,'L01'));
    test(()=>assert.equal(scanText('const r = Math.random;')[0].rule,'L01'));
    test(()=>assert.equal(scanText('const s=`raw Math.random ${Math.random()}`;')[0].rule,'L01'));
    test(()=>assert.deepEqual(scanText('const r=/Math.random\\(Date.now/;'),[]));
    test(()=>assert.deepEqual(scanText('performance.now();','src/verifier.js'),[]));
    test(()=>assert.equal(scanText('Date.now();','src/main.js')[0].rule,'L02'));
    test(()=>assert.equal(scanText('a.localeCompare(b);')[0].rule,'L03'));
    test(()=>assert.equal(scanText('new Set();')[0].rule,'L04'));
    test(()=>assert.equal(scanText('const x=0.6**n;','src/storylet_deck.js')[0].rule,'L05'));
    test(()=>assert.equal(scanText('setInterval(()=>act({type:"advance"}),500);','src/mixture_ui.js')[0].rule,'L07'));
    test(()=>assert.equal(scanText('const x=`${`inner ${Math.random()}`}`;')[0].rule,'L01'));
    test(()=>assert.equal(scanText('/* unclosed')[0].rule,'PARSE'));
    test(()=>assert.equal(scanText('const x="unclosed')[0].rule,'PARSE'));
    test(()=>assert.equal(scanText('delete s.events[id];')[0].rule,'L08'));
    test(()=>assert.equal(scanText('getMixtureOwner();','src/mixture_ui.js')[0].rule,'L09'));
    return {label:'lint in-memory fixture checks only',passed:count,failed:0};
}
function walk(dir) {
    if(!fs.existsSync(dir))throw Error('Missing source directory');
    return fs.readdirSync(dir,{withFileTypes:true}).sort((a,b)=>a.name<b.name?-1:a.name>b.name?1:0).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):e.isFile()&&/\.(?:js|mjs|cjs)$/.test(e.name)?[path.join(dir,e.name)]:[]);
}
function main() {
    const args=process.argv.slice(2);if(args.includes('--self-test')){console.log(JSON.stringify(selfTest()));return;}
    const roots=[];let json=false,strict=false;
    for(let i=0;i<args.length;i++) {
        if(args[i]==='--root'){if(!args[i+1])throw Error('--root needs a path');roots.push(path.resolve(args[++i]));}
        else if(args[i]==='--json')json=true;
        else if(args[i]==='--strict')strict=true;
        else throw Error('Use --root PATH (repeatable), --json, --strict, or --self-test.');
    }
    if(!roots.length)roots.push(process.cwd());
    const results=roots.map(root=>{
        const files=walk(path.join(root,'src')),findings=files.flatMap(f=>scanText(fs.readFileSync(f,'utf8'),path.relative(root,f).split(path.sep).join('/')));
        return {root,scannedFiles:files.length,findings};
    });
    if(json)console.log(JSON.stringify({proposal:true,mode:'advisory lexical triage',results},null,2));
    else for(const r of results){console.log(`${r.root}: ${r.scannedFiles} files, ${r.findings.length} review candidates`);for(const f of r.findings)console.log(`${f.file}:${f.line}:${f.column} ${f.rule} ${f.level}`);}
    if(results.some(r=>r.findings.some(f=>f.level==='error')))process.exitCode=2;
    else if(strict&&results.some(r=>r.findings.length))process.exitCode=1;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))main();
