// Read-only public coverage rules. Statements are recorded paraphrases/proposals,
// not raw books, engine laws, or a claim that a ledger's old test still passes.
import {readFileSync,readdirSync,existsSync} from 'node:fs';
import {join} from 'node:path';
import {createHash} from 'node:crypto';
const hidden=r=>r&&typeof r==='object'&&(r.sealed===true||r.private===true||r.withheld===true||['sealed','private','withheld'].includes(r.visibility)||['sealed','private','withheld'].includes(r.status));
const hasHidden=r=>r&&typeof r==='object'&&(hidden(r)||Object.values(r).some(hasHidden));
const safe=s=>typeof s==='string'&&!/(?:[A-Za-z]:[\\/]|\/Users\/|\/home\/|~\/|(?:^|\/)private(?:\/|$))/i.test(s)?s:null;
const texts=x=>(Array.isArray(x)?x:[x]).flatMap(v=>safe(v)?[v]:[]);
const name=id=>id.replace(/^book\./,'').replaceAll('_',' ').replaceAll('-',' ');
function collectWithheld(value,ids,sealed=false){if(!value||typeof value!=='object')return;sealed||=hidden(value);if(sealed&&typeof value.id==='string')ids.add(value.id);for(const child of Object.values(value))collectWithheld(child,ids,sealed);}
const referencesWithheld=(value,ids)=>typeof value==='string'?ids.has(value):value&&typeof value==='object'&&Object.values(value).some(v=>referencesWithheld(v,ids));
export function flattenRuleRecords(value,{pointer='',sealed=false}={}) {
    if(!value||typeof value!=='object'||sealed||hidden(value))return [];
    const own=typeof value.id==='string'&&(typeof value.statement==='string'||typeof value.state==='string'&&typeof value.source==='string')?[{row:value,pointer}]:[];
    return [...own,...Object.entries(value).flatMap(([key,child])=>flattenRuleRecords(child,{pointer:pointer+'/'+key.replaceAll('~','~0').replaceAll('/','~1')}))];
}
export function loadWorldRules(root) {
    const dir=join(root,'docs/coverage'),worldNames=new Map(),records=[],files=[],issues=[],withheld=new Set();
    const read=file=>{const raw=readFileSync(join(dir,file),'utf8');return {raw,sha256:createHash('sha256').update(raw).digest('hex')};};
    if(existsSync(join(dir,'worlds.jsonl')))for(const line of read('worlds.jsonl').raw.split('\n').filter(Boolean))try{const w=JSON.parse(line);worldNames.set(w.id,w.name);}catch{}
    for(const file of readdirSync(dir).filter(f=>/^[a-z0-9_-]+_rules\.jsonl?$/.test(f)).sort()) {
        const {raw,sha256}=read(file);let document,rows;
        try{if(file.endsWith('.jsonl')){rows=[];for(const [i,line]of raw.split('\n').entries())if(line.trim())try{rows.push({row:JSON.parse(line),pointer:'/line/'+(i+1)});}catch{issues.push({file,line:i+1,kind:'parse-failure'});}}else{document=JSON.parse(raw);rows=flattenRuleRecords(document);}}
        catch{issues.push({file,kind:'parse-failure'});continue;}
        collectWithheld(document,withheld,hidden(document?.meta));for(const {row}of rows)collectWithheld(row,withheld);
        if(hidden(document?.meta))continue;
        const meta=document?.meta||{},stem=file.replace(/_rules\.jsonl?$/,''),labelFile=stem+'_labels.json';let sheets={},labelMeta={},labelHash;
        if(meta.world&&!worldNames.has(meta.world)&&texts(meta.books).length)worldNames.set(meta.world,texts(meta.books)[0]+(texts(meta.books).length>1?' + related recorded books':''));
        if(file.endsWith('.jsonl')&&existsSync(join(dir,labelFile)))try{const info=read(labelFile),labels=JSON.parse(info.raw);if(!hidden(labels.meta)){sheets=labels.sheets?.[stem+'_rules']||{};labelMeta=labels.meta||{};labelHash=info.sha256;}}catch{issues.push({file:labelFile,kind:'parse-failure'});}
        for(const [id,detail]of Object.entries(sheets))if(hasHidden(detail))withheld.add(id);
        let admitted=0;
        for(const {row:r,pointer}of rows) {
            if(hasHidden(r)||!safe(r.id))continue;
            const detail=sheets[r.id];if(hasHidden(detail))continue;
            const world=safe(r.world)||safe(meta.world)||(/^(warhammer-40k|forgotten-realms|eberron|golarion)\./.exec(r.id)?.[1])||stem;
            const statement=safe(r.statement)||safe(detail?.effect?.summary)||safe(r.note);if(!statement)continue;
            const sourceKind=/inference|proposal|derived|axiom/i.test([r.speaker,meta.status].filter(Boolean).join(' '))||/agent-written inference|no canon line/i.test(meta.note||'')?'interpretation':'source-paraphrase';
            const books=texts(meta.books||labelMeta.setting),locators=texts(r.locators||r.source||detail?.locator),state=safe(r.state);
            const key=Buffer.from(file+'#'+pointer).toString('base64url');
            records.push({key,id:r.id,world,name:safe(r.name)||safe(detail?.name)||(statement.length>100?statement.slice(0,97)+'…':statement),statement,kind:safe(detail?.kind),sourceKind,
                sources:{file:'docs/coverage/'+file,pointer,sha256,books,locators,licence:texts(r.licence||meta.licence||labelMeta.licence),
                    note:safe(meta.note)||safe(labelMeta.pass),date:safe(meta.date),speaker:safe(r.speaker),
                    detail:detail&&labelHash?{file:'docs/coverage/'+labelFile,pointer:'/sheets/'+stem+'_rules/'+r.id,sha256:labelHash}:null},
                interpretation:{mechanism:safe(r.mechanism)||safe(detail?.mechanism),seam:safe(r.seam),derives:texts(r.derives),defaultDialReason:safe(r.default_dial_reason)},
                particulars:detail?Object.fromEntries(['cost_or_limit','go_wrong','who_may','where_from','combines'].flatMap(k=>safe(detail[k])?[[k,detail[k]]]:[])):{},
                implementation:{state,test:safe(r.test),mechanisms:texts(r.mechanisms),status:state?'ledger-claim':'unverified',note:'Recorded coverage claim; no current playable proof was checked by this view.'}});admitted++;
        }
        files.push({file:'docs/coverage/'+file,sha256,records:admitted});
    }
    const publicRecords=records.filter(r=>!referencesWithheld(r,withheld));
    for(const file of files)file.records=publicRecords.filter(r=>r.sources.file===file.file).length;
    const worlds=[...new Set(publicRecords.map(r=>r.world))].sort().map(id=>({id,label:worldNames.get(id)||name(id),count:publicRecords.filter(r=>r.world===id).length}));
    return {schema:'atlas-world-rules/1',worlds,records:publicRecords,files,issues,coverage:'Observed public rule records only. Missing records, editions, source completeness and playable coverage are not inferred.'};
}
export function queryWorldRules(catalogue,{world='',q='',kind='',offset=0,limit=40,record=''}={}) {
    if(!Number.isSafeInteger(offset)||offset<0||!Number.isSafeInteger(limit)||limit<1||limit>100)throw Error('Invalid rule page.');
    const needle=q.toLowerCase();const all=catalogue.records.filter(r=>(!world||r.world===world)&&(!kind||r.sourceKind===kind)&&(!record||r.key===record)&&(!needle||JSON.stringify(r).toLowerCase().includes(needle)));
    return {schema:catalogue.schema,coverage:catalogue.coverage,worlds:catalogue.worlds,totalRecords:catalogue.records.length,total:all.length,offset,limit,records:all.slice(offset,offset+limit),issues:catalogue.issues,files:catalogue.files};
}
