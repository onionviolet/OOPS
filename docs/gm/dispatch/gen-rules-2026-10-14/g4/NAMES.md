# G4 name grammars and collision filters

2026-10-14. **PROPOSAL ONLY.** All samples are illustrative original proposals,
not accepted cast, generated runtime results or claims of trademark clearance.
Each world's 20 rows pair a possible codename with a civilian name: 80 paired
outputs, 160 strings. An ordinary start has no codename unless the person
actually adopts one. A suggested name does not grant hero status or power.

Owners: [root CG2, SB13/SB26](../../../../GENERATION_FOUNDATION_RULES_2026-10-14.md#subtle-stuff-round-2-sb18-sb26),
[P7 guidelines](../../procgen-2026-10-13/p7/GUIDELINES.md),
[P7 data shape](../../procgen-2026-10-13/p7/DATA_SHAPE.md),
[PROFILES source keys](PROFILES.md#source-boundary-and-locators) and
[variant identity](VARIANTS_AND_LEGACY.md#cg1-one-person-three-earths).
P4/P7 still own person/name lifecycle. No new world-specific name engine.

## Grammar inputs and validation

| Code | Layer | Concrete authoring contract |
|---|---|---|
| N1 | Civilian input | Culture/region/era, household ID, selected given-name pool, family-name pool, name order and alias conventions. Select a household surname once, given names per person. No surname implies power, allegiance, biological parentage or inherited technique. Exact kanji/translation meanings need author review. |
| N2 | Codename input | Adopted persona, user-chosen public theme/effect tags, profession symbolism, era tone, title entitlement and locale. Hidden origin, hidden weakness, sealed traits and future kit are excluded even if a dramatic name would fit them. A deliberately misleading persona is authored with a stated public claim. |
| N3 | Choice | Pick grammar family with integer weights, then tokens from compatible pools. Output stores token IDs, selected spelling, alias links, pronunciation/locale metadata where authored, and source/pool revision. Stable subject/domain/attempt addresses; no shared sequential name bag. |
| N4 | Canon reservation | Versioned union of selected world's canon names, civilian identities, codenames, aliases/transliterations, prior original cast and admitted crossover pack reservations. Verified examples: Worm W2 `Lung`, `Bakuda`, `Canary`; M1/M2 reserved exceptional name `One For All`; B1 F7 `Iron Fist`, `Doctor Fate`, `Green Lantern`, `Robin`. Additional remembered aliases are MEMORY until sourced. |
| N5 | Brand reservation | Versioned editorial blocklist for known franchise/brand marks, characteristic near-spellings and distinctive identity bundles. Track term, alias forms, reason and provenance. This is a content filter, not a legal test; no exhaustive registry/current trademark search was performed. The Big Two/original public pools need a reviewed cross-franchise list before admission. |
| N6 | Normalization | Pin a Unicode normalization revision; compare NFKC/casefolded forms with punctuation/spacing normalization. Author explicit alias/transliteration keys; diacritic-stripped and confusable keys produce review flags where overly broad equivalence would lose a real distinction. Preserve display spelling. Stable sorting by code point, never locale-sensitive ordering as draw input. |
| N7 | Conflict response | Exact reserved alias or existing full codename collision rejects. Same full civilian-name collision gets another eligible full-name candidate or authored distinguishing name; shared family surname alone is allowed. Near match/common-word name raises review rather than globally banning a whole language's ordinary word. Signature name+power+emblem resemblance is a bundle flag, not only edit distance. |
| N8 | Retry / fallback | At most 8 addressed candidate attempts; then scan a finite reviewed fallback pool in stable seeded order and claim the first eligible entry. If exhausted, use a neutral unique record handle (`Crew member A7C2`) and flag pending author naming. That handle is not an adopted codename. A rejected name changes no power/event draw. Counts/reasons go to receipts. |
| N9 | Commit / freeze | Preview is provisional, with no namespace claim. Commit atomically reserves normalized keys with actor/root/persona refs and saves actual displayed result/revision on reveal. Race loser uses the next addressed attempt. Rename is a caused transaction retaining the old alias; a patch never silently renames seen people. |

Reservation keys include the collision family and admitted continuity scope.
For SB26, duplicate generated codenames across Earths are allowed **only for
the same declared root person**. Independent roots that collide redraw before
reveal. Meeting two previously isolated/frozen casts preserves their seen names;
the crossing gate flags the conflict and supplies explicit continuity labels or
an in-fiction rename, not a retroactive silent replacement. Canon/trademark
reservations still block a counterpart from accidentally taking a reserved name.

An authored mantle label is reserved to its mantle record. Holders use explicit
title claims with tenure/continuity labels; they do not ask the codename generator
to mint that name again. Copycats need an authored intentional impersonation
route and a distinct claim/persona, not a free collision exception. Civilian and
codename mappings remain private until an actual identity-link observation.

### Filter fixtures for later implementation

| Case | Expected result |
|---|---|
| `Lung`, ` LUNG ` or known transliteration alias in a Worm candidate | Reject as reserved; receipt gives safe reservation category, not a secret actor identity. |
| `Green-Lantern` or spaced/punctuation variant in a public pool | Reject by normalized reserved alias. |
| Two generated `Copperhum` personas in different Earths with same root | Permit intentional counterpart name; keep separate knowledge/personas. |
| Two independent roots propose `Copperhum` | Reject later unseen candidate; no power reroll. |
| Two household members named Elena Mercer and Omar Mercer | Permit shared surname; distinct full names. |
| Frozen collision discovered on crossover | Preserve frozen text, show contextual label and offer caused rename. |

These are specified fixtures, **not a filter run**. Current illustrative samples
passed only the static uniqueness check reported in REPORT, not complete canon,
brand, language or cultural review. Collision packs/approved pools remain OPEN.

## Worm / Ward grammar

Source W2/W3 shows varied codenames but no measured naming frequency. All grammar
weights are original: coined material/action compound 60; concise evocative noun
25; public role metaphor 15. Inputs: public effect metaphor, practical tone,
chosen persona, agency/community voice and era. Examples use coined compounds
to reduce accidental canonical matches; exact rarity is not asserted.

Civilian grammar: `given + household-family`, North American city cohort;
other cohorts use their own authored culture pools. Sample tokens are pools,
not a rule that every resident has an Anglophone name. Given/family components
may recombine after full-name/household validation. Ward uses the same compatible
cohort shape with reconstruction occupations, not inherited knowledge from Worm.

| ID | Illustrative codename | Illustrative civilian name |
|---|---|---|
| W-N01 | Latchgrain | Elena Mercer |
| W-N02 | Siltwake | Omar Keene |
| W-N03 | Copperhum | Naomi Telford |
| W-N04 | Rafterstep | Simon Halden |
| W-N05 | Cindertally | Priya Fenwick |
| W-N06 | Stitchwake | Leon Armitage |
| W-N07 | Chalkcurrent | Imani Harrow |
| W-N08 | Rivethush | Felix Denholm |
| W-N09 | Glassfurrow | Mara Whitcomb |
| W-N10 | Brinefold | Theo Pritchard |
| W-N11 | Mothledger | Leila Ashcombe |
| W-N12 | Treadglint | Jonah Selwyn |
| W-N13 | Tinwhistlework | Celia Nordin |
| W-N14 | Wickscatter | Ravi Bellamy |
| W-N15 | Gritweft | Anika Corbin |
| W-N16 | Flinthinge | Marcus Elden |
| W-N17 | Thimblewake | Tessa Langford |
| W-N18 | Shalehum | Daniel Roscoe |
| W-N19 | Coilmeadow | Amina Wexler |
| W-N20 | Meshglimmer | Nora Beckett |

## My Hero Academia grammar

M1 glossary コードネーム supports self-chosen names, including students, but
does not establish a grammar distribution. Original weights: effect/tool
compound 55; helpful-action metaphor 30; reviewed wordplay 15. Optional public
descriptor: `the <service/effect> hero: <core>` only when that title is actually
used; it grants no license. Hero names can use reviewed loanwords. Avoid raw
effect name copied from the Quirk registry as a full identity.

Civilian grammar here: `family + given` in romanized Japanese order, using
reviewed separate family/given token pools, with household consistency. These
spellings imply no exact kanji, meaning or guaranteed naturalness; language
review remains a gate. Do not fabricate cultural meaning from an English gloss.
Manga/anime canonical full names and their alternate orders/translations reserve
both normalized forms before runtime admission.

| ID | Illustrative codename | Illustrative civilian name |
|---|---|---|
| M-N01 | Foamflutter | Naruse Haruto |
| M-N02 | Ribbonrelay | Wakase Mina |
| M-N03 | Puffrivet | Kurose Ren |
| M-N04 | Cushioncomet | Hoshino Nao |
| M-N05 | Magnetmender | Mizuno Akari |
| M-N06 | Bubblebrace | Takase Sora |
| M-N07 | Springstitch | Fujisawa Yui |
| M-N08 | Prismparcel | Sakuma Daichi |
| M-N09 | Humstep | Kirino Mei |
| M-N10 | Looplifter | Morisaki Riku |
| M-N11 | Glowgasket | Ogasawa Rina |
| M-N12 | Petalpivot | Hayase Kenta |
| M-N13 | Mistmitt | Nishimori Aya |
| M-N14 | Chimecatch | Uehara Shun |
| M-N15 | Gripglider | Tsuruno Hina |
| M-N16 | Sparkseam | Aoyagi Itsuki |
| M-N17 | Bouncebracket | Sugimori Yuna |
| M-N18 | Cablecarousel | Kawatani Rei |
| M-N19 | Plumehoist | Matsuse Toma |
| M-N20 | Drizzleweld | Kitamori Emi |

## Big Two pattern grammar

Source B1 provides title/succession leads. Era naming convention is MEMORY
and design inference, not a sourced statistical law. Original Silver-style
weights: entitled title + coined compound 50, adjective + compound 30,
compound alone 20. Modern-style weights reverse to 10/20/70. `Captain` or
`Doctor` must be a chosen public persona with a truthful or explicitly authored
claim; neither grants military/medical authority. A real mantle name is pinned,
not selected from ordinary title tokens.

Civilian grammar: `given + family`, optional culturally authored middle/style
slots, scoped to region/era/household. An international shared universe needs
separate culture pools and surname orders, not one global English bag. Samples
use one city cohort; their variety is illustrative, not demographic sampling.

| ID | Illustrative codename | Illustrative civilian name |
|---|---|---|
| B-N01 | Captain Aurorail | Dalia Voss |
| B-N02 | Doctor Lumenloom | Adrian Bellwick |
| B-N03 | Silver Tidemarkle | Mina Ellery |
| B-N04 | Brass Skylattice | Tomas Renshaw |
| B-N05 | Amber Riftspindle | Nia Calder |
| B-N06 | Cobalt Starfurrow | Elias Thornley |
| B-N07 | Velvet Orbitweft | Soraya Hale |
| B-N08 | Captain Sunwicket | Julian Wetherby |
| B-N09 | Doctor Quasarquill | Amara Denton |
| B-N10 | Jade Cloudrivet | Nolan Fairchild |
| B-N11 | Duskferrule | Livia Soren |
| B-N12 | Nebulatch | Mateo Ridley |
| B-N13 | Voltbarrow | Farah Winslow |
| B-N14 | Helioweave | Owen Merrow |
| B-N15 | Prismharborer | Vera Kingswell |
| B-N16 | Lunarivet | Idris Talbot |
| B-N17 | Astralspool | Nina Marlow |
| B-N18 | Kinetiweft | Hugo Linton |
| B-N19 | Fluxpilaster | Sana Greaves |
| B-N20 | Cinderoriel | Eva Bramwell |

## Masked City grammar

Original civic naming culture uses neighborhood/material/service metaphors,
not franchise emblems. Weights: work/material compound 65, civic/place compound
25, entitled office label 10. The office branch resolves an already authored
mantle claim; no random office is minted. Samples use the first two branches.
Inputs include public skill/source, adopted persona and district/charter era.

Civilian grammar: `given + household-family` from original city cohort pools;
household names may be geographic/occupational without implying office rights.
Define other cultures as separate pool overlays. Protect existing original names,
the fixture Arun Vale and Beacon of the Quay before admitting these candidates.

| ID | Illustrative codename | Illustrative civilian name |
|---|---|---|
| O-N01 | Quaystitch | Leda Marrin |
| O-N02 | Viaductglow | Oren Pell |
| O-N03 | Gutterchime | Talia Reedwell |
| O-N04 | Tramweft | Niko Daven |
| O-N05 | Lanternsplice | Mira Colven |
| O-N06 | Curbwhistle | Ivo Hartwell |
| O-N07 | Archpatch | Sela Norwick |
| O-N08 | Switchyardgleam | Remy Tern |
| O-N09 | Dockmender | Asha Weller |
| O-N10 | Signalspindle | Belen Orwick |
| O-N11 | Pavingprism | Kian Rowden |
| O-N12 | Rivetbeaconer | Esme Marden |
| O-N13 | Drainbraid | Talin Cress |
| O-N14 | Kerbstarling | Una Delmar |
| O-N15 | Causewayhum | Devin Fallow |
| O-N16 | Trestlewink | Liora Bexley |
| O-N17 | Meterflourish | Samir Cotter |
| O-N18 | Handrailhalo | Rhea Woodmere |
| O-N19 | Culvertlace | Elian Northwell |
| O-N20 | Depotwhorl | Noor Bracken |

## Later acceptance

Seed/golden/reload/import fixtures must preserve actual name, household,
persona, alias history and namespace claims. Candidate rejection changes only
the name attempt address. Unknown collision packs prevent admission into an
approved public content pool until reviewed; these documents remain useful
illustrations. No trademark clearance or complete canon-cast survey is claimed.
