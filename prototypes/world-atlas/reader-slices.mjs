// The historic lead-run slice selection used by the world digest and its metadata inventory.
import {readerDirectory} from './reader-directory.mjs';
import {EXTRA_PASSES,extraFile} from '../../scripts/lead_run/batch_lib.mjs';
import {readFileSync} from 'node:fs';
import {join} from 'node:path';

const escapeRe=value=>String(value).replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const suffixes=new Set(['census','scenes','fills',...Object.entries(EXTRA_PASSES).flatMap(([pass,kinds])=>kinds.map(kind=>extraFile(pass,kind)))]);
/** Exact canonical chapter stems, independent of prepared text. Trials and reruns are not canonical. */
export function observedRegistrySlices(book,books,names) {
    if(typeof book.dir!=='string'||typeof book.world!=='string')return [];
    const owners=(books||[book]).filter(candidate=>candidate.key===book.key&&typeof candidate.dir==='string'&&readerDirectory(candidate)===readerDirectory(book));
    if(owners.length!==1||owners[0].world!==book.world)return [];
    const pattern=new RegExp(`^(${escapeRe(book.key)}c(\\d{3,}))(L?)(m?)_([a-z_]+)\\.jsonl$`);
    const slices=new Map();
    for(const name of [...names].sort()) {
        const match=pattern.exec(name);
        if(!match||!suffixes.has(match[5])||(match[4]&&!['census','scenes','fills'].includes(match[5])))continue;
        const chapter=Number(match[2]);
        // Canonical padding is at least three digits, without an arbitrary extra leading zero.
        if(!Number.isSafeInteger(chapter)||chapter<1||String(chapter).padStart(3,'0')!==match[2])continue;
        slices.set(match[1],{prefix:match[1],chapters:null,firstChapter:chapter,scope:'orphan',extra:true});
    }
    return [...slices.values()].sort((a,b)=>a.firstChapter-b.firstChapter);
}
export function orphanReaderSlices(book,books,names,prepared=[]) {
    const present=new Set(prepared.map(shard=>shard.prefix));
    return observedRegistrySlices(book,books,names).filter(slice=>!present.has(slice.prefix));
}
/** Ownership boundary for aggregate unindexed variants. Never return their filenames. */
export function ownsRegistryOutputName(book,name) {
    return new RegExp(`^${escapeRe(book.key)}c\\d{3,}(?:[A-Za-z][A-Za-z0-9]*)?_[a-z_]+\\.jsonl$`).test(name);
}

function gradeEvidence(directory,prefix,names) {
    const files=new Set(names),lanes=[prefix,`${prefix}L`];
    const partial=p=>files.has(`${p}_census.partial`)||files.has(`${p}_full.partial`);
    const selected=lanes.find(p=>files.has(`${p}m_census.jsonl`)&&!partial(p))||lanes.find(p=>files.has(`${p}m_census.jsonl`))||
        lanes.find(p=>files.has(`${p}m_header.json`)||files.has(`${p}_header.json`))||prefix;
    const header=[`${selected}m_header.json`,`${selected}_header.json`].find(name=>files.has(name));
    const none={grade:null,gradingStatus:'header-missing',chapters:null};
    if(!header)return none;
    try {
        const h=JSON.parse(readFileSync(join(directory,header),'utf8'));
        const grade=['A','B','C'].includes(h?.grade)?h.grade:null;
        const range=/^([1-9]\d*)(?:-([1-9]\d*))?$/.exec(String(h?.chapters||''));
        const chapters=range&&Number(range[1])<=Number(range[2]||range[1])?h.chapters:null;
        const valid=h?.schema==='shard-header/1.3'&&[selected,`${selected}m`].includes(h.shard)&&
            typeof h.readerModel==='string'&&/^(?:[a-f0-9]{16}|[a-f0-9]{64})$/i.test(h.sourceHash||'')&&
            /^\d{4}-\d{2}-\d{2}/.test(h.date||'')&&['pass','fail'].includes(h.lint)&&grade&&chapters;
        return {grade,gradingStatus:valid?'header-recorded':'header-invalid',chapters:valid?chapters:null};
    } catch {return {...none,gradingStatus:'header-unreadable'};}
}
function residualFamily(prefix) {
    if(/^[puh]\d+$/.test(prefix))return 'pilot-comparison';
    if(/^z(?:w\d+s\d+[csrp]?|b\d+s\d+|s[2-9][rv]?)$/.test(prefix))return 'sonnet-comparison';
    if(/^[bc]\d+s\d+c\d+$/.test(prefix))return 'split-reread';
    if(/^(?:[bc]\d+s\d+|w\d+s\d+)x\d+$/.test(prefix))return 'rerun';
    if(/^w\d+s\d+[ywsxprhqt]$/.test(prefix))return 'ab-comparison';
    return null;
}
export function legacyReaderSlices(book, books, names) {
    const directory = readerDirectory(book);
    const sharing = books.filter(candidate => readerDirectory(candidate) === directory);
    const owner = sharing[0] || book;
    const worlds = [...new Set(sharing.map(candidate => candidate.world))];
    const covered = sharing.map(candidate => candidate.key);
    const bySlice = new Map(),aliases=new Map(),stages=new Map(),residuals=new Map();
    // Tracked LOTM archive ownership stays with its existing first registry entry;
    // the new lotm1 local-reading directory has its own canonical identities.
    const stageOwner=owner.world==='lotm'&&sharing.some(candidate=>/^lotm[2-8]$/.test(candidate.key)&&candidate.world==='lotm');
    // Base stems only. b/c families repeat the same numbered slice; reruns and model probes stay out.
    for (const name of [...names].sort()) {
        const early=/^((?:s2|s[2-6]r|s[7-9]v))L?(m?)_([a-z_]+)\.jsonl$/.exec(name);
        if(early&&suffixes.has(early[3])&&(!early[2]||['census','scenes','fills'].includes(early[3]))) {
            const prefix=early[1],evidence=gradeEvidence(directory,prefix,names);
            if(!stages.has(prefix))stages.set(prefix,{prefix,extra:true,chapters:evidence.chapters,family:'graded-stage',...evidence,
                admitted:stageOwner&&evidence.gradingStatus==='header-recorded'&&['A','B'].includes(evidence.grade),
                ownership:stageOwner?'historic-lotm-registry':'unassigned-stage-owner'});
            continue;
        }
        const variant=/^([a-z][A-Za-z0-9]*?)m_(?:census\.jsonl|header\.json)$/.exec(name);
        if(variant) {
            const family=residualFamily(variant[1]);
            if(family&&!residuals.has(variant[1]))residuals.set(variant[1],{prefix:variant[1],family,...gradeEvidence(directory,variant[1],names),
                reason:'Observed comparison or reread identity; no adopted digest owner established by the naming contract.'});
        }
        const match = /^(([a-z])\d+s(\d+))L?m_census\.jsonl$/.exec(name);
        if (!match || covered.some(key => match[1].startsWith(key + 'c'))) continue;
        const peers=aliases.get(match[3])||[];if(!peers.includes(match[1]))peers.push(match[1]);aliases.set(match[3],peers);
        if (!bySlice.has(match[3])) bySlice.set(match[3], match[1]);
    }
    return {ownerKey: owner.key, ownerWorld: owner.world, ambiguousWorlds: worlds.length > 1 ? worlds : [],
        // Preserve the digest's existing first-registry-entry ownership, including mixed-world directories.
        slices: owner.key === book.key ? [...stages.values(),...[...bySlice.values()].map(prefix => ({prefix,extra:true,...gradeEvidence(directory,prefix,names),
            family:'wave',admitted:true,ownership:'legacy-compatibility',
            aliases:(aliases.get(/s(\d+)$/.exec(prefix)[1])||[]).filter(alias=>alias!==prefix).map(alias=>({prefix:alias,...gradeEvidence(directory,alias,names)}))}))] : [],
        residuals:owner.key===book.key?[...residuals.values()]:[]};
}
