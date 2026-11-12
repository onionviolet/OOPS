// Spell workings on the kernel (chat S phase 2, KW1-KW14). A spellbook draft is
// a K method: each dictionary step adds its typed roles and one kernel step per
// operation. The world's rule table is the operation law; settling a step
// answers the native command it lowers to (KB7: S lowers in its own host).
// Retires the old spell plan shape (compileSpellWorking), the spell column in
// docs/KERNEL_WORKING_CONTRACT.md "The five shapes on one page".
import {defineWorkingLaw, quoteWorking} from './kernel_working.js';

// Expression slots preserve the difference between a fixed part and a
// reference that changes with the selected target.
export function bindSpellExpression(entry, targets) {
    return entry.expression.grammar.map(({part, binding, optional})=>{
        if(part!==undefined) return entry.expression.parts[part];
        return {role:'target reference', target:targets[binding], optional:optional===true};
    });
}

const laws = new WeakMap();
// One kernel law per world rule table. Operation roles take their kinds from the
// dictionary rows that use them; two rows that disagree on a kind are an error.
export function spellWorkingLaw(worldRules, dictionary) {
    const cached = laws.get(worldRules);
    if(cached?.dictionary===dictionary) return cached.law;
    const roles = {};
    for(const entry of dictionary.filter(row=>row.world===worldRules.world)) for(const {operation, bindings} of entry.operations){
        if(!Object.hasOwn(worldRules.operations, operation)) continue;
        const kinds = roles[operation] ??= {};
        for(const [slot, roleName] of Object.entries(bindings)){
            const kind = entry.roles.find(role=>role.name===roleName)?.type;
            if(kinds[slot] && kinds[slot]!==kind) throw Error(`${operation} is used with two kinds for ${slot}.`);
            kinds[slot] = kind;
        }
    }
    const operations = Object.fromEntries(Object.keys(worldRules.operations).filter(op=>roles[op]).map(op=>[op, {roles:roles[op], minutes:0,
        settle:({bound, options, step})=>{
            const rule = worldRules.operations[op];
            const command = typeof rule==='function' && rule({step:options.step, method:options.method, revision:options.revision,
                operation:op, bindings:Object.fromEntries(Object.entries(bound).map(([slot,thing])=>[slot,thing.id]))});
            return command ? {ok:true, effects:[{kind:'spell.native', step:options.step, command}]}
                : {ok:false, reason:'That operation cannot reach the selected target here.', observed:{step}};
        }}]));
    const law = defineWorkingLaw({id:'spell.'+worldRules.world, revision:1, operations});
    laws.set(worldRules, {dictionary, law});
    return law;
}

// Draft steps -> {law, method, bindings, expressions}. Typed targets are checked
// against the world's own target table before the kernel sees them.
export function spellDraftMethod(steps, dictionary, worldRules) {
    if(!Array.isArray(steps) || steps.length===0) throw Error('Choose at least one method.');
    const law = spellWorkingLaw(worldRules, dictionary);
    const roles = {}, bindings = {}, kernelSteps = [], expressions = [];
    steps.forEach(({method, revision, bindings: chosen}, index)=>{
        const entry = dictionary.find(row=>row.id===method && row.revision===revision && row.world===worldRules.world);
        if(!entry) throw Error('This world does not have that version of the method.');
        const targets = {};
        for(const {name,type} of entry.roles){
            const target = worldRules.target(chosen?.[name]);
            if(!target || target.type!==type) throw Error(`${entry.label} expects ${name} to be of type ${type}.`);
            targets[name] = target.id;
            roles[`s${index}.${name}`] = type;
            bindings[`s${index}.${name}`] = {kind:type, id:target.id};
        }
        expressions.push(bindSpellExpression(entry, targets));
        for(const {operation, bindings: slots} of entry.operations){
            if(!Object.hasOwn(law.operations, operation)) throw Error(`${entry.label} needs an unavailable operation: ${operation}.`);
            kernelSteps.push({op:operation, bindings:Object.fromEntries(Object.entries(slots).map(([slot,name])=>{
                if(!Object.hasOwn(targets,name)) throw Error(`${operation} refers to an undeclared role: ${name}.`);
                return [slot, `s${index}.${name}`];
            })), options:{step:index, method, revision}});
        }
    });
    const method = {id:'spellbook.draft', revision:1, law:law.ref, roles, steps:kernelSteps};
    return {law, method, bindings, expressions};
}

// The draft's native commands, from a kernel quote. Adjacent operations of one
// spell step can share one native transaction; identical commands in different
// steps stay, so repeated casts still pay and run.
export function spellDraftCommands(steps, dictionary, worldRules, {at = 0} = {}) {
    const {law, method, bindings} = spellDraftMethod(steps, dictionary, worldRules);
    const quote = quoteWorking(law, method, {bindings, at, id:'spellbook.draft'});
    if(!quote.ok) throw Error(quote.reason);
    const commands = [];
    for(const {step, command} of quote.effects){
        const previous = commands.at(-1);
        if(previous?.step===step && previous.command.id===command.id && previous.command.type===command.type) continue;
        commands.push({step, command});
    }
    return commands;
}
