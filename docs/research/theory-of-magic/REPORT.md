# Theory of Magic source audit, 2026-10-09

Theory of Magic offers a strong model for growing a wizard's life out of ordinary work, study and a useful home. For YAIR, the best first proposal is a native manual that teaches a practical technique, with its use still depending on a tool and practice. This is research, not permission to implement a new wave.

**F1 Source bound.** The community source revision is `a2632d2edf3e07e9168fff81167b11f2792e9197`. Its README points to the testing repository; [the title and author metadata](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/index.html#L5) and [CONTRIBUTORS](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/CONTRIBUTORS#L1) bind it to Theory of Magic. The original alias redirects to [Justin Lacy's repository](https://gitlab.com/justin.lacy/arcanum); identity-only snapshot `35437ed4869856220d17ea9564b339cd02b03035` is retained separately. The user's open instance was not located by the parent, so these are source findings, not claims about that exact build.

**F2 A useful loop.** [Study](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/data/tasks.json#L69) produces research while scroll holdings improve its rate and capacity. [Desks and craft tables](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/data/furniture.json#L324) improve concrete tasks, and [scribing and binding](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/data/tasks.json#L932) turn knowledge into objects. This suggests connecting YAIR's books, Literacy, gathering and crafting rather than adding an isolated research currency.

**F3 Prestige correction.** [The Hall glossary](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/data/hall.json#L27) explicitly preserves character progress, allows switching characters, and saves prestige separately. It is not evidence for forced rebirth. [Hall code](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/src/modules/hall.js#L137) and [character switching UI](https://gitlab.com/mathiashjelm/arcanum/-/blob/a2632d2edf3e07e9168fff81167b11f2792e9197/src/ui/hall/hall.vue#L42) support that static reading; switching and retention were not run.

## Ranked proposals

| Rank | Code | Proposed play | Why it belongs |
|---|---|---|---|
| 1 | P1 | Make study change what a character can do | Highest: connects existing books, ordinary skills and work without selecting a new magic world. |
| 2 | P2 | Let the Shack become a working home | High: a lived place develops through work; audit existing Proto23 and home-workshop owners before duplicating them. |
| 3 | P3 | Show why a routine stopped | High: visible agency and predictable idling; Theory runner is evidence, not a YAIR API. |
| 4 | P4 | Make an apprenticeship a chapter in a life | Medium-high: careers connect people, work and lasting biography; no forced master murder or replacement opening. |
| 5 | P5 | Keep basic learning useful beyond its first unlock | Medium: ordinary skills remain relevant; numerical balance is an original proposal. |
| 6 | P6 | Turn expendable notes into lasting understanding | Medium: one material chain creates tangible research; Theory sublimation is not proof of cross-life persistence. |
| 7 | P7 | Put progress explanations in the existing center menu | Medium: clear choices help dense systems feel manageable. |
| 8 | P8 | Explore prestige that preserves a lived character | Later: strong conceptual alternative, but largest persistence scope and not the next content wave. |

These are original proposals. Keep vanilla opening, quests, skills and center-menu play. P1-P3 are the strongest bounded candidates; P8 needs a persistence design decision and belongs later. Existing study/workshop lanes should be checked before any new content duplicates them. Current PROJECT.md acceptance backlogs remain ahead of a new implementation wave.

## Current YAIR fit

**F4 Existing foundation.** Live source already has counted single-command routines and pause/resume (`src/simulation.js:311-329`), a bounded compact biography (`src/life_record.js:41-47`), a 4 MiB origin save guard (`src/save_files.js:166-190`) and a bounded predetermined household (`src/npc_lives.js:5-39`). Reading already shows time remaining and a progress bar (`src/display.js:4457-4471`). P3 and P7 extend native legibility and useful consequences; they are not claims that these foundations are absent. All are source-present, with no runtime verification by this audit.

## Small original touches

The 24 touches below are original YAIR ideas prompted by the inspected systems, not a list of features claimed present in Theory of Magic. Precise inspiration evidence and native source mapping are in FINDINGS.json.

- **T01** A book row says “three pages remain” using native remaining time. Native fit: `src/items.js:1138-1140`.
- **T02** The first completed manual leaves a dated bio entry. Native fit: `src/items.js:1143-1152; src/life_record.js`.
- **T03** A newly understood technique says which tool enables it. Native fit: `src/activities.js:60-73`.
- **T04** An old manual gains a brief player-authored margin note after useful practice. Native fit: `src/items.js:1092-1107`.
- **T05** A study stand description names the person who made it. Native fit: `src/crafting_recipes.js:45-71; src/data/locations.js:363-370`.
- **T06** A home task previews the exact local benefit of its furnishing. Native fit: `src/data/locations.js:363-370; src/display.js`.
- **T07** One installed bench receives a small scuff description after repeated work. Native fit: `src/crafting_recipes.js:45-71; src/life_record.js`.
- **T08** A returning resident sees one sentence about their furnished Shack. Native fit: `src/data/locations.js:363-370`.
- **T09** Paused reading says “stopped by you” distinctly from a missing requirement. Native fit: `src/main.js:2248-2301`.
- **T10** A completed target displays one quiet completion sentence instead of repeating it each tick. Native fit: `src/main.js:2292-2301; src/display.js:767`.
- **T11** An activity row previews stop-at-target beside Start. Native fit: `src/activities.js:16-43; src/display.js`.
- **T12** A stopped craft says which ingredient ran out. Native fit: `src/crafting_recipes.js:104-150`.
- **T13** Mentor dialogue remembers the first commissioned item. Native fit: `src/data/dialogues.js; src/data/npcs.js`.
- **T14** A craft graduation title names the trade, not a universal power tier. Native fit: `src/data/dialogues.js; src/life_record.js`.
- **T15** First paid fieldwork records the first honest wage. Native fit: `src/activities.js:84-90; src/life_record.js`.
- **T16** A deferred commission gets a neutral “still waiting” line. Native fit: `src/data/dialogues.js`.
- **T17** A Literacy milestone names the practical recipe it helped unlock. Native fit: `src/data/skills.js:2539-2565; src/crafting_recipes.js:45-71`.
- **T18** Meditation training has a local sensory line at the Shack. Native fit: `src/activities.js:130-135; src/data/locations.js:363-370`.
- **T19** A bound field notebook lists its contributing gathering skill. Native fit: `src/crafting_recipes.js:45-71; src/activities.js:60-73`.
- **T20** Consuming a duplicate manual explicitly previews item loss and learned benefit. Native fit: `src/items.js:1092-1152; src/native_storage_transaction.js`.
- **T21** A learned method remembers the place it was studied. Native fit: `src/life_record.js; src/data/locations.js`.
- **T22** Book list filtering matches titles without exposing unread rewards. Native fit: `src/display.js; src/items.js:1092-1152`.
- **T23** A task row exposes the same requirement to keyboard focus as hover. Native fit: `src/display.js; src/main.js:2248-2301`.
- **T24** A future prestige preview lists people and belongings kept or left behind in plain language. Native fit: `PROJECT.md: Accepted decisions; src/save_files.js`.

## What was checked

Read-only source passages cover research, selected early progression, jobs, furnishing, material-to-knowledge conversion, task stopping/resuming, Hall prestige and static UI. Both shallow copies are hashed in INTAKE.json. No game launch, build, dependency installation, browser play, save access, YAIR source edit or commit occurred. The complete game, exact open build, actual pacing and rendered UI remain unverified. Detailed bounds are in COVERAGE.json; future bounded proofs are in IMPLEMENTATION_PACKETS.md.
