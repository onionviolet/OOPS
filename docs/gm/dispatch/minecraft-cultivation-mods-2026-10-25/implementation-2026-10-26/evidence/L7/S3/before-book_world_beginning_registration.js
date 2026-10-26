// One composition registration for source-qualified typed book beginnings.
// Each book retains its own content owner and exact saved definition.
import {registerHpBeginnings} from './book_world_hp_content.js';
import {shadowSlaveApprentice} from './world_packs/book_shadow_slave_life.js';
import {guAcademyLife} from './world_packs/book_gu_life.js';

export async function registerBookBeginnings(register, choices) {
    await registerHpBeginnings(register, choices);
    const d = await register(shadowSlaveApprentice);
    choices.register({packId: d.id, label: 'Shadow Slave · divergent Memory apprentice',
        arrival: 'Begin a divergent Awakened artisan life with rare acquired weave sight and replication training.',
        means: 'Your keepsake, coat, gloves, two shards and twelve essence. Study the pattern, fit your pieces, then bind and practice their paired ward with Iven at the work desk.'});
    const gu = await register(guAcademyLife);
    choices.register({packId:gu.id,label:'Reverend Insanity · original Moonlight Gu novice',
        arrival:'Begin an original adult clan-sponsored novice life with an already-opened Rank-one aperture.',
        means:'Keeper Lin, one living Moonlight Gu, sixteen fresh petals and six primeval units. Refine the same Gu, prepare its daily care, and learn a close-target cutting exercise.'});
}
