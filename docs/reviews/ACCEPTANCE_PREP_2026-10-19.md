# Acceptance prep, 2026-10-19

Pre-run of three merged slices so Weibao's play pass is short. **Human acceptance of all
three stays OPEN.** This is agent evidence, not acceptance. Source was not edited.

- Commit under test: `26ecc4197` on `codex/gameplay-foundations` (other sessions work in their own worktrees, so later commits may differ).
- Rebuild: `dist/bundle.js` was older than `src/`, so `npm run build` ran. That modified tracked `dist/bundle.js`, `dist/bundle.js.map` and `index.html`; nothing was committed. Revert or commit them as you prefer.
- Server: `.claude/launch.json` existed but had no entry for this checkout. I appended `acceptance-prep` (python http.server, port 18452). The file is gitignored.
- Browser: built-in pane, fresh origin `localhost:18452`, viewport emulated at 1920x1080, desktop only. Mobile deferred (AGENTS.md).
- Method note: pointer clicks were unreliable, so I drove most steps with DOM `.click()` on the real elements, plus saves read from `localStorage`. Export was captured in-page (no file download) and fed back through the real Import input. The pane's screenshots lag and show a stale start screen until a real click on PLAY, so only two screenshots are kept.
- Cave depths secrets: referred to by route only. I saw the reveal log line ("loose wall" route, status: revealed) and nothing of what lies behind it.

Screenshots: [m4_cave_depths_lamp_lit.jpg](acceptance_prep_2026-10-19/m4_cave_depths_lamp_lit.jpg), [defeat_after_import_nearby_cave.jpg](acceptance_prep_2026-10-19/defeat_after_import_nearby_cave.jpg).

## Summary

| Slice | Browser result | Broken? |
|---|---|---|
| 1. M4 lamplight (PF52) | Buy, light, reveal, put out, reload, export/import all worked | Nothing broken. Combat and reading effects not exercised (O1) |
| 2. ECX1 + ECL2 money seam and ledger | Buy and sell wrote one named row each, totals right, reload starts a new window | Nothing broken. Ledger is hooks-only, no player UI |
| 3. CBL1/CBL3 defeat publisher | Native defeat published once, persisted through reload and import | Nothing broken. Saved-battle and structured-death paths not reachable in browser (O2) |

Console: no errors recorded in the pane. `private_packs/manifest.json` returned 200 here (the checkpoint saw a 404 on its origin).

## 1. M4 lamplight (PF52)

Owner: [CHECKPOINT M4 round](gm/dispatch/modular-seams-2026-10-16/CHECKPOINT.md#m4-round-lamplight-2026-10-19).

**Steps I took** (setup: fresh hero, then edited the stored save to unlock village trader, Nearby cave and Cave depths, 5000 money, strong skills so wolf rats do not end the visit; reload):
1. Village trade, bought Oil lamp and Lamp oil. Purse went 5000 to 3900 (display 110C spent). The lamp has no auto-use button.
2. Inventory, Oil lamp, Use. Log: "You fill and light your oil lamp: about 4h 0m of light." Save: `lamplight {lit:true, oil:240}`, flask consumed.
3. Reload: lit lamp and oil 240 persisted.
4. Walked Nearby cave to Cave depths. Log showed the lamplight reveal line (loose wall route, S: revealed), `Suspicious wall` availability 0 to 1, `noticed {Cave depths:20}`, oil 240 to 160 (burns while walking and fighting).
5. Use again: lamp out, oil stayed (129 after more fighting), `lit:false`.
6. Export, relit the lamp, Import the export: state reverted to unlit, oil 129, wall still revealed, `noticed` kept.

**What looked off or worth your eye** (not bugs):
- Price: the trader charged 110C for a lamp and flask whose item values are 25C and 2C 5W. That is a 4x trader markup (same as Coal: bought 28, sold 7), consistent with the checkpoint's 250/25 base. Whether 110C for the starter lamp feels right is your call (A1).
- The item panel says what the lamp does but not whether it is lit or how much oil is left. Lit state shows only in the log and the save (A3 in the checkpoint).
- The reveal log line appeared next to an unrelated wolf-rat "hole in the wall" line that is existing cave text.

**To accept, Weibao:**
1. New or existing hero with some money. Village, Trade, village trader, buy Oil lamp and Lamp oil.
2. Inventory, click Oil lamp, Use. Check the "about 4h of light" line and that Lamp oil is spent.
3. Go Nearby cave, Cave depths and stay a few in-game minutes. Check you see the loose-wall line and `Suspicious wall` appears in the place list, before any clears.
4. Save, reload, confirm the lamp is still lit. Put it out and relight to confirm oil is kept.
5. Judge the dials: price, 240-minute flask, light feel.

**Implemented-unverified (not exercised by me in the browser):**
- O1: lamp's combat effect (light bonus 40 capped at 100 in fights), and the night reading pace x1.2. Covered only by `lamplight_domain` unit tests and the headless journey, which does not read.
- O1b: refusal paths (stale quote, failed write conserving the lamp) and an old save without the slice in a real browser.
- Other viewports (1366x768 floor, UI_RULES set); the sheet is 1920x1080 only.

## 2. ECX1 + ECL2 money seam and debug ledger

Owner: [economy considerations, ECX1 and ECL2 evidence](ECONOMY_AND_TRADE_CONSIDERATIONS_2026-10-18.md). Commits 43d2e0c8b, merge ff781c6ef.

**Steps I took** (`?test_hooks=1`, which exposes `simulationTestHooks.project('economy')` after PLAY):
1. Imported save loaded: ledger had one baseline row `load +3900`.
2. Village trader: bought one Coal (3900 to 3872), sold it back (3872 to 3879).
3. Ledger rows: `native.trade -28 "Trade with villageTrader: bought 28, sold 0 coins"`, then `native.trade +7 "...bought 0, sold 7 coins"`. Sinks `{native.trade:-28}`, faucets `{native.trade:7}`, net -21. Matches the purse.
4. Saved: no `economy` key in the save. Reload: ledger reset to a single `load 3879` baseline row (new session window), purse unchanged.
5. The earlier lamp purchase (5000 to 3900) and the import both behaved with the same seam; import produced a `load` baseline.

**What broke or looked wrong:** nothing. Display units: 3900 stored shows as "3S 90C", so one displayed C is 10 stored units; ledger rows use stored units.

**To accept, Weibao:** this slice is deliberately invisible in play, so acceptance is "money behaves as before":
1. Buy and sell a few things, do a work shift, collect a reward. Check your purse changes match what the screens promised.
2. Optional debug check: open the game with `?test_hooks=1`, press PLAY, then in the browser console run `simulationTestHooks.project('economy')` to see one named row per change.
3. Save, reload, Export, Import. Purse should be identical each time.

**Implemented-unverified:**
- O3: the other named sources (activity, reward, village career tuition and stipend, generated people, story requests, debug console, heir leftovers). I only exercised `native.trade` and the load/import baselines.
- O4: rolled-back transactions dropping their rows (unit tests only).
- No player-facing ledger view exists by design, so there is nothing to judge visually.

## 3. CBL1/CBL3 defeat publisher

Owner: [combat considerations, CBL3 evidence](COMBAT_AND_CONFLICT_CONSIDERATIONS_2026-10-18.md). Commits c40c51a6f, 037fde3e3.

**Steps I took** (cleared storage, new hero, unlocked Nearby cave only, auto-return-to-bed off, reload):
1. New hero's save had no `defeat` slice and `total_deaths 0`.
2. Walked Nearby cave to Cave room and let a wolf rat win. Log: "Hero has lost consciousness", title "Back Again" earned.
3. Save: `total_deaths 1` (legacy counter unchanged), `defeat {counts:{unconscious:1}, last:{outcome:unconscious, cause:{kind:combat, place:"Cave room", by:["Wolf rat"]}}}`. One publication, not two.
4. Reload: identical `defeat`. Export, Import: identical `defeat` and `total_deaths`; hero woke at 5/60 hp in Nearby cave.

**What broke or looked wrong:** nothing. There is no on-screen display of outcome or cause yet (CBL4 is not built), so the record is visible only in the save.

**To accept, Weibao:**
1. New hero. Go Nearby cave, Cave room, and stay until you pass out. Check the log line and that you wake up as before.
2. Save, reload, confirm nothing odd (no repeat loss, no extra death count).
3. For the saved battles (road duel, Lio party, sluice): play one to a loss if you can reach it, and check you wake or return as before. See O2.

**Implemented-unverified:**
- O2: the road duel, party and sluice paths. The checkpoint's own browser run covered only the Lio party duel (lost and won); sluice and structured-pack `killed` death are unit tests only. I could not reach them from a fresh hero without a generated fixture and did not build one.
- O5: rollback of the defeat record on a failed durable write (unit tests only).
- BHL7 injury, other outcomes (yield, escape) and CBL4 display are not built, so there is nothing to accept there.

## Open items for the director

- R1: working tree now has rebuilt `dist/` and `index.html` (uncommitted, from my rebuild).
- R2: lamp price feel (4x trader markup, 110C) is a proposal dial, not a defect.
- R3: acceptance for all three slices stays OPEN until you play them.
