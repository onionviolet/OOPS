// One supplied method for the existing native mill delivery. No separate quest state.
export const GRAIN_APPLE_ACTION='lead grain horse';
export const GRAIN_CART_METHODS=Object.freeze(['carry grain','pull cart','convince horse','carry cart']);
export function grainAppleAction(){
 return {action_id:GRAIN_APPLE_ACTION,starting_text:'Lead the grain horse with 2 apples · 30 min',
  description:'Walk beside the driver and coax the grazing horse along with two apples. Takes 30 minutes, with no Animal handling requirement. The apples are spent on completion; stopping keeps them and spends the elapsed time. The same grain delivery reaches the mill.',
  action_text:'Leading the grain horse',attempt_duration:30,success_chances:[1],keep_progress:true,
  start_conditions:{items_by_id:{Apple:{count:2}}},
  success_conditions:[{items_by_id:{Apple:{count:2,remove:true}}}],
  failure_texts:{unable_to_begin:['You need two apples to keep the horse interested all the way to the mill.'],conditional_loss:['You no longer have both apples. The driver stays with the cart; the delivery is not done.']},
  success_text:'The horse follows one apple, then the other. With the driver steadying the cart, you reach the mill at a patient walk. The millers still need to hear that their grain has arrived.',
  rewards:{move_to:{location:'Eastern mill'},skill_xp:{'Animal handling':30},
   textlines:[{dialogue:'village millers',lines:['delivered']}],
   locks:{actions:GRAIN_CART_METHODS.map(action=>({location:'Village',action}))}}};
}

// Add a choice to old unresolved carts without reopening solved work or manufacturing discovery.
export function restoreGrainCartChoice(save){
 const modern=save.availabilities?.action;
 if(modern&&Object.hasOwn(modern,GRAIN_APPLE_ACTION))return;
 const legacy=save.locations?.Village?.actions;
 const states=GRAIN_CART_METHODS.map(id=>modern&&Object.hasOwn(modern,id)?modern[id]:legacy?.[id]);
 const finished=v=>typeof v==='number'?Number.isInteger(v)&&v>=0&&v<=7&&!!(v&2):v?.is_finished===true;
 const open=v=>typeof v==='number'?Number.isInteger(v)&&v>=0&&v<=7&&!!(v&1)&&!(v&6):v?.is_unlocked===true&&!v.is_finished&&!v.is_locked;
 if(!states.some(finished)&&!states.some(open))return;
 save.availabilities||={};save.availabilities.action||={};
 save.availabilities.action[GRAIN_APPLE_ACTION]=states.some(finished)?3:1;
}
