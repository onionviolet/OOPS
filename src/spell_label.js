// spellLabels as an adapter (PSA27, PSA36): the old per-spell `kind` label, derived from the effect sentence,
// which is the one vocabulary (PC8). Default: the label rides beside the sentence for consumers that still read
// `kind`; nothing here decides a world change. Weibao decides when the label retires.
export const spellLabel = ({verb, object}) => `spell.${verb}.${object}`;
