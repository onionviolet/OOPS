// L4 host consumer: supplies the actor.lotm.div.* support facts that LOTM_DIVINATION_ROWS name (AR3: the rows
// own what is needed, this file only reports what the lead holds). Authored proposals (WPR5): a means is
// held when the lead carries `book.lotm.div.<fact>` stock or a derived rule says he can improvise it; a
// contact is held when he carries `book.lotm.div.<fact>` or knows `book.lotm.div.<fact>`, except the
// three contacts the rows describe as held in mind, which need only a body awake enough to ask.
import {LOTM_DIVINATION_FACTS} from './lotm_divination_rows.js';
import {LOTM_IDS as I} from './book_world_lotm_ids.js';
const PREFIX='actor.lotm.div.';
// default (derived rule) / dial (item or knowledge makes it true anywhere) / reason (why the default is open).
const DERIVED={
 'means.coin':{need:'money',reason:'Any coin serves a toss; the scene names a gold one.'},
 'means.brass-coin':{need:'money',reason:'Any coin serves a toss; the scene names a brass-colored one.'},
 'means.dream-divination':{need:'method',reason:'Entering a divinatory dream is the Seer method itself.'},
 'means.chart':{need:'method',reason:'Constructing and reading an event chart is Seer craft; paper is assumed.'},
 'means.tarot':{need:'method',reason:'Reading the spread is Seer craft; the deck is assumed at hand.'},
 'means.numerology':{need:'method',reason:'Calculating date numbers is Seer craft.'},
 'contact.return-address':{need:'mind',reason:'The row asks only that the return be held in mind.'},
 'contact.azik-disclosure':{need:'mind',reason:'The row asks only that the disclosure be held in mind.'},
 'contact.club-visit':{need:'mind',reason:'The row asks only that the visit be held in mind.'}};
export const LOTM_DIV_DERIVED=DERIVED;
export function lotmDivinationFacts(state,ctx={}){
 const enrolled=state.actors?.player?.worldId===I.world&&state.lotm,
  inv=ctx.gameplay?.player?.inventory||{},known=state.simulation?.knowledge?.player||{},money=(ctx.external?.money??0)>0,
  method=state.simulation?.powers?.player?.[I.method]?.owned===true,out={};
 for(const key of LOTM_DIVINATION_FACTS){
  const name=key.slice(PREFIX.length),stock=`book.lotm.div.${name}`,rule=DERIVED[name]?.need;
  if(name.startsWith('grounds.')){out[key]=!!enrolled&&!!known[`book.lotm.div.${name}`];continue;}
  out[key]=!!enrolled&&((inv[stock]||0)>0||!!known[stock]||rule==='money'&&money||rule==='method'&&method||rule==='mind');
 }
 return out;
}
