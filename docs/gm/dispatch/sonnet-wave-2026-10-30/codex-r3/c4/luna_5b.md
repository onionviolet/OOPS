# C4 Luna 5b: methods remainder

Run from `/Users/weiwei/code/yet-another-idle-rpg`. This is a bounded private extraction, not an implementation pass. Model: gpt-6-luna medium, launched by the coordinator. Rules: AGENTS.md, WPR4–WPR8, WPR18–WPR23, AD38. Source is the local Chinese LOTM edition already indexed in the lead-run shards. No web, commits, subagents or edits elsewhere. Do not alter host/runtime files or other readers' files.

Input: `docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/l4/v4plus/methods_05b_in.jsonl` (205 distinct IDs, 208 metadata occurrences). Write exactly ONE file: `docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/l4/v4plus/luna_methods_05b.jsonl`. Input metadata is an index, not proof. Rows group all assigned occurrences of an ID across volumes so each ID has one reader. Record volume-specific differences instead of collapsing later changes into earlier dates. Preserve uncertain aliases as separate IDs. Source wording and detailed truths stay in this private output. Final chat gives counts and gaps, with IDs for sealed content.

Use this standard citation route for an ID, batching several IDs per shell call:

```sh
node scripts/lead_run/cite_paragraphs.mjs docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27 --merged docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/m4-whole-book-2026-10-29/merged --id <id> --context 3 --max 8
```

The standard route caps the whole result, and may show an earlier volume or unrelated mention first. Check the printed anchor against the input's `occurrences`. To open an exact assigned occurrence, use the C4 helper (zero-based occurrence index; one context window per call):

```sh
node docs/gm/dispatch/sonnet-wave-2026-10-30/codex-r3/c4/cite_input.mjs docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/l4/v4plus/methods_05b_in.jsonl --id <id> --occurrence 0
```

Increment `--occurrence` to read additional assigned anchors. The private `docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/l4/v4plus/anchor_check.json` lists currently missing/unparseable anchors. Missing anchors go in gaps; a missing book prefix is resolved from the occurrence's volume and marked inferred by the helper. A reading budget is at most 12,000 source words (Chinese characters count as words) and six model responses per fresh reader. This assignment's metadata count is not a claim all source fits that budget. Stop at the budget and explicitly record unread IDs; the coordinator can assign the exact remainder to a fresh context. Do not claim later occurrences checked from an earlier one. For partially read IDs, record checked and unchecked locators in `gaps` and mark `usable:false` when the unexamined material affects the method.

## Procedure output, when family is methods

Group IDs that show the same procedure into one JSON line. Preserve dates/volumes and distinct variants. Schema:

```json
{"family":"ritual_other","ids":[],"label":"","locators":[],"conditions":[],"inputs":[],"performers":[],"steps":[{"kind":"prepare","text_en":"","minutes_stated":null}],"outcomes":[{"when":"unknown","stated":""}],"products":[],"costs":[],"limits":[],"consequences":[{"trigger":"","response":"","by":""}],"scale":null,"tags":[],"gaps":[],"usable":false}
```

`family`: divination | summons | ritual_other | potion_rule | aid_preparation | craft | occasion_of_known_method | no_content. Step kind: prepare | rite | call | response | attempt | interpret | craft | finish | use | outcome. Evidence uses S (shown), T (told), I (inferred) on claim objects or an added field-path `evidence` map. Each inference also carries `inferred:true` and its basis. English paraphrases, no invented quantities, times, odds, conditions or mechanics. Use null and gaps for missing facts. State constraints as the cited default, variation and reason rather than inventing universal restrictions. `usable:true` requires conditions or inputs, at least one supported step and a stated outcome.

Repeated procedures from the already-authored list below are `occasion_of_known_method` with the earlier method ID/name in tags. A materially new variant keeps its own supported steps and names the earlier method plus the delta. `no_content` means the paragraph was read and shows no relevant procedure, not a placeholder for an unread ID.

## Artifact output, when family is gm33

One line per input ID, schema:

```json
{"id":"","label":null,"holder_by_date":[],"effect":[],"cost_or_drawback":[],"containment":[],"access_route":[],"gaps":[]}
```

Every populated fact includes S/T/I evidence and locator (use `{text_en,label,locator}` objects; dated holders also include `date_or_order`, `holder`, and volume). If no calendar date is stated, use a cited chapter/order anchor and explicitly say the exact date is unknown. Effects, costs, containment and access need their own evidence; a known holder does not establish player access. Known source labels may appear in this private output. Sealed IDs remain IDs in tracked documents/chat; put any actual sealed truth solely in the private output. Keep inferred organization marked `inferred:true` with a basis. No invented ongoing costs or handling rules. Candidate selection deliberately includes possible incidental mentions: read first, then reject a nonartifact with empty fact arrays and a source-supported explanation in `gaps`; do not silently drop it. Do not merge IDs based on similar names. `sealed:true` in the input is a conservative handling flag, not a claim the item is a canon Sealed Artifact.

## Already authored

Private catalogue with method labels, source output file and line: `docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/l4/v4plus/already_authored.jsonl`. Read it before classifying repeats. It includes every method-bearing group in prior volume 1–3 Luna outputs, including known-method occasions. It excludes the explicitly named placeholder output, no_content and unread trailers. This list identifies earlier extracted methods, not source review or runtime integration. IDs for every group follow; labels stay private:

- `lotm.rite.altar-dream-divination`
- `lotm.rite.altar-search-divination`
- `lotm.rite.cane-dowsing`
- `lotm.rite.copper-whistle-summon`
- `lotm.rite.copper-whistle-messenger`
- `lotm.craft.coin-divination`
- `lotm.craft.pendulum-divination`
- `lotm.rite.mirror-divination`
- `lotm.rite.copper-whistle-summon`, `lotm.rite.copper-whistle-messenger`, `lotm.rule.bronze-whistle-summon`, `lotm.rule.copper-whistle-messenger`, `lotm.rite.summon-bone-messenger`, `lotm.rite.summon-sunflame-to-backlund`
- `lotm.rite.self-summon`, `lotm.rule.self-summon-ritual`, `lotm.rite.end-self-summon`, `lotm.rite.summoning-incantation-candle`, `lotm.rite.summoning-door-attempt`
- `lotm.rite.messenger-summon`, `lotm.rule.spirit-medium-contact`
- `lotm.rite.star-summons`
- `lotm.craft.dream-divination`, `lotm.rite.dream-divination`, `lotm.rite.dream-divination-simplified`, `lotm.rite.dream-recall-divination`, `lotm.rite.spirit-dream-divination`, `lotm.rule.dream-divination`
- `lotm.craft.pendulum-method`, `lotm.rite.pendulum-method`, `lotm.rule.pendulum-method`, `lotm.rite.pendulum-divination`, `lotm.rule.pendulum-confirmation`, `lotm.rule.yellow-quartz-pendant-divination`, `lotm.rite.grey-fog-pendant-divination`, `lotm.rite.pendant-danger-divination`
- `lotm.rite.coin-divination`, `lotm.rule.coin-divination`
- `lotm.craft.birth-chart`, `lotm.craft.birth-star-chart`, `lotm.craft.event-star-chart`, `lotm.craft.star-chart-divination`
- `lotm.craft.tarot-spread`, `lotm.craft.tarot-self-reading`, `lotm.craft.tarot-dream-finding`
- `lotm.craft.child-locating`, `lotm.craft.locate-by-item`
- `lotm.rite.mirror-divination`, `lotm.craft.mirror-divination`
- `lotm.rite.blood-kin-search`, `lotm.rule.blood-link-search-rite`
- `lotm.craft.numerology`
- `lotm.craft.slumber-charm`, `lotm.craft.soothing-charm`, `lotm.rule.dream-charm-making`, `lotm.rule.dream-charm-use`, `lotm.craft.charm-making`, `lotm.craft.charm-recharge`
- `lotm.craft.sun-flame-charm`, `lotm.craft.yang-yan-talisman`
- `lotm.craft.protective-talisman`, `lotm.craft.silver-talisman-carving`, `lotm.craft.talisman`, `lotm.craft.talisman-finishing-blessing`
- `lotm.craft.holy-night-powder`
- `lotm.craft.full-moon-oil`, `lotm.craft.ritual-essence-oil`, `lotm.craft.ritual-oil-distillation`
- `lotm.craft.pure-water`
- `lotm.craft.covert-entry-search`, `lotm.rule.covert-search-method`
- `lotm.craft.surveillance-tailing`
- `lotm.rite.nail-blood-charm`
- `lotm.craft.hunter-bullets`
- `lotm.craft.matchbox-gluing`
- `lotm.rite.hidden-name-recitation`
- `lotm.rite.dream-divination`
- `lotm.rite.tarot-gathering`
- `lotm.rite.self-summon-retrieval`
- `lotm.note.mystic-rite`
- `lotm.rite.blood-revelation`
- `lotm.rite.paper-angel-substitute`
- `lotm.rite.arodes-mirror-questioning`
- `lotm.rite.true-creator-summoning`
- `lotm.rite.grey-fog-entry-backstep`
- `lotm.rite.fool-prayer-artificial-sleepwalk`
- `lotm.rule.bestowal-ritual`
- `lotm.rite.steam-confession`
- `lotm.rite.grey-fog-entry`, `lotm.rite.enter-grey-fog`
- `lotm.ritual.fool-sacrifice`
- `lotm.rite.artificial-sleepwalk`
- `lotm.rite.sacrifice-ritual`
- `lotm.rule.dream-divination`
- `lotm.rule.pendulum-divination`, `lotm.rite.pendulum-divination`
- `lotm.rite.dowsing`
- `lotm.rite.spirit-call`
- `lotm.rite.sewer-call`, `lotm.rite.spirit-ritual`
- `lotm.rite.self-summoning`, `lotm.rule.self-summoning`, `lotm.rule.grey-fog-entry`, `lotm.rule.grey-fog-ritual`
- `lotm.rite.dual-element-method`
- `lotm.rite.sun-purification`, `lotm.rite.eternal-sun-purification`
- `lotm.rite.sentence-divination`, `lotm.rite.quarter-penny-divination`, `lotm.rite.coin-divination`
- `lotm.rite.dream-entry`
- `lotm.craft.reparde-pedal-car`
- `lotm.craft.two-wheel-bicycle-design`
- `lotm.potion.hunter`
- `lotm.potion.illusionist`
- `lotm.potion.light-seeker`
- `lotm.craft.role-play-method`
- `lotm.potion.susie-potion`
- `lotm.craft.explosive-demolition`
- `lotm.potion.clown`
- `lotm.craft.paper-men`
- `lotm.potion.magician-digestion`
- `lotm.craft.candle-making`
- `lotm.potion.temple-mushroom`
- `lotm.craft.paper-figure-angel`
- `lotm.potion.audience-formula`
- `lotm.craft.hunter-brewing`
- `lotm.craft.remains-divination`
- `lotm.rule.faceless-man-potion`
- `lotm.rule.wind-favored-formula`
- `lotm.potion.clown-sequence7`
- `lotm.craft.holy-night-powder`
- `lotm.potion.navigator`
- `lotm.potion.seq8-pituitary`
- `lotm.potion.mind-reader`
- `lotm.rule.slumber-charm`
- `lotm.rule.tarot-door-pry`
- `lotm.potion.krag-oil`
- `lotm.potion.sheriff`
- `lotm.rule.trait-potion-use`
- `lotm.rule.scene-staging`
- `lotm.potion.sheriff-formula`
- `lotm.rule.healing-potion-bottles`
- `lotm.rule.stimulant-potion-bottles`
- `lotm.rule.hunter-sequence9-potion`
- `lotm.rule.filthy-words-sigil`
- `lotm.craft.pendulum-divination`, `lotm.craft.pendulum-over-paper`, `lotm.rule.pendulum-authentication`
- `lotm.craft.dream-divination`
- `lotm.craft.filthy-words-sigil`
- `lotm.potion.shadowless-formula`
- `lotm.potion.sequence7-magician`
- `lotm.potion.sequence6-faceless-man`
- `lotm.potion.sequence5-puppeteer`
- `lotm.item.potion-formula`
- `lotm.item.sedative`
- `lotm.potion.bard-digestion`
- `lotm.craft.desecration-card`
- `lotm.potion.witch-seq7`
- `lotm.potion.enchantress-seq6`
- `lotm.potion.psychologist-seq7`
- `lotm.potion.wind-favored-seq6`
- `lotm.potion.clown-digestion`
- `lotm.potion.magician-material`
- `lotm.craft.gathering-disguise`
- `lotm.craft.holy-symbol-silver-bullets`
- `lotm.potion.shadowless-seq4`
- `lotm.potion.psychoanalyst-seq7`
- `lotm.potion.sheriff-material-funding`
- `lotm.potion.sequence7-magician-plan`
- `lotm.rule.magician-potion-brew`
- `lotm.rule.mind-reader-potion-plan`
- `lotm.rule.sedative`
- `lotm.rule.seq7-potion-digestion`
- `lotm.rule.paper-figures`
- `lotm.craft.fingerprinting`
- `lotm.rule.apothecary-formula`
- `lotm.potion.demon-potion`
- `lotm.potion.apothecary-formula`
- `lotm.potion.abraham-dream-draught`
- `lotm.potion.scent-neutraliser`
- `lotm.potion.amanda-distillate-scent-mask`
- `lotm.item.tarot-deck`
- `lotm.rule.feynapotter-noodle-cooking`
- `lotm.potion.barbarian-s8`
- `lotm.potion.witch-of-pleasure`
- `lotm.craft.extraordinary-bullet-set`
- `lotm.craft.revolver-loading`
- `lotm.craft.spirit-wall-shield`
- `lotm.potion.beast-sequence9-route`
- `lotm.potion.apprentice-brew`
- `lotm.craft.pendulum-formula-check`
- `lotm.potion.sedative-maric-trial`
- `lotm.potion.illusionist-formula-sale`
- `lotm.potion.briber`
- `lotm.craft.brooch-attunement`
- `lotm.potion.sedative`
- `lotm.craft.spirit-cage`
- `lotm.craft.snap-detonation`
- `lotm.rule.biological-poison-bottle`
- `lotm.rule.holy-bullet-loading`
- `lotm.craft.sun-holy-water`, `lotm.craft.sun-holy-water-brooch`, `lotm.item.sun-holy-water`
- `lotm.craft.clock-repair`
- `lotm.craft.pickpocket-training`
- `lotm.potion.silver-calming`
- `lotm.potion.sun-priest-formula`
- `lotm.craft.light-bone-sword`
- `lotm.craft.werewolf-trait-item`
- `lotm.potion.sequence-promotion-digestion`
- `lotm.potion.parasite`
- `lotm.craft.bloodletting-therapy`
- `lotm.craft.illusion-disguise`
- `lotm.potion.wind-favored-route`
- `lotm.rule.biological-poison-brewing`
- `lotm.potion.patient-tailored`
- `lotm.potion.ready-made-medicine`
- `lotm.craft.trait-to-magic-item`
- `lotm.craft.beef-bone-radish-soup`
- `lotm.craft.egg-fried-rice`
- `lotm.potion.arbiter-sequence-potions`
- `lotm.potion.pharmacist-glaint`
- `lotm.potion.alger-unnamed`
- `lotm.potion.sequence-potion-from-trait`
- `lotm.potion.sequence6-promotion`
- `lotm.potion.sheriff-promotion`
- `lotm.potion.pharmacist-potion`
- `lotm.rule.black-emperor-potion`
- `lotm.rule.sequence-potion-effect`
- `lotm.rule.sequence-potion-advance`
- `lotm.potion.klein-digestion`
- `lotm.potion.wind-favored`
- `lotm.craft.fors-novel-writing`
- `lotm.craft.informant-questioning`
- `lotm.potion.digestion-self-improvement`
- `lotm.rule.audience-potion`
- `lotm.rule.mind-reader-potion`
- `lotm.rule.psychologist-potion`
- `lotm.rule.scholar-potion`
- `lotm.potion.vampire-blood-potion`
- `lotm.potion.mummy-powder`
- `lotm.potion.magician`
- `lotm.potion.faceless-man`
- `lotm.potion.fors-illusionist-step`
- `lotm.potion.apprentice`
- `lotm.potion.digestion`
- `lotm.craft.potion-isolation`
- `lotm.craft.trait-solidification`
- `lotm.rule.psychologist-formula`
- `lotm.potion.sequence0-black-emperor-formula`
- `lotm.potion.psychologist`
- `lotm.craft.puppeteer-seq5`
- `lotm.rule.interrogator-potion-materials`
- `lotm.rule.constable-potion-material`
- `lotm.item.metal-vial`
- `lotm.item.sun-priest-formula`
- `lotm.potion.aberrant-seq4-puppet`
- `lotm.potion.abyss-seq4-formula`
- `lotm.potion.sun-priest`
- `lotm.potion.miracle-invoker`
- `lotm.potion.metal-tube-draught`
- `lotm.craft.golden-oil-blade`
- `lotm.craft.black-liquid-seal`
- `lotm.potion.pleasure-potion`
- `lotm.potion.extraordinary-potion`
- `lotm.potion.witch-sex-change`
- `lotm.item.slumber-charm`
- `lotm.potion.plague-remedy`
- `lotm.craft.fish-man-hunt`
- `lotm.craft.fish-man-cooking`
- `lotm.rule.coin-divination`
- `lotm.rite.weather-god-sacrifice`
- `lotm.item.sun-holy-water-bottle-charge`
- `lotm.rite.recall-creeping-hunger`
- `lotm.craft.underwater-stealth-item`
- `lotm.craft.extraordinary-item-making`
- `lotm.rite.mystic-contact`
- `lotm.rite.sacrifice-kalvetua`
- `lotm.craft.airship-barrage`
- `lotm.rite.spirit-descent`
- `lotm.craft.inscribe-true-names`
- `lotm.craft.radio-operation`
- `lotm.rule.ritual-portrait`
- `lotm.rule.messenger-contract`
- `lotm.rite.self-summon-grey-fog`
- `lotm.rite.spirit-world-entry-summoning-door`
- `lotm.rite.spirit-creature-summoning`
- `lotm.rite.summon-spirit-creature`
- `lotm.rite.copper-whistle-call`
- `lotm.rite.death-messenger-contract`
- `lotm.rite.divination-locate-person`
- `lotm.rite.purifying-cannon-recharge`
- `lotm.note.spirit-descent-ritual`
- `lotm.item.paper-crane`
- `lotm.rite.hunger-grey-fog`
- `lotm.rite.summon-messengers`, `lotm.craft.summon-item-commission`
- `lotm.craft.fixed-summon-ritual`
- `lotm.craft.swim-bladder-ring`
- `lotm.rite.tree-desire-drink`
- `lotm.rite.mirror-divination`
- `lotm.rite.meditation-sleep-dream-entry`
- `lotm.craft.hybrid-bacteria-cultivation`
- `lotm.rite.coin-divination`
- `lotm.rite.pendant-divination`
- `lotm.rule.dream-entry`
- `lotm.rule.self-summon-ritual`, `lotm.rite.self-summon`
- `lotm.rite.request-gift`, `lotm.rite.prayer-of-bestowal`
- `lotm.rite.danitz-daily-prayer`
- `lotm.rite.grey-fog-offering`
- `lotm.craft.bernadette-gift`
- `lotm.rite.true-creator-descent`
- `lotm.rite.fool-sacrifice-trade`
- `lotm.craft.trait-commission`
- `lotm.rite.coin-divination-failed`
- `lotm.rite.badge-divination-gathering`
- `lotm.rite.silver-mirror-questioning`
- `lotm.rite.copper-whistle-contact`
- `lotm.craft.fish-seasoning`, `lotm.craft.dixi-grilled-fish`
- `lotm.rite.black-emperor-grey-fog-seal`
- `lotm.rite.messenger-summon`
- `lotm.craft.damir-spirit-cured-meat`
- `lotm.craft.radio-codebook-report`
- `lotm.rite.grey-fog-pendulum-divination`
- `lotm.rule.silver-mask-craft`
- `lotm.rite.summon-messenger`
- `lotm.craft.formula-materialization`
- `lotm.rite.sacrifice-ritual`
- `lotm.item.silver-mask`
- `lotm.rite.spirit-ritual`
- `lotm.craft.tarot-three-card-reading`
- `lotm.rite.grey-fog-prayer`
- `lotm.rite.spirit-eater-offering`
- `lotm.craft.aromatherapy`
- `lotm.ritual.secret-dream-entry`
- `lotm.item.shadow-cloak.tracking`
- `lotm.rite.fool-sacrifice-berg`
- `lotm.rite.azik-whistle-messenger`
- `lotm.rite.kalvetua-sacrifice`
- `lotm.rite.spirit-locate-object`
- `lotm.rite.pendulum-danger-check`
- `lotm.rite.answer-prayer-covenant`
- `lotm.rite.ritual-magic`
- `lotm.rite.rebel-sea-offering`
- `lotm.craft.teyatiwa`
- `lotm.rite.sacrifice-grey-fog`
- `lotm.rite.deep-red-star-link`
- `lotm.craft.coin-divination`
- `lotm.rite.pendulum-divination`
- `lotm.rite.messenger-summoning`
- `lotm.craft.makeup-disguise`, `lotm.craft.helene-male-disguise`
- `lotm.craft.makeup-removal-disguise`
- `lotm.rule.walking-stick-divination`
- `lotm.craft.faceless-roleplay`
- `lotm.rite.grey-fog-divination`, `lotm.rule.grey-fog-divination`
- `lotm.rite.crane-ritual-transfer`
- `lotm.rite.fool-summons`
- `lotm.craft.night-watch-crane-forgery`
- `lotm.rule.silver-city-ritual`
- `lotm.rite.self-summon-emblem`
- `lotm.rite.summon-messenger-candle`
- `lotm.rite.blue-eye-portrait`
- `lotm.rite.release-spirit`
- `lotm.rite.world-prayer-message`
- `lotm.rite.portrait-ritual`
- `lotm.rule.sea-god-conch-prayer`
- `lotm.rule.klein-scare-ritual`
- `lotm.rite.lesser-sequence-ship-blessing`
- `lotm.rite.dream-divination`
- `lotm.rite.summon-world-prayer`
- `lotm.rite.fool-offering-report`
- `lotm.rite.grey-fog-item-transfer`
- `lotm.rite.fool-transfer`
- `lotm.rite.all-black-eye-exposure`
- `lotm.craft.sweet-lemon-cocktail`
- `lotm.craft.silver-badge-replica`
- `lotm.craft.ninth-law-talisman`
- `lotm.craft.high-grade-talisman-sun-emblem`
- `lotm.rite.mother-tree-prayer`
- `lotm.rite.fertility-necklace-contamination`
- `lotm.rite.vagrant-hair-appetite`
- `lotm.rule.mother-tree-interference-ritual`
- `lotm.rule.naturism-substitute-ritual`
- `lotm.rule.messenger-summoning-ritual`, `lotm.rule.harmonica-messenger-binding`
- `lotm.rule.murloc-cufflink-craft`
- `lotm.rite.deity-parasite-removal`
- `lotm.rite.crystal-ball-contact`
- `lotm.rite.harmonica-spirit-summon`
- `lotm.craft.whale-butchery`
- `lotm.craft.whale-oil-rendering`
- `lotm.craft.nibos-distilling`
- `lotm.rite.grey-fog-loadout`
- `lotm.rite.future-ship-formation`
- `lotm.rule.wine-blood-fish`
- `lotm.rule.peeping-countermeasure`, `lotm.rule.peep-interference`
- `lotm.craft.silver-fish-breeding`
- `lotm.craft.sedative-drink`
- `lotm.rite.fool-prayer-sea-control`
- `lotm.craft.blood-smear-clear`
- `lotm.craft.storm-charm-tin`
- `lotm.rule.whistle-oil-coat`
- `lotm.rule.sea-god-talisman`
- `lotm.rule.cufflink-divination`
- `lotm.rule.aura-seal-box`
- `lotm.rule.paper-figure-fire`
- `lotm.rule.grey-fog-response`
- `lotm.rite.mermaid-song-balance`
- `lotm.rite.creeping-hunger-disposal`
- `lotm.rite.altar-three-names`
- `lotm.rite.grey-fog-entry`
- `lotm.rite.fool-prayer`
- `lotm.rite.sea-god-scepter-response`
- `lotm.rite.creator-name-chant`
- `lotm.rite.little-sun-descent`
- `lotm.rite.devil-sequence4-promotion`
- `lotm.rite.luck-transfer`
- `lotm.rite.mural-curse-removal`
- `lotm.rite.written-divination-sleep`
- `lotm.rite.notice-locating-divination`
- `lotm.rite.grey-fog-edwina-divination`
- `lotm.rite.golden-dream-trap-divination`
- `lotm.rite.groselle-book-story-divination`
- `lotm.rite.messenger-summon-whistle`
- `lotm.rite.blood-book-entry`
- `lotm.rite.rod-seeking-entry`
- `lotm.rite.name-recitation`
- `lotm.rule.rod-seeking`
- `lotm.rite.snoman-chest-cross-prayer`
- `lotm.ritual.snoman-prayer`
- `lotm.craft.extraordinary-trait-use`
- `lotm.ritual.grey-fog-entry`
- `lotm.rule.pendulum-divination`
- `lotm.craft.dorinsman-rain-cloak`
- `lotm.rite.enter-book-world`
- `lotm.craft.monster-food-prep`
- `lotm.rite.sacrifice-door`
- `lotm.craft.hybrid-mushroom`
- `lotm.craft.radio-telegram-decoding`
- `lotm.rite.scent-dispersal-wall`
- `lotm.rite.grey-fog-location-divination`
- `lotm.rite.grey-fog-self-danger-divination`
- `lotm.rite.harmonica-summon-messenger-lady`
- `lotm.rite.desire-tree-altar`
- `lotm.craft.monocle-locating`
- `lotm.craft.telegraph-decoding`
- `lotm.rite.true-creator-lure`
- `lotm.rite.four-step-cleansing`
- `lotm.rite.blood-soil-divination`
- `lotm.craft.three-layer-interference`
- `lotm.craft.paper-angel`

## Done check and placeholder warning

Every input ID appears exactly once, in a procedure `ids` array or artifact `id`, or in the final unread trailer. Produce valid JSON per nonblank line. IMPORTANT: a previous lane wrote placeholders without reading paragraphs. Every row must come from paragraphs actually read. If you cannot finish, write fewer supported rows; unread IDs go in a final {"unread":[...] } line (without the space before `}` in the actual JSON). Canonical trailer form: `{"unread":[...]}`. Do not create empty procedure rows for unread IDs. Source words read, actual locator coverage and budget exhaustion belong in the final report or each row's gaps, not invented facts. The coordinator runs `python3 docs/gm/dispatch/sonnet-wave-2026-10-30/codex-r3/c4/prepare.py --outputs` after all reader files exist, then reviews source support separately.

## Fold handoff

The coordinator launches this reader; the C4 fold lane launches none. Own only the new remainder output. The original `luna_methods_05.jsonl` has 10 source-read rows covering 11 IDs and a 205-ID unread trailer. Do not edit it. Preserve the original hashed assignment files. When folding this return, replace the original trailer entries with reviewed rows for those exact IDs and retain any still unread IDs, then rerun `prepare.py --outputs`. Do not concatenate unread trailers blindly. A source budget may require another supported partial return.

Address warning: `bNs`/`wNs` prefixes are volume-1 reading waves, not book numbers. Explicit `zh bN` locators and `lotmNc` prefixes identify later volumes. For unprefixed registry locators inspect the `shards` array and the source header. The old helper can infer the wrong book; consult private `volume_corrections.jsonl` and source headers before declaring a missing anchor. This remainder input currently contains explicit later-volume locators.
