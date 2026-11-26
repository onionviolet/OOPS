import {readIdeaOwners} from './idea-owners.mjs';
import {readOwnerIdeas} from './owner-ideas.mjs';

const invalid=message=>{const error=Error(message);error.status=400;return error;};
export const IDEA_SOURCE_KINDS=['feature-proposal','acceptance-check','finding','historical-note','backlog-entry'];
export function searchOwnerIdeas(root,query,{offset=0,limit=25,kind='',readDirectory=readIdeaOwners,readOwner=readOwnerIdeas}={}) {
    if(typeof query!=='string'||!query.trim()||query.trim().length>120)throw invalid('Enter a word, phrase or idea code in 120 characters or fewer.');
    if(!Number.isInteger(offset)||offset<0||!Number.isInteger(limit)||limit<1||limit>50)throw invalid('Choose a nonnegative offset and a page size from 1 to 50.');
    if(typeof kind!=='string'||kind!==''&&!IDEA_SOURCE_KINDS.includes(kind))throw invalid('Choose an existing source kind or all source kinds.');
    const q=query.trim(),exactCode=/^[a-z]{1,8}\d+[a-z]?$/i.test(q)?q.toLocaleLowerCase():null;
    const words=q.toLocaleLowerCase().split(/\s+/),allowed=readDirectory(root),files=new Map();
    for(const owner of allowed){const file=owner.reference.split('#')[0];if(!files.has(file)||owner.reference===file)files.set(file,owner);}
    const matches=[];let unreadableOwners=0,ownerFilesRead=0;
    for(const [file,owner] of files){
        try{
            const page=readOwner(root,file,{allowedOwners:allowed});ownerFilesRead++;
            for(const row of page.rows){
                const found=exactCode?row.code?.toLocaleLowerCase()===exactCode:words.every(word=>
                    [row.code,row.title,row.excerpt,...row.section].join(' ').toLocaleLowerCase().includes(word));
                if(found&&(!kind||row.kind===kind))matches.push({...row,ownerTitle:owner.title,documentHash:page.documentHash});
            }
        }catch{unreadableOwners++;}
    }
    matches.sort((a,b)=>a.ownerReference.localeCompare(b.ownerReference)||a.lineStart-b.lineStart||a.id.localeCompare(b.id));
    return {query:q,exactCode:!!exactCode,offset,limit,...(kind?{kind}:{}),total:matches.length,ownerFilesSearched:files.size,ownerFilesRead,unreadableOwners,
        rows:matches.slice(offset,offset+limit),
        boundary:'Results are structured source entries, not a count of open or implemented features. Opening a result rechecks its exact current owner entry.'};
}
