// One composition registration for source-qualified typed book beginnings.
// Each book retains its own content owner and exact saved definition.
import {registerHpBeginnings} from './book_world_hp_content.js';
import {registerDomain, domainRegistry} from './domain_registry.js';
import {packNative} from './world_pack_registry.js';
import {loadHpLeadCast,withHpLeadCast} from './book_world_hp_lead_pack.js';
import {registerHpLeadDomain} from './book_world_hp_lead_domain.js';
import {registerHpLifeHoldings} from './hp_life_holdings.js';
import {registerBookLifeHoldings} from './book_life_holdings.js';
import {shadowSlaveApprentice} from './world_packs/book_shadow_slave_life.js';
import {shadowSlaveTrial} from './world_packs/book_shadow_slave_trial.js';
import {guAcademyLife} from './world_packs/book_gu_life.js';
import {guKeeperLife} from './world_packs/book_gu_keeper.js';
import {shadowCompanyLife} from './world_packs/book_shadow_company_life.js';

export async function registerBookBeginnings(register, choices, hpPorts = null) {
    await registerHpBeginnings(register, choices);
    const lead = await register(withHpLeadCast(packNative('book.hp.lead'), await loadHpLeadCast()));
    // The domain registry is process-wide and rejects a repeated id, so a second call keeps the first registration.
    if (!domainRegistry.list().some(d => d.id === 'hp')) registerHpLeadDomain(registerDomain, hpPorts?.state ?? (() => null), hpPorts);
    if (hpPorts) { registerHpLifeHoldings(); registerBookLifeHoldings(); }
    choices.register({packId: lead.id, label: 'Harry Potter · the boy in the cupboard',
        arrival: 'Begin as a ten-year-old in your guardians\' household on the morning of a cousin\'s birthday. This is an opt-in lead life; the school and trade lives are unchanged.',
        means: 'No money, no wand and no method of your own. Your aunt and uncle decide the day; something in you sometimes acts on its own.'});
    const d = await register(shadowSlaveApprentice);
    choices.register({packId: d.id, label: 'Shadow Slave · divergent Memory apprentice',
        arrival: 'Begin a divergent Woken artisan life with rare acquired weave sight and replication training.',
        means: 'Your keepsake, coat, gloves, two shards and twelve essence. Study the pattern, fit your pieces, then bind and practice their paired ward with Iven at the work desk.'});
    const trial = await register(shadowSlaveTrial);
    choices.register({packId: trial.id, label: 'Shadow Slave · original Second Trial',
        arrival: 'Begin an original Woken student life at a training hall, one trial from Risen.',
        means: 'Four trial supplies and one healing salve. Prepare, cross into the Far Reach, choose a steady or rushed route, then settle the trial or retreat.'});
    const gu = await register(guAcademyLife);
    choices.register({packId:gu.id,label:'Reverend Insanity · original Moonlight Gu novice',
        arrival:'Begin an original adult clan-sponsored novice life with an already-opened Rank-one aperture.',
        means:'Keeper Lin, one living Moonlight Gu, sixteen fresh petals and six primeval units. Refine the same Gu, prepare its daily care, and learn a close-target cutting exercise.'});
    const keeper=await register(guKeeperLife);
    choices.register({packId:keeper.id,label:'Reverend Insanity · original Gu keeper, first year',
        arrival:'Begin an original adult clan-sponsored Gu keeper with an already-opened Rank-one aperture and a weekly stone stipend.',
        means:'Three primeval stones, eight essence, a free Moonlight Gu and two more Gu for sale. Feed each on its own schedule, take in only what you can pay for, and risk one refinement.'});
    const company=await register(shadowCompanyLife);
    choices.register({packId:company.id,label:'Shadow Slave · original Shadowbound company',arrival:'Begin an original Woken life with an explicitly acquired Shadowbound fan-law binding and one already-owned shadow.',
        means:'An injured stored marsh-hound shadow, two gems and actual patrol supplies. Recovery and independent gem sleep feed a prepared two-person causeway patrol with Sera’s finite stipend.'});
}
