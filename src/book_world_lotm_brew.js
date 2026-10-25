// Brewing (potion pathways S1, 2026-10-25): a Tingen probationer on the Evernight line brews the Corpse Collector Sequence 9 dose at Hale's bench instead of
// being issued one. Every figure is an authored proposal (WPR5). Decisions are in docs/gm/dispatch/potion-pathways-2026-10-24/S1_DECISION.md:
// brewing is a second route to the SAME allocated state (collect sets `cc.allocated` and mints the same item), so pathwayDoses, the ingest and
// everything after it run unchanged; the brew's own state is facts plus one knowledge note (its `.at` is the start clock), no new save field.
import {LOTM_LOCATIONS as L,LOTM_KEYS as K,LOTM_PENCE as P,LOTM_IDS as I} from './book_world_lotm_ids.js';
import {eq,gte,all,af,has,no,item,attention,know,money,cmd,freeze,ready} from './book_world_lotm_kit.js';
import {flagOf} from './book_world_lotm_pathways.js';
import {ccRow} from './book_world_lotm_rows.js';
import {defineProcess,processReady} from './dose_process.js';
// Inputs are role slots shaped like src/craft_recipes.js selectors ({material} or {tags}); only the exact `key` resolves today, trait matching comes later.
// Canon names a 230-pound formula; a clerk's purse is a few pounds, so the slice scales it to 5 pounds (proposal, 1200 pence). Hale sells it on his terms.
// DWF101: the brew is a shared-envelope process row; the three commands below are generated from it by lotmBrewCommands.
const CC_ROW=defineProcess({id:'cc.s9',world:'book.lotm.tingen',pathway:'Death',seq:9,name:'Corpse Collector',status:'brewable',minutes:120,bench:L.workroom,
 price:{pence:5*P.pound,canon:{pounds:230,evidence:'T 0128, 0278'},scale:'230 pounds scaled to 5 (proposal)'},
 slots:[{id:'main',role:'main material',select:{material:'Dried black-spotted frog'},qty:1,key:K.frog,hold:'frog',evidence:'T 0128, 0278'}],
 product:{key:K.corpseDose,kind:'dose'},evidence:['S1_DECISION proposal']});
export const CC_BREW=freeze({...CC_ROW,formulaPence:CC_ROW.price.pence});
const U='understood',f=n=>flagOf(ccRow,n),at=K.corpseDose;
const eligible=all(eq('lotm.beyonderTrack'),eq('lotm.home.evernight'));
const CC_TEXTS={
 buyLabel:"Buy the Corpse Collector formula on Hale's terms · 5 pounds (a scaled proposal; the canon price is 230)",
 buyNote:'Hale wrote the Sequence 9 formula out for you and took the fee. A dried black-spotted frog is the main material. He reminds you a potion is brewed under his eye at this bench, takes time to settle, and that this is a second way to the same dose: a brewed dose replaces the issued one.',
 startLabel:"Start brewing the Corpse Collector potion at Hale's bench: consumes a dried black-spotted frog and 1 of Hale's attention",
 startNote:m=>`The frog is in the pot and Hale has set the bench. It needs ${m} minutes before it can be bottled. You cannot take another pathway's dose while it stands.`,
 collectLabel:'Bottle the brewed Corpse Collector dose',
 collectNote:'The pot settled and you bottled one dose, the same potion the workroom issues. Holding it grants nothing; drinking it is the separate, irreversible step, and it takes the place of an allocation.'};
// Generator: the three Hale-bench commands of a one-slot, issued-dose brew row. Output must stay byte-identical to the shipped definitions (tests/lotm_commands_golden.test.js).
export function lotmBrewCommands(row,flag,texts){
 const slot=row.slots[0],place=row.bench,dose=row.product.key;
 return [
 cmd('buy_formula_cc',texts.buyLabel,place,{targetId:I.supervisor,
  visibleWhen:all(ready,eligible,no(flag('formula'))),requires:all(eligible,no(flag('formula')),eq('lotm.pathChosen',false)),costs:[money(-row.price.pence)],
  effects:[af(flag('formula')),know('brew.cc.formula',texts.buyNote,'player','player','instruction',U)]}),
 cmd('brew_start_cc',texts.startLabel,place,{targetId:I.supervisor,
  visibleWhen:all(ready,eligible,has(flag('formula')),no(flag('brew.started'))),
  requires:all(eligible,has(flag('formula')),no(flag('brew.started')),eq('lotm.pathChosen',false),eq('lotm.block.corpse.switching',false),gte(`lotm.holds.${slot.hold}`,1),gte('lotm.supervisorAttention',1)),
  costs:[item('player',slot.key,-slot.qty),attention()],
  effects:[af(flag('brew.started')),know('brew.cc.started',texts.startNote(row.minutes),'player','player','observation',U)]}),
 cmd('brew_collect_cc',texts.collectLabel,place,{targetId:I.supervisor,
  visibleWhen:all(ready,has(flag('brew.started')),no(flag('brew.collected'))),
  requires:all(has(flag('brew.started')),no(flag('brew.collected')),no(flag('allocated')),eq('lotm.brew.cc.ready')),
  effects:[af(flag('allocated')),af(flag('brew.collected')),item('player',dose,1),know('brew.cc.collected',texts.collectNote,'player','player','observation',U)]})];
}
export const brewCommands=lotmBrewCommands(CC_ROW,f,CC_TEXTS);
export const brewFlags=['formula','brew.started','brew.collected'].map(f);
export function brewFacts(state,f2){
 const note=state.simulation?.knowledge?.player?.['book.lotm.brew.cc.started'];
 f2['lotm.brew.cc.ready']=!!note&&processReady({startedAt:note.at,now:state.clock,minutes:CC_BREW.minutes});
}
// The brew's invariants: it needs its formula and the one pathway, collecting is the recorded allocation, and a brew in progress holds no dose or ingestion.
export function brewAssertions({has,assert,others}){
 const g=n=>has(f(n));
 assert(!g('brew.started')||g('formula')&&has('reportedIn')&&others===0,'A brew needs its formula, a reported probationer and no other pathway.');
 assert(!g('brew.collected')||g('brew.started')&&g('allocated'),'A bottled dose needs its brew and records the allocation.');
 assert(!g('brew.started')||g('brew.collected')||!g('allocated')&&!g('ingested'),'A brew in progress holds no dose and no ingestion.');
}
