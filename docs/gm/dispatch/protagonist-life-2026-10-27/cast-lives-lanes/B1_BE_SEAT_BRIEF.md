# Lane brief: B1, be the lead (CL245, CL249-CL251, CL264, CL266, AD44)

Model: `gpt-6.1-sol`, medium. Runs locally in `/Users/weiwei/code/yet-another-idle-rpg`. Card:
[CAST_LIVES_CARD](../CAST_LIVES_CARD.md); handoff CO1, CO4-CO6; plan sections 25-27 govern (the be seat's
whole interface is the lead's perspective; be the lead is the main line, CL268). WER11 reads per PX18
(Weibao accepted the default 2026-10-28). Rules: `.claude/rules/runtime-code.md` (AR1-AR16),
`.claude/rules/player-ui.md` (UR1-UR75), [world entry rules](../../../../WORLD_ENTRY_RULES.md) WER1-WER17,
AD6-AD8, AD43, AD44. Target viewport 1920×1080; mobile deferred. CLR codes applied: CLR1-CLR13.

## Data probe (CLR2)

From the local book pack (not published) `private_packs/lotm-cast/cast.json` and the merged slice:

| Field or input | Expected | Observed | Gate? |
| --- | ---: | ---: | --- |
| The lead's own person record (id, name, home place, schedule rows) | 1 record, 5+ schedule rows | | yes |
| His family and landlady with relations to him | 3 or more | | yes |
| Flashback or backstory rows in chapters 1-24 (scenes or steps dated before the first lead scene, or flagged as memory) | 5 or more | | yes |
| His starting purse, possessions and debts stated in chapters 1-3 | 2 or more facts | | no |

## Scope and seam

- **Player sentence.** From the start list (book pack present): "Be [his name], in his rented flat, the
  morning the book begins." In the life: every screen is his. People he knows are named from day 1; the
  journal is his diary; Reports say "you" as him. No Village, other worlds, Continuing connection, start
  pickers, cheat cards or crossing powers appear. Save, Export, Import and Settings live in the Menu only.
- **Mechanism.**
  1. A be entry profile that reuses the beside start's records (cast, places, schedule, beats) with the lead's
     body, purse, home, possessions, memories, relations and duties as the player life (CL249). His own
     schedule rows stop driving an NPC body; the player drives it (CL266). His duties and appointments feed
     G1's `knownAppointments` port so "Wait until" offers his day (CO1).
  2. **History pass (CL251, CL264).** Flashback and backstory rows from the slice become dated records held
     at the start: memories (the knowledge owner, with cause and date), relations, possessions and debts.
     Absent means unknown (CLR4), never "none".
  3. **Seat.** Register the be profile id in `src/seat_profiles.js` so `seatOf` returns `be` for it (S1 marks
     only `book.lead.be@1` today, and treats `lotm.early_tingen.*` as beside; do not name the be profile so it
     falls into beside). Build the be view without crossing and other-seat blocks at the source (CO4); S1's
     DOM filter stays as the backstop.
  4. **No Village behind him (CO5).** A be life links no paused Village life and writes no crossing state;
     the save carries no crossing fields. Leaving the seat is a Menu action that starts a new life (CL227,
     CL240).
  5. **Naming (CL238).** Name masking reads his knowledge record, not the player's.
  6. **Determinism (CL260-CL263).** Every chance this lane introduces draws through the existing
     `src/seeded_streams.js` / `src/hash_rng.js` owners, keyed by the life's world seed, day and subject, so
     the same life with the same actions gives the same result and reload never rerolls. The player's
     departures from the book are recorded and labelled divergence (WA15), never blocked; the cast's book
     beats keep following the book while the state they depend on still matches (CL262). Add one test: two
     runs of the same synthetic be life with the same actions produce byte-identical state.
  7. **The workroom and supervisor (CO6).** Tag by date in the book pack: other-seat before he joins, in-world
     after.
- **Files owned.** `src/book_world_lotm_lives.js` (profile), `src/book_world_lotm_state.js` (profile id list),
  `src/book_world_lotm_cast_host.js`, `src/book_world_lotm_host.js`, `src/book_world_lotm_ui.js`,
  `src/seat_profiles.js`, `src/perspective_controls.js` (new rows only), the book pack under
  `private_packs/lotm-cast/`, a new focused `tests/lotm_be_seat.test.js` (synthetic, name-free), checkpoint
  `cast-lives-lanes/B1_CHECKPOINT.md`. Anything else: `cast-lives-lanes/B1_INTEGRATION.patch`, then continue.
- **Publication class (CLR3).** Code and tests public and name-free; his name, family, history and start text
  live in the book pack only. Screenshots private.
- **Save (CL220, AR6).** New: the be profile id in the existing `entryProfile` field (additive; readers that
  do not know it already refuse unknown profiles with a preserve-the-save message, keep that). No migration
  for existing saves. The four original starts and beside are unchanged; prove it with the existing
  byte-identity regression.
- **Actor parametrization (CL225).** The be start is "be the lead of this pack": the lead's id comes from
  the pack, not code. Grep your diff for any lead-only branch outside pack data.
- **Disclosure (CL228).** No new panel; the start option sits with the other Tingen starts.

## Work and done check

- **Failure case.** Without the book pack the be option is absent, with the existing "book pack absent"
  reason; an old save with the be profile and no pack loads read-only with that reason.
- **Verification.** `node --test tests/lotm_be_seat.test.js`: a be state's view lists no crossing or
  other-seat control; the save has no crossing or seat-only-foreign fields; history records exist at the
  start with dates before day 1; his schedule no longer moves the body the player drives; beside and the
  original starts are unchanged. `npm run check:arch` no growth. `node scripts/lane_review.mjs` with grants
  and explicit paths.
- **Done when.** Tests pass; the checkpoint lists FLR1-FLR6 and rescored seat-only steps from the L5r ledger
  (7 rows, `needs seat: be`): which become reproducible in the be seat, which become ordinary gaps.
  The coordinator runs the browser: a fresh be life at 1920×1080, screenshots of every top-level menu
  showing only in-world and system items, then the L5r replay in the be seat (CL269).
- **Stop conditions.** The lead's person record is missing from the pack, or his body cannot be the player
  body without a second body store: stop and describe the seam.
- **Known ambiguities default (CLR12).** Start time: the first lead scene's day and band from the binding.
  Unknown history dates: keep the record with `date: before start` and the locator as basis. Cheat cards and
  crossing powers: hidden in the be seat (CL239); Weibao is asked after this lands.

Do not commit. Keep canon names and source text out of tracked `src/` and `tests/` (CLR3).
