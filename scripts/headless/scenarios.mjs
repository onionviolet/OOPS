#!/usr/bin/env node
// Named save states for the floor checks every lane repeats, plus a boot-twice determinism check.
//   node scripts/headless/scenarios.mjs list
//   node scripts/headless/scenarios.mjs build <name> --out file.json        (never overwrites the library)
//   node scripts/headless/scenarios.mjs determinism <name> [--days 1] [--seed 1]
// A scenario is a committed fixture file or a recipe (a fresh hero advanced N days). Recipes are built on
// demand through the real stepper and cached under the OS temp folder, keyed by name and source stamp, so
// a code change rebuilds them. Callers get save text to boot a COPY from; the cache file is never handed
// out for writing. The game MCP exposes the same names as game_new({scenario}).
import {readFile, writeFile, mkdir, readdir, stat} from 'node:fs/promises';
import {join, resolve} from 'node:path';
import {tmpdir} from 'node:os';
import {createHash} from 'node:crypto';
import {boot, canonicalSave, diffSaves, ROOT} from './runner.mjs';
import {advanceGame} from './advance.mjs';

export const SCENARIOS = Object.freeze({
    'fresh': {summary: 'New hero, day 1, Village.', recipe: {days: 0}},
    'fresh-day3': {summary: 'New hero after three days of stepping.', recipe: {days: 3}},
    'fresh-week': {summary: 'New hero after a week of stepping.', recipe: {days: 7}},
    'village-craftsman': {summary: 'Three days in, old craftsman reachable (story access patched like village_route.progress); walks the village.interrupt_work request.', recipe: {days: 3, patch: 'craftsman'}},
    'village-workshop-unenrolled': {summary: 'DEV SEEDED craftsman access; native greeting completed, no local simulation enrolled. Open Notebook > People > Craftsman & workshop.', recipe: {days: 0, patch: 'craftsman', prepare: 'workshop'}},
    'village-rival': {summary: 'DEV SEEDED craftsman access; native crossing inspection, field membership and Mara meeting. Open Notebook > People > Road contest.', recipe: {days: 0, patch: 'craftsman', prepare: 'rival'}},
    'village-aged-chronic': {summary: 'DEV SEEDED: Village chronicle begun, then aged to 46 with stage 1 stiff joints and a 3-coin purse. Open Years & company: Treat on credit shows.', recipe: {days: 0, prepare: 'chronicle', finish: 'agedChronic'}},
    'village-standing': {summary: 'DEV SEEDED: fresh Village hero with Village standing 10 (character.reputation), so Mira and Sela agree to join a founded group (AT32 invite-and-stake walk).', recipe: {days: 0, finish: 'villageStanding'}},
    'lotm-klein-wanted': {summary: 'DEV SEEDED (needs private_packs/lotm-cast): Be Klein Moretti started through the panel, then the Tingen police hold him as wanted and the constables latch is set. Constables at the door opens.', recipe: {days: 0, prepare: 'klein', finish: 'kleinWanted'}},
    'lotm-kjw22a': {summary: 'EARNED PRIVATE: kjw22a endpoint, reached through native story actions. Needs the local cast pack and its private checkpoint; no progress is patched.', file: 'docs/research/novels/lord-of-mysteries/private/kj3af-ch70-2026-11-08/completed-checkpoint.json'},
    'lotm-kjw22b': {summary: 'EARNED PRIVATE: kjw22b endpoint, reached through native story actions. Uses the local cast pack and private checkpoint.', file: 'docs/research/novels/lord-of-mysteries/private/kj3ag-ch71-72-2026-11-08/completed-checkpoint.json'},
    'lotm-kjw23': {summary: 'EARNED PRIVATE: after the warehouse-yard encounter. Uses the local cast pack and private checkpoint.', file: 'docs/research/novels/lord-of-mysteries/private/kj3ah-ch73-2026-11-08/completed-checkpoint.json'},
    'lotm-kjw24': {summary: 'EARNED PRIVATE: after Klein’s next warehouse encounter. Uses the local cast pack and private checkpoint.', file: 'docs/research/novels/lord-of-mysteries/private/kj3ai-ch74-2026-11-08/completed-checkpoint.json'},
    'lotm-kjw25': {summary: 'EARNED PRIVATE: after Klein gets clear of the warehouse hazard. Uses the local cast pack and private checkpoint.', file: 'docs/research/novels/lord-of-mysteries/private/kj3aj-ch75-2026-11-08/completed-checkpoint.json'},
    'lotm-kjw26': {summary: 'EARNED PRIVATE: after Klein hands off the warehouse operation and takes the treatment request to the armory.', file: 'docs/research/novels/lord-of-mysteries/private/kj3ak-operation-close-2026-11-08/completed-checkpoint.json'},
    'lotm-kjw27': {summary: 'EARNED PRIVATE: after Klein reports the examination-room aftermath and is released to rest.', file: 'docs/research/novels/lord-of-mysteries/private/kj3al-aftermath-2026-11-08/completed-checkpoint.json'},
    'lotm-kjw28': {summary: 'EARNED PRIVATE: after Klein’s rest, the mentor’s reply and the Sunday invitation.', file: 'docs/research/novels/lord-of-mysteries/private/kj3am-family-letter-2026-11-08/completed-checkpoint.json'},
    'lotm-kjw29': {summary: 'EARNED PRIVATE: after Klein’s next office morning and the Deweyville Library visit.', file: 'docs/research/novels/lord-of-mysteries/private/kj3an-library-2026-11-08/completed-checkpoint.json'},
    'lotm-kjw30': {summary: 'EARNED PRIVATE: after Klein returns Bogda’s ring and settles the paid Divination Club reading.', file: 'docs/research/novels/lord-of-mysteries/private/kj3ao-consultation-2026-11-09/completed-checkpoint.json'},
    'lotm-kjw31': {summary: 'EARNED PRIVATE: after Klein carves both silver amulets and hears the Cathedral decision.', file: 'docs/research/novels/lord-of-mysteries/private/kj3ap-amulets-2026-11-09/completed-checkpoint.json'},
    'lotm-kjw32': {summary: 'EARNED PRIVATE: after the Wood house banquet, mirror rite and family departure.', file: 'docs/research/novels/lord-of-mysteries/private/kj3aq-birthday-2026-11-09/completed-checkpoint.json'},
    'lotm-kjw33': {summary: 'EARNED PRIVATE: after Klein’s first solo case, report and Monday nap.', file: 'docs/research/novels/lord-of-mysteries/private/kj3ar-deweyville-2026-11-09/completed-checkpoint.json'},
    'lotm-kjw34': {summary: 'EARNED PRIVATE: after Klein’s gathering, training and university inquiry.', file: 'docs/research/novels/lord-of-mysteries/private/kj3as-tarot-study-2026-11-09/completed-checkpoint.json'},
    'lotm-kjw35': {summary: 'EARNED PRIVATE: after Klein’s library pursuit, evidence search and interrupted rite.', file: 'docs/research/novels/lord-of-mysteries/private/kj3at-sirius-2026-11-09/completed-checkpoint.json'},
    'lotm-kjw36': {summary: 'EARNED PRIVATE: after Klein’s Chanis Gate watch and decision at Howes Street.', file: 'docs/research/novels/lord-of-mysteries/private/kj3au-chanis-watch-2026-11-09/completed-checkpoint.json'},
    'lotm-kjw37': {summary: 'EARNED PRIVATE: after Klein reports the contact and returns to work through the quiet fortnight.', file: 'docs/research/novels/lord-of-mysteries/private/kj3av-daxter-2026-11-09/completed-checkpoint.json'},
    'lotm-kjw38': {summary: 'EARNED PRIVATE: after Klein’s group investigation and dream reading at home.', file: 'docs/research/novels/lord-of-mysteries/private/kj3aw-first-group-case-2026-11-09/completed-checkpoint.json'},
    'lotm-kjw39': {summary: 'EARNED PRIVATE: after Klein follows his dream clue to the river lookout.', file: 'docs/research/novels/lord-of-mysteries/private/kj3ax-river-search-2026-11-09/completed-checkpoint.json'},
    'lotm-kjw40': {summary: 'EARNED PRIVATE: after Klein follows the signal and compares the cases at the altar.', file: 'docs/research/novels/lord-of-mysteries/private/kj3ay-signal-and-altar-2026-11-09/completed-checkpoint.json'},
    'lotm-kjw41': {summary: 'EARNED PRIVATE: after Klein’s follow-up and Swain’s market request.', file: 'docs/research/novels/lord-of-mysteries/private/kj3az-followthrough-2026-11-09/completed-checkpoint.json'},
    'lotm-kjw42': {summary: 'EARNED PRIVATE: after Klein and the others resolve the harbor emergency.', file: 'docs/research/novels/lord-of-mysteries/private/kj3ba-harbor-emergency-2026-11-09/completed-checkpoint.json'},
    'lotm-kjw43': {summary: 'EARNED PRIVATE: after Klein reaches Lamud Town and inspects the portrait (ch130-135).', file: 'docs/research/novels/lord-of-mysteries/private/kj3bb-lamud-portrait-2026-11-09/completed-checkpoint.json'},
    'lotm-kjw44': {summary: 'EARNED PRIVATE: after Klein hears the first-prayer contact and names the contact (ch136-138).', file: 'docs/research/novels/lord-of-mysteries/private/kj3bc-first-prayer-contact-2026-11-09/completed-checkpoint.json'},
    'lotm-kjw45': {summary: 'EARNED PRIVATE: after Klein takes the artifact and works the shift (ch139-141).', file: 'docs/research/novels/lord-of-mysteries/private/kj3bd-artifact-shift-2026-11-09/completed-checkpoint.json'},
    'lotm-kjw46': {summary: 'EARNED PRIVATE: after Klein’s Daxter and Tarot episode (ch142-145).', file: 'docs/research/novels/lord-of-mysteries/private/kj3be-daxter-and-tarot-2026-11-09/completed-checkpoint.json'},
    'lotm-kjw47': {summary: 'EARNED PRIVATE: after Klein’s red-chimney search, Daly’s messenger and the Azik agreement (ch146-151).', file: 'docs/research/novels/lord-of-mysteries/private/kj3bf-red-chimney-azik-and-daly-2026-11-09/completed-checkpoint.json'},
    'lotm-kjw48': {summary: 'EARNED PRIVATE: Klein KJ3BG, v1 ch152-157, fog test, special application, Sun summoned', file: 'docs/research/novels/lord-of-mysteries/private/kj3bg-fog-test-and-application-2026-11-09/completed-checkpoint.json'},
    'lotm-kjw49': {summary: 'EARNED PRIVATE: Klein KJ3BH, v1 ch158-163, Morse Town flaring charms, Old Neil\u2019s door', file: 'docs/research/novels/lord-of-mysteries/private/kj3bh-morse-town-flaring-charms-and-neils-door-2026-11-09/completed-checkpoint.json'},
    'hp-w6': {summary: 'EARNED PRIVATE: the lead returns to Hogwarts after Friday tea. Uses the local W6 cast and private checkpoint.', file: 'docs/research/novels/harry-potter/private/hp-w6-preparation-2026-11-08/browser-delivery/completed-checkpoint.json'},
    'hp-w7-flying': {summary: 'EARNED PRIVATE: after the first flying lesson. Uses the local school cast, its flight extension and the private checkpoint.', file: 'docs/research/novels/harry-potter/private/hp-w7-flying-2026-11-08/browser-paced-final/completed-checkpoint.json'},
    'hp-w7-duel': {summary: 'EARNED PRIVATE: after the midnight duel outing. Uses the school cast, both local extensions and the private checkpoint.', file: 'docs/research/novels/harry-potter/private/hp-w7-duel-2026-11-09/browser-final/completed-checkpoint.json'},
    'hp-w7-halloween': {summary: 'EARNED PRIVATE: after Halloween and the end of W7. Uses the local school cast and extensions.', file: 'docs/research/novels/harry-potter/private/hp-w7-halloween-2026-11-09/browser-final-rebuilt/completed-checkpoint.json'},
    'hp-w8-quidditch': {summary: 'EARNED PRIVATE: after Harry’s first Quidditch match and the conversation that follows.', file: 'docs/research/novels/harry-potter/private/hp-w8-quidditch-2026-11-09/browser-verified/completed-checkpoint.json'},
    'hp-w8-mirror': {summary: 'EARNED PRIVATE: after Harry’s Mirror of Erised sequence.', file: 'docs/research/novels/harry-potter/private/hp-w8-mirror-2026-11-09/browser-verified/completed-checkpoint.json'},
    'hp-w9-flamel': {summary: 'EARNED PRIVATE: after Harry and friends put together the Flamel clue.', file: 'docs/research/novels/harry-potter/private/hp-w9-flamel-2026-11-09/browser-final/completed-checkpoint.json'},
    'hp-w10-norbert': {summary: 'EARNED PRIVATE: after the second match and Norbert’s handoff. Uses the local school cast and extensions.', file: 'docs/research/novels/harry-potter/private/hp-w10-norbert-2026-11-09/browser-resumed/completed-checkpoint.json'},
    'hp-w11-book1-complete': {summary: 'EARNED PRIVATE: after Harry finishes his first year and returns to King’s Cross.', file: 'docs/research/novels/harry-potter/private/hp-w11-book1-2026-11-09/browser-final/completed-checkpoint.json'},
    'hp-w11-farewell': {summary: 'EARNED PRIVATE: after the final exchange with Ron and Hermione at King’s Cross.', file: 'docs/research/novels/harry-potter/private/hp-w11-farewell-2026-11-09/browser-verified/completed-checkpoint.json'},
    'ri-fang-yuan-awakening': {summary: 'EARNED PRIVATE: after Fang Yuan’s first academy exercise. Uses the local private checkpoint.', file: 'docs/research/novels/reverend-insanity/private/fang-yuan-awakening-evidence/completed-checkpoint.json'},
    'ri-fang-yuan-first-gu': {summary: 'EARNED PRIVATE: after Fang Yuan receives his first Gu. Uses the local private checkpoint.', file: 'docs/research/novels/reverend-insanity/private/fang-yuan-selection-evidence/completed-checkpoint.json'},
    'ri-fang-yuan-first-refinement': {summary: 'EARNED PRIVATE: after Fang Yuan’s first resisted refinement attempt and essence recovery.', file: 'docs/research/novels/reverend-insanity/private/fang-yuan-refinement-evidence/completed-checkpoint.json'},
    'ri-fang-yuan-academy-first-refinement': {summary: 'EARNED PRIVATE: after Fang Yuan’s first successful refinement in this life and his academy check.', file: 'docs/research/novels/reverend-insanity/private/fang-yuan-vital-evidence/completed-checkpoint.json'},
    'ri-fang-yuan-moonblade-homework': {summary: 'EARNED PRIVATE: after the academy prize and Fang Yuan’s first Moonblade practice.', file: 'docs/research/novels/reverend-insanity/private/fang-yuan-moonblade-evidence/completed-checkpoint.json'},
    'ri-fang-yuan-assessment-lineup': {summary: 'EARNED PRIVATE: after Fang Yuan’s dorm move, upkeep and preparation for assessment.', file: 'docs/research/novels/reverend-insanity/private/fang-yuan-dorm-evidence/completed-checkpoint.json'},
    'ri-fang-yuan-mixed-primeval-sea': {summary: 'EARNED PRIVATE: after Fang Yuan’s assessment, gate collection and first Liquor Worm conversion.', file: 'docs/research/novels/reverend-insanity/private/fang-yuan-assessment-evidence/completed-checkpoint.json'},
    'ri-fang-yuan-dormitory-dawn': {summary: 'EARNED PRIVATE: after Fang Yuan’s academy confrontation and the next dormitory dawn.', file: 'docs/research/novels/reverend-insanity/private/fang-yuan-confrontation-evidence/completed-checkpoint.json'},
    'ri-fang-yuan-caravan-shortlist': {summary: 'EARNED PRIVATE: after Fang Yuan shortlists six stones at the caravan.', file: 'docs/research/novels/reverend-insanity/private/fang-yuan-clan-response-evidence/completed-checkpoint.json'},
    'ri-fang-yuan-image-wall': {summary: 'EARNED PRIVATE: after Fang Yuan’s caravan settlement and return to the old crevice.', file: 'docs/research/novels/reverend-insanity/private/fang-yuan-caravan-evidence/completed-checkpoint.json'},
    'ri-fang-yuan-middle-stage': {summary: 'EARNED PRIVATE: after Fang Yuan’s first middle-stage breakthrough.', file: 'docs/research/novels/reverend-insanity/private/fang-yuan-inheritance-evidence/completed-checkpoint.json'},
    'ri-fang-yuan-class-chair': {summary: 'EARNED PRIVATE: after Fang Yuan earns the academy class chair and priority for a second Gu.', file: 'docs/research/novels/reverend-insanity/private/fang-yuan-moonveil-evidence/completed-checkpoint.json'},
    'ri-fang-yuan-hearing': {summary: 'EARNED PRIVATE: after Fang Yuan leaves the academy hearing.', file: 'docs/research/novels/reverend-insanity/private/fang-yuan-hearing-evidence/completed-checkpoint.json'},
    'ri-fang-yuan-second-gu': {summary: 'EARNED PRIVATE: after Fang Yuan chooses and refines his second academy Gu.', file: 'docs/research/novels/reverend-insanity/private/fang-yuan-second-gu-evidence/completed-checkpoint.json'},
    'ri-fang-yuan-early-duel': {summary: 'EARNED PRIVATE: after Fang Yuan’s hunt, Gu feeding and early duel.', file: 'docs/research/novels/reverend-insanity/private/fang-yuan-early-duel-evidence/completed-checkpoint.json'},
    'ri-fang-yuan-hunt-followthrough': {summary: 'EARNED PRIVATE: after Fang Yuan’s exam hunt and its retained tally.', file: 'docs/research/novels/reverend-insanity/private/fang-yuan-hunt-followthrough-evidence/completed-checkpoint.json'},
    'ri-fang-yuan-exam-result': {summary: 'EARNED PRIVATE: after Fang Yuan settles the exam result and uses the newly acquired defense.', file: 'docs/research/novels/reverend-insanity/private/fang-yuan-exam-result-evidence/completed-checkpoint.json'},
    'ri-fang-yuan-year-end': {summary: 'EARNED PRIVATE: after Fang Yuan’s year-end exam and open clan offer.', file: 'docs/research/novels/reverend-insanity/private/fang-yuan-year-end-evidence/completed-checkpoint.json'},
    'ri-fang-yuan-rank-two': {summary: 'EARNED PRIVATE: after Fang Yuan’s Rank Two breakthrough and departure from the hamlet.', file: 'docs/research/novels/reverend-insanity/private/fang-yuan-rank-two-evidence/completed-checkpoint.json'},
    'ri-fang-yuan-estate-claim': {summary: 'EARNED PRIVATE: after Fang Yuan accepts the family estate assignment.', file: 'docs/research/novels/reverend-insanity/private/fang-yuan-estate-claim-evidence/completed-checkpoint.json'},
    'ri-fang-yuan-estate-handover': {summary: 'EARNED PRIVATE: after Fang Yuan receives the estate and checks its tavern and rents.', file: 'docs/research/novels/reverend-insanity/private/fang-yuan-estate-handover-evidence/completed-checkpoint.json'},
    'ri-fang-yuan-qing-shu-meeting': {summary: 'EARNED PRIVATE: after Fang Yuan ends the tavern meeting with Qing Shu.', file: 'docs/research/novels/reverend-insanity/private/fang-yuan-qing-shu-meeting-evidence/completed-checkpoint.json'},
    'ri-fang-yuan-moonglow': {summary: 'EARNED PRIVATE: after Fang Yuan’s fusion and the following tavern confrontation.', file: 'docs/research/novels/reverend-insanity/private/fang-yuan-moonglow-evidence/completed-checkpoint.json'},
    'ri-fang-yuan-relic-market': {summary: 'EARNED PRIVATE: after Fang Yuan settles the relic market and estate deed transfer.', file: 'docs/research/novels/reverend-insanity/private/fang-yuan-relic-market-evidence/completed-checkpoint.json'},
    'ri-fang-yuan-stone-forest': {summary: 'EARNED PRIVATE: after Fang Yuan returns from the stone forest and uses the Relic Gu.', file: 'docs/research/novels/reverend-insanity/private/fang-yuan-stone-forest-evidence/completed-checkpoint.json'},
    'ri-fang-yuan-river-toad': {summary: 'EARNED PRIVATE: after Fang Yuan’s river work and the resulting fusion.', file: 'docs/research/novels/reverend-insanity/private/fang-yuan-river-toad-evidence/completed-checkpoint.json'},
    'ri-fang-yuan-wolf-front': {summary: 'EARNED PRIVATE: after Fang Yuan’s work at the wolf front and his academy encounter.', file: 'docs/research/novels/reverend-insanity/private/fang-yuan-wolf-front-evidence/completed-checkpoint.json'},
    'ri-fang-yuan-alliance-slope': {summary: 'EARNED PRIVATE: after Fang Yuan’s concession at the alliance gathering.', file: 'docs/research/novels/reverend-insanity/private/fang-yuan-alliance-slope-evidence/completed-checkpoint.json'},
    'ri-fang-yuan-ear-grass': {summary: 'EARNED PRIVATE: after Fang Yuan adapts to Ear Grass and responds to the wolf wave.', file: 'docs/research/novels/reverend-insanity/private/fang-yuan-ear-grass-evidence/completed-checkpoint.json'},
    'ri-fang-yuan-ice-soul': {summary: 'EARNED PRIVATE: during Fang Yuan’s pursuit and the confrontation that follows.', file: 'docs/research/novels/reverend-insanity/private/fang-yuan-ice-soul-evidence/completed-checkpoint.json'},
    'ri-fang-yuan-ice-crystal': {summary: 'EARNED PRIVATE: after Fang Yuan refines the recovered Gu and withdraws from the confrontation.', file: 'docs/research/novels/reverend-insanity/private/fang-yuan-ice-crystal-evidence/completed-checkpoint.json'},
    'ri-fang-yuan-wood-charm': {summary: 'EARNED PRIVATE: after Fang Yuan’s Plunder custody, merit report and upper-stage cultivation (ch141-145).', file: 'docs/research/novels/reverend-insanity/private/fang-yuan-wood-charm-evidence/completed-checkpoint.json'},
    'ri-fang-yuan-wall-night': {summary: 'EARNED PRIVATE: after Fang Yuan’s leaf price, Xiong bargain, clan notice and first night on the wall (ch146-149).', file: 'docs/research/novels/reverend-insanity/private/fang-yuan-wall-night-evidence/completed-checkpoint.json'},
    'ri-fang-yuan-burial-gu': {summary: 'EARNED PRIVATE: after Fang Yuan breaks through to Rank Three with the Man-beast Life Burial Gu (ch150-152).', file: 'docs/research/novels/reverend-insanity/private/fang-yuan-burial-gu-evidence/completed-checkpoint.json'},
    'ri-fang-yuan-elder-hall': {summary: 'EARNED PRIVATE: after Fang Yuan is confirmed an elder, borrows from Chi Lian and refines Sky Canopy Gu (ch153-155).', file: 'docs/research/novels/reverend-insanity/private/fang-yuan-elder-hall-evidence/completed-checkpoint.json'},
    'ri-fang-yuan-secret-room': {summary: 'EARNED PRIVATE: after Fang Yuan reads the clan recipes, trades the vitality grass for a Prize Token and visits his uncle (ch156-158).', file: 'docs/research/novels/reverend-insanity/private/fang-yuan-secret-room-evidence/completed-checkpoint.json'},
    'ri-fang-yuan-tusita-flower': {summary: 'EARNED PRIVATE: after Fang Yuan refines Blood Moon Gu, cleanses his sea and takes a tusita flower storage Gu (ch159-161).', file: 'docs/research/novels/reverend-insanity/private/fang-yuan-tusita-flower-evidence/completed-checkpoint.json'},
    'ri-fang-yuan-thunder-crown': {summary: 'EARNED PRIVATE: after Fang Yuan takes the centipede, watches the wolf tide break and fights the Bai ambush (ch162-166).', file: 'docs/research/novels/reverend-insanity/private/fang-yuan-thunder-crown-evidence/completed-checkpoint.json'},
    'ri-fang-yuan-lycan': {summary: 'EARNED PRIVATE: after Fang Yuan survives the lightning lycan, parts from Bai Ning Bing and sits at the investigator’s banquet (ch167-171).', file: 'docs/research/novels/reverend-insanity/private/fang-yuan-lycan-evidence/completed-checkpoint.json'},
    'ri-fang-yuan-white-jade': {summary: 'EARNED PRIVATE: after Fang Yuan refines White Jade Gu and returns with the hall’s wine.', file: 'docs/research/novels/reverend-insanity/private/fang-yuan-white-jade-evidence/completed-checkpoint.json'},
    'mol-zorian-xvim': {summary: 'EARNED PRIVATE: after Zorian’s first Friday practice with Xvim. Uses the local private checkpoint.', file: 'work/mol-xvim-friday-final-2026-11-08/after-xvim.save.json'},
    'mol-zorian-haslush': {summary: 'EARNED PRIVATE: after Zorian’s first lesson with Haslush. Uses the local private checkpoint.', file: 'work/mol-haslush-monday-2026-11-08/after-haslush.save.json'},
    'mol-zorian-kael': {summary: 'EARNED PRIVATE: after Zorian’s next day in Cyoria and Kael’s assessment. Uses the local private checkpoint.', file: 'work/mol-arc-one-c16-2026-11-08/after-kael-examination.save.json'},
    'mol-zorian-aranea': {summary: 'EARNED PRIVATE: after the chapter 18 expedition and return. Uses the local private checkpoint.', file: 'work/mol-arc-one-c18-2026-11-08/after-aranea-packet.save.json'},
    'mol-zorian-cloud': {summary: 'EARNED PRIVATE: after the chapter 19 coached sensing exercise. Uses the local private checkpoint.', file: 'work/mol-arc-one-c19-2026-11-08/after-xvim-cloud.save.json'},
    'mol-zorian-ward-reader': {summary: 'EARNED PRIVATE: after Zorian’s festival rewind and watch reading.', file: 'work/mol-arc-one-closure-2026-11-09/watch/after-ward-reader.save.json'},
    'mol-zorian-arc-one-end': {summary: 'EARNED PRIVATE: at the printed end of Zorian’s first arc, before the next awakening.', file: 'work/mol-arc-one-closure-2026-11-09/finale/end-of-arc-one.save.json'},
    'perf-fresh': {summary: 'Committed perf fixture: fresh life.', file: 'tests/fixtures/perf/fresh.json'},
    'perf-mid': {summary: 'Committed perf fixture: mid-game life.', file: 'tests/fixtures/perf/mid.json'},
    'perf-crowded': {summary: 'Committed perf fixture: crowded life (many people and jobs).', file: 'tests/fixtures/perf/crowded.json'},
});
// A recipe may patch the stepped save for story access a floor check needs without hours of combat; each patch is data a
// route script already uses (default: none; dial: add a named patch per check; reason: keep the hero otherwise untouched).
const PATCHES = {
    craftsman: save => {const out = structuredClone(save); out.availabilities.dialogue.oldCraftsman = 1; return out;},
};
// Applied after `prepare`. DEV SEEDED stand-in for 28 years of play: the begun chronicle's starting age moves to 46 (the calendar and clock are
// untouched, so the chronicle validators still agree), the body slice holds stage 1 stiff joints for that life (progress 5 of step 4, diagnosed),
// and the purse is 3 coins, below the 16-coin course, so the healer's credit button shows. The healer debt itself is never written.
// DEV SEEDED stand-in for a beaten collector and days of notoriety: one known act of weight 6 against the Tingen police (wanted starts at 4; it decays
// linearly over 28 days, so about 21 days stay at wanted) and the constables slice's own latch, which the police's decision would set on the next quote.
const FINISH = {
    kleinWanted: save => {
        const out = structuredClone(save), at = out.expansion.clock;
        if(!out.expansion.lotm) throw new Error('kleinWanted needs a started Tingen life.');
        out.heat = {family: 'heat@1', acts: [{id: 'dev-seed:wanted', authority: 'tingen_police', weight: 6, age: 0, at, witness: 'dev seed'}], live: {tingen_police: true}, past: {}, marks: {}, fines: {}};
        out.constables = {family: 'constables@1', handled: [], lines: [], latch: {at}, bounty: null, hooks: {}, sentence: null, arrests: 0, door: null};
        return out;
    },
    // DEV SEEDED stand-in for weeks of Village work: saved reputation total 10 (Mira joins at 6, Sela at 10; Orin and Bram stay out). Purse and story untouched.
    villageStanding: save => {
        const out = structuredClone(save);
        out.character.reputation = {...out.character.reputation, Village: 10};
        return out;
    },
    agedChronic: save => {
        const out = structuredClone(save), c = out.expansion.chronicle, age = 46;
        if(!c) throw new Error('agedChronic needs a begun chronicle.');
        c.life.initialAge = age;
        out.aging_contact = {...out.aging_contact, lifeKey: c.enrolledAt, lastAge: age + (c.lastClock - c.enrolledAt) / (360 * 24 * 60),
            conditions: {joints: {progress: 5, relief: 0, stance: 'ignore', treatedUntil: 0, diagnosed: true}}};
        out.character.money = 3;
        return out;
    },
};
// Only story access bypasses the elder's combat chain. Introductions, enrollment,
// membership, pursuit and their costs are produced by the ordinary UI commands.
async function prepareVillage(game, kind) {
    if(kind === 'klein') { // the developer start: pick Be Klein Moretti, then start the independent life (the page reloads; the runner follows)
        await game.fill('#workspace_navigation select[aria-label="Other known panels"]', 'lotm');
        await game.click('[data-lotm="pick_be"]');
        await game.click('[data-lotm="enroll_be"]');
        await game.step(1);
        return;
    }
    if(kind === 'chronicle') { // elder met, then the People notebook's own Begin chronicle button
        await game.clickText(/village elder\s*Village neighbor$/); // display name leads (NMR1), role stays
        await game.click('[data-focus-action="talk:villageElder"]');
        await game.click('[data-textline="hello"]');
        await game.click('#center_mode_back');
        await game.step(1);
        await game.fill('#workspace_navigation select[aria-label="Other known panels"]', 'notebook');
        await game.click('#notebook_tab_people');
        await game.click('#chronicle_panel > summary');
        await game.click('[data-chronicle="begin-open"]');
        return;
    }
    await game.clickText(/village elder\s*Village neighbor$/); // display name leads (NMR1), role stays
    await game.click('[data-focus-action="talk:villageElder"]');
    await game.click('[data-textline="hello"]');
    await game.click('#center_mode_back');
    await game.clickText(/old craftsman\s*Village neighbor$/);
    await game.click('[data-focus-action="talk:oldCraftsman"]');
    await game.click('[data-textline="hello"]');
    await game.click('#center_mode_back');
    await game.step(1); // Refresh witnessed people and discover the Notebook.
    if(kind === 'workshop') return;
    if(kind !== 'rival') throw new Error(`Unknown Village preparation ${kind}.`);
    await game.fill('#workspace_navigation select[aria-label="Other known panels"]', 'notebook');
    await game.click('#notebook_tab_here');
    await game.click('#expedition_panel > summary');
    await game.click('[data-expedition-action="frontier.inspect"]');
    await game.step(3);
    await game.click('#field_panel > summary');
    await game.click('[data-field-command="field.begin"]');
    await game.click('[data-field-command="field.join_survey"]');
    await game.step(2);
    await game.click('#notebook_tab_people');
    await game.click('#frontier_campaign_panel > summary');
    await game.click('[data-campaign="rival.begin"]');
    await game.step(3);
}
export const CACHE_DIR = join(tmpdir(), 'yairpg-scenarios');

async function sourceStamp() {
    let newest = 0, count = 0;
    for(const dir of ['src', 'scripts/headless']) for(const f of await readdir(join(ROOT, dir))) {
        if(!f.endsWith('.js') && !f.endsWith('.mjs')) continue;
        newest = Math.max(newest, (await stat(join(ROOT, dir, f))).mtimeMs); count++;
    }
    return createHash('sha256').update(`${Math.floor(newest)}:${count}`).digest('hex').slice(0, 10);
}

/** Save text for a scenario (null = brand new hero). Recipes are built once per source stamp. */
export async function scenarioSave(name, {seed = 1} = {}) {
    const def = SCENARIOS[name];
    if(!def) throw new Error(`Unknown scenario ${name}. Known: ${Object.keys(SCENARIOS).join(', ')}.`);
    if(def.file) return readFile(join(ROOT, def.file), 'utf8');
    if(!def.recipe.days && !def.recipe.patch && !def.recipe.prepare && !def.recipe.finish) return null;
    const finish = def.recipe.finish ? FINISH[def.recipe.finish] : null;
    if(def.recipe.finish && !finish) throw new Error(`Unknown scenario finish ${def.recipe.finish}.`);
    const parse = v => typeof v === 'string' ? JSON.parse(v) : v;
    const cached = join(CACHE_DIR, `${name}-s${seed}-${await sourceStamp()}.json`);
    try {return await readFile(cached, 'utf8');} catch {/* build below */}
    const game = await boot(null, {seed});
    let text;
    try {
        await advanceGame(game, {days: def.recipe.days});
        const snap = game.snapshot(), patch = def.recipe.patch ? PATCHES[def.recipe.patch] : null;
        if(def.recipe.patch && !patch) throw new Error(`Unknown scenario patch ${def.recipe.patch}.`);
        const save = patch ? patch(typeof snap === 'string' ? JSON.parse(snap) : snap) : snap;
        if(def.recipe.prepare) {
            await game.load(save);
            await prepareVillage(game, def.recipe.prepare);
            const done = game.snapshot();
            text = JSON.stringify(finish ? finish(parse(done)) : done);
        } else text = JSON.stringify(finish ? finish(parse(save)) : save); // a finish applies with or without a prepare step
    }
    finally {game.close();}
    await mkdir(CACHE_DIR, {recursive: true});
    await writeFile(cached, text);
    return text;
}

/** Boot the same scenario twice with the same seed, advance both, compare canonical saves. */
export async function determinismCheck(name, {days = 1, seed = 1} = {}) {
    const results = [];
    for(let i = 0; i < 2; i++) {
        const game = await boot(await scenarioSave(name, {seed}), {seed});
        try {await advanceGame(game, {days}); results.push(canonicalSave(game.snapshot()));}
        finally {game.close();}
    }
    const diffs = diffSaves(results[0], results[1]);
    return {scenario: name, days, seed, identical: results[0] === results[1], hash: createHash('sha256').update(results[0]).digest('hex').slice(0, 16), diffs};
}

if(import.meta.url === `file://${process.argv[1]}`) {
    const [cmd, name, ...rest] = process.argv.slice(2);
    const opt = Object.fromEntries(rest.reduce((a, v, i) => v.startsWith('--') ? [...a, [v.slice(2), rest[i + 1]]] : a, []));
    let line;
    if(cmd === 'list') line = Object.entries(SCENARIOS).map(([n, d]) => `${n}\t${d.summary}`).join('\n');
    else if(cmd === 'build') {
        if(!opt.out) throw new Error('--out <file> is required.');
        const text = await scenarioSave(name, {seed: Number(opt.seed ?? 1)});
        if(text == null) throw new Error(`${name} is a brand-new hero; boot it with boot(null).`);
        await writeFile(resolve(opt.out), text);
        line = JSON.stringify({scenario: name, out: opt.out, bytes: text.length});
    } else if(cmd === 'determinism') {
        const r = await determinismCheck(name, {days: Number(opt.days ?? 1), seed: Number(opt.seed ?? 1)});
        line = JSON.stringify(r);
        process.exitCode = r.identical ? 0 : 1;
    } else throw new Error('Use list, build or determinism.');
    console.log(line);
}
