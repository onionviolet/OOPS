// PL-H1 scripted-lead route: the public-command half of the Village harness. It talks to the
// elder like a player, then lets five world days pass through the bot's own stepper. It reads
// only the bot's clock; the beat resolver (src/beat_records.js) is applied by the caller.
import {leadBot} from '../lead_bot.mjs';

export const SEED = 20261027;
export const DATES = [2, 3];   // the line's beat dates (day_count)
const MIN_PER_DAY = 1440;

export async function runVillageLeadLine() {
    const bot = await leadBot(null, {seed: SEED, wallStart: Date.UTC(2026, 0, 1, 12)});
    try {
        await bot.click('.choice_dialogue');
        await bot.click('[data-dialogue="villageElder"]');
        await bot.click('[data-textline="hello"]');
        await bot.click('#center_mode_back');
        const minutes = [bot.minute()];
        // day_count d begins at clock minute d * 1440; step to the start of each beat date.
        for(const d of DATES) {await bot.step(d * MIN_PER_DAY - bot.minute()); minutes.push(bot.minute());}
        return {minutes, log: bot.log.map(({verb, target, cost}) => ({verb, target, cost})), bot};
    } catch(e) {bot.close(); throw e;}
}
