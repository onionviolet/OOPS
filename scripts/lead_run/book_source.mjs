// Resolve an explicitly registered local source. Existing primary paths keep
// their meaning; aliases require their own byte identity and never remap books.
import {existsSync, openSync, readSync, closeSync} from 'node:fs';
import {createHash} from 'node:crypto';
function fingerprint(path) {
    const fd=openSync(path,'r'),buffer=Buffer.allocUnsafe(65536),hash=createHash('sha256');
    try {let length;while((length=readSync(fd,buffer,0,buffer.length,null)))hash.update(buffer.subarray(0,length));}
    finally {closeSync(fd);}
    return hash.digest('hex');
}

export function resolveBookSource(book) {
    if (book.source && existsSync(book.source)) return book.source;
    for (const alias of book.sourceAliases || []) {
        if (!alias?.path || !/^[a-f0-9]{64}$/i.test(alias.sha256 || '') || !existsSync(alias.path)) continue;
        let hash;
        try { hash = fingerprint(alias.path); }
        catch (error) {
            if (['ENOENT', 'EACCES', 'EPERM'].includes(error.code)) continue;
            throw error;
        }
        if (hash === alias.sha256.toLowerCase()) return alias.path;
    }
    return null;
}
