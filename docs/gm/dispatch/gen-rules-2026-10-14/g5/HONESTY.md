# GCR2-GCR4: what a generation lens may promise

2026-10-14. INFERRED builder contract. No tests implemented or run here.
Reads [HOOKS](HOOKS.md) and the root's GCR/CLR/SB rules. Truth, observation
and display remain separate. A grade can withhold precision; it cannot
invent precision. A future grade does not bypass sealed routes.

## T1. True odds come from the actual resolver

GC1 describes the probability of a defined event at a defined decision,
conditional on a recorded context. It does not describe the observed
frequency in a small sample or promise that an attempt will succeed. A
seeded draw is fixed when its full key is fixed, but an odds lens describes
the selection distribution across possible draw values. Showing that fixed
outcome requires a separate future grade and conditional forecast label.

The resolution snapshot must include every eligible option, quiet/null
outcome, final integer weights, strata, bag contents, pity/guarantees,
fate pull, NPC/player overlays, pins, retry constraints and fallback policy.
GC5 reads the SAME counters and eligibility clock. A disabled encounter or
ineligible window cannot advance its pity meter. A rarity clock is not a
guarantee unless the world's process actually implements one.

SHOWN: live storylets add `config.quiet` to the total at
`src/storylet_deck.js:62` and update misses at `:69`. Ignoring quiet exaggerates
every card's odds. Their recent top-three receipt at `:65` is not a full
candidate distribution. SHOWN: draft G1 weighted receipt has selected weight,
total and top five at `.claude/worktrees/gen-g1-kit/src/gen_kit.js:96`. Its
`top` alone cannot reconstruct filtered, stratified or compound outcomes.

Proposed resolver certificate: `{kind, tableRev, contextToken, total,
eventMass, massDenominator, guarantee, modifiersVersion, computedAt}`.
Keep enough private resolution inputs to reproduce it or a frozen exact
mass certificate for past decisions. The lens projects that certificate,
not its own second implementation of weights. Future odds can be recomputed
from the current immutable snapshot; historical odds use the recorded one.
For three reasons shown, label "main factors", never "all causes".
G1's numeric-only `weightFn` placeholder is not a causal explanation. If the
caller supplied no real reason, GC3 shows "Cause not recorded" rather than
turning the placeholder or the highest weight into invented world lore.

| Resolver shape | Honest event mass |
|---|---|
| Simple weighted pick | Weight/total is the nominal share. G1 multiply-high uint32 mapping has a small quantization difference; see below. |
| Stratified pick | Sum over eligible categories of category probability times conditional item probability. Empty strata follow G1's eligibility rule. |
| Bag | Probability over currently remaining entries under its declared shuffle/selection rule; a known future bag result is foresight, not a fresh independent roll. |
| Scheduled pity | At the guarantee boundary, guaranteed event mass is 1; below it use the actual policy. A pin or fate-lock that defeats the guarantee must be included. |
| Exact pin | Selected option mass 1 after collision and eligibility validation. Category pin yields conditional distribution inside that category. |
| Retry/constraint/fallback | Compute final output mass through the bounded resolution tree, including fallback. Do not display the first candidate's odds as final success odds. |
| Sample-and-score/branch | The winning output has a different distribution from one candidate. If exact enumeration is unsupported, show a labeled estimate/range or "not available"; never silently substitute a base weight. |

SHOWN: draft G1 `indexFromU32` maps `floor(draw * total / 2^32)` at
`.claude/worktrees/gen-g1-kit/src/gen_kit.js:75`. For an option spanning integer
bucket interval `[a,b)`, exact count is
`ceil(b * 2^32 / total) - ceil(a * 2^32 / total)`, using BigInt; probability
is count/`2^32`. This accounts for the at-most-one-draw bucket discrepancy.
GCR2 "exact" uses that mass, or labels weight/total "nominal share". The
normal rounded UI often looks identical. This is a discrete-draw contract,
not a proof the hash is statistically perfect. A5 owns hash/distribution QA.

Example fixture: weights 9 and 1, quiet weight 10 means the second option
has nominal 1/20, not 1/10. Bias it to 2 and total becomes 21. Guaranteed
pity or an exact pin can then make the final chance 1. GC3's why line must
explain the lawful transition it can disclose. No claim this fixture is a
current world table.

## T2. Conditional foresight and SB24

A saved observation carries decision ID, resolution token, table revision,
attempt, source/grade, world/life/continuity, game time and assumptions.
User-facing language: "If you take this action now, with these conditions."
Exact next outcome, approximate odds and an estimated multi-step branch
have distinct labels. A deterministic simulator may exactly replay its own
assumptions while being a poor model of future NPC choices.

Invalidation inputs include inventory/resource gates, equipment, facts,
location, clock eligibility/expiry, tags, overlays, pin conflict, pity/bag,
attempts, world law, continuity, table/algorithm revision and permission.
Change events mark affected observations stale. Submit rechecks the token
even if no notification was delivered. Old and new observations remain
distinct; the UI says "Vision shifted" and gives a safe reason. Expired
access shows a remembered reading stamped "as of", not a current lens.

Peeking A through J forward, backward, twice or after cancel gives the same
values and state. Unchanged later commits use those values. A branch with
different actions or a fork salt is a different conditional future. Changes
outside the declared dependency set must not invalidate unrelated domains.
Constraint retries are deterministic parts of one forecast; a paid reroll
is a changed input and marks that forecast stale.

## T3. Display rounding and deliberate unreliable sources

SB25: never turn a positive chance into `0%`. Default proposed display:

| Exact probability p | Display |
|---|---|
| p = 0, known to be impossible | `0%` or `Impossible under these conditions` |
| 0 < p < 0.01 | `<1%`; exact-grade detail can show a fraction or more decimals |
| 0.01 <= p <= 0.99 | Nearest whole percent with `about` when rounded; half-up on rational integers |
| 0.99 < p < 1 | `>99%`, never `100%` |
| p = 1, all downstream conditions modeled | `100% under these conditions` |
| Insufficient grade, unknown/blocked | A supported band or `Odds unavailable`, never `0%` |

Show 1-in-500 as `<1%` with detail `about 1 in 500` unless the exact resolver
certificate supports precisely that fraction. Do not renormalize only
visible options to 100%. If safe, show "Other outcomes" aggregate using the
full denominator. If even that aggregate leaks a secret, hide the whole
distribution or show an authorized coarse event such as "no known reward".
Unknown option count is also potentially a leak. Rounded shares need not
sum to 100%; disclose rounding rather than changing weights to make them fit.

E1 blind permits noise and lies; CHEAT_LIBRARY CT11/SW4 permits known wrong
readouts. Proposed data separates `truthPolicy: honest` from
`truthPolicy: unreliable-source` with a declared distortion rule. A normal
accurate GC1 result can be refused by a blind contest. A decoy is labeled a
source reading with uncertain reliability, not certified resolver odds.
The contest winner or lie's cause need not be revealed prematurely. Explicit
unreliable fiction can fool the character while the player-facing source
classification says it may mislead. Never manufacture lies by rounding,
stale snapshots or a failed hook.

## T4. Sealed-truth guards

Apply discovery authorization BEFORE constructing the projected table,
reason text, chart or branch recap. GCR4 and CLR3 apply to values, candidate
IDs, names, tags, weights, excluded-option reasons, counts, source IDs,
fallback names, pin choices, root/continuity links and comparisons.
Low-grade presence is allowed only if its route permits presence.

No secret files were opened in this lane. Builder fixtures use synthetic
secret IDs and forbidden canary strings. An authorized discovery grants
only that subject/route's knowledge, not all results in the same table.
NPC perception uses the same projector with its own permissions. Player
knowledge, character knowledge and world truth are distinct sets (OV3).

Seed reader returns a domain-scoped reading/chart token. A displayable world
code excludes raw secret-bearing roots by default; merely hashing a root
does not make a foresight API safe. Root plus readable code can reconstruct
truth (SB15), so this is a presentation guard, not DRM. Raw private save
payloads remain restorable world truth; no promise that a player inspecting
their own local file cannot learn it. Shareable summaries, export filenames,
DOM, aria, tooltips, logs and library indexes use the same redacted projection.
Do not remove authoritative truth from saves to make them share-safe.

## T5. Builder test inventory

These are proposed cases, not passing results. Keep targeted checks with
the owning resolver/projector, A5 determinism and P18 harness. UI gates use
rebuilt bytes and a fresh origin; synthetic source fixtures do not prove
natural acquisition or director acceptance.

| ID | Fixture/action | Required assertion |
|---|---|---|
| HT01 | Weight 1/499, then quiet=500 | Full denominator includes quiet; positive chance remains positive in display. |
| HT02 | Bias, pin and pity guarantee in one snapshot | GC1/GC5 certificate and commit resolver agree including final override; deterministic golden keys and boundary draws. |
| HT03 | G1 uint32 bucket boundary and very large totals | Exact BigInt count matches bucket ranges, zero-weight option never chosen, overflow rejected. |
| HT04 | Stratified empty/nonempty categories | Joint event mass matches eligible strata; adding an item does not change category share. |
| HT05 | Constraint retries/fallback and scored samples | Correct final mass when supported; explicit unavailable/estimate when unsupported. No false exact grade. |
| HT06 | Peek ten, reverse order, cancel, reopen, commit | Byte-equivalent live state before commit; unchanged results match committed draws. |
| HT07 | Change each dependency; change an unrelated domain | Relevant forecast stale before spend; unaffected domain stays current. Clock expiry equality covered. |
| HT08 | Paid reroll, duplicate intent, failed storage | One local attempt bump/charge on success; zero durable change or reveal on failure; original retained. |
| HT09 | Pin target removed/reordered between table revisions | Stable IDs survive reorder; orphan policy gives safe visible note, no silent substitution/use consumption. Frozen past stays exact. |
| HT10 | 0, tiny positive, 1%, 99%, tiny failure, 1, unknown | Endpoint-only 0/100, rational rounding, `<1%`/`>99%`, unknown distinct. |
| HT11 | Partial secret table, hidden contributor, secret branch | No canary/name/ID/count in any projected surface before route; authorized subject reveals only permitted part. |
| HT12 | Blind tiers and unreliable decoy source | Same contest for NPC/player; refused/uncertain distinct from exact; viewer gets no private access log. |
| HT13 | Equal NPC/player source and shuffled request order | Same costs, scope, precedence and stable ties; blind attribution never leaks hidden rival card. |
| HT14 | Save/reload/export/literal import while biased/pinned/pending | Same attempts, remaining duration, costs, original receipts, next output and observations; no mixed historical envelopes. |
| HT15 | Old save missing fields; unknown schema or malformed hook | Missing means empty; invalid import leaves current save untouched; legacy draws unchanged until named port. |
| HT16 | No cheat/dormant/active/lost lens, keyboard and re-render | No premature names, acquisition/growth not triggered by hover; rerender cannot draw/spend; readable 1366x768 and 1600x1000 view. |
| HT17 | Compare hidden distributions with identical lawful knowledge | Public output stays identical unless the authorized observable event probability itself differs; no per-option differencing leak. |
| HT18 | Missing prerequisite for counterpart/retcon world action | Unsupported before any cost; no trait transfer or frozen mutation via plain draw hooks. |
