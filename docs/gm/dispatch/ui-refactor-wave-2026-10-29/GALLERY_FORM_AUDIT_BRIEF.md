# Gallery form audit brief (2026-10-30, ready to run)

Weibao, 2026-10-30, after seeing the gallery: "better but not quite, I feel like it can be so much better, but idk how, can we send these indeas into something to audit each of them, to be less generic and also less wall of text? what liberties do we need to take in that case?"

Feeds the look owner: `ui-identity` lane, `DESIGN.md` ([UI identity wave](../ui-identity-combat-2026-10-30/PLAN.md), O1 accepted, O3 diegetic UI after the basic kit). This audit proposes; DESIGN.md decides.

## What is generic today (coordinator's read of the 1920x1080 captures)

- Every figure prints its full text form under it, so each section is a wall of text even when the picture is clear.
- One bitmap mono face at one size for titles, labels, values and prose: no hierarchy, nothing to read first.
- Boxes in boxes with the same hairline frame: home, ledger, crossing, insight all look like the same dashboard.
- The same fact is said three times: a count ("4 of 5 fitted"), the chips, then a key and a text line.
- No object, place or hand in it: nothing looks like a ledger page, a ticket, a floor plan, a sky, two people facing each other.

## Per section, the audit answers

1. What the player needs from it in two seconds (one line).
2. Word count now, and a target.
3. What makes it generic (from the list above or new).
4. A bespoke form: the object it should look like in this world (diegetic where it helps), with one reference game and what that game does (known or inferred).
5. Which liberty it needs (L1-L6 below) and the cost.
6. Effort and an owner: gallery draft, DESIGN.md rule, or a lane.

Then pick the five sections with the biggest gain and build them as side-by-side redesign drafts in the gallery ("Redesign:" next to the current one), so Weibao judges by eye.

## Liberties the redesigns may take (gallery drafts only until Weibao accepts them for play)

- L1. Text form off screen: the figure's text form goes to hover, a "read as text" toggle and screen readers, not printed under every figure.
- L2. Typographic hierarchy: big value, small label, a second face for headings and numbers; the bitmap face stays for the Luminous identity, not for everything.
- L3. Bespoke object per system and per world (AD46): one shared grammar underneath, but the surface may be a ledger page, a ticket, a floor plan or a sky band rather than a framed box.
- L4. Drawn assets: small SVG illustrations, icons and textures, still from tokens for colour.
- L5. Say it once: drop keys and repeated counts when the picture already carries them; the details sit one click away.
- L6. Show what matters now: default views show changes and the next decision, and the full inventory sits behind a disclosure.

## Model and budget

Sonnet design auditor reading the gallery captures and fixtures, with the advisor tool for taste calls. One agent, about 2-3% weekly. Writes `docs/audits/GALLERY_FORM_AUDIT_2026-10-30.md` and the five redesign drafts; sends DESIGN.md proposals to `ui-identity`.
