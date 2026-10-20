// One import point for the retained book-world simulation definitions, so the
// simulation registry names a single book module instead of one per world.
// It re-exports only; each world file stays the sole owner of its own data.
export {paradiseDefinitions,paradiseSources} from './book_world_paradise_content.js';
export {molDefinitions,molSources} from './book_world_mol_content.js';
export {lotmDefinitions,lotmSources} from './book_world_lotm_content.js';
