// Spell trials use the native knowledge store. A failed attempt and a
// successful attempt are separate observations of the same method.
const trialPrefix = namespace => namespace + '.trial.';
const trialKey = (namespace, method, worked) =>
    trialPrefix(namespace) + method + (worked ? '.worked' : '.failed');

export function spellTrialObservation(namespace, method, worked, text) {
    return {type:'knowledge',key:trialKey(namespace,method,worked),stage:'understood',value:text};
}

export function witnessedSpellTrial(namespace, method, worked, reason) {
    return {fact:'knowledge.'+trialKey(namespace,method,worked)+'.understood',op:'eq',value:true,reason};
}

export function readSpellTrials(namespace, knowledge) {
    const prefix = trialPrefix(namespace);
    return Object.entries(knowledge ?? {}).flatMap(([key,record])=>{
        if(!key.startsWith(prefix)) return [];
        const split=key.lastIndexOf('.');
        const method=key.slice(prefix.length,split), result=key.slice(split+1);
        if(!method || !['worked','failed'].includes(result)) return [];
        return [{method,worked:result==='worked',text:record.value,at:record.at,cause:record.cause}];
    });
}

// The recipe identity is separate from the attempt identity. Writing needs
// witnessed success, and recall reads the written record after the draft changes.
export function testedSpellRevision(namespace, method, revision, text) {
    const key=namespace+'.recipe.'+revision;
    return {
        proven:witnessedSpellTrial(namespace,method,true,'Make the draft work before writing it up.'),
        recorded:{fact:'knowledge.'+key+'.understood',op:'eq',value:true},
        write:{type:'knowledge',key,stage:'understood',value:text},
    };
}
