# Continuity rules (CTR)

Proposed 2026-11-06 (AD32); run authorized by Weibao, lines not yet accepted
([direction](USER_VISION.md#five-quality-deep-dives-on-the-prose-model-2026-11-06)).
How one fact stays the same wherever content states it, and the check that keeps it so.
Each line is a default, a dial and a reason, never never/always/only (AD5, AD38).

Existing owners, not restated here: one home per fact on screen
([DESIGN](../DESIGN.md) DSG11), dated whereabouts and claim speakers
([WORLD_ABSORPTION_RULES](WORLD_ABSORPTION_RULES.md) WA23, WA35, WA50, WA52), prices and merchants
([DOMAIN_RULES](DOMAIN_RULES.md) ECR3, ECR6, ECR9), contradictions keep both readings
([WORLD_PASS_RULES](WORLD_PASS_RULES.md) WPR20), sealed secrets
([AGENTS.md](../AGENTS.md#sealed-secrets)). Runtime anchor-versus-schedule linting already lives in
`lintAnchors` (`src/cast_schedule.js`) and `validateMolCast`; CTR8 covers the rows those do not.

## Rules

| Code | Rule | Default, dial, reason |
| --- | --- | --- |
| CTR1 | **One id, one name per surface.** | Default: an id's `name` agrees across files (case, punctuation, articles, short forms and aliases fold first). `label` is compared with `label` only, since a label may be what the player knows (PRS1). Dial: `nameOverlap` (0.5 word overlap). Reason: an entity renamed in one file reads as two people. |
| CTR2 | **One name, one id per world.** | Default: a multi-word name defined under two ids in a world is flagged unless a record links them (`indexId`, an `idMap` entry). Dial: `duplicateNameMinWords` (2); a world may keep two same-named things with an in-world reason in the row. Reason: a re-keyed id with no link splits one person's history in two. |
| CTR3 | **One pair of places, one travel time per means.** | Default: both directions and every file give the same minutes for the same means and season. Dial: `travelTolerance` (5 min or 20%); asymmetry by route is allowed when a row says so. Reason: the same walk should not take 25 minutes in one view and an hour in another. |
| CTR4 | **One item, one price per merchant and era.** | Default: a defined price agrees across files unless a merchant, season, era or currency field differs. Dial: `priceTolerance` (1 unit or 10%), `contextKeys`. Reason: ECR6 gives each merchant its own spread; this catches the unexplained gap, not the markup. |
| CTR5 | **A label shows the charge.** | Default: "· N coins" in a label equals what the row charges, converted through the world's denominations (LOTM pence). Income labels ("receive", "earn") are not charges. Dial: `lotmPence`. Reason: a player pays what the button says. |
| CTR6 | **A person's age, role and dates hold in one context.** | Default: `age`, `role`, `rank`, `date` agree for the same id unless `year`, `era`, `scene`, `wave` or similar differs (a character ages). Dial: `contextKeys`, `notFacts` (`tier`, scene counts and notes vary by wave on purpose). Reason: WA23 and WA50 make facts time-indexed; the context is how the check knows which time. |
| CTR7 | **A calendar day follows its date.** | Default: rows with `date: 'D Month'` and an integer `day` fit one day-0 offset. Dial: rows may carry their own offset by sitting in another file. Reason: a school year that drifts a week is invisible until a deadline. |
| CTR8 | **A person is in one place at a time.** | Default: stated (S) or timed (T) cast rows for one actor, with overlapping days and hours, name one place after `placeAliases` resolve. Unplaced (U), fill and claimed rows never conflict. Dial: `assertedLabels`. Reason: WA23 keeps rumours as claims; only two assertions can contradict. |
| CTR9 | **The check runs in `check:rules` with a ratchet and a dial table.** | Default: `scripts/check_continuity.mjs` (under 1 s) fails on a finding not in `scripts/continuity_baseline.json`; `--update-baseline` after a fix pass, `--backlog` regenerates [the backlog](continuity/CONTINUITY_BACKLOG.md). Private packs are read when present and skipped when absent; their findings show a ref and files only, `--show <ref>` prints them locally. Dial: `// continuity: allow <why>` on a src line. Reason: the prose pass showed rules without a check recur. |

## Not covered yet

Who knows what and when (needs the sealed `knows` data, so it is skipped by design), prose
ages and dates in descriptions (six hits in src, too few to be worth the precision risk), and
cross-world same-name checks (a name in two worlds is two things).
