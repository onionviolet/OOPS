# Aspect pass

Public-media scope, 2026-10-14. Covered means bounded visual coverage, not exhaustive game/source proof. All twelve cells retained. SHOWN screenshots versus STATED developer/player accounts are distinguished below; YAIRPG takeaways are PROPOSALS.

## A01: Dialogue and conversation

Status: unread. Sources: [S01](https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/4122910/3d28194e3955e9c81f40d4568c429403c92308e3/ss_3d28194e3955e9c81f40d4568c429403c92308e3.1920x1080.jpg?t=1789512680), [S02](https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/4122910/e00ddf0b591c63e6a7a76f1e474943aab8551d94/ss_e00ddf0b591c63e6a7a76f1e474943aab8551d94.1920x1080.jpg?t=1789512680).

Help, goal text and ally flavor are visible; no conversation graph, barks or relationship-gated dialogue is established.

Implementation: No binary or dialogue tables; line IDs, conditions and state effects unread.

YAIRPG proposal: K6/K20/K31; do not mistake inspector flavor for NPC conversation.

## A02: Narrative delivery

Status: partial. Sources: [S01](https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/4122910/3d28194e3955e9c81f40d4568c429403c92308e3/ss_3d28194e3955e9c81f40d4568c429403c92308e3.1920x1080.jpg?t=1789512680), [S02](https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/4122910/e00ddf0b591c63e6a7a76f1e474943aab8551d94/ss_e00ddf0b591c63e6a7a76f1e474943aab8551d94.1920x1080.jpg?t=1789512680), [S03](https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/4122910/ebc9b5373b80181458ebde399109e22095b6dc35/ss_ebc9b5373b80181458ebde399109e22095b6dc35.1920x1080.jpg?t=1789512680).

Quest log/completed tabs and system history appear beside context help. This is interface-level narrative guidance, not a proven branching journal.

Implementation: Quest completion dispatch, retained journal data and scheduling unread.

YAIRPG proposal: K11/K12/K14; reuse P20 for sourced reports and keep help separate from caused events.

## A03: Implementation architecture

Status: partial. Sources: [E02](https://kappagames.itch.io/multiverse-idle).

Official Itch metadata says Godot. No shipped engine revision or language verified.

Implementation: PCK/scenes/resources/scripts are a conditional inspection route, not observed files. Tick/event architecture unread.

YAIRPG proposal: K18/K34; inspect before selecting a recovery tool; no engine migration proposal.

## A04: Save and persistence

Status: partial. Sources: [E03](https://kappagames.itch.io/multiverse-idle/devlog/1326738/play-the-multiverse-idle-demo-on-steam), [E04](https://kappagames.itch.io/multiverse-idle/devlog/1318579/play-the-multiverse-idle-demo), [E05](https://kappagames.itch.io/multiverse-idle/devlog/1121838/v02-the-great-balance-patch), [E06](https://www.reddit.com/r/incremental_games/comments/1qeqz0u/web_itch_demo_out_for_multiverse_idle_an/).

Developer withdrew web build and claims Steam autosaves work; v0.2 required a fresh game. Historical players reported lost progress.

Implementation: Serialization format, version fields, commit ordering, backup and rejection behavior unread.

YAIRPG proposal: K18/K33; retain YAIRPG complete native envelope and compatibility decision; P13/P16, no borrowed serializer.

## A05: AI and NPC behavior

Status: partial. Sources: [S03](https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/4122910/ebc9b5373b80181458ebde399109e22095b6dc35/ss_ebc9b5373b80181458ebde399109e22095b6dc35.1920x1080.jpg?t=1789512680), [S04](https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/4122910/83dce1439a886648a42afdad8e57be7ea2ec020a/ss_83dce1439a886648a42afdad8e57be7ea2ec020a.1920x1080.jpg?t=1789512680), [S05](https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/4122910/b2fdfdd17852c74c1e2b67384b3d8052564bae52/ss_b2fdfdd17852c74c1e2b67384b3d8052564bae52.1920x1080.jpg?t=1789512680), [E05](https://kappagames.itch.io/multiverse-idle/devlog/1121838/v02-the-great-balance-patch).

Automated battles and class-specific allies are presented; world-specific enemy rosters visible. No autonomous civilian life established.

Implementation: Targeting, steering, attack timers and enemy-skill evaluators unread.

YAIRPG proposal: K6/K10; team composition may inform combat inspection, not NPC planning P25 implementation.

## A06: UI and information design

Status: covered. Sources: [S01](https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/4122910/3d28194e3955e9c81f40d4568c429403c92308e3/ss_3d28194e3955e9c81f40d4568c429403c92308e3.1920x1080.jpg?t=1789512680), [S02](https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/4122910/e00ddf0b591c63e6a7a76f1e474943aab8551d94/ss_e00ddf0b591c63e6a7a76f1e474943aab8551d94.1920x1080.jpg?t=1789512680), [S03](https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/4122910/ebc9b5373b80181458ebde399109e22095b6dc35/ss_ebc9b5373b80181458ebde399109e22095b6dc35.1920x1080.jpg?t=1789512680), [S04](https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/4122910/83dce1439a886648a42afdad8e57be7ea2ec020a/ss_83dce1439a886648a42afdad8e57be7ea2ec020a.1920x1080.jpg?t=1789512680), [S05](https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/4122910/b2fdfdd17852c74c1e2b67384b3d8052564bae52/ss_b2fdfdd17852c74c1e2b67384b3d8052564bae52.1920x1080.jpg?t=1789512680), [S06](https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/4122910/cf4cb1fb8e94f6b5dfe0bb7040817df4b8a87d4b/ss_cf4cb1fb8e94f6b5dfe0bb7040817df4b8a87d4b.1920x1080.jpg?t=1789512680).

Six full-size images establish stable rails, center workspaces, contextual inspectors, split goal/system panes, filtered roster, caps/rates and acquisition/use costs. Map and offline dialog remain unread.

Implementation: Exact anchors, Control scene hierarchy, tooltip sharing, keyboard focus and localization unread. Visible rendering only.

YAIRPG proposal: K14; MI-P01/02/03, adapt at 1366×768 with comfortable text; fresh rebuilt route required later.

## A07: Content authoring and modding

Status: unread. Sources: [E02](https://kappagames.itch.io/multiverse-idle).

Godot attribution alone says nothing about a mod API or designer workflow.

Implementation: No game resources, authoring tables, editors, loader order or validators available in this pass.

YAIRPG proposal: K1/K34; no foreign schema proposed.

## A08: Balance and numbers

Status: partial. Sources: [S02](https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/4122910/e00ddf0b591c63e6a7a76f1e474943aab8551d94/ss_e00ddf0b591c63e6a7a76f1e474943aab8551d94.1920x1080.jpg?t=1789512680), [S05](https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/4122910/b2fdfdd17852c74c1e2b67384b3d8052564bae52/ss_b2fdfdd17852c74c1e2b67384b3d8052564bae52.1920x1080.jpg?t=1789512680), [S06](https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/4122910/cf4cb1fb8e94f6b5dfe0bb7040817df4b8a87d4b/ss_cf4cb1fb8e94f6b5dfe0bb7040817df4b8a87d4b.1920x1080.jpg?t=1789512680), [E05](https://kappagames.itch.io/multiverse-idle/devlog/1121838/v02-the-great-balance-patch), [E06](https://www.reddit.com/r/incremental_games/comments/1qeqz0u/web_itch_demo_out_for_multiverse_idle_an/).

Caps, milestones, reset counts, costs, cooldowns, chances and quantity ranges are shown. Developer explains main/secondary stats; v0.2 patch revises scaling.

Implementation: Exact formulas, rounding, RNG, seeds, pity and numeric representation unread.

YAIRPG proposal: K3/K10; P01/P04 shared breakdowns, preserve local units and source-qualified knowledge.

## A09: Time and scheduling

Status: partial. Sources: [S02](https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/4122910/e00ddf0b591c63e6a7a76f1e474943aab8551d94/ss_e00ddf0b591c63e6a7a76f1e474943aab8551d94.1920x1080.jpg?t=1789512680), [S06](https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/4122910/cf4cb1fb8e94f6b5dfe0bb7040817df4b8a87d4b/ss_cf4cb1fb8e94f6b5dfe0bb7040817df4b8a87d4b.1920x1080.jpg?t=1789512680), [E06](https://www.reddit.com/r/incremental_games/comments/1qeqz0u/web_itch_demo_out_for_multiverse_idle_an/).

Training rate, accelerated training, offline-stamina meter and skill cooldowns visible; developer discusses web minimized-window progress issue.

Implementation: Elapsed ledger, caps, catch-up recipients and time commit algorithm unread. No offline return summary viewed.

YAIRPG proposal: K18/K26/K32; P13 must retain frozen branch policy and decision stop boundaries.

## A10: Onboarding and reveal

Status: partial. Sources: [S02](https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/4122910/e00ddf0b591c63e6a7a76f1e474943aab8551d94/ss_e00ddf0b591c63e6a7a76f1e474943aab8551d94.1920x1080.jpg?t=1789512680), [S06](https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/4122910/cf4cb1fb8e94f6b5dfe0bb7040817df4b8a87d4b/ss_cf4cb1fb8e94f6b5dfe0bb7040817df4b8a87d4b.1920x1080.jpg?t=1789512680), [E02](https://kappagames.itch.io/multiverse-idle), [E05](https://kappagames.itch.io/multiverse-idle/devlog/1121838/v02-the-great-balance-patch).

Goal panel and limited versus fuller navigation shown in different captures. Patch states tutorial-gated Ally/Gear access. Old user missed next world.

Implementation: Exact unlock order and eligibility handlers unread; screenshots are not a recorded progression sequence.

YAIRPG proposal: K4/K11/K14; MI-P04 discovery and current usability stay distinct.

## A11: Little touches

Status: covered. Sources: [S01](https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/4122910/3d28194e3955e9c81f40d4568c429403c92308e3/ss_3d28194e3955e9c81f40d4568c429403c92308e3.1920x1080.jpg?t=1789512680), [S02](https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/4122910/e00ddf0b591c63e6a7a76f1e474943aab8551d94/ss_e00ddf0b591c63e6a7a76f1e474943aab8551d94.1920x1080.jpg?t=1789512680), [S03](https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/4122910/ebc9b5373b80181458ebde399109e22095b6dc35/ss_ebc9b5373b80181458ebde399109e22095b6dc35.1920x1080.jpg?t=1789512680), [S05](https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/4122910/b2fdfdd17852c74c1e2b67384b3d8052564bae52/ss_b2fdfdd17852c74c1e2b67384b3d8052564bae52.1920x1080.jpg?t=1789512680), [S06](https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/4122910/cf4cb1fb8e94f6b5dfe0bb7040817df4b8a87d4b/ss_cf4cb1fb8e94f6b5dfe0bb7040817df4b8a87d4b.1920x1080.jpg?t=1789512680), [E02](https://kappagames.itch.io/multiverse-idle).

26 scoped adaptations recorded in SMALL_TOUCHES: persistent identity, meaningful inspector groups, capacity, trigger labels and practical discoverability.

Implementation: Visual feedback is shown; animation, audio, key bindings and accessibility behavior untested.

YAIRPG proposal: K14/K19/K23; source supports ideas, not shipped accessibility proof.

## A12: Other systems

Status: partial. Sources: [S01](https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/4122910/3d28194e3955e9c81f40d4568c429403c92308e3/ss_3d28194e3955e9c81f40d4568c429403c92308e3.1920x1080.jpg?t=1789512680), [S04](https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/4122910/83dce1439a886648a42afdad8e57be7ea2ec020a/ss_83dce1439a886648a42afdad8e57be7ea2ec020a.1920x1080.jpg?t=1789512680), [S06](https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/4122910/cf4cb1fb8e94f6b5dfe0bb7040817df4b8a87d4b/ss_cf4cb1fb8e94f6b5dfe0bb7040817df4b8a87d4b.1920x1080.jpg?t=1789512680), [E05](https://kappagames.itch.io/multiverse-idle/devlog/1121838/v02-the-great-balance-patch).

Formation/pets slots, artifacts/dust, set progress, Siege, rank and rebirth labels expand inventory of possible systems.

Implementation: Pet behavior, rebirth consumers, economy sinks and complete content corpus unread; labels are not execution proof.

YAIRPG proposal: K3/K9/K10/K15/K16; only adapt a system with a real current native consumer.
