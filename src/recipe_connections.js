// Read-only dependency index across supported native categories. A component
// recipe's getResult rolls quality, so indexing uses its declared material->result
// mapping. Unlearned recipes and unknown material variants never yield a label.
export const recipeIdentity = s => `${s.category}/${s.subcategory}/${s.recipe_id}${s.material_id ? `/${s.material_id}` : ''}`;
export function knownRecipeVariants(recipes, isKnown, templates) {
    const rows = [];
    for(const [category,pages] of Object.entries(recipes)) for(const [subcategory,entries] of Object.entries(pages)) for(const [recipe_id,recipe] of Object.entries(entries)) {
        if(!recipe.isUnlocked()) continue;
        const base = {category,subcategory,recipe_id,title:recipe.name};
        if(recipe.recipe_type === 'component' || recipe.recipe_type === 'componentless') {
            for(const material of recipe.materials || []) if(isKnown(material.material_id)) rows.push({...base,material_id:material.material_id,
                outputId:material.result_id, outputType:templates[material.result_id]?.component_type,
                inputs:[{id:material.material_id,count:material.count}],title:`${recipe.name} · ${templates[material.material_id]?.getName?.() || material.material_id}`});
        } else rows.push({...base,outputId:recipe.result?.result_id,
            inputs:(recipe.materials||[]).filter(m=>m.material_id && isKnown(m.material_id)).map(m=>({id:m.material_id,count:m.count})),
            inputTypes:recipe.components||[],materialTypes:(recipe.materials||[]).map(m=>m.material_type).filter(Boolean)});
    }
    return rows;
}
export function relatedKnownRecipes(selection, variants, templates) {
    const selected = variants.filter(v=>v.category===selection.category && v.subcategory===selection.subcategory && v.recipe_id===selection.recipe_id && (!selection.material_id||v.material_id===selection.material_id));
    const related = [];
    for(const other of variants) {
        if(other.category===selection.category && other.subcategory===selection.subcategory && other.recipe_id===selection.recipe_id) continue;
        let via;
        for(const current of selected) {
            const produces = current.inputs.some(i=>i.id===other.outputId) || current.inputTypes?.includes(other.outputType) || current.materialTypes?.includes(templates[other.outputId]?.material_type);
            if(produces) {via='Produces an input';break;}
            if(other.inputs.some(i=>i.id===current.outputId)||other.inputTypes?.includes(current.outputType)||other.materialTypes?.includes(templates[current.outputId]?.material_type)) {via='Uses this result';break;}
            if(current.inputs.some(i=>other.inputs.some(j=>j.id===i.id))) via='Shares a known material';
        }
        if(via) related.push({...other,via});
    }
    return related.sort((a,b)=>Number(b.via==='Produces an input')-Number(a.via==='Produces an input') || recipeIdentity(a).localeCompare(recipeIdentity(b)));
}
export function knownUsesOf(item, variants) {
    return variants.filter(v=>v.inputs.some(i=>i.id===item.id)||v.inputTypes?.includes(item.component_type)||v.materialTypes?.includes(item.material_type));
}
export function materialPolicyText(stop) {
    return `Batch limit counts attempts, not guaranteed outputs. ${stop ? 'With material-stop on, the command starts with the cheapest stack. Mixed leftovers pull in whole later stacks until one attempt is fundable; its batch limit includes all units in those included stacks. Start a new command for further groups.' : 'This command can cross material groups.'} Inputs are consumed in ascending base-value order; equal values use stable item identity. Extra outputs from a committed batch stay in inventory.`;
}
// A click is bound to its subject at pointer-down. Key activation is already
// bound to the focused node. Rebuilt/disconnected controls cannot act on B.
export function bindSubjectGesture(node, readSubject, activate) {
    let pressed;
    node.addEventListener('pointerdown', () => {pressed=readSubject();});
    node.addEventListener('pointercancel', () => {pressed=undefined;});
    node.addEventListener('click', event => {
        const current=readSubject(), valid=pressed===undefined || pressed===current;
        pressed=undefined;
        if(valid && node.isConnected!==false) activate(event);
    });
}
const escapeHTML = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function knownUsesHTML(item, variants) {
    const uses = knownUsesOf(item,variants);
    if(!uses.length) return '';
    return '<br><br>Known uses (tracking does not reserve stock):<br>'+uses.map(v=>`<button type="button" data-known-recipe="${encodeURIComponent(JSON.stringify({category:v.category,subcategory:v.subcategory,recipe_id:v.recipe_id,material_id:v.material_id}))}">${escapeHTML(v.title)} · ${escapeHTML(v.category)}</button>`).join('<br>');
}
export function installKnownRecipeLinks(document, follow) {
    document.addEventListener('click',event=>{
        const link=event.target.closest?.('[data-known-recipe]');
        if(!link?.isConnected) return;
        event.preventDefault();event.stopPropagation();follow(JSON.parse(decodeURIComponent(link.dataset.knownRecipe)));
    }, true); // Capture before legacy trade/storage container click-to-move handlers.
}
export function renderRecipeConnections(root, {selection, links, back, follow, goBack, policy}) {
    let region=root.querySelector(':scope > [data-recipe-connections]');
    if(!region) {region=root.ownerDocument.createElement('section');region.dataset.recipeConnections='';root.prepend(region);}
    region.replaceChildren();
    const add=(label,run)=>{const b=root.ownerDocument.createElement('button');b.type='button';b.textContent=label;bindSubjectGesture(b,()=>recipeIdentity(selection),e=>{e.stopPropagation();run();});region.append(b);};
    if(back) add(`← Back to ${back}`,goBack);
    if(policy){const p=root.ownerDocument.createElement('p');p.textContent=policy;region.append(p);}
    if(links.length){const details=root.ownerDocument.createElement('details'),summary=root.ownerDocument.createElement('summary');summary.textContent='Known producers and uses';details.append(summary);region.append(details);
        for(const link of links){const b=root.ownerDocument.createElement('button');b.type='button';b.textContent=`${link.via}: ${link.title} · ${link.category}`;bindSubjectGesture(b,()=>recipeIdentity(link),event=>{event.stopPropagation();follow(link);});details.append(b);}}
}
