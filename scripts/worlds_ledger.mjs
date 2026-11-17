#!/usr/bin/env node
// PWC24: one generated ledger of worlds, docs/coverage/worlds.jsonl. One row per world, one cell per corpus.
//   node scripts/worlds_ledger.mjs           write docs/coverage/worlds.jsonl
//   node scripts/worlds_ledger.mjs --check   fail when the committed file is not what this builds
// No model calls and no reads outside tracked files: private sources (the deep dives under
// docs/research/novels, the wiki dumps under ~/.codex) are recorded as paths the registry below names,
// so the output is the same on every checkout. A cell is {ledger: name, ...counts}, {missing: source} or {none: reason}.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {countLedger, readLedgers, COVERAGE_DIR} from './coverage_report.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const WORLDS_FILE = `${COVERAGE_DIR}/worlds.jsonl`;
export const CORPORA = ['powers', 'artifacts', 'potions_and_recipes', 'materials', 'creatures', 'places', 'institutions', 'people', 'jobs_and_roles', 'rules'];
const WIKI = slug => `~/.codex/research/wikis/${slug}.fandom.com/dump`;
const NOVELS = 'docs/research/novels';
const WD = 'docs/worlds';
const SL = 'docs/research/SOURCE_LIBRARY_CATALOGUE.md'; // held in the Source Library with no per-book folder

// ---- The registry. Edit this, then rerun the builder. ----
// library: entry text(s) as the first column of a LIBRARY_INDEX table row (or a prefix of it); wiki: dump slug;
// deep: private deep dive path; docs: tracked docs (institutions: the INSTITUTIONS_ROLES doc); text: private chapter or capture folder;
// claims: paid reader run ids beyond those the ledgers cite; ledgers: corpus -> ledger names; none: corpus -> reason.
const W = (id, name, kind, o = {}) => ({id, name, kind, library: [], claims: [], docs: {}, ledgers: {}, none: {}, ...o});
const inst = f => ({institutions: `${WD}/${f}`});
const NONE_DUMP = {powers: 'no wiki dump on disk', artifacts: 'no wiki dump on disk', potions_and_recipes: 'no wiki dump on disk', materials: 'no wiki dump on disk', creatures: 'no wiki dump on disk', places: 'no wiki dump on disk', institutions: 'no wiki dump on disk', people: 'no wiki dump on disk', jobs_and_roles: 'no wiki dump on disk', rules: 'no wiki dump on disk'};
export const REGISTRY = [
    // Prime books and the batch-registered hero works
    W('lotm', 'Lord of the Mysteries', 'book', {library: ['Lord of the Mysteries 诡秘之主', 'Lord of the Mysteries, English'], wiki: 'lordofthemysteries', deep: `${NOVELS}/lord-of-mysteries/PATHWAYS_DEEP_DIVE_2026-10-10.md`, text: `${NOVELS}/lord-of-mysteries`, docs: inst('LORD_OF_THE_MYSTERIES_INSTITUTIONS_ROLES_AND_SUBTLE_DETAILS_2026-10-23.md'), ledgers: {potions_and_recipes: ['lotm_potions'], artifacts: ['lotm_artifacts']}}),
    W('circle-of-inevitability', 'Circle of Inevitability', 'book', {library: ['Circle of Inevitability, "Lord of Mysteries 2"'], text: `${NOVELS}/circle-of-inevitability`, docs: inst('CIRCLE_OF_INEVITABILITY_INSTITUTIONS_ROLES_AND_SUBTLE_DETAILS_2026-10-23.md'), ledgers: {powers: ['circle_of_inevitability_powers']}}),
    W('shadow-slave', 'Shadow Slave', 'book', {library: ['Shadow Slave (Guiltythree)'], deep: `${NOVELS}/shadow-slave/SYSTEMS_DEEP_DIVE_2026-10-10.md`, text: `${NOVELS}/shadow-slave`, docs: inst('SHADOW_SLAVE_INSTITUTIONS_ROLES_AND_SUBTLE_DETAILS_2026-10-23.md'), ledgers: {powers: ['shadow_slave_powers']}}),
    W('mother-of-learning', 'Mother of Learning', 'book', {library: ['Mother of Learning (nobody103)'], deep: `${NOVELS}/mother-of-learning/SYSTEMS_DEEP_DIVE_2026-10-10.md`, text: `${NOVELS}/mother-of-learning`, docs: inst('MOTHER_OF_LEARNING_INSTITUTIONS_ROLES_AND_SUBTLE_DETAILS_2026-10-23.md'), ledgers: {powers: ['mother_of_learning_powers']}}),
    W('harry-potter', 'Harry Potter', 'book', {library: ['Harry Potter 1-7 (Rowling)'], wiki: 'harrypotter', text: `${NOVELS}/harry-potter`, docs: inst('HARRY_POTTER_INSTITUTIONS_ROLES_AND_SUBTLE_DETAILS_2026-10-23.md'), ledgers: {powers: ['hp_spells'], potions_and_recipes: ['hp_potions'], materials: ['hp_ingredients'], artifacts: ['hp_objects']}}),
    W('soldiers-life', "A Soldier's Life", 'book', {library: ["A Soldier's Life (Always RollsAOne"], text: `${NOVELS}/soldiers-life`, docs: inst('A_SOLDIERS_LIFE_INSTITUTIONS_ROLES_AND_SUBTLE_DETAILS_2026-10-23.md')}),
    W('worm', 'Worm', 'book', {library: ['Worm (John McCrae)'], deep: `${NOVELS}/worm/DEEP_DIVE_2026-10-24.md`, text: `${NOVELS}/worm`, claims: ['2026-11-01-worm'], ledgers: {powers: ['worm_powers']}}),
    W('you-are-summoned', 'You Are Summoned', 'book', {library: ['You Are Summoned 1-5'], deep: `${NOVELS}/you-are-summoned/DEEP_DIVE_2026-10-25.md`, text: `${NOVELS}/you-are-summoned`}),
    W('wish-upon-the-stars', 'Wish Upon the Stars', 'book', {library: ['Wish Upon the Stars 1-8'], text: `${NOVELS}/wish-upon-the-stars`}),
    W('godclads', 'Godclads', 'book', {library: ['Godclads 1-2'], text: `${NOVELS}/godclads`}),
    W('perfect-run', 'The Perfect Run', 'book', {library: ['The Perfect Run (Royal Road', 'The Perfect Run: Bad Runs'], deep: `${NOVELS}/perfect-run/DEEP_DIVE_2026-10-25.md`, text: `${NOVELS}/perfect-run`, ledgers: {powers: ['perfect_run_powers']}}),
    W('super-supportive', 'Super Supportive', 'book', {library: ['Super Supportive (Royal Road'], deep: `${NOVELS}/super-supportive/DEEP_DIVE_2026-10-25.md`, text: `${NOVELS}/super-supportive`}),
    W('reverend-insanity', 'Reverend Insanity', 'book', {library: ['Reverend Insanity (Gu Zhen Ren)'], wiki: 'reverend-insanity', deep: `${NOVELS}/reverend-insanity/SYSTEMS_DEEP_DIVE_2026-10-10.md`, text: `${NOVELS}/reverend-insanity`, docs: inst('REVEREND_INSANITY_INSTITUTIONS_ROLES_AND_SUBTLE_DETAILS_2026-10-23.md'), ledgers: {powers: ['gu_moves', 'gu_kinds'], artifacts: ['ri_treasures'], creatures: ['creatures']}}),
    W('regressors-tale', "A Regressor's Tale of Cultivation", 'book', {library: ["A Regressor's Tale of Cultivation (Tremendous)"], deep: `${NOVELS}/regressors-tale/SYSTEMS_DEEP_DIVE_2026-10-10.md`, text: `${NOVELS}/regressors-tale`, docs: inst('REGRESSORS_TALE_INSTITUTIONS_ROLES_AND_SUBTLE_DETAILS_2026-10-23.md'), ledgers: {powers: ['regressors_tale_powers']}}),
    // The five TTKS books and the two other Chinese captures
    W('ttks-b1', "Wizard, Hello, I'm an Imposter (TTKS B1)", 'book', {library: ['B1'], text: `${NOVELS}/ttks-novels-2026-10-10`, docs: inst('TTKS_INSTITUTIONS_ROLES_AND_SUBTLE_DETAILS_2026-10-23.md')}),
    W('ttks-b2', 'One Entry a Year, and a Simulated One Counts? (TTKS B2)', 'book', {library: ['B2'], text: `${NOVELS}/ttks-novels-2026-10-10`, docs: inst('TTKS_INSTITUTIONS_ROLES_AND_SUBTLE_DETAILS_2026-10-23.md')}),
    W('ttks-b3', 'Jujutsu Kaisen: Special-Grade Me Goes to Fight Sukuna (TTKS B3)', 'book', {library: ['B3'], text: `${NOVELS}/ttks-novels-2026-10-10`, docs: inst('TTKS_INSTITUTIONS_ROLES_AND_SUBTLE_DETAILS_2026-10-23.md')}),
    W('ttks-b4', 'Heir of All Humanity (TTKS B4)', 'book', {library: ['B4'], text: `${NOVELS}/ttks-novels-2026-10-10`, docs: inst('TTKS_INSTITUTIONS_ROLES_AND_SUBTLE_DETAILS_2026-10-23.md')}),
    W('ttks-b5', 'Wasteland Border Inspector (TTKS B5)', 'book', {library: ['B5'], text: `${NOVELS}/ttks-novels-2026-10-10`, docs: inst('TTKS_INSTITUTIONS_ROLES_AND_SUBTLE_DETAILS_2026-10-23.md')}),
    W('fanren-simulator', 'Fanren from the Immortal Guide, simulator', 'book', {library: ['ttks captures woyouyigexiuxianmoniqi and fanrencongjiyindao'], deep: `${NOVELS}/fanrencongjiyindao-moniqi/DEEP_DIVE_2026-10-10.md`, text: `${NOVELS}/fanrencongjiyindao-moniqi`, docs: inst('FANREN_SIMULATOR_INSTITUTIONS_ROLES_AND_SUBTLE_DETAILS_2026-10-23.md')}),
    W('woyouyigexiuxianmoniqi', 'I Have a Cultivation Simulator', 'book', {deep: `${NOVELS}/woyouyigexiuxianmoniqi/DEEP_DIVE_2026-10-10.md`, text: `${NOVELS}/woyouyigexiuxianmoniqi`}),
    // Wave 1 and the RR priority wave (held, not read)
    W('elydes', 'Elydes', 'book', {library: ['Elydes (Drew Wells)'], text: `${NOVELS}/elydes`}),
    W('street-cultivation', 'Street Cultivation', 'book', {library: ['Street Cultivation (Sarah Lin)'], text: `${NOVELS}/street-cultivation`}),
    W('raksura', 'The Books of the Raksura', 'book', {library: ['The Books of the Raksura'], text: `${NOVELS}/raksura`}),
    W('steerswoman', 'The Steerswoman', 'book', {library: ['The Steerswoman (Rosemary Kirstein)'], text: SL}),
    W('vita-nostra', 'Vita Nostra', 'book', {library: ['Vita Nostra (Dyachenko)'], text: `${NOVELS}/vita-nostra`}),
    W('dragons-egg', "Dragon's Egg", 'book', {library: ["Dragon's Egg (Robert L. Forward)"], text: SL}),
    W('mark-of-the-fool', 'Mark of the Fool', 'book', {library: ['Mark of the Fool (J.M. Clarke)'], text: `${NOVELS}/mark-of-the-fool`}),
    W('tree-of-aeons', 'Tree of Aeons', 'book', {library: ['Tree of Aeons (Spaizzzer)'], text: `${NOVELS}/tree-of-aeons`}),
    W('randidly-ghosthound', 'The Legend of Randidly Ghosthound', 'book', {library: ['The Legend of Randidly Ghosthound'], text: `${NOVELS}/randidly-ghosthound`}),
    // Translator-site captures
    W('rezero', 'Re:Zero', 'book', {library: ['Re:Zero Web Novel Arc 5', 'Re:Zero Web Novel Arc 8', 'Re:Zero Web Novel Arc 9', 'Re:Zero Web Novel Arc 10', 'Re:Zero Web Novel Arc 6', 'Re:Zero Web Novel Arc 7', 'Re:Zero Web Novel Arc 1'], deep: `${NOVELS}/rezero/DEEP_DIVE_2026-10-24.md`, text: `${NOVELS}/rezero`, ledgers: {powers: ['rezero_powers']}}),
    // Other full-book reads with a power ledger (library "Other things on disk")
    W('a-novel-concept', 'A Novel Concept', 'book', {deep: `${NOVELS}/a-novel-concept/SYSTEMS_DEEP_DIVE_2026-10-10.md`, text: `${NOVELS}/a-novel-concept`, ledgers: {powers: ['a_novel_concept_powers']}}),
    W('fated-villain', 'I Am the Fated Villain', 'book', {deep: `${NOVELS}/fated-villain/SYSTEMS_DEEP_DIVE_2026-10-10.md`, text: `${NOVELS}/fated-villain`, ledgers: {powers: ['fated_villain_powers']}}),
    W('omniscient-reader', "Omniscient Reader's Viewpoint", 'book', {deep: `${NOVELS}/omniscient-reader/SYSTEMS_DEEP_DIVE_2026-10-10.md`, text: `${NOVELS}/omniscient-reader`, docs: inst('OMNISCIENT_READERS_VIEWPOINT_INSTITUTIONS_ROLES_AND_SUBTLE_DETAILS_2026-10-23.md'), ledgers: {powers: ['omniscient_reader_powers']}}),
    W('solo-leveling', 'Solo Leveling', 'book', {deep: `${NOVELS}/solo-leveling/SYSTEMS_DEEP_DIVE_2026-10-10.md`, text: `${NOVELS}/solo-leveling`, ledgers: {powers: ['solo_leveling_powers']}}),
    W('labyrinth-mad-god', 'Labyrinth of the Mad God', 'book', {deep: `${NOVELS}/labyrinth-mad-god/SYSTEMS_DEEP_DIVE_2026-10-10.md`, text: `${NOVELS}/labyrinth-mad-god`, ledgers: {powers: ['labyrinth_mad_god_powers']}}),
    W('legendary-mechanic', 'The Legendary Mechanic', 'book', {deep: `${NOVELS}/legendary-mechanic/SYSTEMS_DEEP_DIVE_2026-10-10.md`, text: `${NOVELS}/legendary-mechanic`, ledgers: {powers: ['legendary_mechanic_powers']}}),
    W('speedrunning-multiverse', 'Speedrunning the Multiverse', 'book', {deep: `${NOVELS}/speedrunning-multiverse/SYSTEMS_DEEP_DIVE_2026-10-10.md`, text: `${NOVELS}/speedrunning-multiverse`, ledgers: {powers: ['speedrunning_multiverse_powers']}}),
    W('you-have-died-again', 'You Have Died Again', 'book', {deep: `${NOVELS}/you-have-died-again/SYSTEMS_DEEP_DIVE_2026-10-10.md`, text: `${NOVELS}/you-have-died-again`, ledgers: {powers: ['you_have_died_again_powers']}}),
    W('reincarnation-paradise', 'Reincarnation Paradise', 'book', {library: ['Reincarnation Paradise'], docs: inst('REINCARNATION_PARADISE_FACILITIES_AND_SUBTLE_DETAILS_2026-10-23.md'), text: `${NOVELS}/NS01_REINCARNATION_PARADISE.md`}),
    W('second-life-ranker', 'Second Life Ranker', 'book', {library: ['Second Life Ranker'], text: 'docs/research/CALIBRE_CATALOGUE.md'}),
    W('hunger-games', 'The Hunger Games', 'book', {docs: inst('HUNGER_GAMES_INSTITUTIONS_ROLES_AND_SUBTLE_DETAILS_2026-11-04.md'), text: `${NOVELS}/hunger-games`}),
    W('primordial-saint-sect', 'Primordial Saint Sect', 'book', {docs: inst('PRIMORDIAL_SAINT_SECT_INSTITUTIONS_ROLES_AND_SUBTLE_DETAILS_2026-10-23.md'), text: `${NOVELS}/primordial-saint-sect-2026-10-10`}),
    W('gamers-guide-tutorial', "A Gamer's Guide to Beating the Tutorial", 'book', {library: ["A Gamer's Guide to Beating the Tutorial"], text: SL}),
    W('tutorial-too-hard', 'The Tutorial Is Too Hard', 'book', {library: ['The Tutorial Is Too Hard'], text: SL}),
    W('death-after-death', 'Death After Death', 'book', {library: ['Death After Death'], none: Object.fromEntries(CORPORA.map(c => [c, 'not on disk: no edition found (library index, tutorial and reset fiction)']))}),
    // The census wiki worlds (PWC9); Fate/Zero rides on the typemoon row
    W('naruto', 'Naruto', 'wiki', {wiki: 'naruto', deep: `${NOVELS}/naruto`, docs: {rules: `${WD}/naruto`}}),
    W('typemoon', 'Type-Moon (Fate)', 'wiki', {library: ['Fate/Zero Volumes 2, 3, 4'], wiki: 'typemoon', docs: {rules: `${WD}/fate`}}),
    W('myheroacademia', 'My Hero Academia', 'wiki', {wiki: 'myheroacademia', docs: {rules: `${WD}/mha`}}),
    W('mtg', 'Magic: The Gathering', 'wiki', {wiki: 'mtg'}),
    W('bleach', 'Bleach', 'wiki', {wiki: 'bleach', docs: {rules: `${WD}/bleach`}}),
    W('blackclover', 'Black Clover', 'wiki', {wiki: 'blackclover', docs: {rules: `${WD}/black-clover`}}),
    W('towerofgod', 'Tower of God', 'wiki', {wiki: 'towerofgod'}),
    W('onepiece', 'One Piece', 'wiki', {wiki: 'onepiece', docs: {rules: `${WD}/one-piece`}}),
    W('hunterxhunter', 'Hunter x Hunter', 'wiki', {wiki: 'hunterxhunter', deep: `${NOVELS}/hunter-x-hunter/WORLD_AUDIT_2026-10-10.md`, docs: {rules: `${WD}/hunter-x-hunter`}}),
    W('jujutsu-kaisen', 'Jujutsu Kaisen', 'wiki', {wiki: 'jujutsu-kaisen', deep: `${NOVELS}/jujutsu-kaisen`, docs: {rules: `${WD}/jujutsu`}}),
    W('mistborn', 'Mistborn (Cosmere)', 'wiki', {wiki: 'mistborn', deep: `${NOVELS}/cosmere/WORLD_AUDIT_2026-10-10.md`}),
    W('chainsaw-man', 'Chainsaw Man', 'wiki', {wiki: 'chainsaw-man', deep: `${NOVELS}/chainsaw-man/WORLD_AUDIT_2026-10-10.md`, docs: {rules: `${WD}/chainsaw-man`}}),
    W('kimetsu-no-yaiba', 'Demon Slayer (Kimetsu no Yaiba)', 'wiki', {wiki: 'kimetsu-no-yaiba', docs: {rules: `${WD}/demon-slayer`}}),
    W('fma', 'Fullmetal Alchemist', 'wiki', {wiki: 'fma', docs: {rules: `${WD}/fullmetal-alchemist`}}),
    W('mysranks', "Mys' Ranks", 'wiki', {wiki: 'mysranks'}),
    W('lazydungeonmaster', 'Lazy Dungeon Master', 'wiki', {wiki: 'lazydungeonmaster'}),
    W('dresdenfiles', 'The Dresden Files', 'wiki', {wiki: 'dresdenfiles'}),
    W('frieren', "Frieren: Beyond Journey's End", 'wiki', {wiki: 'frieren', docs: {rules: `${WD}/frieren`}, none: {powers: 'the wiki has no power pages (census: 0); spells and classes live in prose'}}),
    W('mob-psycho-100', 'Mob Psycho 100', 'wiki', {none: NONE_DUMP}),
    W('worldtrigger', 'World Trigger', 'wiki', {none: NONE_DUMP}),
    // Worlds the game already has (WORLD_CARDS and docs/worlds)
    W('original-frontier', 'The Frontier (home world)', 'original', {docs: {rules: `${WD}/original-frontier/RULES_AND_STARTS.md`, powers: `${WD}/original-frontier/ABILITIES.md`}}),
    W('proving-ground', 'The Proving Ground', 'original', {docs: {rules: `${WD}/proving-ground`}}),
    W('proto23', 'Proto 23', 'original', {docs: {rules: `${WD}/proto23`}}),
    W('paradise-hub', 'The Paradise hub', 'original', {docs: {rules: `${WD}/paradise-hub`, institutions: `${WD}/paradise-hub/HUB_LIFE_ECONOMY_AND_PEOPLE_2026-10-14.md`}}),
    W('bay-city', 'Bay City', 'original', {docs: {rules: 'docs/WORLD_CARDS.md'}}),
    W('salvage-reach', 'Salvage Reach', 'original', {docs: {rules: 'docs/WORLD_CARDS.md'}}),
    W('red-basin', 'The Red Basin', 'original', {docs: {rules: 'docs/WORLD_CARDS.md'}}),
    // Tabletop systems (TTRPG rules as rows, 2026-11-17): rule rows in docs/coverage/<system>_rules.json, named content in the ledgers
    // Rule sources for the engine, not worlds to play. Commercial books keep rule rows only (design reference).
    // (generated by hand from scripts/tabletop_rules_pass.mjs collect; keep in step with its output)
    W('tt-dnd-srd', 'D&D 5.2.1 SRD', 'tabletop', {ledgers: {'powers': ['dnd_srd_powers', 'dnd_srd_spells', 'dnd_srd_class_features', 'dnd_srd_feats', 'dnd_srd_backgrounds_species', 'dnd_srd_conditions', 'dnd_srd_surge_tables'], 'artifacts': ['dnd_srd_items'], 'creatures': ['dnd_srd_creatures']}, none: {'potions_and_recipes': 'not read in the tabletop rules pass (rules and named content only)', 'materials': 'not read in the tabletop rules pass (rules and named content only)', 'places': 'not read in the tabletop rules pass (rules and named content only)', 'institutions': 'not read in the tabletop rules pass (rules and named content only)', 'people': 'not read in the tabletop rules pass (rules and named content only)', 'jobs_and_roles': 'not read in the tabletop rules pass (rules and named content only)'}, rulesFile: 'docs/coverage/dnd_srd_rules.json'}),
    W('tt-ars-magica', 'Ars Magica 5e', 'tabletop', {ledgers: {'powers': ['ars_magica_powers', 'ars_magica_spells', 'ars_magica_conditions'], 'artifacts': ['ars_magica_items'], 'creatures': ['ars_magica_creatures']}, none: {'potions_and_recipes': 'not read in the tabletop rules pass (rules and named content only)', 'materials': 'not read in the tabletop rules pass (rules and named content only)', 'places': 'not read in the tabletop rules pass (rules and named content only)', 'institutions': 'not read in the tabletop rules pass (rules and named content only)', 'people': 'not read in the tabletop rules pass (rules and named content only)', 'jobs_and_roles': 'not read in the tabletop rules pass (rules and named content only)'}, rulesFile: 'docs/coverage/ars_magica_rules.json'}),
    W('tt-blades', 'Blades in the Dark SRD', 'tabletop', {ledgers: {'powers': ['blades_powers', 'blades_conditions'], 'artifacts': ['blades_items'], 'creatures': ['blades_creatures']}, none: {'potions_and_recipes': 'not read in the tabletop rules pass (rules and named content only)', 'materials': 'not read in the tabletop rules pass (rules and named content only)', 'places': 'not read in the tabletop rules pass (rules and named content only)', 'institutions': 'not read in the tabletop rules pass (rules and named content only)', 'people': 'not read in the tabletop rules pass (rules and named content only)', 'jobs_and_roles': 'not read in the tabletop rules pass (rules and named content only)'}, rulesFile: 'docs/coverage/blades_rules.json'}),
    W('tt-fate', 'Fate SRD', 'tabletop', {ledgers: {'powers': ['fate_powers', 'fate_spells', 'fate_conditions'], 'artifacts': ['fate_items'], 'creatures': ['fate_creatures']}, none: {'potions_and_recipes': 'not read in the tabletop rules pass (rules and named content only)', 'materials': 'not read in the tabletop rules pass (rules and named content only)', 'places': 'not read in the tabletop rules pass (rules and named content only)', 'institutions': 'not read in the tabletop rules pass (rules and named content only)', 'people': 'not read in the tabletop rules pass (rules and named content only)', 'jobs_and_roles': 'not read in the tabletop rules pass (rules and named content only)'}, rulesFile: 'docs/coverage/fate_rules.json'}),
    W('tt-mm3e', 'Mutants & Masterminds 3e SRD', 'tabletop', {ledgers: {'powers': ['mm3e_powers', 'mm3e_conditions']}, none: {'artifacts': 'not read in the tabletop rules pass (rules and named content only)', 'potions_and_recipes': 'not read in the tabletop rules pass (rules and named content only)', 'materials': 'not read in the tabletop rules pass (rules and named content only)', 'creatures': 'not read in the tabletop rules pass (rules and named content only)', 'places': 'not read in the tabletop rules pass (rules and named content only)', 'institutions': 'not read in the tabletop rules pass (rules and named content only)', 'people': 'not read in the tabletop rules pass (rules and named content only)', 'jobs_and_roles': 'not read in the tabletop rules pass (rules and named content only)'}, rulesFile: 'docs/coverage/mm3e_rules.json'}),
    W('tt-brp', 'Basic Roleplaying ORC', 'tabletop', {ledgers: {'powers': ['brp_powers', 'brp_spells', 'brp_conditions'], 'artifacts': ['brp_items'], 'creatures': ['brp_creatures']}, none: {'potions_and_recipes': 'not read in the tabletop rules pass (rules and named content only)', 'materials': 'not read in the tabletop rules pass (rules and named content only)', 'places': 'not read in the tabletop rules pass (rules and named content only)', 'institutions': 'not read in the tabletop rules pass (rules and named content only)', 'people': 'not read in the tabletop rules pass (rules and named content only)', 'jobs_and_roles': 'not read in the tabletop rules pass (rules and named content only)'}, rulesFile: 'docs/coverage/brp_rules.json'}),
    W('tt-ironsworn', 'Ironsworn', 'tabletop', {ledgers: {'powers': ['ironsworn_powers', 'ironsworn_conditions'], 'artifacts': ['ironsworn_items'], 'creatures': ['ironsworn_creatures']}, none: {'potions_and_recipes': 'not read in the tabletop rules pass (rules and named content only)', 'materials': 'not read in the tabletop rules pass (rules and named content only)', 'places': 'not read in the tabletop rules pass (rules and named content only)', 'institutions': 'not read in the tabletop rules pass (rules and named content only)', 'people': 'not read in the tabletop rules pass (rules and named content only)', 'jobs_and_roles': 'not read in the tabletop rules pass (rules and named content only)'}, rulesFile: 'docs/coverage/ironsworn_rules.json'}),
    W('tt-cypher', 'Cypher Reference Document', 'tabletop', {ledgers: {'powers': ['cypher_powers', 'cypher_spells', 'cypher_conditions'], 'artifacts': ['cypher_items'], 'creatures': ['cypher_creatures']}, none: {'potions_and_recipes': 'not read in the tabletop rules pass (rules and named content only)', 'materials': 'not read in the tabletop rules pass (rules and named content only)', 'places': 'not read in the tabletop rules pass (rules and named content only)', 'institutions': 'not read in the tabletop rules pass (rules and named content only)', 'people': 'not read in the tabletop rules pass (rules and named content only)', 'jobs_and_roles': 'not read in the tabletop rules pass (rules and named content only)'}, rulesFile: 'docs/coverage/cypher_rules.json'}),
    W('tt-eclipse-phase', 'Eclipse Phase 2e Quickstart', 'tabletop', {ledgers: {'powers': ['eclipse_phase_powers', 'eclipse_phase_conditions'], 'artifacts': ['eclipse_phase_items'], 'creatures': ['eclipse_phase_creatures']}, none: {'potions_and_recipes': 'not read in the tabletop rules pass (rules and named content only)', 'materials': 'not read in the tabletop rules pass (rules and named content only)', 'places': 'not read in the tabletop rules pass (rules and named content only)', 'institutions': 'not read in the tabletop rules pass (rules and named content only)', 'people': 'not read in the tabletop rules pass (rules and named content only)', 'jobs_and_roles': 'not read in the tabletop rules pass (rules and named content only)'}, rulesFile: 'docs/coverage/eclipse_phase_rules.json'}),
    W('tt-coc', 'Call of Cthulhu 7e Quick-Start', 'tabletop', {ledgers: {'powers': ['coc_powers', 'coc_spells', 'coc_conditions'], 'artifacts': ['coc_items'], 'creatures': ['coc_creatures']}, none: {'potions_and_recipes': 'not read in the tabletop rules pass (rules and named content only)', 'materials': 'not read in the tabletop rules pass (rules and named content only)', 'places': 'not read in the tabletop rules pass (rules and named content only)', 'institutions': 'not read in the tabletop rules pass (rules and named content only)', 'people': 'not read in the tabletop rules pass (rules and named content only)', 'jobs_and_roles': 'not read in the tabletop rules pass (rules and named content only)'}, rulesFile: 'docs/coverage/coc_rules.json'}),
    W('tt-pf1', 'Pathfinder 1e (d20pfsrd pages)', 'tabletop', {ledgers: {'powers': ['pf1_powers', 'pf1_spells', 'pf1_conditions'], 'artifacts': ['pf1_items'], 'creatures': ['pf1_creatures']}, none: {'potions_and_recipes': 'not read in the tabletop rules pass (rules and named content only)', 'materials': 'not read in the tabletop rules pass (rules and named content only)', 'places': 'not read in the tabletop rules pass (rules and named content only)', 'institutions': 'not read in the tabletop rules pass (rules and named content only)', 'people': 'not read in the tabletop rules pass (rules and named content only)', 'jobs_and_roles': 'not read in the tabletop rules pass (rules and named content only)'}, rulesFile: 'docs/coverage/pf1_rules.json'}),
    W('tt-dnd5e-2014', 'D&D 5e 2014 core and supplements (design reference; PHB, DMG, MM, Xanathar, Fizban, MotM)', 'tabletop', {ledgers: {'powers': ['dnd5e_2014_powers', 'dnd5e_2014_spells', 'dnd5e_2014_class_features', 'dnd5e_2014_feats', 'dnd5e_2014_backgrounds_species', 'dnd5e_2014_conditions', 'dnd5e_2014_surge_tables'], 'artifacts': ['dnd5e_2014_items'], 'creatures': ['dnd5e_2014_creatures']}, none: {'potions_and_recipes': 'not read in the tabletop rules pass (rules and named content only)', 'materials': 'not read in the tabletop rules pass (rules and named content only)', 'places': 'not read in the tabletop rules pass (rules and named content only)', 'institutions': 'not read in the tabletop rules pass (rules and named content only)', 'people': 'not read in the tabletop rules pass (rules and named content only)', 'jobs_and_roles': 'not read in the tabletop rules pass (rules and named content only)'}, rulesFile: 'docs/coverage/dnd5e_2014_rules.json'}),
    W('tt-dnd5e-planes', 'D&D 5e Planescape and Spelljammer rules (design reference; places and factions left to the setting worlds)', 'tabletop', {none: {'powers': 'commercial book: rule rows only (design reference)', 'artifacts': 'commercial book: rule rows only (design reference)', 'potions_and_recipes': 'commercial book: rule rows only (design reference)', 'materials': 'commercial book: rule rows only (design reference)', 'creatures': 'commercial book: rule rows only (design reference)', 'places': 'commercial book: rule rows only (design reference)', 'institutions': 'commercial book: rule rows only (design reference)', 'people': 'commercial book: rule rows only (design reference)', 'jobs_and_roles': 'commercial book: rule rows only (design reference)'}, rulesFile: 'docs/coverage/dnd5e_planes_rules.json'}),
    W('tt-gurps', 'GURPS Powers and Thaumatology (design reference)', 'tabletop', {none: {'powers': 'commercial book: rule rows only (design reference)', 'artifacts': 'commercial book: rule rows only (design reference)', 'potions_and_recipes': 'commercial book: rule rows only (design reference)', 'materials': 'commercial book: rule rows only (design reference)', 'creatures': 'commercial book: rule rows only (design reference)', 'places': 'commercial book: rule rows only (design reference)', 'institutions': 'commercial book: rule rows only (design reference)', 'people': 'commercial book: rule rows only (design reference)', 'jobs_and_roles': 'commercial book: rule rows only (design reference)'}, rulesFile: 'docs/coverage/gurps_rules.json'}),
    W('tt-mm3e-commercial', "M&M 3e Hero's Handbook (design reference)", 'tabletop', {none: {'powers': 'commercial book: rule rows only (design reference)', 'artifacts': 'commercial book: rule rows only (design reference)', 'potions_and_recipes': 'commercial book: rule rows only (design reference)', 'materials': 'commercial book: rule rows only (design reference)', 'creatures': 'commercial book: rule rows only (design reference)', 'places': 'commercial book: rule rows only (design reference)', 'institutions': 'commercial book: rule rows only (design reference)', 'people': 'commercial book: rule rows only (design reference)', 'jobs_and_roles': 'commercial book: rule rows only (design reference)'}, rulesFile: 'docs/coverage/mm3e_commercial_rules.json'}),
    W('tt-blades-commercial', 'Blades in the Dark core book (design reference)', 'tabletop', {none: {'powers': 'commercial book: rule rows only (design reference)', 'artifacts': 'commercial book: rule rows only (design reference)', 'potions_and_recipes': 'commercial book: rule rows only (design reference)', 'materials': 'commercial book: rule rows only (design reference)', 'creatures': 'commercial book: rule rows only (design reference)', 'places': 'commercial book: rule rows only (design reference)', 'institutions': 'commercial book: rule rows only (design reference)', 'people': 'commercial book: rule rows only (design reference)', 'jobs_and_roles': 'commercial book: rule rows only (design reference)'}, rulesFile: 'docs/coverage/blades_commercial_rules.json'}),
];

// Source order per corpus: the first source a world has becomes the cell's `missing` source.
const ORDER = {
    default: ['wiki', 'claims', 'deep', 'text', 'docs'],
    places: ['wiki', 'claims', 'text', 'deep', 'docs'],
    people: ['wiki', 'claims', 'text', 'deep', 'docs'],
    institutions: ['docs', 'wiki', 'claims', 'deep', 'text'],
    jobs_and_roles: ['docs', 'wiki', 'claims', 'deep', 'text'],
    rules: ['deep', 'docs', 'wiki', 'text'],
};
const local = p => /^docs\/research\/novels\//.test(p) ? ' (local, gitignored)' : '';

export function claimRuns(reg, ledgerRows) {
    const ids = new Set(reg.claims);
    for (const names of Object.values(reg.ledgers)) for (const n of names)
        for (const r of ledgerRows.get(n) ?? []) for (const m of String(r.source).matchAll(/paid claims (\d{4}-\d{2}-\d{2}-[a-z0-9]+)/g)) ids.add(m[1]);
    return [...ids].sort();
}

function sourceFor(reg, corpus, claims) {
    for (const kind of ORDER[corpus] ?? ORDER.default) {
        if (kind === 'wiki' && reg.wiki) return `wiki dump ${WIKI(reg.wiki)}`;
        if (kind === 'claims' && claims.length) return `paid reader claims ${claims.join(', ')}`;
        if (kind === 'deep' && reg.deep) return `deep dive ${reg.deep}${local(reg.deep)}`;
        if (kind === 'text' && reg.text) return `chapter text ${reg.text}${local(reg.text)}`;
        if (kind === 'docs') {
            const d = reg.docs[corpus] ?? (corpus === 'jobs_and_roles' ? reg.docs.institutions : undefined) ?? reg.docs.rules;
            if (d) return `world doc ${d}`;
        }
    }
    return null;
}

function mergeCounts(names, countsBy) {
    const sum = {rows: 0, runs: 0, blocked: 0, not_a_thing: 0, unclassified: 0};
    for (const n of names) {
        const c = countsBy.get(n);
        sum.rows += c.total; sum.runs += c['runs-canon'] + c['runs-authored'] + (c['runs-derived'] ?? 0);
        sum.blocked += c.blocked; sum.not_a_thing += c['not-a-thing']; sum.unclassified += c.unclassified;
    }
    return sum;
}

// ledgers: [{name, rows}] from readLedgers(); census: the rows of proposed_ledgers.json.
export function buildWorlds(ledgers, census, registry = REGISTRY) {
    const rowsBy = new Map(ledgers.map(l => [l.name, l.rows])), countsBy = new Map(ledgers.map(l => [l.name, countLedger(l.rows)]));
    const censusBy = new Map(census.map(r => [r.world, r]));
    return registry.map(reg => {
        const claims = claimRuns(reg, rowsBy), cen = reg.wiki ? censusBy.get(reg.wiki) : null;
        const slugs = {};
        for (const names of Object.values(reg.ledgers)) for (const n of names) for (const [s, k] of Object.entries(countsBy.get(n).rules)) slugs[s] = (slugs[s] ?? 0) + k;
        const cells = {};
        for (const corpus of CORPORA) {
            const names = reg.ledgers[corpus];
            if (names?.length) {
                for (const n of names) if (!countsBy.has(n)) throw new Error(`${reg.id}.${corpus}: no ledger ${n}`);
                cells[corpus] = {ledger: names[0], ...(names.length > 1 ? {also: names.slice(1)} : {}), ...mergeCounts(names, countsBy)};
            } else if (corpus === 'rules' && reg.rulesFile) {
                cells[corpus] = {rules_file: reg.rulesFile, rows: JSON.parse(fs.readFileSync(path.join(root, reg.rulesFile), 'utf8')).rules.length};
            } else if (reg.none[corpus]) cells[corpus] = {none: reg.none[corpus]};
            else {
                const src = sourceFor(reg, corpus, claims);
                if (!src) cells[corpus] = {none: 'no source on disk'};
                else cells[corpus] = {missing: src, ...(corpus === 'powers' && cen ? {proposed: cen.ledger, expected: cen.expected} : {})};
            }
        }
        const row = {id: reg.id, name: reg.name, kind: reg.kind,
            sources: {library: reg.library, wiki: reg.wiki ? WIKI(reg.wiki) : null, claims, deep_dive: reg.deep ?? null, docs: Object.values(reg.docs).filter((v, i, a) => a.indexOf(v) === i)},
            census_rank: cen?.rank ?? null, blocked_slugs: slugs, inferred_slugs: cen ? [...cen.caps].sort() : [], cells};
        return row;
    });
}

export const toText = rows => rows.map(r => JSON.stringify(r)).join('\n') + '\n';

export function readCensus(dir = root) {
    return JSON.parse(fs.readFileSync(path.join(dir, COVERAGE_DIR, 'proposed_ledgers.json'), 'utf8')).rows;
}

// The first-column text of every table row in the index sections that list held books.
const INDEX_SECTIONS = /^## (Prime books|Batch-registered|The five TTKS|Wave 1|RR priority|Other things on disk|Translator-site)/;
export function libraryRows(dir = root) {
    const out = []; let on = false;
    for (const line of fs.readFileSync(path.join(dir, 'docs/research/LIBRARY_INDEX.md'), 'utf8').split('\n')) {
        if (line.startsWith('## ')) { on = INDEX_SECTIONS.test(line); continue; }
        if (!on || !line.startsWith('|')) continue;
        const cell = line.split('|')[1]?.trim();
        if (cell && !/^-+$/.test(cell) && !/^(Book|Work|Code|Item|File)$/.test(cell)) out.push(cell);
    }
    return out;
}
export const uncoveredLibraryRows = (rows, index = libraryRows()) => index.filter(c => !rows.some(r => r.sources.library.some(e => c.includes(e))));

export function build() {
    const ledgers = readLedgers().filter(l => l.name !== 'worlds');
    return buildWorlds(ledgers, readCensus());
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const rows = build(), text = toText(rows), file = path.join(root, WORLDS_FILE);
    const gap = uncoveredLibraryRows(rows);
    if (gap.length) { console.error(`library rows with no world: ${gap.join(' | ')}`); process.exit(1); }
    if (process.argv.includes('--check')) {
        const have = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
        if (have !== text) { console.error(`${WORLDS_FILE} is not current: run node scripts/worlds_ledger.mjs`); process.exit(1); }
        console.log(`worlds ledger: PASS (${rows.length} worlds)`);
    } else { fs.writeFileSync(file, text); console.log(`wrote ${WORLDS_FILE} (${rows.length} worlds)`); }
}
