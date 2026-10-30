# C6 character-sheet return, 2026-10-30

Scope: WA48-WA50; WPR2, WPR4, WPR8, WPR19, WPR21, WPR23. Bounded source check of two private sheets, no runtime or design-rule change. Only the two owned JSON files and this folder were written. No Git mutation or commit.

## F1: entity classification prevents a personal sheet

`lotm.person.luen` stays explicitly thin: the inspected bundle references denote a country, not a supported individual. Cleared misattributed personal abilities, money and outcomes; preserved the record id and links. The private `thinReason` and `evidenceReview` list the missing evidence. No identities or numeric power invented to bypass the thin branch. Registry repair is outside C6 ownership and goes to sw-chars/sw-absorb: review the id before any consumer treats it as an individual. Do not merge it with a similarly named person.

## F2: dated record and two calibration outcomes

`lotm.person.groselle` has 5 identity entries, 1 affiliation, 1 dated power/title entry, 2 ability references, 1 inferred stat, 1 condition and 2 checkable outcomes: 13 list entries total. Removed a misattributed ability, corrected the title's attestation date and removed the unsupported generic identity gate. The numeric pathway/sequence remains unknown (`null`); a stated title is not proof of a numeric rank. The record no longer takes the test's thin branch and differs at b1:213 versus b8:1. This branch was already bypassed by existing identities before C6; bypass alone was not evidence of completeness.

Outcome events were checked against source paragraphs. Their band and attack thresholds are explicitly inferred ordinal calibration with basis, not source numbers or independently measured whole-opponent rankings. No new sealed truth was added; no new reveal gate was warranted by the checked identity evidence. Detailed facts remain in the private JSON.

## Checks and input identity

- `node scripts/lead_run/cite_paragraphs.mjs <private-root> --merged <private-root>/m4-whole-book-2026-10-29/merged --id lotm.person.luen --id lotm.person.groselle --context 3 --max 8`: passed, 14 paragraphs printed, zero missing. The tool applies its cap between locator windows, so output exceeded 8. This initial command reaches early mentions, not every relevant later scene.
- `bundle(id, 100)` imported from `scripts/lead_run/character_bundle.mjs`, evaluated for each id: rebuilt both bundles in memory against the current merged JSONL files. No bundle cache writes outside owned files. Sampled original paragraphs through `shardIndex` for the selected bundle locators, including b2:74, b3:24/95/210/214/215/217/219/220/221/236/237 and b5:199/203. These were bounded excerpts, not a whole-book read; remaining source is unread by this lane.
- `node --test tests/character_sheets.test.js`: PASS, 8 tests, 0 skipped, 0 failed, with both edited private sheets present. Gap: no runtime, build or browser claim; full suite belongs to the coordinator.
- Inline Node JSON/bundle/read-model validation: PASS, every retained list-entry locator belongs to its rebuilt bundle; both Groselle outcomes return true; dated identity/power snapshots differ; Luen remains in the thin branch for F1's stated reason. Gap: no independent canonical numeric ranking follows from inferred calibration.

## Handoff

Owned private files: `character-sheets/luen.json`, `character-sheets/groselle.json` under `docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/`. These are gitignored private artifacts; this report is the tracked receipt, not authority to force-add them. Source-spot-checked and focused-test-verified, not human-reviewed. Open: classification repair for `lotm.person.luen`; a direct numeric rank/pathway locator for `lotm.person.groselle` if needed by a future consumer. No host patch needed.
