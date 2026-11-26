// Public source references shared by browser downloads and local batch readers.
export function compareHandoffSource({source,record}, page) {
    if (!page?.inspected || !page.contentHash ||
        page.key !== source.book || ['prefix','pass','kind'].some(key => page[key] !== source[key])) return 'unavailable';
    if (page.contentHash !== source.contentHash) return 'changed';
    return page.records.some(row => row.href === record.route && JSON.stringify(row.fileLines) === JSON.stringify(source.fileLines))
        ? 'matched' : 'unmatched';
}

export function readingReferenceBundle(page, snapshot) {
    return {
        schema: 'atlas-reading-references/1',
        snapshot: {commit:snapshot?.commit || null, builtAt:snapshot?.builtAt || null},
        file: {world:page.world, book:page.key, prefix:page.prefix, pass:page.pass, kind:page.kind,
            scope:page.scope, contentHash:page.contentHash, matchedRows:page.counts.matchedRows, sourceRows:page.counts.fileRows},
        page: {offset:page.offset, total:page.total,
            route:'#library/outputs/' + [page.key,page.prefix,page.pass,page.kind].map(encodeURIComponent).join('/') +
                (page.offset ? '?offset=' + page.offset : '')},
        records: page.records.map(record => ({key:record.key, label:record.label, type:record.type, route:record.href,
            fileLines:record.fileLines, fileLocators:record.fileLocators, recordLocators:record.locators})),
        fieldCoverage: page.fieldCoverage || null, readingMethod: page.readingMethod || null,
    };
}
