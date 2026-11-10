// Chapters 16–18 use existing local work, mana, locations and observer notes.
import {MOL_IDS, MOL_LOCATIONS} from './book_world_mol_ids.js';
import {isZorianStart} from './book_world_mol_starts.js';

const prefix = 'book.mol.zorian.s2.';

export function molAraneaFacts(state, {barrierCubes = 0} = {}) {
    if (!isZorianStart(state) || state.actors.player.worldId !== MOL_IDS.world) return {};
    const {completed} = state.actors.player;
    const done = id => completed[prefix + id] === 1;
    const examined = done('accept_kaels_examination') || done('defer_kaels_examination');
    const met = done('answer_unseen_visitor');
    const read = done('read_about_aranea');
    const compared = done('ask_imaya_about_crowds');
    const ready = done('make_barrier_cubes');
    const kaelOnHisWay = done('ask_kael_to_go_ahead');
    const terms = done('hear_matriarchs_terms');
    const escaped = done('trigger_barrier_cubes');
    const pact = done('accept_memory_packet') || done('decline_memory_packet');
    return {
        'mol.aranea.showContact': examined && !met,
        'mol.aranea.showReading': met && !read,
        'mol.aranea.showImaya': read && !compared,
        'mol.aranea.showPreparations': compared && !ready,
        'mol.aranea.showCompany': ready && !kaelOnHisWay,
        'mol.aranea.showTerms': kaelOnHisWay && !terms,
        'mol.aranea.showEscape': terms && !escaped,
        'mol.aranea.showPacket': escaped && !pact,
        'mol.aranea.hasBarrierCubes': barrierCubes > 0,
    };
}

export function molAraneaRoute(state) {
    const facts = molAraneaFacts(state);
    const here = state.simulation?.people.player.location;
    if (facts['mol.aranea.showReading'] && here !== MOL_LOCATIONS.library) {
        return {id: 'book.mol.move.library', label: 'Look for accounts of the aranea in the library'};
    }
    if (facts['mol.aranea.showImaya'] && here !== MOL_LOCATIONS.house) {
        return {id: 'book.mol.move.house', label: 'Go home and ask Imaya about the pressure in crowds'};
    }
    if (facts['mol.aranea.showTerms'] && here !== MOL_LOCATIONS.sewer) {
        return {id: 'book.mol.move.sewer', label: 'Take the prepared cubes to the sewer hatch'};
    }
    return null;
}
