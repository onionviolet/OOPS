// Variant switch (round 22, PS232; proposal): `?variant=<code>` on a test origin loads styles/variants/<code>.css on top of
// the real bundle, so a mock is compared in the real game on a real fixture and the winner becomes the build. A variant
// is display only: it never reads or writes the save, and with no parameter nothing loads, so baselines and walks run
// unchanged. A variant may also carry a layout override (VARIANT_LAYOUT) for the layout spec's readers.
export const VARIANT_LAYOUT = Object.freeze({});

/** Pure: the variant code from a query string, or '' when absent or not a plain code. */
export function variantFrom(search = '') {
    const code = new URLSearchParams(search).get('variant') || '';
    return /^[a-z0-9-]{1,32}$/.test(code) ? code : '';
}

export function mountVariant({doc = globalThis.document, search = globalThis.location?.search || ''} = {}) {
    const code = variantFrom(search);
    if (!code || !doc || doc.getElementById('variant_stylesheet')) return code;
    const link = doc.createElement('link'); link.id = 'variant_stylesheet'; link.rel = 'stylesheet'; link.href = `styles/variants/${code}.css`;
    doc.head.append(link); doc.documentElement.dataset.variant = code;
    return code;
}
