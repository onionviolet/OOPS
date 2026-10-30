# Body, conditions and altered states (proposals, 2026-10-30)

Representation round for RPX4 (cultivation and body channels), RPX9 (altered states)
and RPX10 (disguise and identity) from the
[UI design audit](../audits/UI_DESIGN_CORE_AUDIT.md), on the MDL2 figure primitive
(`src/ui/figure.js`). Everything here is a proposal (status: agent-verified, not
human-reviewed). Rules applied: BHR2, BHR5, BHR6, BHR7, BHR19, BHR29 from
[domain rules](../DOMAIN_RULES.md); UR37, UR38, UR62 from [UI rules](../UI_RULES.md);
MDL2, MDL4, MDL5, MDL8; UR76 (proposed) for the home contract.

## BC1-BC6: representations weighed

| Code | Representation | What it shows well | Cost or risk | Verdict |
| --- | --- | --- | --- | --- |
| BC1 | **Body map**: regions placed on a standing body, each marked with its current condition (`!`) or lasting change (`●`), conditions and changes in plain notes, recovery milestones as tracks | Where harm sits (BHR2), time left, the next useful step (BHR19), lasting versus passing (BHR29) | Points on a body, not a drawn silhouette; regions are only the slots the body owner already names | **Default, built** |
| BC2 | **Channel ring**: channels around a core, open, closed or unmeasured, edges for which method draws on which channel | Cultivation affinity and blockages as node states (RPX4) | Only meaningful where a world has channels; the base frontier has only the latent root | Default where a body has channels; adapter and fixture built |
| BC3 | **Altered-state presentation**: the same body map and log, with a tint on the subject's frame, an intruding voice marked as such ("a thought that is not quite yours:"), and unreliable readings flagged `?` with the word "unreliable" | Intoxication, poison, fear, loss of control (RPX9) felt without lying | Easy to slide into hiding facts or moving controls; must stay subject-bound (MDL8) | Proposal; needs an altered-state condition with a `reads` field first |
| BC4 | **Second body view**: your own body and the borrowed face side by side, edges for who sees which and how long it lasts | Polyjuice, masks, secret roles (RPX10); seat projection of "appearing as" | The Polyjuice bench is its own world slice; wiring waits for that home | Adapter and fixture built; wiring is the next slice |
| BC5 | **Paper doll silhouette** with drawn limbs that change color | Familiar from RPGs | Needs a drawing per body kind (BHR4: constructs, spirits, plants), and color carries the fact (UR37) | Rejected for now; BC1 regions come from data and suit every body kind |
| BC6 | **Unusual: Seen and Felt.** The body split in two columns: what others can see (the owner's `look` text, public) and what you feel (`bioDetail`, private), with symptoms before any diagnosis (BHR7) | Makes the gap between appearance and experience playable: hiding a limp, a disguise that fails because of a visible sore hand, an NPC noticing what you did not mention | Needs a witness rule for who saw what; overlaps the seat projection (MDL4) | Proposal; the data already exists on every body trait and condition |

## Default, dial and reason

- **Default:** BC1, the body map, shown in Notebook › Practice › Body & recovery under
  a "Body figure" disclosure, with its full text form beneath the drawing.
- **Dial, per world and per body:** a world whose bodies have channels adds BC2 beside
  BC1; a borrowed or worn body adds BC4; an altered state layers BC3 on whichever is
  shown. Effects follow the save-level Effects setting (full, reduced, off).
- **In-world reason:** you know your own body by where it hurts and what changed, so
  the map is the character's own sense of their body. Channels show only after a
  measurement, because the character cannot feel an affinity they have not tested.
  A borrowed face shows both bodies because the wearer always knows which is which.

## Honesty contract (UR38, UR62, BHR6)

- Every fact is in words: the label, the state word and a note. The mark glyphs `!`,
  `●`, `✓`, `▶` repeat a word; color and the pulse add nothing the text lacks. A test
  pins this: removing every effect leaves the text form identical.
- The pulse sits on the subject (the region with a condition now) and stops when the
  condition ends. Under Effects reduced or off the halo is gone; controls keep their
  place (the drill button measured at the same offset in all three settings).
- Only conditions the body owner marks showable (`bioVisible`) appear. A hidden or
  dormant condition waits for its sign, test or fitting means (BHR6).
- The figure reads through `observerView`, never the lead's identity (MDL4).

## UR76 contract (proposed)

Home: Notebook › Practice › Body & recovery (existing, `#body_panel`). Shape: MDL2
figure. States and their text:

| State | Text shown |
| --- | --- |
| No body record | Figure hidden; the panel's scene line explains the record is not begun |
| Settled | "Nothing is troubling this body right now." |
| Condition now | "Now: sore hands." plus "Sore hands (hands, 12 min left): ..." or "until treated" |
| Lasting change | "Palm mark (marks, acquired): A pale line crosses one palm." |
| Milestone | "Conditioned grip, 1 of 3 done: 1. Drill 1 (done); 2. Drill 2 (current); ..." |

## Receipt

Files:
- `src/body_figure.js`: `bodyFigureSpec` (BC1, wired), `channelFigureSpec` (BC2),
  `secondBodyFigureSpec` (BC4).
- `src/body_ui.js`: Body figure disclosure; redraws only when the text form changes.
- `index.html`: loads `styles/figure.css` in the game page (it was gallery-only).
- `src/ui/preview/fixtures/body.js`: three fixtures through the same adapters;
  `src/ui/preview/figure_gallery.js`: one registration line.
- `tests/body_figure.test.js`: 7 tests on the real body engine and the panel.
- `scripts/body_figure_browser.cjs`: the evidence capture, reproducible.
- Evidence in [evidence/body/](evidence/body/): `body-panel-1920-effects-{reduced,full,off}.png`
  (whole 1920×1080 window), `body-panel-crop-effects-*.png`, `body-figure-text.txt`, gallery shots.

Checks (one line each; input: bundle `c22e3500a15f`, gallery bundle `96316e079476`):
- `node --test tests/body_figure.test.js`: 7 pass (no record, fresh settled body, drill soreness then
  expiry, hidden condition stays off, frail start, effects carry no facts, channel and second body, panel
  redraws only on change).
- `node scripts/body_figure_browser.cjs`, headless Chromium 1920×1080, fresh `localhost` origin with
  `?test_hooks=1`: elder met, body record begun, one grip drill finished by dev-stepped time, clock paused,
  then Settings › Effects set to reduced, full and off with Apply and save. Pulse halo animates only at
  full (`fig-pulse`); reduced and off show no halo; the drill button sits 1115.9 px into the panel in all
  three. No page errors.
- `npm run check:arch`: pass (no new main.js lines, no new cycles). `npm run check:rules`: pass, 5
  existing warnings.
- `npm test`: 4106 pass, 9 fail, 6 cancelled under load average 220-320 from sibling sessions; the
  failures are live-integration files hitting the 180 s timeout. RERUN-PENDING.

AD43 floor: FLR1 bundle `c22e3500a15f`. FLR2 reached from a fresh life by earned steps (elder, begin
record, drill), plus named fixture `body-record` in the figure gallery. FLR3 no new verb: the figure is
read-only beside the existing Body & recovery actions, which keep their costs and reasons. FLR4 consumer:
the existing body verbs; the milestone track names the next one (Drill 2, Keep the grip). FLR5 no
persistence change. FLR6 browser-verified (headless), route kind fresh life plus fixture; agent-verified,
not human-reviewed. BC2 and BC4 adapters are fixture-only: implemented, below floor.

Next slice: wire BC4 into the Polyjuice bench's effect line, then move the Body
figure's text summary into the Condition panel's Body section (the Condition home for
RPX9), then BC3 once an altered-state condition carries a `reads: unreliable` field.
