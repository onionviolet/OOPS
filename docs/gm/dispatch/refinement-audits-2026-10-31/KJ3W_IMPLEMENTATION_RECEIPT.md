# KJ3W implementation receipt: the apartment, the portrait, the company morning and noon (kjw13)

2026-11-03. Window kjw13 of the KJ3 sweep. **Agent-verified, not human-reviewed (AD43).** Content and pack data only: no `src/`, `dist/` or test edits. Not installed, no personal save touched. Proven on the B10 bundle `private/proof-bundles/b10-bundle-45c086a7/` (bundle.js sha256 `45c086a712262768fffb6da96132d1998afe5b64daa2bfbd04eabcd61d6ee979`, matches; scratch copy with its own `lotm-cast/cast.json`). Pack sha256 `4a0f1d0f…`, revision `cast-reviewed-kj3w-725cb090b6da5e0f` (carries KJ3F-KJ3W). Private files: `docs/research/novels/lord-of-mysteries/private/kj3w-ch46-2026-11-03/`. Seed: the KJ3V completed checkpoint. Predecessor: [KJ3V receipt](KJ3V_IMPLEMENTATION_RECEIPT.md).

## Scope and source

English v1 ch46 P001 - ch47 P069 (official edition). Twenty-five acts in two scenes, one per brief intent, nothing folded; no fallback cut was needed. Next boundary: ch48 P001 (the Divination Club). Final clock 13680 (12:00); money 787.

| Scene | Acts (`book.lotm.kj3w.`) |
| --- | --- |
| The apartment | `flask`, `pace`, `memory`, `familiar`, `cupboard`, `police`, `photo`, `circle`, `portrait`, `cane`, `warrant` |
| The company | `return`, `theory`, `lifepath`, `reassure`, `banter`, `orianna`, `commission`, `ordinary`, `rare`, `salary`, `materials`, `market`, `debt`, `noon` |

Minutes (fill, labelled; sum 288): 2, 2, 1, 2, 4, 5, 2, 2, 4, 5, 8, 8, 2, 1, 3, 1, 2, 1, 2, 1, 3, 2, 3, 3, 219. 120 distinct player-actor fact keys under the prefix (the brief's list plus thread and pending facts); kjw14's required names (`ray.missing`, `portrait.drawn`, `dowsing.failed`, `neil.debt.thirty`, `loan.declined`, `commission.paid.by.butler`, `club.plan`) are present and asserted. `share.collected` was **not** set (Q5).

## Constraint-store select (printed before the first act)

`clock 13392-13700: beats=84, max beat day 7, beats on day 8 or later 0, anchors on day 8 or later 0, schedule rows 77, rows until day 8 or later 0.` No unsettled beat in the window.

## Open items settled (coordinator defaults)

| # | Default | Built | Result |
| --- | --- | --- | --- |
| Q1-Q3, Q6-Q13 | brief defaults | done | no place minted; Frye, the corporal, police, neighbours, Katy and Ray Bieber are text roles with no knowledge row and no placement |
| Q4 | no metered use | no `beSeerUse()`, no `cogitate` effect | pool **1/2 asserted after every act**; the P019 glabella tap is a fact only |
| Q5 | credit the share only if shown received; else hold 787 | **held at 787** | the signing is not shown (Orianna says come and sign later, ch47 P024; ch47 P064 and P068 state the ten pounds as earned). `commission` sets `share.still.pending`; `noon` sets no `share.collected`; thread `commission.share` stays open. Money 787 asserted at every act |
| Q9 | build `noon` as one act | 219 minutes, one act | **accepted, no split** (B9 datapoint below) |
| Q18 | whole-word vault rule | no "vault" text in notes (the note says treasuries) | leak regex now `\bvault\b` plus earth, tarot, keyboard, gathering |
| Holder | report both stores, leave unmoved | unmoved | the world store reads container `household.kj3c.bed`, holder `bed`, rounds 5. The brief reports the actor ledger holder as `desk`; I did not re-find that value in the checkpoint scan, so I report it as the brief's reading. The runner asserts the world-store container unchanged and rounds 5 at every act |

**Consequence for kjw14 (Q5 flag):** the club's first-year fee (five pounds, 1,200 pence, ch48 P014) cannot be paid from 787 until the share is collected on screen. kjw14 can note the share as unpaid or pending, or collect it on screen if the text shows the signing; no money was invented here.

## Places and presence

Klein: carriage place through `warrant`; company from `return` through `debt`; carriage place at `noon`'s end. Relocations: Dunn, Neil and Leonard placed at the carriage place in `flask` with a visit to `warrant` (the preflight otherwise showed Neil and Leonard AMBIGUOUS after kjw12's visit ended); Dunn and Leonard to "Whereabouts unplaced" in `warrant`; Neil and Klein to the company and Rozanne to "Whereabouts unplaced" in `return` (Neil held by a visit to `noon`); Orianna to the company in `orianna` (visit to `ordinary`), then to the accounts office in `ordinary`. Preflight 0 blockers; the remaining AMBIGUOUS lines are the first act's Neil and Leonard before their arrival visit and Neil at `return`'s start, all accepted by the native run. Melissa and Benson untouched.

## Money (pence)

| Line | Pence | Locator | Native |
| --- | --- | --- | --- |
| Klein's share, ten percent of half of 48,000 | +2,400, pending, not credited | ch47 P024-P026, P064, P068 | none; signing not shown |
| Public carriage back; Neil's bill (7,200, loan refused); Ray's wage 420 a week; Neil's pay 2,880 a week | not moved | ch46 P038, P077; ch47 P039-P065 | none; knowledge only |

## Actor per verb (standing check)

| Row | Who performs | Owner for the BE seat |
| --- | --- | --- |
| Recall the room; tap Spirit Vision off | the lead as player | authored acts, facts; no `beSeerUse()` (B3 unbuilt) |
| Examine the corpse, estimate the death | Frye on screen | notes on a text role |
| Perform the ritual, draw the face | Neil on screen; the lead stands inside the field | facts and notes; watch-only content, no ability |
| Dowse over clothes and portrait | the lead as player | fixed-outcome failure, unmetered (B5, B4 unbuilt) |
| Order the warrant, seek help | Dunn on screen | facts |
| State and restate the share rule | Orianna, Neil | facts and notes (proposed B13) |

## Gated beats (fallbacks)

| Gate | Beat | Fallback |
| --- | --- | --- |
| B3 Spirit Vision | `memory`, `familiar` | facts, no use, no exhaustion |
| B5 / B4 divination | `cane` | requires the three dowsing keys; failure as facts; unmetered |
| NPC ritual (no row) | `circle`, `portrait` | facts and notes, no ability |
| B2 eyes seen | `cane` | `eyes.black.klein`; nobody remarks |
| B13 commission payout | `commission`, `debt`, `noon` | facts only; share pending |
| Underground market, tax bands (no row) | `salary`, `materials`, `market`, `debt` | knowledge lines |
| B9 long act | `noon` | none needed |

## What each act withholds and who reads it later

| Act | Withheld | Later reader |
| --- | --- | --- |
| `memory`, `familiar` | the source of the flash and the murmur's words; Klein told Dunn only "a little familiar" | kjw14+ |
| `police` | Klein's thought that the notebook may be with Ray | none |
| `cane` | the "interference" inference stays a thought | none |
| `reassure` | the delivery fear and the relief | kjw14+ |
| `materials` | Klein's own organization's needs (locator only) | kjw14+ |
| `commission` | whether the share is signed or collected | kjw14 |

Leak asserts at every act: Klein's notes hold no seat-side POV, old-world, Earth, Tarot, gathering, keyboard or diary text; Dunn, Neil, Rozanne, Leonard, Melissa, Benson and Orianna hold no `kj3w` knowledge.

## Verification (one line per check)

| Check | Result | Gap |
| --- | --- | --- |
| Pre-scan on the `.py` and the built JSON | 10 offenders over 200 trimmed in two passes; final clean on both | |
| Presence preflight, prefix `kj3w.` | 0 blockers; see Places | static check |
| Native route, headless Chrome, B10 bundle, one run | Passed: 25 intents, money 787 unchanged, 0 page errors, 597.1 s, 3 boots and 1 import; every per-act assert (money, clock, location, pool, seats, session closed, rounds, holder, inventories, leak) | no RESUME needed; no 14/21 px captures |
| Persisted | literal Export/Import then reload: closed session and seats, carriage place, money 787, pool 1/2, clock 13680, kjw13 facts and the kjw9-kjw12 facts | |
| Rules check | `npm run check:rules` before commit | |

Not run: full `npm test`, a build, 14/21 px captures, human play-through, civil clock.

## B9 datapoint

`noon` (219 minutes, clock 13461 to 13680, inside engine day 9) was accepted as one act with no refusal and no page error. Row text: "B9: kjw13 ran a 219-minute act inside day 9 with no refusal (0 beats on day 8 or later)."

## Proposed backlog row texts (not filed)

- M1 B5/B4: ch46 P065-P073, a failed lead divination (cane over a man's clothes and a portrait, eyes brown to black, cane spins); fixed-outcome, unmetered.
- M2 B2: shown-but-unremarked consumer at ch46 P066-P067; Neil's ritual is watch-only like ch31 P047 (B7), R5/U3 not moved.
- M3 B13: third consumer ch47 P024-P026, P064, P068; the signing is not shown, so no credit was made.
- M4 B11: Frye speaks in ch46 (flask, death estimate); route B kept; route A before any window where he acts or is placed.
- M5 materials access, M6 wage and tax table: knowledge lines only.
- M7 B9: see above.

## Timing and corrections

- Authoring about 60 minutes; proof one run of 597.1 s.
- Corrections (2): ten over-length strings; one typo ("ringes") caught before the build.

## Next

kjw14 from ch48 P001: Klein out on the streets about noon Saturday (clock 13680) with money 787 (a ceiling), the commission share of 2,400 pence pending and unsigned, pool 1/2, session closed, Klein at the carriage place, Neil at the company, Orianna at the accounts office, Dunn, Leonard and Rozanne unplaced. The club fee (1,200 pence) exceeds 787, so kjw14 must show the signing or leave the membership unpaid. Needs its own brief.


## Content reconciliation B509: actual consumers and remaining factual gaps

Twenty-five acts retain the two-scene apartment/company window and288 labelled fill minutes. The ten-pound2400pence commission share is earned/pending in prose, not received: no signing, no share.collected, no native credit, money787. Neil's debt, wages, market/material access and tax bands are knowledge lines, not economy consumers. The following membership1200pence cannot be funded by787 without a real source transfer or an explicit narration fallback. Watch-only ritual/portrait and fixed-outcome failed dowsing do not supply ability execution or measured costs; no Seer use/recovery occurs and pool1/2 stays stable. Frye/police/neighbours remain text roles. Holder evidence has two stores: the world container/holder and rounds5 were checked; desk in the actor ledger is reported only from the brief and was not independently re-found here. Preserve this uncertainty rather than reconciling stores by assertion. A219-minute noon act inside day9 passed with zero selected beats/anchors on day8+, which does not repair all reserved-beat long-act cases. The597.1-second native/persistence run is frozen B10 evidence without new build/full suite/font/civil-clock checks. M1–M7 are proposed backlog texts, explicitly not filed.
