# B3 implementation receipt: Spirit Vision switch and exhaustion (M6), 2026-11-03

Status: implemented, below floor (focused-tested and built; no native run, no browser run). Rules: AR1-AR16, AD36, AD43, AD38, AD49.

## What changed (all in `src/book_world_lotm_be_seer.js`, registered through B2's `beSeerConditions`)
- Conditions `book.lotm.be_spirit_vision` ("Spirit Vision on") and `book.lotm.be_spirit_exhaustion`, both `bioVisible` with `absence:'zero'`, so `condition.<id>` is always a readable fact (0 when off).
- Effect builders for place-act rows: `beSpiritVisionOnEffects()`, `beSpiritVisionOffEffects()` (removes the switch, applies exhaustion), `beSpiritRestEffects()` (sleep acts end it).
- Predicate builders: `beSpiritVisionOnRequires()` (potion held, switch off, not exhausted), `beSpiritVisionOffRequires()`, `beSpiritVisionSeesRequires()` (the gate for M5 aura observations).
- Cost: content passes `beSeerUse()` (B1's `book.lotm.be_spirituality`) as the switch-on act's cost; no second pool. One assertion: both conditions need the drink.
- Two-tap is the in-world gesture (two glabella knuckle taps on, two off, ch33 P034-P035). The engine mechanism is two place-act rows, on and off.

## Source and assumed values
- Taken from text: switch by two taps (ch33 P034-P035); exhaustion after use, "three sleepless nights" (P036-P037); Beyonders of this path are not Sleepless and need sleep (P038).
- Assumed (AD49, WPR5): `BE_SPIRIT_EXHAUSTION_FALLBACK_MINUTES=720`, a fallback expiry; the text gives no length. Sleep clearing it is the intended route.
- Defaults with dials: exhaustion blocks switching on again (omit the clause from a row's `requires` where a world or method allows it); the pool is spent per switch-on, not per minute (the text says "constant drain" with no figure; a per-interval drain is not built).

## Display
The existing "Body and conditions" list (`characterBioView` conditions, rendered by `character_bio_ui.js`) shows "Spirit Vision on" while on and "Spirit Vision exhaustion" after. Off is shown by absence; no new view code was written. Not checked in a browser at 1920x1080, because no content row applies the conditions yet. Mobile deferred.

## Compatibility
Additive condition definitions; no schema bump; older saves hold none.

## Evidence rows
- source-edited: yes. focused-tested: yes. built: yes. native: no. browser at 1920x1080: no. human-accepted: no.
- `node --test tests/lotm_be_seat.test.js tests/lotm_abilities.test.js tests/lotm_seer_slice.test.js tests/lotm_primary_compat.test.js`: 37 pass, 0 fail. New case: no potion refuses switch and seeing; switch off refuses seeing; on spends the B1 pool; off leaves exhaustion that blocks switch-on and shows in the bio list; sleep effects and the fallback expiry clear it; round trip validates; condition without the drink refused.
- `npm run build` ok (dist restored). `check:arch` pass (main.js -5). `check:rules` pass, 0 problems.

## Native proof needs from kjw6 (not edited here)
- ch33 P034 act: requires `beSpiritVisionOnRequires()`, cost `beSeerUse()`, effects `beSpiritVisionOnEffects()`. Optional off row at P035 with `beSpiritVisionOffRequires()`.
- M5 aura observations (ch32 P061, P084, ch33 P006, P019) add `beSpiritVisionSeesRequires()` instead of the window-local `vision.first` fact.
- ch33 P037: the off effects produce the exhaustion; ch33 P050 sleep act adds `beSpiritRestEffects()`.
- Then a headless 1920x1080 look at the character view's condition list (target viewport desktop, outcome: both indicators appear and clear).
