# L4d brief: fix G0-G3 so the beside start meets the floor

Model: `gpt-6.1-sol`, medium effort. Runs locally in `/Users/weiwei/code/yet-another-idle-rpg`. Owns
L4c's uncommitted files (inventory in [L4C_CHECKPOINT](L4C_CHECKPOINT.md) F1). Do not commit; the
coordinator commits. Never stash, reset, force or push. Card: [CAST_LIVES_CARD](../CAST_LIVES_CARD.md)
(CLR codes); UI rules `.claude/rules/player-ui.md`; target 1920×1080 desktop.

## Publication class (CLR3)

Unchanged from L4c: canon data and texts in `private_packs/`; `src/` and `tests/` name-free; screenshots
private.

## Gaps to fix (from the coordinator's browser run, L4c checkpoint)

| Code | Fix | Done check |
| --- | --- | --- |
| G0 | `src/book_world_lotm_cast_days.js` top-level-awaits the private-pack fetch, which holds module evaluation at boot so `index.html`'s inline `get_game_version` call fails. Remove every top-level `await`: start the fetch without blocking, keep cast features off until it resolves, and have the host and day bridge read the loaded pack through a getter (or an explicit `whenCastLoaded()` promise awaited inside the host's own async start path). Derived constants become functions of the loaded pack | `node --test tests/cheat_cards.test.js tests/native_save_fixtures.test.js` pass (4 currently fail); a test asserts no module in the cast path uses top-level `await` |
| G1 | The beside resident's place panel shows probationer content (the Seer pathway block, the supervisor's attention, "Plan the next crossing", the brewing bench, the captain's jurisdiction line). Gate those blocks on the probationer-track profiles; the resident sees their place, the people here and their talks, travel, and ordinary services only | Browser screenshot of the resident's flat shows none of those blocks; the four original profiles' panels are byte-identical in their view output (extend the existing compatibility test) |
| G2 | Remote principals (whereabouts outside Tingen) show as Tingen talk targets with an away line naming a remote room. Offer no Tingen talk for them; list them under a short "Elsewhere" line ("lives in [city]") only if the player knows of them | Test: a remote principal yields no talk command and no away line; a known remote principal shows one "Elsewhere" row |
| G3 | "Local date unavailable" and "Local weather unavailable" in the beside life. Feed the header from the beside clock (relative day and band, with no invented month while the start month is Weibao's open question) and the place's weather if the world has one; otherwise a neutral line ("Day 2, morning") | Screenshot shows the day and band |

## Done check (AD43)

- Focused tests pass, plus the two suites named in G0.
- Rebuild with `BUILD_OUT`; run `node /tmp/l4c-browser.cjs` (or your copy of it) and report **zero page
  errors**, the bundle hash, and screenshots (private folder) for the start choice, a present talk, an
  away refusal, and an "Elsewhere" row if any.
- `npm run check:arch` no growth; `node scripts/check_private_cast.mjs` passes with packs and skips without.
- If the sandbox blocks the browser, say so; the coordinator runs it.
- Checkpoint `cast-lives-lanes/L4D_CHECKPOINT.md` with FLR1-FLR6.
