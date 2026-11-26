// One initial endowment; the ordinary faculty owns its point accounting and uses.
// The optional marker is seeded on a new first game, never inferred on load.
const choices=['pending','ordinary','extra-insight'];
export function initialInsightOffer(){return {choice:'pending',at:null};}
export function validateStartingInsight(state){
 const offer=state.startingOffer;if(offer===undefined)return;
 if(!offer||typeof offer!=='object'||Array.isArray(offer)||Object.keys(offer).length!==2||
  !choices.includes(offer.choice)||!Object.hasOwn(offer,'at')||
  (offer.choice==='pending'?offer.at!==null:!Number.isSafeInteger(offer.at)||offer.at<0)||
  (offer.choice==='extra-insight'&&state.earned<1))throw Error('Invalid starting insight offer.');
}
export function startingInsightView(state){
 if(!state?.startingOffer)return null;
 return {...state.startingOffer,canChoose:state.spent===0,
  reason:state.spent===0?'You can change this choice until you spend an insight.':'Your first insight spending has settled this beginning.'};
}
export function chooseStartingInsight(state,choice,at){
 validateStartingInsight(state);
 if(!state.startingOffer||state.spent!==0)throw Error('Choose a starting advantage before spending your first insight.');
 if(!['ordinary','extra-insight'].includes(choice))throw Error('Choose the ordinary beginning or one extra insight.');
 if(state.startingOffer.choice===choice)throw Error('That beginning is already recorded.');
 const delta=Number(choice==='extra-insight')-Number(state.startingOffer.choice==='extra-insight');
 state.points+=delta;state.earned+=delta;state.startingOffer={choice,at};
 validateStartingInsight(state);
}
export function settleStartingInsight(state,at){
 if(state.startingOffer?.choice==='pending')state.startingOffer={choice:'ordinary',at};
}
