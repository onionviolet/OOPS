// Read-only numeric metadata, never source prose. A restored index must retain
// its exact verified transfer bytes and exact registry/destination ownership.
import {readFileSync,readdirSync} from 'node:fs';
import {join,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {readerDirectory} from './reader-directory.mjs';
import {parseLocator} from '../../scripts/lead_run/world_profiles.mjs';
const root=fileURLToPath(new URL('../../',import.meta.url));
const defaultManifests=join(root,'docs/research/novels/archive-restore-2026-11-25/private');
const escape=value=>value.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const positive=value=>Number.isSafeInteger(value)&&value>0;
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
export function readMentionRange(book,prefix,{directory=readerDirectory(book),names,manifestDirectory=defaultManifests,read=readFileSync}={}) {
    const unavailable=()=>({status:'unavailable',reason:'No uniquely verified numeric range for this output.'});
    if(book.lang!=='en'||!positive(book.book)||typeof book.key!=='string'||!prefix.startsWith(book.key+'c'))return unavailable();
    const first=Number(prefix.slice(book.key.length+1));if(!positive(first)||prefix!==book.key+'c'+String(first).padStart(3,'0'))return unavailable();
    try {
        const pattern=new RegExp('^index_'+escape(book.key)+'_b'+book.book+'_ch('+String(first).padStart(3,'0')+')-(\\d{3,})\\.json$');
        const candidates=[...(names||readdirSync(directory))].filter(name=>pattern.test(name));if(candidates.length!==1)return unavailable();
        const name=candidates[0],ending=pattern.exec(name)[2],last=Number(ending),bytes=read(join(directory,name));
        if(!positive(last)||last<first||ending!==String(last).padStart(3,'0'))return unavailable();
        const chapters=JSON.parse(String(bytes));if(!Array.isArray(chapters)||chapters.length!==last-first+1||chapters.some((row,i)=>
            row?.book!==book.book||row.chapter!==first+i||!positive(row.paragraphs)))return unavailable();
        const digest=sha(bytes),owners=[];
        for(const file of readdirSync(manifestDirectory).filter(file=>/^INDEX_DIRECTORY_[a-f0-9]+\.json$/.test(file))){
            let manifest;try{manifest=JSON.parse(String(read(join(manifestDirectory,file))));}catch{continue;}
            if(manifest.schema!=='atlas-archive-transfer/1'||manifest.phase!=='authentic-indexes'||manifest.status!=='verified'||
                !Array.isArray(manifest.registeredDirs)||!manifest.registeredDirs.some(dir=>typeof dir==='string'&&readerDirectory({dir})===directory))continue;
            const entries=(Array.isArray(manifest.files)?manifest.files:[]).filter(entry=>entry.name===name&&entry.status==='verified'&&entry.sha256===digest&&
                entry.bytes===bytes.length&&Array.isArray(entry.destinations)&&entry.destinations.some(dest=>dest.status==='restored'&&dest.sha256===digest&&
                    typeof dest.path==='string'&&resolve(root,dest.path)===resolve(directory,name)));
            owners.push(...entries);
        }
        if(owners.length!==1)return unavailable();
        return {status:'verified',indexSha256:digest,contains(value){const at=parseLocator(value);return !!at&&at.lang==='en'&&at.book===book.book&&
            at.ch>=first&&at.ch<=last&&at.p>=1&&at.p<=chapters[at.ch-first].paragraphs;}};
    }catch{return unavailable();}
}
