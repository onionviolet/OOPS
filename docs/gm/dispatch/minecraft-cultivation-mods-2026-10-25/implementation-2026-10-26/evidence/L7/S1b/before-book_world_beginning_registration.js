// One composition registration for source-qualified typed book beginnings.
// Each book retains its own content owner and exact saved definition.
import {registerHpBeginnings} from './book_world_hp_content.js';
import {shadowSlaveApprentice} from './world_packs/book_shadow_slave_life.js';

export async function registerBookBeginnings(register, choices) {
    await registerHpBeginnings(register, choices);
    const d = await register(shadowSlaveApprentice);
    choices.register({packId: d.id, label: 'Shadow Slave · divergent Memory apprentice',
        arrival: 'Confirm to begin an original Awakened artisan life in a waking-world workroom. This divergent character already acquired rare weave sight and trained simple replication; ordinary Awakened do not gain those means by choosing a job.',
        means: 'Your own study specimen, unfinished protective coat and gloves, two prepared Awakened shards, twelve local essence units and a supported work desk. Study a pattern, fit either actual carrier, then equip it through Inventory. Named items, person and numeric terms are original proposals.'});
}
