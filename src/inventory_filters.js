// Presentation over known native row metadata. No item construction or inventory owner.
export const INVENTORY_KINDS=[['all','All kinds'],['equipment','Equipment'],['usable','Consumables'],['book','Books'],['component','Components'],['material','Materials'],['loot','Loot'],['other','Other']];
export function inventoryRowKind(classes){
 const has=kind=>classes.includes(`character_item_${kind}`);
 return [['equipment','equippable'],['book','book'],['component','component'],['usable','usable'],['material','material'],['loot','loot']].find(([,tag])=>has(tag))?.[0]||'other';
}
export function matchesInventoryFilter(row,{query='',kind='all',quality='all'}={}){
 if(kind!=='all'&&row.kind!==kind)return false;
 if(query&&!row.name.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()))return false;
 if(quality==='none')return row.quality==null;
 if(quality!=='all'&&(row.quality==null||row.quality<Number(quality)))return false;
 return true;
}
