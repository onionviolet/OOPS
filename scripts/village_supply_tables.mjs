// Read ordinary literal definitions without importing the native DOM graph.
// Evaluation is restricted to object declarations in this checkout, with inert
// constructors. No owner module, gameplay function, timer or random draw runs.
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {buildVillageObtainability} from '../src/village_obtainability.js';
const read=file=>readFileSync(new URL(`../src/${file}`,import.meta.url),'utf8');
function balanced(s,start,open='{',close='}') {
 let depth=0,quote=null,line=false,block=false;
 for(let i=start;i<s.length;i++) {const c=s[i],n=s[i+1];
  if(line){if(c==='\n')line=false;continue;}if(block){if(c==='*'&&n==='/'){block=false;i++;}continue;}
  if(quote){if(c==='\\'){i++;continue;}if(c===quote)quote=null;continue;}
  if(c==='/'&&n==='/'){line=true;i++;continue;}if(c==='/'&&n==='*'){block=true;i++;continue;}
  if(['"',"'",'`'].includes(c)){quote=c;continue;}
  if(c===open)depth++;if(c===close&&--depth===0)return s.slice(start,i+1);
 }throw Error('Unbalanced live table.');
}
const inert=class {constructor(data){Object.assign(this,data);}};
const evaluate=s=>runInNewContext(`(${s})`,{TradeItem:inert,TradeItemGroup:inert,LocationActivity:inert,LocationGatheringActivity:inert},{timeout:100});
export function readVillageSupplyTables() {
 const source=read('items.js'),items={};
 for(const m of source.matchAll(/item_templates\["([^"\n]+)"\]\s*=\s*new \w+\(\{/g)) {const body=balanced(source,m.index+m[0].length-1),value=body.match(/\bvalue:\s*(\d+(?:\.\d+)?)/),type=body.match(/material_type:\s*"([^"]+)"/);if(value)items[m[1]]={value:Number(value[1]),materialType:type?.[1]};}
 for(const m of read('data/expedition_items.js').matchAll(/\["([^"]+)", "[^"\n]+", (\d+)\]/g))items[m[1]]={value:Number(m[2])};
 const traderSource=read('data/traders.js'),trader=balanced(traderSource,traderSource.indexOf('{',traderSource.indexOf('traders["village trader"]'))),margin=Number(trader.match(/profit_margin:\s*(\d+)/)[1]);
 const inv=read('data/inventory_templates.js'),start=inv.indexOf('[',inv.indexOf('=',inv.indexOf('inventory_templates["Basic"]'))),groups=evaluate(balanced(inv,start,'[',']'));
 const stock=groups.flatMap(g=>g.items.map(i=>({item:i.item_name,count:i.count||[1],chance:i.chance??1,quality:i.quality,known:false,available:false})));
 const main=read('main.js'),opening=main.slice(main.indexOf('set_loading_screen_versions();\n    character.addToInventory(['));
 const inventory={};for(const m of opening.slice(0,opening.indexOf(']);')).replace(/\/\/[^\n]*/g,'').matchAll(/item_id:\s*"([^"]+)"(?:,\s*count:\s*(\d+))?/g))inventory[m[1]]=Number(m[2]||1);
 const loc=read('data/locations.js'),locStart=loc.indexOf('{',loc.indexOf('locations["Village"].activities =')),actions=evaluate(balanced(loc,locStart));
 const gathers=Object.entries(actions).filter(([,a])=>a.gained_resources).map(([id,a])=>({source:`Village:${id}`,resources:a.gained_resources.resources.map(r=>({item:r.name,chance:r.chance,count:r.ammount?.[0]?.[0]||1})),period:a.gained_resources.time_period[0],tool:a.require_tool?id:null,season:a.availability_seasons||null,known:a.is_unlocked===true,available:!a.require_tool&&a.is_unlocked===true}));
 const enemy=read('enemies.js'),drops=[];
 for(const m of enemy.matchAll(/enemy_templates\["([^"\n]+)"\]\s*=\s*new Enemy\(\{/g)) {if(!/wolf rat/i.test(m[1]))continue;const body=balanced(enemy,m.index+m[0].length-1);for(const d of body.matchAll(/item_name:\s*"([^"]+)",\s*chance:\s*([\d.]+)/g))drops.push({item:d[1],chance:Number(d[2]),source:m[1],known:false,available:false});}
 const craft=read('crafting_recipes.js'),recipes=[];
 for(const m of craft.matchAll(/(\w+)_recipes\.items\["([^"\n]+)"\]\s*=\s*new ItemRecipe\(\{/g)) {
  const body=balanced(craft,m.index+m[0].length-1);let r;try{r=evaluate(body);}catch{continue;}
  if(!r.result?.result_id||!r.materials?.length)continue;
  recipes.push({item:r.result.result_id,count:r.result.count,source:`Village:${m[1]}:${m[2]}`,unlocked:r.is_unlocked!==false,known:false,available:false,chance:r.success_chance?.[0]??1,materials:r.materials.map(x=>({item:x.material_id,type:x.material_type,count:x.count}))});
 }
 return structuredClone({items,stock,margin,inventory,gathers,drops,recipes});
}
export const readVillageObtainability=()=>buildVillageObtainability(readVillageSupplyTables());
