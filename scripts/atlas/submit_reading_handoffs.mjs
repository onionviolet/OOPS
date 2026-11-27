// Submit reader-selected rows from an exported Atlas reference page to its local Workbench.
import {readFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';

function localAddress(base) {
    const url = new URL(base);
    if (url.protocol !== 'http:' || !['127.0.0.1','localhost','[::1]'].includes(url.hostname)) {
        throw Error('Use the local Atlas server address.');
    }
    return url;
}

function selectedRecords(proposal, records) {
    const lines = proposal?.fileLines ?? (Number.isSafeInteger(proposal?.line) && proposal.line > 0 ? [[proposal.line,proposal.line]] : null);
    if (!proposal?.key && !(proposal?.route && lines)) throw Error('Supply a record key, or the Atlas route and source file lines.');
    return records.filter(row => (!proposal.key || row.key === proposal.key) &&
        (!proposal.route || row.route === proposal.route) && (!lines || JSON.stringify(row.fileLines) === JSON.stringify(lines)));
}

export async function submitReadingHandoffs(references, proposals, base = 'http://127.0.0.1:4178') {
    const url = localAddress(base);
    if (references?.schema !== 'atlas-reading-references/1' || !Array.isArray(references.records) ||
        !references.file?.contentHash || !Array.isArray(proposals) || !proposals.length) {
        throw Error('Supply an exported Atlas reference page and a nonempty JSON array of proposals.');
    }
    const results = [];
    const {book,prefix,pass,kind,contentHash} = references.file;
    for (const [index, proposal] of proposals.entries()) {
        try {
            if (['book','prefix','pass','kind'].some(field => proposal?.[field] && proposal[field] !== references.file[field])) {
                throw Error('The proposal names a different book or output.');
            }
            if (proposal?.contentHash && proposal.contentHash !== contentHash) throw Error('The selected source file version changed.');
            const rows = selectedRecords(proposal, references.records);
            if (rows.length !== 1) throw Error('The selection must identify one record on the exported page.');
            const record = rows[0];
            const response = await fetch(new URL('/reading-handoffs',url), {method:'POST',redirect:'error',
                headers:{'Content-Type':'application/json'},body:JSON.stringify({
                    book,prefix,pass,kind,contentHash,offset:references.page?.offset || 0,
                    recordKey:record.key,recordRoute:record.route,fileLines:record.fileLines,
                    backlog:proposal.backlog,change:proposal.change,check:proposal.check,
                })});
            if (!response.ok) throw Error((await response.text()) || ('Atlas returned HTTP ' + response.status));
            const {id} = await response.json();
            if (!/^[a-f0-9]{64}$/.test(id)) throw Error('Atlas did not return a saved handoff ID.');
            results.push({index,key:record.key,id,route:'#workbench/handoffs/' + id});
        } catch (error) {
            results.push({index,key:proposal?.key || null,route:proposal?.route || null,error:error.message});
        }
    }
    return results;
}

async function referencePages(base, proposal) {
    const parts = ['book','prefix','pass','kind'].map(field => {
        const part = proposal?.[field];
        if (typeof part !== 'string' || !/^[a-z0-9_-]+$/i.test(part)) throw Error('Each batch proposal needs a book, prefix, pass and kind.');
        return part;
    });
    const address = new URL('/reading-output-records/' + parts.join('/'), base);
    address.searchParams.set('format','references');
    const pages = [];
    let offset = 0;
    do {
        address.searchParams.set('offset', String(offset));
        const response = await fetch(address,{redirect:'error'});
        if (!response.ok) throw Error('Atlas could not export the reading output (HTTP ' + response.status + ').');
        const page = await response.json();
        if (page.schema !== 'atlas-reading-references/1' || !page.file?.contentHash ||
            !Array.isArray(page.records) || !Number.isSafeInteger(page.page?.total) || page.page.total < 0 ||
            page.page.offset !== offset || !['book','prefix','pass','kind'].every(field => page.file[field] === proposal[field])) {
            throw Error('The requested reading output or reference page is unavailable.');
        }
        if (pages.length && (page.file.contentHash !== pages[0].file.contentHash || page.page.total !== pages[0].page.total)) {
            throw Error('The reading output changed while loading its pages. Retry the batch.');
        }
        pages.push(page);
        offset += page.records.length;
        if (offset === page.page.total) return pages;
        if (!page.records.length || offset > page.page.total) throw Error('Incomplete reading output pagination.');
    } while (true);
}

export async function submitReadingBatch(proposals, base = 'http://127.0.0.1:4178') {
    const url = localAddress(base);
    if (!Array.isArray(proposals) || !proposals.length) throw Error('Supply a nonempty array of reading proposals.');
    const outputs = new Map(), results = [];
    for (const [index, proposal] of proposals.entries()) {
        try {
            const key = JSON.stringify(['book','prefix','pass','kind'].map(field => proposal?.[field]));
            if (!outputs.has(key)) outputs.set(key, referencePages(url,proposal));
            const pages = await outputs.get(key);
            if (proposal.contentHash && proposal.contentHash !== pages[0].file.contentHash) throw Error('The selected source file version changed.');
            const matches = pages.filter(page => selectedRecords(proposal,page.records).length);
            if (matches.length !== 1) throw Error('The selection must identify one record in the reading output.');
            const [result] = await submitReadingHandoffs(matches[0],[proposal],url);
            results.push({...result,index});
        } catch (error) {
            results.push({index,key:proposal?.key || null,route:proposal?.route || null,error:error.message});
        }
    }
    return results;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
    try {
        const [references, proposals, base] = process.argv.slice(2);
        if (!references || !proposals) throw Error('Usage: node scripts/atlas/submit_reading_handoffs.mjs --batch|references.json|local-reference-url proposals.json [local-atlas-url]');
        const read = path => JSON.parse(readFileSync(path,'utf8').replace(/^\uFEFF/,''));
        let page, destination = base;
        if (references !== '--batch' && /^https?:\/\//i.test(references)) {
            const address = localAddress(references);
            address.searchParams.set('format','references');
            const response = await fetch(address,{redirect:'error'});
            if (!response.ok) throw Error('Atlas could not export that reference page (HTTP ' + response.status + ').');
            page = await response.json();
            destination ||= address.origin;
        } else if (references !== '--batch') page = read(references);
        const results = references === '--batch' ? await submitReadingBatch(read(proposals),base) :
            await submitReadingHandoffs(page, read(proposals), destination);
        console.log(JSON.stringify(results,null,2));
        if (results.some(row => row.error)) process.exitCode = 1;
    } catch (error) { console.error(error.message); process.exitCode = 1; }
}
