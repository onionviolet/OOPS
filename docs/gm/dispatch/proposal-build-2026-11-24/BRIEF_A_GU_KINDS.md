# Lane A brief: second-read and fold the Gu kind leads (B1), then map wiki effects (B2)

Read [README](README.md) for the shared rules, then the [reconciliation](../../../audits/PROPOSAL_RECONCILIATION_2026-11-24.md) "Gu ledger leads" table.

## B1, kind leads

The leads:
- the six rank proposals in [audit P3](../../../audits/GU_UNKNOWN_BLOCKERS_SAMPLE_2026-11-24.md#full-text-pass-results-a1-2026-11-24);
- the HW report's L3, L4, L6, L7, L8, L9, L10 and L11 ([HW report](../../../research/HEAVENS_WILL_DISCORD_IDEAS_2026-11-24.md#answers-for-the-gu-ledgers));
- the RI research's C6 and C8;
- `fandom:Time_Anchor_Gu` rank 6 at `ri:ch1810:p41`;
- the five P4 type words.

Private evidence: `docs/research/advancement-aspects-2026-11-16/private/fulltext_gu_ranks.json`.

1. For each lead, run `python3 -I scripts/check_passage.py --ledger gu_kinds --id <id> --json` and read the cited paragraph and its neighbours yourself. You are the second reader: the first readers were a regex pass and a Codex research lane. Record agree, differ (with your value) or nothing. A character's guess is not a stated fact.
2. Fold the agreed values through the existing owner path, not by hand-editing states. The paths are `scripts/chapter_tier_labels.mjs` and `docs/coverage/chapter_tier_labels.json` (rows such as `{rank, rankBasis: "chapter-stated", rankAt: {locator, speaker}, secondRead: "agree"}`), effect sentences through `scripts/chapter_effect_fold.mjs`, then regenerate `docs/coverage/gu_kinds.jsonl` with `scripts/gu_coverage_ledgers.mjs`. Find the actual command chain from the scripts' headers.
   - Rows blocked for a missing catalogue rank binding (`ice-blade`, `plunder`, `tyrant-strength`, `self-strength`) need the binding the PWC23 note names. Do it only if an existing owner path exists. Otherwise list them.
3. Report: per lead, the verdict and its locator; rows whose state changed (before → after); rows left blocked and why.

## B2, wiki-tier effects

The `blocked:effect-unknown` rows whose `wiki_tier_labels.json` entry has an `effectAt` (about 113) need an effect family. See the "Expressibility" section of `docs/PROCEDURAL_CORE.md` (it replaces the old GL2 target), and use the existing effect-family vocabulary in the ledger scripts. Do not invent families.

1. Map each row's wiki effect to a family, or to "no family fits" with the missing rule named, through the owner path that writes those labels.
2. Regenerate and report the state changes.
3. **Q5 input.** Count the effect-unknown residue that has at least 5 paragraph hits and no chapter or wiki effect, and list its top 20 ids. Weibao decides on paid reads from that number.

## Checks

Run `npm run -s check:coverage`, `node --test tests/gu_coverage.test.js` and any test the fold scripts name. Report each exit status. Write a short record to `lane-a/REPORT.md`.
