// Spell cast lowering (W1b, proposal under AD32, LT2 power grammar): the one executor for a cast's failure, shared by every world.
// spell_seam.js defines spells and their failure chance; nothing ran that failure. This leaf lowers each cast command of a `defineSpells`
// result into a native command with engine-drawn, seeded `outcomes` (the same mechanism as a practice attempt), so the engine rolls the
// chance and no caller owns a random stream. A Harry charm and a later LOTM ability run this same code with different world costs.
// Default, dial, reason: costs stay on the command and are spent whether the cast works or fizzles (reason: the effort was made; a world
// that refunds a failed cast overrides the command, not this leaf). The chance is a dial per spell row or per world adapter; a spell whose
// failure chance is null keeps its plain command (no failure modelled, labelled unstated by the seam).
// ABR4: effect_dsl stays inert; this is not it. It only reads typed commands and writes typed outcomes. AR11: the LOTM caller is the
// second case and is not wired yet. No world imports, no DOM, no clock, no save.
import {failureChance} from './spell_seam.js';

export const defaultChanceFact = castCommandId => `spell.${castCommandId}.failChance`;

// set: a defineSpells result. chanceFact: (castCommandId) => fact name read for the spell's failure chance.
// Returns the set's commands; each cast command of a spell with a chance becomes {outcomes:[cast, fizzled]} with no direct `effects`.
export function lowerSpellCasts(set, {chanceFact = defaultChanceFact} = {}) {
    const byCommand = new Map(Object.entries(set.ids).map(([key, ids]) => [ids.command, key]));
    return set.commands.map(command => {
        const key = byCommand.get(command.id), spell = key && set.spells[key];
        if(!spell || spell.failure.chance == null) return command;
        const fact = chanceFact(command.id), {effects, ...rest} = command;
        return {...rest, outcomes: [
            {id: 'cast', weight: {fact, scale: -1, add: 1}, effects: structuredClone(effects)},
            {id: 'fizzled', weight: {fact}, effects: structuredClone(spell.failure.outcome)}]};
    });
}

// The chance facts for the engine's context, from the actor's power mastery (state.simulation.powers.<actor>[powerId].mastery).
// powerOf(key): the power id that holds the mastery (default: the one the set generated; a world that binds a spell to a power it already
// teaches passes its own). Returns {[factName]: chance 0..1}, one per spell with a chance.
export function spellCastFacts(state, set, {chanceFact = defaultChanceFact, powerOf = key => set.ids[key].power, actorId = set.adapter.actorId} = {}) {
    const facts = {};
    for(const [key, spell] of Object.entries(set.spells)) {
        if(spell.failure.chance == null) continue;
        const mastery = Number(state?.simulation?.powers?.[actorId]?.[powerOf(key)]?.mastery ?? 0), need = set.cards[key].learn?.masteryNeeded ?? 0;
        facts[chanceFact(set.ids[key].command)] = failureChance(spell, mastery, need);
    }
    return facts;
}
