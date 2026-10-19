import {validateItemKey} from './gameplay_transactions.js';
import {canonicalDurabilityKey} from './absorb_e2/durability.js';

// An actual inventory's absent stack is zero. Unavailable inventories and
// unrelated unknown facts remain unknown. Only selected predicates are read.
export function addInventoryRequirementFacts(facts, predicates, inventories) {
    const visit = rule => {
        if(Array.isArray(rule)) {rule.forEach(visit); return;}
        if(!rule || typeof rule !== 'object')return;
        if(typeof rule.fact === 'string') {
            for(const [prefix, inventory] of Object.entries(inventories)) {
                if(!rule.fact.startsWith(prefix))continue;
                const key = rule.fact.slice(prefix.length);
                try {validateItemKey(key);} catch {continue;}
                if(!inventory) {delete facts[rule.fact]; continue;}
                facts[rule.fact] = Object.entries(inventory).reduce((n,[actual,count]) =>
                    n + (actual === key || canonicalDurabilityKey(actual) === key ? count : 0), 0);
            }
        }
        visit(rule.all); visit(rule.any); visit(rule.not);
    };
    visit(predicates);
    return facts;
}
