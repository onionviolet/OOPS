// Klein's Spirit Vision as a repeatable cast (W2b, proposal under AD32, LT2 second caller): the shared spell-cast lowering with LOTM's own law.
// Default, dial, reason: the cost is spirituality (beSeerUse(), the pool the Seer potion brings), not stamina, and LOTM states no failure number
// (lotmSpellAdapter has chance null; its law is strain and the exhaustion that ending the vision leaves), so lowerSpellCasts returns this command
// plain with no fizzle outcomes. That is the contrast with Harry's levitation charm (hp_lead_spells.js): same lowering, different local law (AR11).
// It reuses the story's own fact for "vision open": the condition BE_SPIRIT_VISION that the content act `book.lotm.kj3p.switch` turns on, with the
// same requires (the Seer source held, vision closed, mind not worn out). The cast opens it for a while; the story's two-tap switch-off still ends it
// and leaves its exhaustion. Proposal dial: 60 minutes open; the text gives no length for a held vision (ch33 has it on until Klein stops).
// A lapse after the time ends the vision without a notch of exhaustion (only the deliberate ending leaves one). Gaps: the glabella tap itself is not
// a requirement here (the story act names it); the wording below is a plain player note.
import {defineSpells} from './spell_seam.js';
import {lotmSpellAdapter} from './spell_adapter_lotm.js';
import {lowerSpellCasts, spellCastFacts} from './spell_cast_lowering.js';
import {beSeerUse, beSpiritVisionOnRequires, beSpiritVisionOnEffects} from './book_world_lotm_be_seer.js';

const WORLD = 'book.lotm.tingen', PREFIX = 'book.lotm.be.sp', KEY = 'spirit_vision';
export const BE_SPIRIT_VISION_OPEN_MINUTES = 60;
const note = value => ({type: 'knowledge', key: 'book.lotm.be.spell.spirit_vision.last', stage: 'understood', value});

export const lotmBeSpellSet = defineSpells([{
    key: KEY, label: 'Open your Spirit Vision', sourceId: `${PREFIX}.seer`, origin: {kind: 'granted'}, fn: 'perception',
    formula: [{label: 'The Seer potion in you, the vision closed, a rested mind', requires: beSpiritVisionOnRequires()}],
    cost: [], limit: {kind: 'none'},
    effects: [...beSpiritVisionOnEffects().map(e => ({...e, duration: BE_SPIRIT_VISION_OPEN_MINUTES})),
        note('You tapped your brow and let your spirit open. Auras came into view, and your spirit began to drain.')],
    unstated: ['cost amount (spirituality is spent through its own pool use, not a stated number)', 'failure chance (none stated for abilities)']}],
    lotmSpellAdapter({worldId: WORLD, prefix: PREFIX}));

const castId = lotmBeSpellSet.ids[KEY].command;
export const lotmBeChanceFact = id => `lotm.be.spell.${id.slice(PREFIX.length + 1)}.failChance`;

// A spell row must name a prefix-owned source, so the row uses a generated one and the command's requires are rewritten onto the story's own gate
// (the real Seer source, through the host fact lotm.beSeer.supported), as the Harry caller does for its power. The spirituality cost is an energy `use` effect (no amount), which an ability row cannot state, so the command carries it here.
export const lotmBeSpellCommands = lowerSpellCasts(lotmBeSpellSet, {chanceFact: lotmBeChanceFact}).filter(c => c.id === castId).map(c => ({
    ...c, group: 'book_lotm', worldId: WORLD, audience: ['$actor'], costs: [beSeerUse()],
    requires: {all: [{fact: 'actor.life', op: 'eq', value: 'alive'}, beSpiritVisionOnRequires()], reason: 'You need the Seer potion in you and a rested mind.'}}));

export const lotmBeSpellFacts = state => spellCastFacts(state, lotmBeSpellSet, {chanceFact: lotmBeChanceFact});
