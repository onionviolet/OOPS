// Shared catalog plumbing, with no stock, entitlement or save mutation.
// World owners supply item data and decide when their catalog is applicable.
export function registerOptionalItems(catalogue,{templates,OtherItem,availability}){
 for(const row of catalogue){templates[row.id]=new OtherItem({name:row.id,...structuredClone(row)});delete availability[row.id];}
}
export function restoreOptionalItems(save,catalogue,{templates,availability}){
 for(const {id} of catalogue)if(Object.hasOwn(save.availabilities?.item||{},id))availability[id]??=templates[id]._getBasicAvailabilityComponent();
}
