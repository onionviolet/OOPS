// Fixed vocabulary and numeric counts only. Call after selected-file admission
// and the raw-row privacy guard; never expose source-controlled keys or prose.
const kinds = ['person','place','item','creature','organization','org','deity','document','language','price','measure','clock','calendar','event',
    'ability','spell','law','custom','institution','craft','potion','rite','other','note'];
const reasons = {
    'missing-identity':'Missing usable record identity',
    'no-public-identity':'No exact identity in the public record families',
    'multiple-public-targets':'Multiple public targets; no qualified exact link',
    'different-family':'Exact public identity in another record family; no qualified link',
    'identity-not-qualified':'Exact public identity exists; link requirements not met',
    'observation-not-qualified':'No observation with matching content and source references',
    'life-not-qualified':'No daily-life record with matching content and source references',
};
export function createUnindexedExplanation(kind, publicTargets) {
    let total=0;const reasonCounts=new Map(),kindCounts=new Map(),cells=new Map();
    const inc=(map,key)=>map.set(key,(map.get(key)||0)+1);
    return {
        observe(raw) {
            let reason;
            if(kind==='other')reason='observation-not-qualified';
            else if(['services','news','customs'].includes(kind))reason='life-not-qualified';
            else {
                const id=kind==='scenes'?raw.beat:raw.id;
                if(typeof id!=='string'||!id.trim())reason='missing-identity';
                else {
                    const targets=publicTargets(id),expected=kind==='census'?['entities','rules']:
                        ['people','places'].includes(kind)?['entities']:[kind];
                    reason=!targets.length?'no-public-identity':targets.length>1?'multiple-public-targets':
                        !expected.includes(targets[0])?'different-family':'identity-not-qualified';
                }
            }
            const suppliedKind=kinds.includes(raw.kind)?raw.kind:raw.kind==null?'unspecified':'unrecognized';
            total++;inc(reasonCounts,reason);inc(kindCounts,suppliedKind);inc(cells,reason+'\0'+suppliedKind);
        },
        snapshot() {
            const kindLabel=id=>id==='unspecified'?'Not supplied':id==='unrecognized'?'Other supplied kind':id;
            return {total,note:'Counts explain unindexed public rows in this selected file. Existing identities do not establish same-slice provenance or permission to merge. Withheld rows are excluded.',
                reasons:[...reasonCounts].sort().map(([id,rows])=>({id,label:reasons[id],rows})),
                kinds:[...kindCounts].sort().map(([id,rows])=>({id,label:kindLabel(id),rows})),
                groups:[...cells].sort().map(([key,rows])=>{const [reason,kind]=key.split('\0');return {reason,reasonLabel:reasons[reason],kind,kindLabel:kindLabel(kind),rows};})};
        },
    };
}
