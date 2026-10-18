import {readFileSync, writeFileSync, mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {resolve, dirname} from 'node:path';
import {build} from 'esbuild';
const here=dirname(fileURLToPath(import.meta.url)), root=resolve(here,'../..');
mkdirSync(resolve(here,'built'),{recursive:true});
const hashes={};
function read(path){const s=readFileSync(resolve(root,path),'utf8');hashes[path]=createHash('sha256').update(s).digest('hex');return s;}
const recipes=read('src/crafting_recipes.js'), items=read('src/items.js');
// Read only the two selected literal definitions. No imported game startup or eval.
const names=['Roasted rat meat','Roasted purified rat meat'];
const rows=names.map(name=>{
 const start=recipes.indexOf(`cooking_recipes.items["${name}"] = new ItemRecipe({`);
 if(start<0)throw Error(`Missing recipe ${name}`);
 const text=recipes.slice(start,recipes.indexOf('\n    });',start));
 const materialSection=text.match(/materials:\s*\[([\s\S]*?)\]/)[1];
 const materials=[...materialSection.matchAll(/material_id:\s*"([^"]+)",\s*count:\s*(\d+)/g)].map(m=>({material_id:m[1],count:Number(m[2])}));
 const chance=JSON.parse(text.match(/success_chance:\s*(\[[^\]]+\])/)[1]);
 const levels=JSON.parse(text.match(/recipe_level:\s*(\[[^\]]+\])/)[1]);
 const itemStart=items.indexOf(`item_templates["${name}"] = new UsableItem({`);
 const item=items.slice(itemStart,items.indexOf('\n    });',itemStart));
 const effects=[...item.matchAll(/effect:\s*"([^"]+)",\s*duration:\s*(\d+)/g)].map(m=>({name:m[1],duration:Number(m[2])}));
 return {id:name,name,materials,chance,levels,skill:'Cooking',outputCount:Number(text.match(/result:.*count:\s*(\d+)/)[1]),effects};
});
writeFileSync(resolve(here,'built/recipes.json'),JSON.stringify(rows,null,2));
writeFileSync(resolve(here,'built/ui_tokens.css'),read('styles/ui_tokens.css'));
writeFileSync(resolve(here,'built/crafting_detail.css'),read('styles/crafting_detail.css'));
read('src/crafting_detail.js');read('src/crafting_visibility.js');read('src/ui_components.js');
await build({entryPoints:[resolve(here,'comparison.js')],outfile:resolve(here,'built/comparison.js'),bundle:true,format:'esm',sourcemap:true,target:'es2022'});
writeFileSync(resolve(here,'built/INPUTS.json'),JSON.stringify({description:'YAIR project-source snapshot for a disposable UI comparison',hashes},null,2));
console.log('Built isolated recipe comparison. No main bundle or shared UI files written.');
