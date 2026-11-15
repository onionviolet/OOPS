# Preflight card

One form for every task record, lane brief and task packet (O3, 2026-11-14, [status reconciliation](../audits/RULES_STATUS_RECONCILIATION_2026-11-14.md)). Copy it into the task record before work starts and fill the receipt at the end. It replaces the brief field lists that used to sit in GROUND_RULES (PRF1–PRF8, FND1–FND5), UR76, MR40, SPR and AGENTS.md; those codes stay citable and their rules are unchanged.

Status: prompts, accepted as RSR P1 to P5 (Weibao, 2026-11-14: "go ahead for all of them"). A field you cannot fill says `n/a, because …` or `gap: …`, and that stops nothing. Only the gates named in the receipt block.

## Always

| Field | Fill in | From |
|---|---|---|
| Reading | One sentence restating the request at the level meant, and the premises (viewport, what exists, who plays) | PRF1 |
| Authority | Weibao's quote or the AD line it rests on; every constraint is a quote, an AD code or a default with a dial and a reason | PRF8, AD32, AD5 |
| Player sentence | What the player reads when it works, and when it cannot run | PRF2, UR70–UR75 |
| Ordinary route | The simple default and one exception with its in-world reason and cost | PRF3, AD38 |
| Mechanism | How it happens, who can know or do it on both sides, what follows; checked from the character's seat | PRF4, AD6 |
| Fit | The seam, register row, descriptor or prior audit it extends, by name; "none found" only after the [area guide](../AREA_GUIDE.md) lookup | PRF5, AR14 |
| Ring | Which of producer, consumer, failure, persistence and UI this slice covers; where the missing list lives | PRF6, WPR30 |
| Rule codes | Codes from the [rules index router](../RULES_INDEX.md#router-what-applies-to-my-task) that apply | AGENTS.md |
| Files | Files owned, and the prohibitions (no other files; shared-checkout rules) | Shared worktree practice |
| Failure scenario and checks | One concrete way it could break, and the existing checks that would catch it | AD36 |

## When the task touches

| If it | Add | From |
|---|---|---|
| Player-facing UI | Target viewport (desktop 1920×1080 first), the populated screen and what it displaces, deferred scope; the system card: home, shape from shared primitives, each state's text, the mechanism's form | PRF7, UR76, UR93, AD34 |
| Player text | One voice sample from the same world and surface ("player text sounds like this"); PRS4, PRS6 | PRS7 |
| Names | One sample from the world's [naming sheet](../names/WORLD_NAMING_SHEETS.md) | NMR |
| Making | Mode; property or pattern vocabulary; canon point with near miss and failure; the use; where inputs come from | MR40 |
| A repeating system (ties, fights, making, care, research) | Which ordinary-day loop calls it and which non-lead seat runs it; what reads it; anchors and whose numbers the rest are; the palette row it changes | SPR prompts |
| A generator | Address shape, reader, three tests, budget | FND1 |
| A start or a crossing between worlds | The WER answers, or the gap named | WER1–WER17 |
| A world pass or source dive | Pass name, part, mode, budget, stop, owner file | WPR1 |
| A saved key | The save slice and the migration or compatibility decision | AR6, SAVES.md |
| A structural round | The baseline number it lowers; same journey before and after | FND3, AR9 |

## Receipt

One line each: command or evidence, result, gaps.

| Line | Record | Gate |
|---|---|---|
| FLR1 Build | Bundle hash proven on | floor |
| FLR2 Route | Fresh life by earned steps, or the named fixture | floor |
| FLR3 Shown | Description, visible cost, feedback when it cannot run | floor |
| FLR4 Used | The existing consumer | floor |
| FLR5 Kept | Save, reload, Export, Import, when persistence changed | floor |
| FLR6 Labelled | Highest review state and route kind | floor |
| Change surface | Core-owner files touched, new cycle edges (zero), registration lines | FND2 |
| Checks | `test:changed` or the focused file; `check:arch`, `check:rules`; the ratchets (NMR8, CTR9; PAC5, OPN9, FBK8 when run) | AD36, RSR P2 |
| Not covered | What was not exercised, where its backlog line lives | AD43 |

A runtime slice missing a floor line is "implemented, below floor". Docs-only work skips the floor and lists its link or document checks.
