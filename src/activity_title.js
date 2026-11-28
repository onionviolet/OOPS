export const activityTitles = {
    'base.frontier': {halfLife:720, names:{combat:'Field veteran', work:'Village hand', rest:'Rest keeper', reading:'Book learner', travel:'Road walker'}},
    'book.lotm.tingen': {halfLife:1440, names:{combat:'Street defender', work:'Office regular', rest:'Quiet lodger', reading:'Archive reader', travel:'City walker'}},
};
export const emptyActivity = () => ({revision:1,life:'',scores:{}});
const kinds=new Set(Object.keys(activityTitles['base.frontier'].names));
export function readActivity(raw=emptyActivity()) {
    if (raw?.revision!==1 || typeof raw.life!=='string' || !raw.scores || Array.isArray(raw.scores) || typeof raw.scores!=='object' ||
        Object.entries(raw.scores).some(([key,v])=>!kinds.has(key)||!Number.isFinite(v)||v<0)) throw Error('Invalid activity title history.');
    return {...raw,scores:{...raw.scores}};
}
export function scoreActivity(rule, previous, life, kind, minutes) {
    if (!Number.isFinite(minutes)||minutes<=0) return previous;
    const scores={}, retention=2**(-minutes/rule.halfLife);
    for (const [id,value] of Object.entries(previous.life===life?previous.scores:{})) {
        if(value*retention>0.000001)scores[id]=value*retention;
    }
    if (rule.names[kind]) scores[kind]=(scores[kind]??0)+(1-retention)/(1-2**(-1/rule.halfLife));
    return {revision:1,life,scores};
}
export function dominantTitle(rule,state) {
    const winner=Object.keys(rule.names).filter(k=>state.scores[k]>0).sort((a,b)=>state.scores[b]-state.scores[a])[0];
    return rule.names[winner];
}
