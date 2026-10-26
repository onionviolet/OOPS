import {pathToFileURL} from 'node:url';
const root=process.argv[2];
if(!root)throw Error('Pass the frozen snapshot root from input-identity.json');
const load=p=>import(pathToFileURL(`${root}/src/${p}`));
const {quoteCrafting,stageCrafting,materialKey}=await load('crafting_frontier_runtime.js');
const {createCraftState,freezeMaterials}=await load('craft_state.js');
const {generateMaterial}=await load('craft_materials.js');
const {frontierCatalogue:cat}=await load('craft_content_frontier.js');
const herb=generateMaterial(cat,'reedherb',{root:4,scope:'audit',index:0}).value;
let owner=freezeMaterials(createCraftState({world:'base.frontier'}),cat,[herb]);
const low=materialKey(herb,40),high=materialKey(herb,60),ctx={world:'base.frontier',location:'Village',clock:100,root:4};
let inventory={[low]:2,[high]:2};
function probe(request){const before=JSON.stringify({owner,inventory}),q=quoteCrafting(owner,inventory,request,ctx);let error=null;try{stageCrafting(owner,inventory,q,ctx);}catch(e){error=e.message;}return {request,quoteEligible:q.eligible,quoteReason:q.reason,commitError:error,inputsUnchanged:before===JSON.stringify({owner,inventory})};}
const missingAccess=probe({type:'craft',recipe:'village.salt-steep',inputs:[{key:low,qty:1}]});
const acquired=stageCrafting(owner,inventory,quoteCrafting(owner,inventory,{type:'acquire',ref:'village.method-book'},ctx),ctx);owner=acquired.state;for(const row of acquired.items)inventory[row.key]=(inventory[row.key]||0)+row.amount;
const badIngredients=probe({type:'craft',recipe:'village.salt-steep',inputs:[{key:low,qty:1}]});
const badTreatment=probe({type:'treatment',action:'apparatus',recipe:'village.salt-steep'});
// Supply the apparatus cost so method validation, rather than stock, leads.
inventory[JSON.stringify({id:'Iron ingot'})]=2;
const fundedTreatment=probe({type:'treatment',action:'apparatus',recipe:'village.salt-steep'});
const product=k=>{const request={type:'craft',inputs:[{key:k,qty:1}]};const plan=stageCrafting(owner,inventory,quoteCrafting(owner,inventory,request,ctx),ctx);return (plan.batch??plan.failure.result).product;};
console.log(JSON.stringify({missingAccess,badIngredients,fundedTreatment,quality:{low:40,high:60,sameProduct:JSON.stringify(product(low))===JSON.stringify(product(high))}},null,2));
