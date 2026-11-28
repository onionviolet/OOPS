import {readFileSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {census,censusCells,mechanisms,rankGaps} from '../prototypes/world-atlas/census-rules.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const marker='<!-- generated: reading census -->';
export function renderCensus(report,played){
    const cells=censusCells(report);
    const lines=[marker,'## Campaign rules by world and mechanism','',
        'Counts use canonical completed rules files. Each admitted record needs a shown or told evidence label, a chapter locator and an explicit relation in one field. Repeated IDs at the same locator count once within a world and mechanism. One record can support several mechanisms. A zero means the classifier found no qualifying claim. Facet columns count distinct located subrecords with their own shown or told label. Background and secondary material contribute zero.','',
        '| World | Raw rows | Distinct located records | Classified records | Acquisition | Enforcement | Reset |','|---|---:|---:|---:|---:|---:|---:|'];
    for(const w of report.worlds)lines.push(`| ${w.book} | ${w.raw} | ${w.located} | ${w.classified} | ${w.facets.acquire} | ${w.facets.enforcement} | ${w.facets.reset} |`);
    for(const family of ['SM','EV']){
        const codes=Object.keys(mechanisms).filter(code=>code.startsWith(family));
        lines.push('', '| World | '+codes.join(' | ')+' |', '|---|'+codes.map(()=> '---:|').join(''));
        for(const w of report.worlds)lines.push('| '+w.book+' | '+codes.map(code=>cells.find(c=>c.world===w.world&&c.code===code).count).join(' | ')+' |');
    }
    lines.push('','| World | Mechanism | Located matches | Example record and chapter |','|---|---|---:|---|');
    for(const c of cells.filter(c=>c.count))lines.push(`| ${c.book} | ${c.code} | ${c.count} | \`${c.example.id}\` · ${c.example.locator} |`);
    lines.push('','Unlisted world and mechanism pairs have zero matches.','','### Next foundation slices','',
        'Ranked by the number of contributing worlds, then by mean matches per 1,000 located records across the covered worlds. Systems with an exercised OOPS receipt in the Atlas are excluded. A recommendation calls for checking existing partial implementations before adding a law.','',
        '| Rank | Mechanism | Worlds | Matches | Mean per 1,000 |','|---:|---|---:|---:|---:|');
    rankGaps(report,played).forEach((r,i)=>lines.push(`| ${i+1} | ${r.code} · ${mechanisms[r.code][0]} | ${r.worlds} | ${r.count} | ${r.density.toFixed(2)} |`));
    return lines.join('\n')+'\n';
}
export function updateCensus(base=root){
    const file=join(base,'docs/audits/LITRPG_SYSTEM_CENSUS_2026-11-27.md');
    const snapshot=JSON.parse(readFileSync(join(base,'work/atlas-snapshot/snapshot.json'),'utf8'));
    const played=new Set(snapshot.systems.articles.filter(a=>a.playReceipt?.action&&a.playReceipt?.build).map(a=>a.id));
    const current=readFileSync(file,'utf8'), next=current.split(marker)[0].trimEnd()+'\n\n'+renderCensus(census(base),played);
    if(next!==current)writeFileSync(file,next);
    return {changed:current!==next};
}
if(import.meta.main)console.log(JSON.stringify(updateCensus()));
