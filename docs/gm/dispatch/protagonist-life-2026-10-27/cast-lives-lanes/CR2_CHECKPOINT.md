# CR2 checkpoint: card runtime integration

**Implemented, below floor.** The synthetic card reader is connected through a
prepared LOTM host/validator patch, with native headless Save, reload, Export
and literal Import coverage for pending and settled cards. Agent-verified, not
human-reviewed. The prepared patch is not applied in the shared checkout; do not
infer integrated UI or private-card adoption from this fixture.

## Direction, ownership and seam

The main line remains the protagonist's life (lead-life rules section A,
"The lead's life is the main line"; LSD167, LSD225-LSD227, LSD257-LSD259).
Cards are reached records, not playable controls, and the playable share does not
move. This lane owns `CR2_INTEGRATION.patch`, `CR2_CHECKPOINT.md`,
`tests/cast_card_integration.test.js`, and the CR1 reader/test refinement in
`src/cast_card_runtime.js` and `tests/cast_card_runtime.test.js`. Shared host and
validator changes remain a prepared patch. No commit.

The optional private-pack field is `eventCards`, either an array or
`{cards:[...]}`. Each row is `event-card/1`: `id`, `stepId`, `scene`, `verb`,
`kind`, `actor`, `place`, `time`, `order`, and optional `threadId`, `object`,
`class`, `kindWeak`, `packPlaceId`, `present`, `inputs`, `outputs`, `gains`,
`requires`, `effects`, `choices`, `lockedOptions`, `evidence`, and `source`.
Fact effects bind to the selected actor with `canon` provenance; knowledge
effects retain their authored change and locator. Saved marker keys normalize
producer punctuation to stable-safe IDs.

## CLR2 probe

| Probe | Observation | Gate |
|---|---|---|
| `defineInferences` / `defineDivinations` host registration sites | Both present in `src/book_world_lotm_cast_host.js` | Pass |
| `pack.bindings.days` reachable from the host | Present and used for reached-scene windows | Pass |
| Private chapter 1-24 card file against live `bindings.days` scenes | 66/157 cards match (42.0%); 91 do not | Non-gate; unmatched rows need a matching day-scene binding or an explicit fold/gap decision |

## Prepared coordinator integration

1. Import the zero-import reader and register
   `defineCards(pack.eventCards ?? null, binding)` beside the existing inference
   and divination adapters. Public fixtures use only synthetic IDs.
2. Resolve reached scenes from `pack.bindings.days` at the bound window start.
3. Call `canonActionDecision` on each card effect set before writing. A refusal
   settles with its reason and no effect; allowed effects go through
   `applySimulationEffects`.
4. Write the one-line report into `lotm.cast.report.` in the existing beat
   ledger. `castBeatReports` accepts its already-rendered text; no new ledger or
   panel is introduced.
5. The validator recognizes normalized settled/applied markers and verifies
   applied effects against the authored card definition. Marker and effect
   tampering are rejected.

The patch applies cleanly to the current shared source. The real fixture applies
it only in a disposable copy when it is not already integrated. The
1920x1080 rebuilt browser check remains with the coordinating session.

## Limits and verification

Simple by design: cards settle at their bound day window; thread IDs only group
reports; no between-beat process or open-thread journal is added (LSD260-LSD264).
The native fixture proves the real save validator and the card effect write, but
does not prove the normal Reports disclosure visually, a consumer of the card
fact, or a non-lead actor through the live LOTM host. The adapter-level synthetic
non-lead test confirms actor binding without a lead check. The runtime refusal
test confirms a contradicted effect reports why and returns no effect. A live
host refusal/reload journey, report-shape tamper, private-row adoption, and the
desktop browser route remain open.

| Floor | State |
|---|---|
| FLR1 Build | Disposable patched build passed; bundle SHA-256 `07cbe24cc59396d84c710a2a341135bb8c30d721bb321f3baf48b36eb96c2810`. |
| FLR2 Route | Synthetic fixture runs through the real LOTM host and save envelope; future window is effect-free before it arrives. No natural private-row route. |
| FLR3 Shown | Runtime line and refusal text are covered; rebuilt 1920x1080 Reports display is unverified. |
| FLR4 Used | The fixture verifies the card changes an actor fact; no downstream gameplay consumer is identified. |
| FLR5 Kept | Pending and settled states pass Save, reload, Export and literal Import through the real validator. Wrong marker shape and an effect not carried by the card are rejected. |
| FLR6 Labelled | Agent-verified synthetic headless route, not human-reviewed; **implemented, below floor**. |

| Command | Result | Gaps |
|---|---|---|
| `node --test tests/cast_card_integration.test.js tests/cast_card_runtime.test.js tests/perspective_controls.test.js` | PASS 6/6; disposable build hash above | Synthetic rows; no desktop/browser evidence, private-row runtime adoption, or host refusal journey |
| `npm run check:arch` | PASS; `main` -51, display -37, save files 0; 205 grandfathered cyclic edges | Prepared host patch is not part of this shared-source architecture count |
| `git apply --check --whitespace=error docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/CR2_INTEGRATION.patch` | PASS | Patch remains unapplied pending coordinator integration |
| `git diff --check -- src/cast_card_runtime.js tests/cast_card_runtime.test.js tests/cast_card_integration.test.js` | PASS | Does not inspect untracked patch/checkpoint formatting |
| `shasum -a 256` on the four owned code/patch inputs | Reader `dfcffa84939a73b6a9f9201ee86f47029e47afeeb7482f109ddab202c3f6c1b6`; reader test `fb6c8ce2a493d561c9ae8618b03e6c76efbb7907ab05a29dd0958f19e06bbddb`; integration test `ca3dfc07f196af838ced9a7c0b83ae7808196d4991fe200ffdbef2b73164f0e9`; patch `1ae5654d0a292ba5165ac033ba018b7239371ae568405c40c67a4f7a18686b94` | Identity only; checkpoint is not included |

No commit. Shared host and validator files remain untouched. Coordinator owns
rebasing/applying the patch and the rebuilt desktop Reports check.
