// A personal intention beside the native purse, not custody or a spending gate.
export const COMMISSION_EARMARK='lotm.personal.commission-earmark';
export const CH128_COMMISSION_REMAINDER=960; // Four pounds, ch128 p41/p71.
export const SLUMBER_MATERIAL_PURCHASE='lotm.craft.slumber-charm-supplies.prepare';

export function personalEarmarkEffects(amount) {
    if(!Number.isFinite(amount)||amount<0||!Number.isSafeInteger(amount*2))throw Error('Choose a nonnegative amount in pence or halfpence.');
    return [{type:'fact',scope:'actor',actor:'player',key:COMMISSION_EARMARK,value:amount}];
}
export function personalShoppingView(state,total,command,offer=null) {
    const recorded=state.actors?.player?.facts?.[COMMISSION_EARMARK];
    const earmark=Number.isFinite(recorded)&&recorded>=0?recorded:0;
    const cash=Number.isFinite(total)?total:0;
    const cost=command?.costs?.filter(effect=>effect.type==='resource'&&effect.key==='money'&&effect.native&&(!effect.actor||effect.actor==='player'))
        .reduce((sum,effect)=>sum-effect.amount,0);
    const quote=offer&&Number.isFinite(cost)&&cost>=0?{id:command.id,label:offer.label,cost,eligible:offer.eligible,reasons:offer.reasons||[],
        afterTotal:cash-cost,afterAvailable:Math.max(0,cash-cost-earmark),afterShortfall:Math.max(0,earmark-(cash-cost))}:null;
    return {total:cash,earmark,available:Math.max(0,cash-earmark),shortfall:Math.max(0,earmark-cash),quote};
}
