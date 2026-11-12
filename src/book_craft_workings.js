// Original workshop operations grounded in HP-D7-S2 (ordinary glass repair)
// and MOL-C011-06/07/08 (formulae anchor workings in real material). Operation
// names, fractions and yields here are YAIR proposals, not source measurements.
import {defineCatalogue} from './craft_materials.js';
import {defineCraftLaw} from './craft_resolver.js';
import {compileCraftWorking,craftOperationDictionary} from './craft_working.js';
import {MOL_IDS,MOL_KEYS,MOL_LOCATIONS} from './book_world_mol_ids.js';

const axis=id=>({id,kind:'fraction'});
const tag=(id,kind)=>({id,kind,parents:[],revision:1});
const material=(id,properties,tags=[])=>({id,properties,tags,phase:'solid',revision:1});
const convert=(id,label,station,from,to)=>({id,label,station,converts:[{from,to,permille:1000}]});
const hpKey=id=>JSON.stringify({id:'book.hp.school.'+id});
const glassTable='glass-table';
const formulaTable='formula-table';

const glassSpec={id:'hp.practice-glass',revision:1,
    tags:[tag(glassTable,'station'),tag('wand','origin')],
    axes:['shards','aligned','joined'].map(axis),
    materials:[material('glass', {shards:1000}),material('wand',{},['wand'])]};
const glass=defineCatalogue(glassSpec);
const glassLawSpec={id:'hp.practice-pane',revision:1,catalogue:glass,carrier:'Practice glass working',
    ops:[convert('align','Align fragments',glassTable,'shards','aligned'),{id:'join',label:'Rejoin glass',station:glassTable}],
    reactions:[{id:'join-glass',after:'join',catalyst:'wand',reactants:{aligned:1},products:{joined:1}}],
    outputs:[{id:'pane',route:'fit',effect:'whole-pane',axis:'joined',per:1}]};
const glassLaw=defineCraftLaw(glassLawSpec);

// Original classroom comparison. Both stock types can fill the same role;
// the mesh belongs to the material and survives the repair.
const glassTraits=['legibility','fragment-retention'];
const glassVariants=defineCatalogue({...glassSpec,revision:2,
    tags:[...glassSpec.tags,tag('pane-stock','origin')],
    axes:[...glassSpec.axes,...glassTraits.map(id=>({id,kind:'scalar'}))],
    materials:[
        material('clear-glass',{shards:1000,legibility:4,'fragment-retention':1},['pane-stock']),
        material('wired-glass',{shards:1000,legibility:2,'fragment-retention':4},['pane-stock']),
        material('wand',{},['wand'])
    ]});
export const schoolPaneRefinementLaw=defineCraftLaw({...glassLawSpec,revision:2,catalogue:glassVariants});

export function schoolPaneProperties(product) {
    if(product.law!==schoolPaneRefinementLaw.ref||!product.outputs.fit?.['whole-pane'])return null;
    return Object.fromEntries(glassTraits.map(id=>[id,product.scalars[id]]));
}

export function fitsSchoolPaneUse(product,use) {
    const property={reading:'legibility',shielding:'fragment-retention'}[use];
    return property!=null&&(schoolPaneProperties(product)?.[property]??0)>=3;
}

const formula=defineCatalogue({id:'mol.formula-stock',revision:1,tags:[tag(formulaTable,'station')],
    axes:['stone','prepared','ink','trace','anchored'].map(axis),
    materials:[material('cube',{stone:1000}),material('ink',{ink:1000})]});
const formulaLaw=defineCraftLaw({id:'mol.formula-carrier',revision:1,catalogue:formula,carrier:'Cyorian formula working',
    ops:[convert('prepare','Prepare stone face',formulaTable,'stone','prepared'),
        convert('inscribe','Lay the ink trace',formulaTable,'ink','trace'),
        {id:'anchor',label:'Anchor the formula',station:formulaTable}],
    reactions:[{id:'anchor-trace',after:'anchor',reactants:{prepared:1,trace:1},products:{anchored:2}}],
    outputs:[{id:'anchor',route:'inspect',effect:'anchored-trace',axis:'anchored',per:1}]});

const part=(id,label,law,...operations)=>({id,label,law:law.ref,revision:1,
    steps:operations.map(op=>({op,level:1}))});

export const bookCraftWorkshops=Object.freeze({
    'book.hp.school.world':{location:'book.hp.school.commons',law:glassLaw,station:glassTable,
        parts:[part('glass-preparation','Lay out the fragments',glassLaw,'align')],
        result:{route:'fit',effect:'whole-pane',key:hpKey('glass_pane')},
        materials:{[hpKey('glass_shards')]:glass.materials.glass,[hpKey('wand')]:glass.materials.wand,
            [hpKey('practice_wand')]:glass.materials.wand}},
    [MOL_IDS.world]:{location:MOL_LOCATIONS.workshop,law:formulaLaw,station:formulaTable,
        parts:[part('stone-layout','Prepare and mark the stone',formulaLaw,'prepare','inscribe')],
        result:{route:'inspect',effect:'anchored-trace',key:MOL_KEYS.lamp},
        materials:{[MOL_KEYS.cube]:formula.materials.cube,[MOL_KEYS.ink]:formula.materials.ink}}
});

const schoolRefinement={
    ...bookCraftWorkshops['book.hp.school.world'],law:schoolPaneRefinementLaw,
    parts:[part('glass-preparation','Lay out the fragments',schoolPaneRefinementLaw,'align')],
    materials:{[hpKey('glass_shards')]:glassVariants.materials['clear-glass'],
        [hpKey('wired_glass_shards')]:glassVariants.materials['wired-glass'],
        [hpKey('wand')]:glassVariants.materials.wand,[hpKey('practice_wand')]:glassVariants.materials.wand}
};

export const bookCraftLaws=[...Object.values(bookCraftWorkshops).map(workshop=>workshop.law),schoolPaneRefinementLaw];

export function readBookCraftVocabulary({world,location,inventory}) {
    const workshop=bookCraftWorkshops[world];
    if(!workshop||location!==workshop.location)return null;
    return {
        law:workshop.law.ref,
        operations:craftOperationDictionary(workshop.law),
        parts:structuredClone(workshop.parts),
        stock:Object.keys(workshop.materials).filter(key=>inventory[key]>0)
            .map(key=>{
                const {id,tags}=workshop.materials[key];
                return {key,qty:inventory[key],material:id,role:tags.includes('wand')?'catalyst':'consumed'};
            })
    };
}

export function quoteBookCraftWorking(working, {world,location,inventory,blocked}, lots) {
    if(blocked)throw Error(blocked);
    const workshop=world==='book.hp.school.world'&&working.law===schoolPaneRefinementLaw.ref
        ?schoolRefinement:bookCraftWorkshops[world];
    if(!workshop||location!==workshop.location)throw Error('Go to the workshop for this method.');
    return compileCraftWorking(working,{world,law:workshop.law,stock:inventory,lots,
        materialForKey:key=>workshop.materials[key],stations:[workshop.station],parts:workshop.parts});
}

// Rebuild the frozen Cyoria terms from the submitted composition on both
// admission and restore. The authored command still owns support and duration.
export function cyoriaCraftTerms(template,trial,claims,inventory=null) {
    if(template?.id!=='book.mol.assemble_lamp'||trial?.schema!==1||typeof trial.learn!=='boolean')
        throw Error('Unsupported Cyoria formula working.');
    const world=MOL_IDS.world;
    const {location,result}=bookCraftWorkshops[world];
    if(inventory===null){
        inventory={};
        for(const {key,qty} of trial.lots)inventory[key]=(inventory[key]??0)+qty;
    }
    const quote=quoteBookCraftWorking(trial.working,{world,location,inventory},trial.lots);
    const product=quote.batch.product;
    const success=(product.outputs[result.route]?.[result.effect]??0)>0;
    const repeat=claims[template.claim]?.status==='settled';
    const costs=[...template.costs.filter(cost=>cost.type!=='item'),
        ...quote.consumed.map(({key,qty})=>({type:'item',actor:'player',key,amount:-qty}))];
    const effects=template.effects.filter(effect=>effect.type==='resource'||
        (success&&(!repeat||effect.type==='item')));
    return {definition:{...template,label:'Try the formula working',once:false,
        claim:success&&!repeat?template.claim:undefined,costs,effects},quote,success};
}
