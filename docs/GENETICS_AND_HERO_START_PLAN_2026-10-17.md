# Genetics and hero start: implementation plan, 2026-10-17

Weibao, 2026-10-17: "send new chat to make plans on properly doing and implementing genetics
and hero selection stuff and more?" ([USER_VISION](USER_VISION.md#genetics-and-hero-start-plan-2026-10-17)).

**Status: proposal.** Nothing here is accepted or built. It turns existing palettes into a
build plan; it does not restart them. Codes **GHS1–GHS114** identify this plan's rows
(round 1: GHS1–GHS40; round 2: GHS41–GHS65; round 3: GHS66–GHS83; round 4: GHS84–GHS111;
2026-10-18 core-rule reconciliation: GHS112–GHS114).
Rules applied: AD3, AD5, AD7, AD8, AD10–AD13, AD23, AD33, AR1–AR16, UR13, UR40–UR48, UR53,
CX1–CX8, sealed secrets, save safety. Viewports: 1920×1080 primary, MacBook about 1800×1040,
floors 1536×864 and 1366×768 (UI_RULES, 2026-10-17).

Owners this builds on (read them for detail; this file links, it does not copy):

| Owner | What it gives this plan |
|---|---|
| [Genetics palette](GENETICS_CONSTITUTIONS_AND_BROOD_PLAY.md) | G1 layers, G11 split, GN1–12, SG1–13, AB1–AB12 abstraction candidates, ST-A–ST-F stability, MT1–MT7, fold top picks |
| [Starts palette](STARTS_ENDINGS_AND_RANDOMNESS_PALETTE.md), [intro index](INTRO_AND_STARTS_INDEX_2026-10-14.md), [intro flow](INTRO_FLOW_CONSIDERATIONS_2026-10-13.md) | P1 axes, LY1–LY12 layer semantics, RX1–RX12 roll modes, WC1–WC12 start record, WQ1–WQ5 pool rules, UI1–UI14, MP1–MP10 |
| [Nonhuman engine spec](worlds/NONHUMAN_STARTS_ENGINE_SPEC_2026-10-14.md), [start specs](worlds/NONHUMAN_START_SPECS_2026-10-14.md), [kin](worlds/NONHUMAN_KIN_AND_RELATIONSHIPS_2026-10-14.md) | Body template vs instance, SS0 resolved-start receipt, SS-A hound, NK-E1–E9 kin edges, NK-I1–I8 succession |
| [Villain starts and other selves](worlds/VILLAIN_STARTS_AND_OTHER_SELVES_2026-10-14.md), [identity laws](worlds/IDENTITY_LAWS_BY_WORLD_2026-10-14.md) | Start-as-X, NS and IX dials, IL1 carriers, IL29 law record |
| [Rivals, identities and fate](RIVALS_IDENTITIES_AND_FATE.md) | Identity as a stack of claims; transfers declared as copy/move/lease/share/destroy |
| [Identity and control](worlds/PLAYER_CHARACTER_IDENTITY_AND_CONTROL_2026-10-13.md), [continuation](worlds/CONTINUATION_CHOICE_CONSIDERATION_2026-10-13.md), [core loop scoping](reviews/CORE_LOOP_SCOPING_CONSIDERATIONS_2026-10-16.md) | O1/O8 seats, P1–P3 (fresh random life usual, succession optional); heir loop not presumed core |
| [R21 feedback HR1–HR10](gm/dispatch/ui-foundation-2026-10-15/next-parts/r21-feedback-2026-10-17.md), R21b report | Panel retired; default hero; name in the You header; Beginning card on the start screen |

## Live code this plan lands on (read 2026-10-17)

- **Bio** (`src/components/bio_component.js`): `age`, `height`, `race`, `gender` strings, saved in
  `save_data.character.bio`; name on `character.name`; `global_flags.is_hero_created`. Race and
  height stat bonuses exist (`src/races.js`, `Person.addRaceBonus/addHeightBonus`) behind
  `config.use_racial_bonuses` / `use_height_bonuses`, both off. Only `prepareV06Save` migrates bio.
- **Body record** (simulation): `state.simulation.people.player.body` already carries
  `id, ownerId, controllerId, form, hands, mobile` in the book-world hosts; `body_progression.js`
  defines body sources with `origin: inherited | trained | acquired` (Natural balance is inherited)
  and `simulation.faculties.player[id].awakened` gives an expression flag.
- **Biography view** (`src/character_bio.js`) already splits heritage from learned sources and says
  it never applies a bonus or writes a second history owner.
- **Start prototype** (`src/start_records.js`, `src/data/start_layers_frontier.js`,
  `src/start_probe_ui.js`): pure seeded resolver with lock/roll/unknown per axis, tag needs/excludes,
  contributor-only rerolls and provenance. Three axes (entry, background, possessions). No save
  slice; PLAY applies the snapshot and writes one life milestone. R21b mounts it in the
  start-screen Beginning card (`src/new_game_beginning.js`).
- **Seams**: `src/domain_registry.js` (four domains), `src/layout_spec.js`, `src/panel_kit.js`
  `definePanel`, `src/center_modes.js`, `ui-preview.html` with `src/ui/preview/fixtures.js`,
  `src/seeded_streams.js` (families include `people` and `fate`; no `body` family).
- **Heirs**: `src/heir_inheritance.js` passes a bounded estate; no bloodline, body or lineage record.

## 1. What "properly" means: state, knowledge, flavour

Default per fact, with the dial a world sets and the reason. "State" means saved truth that some
consumer reads. "Knowledge" means an observer's claim about that truth (AD7, AB5). "Flavour" means
text with no consumer; it becomes state the day a consumer needs it (CX1, CX4).

| Code | Fact | Default (Village and ordinary worlds) | Dial | Reason |
|---|---|---|---|---|
| GHS1 | Species / form | **State.** `body.form` is the authority; `bio.race` stays the display label and maps in (GHS20) | Nonhuman forms through the body template (engine spec) | AD13 bodies are real; one authority per fact (AR3) |
| GHS2 | Life stage and age | **State**, as a life stage now (`bio.age` string); a birth time on the game clock when a consumer needs years | Lifespan and stage lengths per species | AD15 worlds pace differently; chronicle `ageYears` already exists |
| GHS3 | Sex, gender, address | Existing `bio.gender` is **address and presentation** (SG3, SG5). Body sex is **state only when a consumer exists** (reproduction, a world's dimorphism) and defaults to unset | Dimorphism and stat differences per world, species and setting (2026-10-10 direction cited in G19) | Avoids inventing effects; G25 migration waits for the identity view |
| GHS4 | Size and build | **State** as a size class; stat effect off by default (existing config flags become a world dial) | Height bonuses on in worlds that read reach or carry | Keeps today's balance; the code is already there |
| GHS5 | Constitution | **State.** A small set of constitution traits as body sources (`kind:'trait'`, `origin:'inherited'`) through the existing capability pipeline (MT1) | Cultivation physiques, regenerative or soul-linked constitutions as world content | G11: constitution is separate from bloodline and technique |
| GHS6 | Heritable factors | **State** in the heredity slice: a short list of factors with an expression state (AB3: latent, expressed, suppressed). Expressed ones grant through body sources; latent ones grant nothing | Heredity model per world: small polygenic factors (default), paired dominant/recessive, bloodline awakening, soul-borne, designated succession, none | GN1–GN12; "one model, not a universal account" |
| GHS7 | Bloodline | **State** only in worlds that have one; a bloodline record with its carrier (blood, soul, pact, office) and awakening state, mapped to existing `kind:'bloodline'` sources and faculties | Purity, dilution, awakening trials (BD1–BD9, BP1–BP9) | Bloodline need not be genetic (G11) |
| GHS8 | Parents and lineage | **State** as frozen references at the creation event (FD4): parent ids or `unknown`, plus a family group (NK-E3) | Depth of recorded ancestry; adopted and non-biological lines (NK-I7) | Heirs and starts both read it; freezing stops retroactive change |
| GHS9 | Appearance details | **Flavour** by default (start text, pockets) | State when a world reads recognition or disguise (RIVALS identity claims) | CX1 depth on demand |
| GHS10 | Quirks and micro states | **Flavour** until a slice gives one a consumer (LQ1–LQ22) | Per world | Same |
| GHS11 | Own expressed stats | **Knowledge = exact** for your own expressed numbers | None | AD8 own stats are exact |
| GHS12 | Own latent factors, carrier status, bloodline, true parentage | **Knowledge, unknown by default**, learned through routes: family records, a physician, a test, a trial, a cheat lens, an awakening event | Some worlds tell you at birth (clan registers); some never let you know | AD3 hidden specialness; AD6 means decide; SI1–SI6 errors and staleness |
| GHS13 | Others' view of your body | **Knowledge per observer** via existing `knowledge` effects (`person.player.*`, stage `seen`) | Recognition rules per world (IL29) | Same rule both ways (AD6) |

GHS14. **Sealed truths.** A world's authored bloodline or parentage twist is a sealed secret with
an ID in that world's secrets file, discovered only through its route. The heredity slice stores
truth like any other; projections never show a latent or sealed fact without a knowledge claim
(AR8). This plan creates no secret.

GHS15. **Balance as in-world dials.** Default effect size is small (a factor moves one capability
by one step, as Natural balance does). A world may make inheritance decisive (clan worlds,
cultivation roots) when its lore says why and an in-world agent pushes back (rivals, sects
hunting rare bodies, CN4). No global cap; compounding gets the LD5 year-of-idle check before a
world ships a decisive model.

## 2. Hero selection and the start flow

GHS16. **Entry points (default).**
- **PLAY** keeps today's default: vanilla Village, default hero, no choice needed (vanilla stays
  intact, AD23). One click, as after R21b.
- **Beginning card** (start screen, new game only) gains three actions:
  *Roll a beginning* (guided random in one click, AD23), *Choose a beginning* (opens the Beginning
  view), and the existing Optional beginning cheat choice. The card shows the current pick in one
  line ("Farmhand's child, Village, adult") so PLAY never applies something unseen (UR13).
- The name stays typed in the You header (BX1, HR4). The Beginning view shows the name read-only
  with "rename in You after you start".
- Lock is open by default only on axes the world marks open (world, entry, background,
  possessions, family in ordinary worlds). Locking body or heredity is a specific start and needs
  means (AD23): a cheat, an unlock earned after a first life, or an authored start that pins it.
  Without means those axes offer roll and unknown (GHS42).

GHS17. **Beginning view** (new surface; ui-main owns layout and round).
- Home: a full start-screen sheet over the start screen, using the center-mode contract (bottom
  back bar, Esc returns to the card, focus returns to the button, UR53) even though the shell is
  not mounted yet. Proposal for ui-main: register it through `center_modes` once that controller
  can mount pre-play; until then a start-screen host with the same contract.
- 1920×1080 and the MacBook size: three columns. Left, the axes in the world's order (LY1) with
  lock / roll / unknown per axis (RX1). Center, the start card: who you are, body line, family
  line, situation, first lead, what you carry, what you know about yourself (GHS12 shows "not
  yet known" rows rather than hiding them, UR42). Right, a draft of three rolled alternatives
  (RX draft), each one click to adopt, plus the seed.
- 1536×864 and 1366×768: two columns (axes, card); the draft becomes a strip of three chips above
  the card. Nothing scrolls the Begin button off-screen.
- *Begin* applies the receipt and closes to the running game. "Change my start" stays on the card
  until the first real action (UI14), then the receipt is final.

GHS18. **Start kinds through one record.** Every way in resolves to the same receipt (SS0 subset):
- **Layered roll**: axes resolved by the existing resolver.
- **Authored start** (start-as-X, SA1–SA24, villain-adjacent, lout): a start record that pins some
  axes (LY11) and leaves others rolled. Shown as named cards in the draft column.
- **Nonhuman**: the body axis picks a body template; weight 0 until the template is supported
  (WC10), so it never appears before it plays (CX6).
- **Inherited** (child or heir of a former life): the family axis is locked to a lineage record
  from the chronicle; heredity draws from the frozen parents (GHS28). Offered from the between-lives
  surface (MP1) after a first ending, and on the Beginning view once a lineage exists.
- **Other selves**: NS dial default None (Weibao's lean "I guess they would just be npc"); a world
  built on copies sets Present or Playable.

GHS19. **Scaling to many worlds.** The first axis is *world*. Each world registers a start world
(`id, revision, axes, base, layers`) in a start catalog; a world with no start data offers only
its vanilla entry. Pick order follows WQ2 (world first, then a start inside it) and WQ1 admission
(content loads, first action works, save round-trips). The same view serves the between-lives
surface later; no second picker.

## 3. Data and engine shape

GHS20. **Old saves and the cosmetic bio.** No bio rewrite. A read-side mapper gives the new
projections their inputs: `race` → species label and body form (`human` for every current
playable race, race kept as a tag), `age` → life stage, `gender` → address and presentation,
`height` → size class. A save with no receipt shows "You began before beginnings were recorded"
in the Biography (UR13). A later identity view that splits gender takes G25's migration then.

GHS21. **Domain `start`** (registered through `domain_registry`, one line in `main.js`, AR1–AR2).
Slice `start`:
`{schema:1, receipt:null | {worldId, worldRevision, startId|null, seed, layers:[{axis,id,revision}], hidden:[axis], appliedAt, final}}`.
Missing key on load means an old save: `initialState()` with `receipt:null` (AR6). Validation:
receipt layers exist in the pinned revision or are kept as retired stubs (ST-F). Reload never
rerolls (WQ5, MR3). Projection `startCardView(receipt, catalog)` feeds the Beginning view, the
Biography "How you began" block and the Journal's first entry. The resolver stays pure in
`start_records.js`; `START_MERGE_RULES` gains `body`, `family` and `heredity` fields with declared
rules (body: last, family: last, heredity: append locks).

GHS22. **Domain `heredity`** (second registration line, after `start`). Slice `heredity`:
`{schema:1, model:{id, revision}, subjects:{<bodyInstanceId>:{drawn:false} | {drawn:true, draw:{stream, key}, factors:[{id, revision, value, expression, source}], constitution:[sourceId], bloodline:null | {id, carrier, awakened}, parents:{status:'unknown'|'recorded', refs:[]}}}}`.
- Subjects are keyed by body instance (`native.player.body` today), and the player is a pointer to
  the body it controls, so possession, rebirth or a second body cannot carry heredity to the wrong
  body (GHS43).
- Pure engine `src/heredity.js`: `drawFounder(model, draw)`, `inherit(model, parents, draw)`,
  `express(model, subject, context)`. Models are data (`src/data/heredity_models.js`), first one
  `frontier.plain`.
- Draws use an existing allowed stream family (`people:heredity:<subjectId>`, `unitDecision`);
  the resolved outcome is saved, not only the seed (ST-A–ST-C).
- Expression writes through existing commands only: grant body sources with `origin:'inherited'`
  and set faculty `awakened` (one modifier pipeline, MT1; no second stat writer, AR3).
- Old saves: `drawn:false`. The draw happens at the first consumer event (CX4) and only fills
  latent factors; it adds no expressed effect to an existing character unless a world event
  awakens it, so a seen character never silently changes (MR30).
- NPCs: subjects are created lazily when a person first needs body detail (G48, FD2); no
  population pre-simulation (CX4, CX5 budget test).

GHS23. **Knowledge** uses the existing simulation `knowledge` effects with keys
`self.heredity.<factorId>` and `person.player.heredity.<factorId>` and stages `unknown → hinted →
seen → confirmed`. One projection `selfHeritageView(state)` (AR8) returns expressed facts exact,
latent ones only with a claim and its basis, and "not yet known" rows for known unknowns. The
Biography heritage section reads it; no second owner.

GHS24. **UI seams.** Beginning view: a `definePanel`-style module in the start-screen host, its
own leaf file, with preview fixtures `beginning-fresh`, `beginning-draft`, `beginning-inherited`
in `src/ui/preview/fixtures.js` so ui-main can lay it out without the runtime. You panel: the
header line gains the life-stage and form beside race (BX1). Biography: heritage rows from
GHS23. Journal: first entry from the receipt. Layout spec changes only if a new box is added
(none in S1).

GHS25. **Checks to reuse or extend (AD36).** `tests/start_records.test.js` (resolver),
`tests/domain_registry.test.js`, `tests/save_files.test.js` and the applicable current-state
`save_compatibility.test.js` cases (old-save migration is currently deferred), `tests/character_bio.test.js` (heritage rows), `npm run check:arch`
(AR16), `check-r21b.cjs` (start screen, classic), plus a rebuilt browser journey at 1920×1080 and
1366×768 with save, reload, Export and Import on fresh and mid-creation current-state saves.
Record any selected reset/drop policy for older custom-bio saves; unchanged old-save support is not a required gate.

## 4. Slice ladder

Each slice is a playable checkpoint (CX7). Levels: cheap, balanced, strong (AGENTS budget terms).

| Code | Slice | Contents | Done check | Executor | Effort |
|---|---|---|---|---|---|
| GHS26 | **S1: Recorded beginnings** (first slice, one round) | `start` domain and slice; receipt written by PLAY, Roll and Begin; Beginning view with the existing three axes plus a **family** axis (orphan, farm family, scholar's household) and a **life stage** axis (adult default, youth) as tags and text; draft of three; Biography "How you began"; Journal first entry; old-save line | Fresh game: Choose a beginning, adopt a draft card, Begin; the card's facts show in Biography and Journal; save, reload, Export, Import keep the receipt and never reroll; older custom-bio retention or reset/drop is documented under the current compatibility decision; PLAY one-click still works; classic starts; 1920×1080 and 1366×768 evidence; `check:arch` passes | Balanced implementer, strong reviewer for the save slice | M |
| GHS27 | **S2: Founder heredity and constitution** | `heredity` domain; `frontier.plain` model with about four small factors and two constitution traits (reuse Natural balance as one); founder draw from the receipt; expression into body sources and a `heritage` levelable bucket (GHS66, GHS69: one aptitude, one drawback aptitude); `selfHeritageView`; one discovery route in the Village (a healer or an elder's family memory reveals one latent factor) | A new character shows expressed traits exact and one "not yet known" row; the Village route turns it into a seen claim with its basis; reload keeps the draw; current undrawn state stays `drawn:false` until the route, then gains latent factors only | Balanced implementer, strong reviewer | M |
| GHS28 | **S3: Inherited start** | Lineage record at a life's end (frozen parents, NK-E2 edges); `inherit()` for one child; between-lives entry and a Beginning view "Born into your line" card; heir comparison line (UI3 minimal) | Finish a life, start as its child: factors come from the frozen parent with the model's rule; estate passes through `heir_inheritance` unchanged; memories and base cheat follow AD11; a fresh random life (P1 default) still offered beside it | Strong implementer | L |
| GHS29 | **S4: Second world, second model** (proves the seam, AR11) | A second start world (one book or original world) with its own axes and a bloodline-awakening or cultivation-roots model; one nonhuman body template (SS-A hound) admitted on the body axis | Picking that world rolls its own axes; its model draws and expresses without touching `frontier.plain`; the hound start plays its first action; no layout-host edits | Strong implementer, balanced content author | L |

Later, from the palettes, each when a slice earns it: SG split with migration (G25), modification
loops (GM1–GM11), brood and genestealer seats (G2–G9), body cheat lens (CV1), population heredity
(PG1–PG6), clan politics (CL1–CL10). Each keeps its palette code; CX8 records its reopen trigger
as "a selected slice consumes it".

## 5. Interactions

| Code | With | Default behavior |
|---|---|---|
| GHS30 | Knowledge and appraisal (AD6–AD9) | Own expressed numbers exact; latent and lineage facts are claims with basis and confidence; tests can be wrong or stale (SI1–SI6) |
| GHS31 | Cheats (AD26, AD29, CV1–CV12) | A body cheat is a means: it reveals what its mechanism can read and acts through the same commands. The base cheat does not reveal heredity by default |
| GHS32 | Lives, heirs, lineage (AD10–AD12, P1–P3) | One continuing self; an inherited start is a new person in the same journey, not the parent. Fresh random life stays the usual next life; succession is an option, not the core loop |
| GHS33 | Other selves (IL1, NS, IX) | Body copies do not copy the self (GN11); a past self is an NPC by default (IX2) |
| GHS34 | NPCs (AD33, CX1–CX8, G48) | NPC heredity is lazy and budgeted; no NPC-heavy work in S1–S3 beyond the frozen parent record |
| GHS35 | Sealed truths | Bloodline and parentage twists by ID only; projections gated (GHS14) |
| GHS36 | Rivals (RIVALS identity claims) | A rival can hunt or claim a body or line through its own means; theft declares copy/move/lease (later slice) |
| GHS37 | Making (MR1–MR36) | Samples are information and potential (SO1–SO12); not in S1–S4 |
| GHS38 | UI surfaces | You header (form, stage), Biography (heritage, how you began), Journal (first entry), Beginning view; at the floors nothing new pushes routine actions off-screen |
| GHS39 | Time and offline (AD15–AD18) | Ordinary aging/growth follow the game clock; a selected body/faculty clock can differ through means. Offline processing names that clock and settles time once (GHS112) |
| GHS41a | Body and health (proposed [BHR1–BHR30](BODY_AND_HEALTH_RULES.md), AD38) | Body conditions key by the `heredity` body instance from S2 on, not by actor (BHF2); a carried skill in a new body keeps knowledge and recalibrates control (BHR29); remedies and constitutions work by their mechanism (AD38) |
| GHS40 | Settings (AD21) | Detail visibility is comfort; future difficulty/recovery changes are explained; actual physiology and heredity effects follow world/means, not panel visibility (GHS113) |

## 6. Decisions for Weibao

Q1. **Build order.** Default: S1 after R22a in the UI queue, then S2, S3, S4, with the domain
work in an engine lane and the Beginning view layout in ui-main. Confirm, or name where it fits.

Q2. **PLAY default.** Default: PLAY stays vanilla one-click for the first milestone, with Roll a
beginning one click away. Say when guided random should become the PLAY default (AD23).

Q3. **First heredity defaults.** Default: `frontier.plain` with small effects (one capability
step per expressed factor) and one Village discovery route. Confirm the effect size.

Q4. **Save compatibility.** Default: no bio rewrite; old saves get no receipt and an undrawn
heredity that fills latent factors only when a route reaches it, never changing a seen character.
Confirm.

## Round 2: genetics, constitution, physique, soul, traits and more options, 2026-10-17

Weibao: "Aspects of genetics, constitution, physique, soul, traits, and more options?" New angles
are implementation-side; the palette already lists the content (PH1–PH12, CN1–CN8, MS1–MS6,
PR1–PR4, LQ1–LQ22). Codes continue at GHS41.

### ACT NOW (done in this file)

| Code | Finding | Change |
|---|---|---|
| GHS41 | Round 1 had no soul and no scope for each fact. A soul, mind or line fact saved in a per-body slice would be lost on rebirth or wrongly kept on possession | Added the scope table below (GHS44) |
| GHS42 | GHS17 let every axis lock. AD23 says specific starts depend on means; a free body or trait pick would be a specific start | GHS17 now gates body and heredity locks behind means; roll and unknown stay open |
| GHS43 | GHS22 keyed heredity by `player`. The body record already separates `ownerId`, `controllerId` and body `id` | GHS22 now keys by body instance |

### GHS44 Where each kind of fact lives

Default, with the world law (IL29) as the dial. "Carries" follows AD11: memories and the base
cheat carry; the rest by world and means.

| Scope | Holds | Lives in | On a new life | On possession or a body change |
|---|---|---|---|---|
| Body | Genetic factors, physique inputs, constitution, size, sex, age stage | `heredity` subject for that body instance | Stays with the old body; the new body draws or inherits its own | Stays with the body; the new controller gains the body's traits and loses its old body's |
| Mind | Capacities: memory, composure, learning speed (MS1–MS2) | Journey-level self record | Carries by default, with world law able to dull it (amnesia starts) | Moves with the controller |
| Soul | Soul strength, soul faculties, past-life marks, soul lineage (MS5–MS6, RL1–RL6) | Journey-level self record, reconciled with the continuation owner (OM1–OM7) before it is built | Carries by world law; carry capacity can grow (AD11 "what carries can improve") | Moves with the soul; a world where body and soul bind (IL1) can split or blend |
| Line | Bloodline, lineage edges, family claims | Lineage records (NK-E2) plus body expression | The heir's body inherits by the model; the line record continues | A bloodline in a stolen body expresses for the new controller where the carrier is blood; a soul-carried line does not follow the body |
| Record | Registers, test results, family books, titles | Knowledge items and claims | Stay in the world, readable by whoever holds them | Unchanged; a register can disagree with the body (pretender, swapped child) |

### ACCOUNT FOR NOW (constraints on S1 to S4, no new features)

| Code | Consideration | Default, dial and reason | Done check |
|---|---|---|---|
| GHS45 | **One trait record shape.** Body traits, constitutions, quirks, mind capacities and soul faculties share one card: `id, revision, carrier (body, mind, soul, line, record), origin (drawn, inherited, trained, acquired, granted, imposed), expression (latent, expressed, suppressed, damaged, removed), polarity (boon, cost, mixed), when, onset, duration, grants, costs, discovery` | Reuses `bodySources` and the source kinds (trait, bloodline); carrier and polarity are new fields with defaults so old sources load. Dial: a world can ignore polarity entirely | Existing body sources load unchanged; one test card of each carrier validates |
| GHS46 | **Costs and mixed traits need a channel.** Capability grants must be positive (`src/capabilities.js:29`), so "strong but slow to heal" cannot be a negative grant | Default: costs as conditions or a separate cost capability that consumers read (higher hunger rate, longer rest), not negative grants; keeps the modifier pipeline single (MT1). Applies to capability costs only; XP and stat multipliers below 1 already work (GHS67). No universal flaw: costs exist where the trait's own logic says so | A mixed trait shows both rows in Biography; no capability total goes below its base |
| GHS47 | **Conditional constitutions** (CN1: full moon, winter, fasting) | Reuse the provider `when` rule the capability engine already evaluates (`src/capabilities.js:16`); no second predicate language | A conditional trait toggles in a test by changing only the fact it reads |
| GHS48 | **Onset over a life.** Some factors express at a life stage (late talent, puberty awakening, aging weakness) | `onset` on the card; `express()` runs on a life-stage change from the chronicle age, forward only. Old saves only gain onsets still ahead | A youth start reaches adult and gains one onset trait once; reload does not repeat it |
| GHS49 | **Physique is derived, drift is stored.** PH1–PH11 come from factors, size, age, training and conditions | Derive physique on read in the projection; store only slow accumulators that cannot be recomputed (CN5 lifestyle drift, injuries). Dial: a world with tempering stores its stages | Biography physique lines change when training changes, with no stored physique field |
| GHS50 | **Mind traits for the player are capacities, not personality.** Weibao decides how the hero behaves | Default: the player character gets capacities (memory, composure, focus); personality and temperament traits stay NPC-side and in flavour text. Dial: a possession or shared-mind start can give the host's temper as pressure with a reason | No player trait forces a choice; NPC traits can |
| GHS51 | **Species overrides world.** A hound in the Village and a human there need different heredity | Model lookup: body template's model if set, else the world's default model | The hound start draws from its own model in S4 |
| GHS52 | **Lived inheritance** (GN4: a parent's state at conception) | The frozen parent snapshot keeps expressed state and lasting conditions, not only factors; models choose whether to read them | Two parents with the same factors but different lasting conditions can give different children where the model reads them |
| GHS53 | **Stable draw keys.** Editing a parent after the child exists must not change the child | Key: child body instance plus a hash of the frozen parent snapshot, stored with the result (ST-A–ST-C) | Changing a parent's later state leaves the saved child identical |
| GHS54 | **Compounding across generations.** Breeding your own line for a trait can run away in an idle game | Default model has drift toward the population mean; the strength is a world dial with an in-world reason (clan worlds have less drift but rival clans and inbreeding cost, GN7). LD5 check before any decisive model | A 20-generation headless run of `frontier.plain` stays inside the declared band |
| GHS55 | **Biography grouping by carrier.** Trait counts will grow | Body, Mind, Soul, Line and Record groups with counts, collapsed at the floors; titles (AD30) and furniture (AD31) stay in their own groups, not heritage | 1366×768: groups fit without pushing routine actions off-screen |

### More player options (defaults, all within AD23)

| Code | Option | Default |
|---|---|---|
| GHS56 | **Unknown body** ("surprise me"): the body axis resolves, saves and stays hidden; you learn it in play (LY5, AD3) | Offered on every world; the start card shows "not yet known" rows |
| GHS57 | **Draft bodies**: three rolled bodies to choose between, as the draft column does for starts | Open without means: choosing among rolls is still guided randomness |
| GHS58 | **Chosen body or traits** (specific start) | Needs means (GHS42): a rebirth cheat, a first-life unlock, an authored start. A creative setting can open it, explained as such (AD21) |
| GHS59 | **Born into your line** (S3) and **adopted into a line** (NK-I7) | Offered once a lineage exists; adopted lines carry records and teaching, not blood |
| GHS60 | **Same soul, new body**: a reincarnation start that keeps soul and mind scope and draws a fresh body | Default next-life shape where the world's law is reincarnation; body facts start fresh |

### LATER / DELEGATE

| Code | Item | Level, effort | Done check |
|---|---|---|---|
| GHS61 | Dev-only heredity inspector (`?heredity_probe=1`, localhost, like the start probe): truth, claims, draws and onsets for one subject, labelled spoiler; read-only (LD1) | Balanced, S | Opens only on localhost with the flag; mutates nothing; save hash unchanged after use |
| GHS62 | Journey-level self record for mind and soul (GHS44), reconciled with the continuation owner and `life_experience_host` before any code | Strong, M | One owner per carried fact; a rebirth keeps mind and soul rows and resets body rows |
| GHS63 | Cross-model and cross-species children (MX1–MX6) | Strong, M, after S4 | Compatibility rule per pair; default no child without a world rule or means, with the reason shown |
| GHS64 | Generated trait cards from the G47 grammar with its validator | Cheap author, balanced reviewer, M | 20 generated cards validate; none duplicates a hand card |
| GHS65 | Genealogy as information items: registers and family books that can be forged, lost or disputed (RIVALS claims, SR map-as-artifact idea) | Balanced, M | A forged register changes an NPC's claim about you, not your body |

## Round 3: talents, titles and traits, 2026-10-17

Weibao: "What about talents and titiles and traits?" Content owners already exist and stay the
owners: [skills and talents](SKILLS_AND_TALENTS.md#talents-in-more-depth) (aptitudes, faculties,
affinities, talent states, variation axes), [talent generation](SIMULATORS_AND_CHEAT_IMPLEMENTATION.md#talent-generation-considerations-2026-10-10)
(RNG plus what the life did), [traits, titles and conditions](CHARACTERS_AND_WORLD_EVENTS.md#traits-titles-and-conditions)
(seven kinds) and [E4 titles](emergent/TITLES_ACHIEVEMENTS_AND_META_RULES_2026-10-15.md) (C1–C13,
TR1–TR7). This round decides how they share one engine with heredity. Codes continue at GHS66.

### ACT NOW (corrections done in this file)

| Code | Finding | Change |
|---|---|---|
| GHS66 | **Two bonus systems, not one.** Round 2 assumed every trait grants through the capability system. Learning-speed talents and title bonuses actually go through the character's stat and XP buckets (`levelable.stats` and `xp_bonuses`, buckets `race`, `titles`, `active_effects`, `books`). Capabilities are a separate system that gates simulation commands. Neither can stand in for the other | Every grant on a trait card names its target: `capability` (gates and amounts in simulation) or `levelable` (stats and XP multipliers). Levelable grants from heredity and talents go into a new `heritage` bucket, rebuilt from the slice on every read by one `setHeritageBonus()`, the way `setTitleBonus()` already works (`src/models/hero.js:106`). Each fact still has one authority (AR3) |
| GHS67 | GHS46 said costs need their own channel because grants must be positive. That limit applies only to capabilities. XP and stat multipliers below 1 already work (race bonuses use them) | GHS46 now applies to capability costs only. "Clumsy hands" (crafting XP ×0.95) is an ordinary levelable multiplier |
| GHS68 | GHS45 had one `expression` field. Talents also need a stage of development (dormant, awakening, usable, controlled, mastered, evolved), and that is a different question from whether the talent is switched on | The trait card gets `expression` (whether it is on) and `stage` (how developed it is, optional). A world can skip straight to usable |
| GHS69 | S2 tested only capability traits, so the levelable path had no test | S2 also ships one aptitude (a small crafting XP multiplier) and one drawback aptitude in the `heritage` bucket, so both bonus systems are proven |

### How the three relate (default)

| Kind | What it is | Where it comes from | Carrier (GHS44) | Engine target |
|---|---|---|---|---|
| **Trait** | A lasting fact about you: body, mind or temperament | Heredity draw, training, life events, start layers | Body or mind | Capability or levelable, by grant |
| **Talent** | A trait about potential: learn faster (aptitude), a new verb or sense (faculty), affinity, constitution | Drawn at birth; awakened in life; settled at a life's end (simulator style); granted by a cheat or system | Body when drawn from heredity; soul when settled at a life's end and carried | Aptitude goes to levelable XP; faculty goes to a capability plus its commands |
| **Title** | A record of a deed or a position, plus whatever its rule grants | Counters and deeds (`src/titles.js`), issuers (offices), world law, cheats | Record: deed titles belong to the life that earned them; offices to the issuer's succession rules; cheat-held titles go with the base cheat | Bonuses rebuilt from `character.titles` on read (existing), with powers by world rule (AD30) |

### ACCOUNT FOR NOW

| Code | Consideration | Default, dial and reason | Done check |
|---|---|---|---|
| GHS70 | **Effect visible, cause hidden.** AD8 says your own numbers are exact; AD3 says special traits start hidden. A hidden aptitude still changes the XP numbers you can see | Show the exact effect with an unknown cause: "You pick this up faster than expected. Cause unknown." Noticing your own use counts as a route: after enough practice it becomes a hinted claim, and a teacher or test confirms it. Dial: worlds with talent tests at birth confirm it at the start | A hidden aptitude shows its exact XP rate and an unknown-cause line; practice moves it to hinted |
| GHS71 | **Talent origins in one record.** Drawn, awakened, settled at a life's end and granted are four ways to gain the same kind of thing | `origin` on the card covers all four. A talent settled at a life's end uses the simulator rule (the life's deeds pick the theme, a seeded roll picks the grade) and is stored on the journey self record (GHS62), so it carries to the next life by world law | A life-end talent appears in the next life's Biography under Soul, with its basis |
| GHS72 | **Start-given traits and titles.** An authored noble-heir start begins holding an office; a background layer gives a talent | Start patches gain `traits` (append by id) and `titles` (append by id, marked `origin: 'start'`). A start title is not a deed: it advances no counter, replays no award, and its issuer and duties come with it. Locking a talent is a specific start (GHS42) | Starting as a holder logs no "Title earned" line; the office's duty appears in the Journal |
| GHS73 | **Grades are a reading, not the truth.** F–S, common–unique, root grades | The truth is the card's values; a grade is a projection per world or tester (AB12 rank view), so the same talent can read differently (CN8). A test reads with its own error (SI1) | Two testers in one world can report different grades for one talent without changing it |
| GHS74 | **Heirs and transfer.** A title, a talent and a trait each move by different rules | Defaults follow E4 TR1–TR7: deed titles stay in the parent's chronicle; offices pass only by the issuer's rule; heredity talents reach a child only through the model; soul talents follow the soul, not the child. Stealing or copying names its operation (RIVALS) | In S3 the child inherits factors but no deed title, and the parent's office follows its issuer's rule |
| GHS75 | **Stacking across buckets.** Race, heritage, titles, books and effects multiply each other | Each bucket stays small by default; LD5's year-of-idle check covers the product, not each bucket alone. Dial per world for decisive talents, with in-world pushback (sects recruiting prodigies, CN4) | The headless run in GHS54 also reports the combined XP multiplier |
| GHS76 | **One place to ask "why".** With four sources a player cannot tell where a number comes from | Hovering or pinning a stat or XP rate lists its contributions by source and bucket (race, heritage, title, book, effect), with hidden causes shown as "unknown" (UR41–UR48). The data is already in the levelable buckets | At 1920×1080 a pinned XP rate lists its contributions, and they add up to the total shown |

### More options

| Code | Option | Default |
|---|---|---|
| GHS77 | Draft of three talent sets at the start, inside the body draft (GHS57) | Open: choosing among rolls |
| GHS78 | **Late bloomer:** the talent starts dormant and awakens through use, an event or an onset (GHS48) | Common in the default model; awakening is the expected way talents appear |
| GHS79 | **Talentless start** (trash-talent tropes, the lout lessons) with hidden potential behind a route | An authored start option; its hidden part follows sealed-secret rules if a world authors one |
| GHS80 | **Titles that grow** (E4 C9: evolve, combine) | LATER; the existing counters and thresholds remain the base |

### LATER / DELEGATE

| Code | Item | Level, effort | Done check |
|---|---|---|---|
| GHS81 | Life-end talent settlement slice (simulator rule) on the journey self record | Strong, M, after GHS62 | A finished life produces one themed talent from its counters with a seeded grade; reload gives the same one |
| GHS82 | Contribution breakdown tooltip (GHS76) as a UI round item for ui-main | Balanced, S | As GHS76 |
| GHS83 | Talent card authoring pass: about ten Village aptitudes and faculties from SKILLS_AND_TALENTS mapped to cards with targets | Cheap author, balanced reviewer, S | Every card validates and names its target |

## Round 4: items and possibilities from books, 2026-10-17

Weibao: "consider items and possibilities from books too". Two read-only surveys covered the
per-world packs in `docs/worlds/` and the private novel deep dives in `docs/research/novels/`
(paraphrased here; the raw text stays private). Caveat: most world packs are proposal packs built
from wiki sources, not canon checks, and they often refuse to grant bloodlines or organs just for
XP. Book examples below are design references, not adaptations; a direct adaptation still follows
PROJECT's source rules. Codes continue at GHS84.

### What books add that rounds 1 to 3 lacked

Rounds 1 to 3 attach every fact to a person (body, mind, soul, line, record). Books keep putting
the power **in a thing** and passing it around:

| Pattern | Book references (paraphrased) | Carrier today | What it needs |
|---|---|---|---|
| Power left behind as loot | LOTM: a dead Beyonder leaves a characteristic that cannot be destroyed and can become a potion or an artifact. One Piece: a fruit grants one power to whoever eats it | none | A power held by an item, a place or nobody |
| Power stolen as an object | Cosmere hemalurgy spikes (decay outside a body, one attribute per donor); MHA theft by touch; Tokyo Ghoul organ transplant | none | Donor loses it, recipient gains it, compatibility and decay |
| Soul fragment as companion or item | Cradle Remnants (adopt, harvest, bind, fuse); Shadow Slave Memories (stored in the soul, die with the owner); FMA Philosopher's Stone (stored souls spent as fuel) | partly soul | Soul-keyed items and their own custody |
| Bound tools that choose or bond | Harry Potter wands; Bleach Zanpakutō; Black Clover grimoires and spirits that pick a next host | equipment | A bond between holder and item, separate from ownership |
| Testers and readers | MHA's Quirk registry; Dorohedoro's scanner; Frieren's soul comparison; Reverend Insanity's Awakening Ceremony | knowledge | Tests as means with their own error (extends GHS73) |
| Priced trades | Chainsaw Man contracts (body parts, senses, lifespan); Nen and JJK vows (restriction for power, a breach costs the ability); Demon Slayer Mark (lifespan); JJK Heavenly Restriction (imposed at birth) | partly costs | Costs as lifespan, parts or lost abilities, with breach rules |
| One holder at a time | One For All; LOTM high Sequences and Uniqueness; Fate Command Spells; Reverend Insanity Immortal Gu; Chainsaw Man named Devils | none | A world ledger with counts and a rule for what happens when a holder dies |

### ACT NOW (done in this file)

| Code | Finding | Change |
|---|---|---|
| GHS84 | GHS44 put power only on persons, so book loot (characteristics, fruits, spikes, Remnants, cursed fingers) had nowhere to live, and GHS45's trait card could not say "this trait is held power from a thing" | Added the power-instance record (GHS86); a trait card may point at a power instance as `heldPower`. Drawn heredity factors do not need one |
| GHS85 | GHS46 and GHS67 only covered capability and XP costs. Books price power in lifespan, body parts, senses, lost abilities and breached vows | GHS90 below extends the cost channel; GHS46 and GHS67 stay as written for their channels |

### ACCOUNT FOR NOW (engine shape; no feature work until a slice uses it)

| Code | Consideration | Default, dial and reason | Done check |
|---|---|---|---|
| GHS86 | **Power instances with custody.** A power that can exist outside a person | Record `{id, worldId, sourceId, revision, holder: {kind: body, item, place, vault, unheld, id}, state, imprint, pollution, decay}` in a world-scoped slice. Holder changes only through commands that quote and then revalidate (AR7), and the instance is conserved: it goes somewhere declared (MR5, SR15). Dial: worlds where power simply ends at death set `onHolderDeath: end` | Moving a power from a body to an item and back keeps one instance id; save, reload, Export and Import keep its holder |
| GHS87 | **World ledger and uniqueness.** One fruit per power, one active One For All holder, singular LOTM seats | A per-world ledger of `sourceId → {limit, holders, onHolderDeath: end, drop, respawn(where, when), pass(rule)}`. Default `limit` none; worlds set it. Respawn draws use a seeded stream and a game-time window, never the player's own life, and a new life cannot reclaim a unique source just by restarting (LORE_AND_CONTINUITY) | With limit 1, a second grant is refused with its reason; a respawn lands in the declared place class once |
| GHS88 | **Typed acquisition operations.** Books separate eat, drink, transplant, graft, inherit, transfer, steal, copy, gift, bind, pact and attune, and the packs warn against folding them into one copy action | Each operation declares donor residue, recipient compatibility, consent, the item consumed, a clock and what knowledge it leaves (RIVALS: copy, move, lease, share, destroy). One command family, one table of operation rules per world | A temporary copy expires on its clock while effects it created stay; a theft leaves the donor without the power |
| GHS89 | **Integration of acquired power.** LOTM digestion by acting the role; loss of control with reversible warning signs; Reverend Insanity and simulator "raw" grants that leave an unstable foundation | Acquired facts get `integration` (0 to 1, told in words, not a bar), `risk` with named inputs (skipped tier, wrong path, imprint, temptation) and stages `settling → stable`, plus `warning` and `lost` where a world has them. Forgiving default (AD19): warning signs pause risky routines and offline automation and ask, so nothing is lost without warning; a terminal loss only in worlds that announce it or under a harsh setting | Pushing past a warning while away stops the routine; a world without loss of control never reaches `lost` |
| GHS90 | **Priced trades and breach.** Lifespan, a body part, a sense, a dependant, a lost ability | Costs as typed records `{kind: lifespan, part, sense, ability, capacity, item, obligation, amount, trigger, breach}`. A vow is a self-imposed condition with a breach rule; a contract has parties, a term and a price (AD14 bindings carry by their own rules, with a warning when the consequence is known). Dial per world | Breaking a test vow removes its granted ability and logs why; a lifespan price shows on the life-stage line |
| GHS91 | **Slots and exclusivity.** JJK one innate technique per body, one ability per pact, D&D three attuned items, B2 trait loadouts (owned is not equipped) | `slots: {kind: count}` per carrier from the body template or world law, plus named exceptions. Default: no slot limit in the Village; worlds declare theirs, and an exception passes validation when it is named (the One Piece pack warns against an unbreakable rule) | An owned but unequipped trait grants nothing; a named exception loads without a validation error |
| GHS92 | **Who can run it: blood, teaching or fit.** Clan manuals teach but not everyone can use them; MHA children's fire Quirk mismatched with the other parent's body; transplants need a compatible body | Each technique and power names its eligibility keys (bloodline, factor, body function, taught, compatible type). Heredity passes two things that can mismatch: the factor and the body that must handle it. A mismatch is a cost or a risk, not a refusal, unless the world says so | A taught clan technique fails with a named eligibility reason for an outsider; a mismatched child shows a cost line |
| GHS93 | **Acquired powers and heredity.** LOTM parents pass a part involuntarily and can drop a rank; Cosmere spiked powers are not inherited; Mistborn lines are spiritual | Trait cards gain `heritable` (none, part, full) and `drainsParent`; heredity models read them. Default for acquired powers: not heritable | A spiked-style power never reaches a child; a part-heritable one does, with the parent's loss recorded |
| GHS94 | **Aptitude has several numbers.** Reverend Insanity grades set a cap and a regeneration rate; shounen packs separate reserve, output, control, aptitude and rank | Aptitude grants name the quantity they touch (`cap`, `rate`, `output`, `control`, `xp`), not one "talent" value. Extreme physiques can carry a lifespan cost (GHS90) | Two characters with equal XP aptitude but different caps diverge only at the cap |
| GHS95 | **Gates by kind, not amount.** Cradle: Gold can be bought with pills, Lord needs an insight about yourself; an early order of choices fixes a lasting grade | Stage gates are typed requirements with named failures (an item, an insight, a deed, a peak flag). A one-time early choice can store a permanent grade. Uses the existing requirements language (`requires`, `visibleWhen`) | A purchasable stage passes with the item; the next stage reports its missing insight by name |
| GHS96 | **Soul scars and soul-bound items survive resets.** MoL soul injury; Regressor's Tale soul-linked objects return; reincarnators keep understanding but not their realm | Soul-scope records (GHS44) hold scars and soul-keyed items; a rebirth or loop resets body scope only. A big mind in a new small body gets a short overload condition (Absolute Regression) as a world dial | A loop or rebirth keeps the scar and the soul-keyed item; body traits reset |
| GHS97 | **What carries is a whitelist.** Simulator settlements carry memory, realm, traits and arts, never relationships or injuries; memories may return without their emotions; one settlement offers the peak self or one treasure, not both | The carry policy per world (AD11) is a declared list of scopes and kinds, with options like `memory: facts only`. A choice between carried things is a settlement choice, saved once | The carry list shown before a rebirth matches what arrives; a settlement choice cannot be rerolled by reload |
| GHS98 | **Sudden power shows.** Simulator settlements leak an aura strong people can sense; Worm and Cradle ratings are read by others | A large granted jump raises a visibility fact that observers with means can read (AD6). Concealment is a skill or item. Dial per world | A big jump makes one capable NPC react; an NPC without means does not |
| GHS99 | **Typed titles.** The world-depth title kinds TK1–TK17 (office, hereditary, brand or curse, debt, proxy, relation) with issuer, audience and per-kind carry rule (TM7); heirs drop deed titles (X8) | Titles keep `character.titles` as the save record and add `kind`, `issuer` and `audience` with defaults so old saves load (AR6). Matches GHS74 | An old save's titles load as deed titles; an office lists its issuer and duty |

### Items to support (defaults, built only when a slice selects them)

| Code | Item class | How it lands on existing code |
|---|---|---|
| GHS100 | **Consumed to gain** (potion, pill, fruit, bead, essence) | `UsableItem` today applies timed effects only (`src/items.js:493`). A lasting gain goes through a usable command that quotes a trait grant or a power instance move (GHS86, GHS88), not through `effects` |
| GHS101 | **Worn or attuned to gain** (wand, ring, mystic code, attuned item) | The `equipment` source kind already exists (`src/capabilities.js:4`); attunement adds a bond state and a slot (GHS91) |
| GHS102 | **Holds a power** (characteristic, cursed object, spike, Remnant, Memory) | A power instance whose holder is the item (GHS86). The item's custody owner stays the item system; the power's owner is the ledger |
| GHS103 | **Tests and readers** (testing stone, registry, scanner, soul comparison) | A means that writes knowledge claims with basis and error (GHS23, GHS73); a reading never changes the truth |
| GHS104 | **Records** (family books, registers, licences, grimoires as spell lists) | Information items (GHS65); a licence grants access, not power (Hunter License) |
| GHS105 | **Suppressors** (seastone, aluminum, erasure-style effects) | Set `expression: suppressed` while active through a condition, then restore; the trait is untouched |

### Slice impact

S1 to S3 keep their contents. Two additions:
- **GHS106.** S2's trait card ships with the new fields' defaults (`heldPower: null`, `heritable`,
  `slots` empty) so later slices add no migration.
- **GHS107. S5: Power in a thing** (after S4). One original Village consumable, an "awakening
  draught", that grants a lasting faculty through GHS88 with integration (GHS89) and one warning
  stage; one original unique source with limit 1 in the ledger that drops a power instance when its
  holder dies (GHS87). Done check: drink, see the faculty settle over game time, push to the warning
  and have the routine stop; kill the unique holder in a fixture, find the dropped instance, take it;
  save, reload, Export and Import keep holder, integration and ledger. Strong implementer, M to L.
  Book versions (LOTM potions, fruits) come after, each as its own world adaptation.

### LATER / DELEGATE

| Code | Item | Level, effort | Done check |
|---|---|---|---|
| GHS108 | Multi-occupant bodies (JJK finger bearer, FMA soul in armor) on top of IL16 and the body controller fields | Strong, L | Two occupants share one body with a declared control rule and separate memories |
| GHS109 | Exposure mutations (Fallout radiation, environmental drift) as traits that arrive by condition | Balanced, M | A long exposure grants a trait once, with its basis recorded |
| GHS110 | Aggregation: same-path things drift toward a holder (LOTM) as an encounter weight | Balanced, S | Encounter rolls with and without the weight differ only for matching sources |
| GHS111 | Per-world operation tables (who can steal, copy or only see a talent) for the first two book worlds | Cheap author, balanced reviewer, S | Each listed world has a filled table citing its pack |

## Evidence

Round 4 read: two Sonnet surveys (world packs; novel deep dives) plus `src/items.js` 170–505 and
`src/feature_expansion_book_roster.js` around `copy_bloodline_or_organ`. Docs only.

Round 3 read: `src/titles.js`, `src/models/hero.js` 95–125, `src/models/person.js` 205–260,
SKILLS_AND_TALENTS talents section, SIMULATORS talent generation, CHARACTERS_AND_WORLD_EVENTS
traits table, E4 C7 and C10. Docs only.

Round 2 read: palette G17, G23, G32–G33; `src/capabilities.js` lines 16 and 29; `SELVES_AND_ECHOES.md`
headings. Docs only.

Read-only pass 2026-10-17: the owners above, `src/start_records.js`, `src/data/start_layers_frontier.js`,
`src/start_probe_ui.js`, `src/components/bio_component.js`, `src/character_bio.js`,
`src/body_progression.js`, `src/domain_registry.js`, `src/seeded_streams.js`, `src/capabilities.js`,
and commit `dbf1b3ce5` (R21b) on `claude/ui-r21b-retire-selector`. No build, test or browser run;
docs only.

## Core-rule reconciliation, 2026-10-18

**GHS112, clock ownership (AD13/AD16–AD18).** GHS39's `game_time` is the
ordinary shared-clock case, not a universal formula. A body/faculty ages or
practices on its own named clock when a selected means separates clocks.
Banked time alone grants no time-stop power. Parent records and a body's latent
truth stay fixed independently of whether the character knows them (MR1, AD7).

**GHS113, settings versus physiology (AD21/AD38).** GHS40's "body realism is a
comfort setting" needs qualification: hiding detail or changing presentation is
comfort; changing future recovery/difficulty is an explained setting; changing
actual body laws needs world/cheat means. Do not remove real stat effects merely
because a panel is hidden. Current old-save migration is deferred, including
G25 references; new body state still needs complete persistence.

**GHS114, useful seam proof (AR11/AD36).** When a body-change slice is selected,
one existing learned method should keep its supported knowledge, recalibrate
execution through its actual carrier, and give a useful next action. Choose one
synthetic hidden-lineage case to ensure traits, sorting and ready counts reveal
only what means permit. This does not require population heredity or S4 before S1.
Level: strong cross-domain implementation, medium when selected. Done: rebuilt
current-target UI and current-state save/reload/import, without a second stat store.

See also (2026-10-19): [World dials and interpreter considerations](WORLD_DIALS_AND_INTERPRETER_CONSIDERATIONS_2026-10-19.md) on constitution facts feeding world dials (WDI17 to WDI22). Proposal only.
