import {REFERENCES,REFERENCE_CARRIER,referenceIdOf,MATERIAL_CARRIER,PRODUCT_CARRIER,craftingOwner,materialFromKey,productFromNativeKey,compositionName,catalogue} from './crafting_frontier_runtime.js';
import {projectProduct,projectMaterial} from './craft_state.js';
// Constructors are provided by the existing item owner, never imported back.
export function resolveNativeCraftingItem(key,{Material,UsableItem}) {
 const k=JSON.parse(key);
 if(k.id===REFERENCE_CARRIER){
  const d=REFERENCES[referenceIdOf(key)];if(!d)throw Error('Unknown reference item.');
  const item=new Material({id:REFERENCE_CARRIER,name:d.name,value:1,material_type:'reference',description:d.blurb});item.inventory_key=key;return item;
 }
 if(k.id===MATERIAL_CARRIER){
  const {material}=materialFromKey(key),view=projectMaterial(craftingOwner,catalogue,material.id,'player');
  const item=new Material({id:MATERIAL_CARRIER,name:view.name,value:1,material_type:'gathered herb',description:'Gathered in Village. Its unobserved properties still act when used in an experiment.'});
  item.inventory_key=key;return item;
 }
 const product=productFromNativeKey(key);if(!product)return null;
 const view=()=>projectProduct(craftingOwner,catalogue,product.id,'player');
 const item=new UsableItem({id:PRODUCT_CARRIER,name:view().name,value:1,effects:[],tags:{medicine:true},description:'An original herbal experiment. Drink to observe its effects; a new dose replaces the previous preparation.'});
 item.inventory_key=key;item.getName=()=>compositionName(product,view().name);return item;
}
export function registerCraftingCarriers({templates,Material,UsableItem}) {
 templates[REFERENCE_CARRIER]=new Material({name:REFERENCE_CARRIER,value:1,material_type:'reference',description:'A carried book or slate that holds a method or lesson.'});
 templates[MATERIAL_CARRIER]=new Material({name:MATERIAL_CARRIER,value:1,material_type:'gathered herb',description:'One exact harvested material lot.'});
 templates[PRODUCT_CARRIER]=new UsableItem({name:PRODUCT_CARRIER,value:1,effects:[],tags:{medicine:true},description:'A crafted preparation. Use its exact owned product.'});
}
