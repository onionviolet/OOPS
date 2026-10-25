# Protolike and cultivation project discovery, 2026-10-22

Follow-up: the [four-project deep comparison](protolike-deep-2026-10-22/REPORT.md)
traces selected shipped/public code, compares current YAIR owners and proposes
distinct-world signature loops. The initial screening below retains its original
evidence boundary.

2026-10-24 follow-up: [protolike UI references](PROTOLIKE_UI_REFERENCES_2026-10-24.md)
covers the Cultivate card, job rows and assembly-crafting tabs from supplied screenshots.

Research requested by Weibao: inspect Cultivating All the Above and find similar
projects absent from our usual references. Follow-up explicitly adds GauTech's
experimental RPG, btly0711's NekoRPG and Ihtasham42's original Progress Knight.

Scope: public source and developer-page screening. No installations, gameplay
trials, runtime changes, source absorption, purchases, commits or publication.
Applies AD32 (findings are proposals), AD35 (bounded source evidence), AD36
(verification claims match checks) and the source-research router. Existing
direction and first-milestone scope remain authoritative in PROJECT.md and
USER_VISION.md. Rankings below concern follow-up research value, not game quality.

## Findings

**F1: CATA is a direct reference-family match, but currently a UI prototype.**
Its README explicitly names Proto23, YAIRPG and NekoRPG as inspirations and says
there is no actual game to play yet. At inspected revision
`35ef6a1086261cfb1b91249bb789545382607aa9`, `src/main.js` unlocks every box for
testing, awards test XP and installs test titles and resource values.
`src/content/qi_cultivation.js`, `locations.js`, `skills.js` and `bloodlines.js`
contain only a strict-mode directive. The rendered-shell HTML includes Qi,
body, soul, bloodline and stellar tabs, plus modern/cultivation world maps;
those labels do not establish working progression or world travel.

Existing source does support inspecting number formatting, English/Traditional
Chinese localization, title selection and compact paired stat rows. The latest
changelog heading inspected is v0.0.4.4, dated 2026-10-12. Use as a presentation
reference; defer mechanical comparisons until it has an actual loop.

Sources: [repository and README](https://github.com/onko342/cultivating-all-the-above),
[pinned initialization](https://github.com/onko342/cultivating-all-the-above/blob/35ef6a1086261cfb1b91249bb789545382607aa9/src/main.js),
[pinned cultivation file](https://github.com/onko342/cultivating-all-the-above/blob/35ef6a1086261cfb1b91249bb789545382607aa9/src/content/qi_cultivation.js),
[changelog](https://onko342.github.io/cultivating-all-the-above/changelog.html).

**F2: NekoRPG deserves a focused source comparison.** Its README calls it a
deeply modified YAIRPG. Chinese help documents realm advancement, a realm-based
clock, part-to-equipment crafting, quality calculations and batch crafting.
The served HTML also contains family management and distinct interactive
production activities. These are documented/source-visible features, not a
verified ordinary-play journey. The help header and changelog describe different
versions, so its claimed endpoint should not be treated as current coverage.

The GitHub API reports `fork: false` for both NekoRPG and GauTech. Thus a search
restricted to GitHub's YAIRPG fork network can miss these derivatives. This
explains a concrete discovery gap without claiming an exhaustive ecosystem map.

**F3: Small cultivation life sims are another useful discovery channel.**
Sect Chronicle and Cultivation Stories advertise relationships, retained world
history, institutions and lives beyond personal numerical advancement. These
are close to YAIR's broader direction, but their simulation depth remains a
play/source question. Developer descriptions alone cannot establish emergence.

## User-supplied comparison set

| Code | Project | Checked evidence and relevance | Prior local coverage / disposition |
| --- | --- | --- | --- |
| C1 | [GauTech experimental RPG](https://gautech.github.io/experimental-idle-rpg/) | Pinned changelog describes mana/cooldown spells, auto-cast, reading to unlock spells/stances, rereading and allies. `magic.js` contains spell records; `allies.js` explicitly describes untargetable damage platforms. | Already covered in `docs/RESEARCH_IDLE_GAMES.md`, including exactly the same revision. Reuse existing findings; deepen only a named unresolved mechanism. |
| C2 | [NekoRPG](https://btly0711.github.io/NekoRPG/) | Direct YAIR derivative with Chinese help and source-visible cultivation/crafting/family systems. Closest structural comparison in this pass. | No exact title/author match in searched public Markdown before this report. User explicitly supplied it during the search, so do not call it unknown to Weibao. Prioritize a bounded comparison. |
| C3 | [Progress Knight, original](https://ihtasham42.github.io/progress-knight/) | Creator README describes jobs, skill requirements, income versus expenses, aging and next-life XP multipliers. Useful for readable career dependencies and progression pacing. | Exact original repository already linked in `RESEARCH_IDLE_GAMES.md`. Distinguish this version from later Quest/other forks. Reuse existing research. Its reset policy is a source behavior, not a YAIR requirement. |

Revisions inspected: GauTech
`e432dfa18e26cc2bb0923cddeff0cf9ea8f49f33`; NekoRPG
`652237ec361239b355172a1f97d7608636ef2eac`; Progress Knight
`f6dd0c3c444d838f80325bbdca918160b99e89e5`.

Primary source locators:
[GauTech changelog](https://github.com/GauTech/experimental-idle-rpg/blob/e432dfa18e26cc2bb0923cddeff0cf9ea8f49f33/changelog.html),
[GauTech allies](https://github.com/GauTech/experimental-idle-rpg/blob/e432dfa18e26cc2bb0923cddeff0cf9ea8f49f33/src/allies.js),
[Neko source](https://github.com/btly0711/NekoRPG),
[Neko help](https://github.com/btly0711/NekoRPG/blob/652237ec361239b355172a1f97d7608636ef2eac/help.html),
[Progress Knight README](https://github.com/ihtasham42/progress-knight/blob/f6dd0c3c444d838f80325bbdca918160b99e89e5/README.md).

## Additional candidates

Except where stated, features below are developer-documented and unplayed here.
The suggested checks are research proposals, not dispatched implementation work.

| Code | Project | Why it merits consideration | State / useful next check |
| --- | --- | --- | --- |
| C4 | [Cultivation: Sect Chronicle](https://matogrand.itch.io/cultivation-sect-chronicle) | Manuals and clues; disciple work, Hall Master delegation, relationships and inherited sect membership after death; regional events and scenario authoring. | Windows v0.5 playtest listed. First check whether a relationship, delegated duty and inherited obligation actually persist and alter available actions. High research value for ordinary lives and institutions. |
| C5 | [Cultivation Stories](https://timany19.itch.io/cultivation-stories) | Developer says it simulates centuries of sect/family history before character creation; crafting, body-part combat, lasting wounds and additional characters in the same world. | Early demo 0.2.5.7; current downloads list Windows/Linux. Demo advancement stops at Qi Condensation layer 1. First check whether generated history causally changes an NPC interaction, rather than supplying background text alone. |
| C6 | [Endless Path](https://github.com/LionelEisenberg/EndlessPath) | Cradle-inspired cycling activity, idle foraging/training, procedural hex adventures, ability loadouts and real-time combat. | Current README describes a Foundation-only slice; breakthrough absent, crafting mini-games planned. Inspect one cycling-to-adventure reward loop. Public Godot project, no ready release validated here. |
| C7 | [CultivationIdle, shlocko](https://shlocko.github.io/CultivationIdle/) | Smaller browser project with source files for aspects, techniques, meditation, training, adventure, combat and smithing. | [Source](https://github.com/shlocko/CultivationIdle) at `63a70dcf7b9b6af9f5ca37a68cbdb231f642d144`. File presence is screening evidence only. First establish a reachable technique choice that changes combat. |
| C8 | [Myriad Immortal Sect](https://idlecultivation.com/) | Advertises offline cultivation plus an active walkable world, herb/gear acquisition, sect ranks and asynchronous duels. | Browser service with free early portion and paid later content. Check how active exploration and offline cultivation complement each other. No account creation or payment performed. |
| C9 | [Nine Heavens Ascent](https://vbgnt.itch.io/nine-heavens-ascent) | Body cultivation, tribulation activity, techniques/pills and later progression layers, with an exportable save advertised. | Browser game. More focused on layered incremental progression than lived-world simulation. Trial one body/qi interaction before treating its many layers as useful depth. |
| C10 | [Idle Cultivation World](https://veudaimonia.itch.io/idle-cultivation-world) | Disciples, technique research, expeditions and a lore codex. | HTML5 prototype explicitly seeking feedback. Lower-priority trial for expedition previews and contextual explanation; no broad depth claim verified. |
| C11 | [Cultivation Quest Prototype](https://marrow-tap.itch.io/cultivation-quest) | Another cultivation idle demo; source of comparison for how a cultivation progression loop is introduced. | HTML5 and Windows/Linux builds listed. Existing public page calls it a prototype and lists a final major update in March 2025. Screen before a deeper pass. |

Endless Path current README was fetched at
`430b3f1c748fba86d6fa5ca197663be72b6e2ab6`. Its state document retains an older
snapshot and several claims that differ from the newer README. Do not repeat its
old inactivity, test totals or exact deficits as confirmed current. Foundation
limit and unbuilt breakthrough agree across the inspected documents.

## Coverage, recommendation and limits

Search used creator/developer pages, GitHub repository search for protolike,
NekoRPG and cultivation/incremental terms, and comparison with the existing
idle-game dossier and October 13/14 inventories. Exact title/author searches of
public `docs/**/*.md` excluded private/novel paths and response dumps in the
final bounded check. No matching public entry was found for C2/C4/C5/C6/C7/C8/C9/C10/C11.
This means apparently uncatalogued in those searched files, not unknown to every
chat, private source or person. Cavernous, Immortality Idle, Idle Superpowers,
Theory of Magic and the Progress Knight lineage already have local references
and are not presented as discoveries.

Recommended research order: C2 for the closest YAIR-derived mechanisms, C4 for
sect institutions and retained lives, C5 for historical-world consequences,
then C6 for a distinct cultivation interaction model. CATA remains a UI reference
until its gameplay exists. These priorities add no automatic implementation gate.

Verification: fetched public repository metadata/trees, pinned selected source
files and current developer pages; compared local dossiers and searched title
coverage. Web extraction failed on CATA and GauTech's game URLs, so inspection
switched to GitHub/raw source. CATA HTML was also fetched directly. No gameplay,
persistence, performance or platform-compatibility trials ran. No runtime inputs
changed, so build/test gates were not applicable to this research-only report.

Code-reuse licensing is unresolved for several public repositories. GitHub
reports MIT for GauTech and Unlicense for original Progress Knight; no repository
license detected for CATA, NekoRPG, Endless Path or shlocko's project. No code was
copied into gameplay. A selected adaptation would need its own provenance,
compatibility and rebuilt playable checks.
