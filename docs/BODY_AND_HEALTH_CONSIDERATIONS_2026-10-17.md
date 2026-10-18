# Body, health, injury and medicine: considerations, 2026-10-17

Claude, 2026-10-17. A palette, not a spec. Nothing here is selected for a build.

Weibao (2026-10-17), after a survey of systems that crafting leans on but that
lack a rulebook: "Yes, run a topic-expansion-audit round on body, health, injury
and medicine (G1), saving the palette and a proposed rulebook."

Rules applied: AD13 (bodies are real), AD19 (forgiving recovery), AD6 and AD8
(means; own stats exact), AD11 (what carries), MR1–MR36 (medicine is a kind of
making), SR22 (persistent aftermath), AR1–AR16 for any seam. Rows marked MEMORY
are recalled franchise facts awaiting a source check. Public franchise facts are
not sealed. The proposed rulebook distilled from this palette is
[BODY_AND_HEALTH_RULES](BODY_AND_HEALTH_RULES.md) (BHR1–BHR30).

## What already exists (read, not restated)

| Owner | Covers |
|---|---|
| [Part 35: health, injury, illness, medicine and death by world](worlds/world-depth-2026-10-13/35_HEALTH_INJURY_ILLNESS_DEATH.md) | The main palette: code today (H35C1–C13), model (H35M1–M15), medicine and healers (H35T1–T10), death (H35D1–D10), worlds (H35W1–W16), idle (H35I1–I6), UI (H35U1–U6), prerequisites and five cheapest slices (H35P, H35S) |
| [Hunger and bodily needs](HUNGER_AND_BODILY_NEEDS_CONSIDERATIONS_2026-10-13.md) | Accepted: food is a boost, no hunger death, comfortable unfed play |
| [Genetics and hero start plan](GENETICS_AND_HERO_START_PLAN_2026-10-17.md) | Where each fact lives (GHS44: body, mind, soul, line, record), power instances with custody (GHS86), aptitude quantities (GHS94) |
| [Genetics, constitutions and brood play](GENETICS_CONSTITUTIONS_AND_BROOD_PLAY.md) | Constitutions (G22), heritable illness (G31/HI), channel and body repair (WR1–WR6) |
| Nonhuman body docs in [worlds/](worlds/) | Body authoring, transformation and body change, clocks and lifespans |
| [Tools and instruments](TOOLS_AND_INSTRUMENTS_CONSIDERATIONS_2026-10-17.md) | Tools enable verbs (TQ2), fit to the hand (TQ5), wear from work (IP2), repair kinds (IP3) |
| [Making rules](MAKING_RULES.md) | Truth versus knowledge (MR1), conservation (MR5), free experimentation (MR6), mastery improves control (MR21) |
| [Direction synthesis OD12](DIRECTION_SYNTHESIS.md#od12-forgiving-recovery-direction-2026-10-15) | Forgiving recovery, defeat as unconsciousness |
| Lanes this run (returned, folded below) | [B1 owner map and engine fit](gm/dispatch/body-health-2026-10-17/B1_OWNERS_AND_ENGINE.md), [B2 references and worlds](gm/dispatch/body-health-2026-10-17/B2_REFERENCES_AND_WORLDS.md) |

**The gap.** Part 35 is thorough on what health can contain. It has no shared
rules, so it reads as 87 separate options. Three things are missing across all
owners: how the body relates to the verb system that tools and skills already
use, how medicine fits the making rules, and what happens to bodies, illness and
remedies when the player crosses worlds. Round 1 covers those angles.

## Round 1, 2026-10-17

### BHC-A. The body is the first instrument

| Code | Consideration | Default, dial and reason |
|---|---|---|
| BHC1 | **A verb needs three things: a body function, an instrument and know-how.** Tools already enable verbs (TQ2). A hand that cannot grip blocks the same verb a missing hammer does | Default: one verb-requirement reader lists body functions next to tool and skill requirements, with the same "missing piece" wording as partial kits (TQ6). Dial: worlds where a power stands in for a function (telekinesis for grip). Reason: one place answers "why can't I do this now" |
| BHC2 | **Injury degrades control before it removes the verb.** A sprained wrist still swings a hammer, badly | Default: injury lowers the same control numbers a worse tool lowers (speed, precision, waste) and removes a verb only past a severity named in the condition. Reason: keeps idle routines running instead of stopping on every scratch |
| BHC3 | **Bodies wear from work like tools do.** Calluses, strain, a bad back after years of smithing | Default: reuse the IP2 wear-from-work shape for bodies, per verb, with rest as the cheap repair (already true for hands, H35C7). Dial: a world or species that never tires; a cheat that erases strain. Reason: one wear model for hands and hammers |
| BHC4 | **Conditioning is fit, for the body.** A blacksmith's arm fits the hammer the way the hammer fits the hand (TQ5) | Default: meaningful repeated work raises a per-verb body conditioning that decays slowly when unused. It is a body fact (GHS44), so it stays with the body on a new life. Reason: separates "knows how" (mind, carries) from "body is used to it" (body, stays) |
| BHC5 | **Muscle memory meets a new body.** Rebirth carries the skill but not the calibrated body | Default: a carried skill in a new body starts at full knowledge with reduced control that recovers fast through practice. Dial: worlds or cheats where calibration carries; nonhuman bodies with a larger mismatch (no hands). Reason: AD11 says memories carry; this makes the new body felt without wiping progress |
| BHC6 | **Routines reroute around injury.** An injured miner sorts ore instead of swinging | Default: when a condition blocks a routine's verb, the routine offers or (if the player set it) switches to a fitting verb still available, and stops only when nothing fitting remains (AD16 stop rule). Reason: idle play survives injury without silent loss |

### BHC-B. Medicine is making applied to a body

| Code | Consideration | Default, dial and reason |
|---|---|---|
| BHC7 | **A remedy's true effect acts whether the healer understands it or not** (MR1). A folk poultice that happens to be antiseptic works; a respected cure that does nothing does nothing | Default: remedies carry true properties; the healer's belief changes forecasts and names. Dial: placebo is a world law with a stated size (comfort and pain relief, never tissue repair, unless the world says belief heals). Reason: keeps medicine honest under MR1 and lets folk knowledge be right or wrong |
| BHC8 | **Treatment can be experimented with** (MR6). Trying an untested herb on a fever resolves to an outcome | Default: free experimentation on your own body; on someone else's body only with their consent (BHC12). Failed treatments teach (AD9) and can cause harm the forecast showed as possible. Reason: discovery play for medicine, without the game hiding harm |
| BHC9 | **Surgery is making on a living substrate.** The OV model (parts on a substrate, joined by rules) fits implants, prosthetics, grafts, tattoos and body runes | Default: the body is the substrate, the procedure is a recipe, and the result is a body condition with a maker and provenance (TQ10). Dial: per world, from crude bone setting to gene editing to cultivation body tempering. Reason: reuses the making envelope (MR29) instead of a separate surgery engine |
| BHC10 | **Healing conserves something** (MR5). Regrowth uses mass, energy, lifespan, a sacrifice or the healer's power | Default: each healing means declares its cost and where the harm goes: consumed, transferred, displaced, delayed or stored. Dial: worlds where healing magic is cheap (still declared, just small). Reason: blocks free regrowth loops and gives transfer healing and curse displacement a home |
| BHC11 | **Remedies interact.** Two potions at once, a drug and alcohol, a pill on an unready meridian | Default: one condition authority resolves combined effects by declared interaction tags (stacks, cancels, amplifies, toxic together), not by ad hoc checks in each item. Dial: worlds with potion toxicity as a core law (accumulated toxicity, digestion). Reason: AR "one authority per fact" for the most stacking-prone system |
| BHC12 | **Consent is part of the recipe.** Treating another person requires their agreement or a declared emergency rule | Default: a care command names patient, consent state and authority (H35T10). Unconscious patients follow the world's custom (emergency care allowed by default). Reason: H35M11 says affection does not give control of a body; this makes it a rule |

### BHC-C. Knowing your own body

| Code | Consideration | Default, dial and reason |
|---|---|---|
| BHC13 | **Own stats are exact; hidden conditions are not stats yet.** AD8 says own numbers are exact. H35U1 says symptoms come before diagnosis. Both hold | Reconciliation: shown numbers (HP, known condition magnitudes) are exact. A condition the body has not yet expressed, or one only a fitting means can detect (a dormant curse, an early tumour, a bloodline flaw), is world truth, not an own stat, until a sign or means reveals it. Reason: removes an apparent contradiction between two owners |
| BHC14 | **Medical knowledge is an information artifact.** A herbal, a temple's teaching and a doctor's opinion are claims with sources, like maps (SR rules) | Default: a diagnosis or treatment note carries source, confidence and scope; a wrong text stays wrong until tested. Reason: lets medicine reuse claim versus truth from the site rules |
| BHC15 | **Self-diagnosis has a skill.** Some characters notice a fever coming; others ignore a broken rib | Default: body awareness is a small mind-scope skill (carries) that sharpens symptom reports. Dial: senses and cheats that give exact readouts. Reason: makes symptom detail a reward, not a fixed UI choice |
| BHC16 | **Cheats that show the body.** A status window, a diagnosis eye, a healing-touch sense | Default: each reveal cheat states which layer it reads (flesh, channels, soul) and at what precision, per AD26 and the cheat library. Reason: a flesh scanner does not see a soul wound unless the cheat says so |

### BHC-D. Bodies across worlds

| Code | Consideration | Default, dial and reason |
|---|---|---|
| BHC17 | **Does a healing potion work in a world without magic?** | Default: an item that carries its own power (container role, GHS86) works by its own law unless the destination world suppresses that power type; the world card names suppression. Plain chemistry follows the destination's physics. Dial: weakened, delayed or full effect per world pair. Reason: cross-world medicine is an intended arbitrage (AD27) with a stated in-world limit |
| BHC18 | **Diseases cross worlds and meet naive bodies.** A modern cold in a world that never had it; a fantasy plague in a modern city | Default: off. A pathogen crosses only when a carrier body crosses and the world pair allows it. Immunity is a body fact. Dial: a harsher world-travel setting, or a story that wants it. Reason: one of the strongest real-world consequences of contact, held behind a setting because it can harm many people the player never chose to affect |
| BHC19 | **The body you arrive in sets what can hurt you.** A spirit body ignores poison; a construct rusts | Default: each body kind declares its harm channels and its repair kind: organic heals, construct is repaired, spirit reforms, plant regrows. One integrity contract, separate repair logic (MR29 pattern). Reason: nonhuman starts need this without a separate health engine per species |
| BHC20 | **Which injuries follow you to the next life.** | Default (GHS44): flesh injuries stay with the old body; soul and mind injuries carry with their carrier; a cursed mark carries if the curse targets the soul. Dial: world law and cheats. Reason: H35M12 named the layers; this ties them to the scope table so carryover is mechanical, not case by case |

### BHC-E. Harm, defeat and settings

| Code | Consideration | Default, dial and reason |
|---|---|---|
| BHC21 | **Defeat leaves only what the setting says.** Battle Brothers style permanent injuries are a strong idea and a harsh one | Default: ordinary defeat leaves temporary Recovering and no lasting injury (AD19). Dial: an explained difficulty option adds a named lasting injury chance with a care route, affecting future play only (AD21). Reason: keeps forgiving recovery as the floor while offering the texture |
| BHC22 | **Harm comes from actual causes** (AD25 for bodies). A cut comes from a blade, a fever from an exposure | Default: every condition records its cause event; no random "you got sick" without a source. Dial: low-key ambient illness in a world with a named reason (bad water season). Reason: makes prevention a real choice and supports a fair first bite (H35D2) |
| BHC23 | **Severity is an adjective set per world.** A wound that is trivial in a cultivation world is crippling in a low-magic one | Default: the condition definition is shared; its recovery time and impairment scale by the world's healing level and the body's pace. Reason: limits are adjectives, not fixed numbers |
| BHC24 | **Scars as identity.** A scar lets people recognize you; removing it helps a disguise | Default: lasting visible marks are identity cues that recognition and disguise read (identity laws owner). Reason: gives cosmetic marks a mechanical use without making them penalties |

### BHC-F. Overarching abstraction

| Code | Consideration | Default, dial and reason |
|---|---|---|
| BHC25 | **A condition is a fact on a carrier.** Body injuries, tool damage, a cursed item, a damaged site and a soul wound all have the same shape: carrier, kind, cause, severity, effects on verbs, recovery or repair route, provenance | Default: one condition contract with a carrier reference (body, item, soul, place), built on the existing simulation condition store (H35C10) once it keys by carrier rather than actor (BHX3), with each domain keeping its own repair logic. Reason: AR one authority per fact; tools, sites and bodies stop growing three condition systems |
| BHC26 | **Health is a means.** A strong body is access, like a key or a contact (MEANS) | Default: body functions appear in the means vocabulary so routes can require "can climb", "can hold breath" without health-specific checks. Reason: lets sites, trials and jobs read the body through the existing gate |

### ACT NOW (done this round)

| Code | Action | Done check |
|---|---|---|
| BHA1 | Saved this palette with owners linked, not restated | This file |
| BHA2 | Drafted the proposed rulebook BHR1–BHR30 from AD lines, part 35 and this round | [BODY_AND_HEALTH_RULES](BODY_AND_HEALTH_RULES.md) |
| BHA3 | Reconciled AD8 (own stats exact) with H35U1 (symptoms before diagnosis) | BHC13, BHR6 |
| BHA4 | Registered the rulebook as a proposal in the rules index | RULES_INDEX register and router rows |

### ACCOUNT FOR NOW (constraints on any slice, no new features)

| Code | Constraint |
|---|---|
| BHN1 | Any new body or health fact names its GHS44 scope (body, mind, soul, line, record) before it gets a save field |
| BHN2 | No second condition store. New conditions extend the simulation condition owner (H35C10, BHC25) |
| BHN3 | The tools domain's verb requirements (IP1) are the place a body-function requirement joins later (BHC1); keep its shape open to a body input |
| BHN4 | Healing items state which layer they act on and what they cost (BHC10), even when the cost is "nothing beyond the item" |

### LATER / DELEGATE

| Code | Item | Level, effort | Done check |
|---|---|---|---|
| BHL1 | Verb-requirement reader that lists body, tool and skill pieces together (BHC1) | Strong, M | One routine shows a blocked verb with the missing body function named, rebuilt at 1920×1080 and 1366×768 |
| BHL2 | Condition interaction tags in the condition owner (BHC11) | Medium, M | Two existing active effects resolve through declared tags with a regression |
| BHL3 | Body wear and conditioning on one verb, reusing IP2 (BHC3, BHC4) | Medium, S–M | Smithing strain accrues and rests away; conditioning persists through save, reload and import |
| BHL4 | Cross-world remedy and suppression fields on world cards (BHC17) | Medium, S | Two world cards declare suppression; one carried potion shows the right forecast |
| BHL5 | Per-world source check of B2's MEMORY rows | Medium, S | Each MEMORY row becomes STATED with a ledger line or is marked unverified |

## Lane returns, round 1, 2026-10-17

Lanes B1 and B2 ran as Claude subagents. Corrections first.

### Corrections

| Code | What was wrong | Fix |
|---|---|---|
| BHX1 | Part 35 and [USER_VISION](USER_VISION.md#food-benefits-and-famine-consideration-2026-10-13) say Famine is not implemented. It is: `src/data/skills.js:911` defines the skill and `src/absorb_p23/exposure/exposure.js:7` trains it below 20 fullness (B1-X1, SHOWN and rechecked by root) | Recorded here. The older owners keep their dated wording; the next part 35 revision should cite the code |
| BHX2 | BHR18 and part 35 H35I2 read "no lethal offline illness" as a fixed line, against the 2026-10-17 AD5 framing (B1-X2) | BHR18 and BHR16 now read as defaults with a forewarned dial |
| BHX3 | BHC25 said the simulation condition store can own body conditions. It keys `conditions[actorId]` (`src/simulation_effects.js:350`), not by body instance (B1-X6) | BHR3 now requires body facts keyed by body instance; BHN5 below |
| BHX4 | Round 1 missed two NPC old-age owners (`src/simulation.js:545` lifePolicy and `src/npc_lives.js`) and three tolerance carriers (Poison resistance skill, Frontier exposure XP, mixture exposure) (B1-X5, B1-X7) | BHN6, BHN7; BHR23 now names one tolerance owner |
| BHX5 | Part 35's code citations for `update_health`, `kill_player` and rest are stale; current lines are `src/main.js:3870`, `:4909`, `:3902` (B1-X9) | Cite function names with lines from now on |

### New angles from the lanes

| Code | Consideration | Default, dial and reason |
|---|---|---|
| BHC27 | **A risk stage before the condition** (Long Dark afflictions, LotM pre-signs; B2 T4) | Default: a known risky exposure shows a "may develop" stage that pauses risky idle work and offers prevention. Reason: gives BHR11 disclosure a concrete shape in idle play |
| BHC28 | **Status words are derived, not stored** (Project Zomboid moodles; B2 T6) | Default: "aching", "feverish" and similar words are a projection of conditions, never saved as truth. Reason: one authority (AR) and no drift between label and state |
| BHC29 | **Severe injury opens a path** (Kenshi limbs, prosthetic or regrowth quests; B2 T9) | Default: a lasting loss offers at least one route forward (workaround, prosthetic, regrowth, new role) fitting the world. Reason: harm becomes a story branch rather than a dead end |
| BHC30 | **The main danger differs by world** (B2 D1–D5): spiritual instability in LotM, cultivation and MoL; healing rare in JJK and ordinary in D&D and Harry Potter; soul damage outlasting resets in MoL; comic worlds treating injury as a gag | Default: each world card names its main body danger, healing availability and its tone of injury. Reason: BHR12 severity needs these three numbers per world |
| BHC31 | **Defeat has three code routes** (`kill_player` combat, non-combat, staged faint departure; B1-X10) | Default: any injury-on-defeat setting (BHR15) hooks one shared defeat publisher that all three call. Reason: avoids a setting that works in one fight type only |

### ACCOUNT FOR NOW, added

| Code | Constraint |
|---|---|
| BHN5 | New body conditions key by body instance; actor-keyed storage stays for mind and soul conditions (B1-X6) |
| BHN6 | NPC aging has two owners today; a health slice touching NPC lifespans picks one first (AR one authority) |
| BHN7 | Tolerance has three carriers today; name the Poison resistance skill (or a successor) as the tolerance owner before adding a fourth |
| BHN8 | Four care hosts recompute "supported body"; a first health slice reads one projection (B1-S1) instead of adding a fifth |

### LATER / DELEGATE, added (engine seams from B1)

| Code | Item | Level, effort | Done check |
|---|---|---|---|
| BHL6 | `health` domain projection only, one `main.js` registration line, no save slice (B1-S1) | Strong, S | Body & recovery, status care and field care read the projection; rebuilt browser check at 1920×1080 and 1366×768 |
| BHL7 | One mild injury condition from a shared defeat publisher, behind the BHR15 setting (B1-S2, BHC31) | Medium, S–M | All three defeat routes apply it when the setting is on and none when off; save, reload and import keep it |
| BHL8 | `health` save slice only for facts with no owner (cause records, diagnosis knowledge, care plans) (B1-S3) | Later, M | Migration from saves without the slice; regression for missing fields |
