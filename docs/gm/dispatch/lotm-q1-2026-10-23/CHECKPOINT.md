# LOTM Q1: second Sequence 9 pathway (Corpse Collector), 2026-10-23

Queue row Q1 of [the LOTM build queue](../lotm-lives-regions-2026-10-23/QUEUE.md). Rules applied:
WPR30-WPR32, WA1, WA5, WA6, AR1-AR16 (seam AR14: `src/book_world_lotm_*.js`), LTS1-LTS14.
Target viewport desktop 1920x1080; mobile deferred. Opt-in only (`?lotm_probe=1`, localhost).
All authored values below are proposals, not canon.

## Decision (D1): Corpse Collector

Criteria in order: (a) no new engine verb beyond the Seer slice's acting digest, held dose,
recognition by Hale and ingest crossing; (b) source facts in the pathways deep dive or the
institutions pass; (c) a Tingen institutional context in the institutions pass.

| Pathway | (a) | (b) | (c) | Result |
|---|---|---|---|---|
| Corpse Collector | passes | Seq 9 and 8 abilities, a stated formula price (230 pounds) and "needs courage to drink" (reader notes, LOTM_PATHWAYS_B); an acting statement exists in Dai's summary but the local notes keep only the pointer (0144-0150), so the acts are authored from the ability list | Evernight Church holds the line; the Nighthawks of Tingen are that church (institutions F1, F9) | **chosen** |
| Sleepless | passes only if sleep is changed: its signature (needs 2 to 4 hours, stronger at night) wants a time-of-day gate, and the slice's `sleep` command is a spirituality refill | no acting statement for its base ranks, no formula numbers | Nighthawks too | loses on (b), and on (a) once night mechanics are wanted |
| Spectator | passes | best acting source ("observe without intervening", the dog Susie digested it by watching) | none in Tingen: its holder in the pass is the Psychology Alchemists, a barter order with no Tingen jurisdiction and, per Klein, without the acting method | loses on (c) |

Spectator remains the best candidate for the later "quiet digestion" demonstration once a
Tingen holder is sourced (Q6 or the second city).

## Authored dial (WPR5), each with its reason

- 4 acts (Seer: 6): three layings-out and one vigil. The line's acting is quiet, repeated handling of the dead, and the church's ordinary wait on a potion is three years and a player who digested by acting is examined on merit (institutions pass F18, X4; corrected 2026-10-23, first written as "roughly a year (source note X3)", which was wrong; the "about a year" figure is Dai's fast pace, 0150 p52), so a short supervised count fits.
- 25 minute laying-out, 60 minute vigil (Seer: 10 minute readings): washing and shrouding a body takes longer than a hedged reading; a vigil is an hour in the cold room.
- Each act spends 1 of Hale's attention instead of spirituality. The cold room is supervised, and Hale's finite attention is the pace limit (3 layings + vigil + assessment = 5 of 6). This pathway grants no spirituality pool: the sourced Sequence 9 abilities are bodily and perceptual (cold, rot, undead recognition).
- No lesson or sample method: ingestion is followed directly by the acts. Dose text carries "takes courage to drink" as flavor; there is no new verb.
- Seq 8 Gravedigger dose is released by Hale's assessment (authored stand-in; Q6 replaces the assessor).

## Loss of control and switching

Stated causes are kept: no skipping (acts need the source; assessment needs the digest; the next dose is released only by assessment), no wrong-pathway potion (each dose is its own item key; each ingest requires its own held dose), no switching.
One pathway per life, enforced at three levels and worded for the player:
1. Commands: each accept requires the other pathway's flags unset, so a probationer cannot hold or drink both doses in one life. The Corpse Collector dose is issued from stores on acceptance, so the Seer dose never leaves Hale when Corpse Collector is chosen.
2. Owner (`validateLotmState`): a save holding both pathways is refused with the switching sentence; the envelope check counts each dose exactly once.
3. UI: the switching notice shows in the pathway section, the blocked offer's title (via the host's reasons) and in both accept labels. After one pathway is ingested the other offer is hidden.

## Changes (own paths only)

- `src/book_world_lotm_ids.js`: two source ids, two dose keys, authored dial constants, the switching notice.
- `src/book_world_lotm_path.js`: `corpsePathway` descriptor via `definePath`; `lotmPathView` is table-light: Seer stays the default view, the Corpse Collector view applies once its allocation exists, and an unchosen branch lists both ladders. Returns `potion`, `chosen`, `others`.
- `src/book_world_lotm_actions.js`: six commands (`accept_allocation_cc`, `ingest_cc`, `act_laying_out`, `act_vigil`, `request_assessment_cc`, `ingest_gravedigger`), two sources, new flags in `LOTM_FLAGS`, new facts (`lotm.ccSupported`, `lotm.cc.acting`, `lotm.cc.digested`, dose holds). Seer commands: `accept_allocation` also requires `no('cc.allocated')` and has a switching label and `visibleWhen`; `decline` also requires `no('cc.ingested')`.
- `src/book_world_lotm_state.js`, `_envelope.js`: additive Corpse Collector assertions; Seer lines unchanged.
- `src/book_world_lotm_content.js`: two item templates. No change to `LOTM_NATIVE_STOCK`.
- `src/book_world_lotm_host.js`, `_ui.js`: view fields (`beyonder`, `switchNotice`, two more holds), readable switching reason, "no Beyonder source" and "The {potion} potion feels" instead of Seer-hardcoded strings, both ladders before a choice.
- `tests/lotm_corpse_collector.test.js` (new, 5 tests), `docs/gm/dispatch/lotm-q1-2026-10-23/` (this file, `dump_seer_fixtures.mjs`, `fixtures/seer_taught.json`, `fixtures/seer_promoted.json`).
- No shared engine file, `ascension_paths.js`, `main.js` or other session's file was edited. `dist/` and `index.html` carry the normal `npm run build` output only.

## Save compatibility decision

Additive optional fields only: flags `book.lotm.cc.*`, resource `book.lotm.cc.acting`, sources `book.lotm.corpse_collector` and `book.lotm.gravedigger`, two item keys. `state.lotm` stays schema 1; the supervisor's native stock is unchanged, so Seer saves hold nothing new. Evidence: fixtures dumped from the pre-change code (`dump_seer_fixtures.mjs`, run before the first edit) at the taught and promoted Seer phases load and validate unchanged in the test; in the browser the localhost origin still held the previous lane's promoted Seer save, which the new bundle loaded and rendered as Sequence 8 · Clown. Saves holding Corpse Collector state are not expected to load in builds from before this change (localhost-only, disposable test saves, same reasoning as the ascension-paths lane).

## Verification (one line per check)

- `node --test tests/lotm_*.test.js tests/ascension_paths.test.js`: 22 pass, 0 fail (17 existing Seer/descriptor tests unchanged, 5 new). Gap: engine level; no native binding.
- `npm run build`: pass; `dist/bundle.js` SHA-256 prefix c07665753ae63c33 (shared checkout, other sessions' uncommitted src edits are in this bundle).
- `npm run check:arch`: pass (main.js growth 0, save_files.js growth 0).
- Not run by design: full `npm test`, `check:rules` (committer).
- Browser, 1920x1080, in-app pane, fresh origin `127.0.0.1:19811/?lotm_probe=1` (empty storage): enroll, report in, both pathways offered with the switching notice, accepted Corpse Collector (Seer offer became disabled with the switching sentence as its reason, `accept_allocation` click refused), ingested, three layings-out (25 min each, 1 game minute per second), vigil with a **page reload mid-job** (job and 3/4 kept), 4/4 "settled", assessment (Gravedigger dose held, attention 1 of 6 left), drank it (Sequence 8 · Gravedigger, later Sequences "???"), `save_to_file()` string (116,384 chars), walked to lodging so state differed, literal `load_progress(string)`: workroom and Sequence 8 · Gravedigger restored.
- Browser, fresh-cleared origin `localhost:19811`: Seer enroll, accept (Corpse offer blocked), ingest, lesson, one reading: "Seer pathway [Sequence 9 · Seer]", 1/6, "settling". The rest of the Seer ladder is covered by the existing engine tests (digestion test unchanged and passing), not replayed in the browser.

## Not exercised (implemented-unverified)

- Seer ladder 6/6 to Clown replayed in the browser after the change (engine tests and the old promoted save load cover it).
- 1366x768 and 1800/1536 layout, text-size checks, a panel screenshot (the panel is in a hidden workspace tab; checks were by DOM text), native Export button download.
- Cold-room vigil pacing and the 4-act count by human play; the numbers are proposals.
- Corpse Collector abilities in use (no encounter reads cold, rot or undead recognition yet); the corpse-collector Dai acting text itself (acts are authored).
- A hand-edited save holding both pathways is refused by the owner (tested at engine level); the refusal was not browsed.

## Hygiene notes

The browser autosaves to `localStorage['save data']` on unload, so "clear and reload" does not give a fresh game; fresh means a never-used origin (127.0.0.1) or deleting the key then waiting for the next unload. The earlier `localhost` save was a disposable test save from the ascension-paths lane and was cleared for the Seer regression.

## Next slice (suggested seam)

Q2 (district region layer) can reuse this data shape: location ids plus a jurisdiction row table in `book_world_lotm_ids.js`, with `lotmFacts` emitting "who supervises here", and Hale's `supervisorHere`/attention becoming per-district. Q6's promotion exam would replace the `request_assessment*` pair with one data-driven assessor row per pathway; the two assessment commands are the obvious merge point. A factory for the per-pathway command set (accept, ingest, act, assess, ingest next) would be the first refactor to do before a third pathway; it was not done here to keep the Seer commands untouched.

## Note 2026-10-23 (later lane, [lives checkpoint](../lotm-lives-regions-2026-10-23/CHECKPOINT.md))

The dial reason above cites "source note X3" for the wait. In the institutions pass X3 is the Warden-versus-senior-deacon note; the wait is F18 and X4 (three years, or up to half a year with acting). The code comment in `book_world_lotm_ids.js` now cites F18/X4. The two-pathway validator wall recorded above as deliberate was replaced by a recorded-cause rule (D4 of the lives checkpoint); that is a change to what Q1 accepted.
