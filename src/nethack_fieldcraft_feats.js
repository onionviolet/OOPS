// Pure evidence for the existing character feat catalogue. This module owns
// neither recognition mutation nor a reward/save publisher.
import {natural} from './basics.js';
import {NETHACK_FIELDCRAFT_KEYS as K, NETHACK_FIELDCRAFT_IDS as I} from './nethack_fieldcraft_content.js';

export const fieldcraftFeatDefinitions = Object.freeze([
    {id:'bench_liquid_discovery', label:'Identify a working bench substance', description:'Learn the pale vial’s identity through your own completed application.'},
    {id:'reed_oil_two_uses', label:'Find two uses for reed oil', description:'Maintain an actual owned knife and mark the recess with the same identified substance.'},
    {id:'rill_retrieved_real_stock', label:'Recover real stock with Rill', description:'Fund and train the local dog, then receive one actual pin through his completed help.'},
]);
const trials = ['nethack_fieldcraft.trial_dull','nethack_fieldcraft.trial_fineDull'];
const discoveryCommands = ['nethack_fieldcraft.assay', ...trials];
const count = (state,id) => natural(state?.actors?.player?.completed?.[id]) ? state.actors.player.completed[id] : 0;
const increased = (before,out,id) => count(out,id) > count(before,id);
const validObservation = (state,key) => {
    const k=state.simulation?.knowledge?.player?.[key];
    return k?.basis?.kind==='observation' && k.basis.attributedTo==='player' &&
        natural(k.at) && k.at <= state.clock && /^simulation:[1-9][0-9]*$/.test(k.cause || '');
};

export function fieldcraftFeatEvidence(before, stagedOut, context={}) {
    const out=stagedOut?.state || stagedOut;
    if(!before || !out?.referenceGameplay?.fieldcraft || !(out.sequence > before.sequence)) return [];
    const known=out.simulation?.knowledge?.player?.[I.oil];
    const changed=discoveryCommands.filter(id=>increased(before,out,id));
    const evidence=[];
    const add=(id,ids)=>evidence.push({id,ids});
    const receipt=id=>`completion:${id}:${count(out,id)}`;
    if(known?.stage==='understood' && validObservation(out,I.oil) && changed.length)
        add('bench_liquid_discovery',[...changed.map(receipt),`knowledge:${I.oil}:${known.cause}`]);

    const usedKnife=trials.filter(id=>count(out,id)>0);
    const scented=count(out,'nethack_fieldcraft.scent')>0 && validObservation(out,'nethack_fieldcraft.scent');
    if(known?.stage==='understood' && validObservation(out,I.oil) && usedKnife.length && scented &&
        [...trials,'nethack_fieldcraft.scent'].some(id=>increased(before,out,id)))
        add('reed_oil_two_uses',[receipt(usedKnife[0]),receipt('nethack_fieldcraft.scent')]);

    const dogCommand='nethack_fieldcraft.recover_dog';
    const afterStock=stagedOut?.gameplay?.player?.inventory;
    const priorStock=stagedOut?.gameplayBefore?.player?.inventory || context.gameplay?.player?.inventory;
    const dog=out.actors?.[I.dog];
    if(increased(before,out,dogCommand) && validObservation(out,'nethack_fieldcraft.dog_pin') &&
        dog?.resources?.lessons===2 && count(out,I.train)===2 &&
        natural(afterStock?.[K.pin]) && (afterStock[K.pin] || 0) > (priorStock?.[K.pin] || 0))
        add('rill_retrieved_real_stock',[receipt(dogCommand),receipt(I.train),
            `native-pin:${priorStock?.[K.pin] || 0}->${afterStock[K.pin]}`,`helper:${I.dog}`]);
    return evidence;
}

export function visibleFieldcraftFeats(state) {
    if(!state?.referenceGameplay?.fieldcraft) return [];
    const identified=state.simulation?.knowledge?.player?.[I.oil]?.stage==='understood';
    const trained=state.actors?.[I.dog]?.resources?.lessons===2;
    const earned=new Set((state.referenceGameplay.feats?.earned || []).map(row=>row.id));
    return fieldcraftFeatDefinitions.filter(row=>earned.has(row.id) ||
        (row.id==='rill_retrieved_real_stock' ? trained : identified));
}
