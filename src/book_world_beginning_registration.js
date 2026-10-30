// One composition registration for source-qualified typed book beginnings.
// Each book retains its own content owner and exact saved definition.
import {registerHpBeginnings} from './book_world_hp_content.js';
import {shadowSlaveApprentice} from './world_packs/book_shadow_slave_life.js';
import {shadowSlaveTrial} from './world_packs/book_shadow_slave_trial.js';
import {guAcademyLife} from './world_packs/book_gu_life.js';
import {shadowCompanyLife} from './world_packs/book_shadow_company_life.js';

export async function registerBookBeginnings(register, choices) {
    await registerHpBeginnings(register, choices);
    const d = await register(shadowSlaveApprentice);
    choices.register({packId: d.id, label: 'Shadow Slave · divergent Memory apprentice',
        arrival: 'Begin a divergent Awakened artisan life with rare acquired weave sight and replication training.',
        means: 'Your keepsake, coat, gloves, two shards and twelve essence. Study the pattern, fit your pieces, then bind and practice their paired ward with Iven at the work desk.'});
    const trial = await register(shadowSlaveTrial);
    choices.register({packId: trial.id, label: 'Shadow Slave · original Second Nightmare trial',
        arrival: 'Begin an original Awakened student life at a training hall, one trial from Ascended.',
        means: 'Four trial supplies and one healing salve. Prepare, cross into the Dream Realm, choose a steady or rushed route, then settle the trial or retreat.'});
    const gu = await register(guAcademyLife);
    choices.register({packId:gu.id,label:'Reverend Insanity · original Moonlight Gu novice',
        arrival:'Begin an original adult clan-sponsored novice life with an already-opened Rank-one aperture.',
        means:'Keeper Lin, one living Moonlight Gu, sixteen fresh petals and six primeval units. Refine the same Gu, prepare its daily care, and learn a close-target cutting exercise.'});
    const company=await register(shadowCompanyLife);
    choices.register({packId:company.id,label:'Shadow Slave · original Shadowbound company',arrival:'Begin an original Awakened life with an explicitly acquired Shadowbound fan-law binding and one already-owned shadow.',
        means:'An injured stored marsh-hound shadow, two gems and actual patrol supplies. Recovery and independent gem sleep feed a prepared two-person causeway patrol with Sera’s finite stipend.'});
}
