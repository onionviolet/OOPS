# HP lead life: shell money/items/stats and clock label (O1, O2), 2026-11-03

Closes O1 and O2 of [HP_WINDOW1_RECEIPT](HP_WINDOW1_RECEIPT.md). Rules: AD36, AD43, AD44, AD46, AD51, AR1-AR16, UR (display only). **Agent-verified, not human-reviewed.** Nothing committed or pushed; tracked `dist/` not rebuilt (isolated snapshot only).

## What was wrong
- **O1.** The shell's purse, inventory rows, item-count tabs and Hero stat sheet read the native Village hero in every world. Premise correction: the brief assumed other non-native lives already avoid this. They do not. School, trade, Gu and Shadow Slave starts show the same 102 coins, bread, pants, STR 12 and 60 hp. The only precedent was `localMoneyLabel` (a relabel for Tingen, not a hide). So there was no mechanism to reuse; I added the smallest world-keyed one.
- **O2.** `hpCalendarBinding` listed only the school and trade lives, so the lead world had no local calendar (`Calendar unknown here`), and the Reports "Now" line fell back to the native clock (`Mon, Summer, Day`). The elapsed-calendar formatter also never prints a weekday.

## What changed (source-edited)
- New `src/own_holdings.js`: registry `registerOwnHoldings(worldId, {purse, items, body})`, display only. No stored state, no save change, no migration. The native hero and inventory are untouched and show again in any other world.
- `src/world_look.js` (`applyWorldLook`, the existing per-world root hook): sets `data-own-holdings="on"` on the root only for a registered world, and keeps the world's notices in the inventory and vitals panels. Written only when on, so every other world writes nothing new.
- `src/display.js` (`update_displayed_money`, +3 lines): a registered world's purse text replaces the native figure; the purse chip follows it.
- `styles/world_look.css`: under `:root[data-own-holdings="on"]`, hides the native item rows, the item-count tabs, the vitals bars and the stat grid and gear tools, and styles the notice.
- `src/book_world_hp_lead_domain.js`: registers the lead world's own holdings (its life has `items:[]` and no resources) and a local clock source for the Reports line (existing `registerLocalClockSource`, as LOTM does). Keyed by the world id the module already owns, no id in shell code.
- O2: `src/book_world_hp_facts.js` adds the lead life to `hpCalendarBinding` (the existing HP calendar owner, `resolveWorldCalendar` path); `src/world_calendar.js` `formatCalendar` prints `weekday, day N` for an elapsed view that opts in (`showWeekday`). Result: `Sat, day 1 08:00`, then `Sun, day 2`. No year, no month. `hpSchoolCalendar` and the school and trade labels are untouched.
- Compatibility decision: the weekday flag is added in `hpCalendarBinding`, not on `calendarProfile`. First attempt put it on the profile; that changed the pack content hash and every earlier save landed in structured recovery. Reverted. No new persisted state.
- Test: `tests/hp_lead_life.test.js` gained one test (calendar reads Saturday then Sunday, no year, no Summer or Shift; holdings registered only for the lead world, not Frontier or school).

## Checks (one line each)
| # | State | Command / route | Input identity | Result | Gap |
|---|---|---|---|---|---|
| 1 | reproduced | headless 1920x1080 `shot.mjs` on the rebuilt snapshot, window-1 `origin.json` | bundle before the fix | showed 102 coins, Stale bread x5, Cheap leather pants, STR 12, 60/60 hp, `Calendar unknown here`, `Now: Mon, Summer, Day` | `private/hpo1o2-2026-11-03/before-1920.png` |
| 2 | rebuilt | `BUILD_OUT=… node build.js` in a fresh isolated snapshot of the working tree | bundle sha256 `6c36dba48271301f…` | built, 0 errors | Snapshot lacks png assets; tracked `dist/` and installed app not rebuilt |
| 3 | natural journey (view) | same screenshot route, fixed bundle, 1920x1080, then Settings font 14 and 21 | `after-1920.png`, `after-14px.png`, `after-21px.png` | header `Privet Drive days · Sat, day 1 08:00`; Reports `Now: Sat, day 1 08:00`; purse `no money of your own`; `You carry nothing of your own.`; no native stat grid or hp bars; same at 14 px and 21 px | Panel text and layout not human-reviewed |
| 4 | before/after unchanged | same route, snapshot with my six files reverted to their pre-edit blobs vs fixed bundle: native Village start, `book.hp.school`, `book.hp.trade` | page text dump | text identical for all three; screenshots byte-identical for native and school; trade differs between two runs of the same unchanged build, so its screenshot is not a signal | Not run for Gu or Shadow Slave (same shared path, not touched) |
| 5 | focused-tested | `node --test` hp_lead_window1, hp_lead_life, world_calendar, world_look, world_source_calendar, hp_arrival_compatibility, world_pack_hp | tree of this session | 40 pass, 0 fail | Not the full `npm test` (not run, by instruction) |
| 6 | source gate | `npm run check:arch` | main.js 10110, display.js 6757 | exit 0 | |
| 7 | source gate | `npm run check:rules` | | PASS (1 warning, an untracked file linked from the index, not mine) | |
| 8 | natural journey | generated window-1 `play-episode.mjs` (output redirected to scratch), fresh from `origin.json` on the fixed bundle | bundle `6c36dba4…` | 8 of 8 acts, `{"steps":8,"checks":1,"pageErrors":0}` | Act minutes are fill, as in the window receipt |
| 9 | persistence | `verify-ui.mjs` (scratch copy): reload of the completed save, literal Import of the exported file | the new run's `completed-*` | both digests equal the completed save; 5 locked rows, panel at 14 and 21 px, no overflow | Installed-app persistence not run |

## Separate states
Source-edited: yes. Focused-tested: yes (40 pass). Rebuilt: isolated snapshot only. Natural journey: 8 of 8 acts. Persistence: reload and Import digests match. Human-reviewed: no. Full `npm test`: not run.

## Open
- **A1 AD51 follow-up.** School, trade, Gu and Shadow Slave lives still show the native hero's purse, items and stats. The registry now makes that a one-line registration per life once each says what it holds; school and trade deliberately keep a separate native purse today (their text says so), so a design call, not a mechanical copy.
- **A2** The veil hides the native stat sheet; it does not show Harry's own vitals (the life tracks health 100, stamina 100 only in simulation). A life-owned vitals readout is a separate slice.
- **A3** The life's simulation inventory is not rendered in the shell inventory (empty here). Needed when a lead life gets items.
- **A4** The inventory filter control and the Gear tab remnants in the header were left; they carry no native figures.
- CSS ids (`#inventory_div`, `#basic_character_info_div`, `#proto23_character`) are legacy shell ids; a shell restructure must keep them or move the veil.
