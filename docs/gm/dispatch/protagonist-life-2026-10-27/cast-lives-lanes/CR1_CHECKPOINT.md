# CR1 checkpoint

**Implemented, below floor.** The world neutral card reader and synthetic failure
fixtures are in place; the LOTM adapter, rebuilt Reports behavior and persisted
effect path remain for coordinator integration. This is a source leaf plus
focused headless checks, agent-verified and not human-reviewed. No commit.

## Contract for integration

Pack field: `eventCards`, either an array or `{cards: [...]}`. Each row uses
`event-card/1` with `id`, `stepId`, `scene`, optional `threadId`, `verb`, optional
`object`/`class`, `kind`, `actor`, `place`, optional `packPlaceId`, `present`,
`time`, `order`, `inputs`, `outputs`, `gains`, `requires`, `effects`, `choices`,
`lockedOptions`, `evidence`, and `source`. The exact producer contract is
`scripts/lead_run/build_event_cards.mjs`; `stepId` and card IDs retain the `#`
separator from that producer. `defineCards(data, {worldId, actorId, group,
situationId})` binds actor identity from the seat instead of branching on lead.
Fact effects become actor facts with `canon` provenance. Knowledge effects keep
the authored change and locator, attributed to the actor with the bound
situation. An effectless card stays report-only.

The adapter should register `defineCards(pack.eventCards, binding)` beside
`defineInferences`/`defineDivinations` in `src/book_world_lotm_cast_host.js`,
include the card reader in the existing validated cast registry, and resolve
`scene` through `pack.bindings.days` to a reached window. Before applying card
effects, run `canonActionDecision` over the effect set so reservation refusals
and contradicted canon outcomes report the reason without writes. Apply allowed
effects through `applySimulationEffects`; publish the resulting one-line card
reports into `lotm.cast.report.` so `castBeatReports` and the normal Reports
consumer remain the only ledger and UI. Thread ids are report grouping only;
sort by `sceneOrder` and `step`, with missing ids still visible. The prepared
perspective tag is in `CR1_INTEGRATION.patch`.

The current Reports consumer is the fit at the requested 1920x1080 desktop
target. No new panel is needed. This lane did not rebuild or exercise that
screen. The private 157-row card file and live private pack were not read or
changed; the row-count and scene-match probes remain non-gates from the brief.

## Scope and known limits

This leaf reads card data only. It does not model processes between beats, keep
an open-thread journal, or replace a later system when repeated event shapes
justify one (LSD260-LSD264). The producer's thread clustering remains a display
group, not a mechanic. Effects are returned for the native effect owner; this
lane has not connected or proven native save validation for them. The live pack
does not yet consume `eventCards`.

## Delivery floor

| Code | State |
|---|---|
| FLR1 Build | Not met. No build ran; observed checkout `dist/bundle.js` SHA-256 was `7c0bcaf9792b0c19a0d9d0a24e5418922348b3cc7d6ef179c8230159b6b0126f`, already dirty at lane start and not attributable to CR1. Source input was shared HEAD `f07f03460e36ebf8b1d4f7ad39276fb2328455ad`. |
| FLR2 Route | Synthetic fixture only; not reachable through a fresh life. |
| FLR3 Shown | Unit line rendering covers action, locked options and refusal text; rebuilt desktop Reports rendering is unverified. |
| FLR4 Used | Effects are returned in reports for the adapter; no native consumer connected yet. |
| FLR5 Kept | Not met. Pending/settled states were not exercised through Save, reload, Export, literal Import and the real validator. |
| FLR6 Labelled | Agent-verified source and focused tests only; not human-reviewed. Route kind: synthetic headless fixture. |

## Checks

| Command | Result | Gaps |
|---|---|---|
| `node --test tests/cast_card_runtime.test.js tests/perspective_controls.test.js` | PASS, 5/5 | Synthetic rows; no live pack or real persistence. |
| `npm run check:arch` | PASS; main -51 lines, display -37, save files 0; 205 cyclic edges unchanged | Existing shared checkout baseline. |
| `git apply --check docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/CR1_INTEGRATION.patch` | PASS | Prepared perspective inventory hunk only; LOTM host/validator/report registration still needs coordinator integration. |
| `shasum -a 256 src/cast_card_runtime.js tests/cast_card_runtime.test.js` | `5cc086c34e587127a2411f9e6ba1e74012e87eb512c8a504037ee2260c022cb1`; `5d0bc2d75af54c75aecc37b2f1a7233e630083e374bba68c66be67341565f502` | Source/test input identity after focused checks. |

## Not done in this lane

The rebuilt browser check from a fresh origin at 1920x1080, reading `eventCards`
into the private pack, and the native Save/reload/Export/Import validator route
remain coordinator gates. The simple data-only reader is intentionally open to
refactor when an owning runtime integration or a second world needs more.
