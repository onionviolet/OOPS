// Brewing (potion pathways S1, 2026-10-25): a Tingen probationer on the Evernight line brews the Corpse Collector Sequence 9 dose at Hale's bench instead of
// being issued one. Every figure is an authored proposal (WPR5). Decisions are in docs/gm/dispatch/potion-pathways-2026-10-24/S1_DECISION.md:
// brewing is a second route to the SAME allocated state (collect sets `cc.allocated` and mints the same item), so pathwayDoses, the ingest and
// everything after it run unchanged; the brew's own state is facts plus one knowledge note (its `.at` is the start clock), no new save field.
import {LOTM_LOCATIONS as L,LOTM_KEYS as K,LOTM_PENCE as P,LOTM_IDS as I} from './book_world_lotm_ids.js';
import {eq,gte,all,af,has,no,item,attention,know,money,cmd,freeze,ready} from './book_world_lotm_kit.js';
import {flagOf} from './book_world_lotm_pathways.js';
import {ccRow} from './book_world_lotm_rows.js';
// Inputs are role slots shaped like src/craft_recipes.js selectors ({material} or {tags}); only the exact `key` resolves today, trait matching comes later.
// Canon names a 230-pound formula; a clerk's purse is a few pounds, so the slice scales it to 5 pounds (proposal, 1200 pence). Hale sells it on his terms.
export const CC_BREW=freeze({id:'cc.s9',formulaPence:5*P.pound,minutes:120,
 slots:[{id:'main',role:'main material',select:{material:'Dried black-spotted frog'},qty:1,key:K.frog,hold:'frog'}],aux:[]});
const U='understood',f=n=>flagOf(ccRow,n),at=K.corpseDose;
const place=L.workroom,eligible=all(eq('lotm.beyonderTrack'),eq('lotm.home.evernight'));
export const brewCommands=[
 cmd('buy_formula_cc','Buy the Corpse Collector formula on Hale\'s terms · 5 pounds (a scaled proposal; the canon price is 230)',place,{targetId:I.supervisor,
  visibleWhen:all(ready,eligible,no(f('formula'))),requires:all(eligible,no(f('formula')),eq('lotm.pathChosen',false)),costs:[money(-CC_BREW.formulaPence)],
  effects:[af(f('formula')),know('brew.cc.formula','Hale wrote the Sequence 9 formula out for you and took the fee. A dried black-spotted frog is the main material. He reminds you a potion is brewed under his eye at this bench, takes time to settle, and that this is a second way to the same dose: a brewed dose replaces the issued one.','player','player','instruction',U)]}),
 cmd('brew_start_cc','Start brewing the Corpse Collector potion at Hale\'s bench: consumes a dried black-spotted frog and 1 of Hale\'s attention',place,{targetId:I.supervisor,
  visibleWhen:all(ready,eligible,has(f('formula')),no(f('brew.started'))),
  requires:all(eligible,has(f('formula')),no(f('brew.started')),eq('lotm.pathChosen',false),eq('lotm.block.corpse.switching',false),gte('lotm.holds.frog',1),gte('lotm.supervisorAttention',1)),
  costs:[item('player',CC_BREW.slots[0].key,-CC_BREW.slots[0].qty),attention()],
  effects:[af(f('brew.started')),know('brew.cc.started',`The frog is in the pot and Hale has set the bench. It needs ${CC_BREW.minutes} minutes before it can be bottled. You cannot take another pathway's dose while it stands.`,'player','player','observation',U)]}),
 cmd('brew_collect_cc','Bottle the brewed Corpse Collector dose',place,{targetId:I.supervisor,
  visibleWhen:all(ready,has(f('brew.started')),no(f('brew.collected'))),
  requires:all(has(f('brew.started')),no(f('brew.collected')),no(f('allocated')),eq('lotm.brew.cc.ready')),
  effects:[af(f('allocated')),af(f('brew.collected')),item('player',at,1),know('brew.cc.collected','The pot settled and you bottled one dose, the same potion the workroom issues. Holding it grants nothing; drinking it is the separate, irreversible step, and it takes the place of an allocation.','player','player','observation',U)]})];
export const brewFlags=['formula','brew.started','brew.collected'].map(f);
export function brewFacts(state,f2){
 const note=state.simulation?.knowledge?.player?.['book.lotm.brew.cc.started'];
 f2['lotm.brew.cc.ready']=!!note&&state.clock-note.at>=CC_BREW.minutes;
}
// The brew's invariants: it needs its formula and the one pathway, collecting is the recorded allocation, and a brew in progress holds no dose or ingestion.
export function brewAssertions({has,assert,others}){
 const g=n=>has(f(n));
 assert(!g('brew.started')||g('formula')&&has('reportedIn')&&others===0,'A brew needs its formula, a reported probationer and no other pathway.');
 assert(!g('brew.collected')||g('brew.started')&&g('allocated'),'A bottled dose needs its brew and records the allocation.');
 assert(!g('brew.started')||g('brew.collected')||!g('allocated')&&!g('ingested'),'A brew in progress holds no dose and no ingestion.');
}
