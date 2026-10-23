// Item name grammar (IM25; modeled on CHROMA's readable notation): a crafted
// batch's name is its composition, so the name parses back to its inputs and
// process. Form: `Carrier [2*Spring water@1 + ^1*Lime chalk@1 | steep#1 > boil#2]`
// where `^` marks a catalyst. Reserved characters inside ids are percent-escaped.
// Material lineage (src/material_lineage.js) is a separate owner; this module
// only formats and parses batch products. Not wired into live gameplay yet.
const fail = message => { throw new Error(message); };
const RESERVED = /[%[\]+*@|>^#]/g;
const esc = s => String(s).replace(RESERVED, c => '%' + c.charCodeAt(0).toString(16).toUpperCase().padStart(2, '0'));
const unesc = s => s.replace(/%([0-9A-F]{2})/g, (_, h) => String.fromCharCode(parseInt(h, 16)));

export function formatBatchName(product) {
    const inputs = product.inputs.map(([role, id, revision, qty]) => `${role === 'catalyst' ? '^' : ''}${qty}*${esc(id)}@${revision}`).join(' + ');
    const process = product.process.map(([op, level]) => `${esc(op)}#${level}`).join(' > ');
    return `${product.carrier} [${inputs}${process ? ` | ${process}` : ''}]`;
}

// -> {carrier, inputs:[[role, id, revision, qty]], process:[[op, level]]}, in product order.
export function parseBatchName(name) {
    const open = typeof name === 'string' ? name.lastIndexOf(' [') : -1;
    if(open < 1 || !name.endsWith(']')) fail('Not a batch name.');
    const body = name.slice(open + 2, -1), bar = body.indexOf(' | ');
    const inputText = bar < 0 ? body : body.slice(0, bar), processText = bar < 0 ? '' : body.slice(bar + 3);
    const inputs = inputText.split(' + ').map(part => {
        const m = /^(\^?)(\d+)\*([^@]+)@(\d+)$/.exec(part) ?? fail(`Bad input term: ${part}.`);
        return [m[1] ? 'catalyst' : 'consumed', unesc(m[3]), Number(m[4]), Number(m[2])];
    });
    const process = processText ? processText.split(' > ').map(part => {
        const m = /^([^#]+)#(\d+)$/.exec(part) ?? fail(`Bad process term: ${part}.`);
        return [unesc(m[1]), Number(m[2])];
    }) : [];
    return {carrier: name.slice(0, open), inputs, process};
}
