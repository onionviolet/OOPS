import {PRODUCT_APPEARANCES} from './product_appearance_content.js';
let owner=null;
export function setProductAppearanceOwner(value){owner=value??null;}
// No truth or allocation is inferred from appearance. P2 supplies only its
// authorized projection; the binding is for this exact canonical identity.
export function productAppearanceView(appearances,product,knowledge,base){
    const binding=appearances?.bindings?.[product.id];
    if(!binding)return base;
    const label=PRODUCT_APPEARANCES[binding.appearanceId];
    if(!label)throw Error('Unresolved product appearance.');
    const known=knowledge?.[product.id]?.observed===true;
    return {name:known?`${base.name} (${label})`:label,
        description:known?`Recognized by its saved appearance. ${base.description}`:base.description};
}
export function currentProductAppearanceView(product,knowledge,base){return productAppearanceView(owner,product,knowledge,base);}
