# Lane brief: S1, the seat filter (CL224, CL227, CL237, CL244)

Model: `gpt-6-luna`, medium. Runs locally in `/Users/weiwei/code/yet-another-idle-rpg`, beside the G1 fix
lane (G1 owns `src/book_world_lotm_ui.js`, `src/book_world_lotm_cast_host.js`, `src/book_world_lotm_host.js`,
`src/wait_until.js` and `src/main.js` while it runs; do not edit them). Card:
[CAST_LIVES_CARD](../CAST_LIVES_CARD.md); plan sections 23-25 and 27 (CL268: be the lead is the main line,
AD44) govern. Rules: `.claude/rules/runtime-code.md` (AR1-AR16), `.claude/rules/player-ui.md`, AD43.
Target viewport 1920×1080. CLR codes applied: CLR2-CLR4, CLR9-CLR13.

## Data probe (CLR2)

| Field or input | Expected | Observed | Gate? |
| --- | ---: | ---: | --- |
| Rows in `src/perspective_controls.js` (C1, uncommitted until the coordinator commits it) | 64 | | yes |
| Navigation route ids in `src/layout_spec.js` | 20 | | yes |
| LOTM entry profiles in `src/book_world_lotm_state.js` (`entryProfile` values) | 5 | | no |

## Scope and seam

- **Outcome and player sentence.** Today nothing visible changes in any existing life. A life whose seat is
  `be` (B1 adds that start later) sees only `in-world` controls, with `system` controls reachable from the
  Menu; `crossing` and `other-seat` controls are absent, not disabled. Every other seat behaves as today.
- **Mechanism.** New `src/seat_profiles.js` (name-free) holds:
  1. `SEATS`: `be`, `beside`, `follow`, `bystander`, `ordinary` (every life that is not a book-lead seat).
  2. Per-seat profile data: allowed perspective tags and allowed capability audiences. Defaults:
     `be` gets all audiences and the tags `in-world` plus `system` (Menu only); `beside`, `follow` and
     `bystander` get audience `world-general` and every tag (today's screens); `ordinary` gets everything.
  3. A capability registry: `registerCapability({id, audience, panel})` with audience one of
     `world-general`, `seat-only`, `world-mechanism`, `harness` (CL210-CL213). G-lanes register there.
  4. `seatOf(state)`: derived from existing state only (the LOTM `entryProfile`, and a reserved be profile
     id that B1 will add); no new saved field.
  5. One read point: `seatAllows(state, {control} | {capability})`. Panels and the shell call only this.
- **Files owned.** `src/seat_profiles.js`; `tests/seat_profiles.test.js`; a hunk in `src/workspace_navigation.js`
  (or the one module that builds the route buttons, found by you) so routes consult `seatAllows`; checkpoint
  `cast-lives-lanes/S1_CHECKPOINT.md`. For the LOTM panel and `main.js`, write
  `cast-lives-lanes/S1_INTEGRATION.patch` (the panel's blocks consult `seatAllows` by C1 anchor) and continue.
- **Publication class (CLR3).** Public, name-free code and tests. No book-pack (local book pack, not published)
  data.
- **Seam (CLR10).** Seat is derived, never stored twice (AR3). Tags come only from `src/perspective_controls.js`.
  No per-control `if (seat === 'be')` checks outside `seat_profiles.js` (CL237).
- **Save and economy (CL220, CL227).** No new save fields. A non-be save carries no seat-only fields; changing
  seat starts a new life, never toggles a save.
- **Actor parametrization (CL225).** Capabilities registered with an actor-free id; the seat decides visibility.
- **Disclosure (CL228).** No new panel. Hidden means not rendered, so it never crowds the screen.

## Work and done check

- **Failure case.** An unknown control id or capability is allowed (visible) and logged once to the dev
  console, never hidden by default (CLR4: absent means unknown).
- **Verification.** `node --test tests/seat_profiles.test.js`: a synthetic `seat-only` capability is hidden
  for beside and shown for be; a synthetic be state hides every `crossing` and `other-seat` C1 row and keeps
  `system` rows only in the Menu set; ordinary and the four original LOTM starts plus beside allow every
  route they show today (compare against `layout_spec.js` routes); a beside save round trip carries no
  seat-only field. `npm run check:arch`: no growth, no new cycle. `node scripts/lane_review.mjs` with your
  grants and paths.
- **Done when.** Tests pass, the prepared patch applies with `git apply --check` against current HEAD, and the
  checkpoint has FLR1-FLR6 lines. Browser proof is the coordinator's (sandbox blocks Chrome).
- **Stop conditions.** The route buttons are built in more than one module with no shared point: stop and
  name the modules.
- **Known ambiguities default (CLR12).** The pane selector ("Other known panels") lists panels; filter its
  options through the same read point. The workroom and supervisor rows are absent from C1; leave them
  visible (B1 decides by date, since the lead later works there).

Do not commit. Keep canon names and source text out of tracked `src/` and `tests/` (CLR3).
