import {readdirSync, readFileSync, existsSync, realpathSync} from 'node:fs';
import {basename, dirname, isAbsolute, relative, resolve, sep} from 'node:path';
import {ownerReferenceTokens} from './idea-owner-references.mjs';

// The idea index and existing backlog files own their text and priorities. This is a directory.
export function readIdeaOwners(root, handoffs=[]) {
    const docs = realpathSync(resolve(root,'docs'));
    const index = resolve(docs,'IDEA_INDEX.md');
    const rows = new Map();
    function publicPath(path) {
        const local = relative(docs,path);
        return local && !isAbsolute(local) && !local.startsWith('..' + sep) && local !== '..' &&
            !local.split(sep).some(part => part.startsWith('.') || /private|sealed/i.test(part));
    }
    function add(path, anchor, title, group, backlog=false) {
        if (!publicPath(path) || !path.toLowerCase().endsWith('.md') || !existsSync(path) || !publicPath(realpathSync(path))) return;
        const key = 'docs/' + relative(docs,path).split(sep).join('/') + anchor;
        const row = rows.get(key) || {reference:key, title, group, backlog:false};
        if (backlog) row.backlog = true;
        rows.set(key,row);
    }
    let group = 'Game idea index';
    for (const line of readFileSync(index,'utf8').split(/\r?\n/)) {
        if (line.startsWith('## ')) group = line.slice(3).trim();
        for (const match of line.matchAll(/\[([^\]\n]+)\]\(([^()\s]+?\.md)(#[^()\s]*)?\)/gi)) {
            if (/^(?:[a-z]+:|\/|\\)/i.test(match[2])) continue;
            add(resolve(dirname(index),match[2]),match[3] || '',match[1],group);
        }
    }
    const folders = [docs], publicMarkdown=[];
    while (folders.length) {
        const folder = folders.pop();
        for (const entry of readdirSync(folder,{withFileTypes:true})) {
            const path = resolve(folder,entry.name);
            if (!publicPath(path) || entry.isSymbolicLink()) continue;
            if (entry.isDirectory()) {
                folders.push(path);
            } else if (entry.isFile() && /\.md$/i.test(entry.name)) {
                publicMarkdown.push(path);
                if(/backlog.*\.md$/i.test(entry.name)) {
                    const title = basename(path,'.md').replaceAll('_',' ');
                    add(path,'',title,'Backlog documents',true);
                }
            }
        }
    }
    for(const handoff of handoffs)for(const token of ownerReferenceTokens(handoff.proposal?.backlog)) {
        const [file,fragment]=token.split('#');
        const candidates=file.startsWith('docs/')?[resolve(root,file)]:publicMarkdown.filter(path=>basename(path)===file);
        if(candidates.length!==1)continue;
        const path=candidates[0],title=basename(path,'.md').replaceAll('_',' ');
        add(path,'',title,'Owners cited by reading handoffs');
        if(fragment&&!/^idea-[a-f0-9]{64}$/.test(fragment))add(path,'#'+fragment,title+' · '+fragment,'Owners cited by reading handoffs');
    }
    return [...rows.values()].sort((a,b) => a.title.localeCompare(b.title) || a.reference.localeCompare(b.reference));
}
