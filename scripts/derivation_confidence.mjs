// The one place a builder reads a derivation rule's score from (PWC80, PWC88): docs/coverage/derivation_rules.json, written by
// scripts/derivation_rules_backtest.mjs. A derived row carries {rule, inputs, confidence}; a rule with no score row throws,
// so a builder cannot ship a derived row the reporter would flag.
import {readFileSync} from 'node:fs';
let cache;
export const confidenceOf = ruleId => {
    cache ??= JSON.parse(readFileSync(new URL('../docs/coverage/derivation_rules.json', import.meta.url), 'utf8')).rules;
    const r = cache.find(x => x.id === ruleId);
    if (!r) throw Error(`derivation rule ${ruleId} has no score row in docs/coverage/derivation_rules.json`);
    return {...r.confidence, version: r.version};
};
