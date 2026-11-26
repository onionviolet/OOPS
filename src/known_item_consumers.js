// Read only the current seat's already admitted action quotes. No command discovery or reward inference.
export function knownItemConsumers(view,key){
 const choices=(view.actions||[]).flatMap(action=>{
  const input=action.itemInputs?.find(row=>row.key===key);
  return input?[{...action,itemAmount:input.amount,held:input.held}]:[];
 });
 const held=Math.max(0,...choices.map(row=>Number.isFinite(row.held)?row.held:0));
 return {held,choices:held>0?choices:[]};
}
