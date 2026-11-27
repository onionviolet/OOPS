// Atlas links to the active design, code, replay and proof by their existing IDs and paths.
import {fileURLToPath} from 'node:url';
import {playStatus} from './play-status.mjs';
import {readPinnedPlayReceipt} from './pinned-play-receipt.mjs';

const watchcraftBuild='c62ebdc1b9e8139897794f5d2bf475e7d5d12a09c4297ab64af4fe652b20ac25';
export const watchcraftReceiptSpec={
    path:'docs/audits/WATCHCRAFT_HANDOFF_REPLAY_2026-11-24.md',
    fingerprint:'91805f9a287e44b379ebd3815c9790988f9c8d2ad31d68ece6b8c6251df47bf7',
    format:'text',life:'Default Village life',action:'Complete the skilled patrol and follow the well lead',
    playedBuild:text=>[watchcraftBuild,'default Village life','first 60-coin round, follow-up'].every(word=>text.includes(word))&&watchcraftBuild,
};
const watchcraftReceipt=readPinnedPlayReceipt(fileURLToPath(new URL('../../',import.meta.url)),watchcraftReceiptSpec);
export const implementation = [{
    id: 'village-watchcraft-ready',
    title: 'Watchcraft',
    ...playStatus({receipt:watchcraftReceipt,gap:'The earned skilled patrol and well follow-up need a matching browser receipt.'}),
    world: 'The Village',
    worldView: 'world/village/places',
    outcome: 'Practice sector scanning, earn more on patrol, and decide what to do with the observation in Tessa’s report.',
    verified: 'The first skilled patrol pays 60 coins instead of 50 and points to a five-minute search at the well.',
    next: 'From the same evening, take the patrol or spend the time elsewhere. Revisit after reload and see what each route gives you a reason to do tomorrow.',
    scenario: 'Two patrols completed, both kits returned, and sector scanning rehearsed 5/5. Your first skilled round is available under Find work.',
    references: {
        design: {label: 'Vision and next-day playtest', path: 'docs/reviews/OOPS_DESIGN_DIVERGENCE_2026-11-24.md'},
        owner: {label: 'Village career code', path: 'src/village_career.js'},
        proof: {label: 'Watchcraft browser receipt', path: watchcraftReceiptSpec.path},
    },
}];
