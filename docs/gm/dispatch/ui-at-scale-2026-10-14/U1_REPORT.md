# U1 report: game references for UI at scale

Completed 2026-10-14. Design/research only; adoption and gameplay acceptance open.

## Written

| Code | Owned output | Contents |
| --- | --- | --- |
| O1 | [GAME_REFERENCES.md](GAME_REFERENCES.md) | Checkpoint, evidence policy, 25 references in groups of 8/6/6/5, individual support/contradiction mappings, qualitative tab-growth analysis, ranked ten adaptations, nine failure/tradeoff rows, GR1-GR12 proposals. |
| O2 | This report | Scope, sources, validation and remaining evidence gaps. |

## Findings for the root owner

| Code | Finding | Root reconciliation |
| --- | --- | --- |
| F1 | Progressive disclosure reduces initial burden but does not solve late-run navigation. | SC3 needs the existing Panel kit distinction between discovery and eligibility applied to all navigation. GR1 proposes a stable known index, with active-only as a player dial. |
| F2 | Many-entity overview and ranked attention answer different questions. | Keep SC5's priority model; pair it with NV5/ZN3 grouped watches. Healthy assets and flavor text need not disappear. |
| F3 | Automation, filters, queues and command entry require different controls. | IN7 remains useful; GR3 proposes named forms, exact-target/cost preview, rule-priority explanation and an override. Last Epoch's filter bypass and KoL's query mode are strong concrete references. |
| F4 | Desktop readability needs independent controls and specialist surfaces. | Keep independent useful panels and text regions at 1366x768/1920x1080. One contextual slot and fixed zoning are defaults, with PL4 alternatives reachable. Sunless Sea documents why text size alone cannot be frame size. |
| F5 | Root numerical thresholds are design estimates, not demonstrated game limits. | No evidence supports a universal 20-system, 30-card or tab-count ceiling. Future comparison should measure common-action reachability and missed decisions instead. |

## Source record

The main file contains a URL and label for every title and each documented
failure. Primary material includes game-maintained repositories for Antimatter
Dimensions, Evolve, Kittens Game, Trimps and A Dark Room; developer pages for
Factorio, RimWorld, Disco Elysium, BG3 and Failbetter; FFXIV's manual, Last Epoch
support, PoE's filter rationale and syntax, KoL's command docs, Mudlet's manuals,
and Increlution's developer store description. CK3 and Stellaris developer
diaries were read through syndicated Reddit posts after the Paradox route was
blocked. Developer descriptions are documented behavior, not this lane's playtest.

L1 fetch limits: Melvor wiki and Blizzard Edit Mode returned 403; ONI overlay
wiki and Mudlet's UI-functions page failed extraction. Kittens and Evolve wiki
shells were empty. Switched to public source, author pages, developer store
description or syndicated diary where useful. Search-only Melvor/Blizzard/ONI
claims are explicitly STATED with limited evidence. No password or browser
session was used. Cookie Clicker's main script also returned 403; that title
was not retained, and no claim depends on it.

L2 unchecked recall: Candy Box unlock timing, RimWorld work-priority grid and
KoL desktop pane placement are labeled MEMORY. No recommendation depends on
these as verified behavior. Current WoW addon capability was deliberately not
inferred from its historical UI reference. The selected RPGs' item-compare UI,
CK3 outliner specifics and exact late-run tab counts remain unverified.

## Checks and boundaries

V1 read COMMON.md first; read live AGENTS.md, PROJECT.md, user preferences,
USER_VISION desktop direction, root palette and Panel kit. Used reference-scout
for the comparison. Prior memory was routing only; live files supplied authority.

V2 checked reference group counts, evidence markers/URLs, root-code existence,
rank count, GR uniqueness, relative local links and prohibited punctuation.
These are document checks, not usability tests or runtime evidence.
Direct trailing-whitespace checks pass for both owned files. A repository-wide
`git diff --check` returned an unrelated pre-existing bundle whitespace finding;
U1 did not repair it and does not claim a clean repository-wide diff.

V3 wrote only the two assigned new files. Existing dirty/staged work remains
outside U1 ownership. No game source, bundle, save, pack, build, browser, test
suite, commit or push was used or changed. Public network reads are research.
No files named SECRETS were opened.

## Open questions and next evidence

| Code | Open evidence | Default pending evidence |
| --- | --- | --- |
| Q1 | How much navigation burden occurs in YAIRPG's actual early/mid/late known states? | Later authorized task comparison at both desktop sizes, including larger text; record root tabs, subtabs, surfaces and hops separately. No browser gate was authorized or run in U1. |
| Q2 | Which GR additions are worth incorporating into the root? | Root owner reconciles GR1 with Panel kit first, then GR4/GR7/GR3. These are recommendations, not accepted decisions or a build request. |
| Q3 | Which specific tree/item-compare and prestige-screen interaction is best? | GR2/GR9/GR12 remain proposals. A later focused inspection should compare reset losses, item units/conditions and return-to-current behavior before selecting a UI. No new prestige scope follows from this report. |
| Q4 | Are historical patterns unchanged in current releases? | Refresh only a version-sensitive claim selected for adoption. This survey does not claim current runtime parity for historical diaries or failed-fetch excerpts. |

Playable acceptance: none claimed. This lane completes the requested research
packet. Any selected implementation still needs its own authorized slice,
rebuilt desktop evidence and affected persistence/discovery checks under live
project owners. Mobile remains deferred.
