import {createHash} from 'node:crypto';
import {readFileSync, statSync} from 'node:fs';
import {join} from 'node:path';

export function readPinnedPlayReceipt(root,{path,fingerprint,life,action,playedBuild,format='json'}) {
    try {
        const file=join(root,path);
        if(statSync(file).size>65536)return null;
        const source=readFileSync(file);
        const bytes=format==='text'?source.toString('utf8').replace(/\r\n/g,'\n'):source;
        if(createHash('sha256').update(bytes).digest('hex')!==fingerprint)return null;
        const build=playedBuild(format==='text'?bytes:JSON.parse(bytes));
        return /^[0-9a-f]{64}$/.test(build)?{id:path,life,action,build}:null;
    } catch {return null;}
}
