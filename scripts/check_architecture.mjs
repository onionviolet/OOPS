import {build} from 'esbuild';
import {readdir,readFile,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';
const baselinePath='scripts/architecture_baseline.json';
async function files(dir) {
 const entries=await readdir(dir,{withFileTypes:true});
 return (await Promise.all(entries.map(e=>e.isDirectory()?files(path.join(dir,e.name)):e.name.endsWith('.js')?[path.join(dir,e.name)]:[]))).flat().sort();
}
// esbuild parses real JS. Comments, strings and template prose cannot invent edges.
export async function importGraph(root='src') {
 const entries=await files(root),graph=new Map(entries.map(f=>[f,[]]));
 const {metafile}=await build({entryPoints:entries,outbase:'.',outdir:'.architecture-scan',bundle:false,write:false,metafile:true,logLevel:'silent'});
 for(const output of Object.values(metafile.outputs)) {
  const source=output.entryPoint;
  for(const spec of output.imports) {
   if(!spec.path.startsWith('.'))continue;
   const target=path.normalize(path.join(path.dirname(source),spec.path));
   if(graph.has(target))graph.get(source).push(target);
   // Unresolved legacy mod imports are terminal edges, not graph vertices.
   else if(target.startsWith(root+'/'))graph.get(source).push(target);
  }
 }
 return graph;
}
export function architectureEdges(graph) {
 const mainImports=[],cycleEdges=[];
 // An edge is cyclic iff its destination can reach its source.
 function reaches(from,to,seen=new Set()) {if(from===to)return true;if(seen.has(from))return false;seen.add(from);return (graph.get(from)||[]).some(n=>reaches(n,to,seen));}
 for(const [from,targets] of graph)for(const to of targets) {
  const edge=`${from} -> ${to}`;
  if(to==='src/main.js')mainImports.push(edge);
  if(reaches(to,from))cycleEdges.push(edge);
 }
 return {mainImports:[...new Set(mainImports)].sort(),cycleEdges:[...new Set(cycleEdges)].sort()};
}
export function checkBaseline(current,baseline,previous) {
 const errors=[];
 for(const key of ['mainImports','cycleEdges']) {
  for(const edge of current[key])if(!baseline[key].includes(edge))errors.push(`New ${key}: ${edge}`);
  for(const edge of baseline[key])if(!current[key].includes(edge))errors.push(`Remove resolved baseline ${key}: ${edge}`);
  if(previous)for(const edge of baseline[key])if(!previous[key].includes(edge))errors.push(`Baseline may only shrink (${key}): ${edge}`);
 }
 if(previous)for(const [file,count]of Object.entries(baseline.lineCounts))if(count!==previous.lineCounts[file])errors.push(`Line baseline must remain fixed: ${file}`);
 return errors;
}
async function main() {
 const current=architectureEdges(await importGraph());
 const lineCounts={};for(const file of ['src/main.js','src/display.js','src/save_files.js'])lineCounts[file]=(await readFile(file,'utf8')).split('\n').length-1;
 let baseline;
 try{baseline=JSON.parse(await readFile(baselinePath,'utf8'));}catch(e){if(e.code!=='ENOENT'||!process.argv.includes('--initialize'))throw e;}
 if(!baseline){baseline={...current,lineCounts};await writeFile(baselinePath,JSON.stringify(baseline,null,2)+'\n');}
 let previous;
 try{previous=JSON.parse(execFileSync('git',['show',`HEAD:${baselinePath}`],{encoding:'utf8',stdio:['ignore','pipe','ignore']}));}catch{}
 if(process.argv.includes('--shrink')){for(const key of ['mainImports','cycleEdges'])baseline[key]=baseline[key].filter(e=>current[key].includes(e));await writeFile(baselinePath,JSON.stringify(baseline,null,2)+'\n');}
 const errors=checkBaseline(current,baseline,previous);
 for(const [file,count] of Object.entries(lineCounts))console.log(`${file}: ${count} lines; baseline ${baseline.lineCounts[file]}; growth ${count-baseline.lineCounts[file]}`);
 console.log(`Grandfathered: ${current.mainImports.length} main imports, ${current.cycleEdges.length} cyclic edges.`);
 for(const error of errors)console.error(error);
 if(errors.length)process.exitCode=1;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href)await main();
