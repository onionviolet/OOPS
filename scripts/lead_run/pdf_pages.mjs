/** Split pdftotext's physical pages without treating printed folios as page numbers.
 * Section ranges are inclusive PDF pages. Gaps stay in the read.
 */
export function pageShards(text, {book, pagesPerShard = 4, pageRange, pdfPageCount, sections = []}) {
    const pages = text.replace(/\r\n/g, '\n').split('\f');
    if (pages.at(-1) === '' && (!pdfPageCount || pages.length === pdfPageCount + 1)) pages.pop();
    if (pdfPageCount && pages.length !== pdfPageCount) throw new Error('PDF page count differs from the registered edition');
    const [first, last] = pageRange || [1, pages.length];
    if (![first, last, pagesPerShard, book].every(n => Number.isInteger(n) && n > 0)
        || first > last || last > pages.length) throw new Error('Invalid PDF page range or shard size');
    const boundaries = new Set();
    let previous = 0;
    for (const {from, to} of sections) {
        if (!Number.isInteger(from) || !Number.isInteger(to) || from <= previous || to < from || to > pages.length)
            throw new Error('Invalid or overlapping PDF sections');
        boundaries.add(from);
        boundaries.add(to + 1);
        previous = to;
    }
    const shards = [];
    let current;
    for (let page = first; page <= last; page++) {
        if (!current || page - current.first >= pagesPerShard || boundaries.has(page)) {
            current = {first: page, last: page, text: '', index: {}};
            shards.push(current);
        }
        const paragraphs = pages[page - 1].trim().split(/\n[ \t]*\n+|(?<=[.!?:])\n/).filter(Boolean)
            .map(value => value.replace(/\s+/g, ' ').trim());
        current.last = page;
        current.index[page] = paragraphs.length;
        current.text += `=== PDF page ${page} | book ${book}\n`;
        paragraphs.forEach((value, i) => { current.text += `p${i + 1}: ${value}\n`; });
    }
    if (shards.some(s => !Object.values(s.index).some(Boolean))) throw new Error('Empty PDF page shard needs visual review or OCR');
    return shards;
}
