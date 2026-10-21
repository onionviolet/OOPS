# Title benefits implementation, 2026-10-21

Implemented a bounded native title/benefit slice under SLR40–43, AD30/38,
AR1–16 and UR59–64. [Coverage](COVERAGE.md) accounts for CRL27–48 without
turning source examples into new world mechanics. Weibao's wider direction
remains intact. Human taste/play acceptance is separate.

## What was wrong and what changed

**F1. Valid selected identity could disappear visually.** Validation accepted
any held title but the chooser listed only domestic-payoff titles. All valid
held titles are now represented, with explicit “no worn bonus” where fitting.
No save schema or selection migration changed.

**F2. Bonus text did not distinguish entitlement from applicability.** Locked
bonuses now say “Benefit when earned”; earned bonuses say “Held benefit active”.
Recognition without a held grant is explicit. Optional worn descriptions come
from the actual payoff map via the shared bonus formatter. Status explains
wearing off, absent selection, fewer than three known held titles, no payoff,
or the ordinary activity XP consumer. The controls precede the long catalog.

**F3. Existing native mechanisms already supply the behavior.** Held bonuses
remain derived, optional worn XP remains independent, and setTitleBonus replaces
its inputs. Native Sleeping is the usable activity, not a fabricated title
command. SkillXP is never mutated by inspection or selection. No invented
fictional cause is claimed for existing numerical grants.

## Verification

Final checks on FINAL_INPUTS.json:

| Check | Result |
|---|---|
| npm run build | Pass; sourcemap content matches 675 current input files |
| npm test | 2396/2396, 0 failed after the final UI change |
| npm run check:arch | Pass; no main/display/save growth |
| npm run check:rules | Pass; two existing untracked-owner warnings |
| node scripts/playtest/title-benefits.mjs . docs/gm/dispatch/title-rules-implementation-2026-10-21/evidence | Pass; five scenario groups, no browser errors |
| git diff --check on touched tracked paths | Pass |

No standing rule was changed, so check:rule-behavior was not required or rerun.
[Exact logs](evidence/tests.log), [browser receipt](evidence/receipt.json),
[14px](evidence/titles-14.png), [21px](evidence/titles-21.png). Both screenshots
were visually inspected: worn controls/status are visible above the catalog,
with native center scrolling, the back bar and log column retained.

Browser fixture setup
uses the existing disposable mid fixture, access, counter proximity, native kill
and purchase history, and skill XP. A real played Shack stay earns quiet_hour;
ordinary sleeping consumes its real XP modifier. No personal save was opened.

The native consumer test repeatedly applies title inputs, switches a domestic
payoff to Hunter/null/back and proves learned Sleeping XP and held Combat XP
remain intact. Invalid/unheld selections retain existing validation tests.
The browser checks on/off ordinary Sleeping XP, active and nonpayoff selection,
Save/reload/Export/literal Import, paused hover/focus, load-cue silence and actual
14/21px title text at 1920×1080. Screenshots are in [evidence](evidence/receipt.json).

Per-tick native rounding matters: the observed two-tick totals are 2.14 XP with
the worn payoff and 2.10 without. The modifier remains 1.02; displayed/settled
hundredths are not an exact ratio at tiny samples. The first harness assertion
incorrectly expected an unrounded ratio and was corrected without runtime edits.
Other harness corrections: open Stats before Bio, return to Shack before using
its action, and allow the start-location arrival step before earning home time.

## Files and boundaries

Runtime: src/titles_ui.js and src/absorb_p23/long_life/worn.js.
Tests: tests/p23-long-life.test.js; scripts/playtest/title-benefits.mjs.
Owners: PROJECT.md summary, title palette C14 follow-up, SKILLS_AND_TALENTS
follow-up, and this packet's INPUTS/CHECKPOINT/COVERAGE/REPORT/evidence.
Build refreshes the already-dirty dist/bundle.js, dist/bundle.js.map and generated
index.html fingerprints. src/main.js is byte-identical to entry; its pre-existing
edits remain. No commits, pushes, source HTML execution or child agents.

**R1. Remaining scope:** no title-specific active command, new conditional
salvage, material-combination grant, perishable estimate lifecycle, revised
offline policy or social simulation was invented. Each needs its actual world
mechanism and consumer before implementation. Existing routes outside this title
slice are source-inspected, not newly certified by this browser journey.
**R2. Remaining acceptance:** Weibao's visual/play judgment; natural long-run
progression/balance is not established by deliberately seeded boundary fixtures.
Mobile optimization remains deferred.

Usage: live 51% at entry, 52% after implementation and verification checks.
Ceiling 56% was not reached; no new speculative slice was opened after the
finite fitting title/practice/inspection work. Wider examples remain explicitly
future under their existing proposal owners.
