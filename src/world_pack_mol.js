// The Cyoria world pack (WA20 pilot, installed since P2). The pack data lives in
// packs/mol_cyoria.pack.js and is installed by book_world_mol_content.js (WAC8).
// This accessor returns a private copy for tools and tests.
import molPack from './packs/mol_cyoria.pack.js';

export const buildMolWorldPack = () => structuredClone(molPack);
