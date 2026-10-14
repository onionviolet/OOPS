# GC1-GC14 as cheat-card data

2026-10-14. INFERRED proposals, not held cards or implemented hooks. The JSON blocks use the exact ten top-level fields required by `src/cheat_cards.js:2` and `:32`. Nested hook/observer descriptors are proposed data: the current validator checks JSON, not their behavior. `grantCheat` (`:65`) executes no hooks. There are no new top-level `cost`, `backing` or `scope` fields; those policies live inside JSON descriptors/state.

Links: [GA9 hooks](HOOKS.md), [honesty](HONESTY.md), [FEATURE_UNLOCK J1-J7](../../../../worlds/FEATURE_UNLOCK_AND_CHEAT_ACQUISITION_PROCESS_2026-10-13.md#the-actual-player-journey-to-author), [library AQ routes](../../../../CHEAT_LIBRARY.md#acquiring-cheats-routes-rarity-and-types-considerations-2026-10-13), [kit CL/CLR](../../../../worlds/WORLD_CORE_KIT_2026-10-14.md#cheats-that-show-the-kit-lens-cheats-cl).

## C1. World policy and costs

The world set follows PROJECT/USER_VISION: the initial five, LOTM/COI, Shadow Slave, Reincarnation Paradise, and the explicitly named anime/manga tier JJK, Bleach, Fate, HxH, FMA and Naruto. Village is the first proof host. Other books remain reachable as source coverage grows. All framings below are original optional variants inspired by setting vocabulary, not assertions that these are canonical powers. “Variant”, especially for retcon and counterparts, is deliberate. No new source-research claim is made.

Each card carries a separate cost proposal for each world. Units are design budget labels, not existing spendable currencies or canon numeric rates. A builder binds a selected profile to ordinary costs after verifying the source/backing. Read costs apply to an explicit consultation, never opening/hovering the panel. Cached readings are free. A Village read is free by default; its stronger model/mutation uses luck charges. Outside Village, a read costs 1 local unit, a mutation 2, a branch 3, a counterpart action 5, and a rewrite 8. These are tunable per-world examples, not a global balance rule. Free/pure variants set costs to zero and do not convert logs into a hidden tax.

| World | Local cost unit | Additional proposed consequence, only if the chosen source declares it |
|---|---|---|
| Village | luck charge | None for the proof lens |
| Harry Potter | local magical effort | Teacher or observer notices ritual use |
| D&D | spell budget unit | Caster preparation and patron attention |
| A Soldier’s Life | aether effort unit | Visible distraction while reading |
| TTKS | cultivation effort unit | Teacher/sect notices repeated manipulation |
| Mother of Learning | local mana effort | Time spent calibrating; loop context changes |
| LOTM | spirituality effort | Ritual attention or mental strain |
| Circle of Inevitability | spirituality effort | Ritual attention or cycle context changes |
| Shadow Slave | essence effort unit | Dream exposure or source strain |
| Reincarnation Paradise | contract information credit | Contract audit trail |
| JJK | cursed-energy effort | Observable technique use |
| Bleach | spiritual effort unit | Observable spiritual signature |
| Fate | magical-energy effort | Ritual or observer attention |
| HxH | aura effort unit | Declared ability condition |
| FMA | prepared research supply | Supplies consumed; conspicuous experiment |
| Naruto | chakra effort unit | Observable seal use |

Every policy also needs independent world standing (world-law/common/rare-gift/cheat/forbidden), incidence, legality, portability and source revocation. A status window is ordinary in a system world; hidden dice access can still be exceptional. No card below decides those dials by its name. Limits, reach, durations and strength remain per-world/source adjectives, not fixed lifetime “once” rules.

## C2. Acquisition, growth and host compatibility

Each card names a concrete encounter/investigation and follows J3 obtain access, J4 activate and persist once, J5 useful first task, J6 develop through meaningful practice or queued research, J7 keep records when the source is lost. Alternative AQ1 optional start, AQ5 teaching, AQ6 item, AQ7 bargain, AQ9 inheritance and AQ14 labeled sandbox remain possible. The card chooses a worked AQ4 research route below; it does not require seven chores for every birth trait or purchased tool. Refusal leaves ordinary play intact. No card completes an existing chain or grants research retroactively.

Growth steps distinguish presence/category/range/exact/future. Mutation cards grow permissions and reach as well as precision. A proposed future stage never bypasses GCR4. `stages` and `sources` below describe authoring, not a new live quest grammar. Costs and source activation precede practice credit; repeated renders grant none.

GC1/GC3 use `ui: status-window` as the requested first host. Live `awakenedStatusCard` (`src/cheat_cards.js:85`) finds the first matching card, and `awakenCheats` (`:90`) automatically wakes explicitly dormant status cards. A builder must preserve the existing system card as the discovery owner and compose acquired GC observers into its projected reader. Do not blindly grant these standalone drafts and rely on their UI field to confer access. GC state intentionally omits `awakened`; activation is separately checked by the proposed hook host. Quiet cards may surface observations in a known task through the same lens host without new panels.

GC12 uses branchPreview only for contact/divergence information; its meet/trade is a separate actor/world action. GC13 uses pin only for the proposed replacement in a new revision namespace; the named rewrite host, rather than ordinary pin, alters frozen truth. GC14 defaults to Seed Cartographer’s layout domain, excluding people/events; expanding it requires a distinct variant and route. GC11 CL15 stack is sandbox-only, while a safe fourth-wall signal may work in play.

## GC1. Odds sight

```json
{
  "id": "gc1-odds-sight",
  "family": "generation-lens",
  "name": "Odds sight",
  "ui": "status-window",
  "terms": "gift",
  "hooks": [{"schema": 1, "kind": "draw", "op": "peek", "domain": "known-eligible-decisions", "scope": "own", "policyRef": "g5/HOOKS.md", "read": "odds"}],
  "state": {
    "schema": 1,
    "grade": 0,
    "activation": "unacquired-draft",
    "strengthDial": "world/source-defined",
    "worlds": {
      "village": {"framing": "System readout: Odds sight", "cost": {"units": 0, "unit": "luck charge", "trigger": "explicit-consultation", "profile": "proposal"}},
      "harry-potter": {"framing": "Divination notebook: Odds sight", "cost": {"units": 1, "unit": "local magical effort", "trigger": "explicit-consultation", "profile": "proposal"}},
      "dnd": {"framing": "Diviner appraisal: Odds sight", "cost": {"units": 1, "unit": "spell budget unit", "trigger": "explicit-consultation", "profile": "proposal"}},
      "soldiers-life": {"framing": "Surveyor chart: Odds sight", "cost": {"units": 1, "unit": "aether effort unit", "trigger": "explicit-consultation", "profile": "proposal"}},
      "ttks": {"framing": "Talent ledger: Odds sight", "cost": {"units": 1, "unit": "cultivation effort unit", "trigger": "explicit-consultation", "profile": "proposal"}},
      "mother-of-learning": {"framing": "Loop notebook: Odds sight", "cost": {"units": 1, "unit": "local mana effort", "trigger": "explicit-consultation", "profile": "proposal"}},
      "lotm": {"framing": "Divination reading: Odds sight", "cost": {"units": 1, "unit": "spirituality effort", "trigger": "explicit-consultation", "profile": "proposal"}},
      "coi": {"framing": "Cycle omen: Odds sight", "cost": {"units": 1, "unit": "spirituality effort", "trigger": "explicit-consultation", "profile": "proposal"}},
      "shadow-slave": {"framing": "Dream chart: Odds sight", "cost": {"units": 1, "unit": "essence effort unit", "trigger": "explicit-consultation", "profile": "proposal"}},
      "reincarnation-paradise": {"framing": "Contract readout: Odds sight", "cost": {"units": 1, "unit": "contract information credit", "trigger": "explicit-consultation", "profile": "proposal"}},
      "jjk": {"framing": "Technique readout variant: Odds sight", "cost": {"units": 1, "unit": "cursed-energy effort", "trigger": "explicit-consultation", "profile": "proposal"}},
      "bleach": {"framing": "Spirit reading variant: Odds sight", "cost": {"units": 1, "unit": "spiritual effort unit", "trigger": "explicit-consultation", "profile": "proposal"}},
      "fate": {"framing": "Mystic readout variant: Odds sight", "cost": {"units": 1, "unit": "magical-energy effort", "trigger": "explicit-consultation", "profile": "proposal"}},
      "hxh": {"framing": "Analysis ability variant: Odds sight", "cost": {"units": 1, "unit": "aura effort unit", "trigger": "explicit-consultation", "profile": "proposal"}},
      "fma": {"framing": "Research ledger: Odds sight", "cost": {"units": 1, "unit": "prepared research supply", "trigger": "explicit-consultation", "profile": "proposal"}},
      "naruto": {"framing": "Perception notebook variant: Odds sight", "cost": {"units": 1, "unit": "chakra effort unit", "trigger": "explicit-consultation", "profile": "proposal"}}
    }
  },
  "stages": [{"grade": 1, "grants": "Known event presence", "requires": "meaningful known-task use or source milestone; no render credit"}, {"grade": 2, "grants": "Honest broad probability band", "requires": "meaningful known-task use or source milestone; no render credit"}, {"grade": 3, "grants": "Certified rounded odds with exact detail", "requires": "meaningful known-task use or source milestone; no render credit"}, {"grade": 4, "grants": "Next addressed result under stated conditions", "requires": "meaningful known-task use or source milestone; no render credit"}],
  "observers": [{"schema": 1, "kind": "lens", "stackWith": ["CL1", "CL3"], "truthPolicy": "honest", "sealedPolicy": "discovery-route-only", "freshness": "resolution-context-token", "backing": "selected-by-acquisition-source"}],
  "sources": [{"kind": "INFERRED", "owner": "GENERATION_FOUNDATION_RULES_2026-10-14 GC1", "acquisition": {"route": "researched", "aq": "AQ4", "journey": {"J1_J2": "Compare repeated outcomes of one known task; teacher explains odds", "J3": "Obtain teacher, carrier or reproducible research method with known terms", "J4": "Activate on an ordinary transaction; save acquisition and cost before reveal", "J5": "Apply the acquired permission to one real known decision and show its receipt", "J6": "Practice or queued research broadens the next declared stage", "J7": "Backing decides loss/carry; retain lawful observations separately"}}}]
}
```

## GC2. Table sight

```json
{
  "id": "gc2-table-sight",
  "family": "generation-lens",
  "name": "Table sight",
  "ui": "quiet",
  "terms": "gift",
  "hooks": [{"schema": 1, "kind": "draw", "op": "peek", "domain": "known-eligible-decisions", "scope": "own", "policyRef": "g5/HOOKS.md", "read": "menu"}],
  "state": {
    "schema": 1,
    "grade": 0,
    "activation": "unacquired-draft",
    "strengthDial": "world/source-defined",
    "worlds": {
      "village": {"framing": "System readout: Table sight", "cost": {"units": 0, "unit": "luck charge", "trigger": "explicit-consultation", "profile": "proposal"}},
      "harry-potter": {"framing": "Divination notebook: Table sight", "cost": {"units": 1, "unit": "local magical effort", "trigger": "explicit-consultation", "profile": "proposal"}},
      "dnd": {"framing": "Diviner appraisal: Table sight", "cost": {"units": 1, "unit": "spell budget unit", "trigger": "explicit-consultation", "profile": "proposal"}},
      "soldiers-life": {"framing": "Surveyor chart: Table sight", "cost": {"units": 1, "unit": "aether effort unit", "trigger": "explicit-consultation", "profile": "proposal"}},
      "ttks": {"framing": "Talent ledger: Table sight", "cost": {"units": 1, "unit": "cultivation effort unit", "trigger": "explicit-consultation", "profile": "proposal"}},
      "mother-of-learning": {"framing": "Loop notebook: Table sight", "cost": {"units": 1, "unit": "local mana effort", "trigger": "explicit-consultation", "profile": "proposal"}},
      "lotm": {"framing": "Divination reading: Table sight", "cost": {"units": 1, "unit": "spirituality effort", "trigger": "explicit-consultation", "profile": "proposal"}},
      "coi": {"framing": "Cycle omen: Table sight", "cost": {"units": 1, "unit": "spirituality effort", "trigger": "explicit-consultation", "profile": "proposal"}},
      "shadow-slave": {"framing": "Dream chart: Table sight", "cost": {"units": 1, "unit": "essence effort unit", "trigger": "explicit-consultation", "profile": "proposal"}},
      "reincarnation-paradise": {"framing": "Contract readout: Table sight", "cost": {"units": 1, "unit": "contract information credit", "trigger": "explicit-consultation", "profile": "proposal"}},
      "jjk": {"framing": "Technique readout variant: Table sight", "cost": {"units": 1, "unit": "cursed-energy effort", "trigger": "explicit-consultation", "profile": "proposal"}},
      "bleach": {"framing": "Spirit reading variant: Table sight", "cost": {"units": 1, "unit": "spiritual effort unit", "trigger": "explicit-consultation", "profile": "proposal"}},
      "fate": {"framing": "Mystic readout variant: Table sight", "cost": {"units": 1, "unit": "magical-energy effort", "trigger": "explicit-consultation", "profile": "proposal"}},
      "hxh": {"framing": "Analysis ability variant: Table sight", "cost": {"units": 1, "unit": "aura effort unit", "trigger": "explicit-consultation", "profile": "proposal"}},
      "fma": {"framing": "Research ledger: Table sight", "cost": {"units": 1, "unit": "prepared research supply", "trigger": "explicit-consultation", "profile": "proposal"}},
      "naruto": {"framing": "Perception notebook variant: Table sight", "cost": {"units": 1, "unit": "chakra effort unit", "trigger": "explicit-consultation", "profile": "proposal"}}
    }
  },
  "stages": [{"grade": 1, "grants": "Known outcome category exists", "requires": "meaningful known-task use or source milestone; no render credit"}, {"grade": 2, "grants": "Eligible known categories", "requires": "meaningful known-task use or source milestone; no render credit"}, {"grade": 3, "grants": "Eligible authorized option menu with weights", "requires": "meaningful known-task use or source milestone; no render credit"}, {"grade": 4, "grants": "Conditional future menu for one known window", "requires": "meaningful known-task use or source milestone; no render credit"}],
  "observers": [{"schema": 1, "kind": "lens", "stackWith": ["CL11", "CL1"], "truthPolicy": "honest", "sealedPolicy": "discovery-route-only", "freshness": "resolution-context-token", "backing": "selected-by-acquisition-source"}],
  "sources": [{"kind": "INFERRED", "owner": "GENERATION_FOUNDATION_RULES_2026-10-14 GC2", "acquisition": {"route": "researched", "aq": "AQ4", "journey": {"J1_J2": "Collect known results; identify a chart or study the collection", "J3": "Obtain teacher, carrier or reproducible research method with known terms", "J4": "Activate on an ordinary transaction; save acquisition and cost before reveal", "J5": "Apply the acquired permission to one real known decision and show its receipt", "J6": "Practice or queued research broadens the next declared stage", "J7": "Backing decides loss/carry; retain lawful observations separately"}}}]
}
```

## GC3. Why sight

```json
{
  "id": "gc3-why-sight",
  "family": "generation-lens",
  "name": "Why sight",
  "ui": "status-window",
  "terms": "gift",
  "hooks": [{"schema": 1, "kind": "draw", "op": "peek", "domain": "known-eligible-decisions", "scope": "own", "policyRef": "g5/HOOKS.md", "read": "explain"}],
  "state": {
    "schema": 1,
    "grade": 0,
    "activation": "unacquired-draft",
    "strengthDial": "world/source-defined",
    "worlds": {
      "village": {"framing": "System readout: Why sight", "cost": {"units": 0, "unit": "luck charge", "trigger": "explicit-consultation", "profile": "proposal"}},
      "harry-potter": {"framing": "Divination notebook: Why sight", "cost": {"units": 1, "unit": "local magical effort", "trigger": "explicit-consultation", "profile": "proposal"}},
      "dnd": {"framing": "Diviner appraisal: Why sight", "cost": {"units": 1, "unit": "spell budget unit", "trigger": "explicit-consultation", "profile": "proposal"}},
      "soldiers-life": {"framing": "Surveyor chart: Why sight", "cost": {"units": 1, "unit": "aether effort unit", "trigger": "explicit-consultation", "profile": "proposal"}},
      "ttks": {"framing": "Talent ledger: Why sight", "cost": {"units": 1, "unit": "cultivation effort unit", "trigger": "explicit-consultation", "profile": "proposal"}},
      "mother-of-learning": {"framing": "Loop notebook: Why sight", "cost": {"units": 1, "unit": "local mana effort", "trigger": "explicit-consultation", "profile": "proposal"}},
      "lotm": {"framing": "Divination reading: Why sight", "cost": {"units": 1, "unit": "spirituality effort", "trigger": "explicit-consultation", "profile": "proposal"}},
      "coi": {"framing": "Cycle omen: Why sight", "cost": {"units": 1, "unit": "spirituality effort", "trigger": "explicit-consultation", "profile": "proposal"}},
      "shadow-slave": {"framing": "Dream chart: Why sight", "cost": {"units": 1, "unit": "essence effort unit", "trigger": "explicit-consultation", "profile": "proposal"}},
      "reincarnation-paradise": {"framing": "Contract readout: Why sight", "cost": {"units": 1, "unit": "contract information credit", "trigger": "explicit-consultation", "profile": "proposal"}},
      "jjk": {"framing": "Technique readout variant: Why sight", "cost": {"units": 1, "unit": "cursed-energy effort", "trigger": "explicit-consultation", "profile": "proposal"}},
      "bleach": {"framing": "Spirit reading variant: Why sight", "cost": {"units": 1, "unit": "spiritual effort unit", "trigger": "explicit-consultation", "profile": "proposal"}},
      "fate": {"framing": "Mystic readout variant: Why sight", "cost": {"units": 1, "unit": "magical-energy effort", "trigger": "explicit-consultation", "profile": "proposal"}},
      "hxh": {"framing": "Analysis ability variant: Why sight", "cost": {"units": 1, "unit": "aura effort unit", "trigger": "explicit-consultation", "profile": "proposal"}},
      "fma": {"framing": "Research ledger: Why sight", "cost": {"units": 1, "unit": "prepared research supply", "trigger": "explicit-consultation", "profile": "proposal"}},
      "naruto": {"framing": "Perception notebook variant: Why sight", "cost": {"units": 1, "unit": "chakra effort unit", "trigger": "explicit-consultation", "profile": "proposal"}}
    }
  },
  "stages": [{"grade": 1, "grants": "An influence was present", "requires": "meaningful known-task use or source milestone; no render credit"}, {"grade": 2, "grants": "Known leading cause category", "requires": "meaningful known-task use or source milestone; no render credit"}, {"grade": 3, "grants": "Top disclosed factors with denominator and provenance", "requires": "meaningful known-task use or source milestone; no render credit"}, {"grade": 4, "grants": "Compare one changed known cause in a forecast", "requires": "meaningful known-task use or source milestone; no render credit"}],
  "observers": [{"schema": 1, "kind": "lens", "stackWith": ["CL2", "CL9"], "truthPolicy": "honest", "sealedPolicy": "discovery-route-only", "freshness": "resolution-context-token", "backing": "selected-by-acquisition-source"}],
  "sources": [{"kind": "INFERRED", "owner": "GENERATION_FOUNDATION_RULES_2026-10-14 GC3", "acquisition": {"route": "researched", "aq": "AQ4", "journey": {"J1_J2": "Follow a receipt back to a known cause; reproduce it in a controlled task", "J3": "Obtain teacher, carrier or reproducible research method with known terms", "J4": "Activate on an ordinary transaction; save acquisition and cost before reveal", "J5": "Apply the acquired permission to one real known decision and show its receipt", "J6": "Practice or queued research broadens the next declared stage", "J7": "Backing decides loss/carry; retain lawful observations separately"}}}]
}
```

## GC4. Fixed or fluid

```json
{
  "id": "gc4-fixed-or-fluid",
  "family": "generation-lens",
  "name": "Fixed or fluid",
  "ui": "quiet",
  "terms": "gift",
  "hooks": [{"schema": 1, "kind": "draw", "op": "peek", "domain": "known-eligible-decisions", "scope": "own", "policyRef": "g5/HOOKS.md", "read": "freeze"}],
  "state": {
    "schema": 1,
    "grade": 0,
    "activation": "unacquired-draft",
    "strengthDial": "world/source-defined",
    "worlds": {
      "village": {"framing": "System readout: Fixed or fluid", "cost": {"units": 0, "unit": "luck charge", "trigger": "explicit-consultation", "profile": "proposal"}},
      "harry-potter": {"framing": "Divination notebook: Fixed or fluid", "cost": {"units": 1, "unit": "local magical effort", "trigger": "explicit-consultation", "profile": "proposal"}},
      "dnd": {"framing": "Diviner appraisal: Fixed or fluid", "cost": {"units": 1, "unit": "spell budget unit", "trigger": "explicit-consultation", "profile": "proposal"}},
      "soldiers-life": {"framing": "Surveyor chart: Fixed or fluid", "cost": {"units": 1, "unit": "aether effort unit", "trigger": "explicit-consultation", "profile": "proposal"}},
      "ttks": {"framing": "Talent ledger: Fixed or fluid", "cost": {"units": 1, "unit": "cultivation effort unit", "trigger": "explicit-consultation", "profile": "proposal"}},
      "mother-of-learning": {"framing": "Loop notebook: Fixed or fluid", "cost": {"units": 1, "unit": "local mana effort", "trigger": "explicit-consultation", "profile": "proposal"}},
      "lotm": {"framing": "Divination reading: Fixed or fluid", "cost": {"units": 1, "unit": "spirituality effort", "trigger": "explicit-consultation", "profile": "proposal"}},
      "coi": {"framing": "Cycle omen: Fixed or fluid", "cost": {"units": 1, "unit": "spirituality effort", "trigger": "explicit-consultation", "profile": "proposal"}},
      "shadow-slave": {"framing": "Dream chart: Fixed or fluid", "cost": {"units": 1, "unit": "essence effort unit", "trigger": "explicit-consultation", "profile": "proposal"}},
      "reincarnation-paradise": {"framing": "Contract readout: Fixed or fluid", "cost": {"units": 1, "unit": "contract information credit", "trigger": "explicit-consultation", "profile": "proposal"}},
      "jjk": {"framing": "Technique readout variant: Fixed or fluid", "cost": {"units": 1, "unit": "cursed-energy effort", "trigger": "explicit-consultation", "profile": "proposal"}},
      "bleach": {"framing": "Spirit reading variant: Fixed or fluid", "cost": {"units": 1, "unit": "spiritual effort unit", "trigger": "explicit-consultation", "profile": "proposal"}},
      "fate": {"framing": "Mystic readout variant: Fixed or fluid", "cost": {"units": 1, "unit": "magical-energy effort", "trigger": "explicit-consultation", "profile": "proposal"}},
      "hxh": {"framing": "Analysis ability variant: Fixed or fluid", "cost": {"units": 1, "unit": "aura effort unit", "trigger": "explicit-consultation", "profile": "proposal"}},
      "fma": {"framing": "Research ledger: Fixed or fluid", "cost": {"units": 1, "unit": "prepared research supply", "trigger": "explicit-consultation", "profile": "proposal"}},
      "naruto": {"framing": "Perception notebook variant: Fixed or fluid", "cost": {"units": 1, "unit": "chakra effort unit", "trigger": "explicit-consultation", "profile": "proposal"}}
    }
  },
  "stages": [{"grade": 1, "grants": "A known fact feels settled", "requires": "meaningful known-task use or source milestone; no render credit"}, {"grade": 2, "grants": "Fixed/fluid marks on known facts", "requires": "meaningful known-task use or source milestone; no render credit"}, {"grade": 3, "grants": "Revision and named change permissions", "requires": "meaningful known-task use or source milestone; no render credit"}, {"grade": 4, "grants": "Staleness warning before a lawful future change", "requires": "meaningful known-task use or source milestone; no render credit"}],
  "observers": [{"schema": 1, "kind": "lens", "stackWith": ["CL7", "CL9"], "truthPolicy": "honest", "sealedPolicy": "discovery-route-only", "freshness": "resolution-context-token", "backing": "selected-by-acquisition-source"}],
  "sources": [{"kind": "INFERRED", "owner": "GENERATION_FOUNDATION_RULES_2026-10-14 GC4", "acquisition": {"route": "researched", "aq": "AQ4", "journey": {"J1_J2": "Compare a retained note with a later observation; investigate the difference", "J3": "Obtain teacher, carrier or reproducible research method with known terms", "J4": "Activate on an ordinary transaction; save acquisition and cost before reveal", "J5": "Apply the acquired permission to one real known decision and show its receipt", "J6": "Practice or queued research broadens the next declared stage", "J7": "Backing decides loss/carry; retain lawful observations separately"}}}]
}
```

## GC5. Pity meter

```json
{
  "id": "gc5-pity-meter",
  "family": "generation-lens",
  "name": "Pity meter",
  "ui": "status-window",
  "terms": "gift",
  "hooks": [{"schema": 1, "kind": "draw", "op": "peek", "domain": "known-eligible-decisions", "scope": "own", "policyRef": "g5/HOOKS.md", "read": "pity"}],
  "state": {
    "schema": 1,
    "grade": 0,
    "activation": "unacquired-draft",
    "strengthDial": "world/source-defined",
    "worlds": {
      "village": {"framing": "System readout: Pity meter", "cost": {"units": 0, "unit": "luck charge", "trigger": "explicit-consultation", "profile": "proposal"}},
      "harry-potter": {"framing": "Divination notebook: Pity meter", "cost": {"units": 1, "unit": "local magical effort", "trigger": "explicit-consultation", "profile": "proposal"}},
      "dnd": {"framing": "Diviner appraisal: Pity meter", "cost": {"units": 1, "unit": "spell budget unit", "trigger": "explicit-consultation", "profile": "proposal"}},
      "soldiers-life": {"framing": "Surveyor chart: Pity meter", "cost": {"units": 1, "unit": "aether effort unit", "trigger": "explicit-consultation", "profile": "proposal"}},
      "ttks": {"framing": "Talent ledger: Pity meter", "cost": {"units": 1, "unit": "cultivation effort unit", "trigger": "explicit-consultation", "profile": "proposal"}},
      "mother-of-learning": {"framing": "Loop notebook: Pity meter", "cost": {"units": 1, "unit": "local mana effort", "trigger": "explicit-consultation", "profile": "proposal"}},
      "lotm": {"framing": "Divination reading: Pity meter", "cost": {"units": 1, "unit": "spirituality effort", "trigger": "explicit-consultation", "profile": "proposal"}},
      "coi": {"framing": "Cycle omen: Pity meter", "cost": {"units": 1, "unit": "spirituality effort", "trigger": "explicit-consultation", "profile": "proposal"}},
      "shadow-slave": {"framing": "Dream chart: Pity meter", "cost": {"units": 1, "unit": "essence effort unit", "trigger": "explicit-consultation", "profile": "proposal"}},
      "reincarnation-paradise": {"framing": "Contract readout: Pity meter", "cost": {"units": 1, "unit": "contract information credit", "trigger": "explicit-consultation", "profile": "proposal"}},
      "jjk": {"framing": "Technique readout variant: Pity meter", "cost": {"units": 1, "unit": "cursed-energy effort", "trigger": "explicit-consultation", "profile": "proposal"}},
      "bleach": {"framing": "Spirit reading variant: Pity meter", "cost": {"units": 1, "unit": "spiritual effort unit", "trigger": "explicit-consultation", "profile": "proposal"}},
      "fate": {"framing": "Mystic readout variant: Pity meter", "cost": {"units": 1, "unit": "magical-energy effort", "trigger": "explicit-consultation", "profile": "proposal"}},
      "hxh": {"framing": "Analysis ability variant: Pity meter", "cost": {"units": 1, "unit": "aura effort unit", "trigger": "explicit-consultation", "profile": "proposal"}},
      "fma": {"framing": "Research ledger: Pity meter", "cost": {"units": 1, "unit": "prepared research supply", "trigger": "explicit-consultation", "profile": "proposal"}},
      "naruto": {"framing": "Perception notebook variant: Pity meter", "cost": {"units": 1, "unit": "chakra effort unit", "trigger": "explicit-consultation", "profile": "proposal"}}
    }
  },
  "stages": [{"grade": 1, "grants": "Luck process exists if known", "requires": "meaningful known-task use or source milestone; no render credit"}, {"grade": 2, "grants": "Eligible-window progress band", "requires": "meaningful known-task use or source milestone; no render credit"}, {"grade": 3, "grants": "Exact current counters and actual guarantee policy", "requires": "meaningful known-task use or source milestone; no render credit"}, {"grade": 4, "grants": "Conditional next-window certificate", "requires": "meaningful known-task use or source milestone; no render credit"}],
  "observers": [{"schema": 1, "kind": "lens", "stackWith": ["CL1", "CL3"], "truthPolicy": "honest", "sealedPolicy": "discovery-route-only", "freshness": "resolution-context-token", "backing": "selected-by-acquisition-source"}],
  "sources": [{"kind": "INFERRED", "owner": "GENERATION_FOUNDATION_RULES_2026-10-14 GC5", "acquisition": {"route": "researched", "aq": "AQ4", "journey": {"J1_J2": "Track eligible windows in a notebook; learn the actual rarity process", "J3": "Obtain teacher, carrier or reproducible research method with known terms", "J4": "Activate on an ordinary transaction; save acquisition and cost before reveal", "J5": "Apply the acquired permission to one real known decision and show its receipt", "J6": "Practice or queued research broadens the next declared stage", "J7": "Backing decides loss/carry; retain lawful observations separately"}}}]
}
```

## GC6. Pin

```json
{
  "id": "gc6-pin",
  "family": "generation-manipulation",
  "name": "Pin",
  "ui": "quiet",
  "terms": "gift",
  "hooks": [{"schema": 1, "kind": "draw", "op": "pin", "domain": "known-eligible-decisions", "scope": "own", "policyRef": "g5/HOOKS.md", "defaults": {"target": "stable eligible ID", "expiry": "declared by source", "uses": "declared by world"}}],
  "state": {
    "schema": 1,
    "grade": 0,
    "activation": "unacquired-draft",
    "strengthDial": "world/source-defined",
    "worlds": {
      "village": {"framing": "Fate token: Pin", "cost": {"units": 1, "unit": "luck charge", "trigger": "accepted-action", "profile": "proposal"}},
      "harry-potter": {"framing": "Enchanted wager: Pin", "cost": {"units": 2, "unit": "local magical effort", "trigger": "accepted-action", "profile": "proposal"}},
      "dnd": {"framing": "Fortune blessing: Pin", "cost": {"units": 2, "unit": "spell budget unit", "trigger": "accepted-action", "profile": "proposal"}},
      "soldiers-life": {"framing": "Fortune imprint variant: Pin", "cost": {"units": 2, "unit": "aether effort unit", "trigger": "accepted-action", "profile": "proposal"}},
      "ttks": {"framing": "Lottery blessing variant: Pin", "cost": {"units": 2, "unit": "cultivation effort unit", "trigger": "accepted-action", "profile": "proposal"}},
      "mother-of-learning": {"framing": "Luck-working variant: Pin", "cost": {"units": 2, "unit": "local mana effort", "trigger": "accepted-action", "profile": "proposal"}},
      "lotm": {"framing": "Fortune ritual variant: Pin", "cost": {"units": 2, "unit": "spirituality effort", "trigger": "accepted-action", "profile": "proposal"}},
      "coi": {"framing": "Fortune bargain variant: Pin", "cost": {"units": 2, "unit": "spirituality effort", "trigger": "accepted-action", "profile": "proposal"}},
      "shadow-slave": {"framing": "Fate charm variant: Pin", "cost": {"units": 2, "unit": "essence effort unit", "trigger": "accepted-action", "profile": "proposal"}},
      "reincarnation-paradise": {"framing": "Luck module variant: Pin", "cost": {"units": 2, "unit": "contract information credit", "trigger": "accepted-action", "profile": "proposal"}},
      "jjk": {"framing": "Luck technique variant: Pin", "cost": {"units": 2, "unit": "cursed-energy effort", "trigger": "accepted-action", "profile": "proposal"}},
      "bleach": {"framing": "Luck seal variant: Pin", "cost": {"units": 2, "unit": "spiritual effort unit", "trigger": "accepted-action", "profile": "proposal"}},
      "fate": {"framing": "Fortune mystic code: Pin", "cost": {"units": 2, "unit": "magical-energy effort", "trigger": "accepted-action", "profile": "proposal"}},
      "hxh": {"framing": "Luck ability variant: Pin", "cost": {"units": 2, "unit": "aura effort unit", "trigger": "accepted-action", "profile": "proposal"}},
      "fma": {"framing": "Fortune array variant: Pin", "cost": {"units": 2, "unit": "prepared research supply", "trigger": "accepted-action", "profile": "proposal"}},
      "naruto": {"framing": "Luck seal variant: Pin", "cost": {"units": 2, "unit": "chakra effort unit", "trigger": "accepted-action", "profile": "proposal"}}
    }
  },
  "stages": [{"grade": 1, "grants": "Sense one eligible known category", "requires": "meaningful known-task use or source milestone; no render credit"}, {"grade": 2, "grants": "Pin a category within declared scope", "requires": "meaningful known-task use or source milestone; no render credit"}, {"grade": 3, "grants": "Pin an eligible known option", "requires": "meaningful known-task use or source milestone; no render credit"}, {"grade": 4, "grants": "Broader scope and duration through a source milestone", "requires": "meaningful known-task use or source milestone; no render credit"}],
  "observers": [{"schema": 1, "kind": "lens", "stackWith": ["CL2", "CL10"], "truthPolicy": "honest", "sealedPolicy": "discovery-route-only", "freshness": "resolution-context-token", "backing": "selected-by-acquisition-source"}],
  "sources": [{"kind": "INFERRED", "owner": "GENERATION_FOUNDATION_RULES_2026-10-14 GC6", "acquisition": {"route": "researched", "aq": "AQ4", "journey": {"J1_J2": "Identify and attune a fate token; perform a known-category trial", "J3": "Obtain teacher, carrier or reproducible research method with known terms", "J4": "Activate on an ordinary transaction; save acquisition and cost before reveal", "J5": "Apply the acquired permission to one real known decision and show its receipt", "J6": "Practice or queued research broadens the next declared stage", "J7": "Backing decides loss/carry; retain lawful observations separately"}}}]
}
```

## GC7. Reroll

```json
{
  "id": "gc7-reroll",
  "family": "generation-manipulation",
  "name": "Reroll",
  "ui": "quiet",
  "terms": "gift",
  "hooks": [{"schema": 1, "kind": "draw", "op": "reroll", "domain": "known-eligible-decisions", "scope": "own", "policyRef": "g5/HOOKS.md", "defaults": {"mode": "forced-new", "attempt": "decision-local", "original": "retained"}}],
  "state": {
    "schema": 1,
    "grade": 0,
    "activation": "unacquired-draft",
    "strengthDial": "world/source-defined",
    "worlds": {
      "village": {"framing": "Fate token: Reroll", "cost": {"units": 1, "unit": "luck charge", "trigger": "accepted-action", "profile": "proposal"}},
      "harry-potter": {"framing": "Enchanted wager: Reroll", "cost": {"units": 2, "unit": "local magical effort", "trigger": "accepted-action", "profile": "proposal"}},
      "dnd": {"framing": "Fortune blessing: Reroll", "cost": {"units": 2, "unit": "spell budget unit", "trigger": "accepted-action", "profile": "proposal"}},
      "soldiers-life": {"framing": "Fortune imprint variant: Reroll", "cost": {"units": 2, "unit": "aether effort unit", "trigger": "accepted-action", "profile": "proposal"}},
      "ttks": {"framing": "Lottery blessing variant: Reroll", "cost": {"units": 2, "unit": "cultivation effort unit", "trigger": "accepted-action", "profile": "proposal"}},
      "mother-of-learning": {"framing": "Luck-working variant: Reroll", "cost": {"units": 2, "unit": "local mana effort", "trigger": "accepted-action", "profile": "proposal"}},
      "lotm": {"framing": "Fortune ritual variant: Reroll", "cost": {"units": 2, "unit": "spirituality effort", "trigger": "accepted-action", "profile": "proposal"}},
      "coi": {"framing": "Fortune bargain variant: Reroll", "cost": {"units": 2, "unit": "spirituality effort", "trigger": "accepted-action", "profile": "proposal"}},
      "shadow-slave": {"framing": "Fate charm variant: Reroll", "cost": {"units": 2, "unit": "essence effort unit", "trigger": "accepted-action", "profile": "proposal"}},
      "reincarnation-paradise": {"framing": "Luck module variant: Reroll", "cost": {"units": 2, "unit": "contract information credit", "trigger": "accepted-action", "profile": "proposal"}},
      "jjk": {"framing": "Luck technique variant: Reroll", "cost": {"units": 2, "unit": "cursed-energy effort", "trigger": "accepted-action", "profile": "proposal"}},
      "bleach": {"framing": "Luck seal variant: Reroll", "cost": {"units": 2, "unit": "spiritual effort unit", "trigger": "accepted-action", "profile": "proposal"}},
      "fate": {"framing": "Fortune mystic code: Reroll", "cost": {"units": 2, "unit": "magical-energy effort", "trigger": "accepted-action", "profile": "proposal"}},
      "hxh": {"framing": "Luck ability variant: Reroll", "cost": {"units": 2, "unit": "aura effort unit", "trigger": "accepted-action", "profile": "proposal"}},
      "fma": {"framing": "Fortune array variant: Reroll", "cost": {"units": 2, "unit": "prepared research supply", "trigger": "accepted-action", "profile": "proposal"}},
      "naruto": {"framing": "Luck seal variant: Reroll", "cost": {"units": 2, "unit": "chakra effort unit", "trigger": "accepted-action", "profile": "proposal"}}
    }
  },
  "stages": [{"grade": 1, "grants": "Notice one uncommitted chance", "requires": "meaningful known-task use or source milestone; no render credit"}, {"grade": 2, "grants": "Forced-new local attempt", "requires": "meaningful known-task use or source milestone; no render credit"}, {"grade": 3, "grants": "Paid choose-between saved candidates", "requires": "meaningful known-task use or source milestone; no render credit"}, {"grade": 4, "grants": "Additional scope through ordinary source development", "requires": "meaningful known-task use or source milestone; no render credit"}],
  "observers": [{"schema": 1, "kind": "lens", "stackWith": ["CL9", "CL3"], "truthPolicy": "honest", "sealedPolicy": "discovery-route-only", "freshness": "resolution-context-token", "backing": "selected-by-acquisition-source"}],
  "sources": [{"kind": "INFERRED", "owner": "GENERATION_FOUNDATION_RULES_2026-10-14 GC7", "acquisition": {"route": "researched", "aq": "AQ4", "journey": {"J1_J2": "Learn a Second Look method or recover its carrier; test on an unfrozen task", "J3": "Obtain teacher, carrier or reproducible research method with known terms", "J4": "Activate on an ordinary transaction; save acquisition and cost before reveal", "J5": "Apply the acquired permission to one real known decision and show its receipt", "J6": "Practice or queued research broadens the next declared stage", "J7": "Backing decides loss/carry; retain lawful observations separately"}}}]
}
```

## GC8. Bias

```json
{
  "id": "gc8-bias",
  "family": "generation-manipulation",
  "name": "Bias",
  "ui": "quiet",
  "terms": "gift",
  "hooks": [{"schema": 1, "kind": "draw", "op": "bias", "domain": "known-eligible-decisions", "scope": "own", "policyRef": "g5/HOOKS.md", "defaults": {"tagQuery": "known permitted tag", "multiplier": {"num": 2, "den": 1}, "duration": {"clock": "world-local", "minutes": 60}, "stacking": "declared-world-policy"}}],
  "state": {
    "schema": 1,
    "grade": 0,
    "activation": "unacquired-draft",
    "strengthDial": "world/source-defined",
    "worlds": {
      "village": {"framing": "Fate token: Bias", "cost": {"units": 1, "unit": "luck charge", "trigger": "accepted-action", "profile": "proposal"}},
      "harry-potter": {"framing": "Enchanted wager: Bias", "cost": {"units": 2, "unit": "local magical effort", "trigger": "accepted-action", "profile": "proposal"}},
      "dnd": {"framing": "Fortune blessing: Bias", "cost": {"units": 2, "unit": "spell budget unit", "trigger": "accepted-action", "profile": "proposal"}},
      "soldiers-life": {"framing": "Fortune imprint variant: Bias", "cost": {"units": 2, "unit": "aether effort unit", "trigger": "accepted-action", "profile": "proposal"}},
      "ttks": {"framing": "Lottery blessing variant: Bias", "cost": {"units": 2, "unit": "cultivation effort unit", "trigger": "accepted-action", "profile": "proposal"}},
      "mother-of-learning": {"framing": "Luck-working variant: Bias", "cost": {"units": 2, "unit": "local mana effort", "trigger": "accepted-action", "profile": "proposal"}},
      "lotm": {"framing": "Fortune ritual variant: Bias", "cost": {"units": 2, "unit": "spirituality effort", "trigger": "accepted-action", "profile": "proposal"}},
      "coi": {"framing": "Fortune bargain variant: Bias", "cost": {"units": 2, "unit": "spirituality effort", "trigger": "accepted-action", "profile": "proposal"}},
      "shadow-slave": {"framing": "Fate charm variant: Bias", "cost": {"units": 2, "unit": "essence effort unit", "trigger": "accepted-action", "profile": "proposal"}},
      "reincarnation-paradise": {"framing": "Luck module variant: Bias", "cost": {"units": 2, "unit": "contract information credit", "trigger": "accepted-action", "profile": "proposal"}},
      "jjk": {"framing": "Luck technique variant: Bias", "cost": {"units": 2, "unit": "cursed-energy effort", "trigger": "accepted-action", "profile": "proposal"}},
      "bleach": {"framing": "Luck seal variant: Bias", "cost": {"units": 2, "unit": "spiritual effort unit", "trigger": "accepted-action", "profile": "proposal"}},
      "fate": {"framing": "Fortune mystic code: Bias", "cost": {"units": 2, "unit": "magical-energy effort", "trigger": "accepted-action", "profile": "proposal"}},
      "hxh": {"framing": "Luck ability variant: Bias", "cost": {"units": 2, "unit": "aura effort unit", "trigger": "accepted-action", "profile": "proposal"}},
      "fma": {"framing": "Fortune array variant: Bias", "cost": {"units": 2, "unit": "prepared research supply", "trigger": "accepted-action", "profile": "proposal"}},
      "naruto": {"framing": "Luck seal variant: Bias", "cost": {"units": 2, "unit": "chakra effort unit", "trigger": "accepted-action", "profile": "proposal"}}
    }
  },
  "stages": [{"grade": 1, "grants": "Weak known-tag influence", "requires": "meaningful known-task use or source milestone; no render credit"}, {"grade": 2, "grants": "One-scope timed tag reweight", "requires": "meaningful known-task use or source milestone; no render credit"}, {"grade": 3, "grants": "Exact declared multiplier and expiry", "requires": "meaningful known-task use or source milestone; no render credit"}, {"grade": 4, "grants": "Broader tag query through source research", "requires": "meaningful known-task use or source milestone; no render credit"}],
  "observers": [{"schema": 1, "kind": "lens", "stackWith": ["CL2", "CL1"], "truthPolicy": "honest", "sealedPolicy": "discovery-route-only", "freshness": "resolution-context-token", "backing": "selected-by-acquisition-source"}],
  "sources": [{"kind": "INFERRED", "owner": "GENERATION_FOUNDATION_RULES_2026-10-14 GC8", "acquisition": {"route": "researched", "aq": "AQ4", "journey": {"J1_J2": "Research a blessing with paired known-table trials; attune the source", "J3": "Obtain teacher, carrier or reproducible research method with known terms", "J4": "Activate on an ordinary transaction; save acquisition and cost before reveal", "J5": "Apply the acquired permission to one real known decision and show its receipt", "J6": "Practice or queued research broadens the next declared stage", "J7": "Backing decides loss/carry; retain lawful observations separately"}}}]
}
```

## GC9. Kin sight

```json
{
  "id": "gc9-kin-sight",
  "family": "generation-lens",
  "name": "Kin sight",
  "ui": "quiet",
  "terms": "gift",
  "hooks": [{"schema": 1, "kind": "draw", "op": "peek", "domain": "known-eligible-decisions", "scope": "own", "policyRef": "g5/HOOKS.md", "read": "kin"}],
  "state": {
    "schema": 1,
    "grade": 0,
    "activation": "unacquired-draft",
    "strengthDial": "world/source-defined",
    "worlds": {
      "village": {"framing": "System readout: Kin sight", "cost": {"units": 0, "unit": "luck charge", "trigger": "explicit-consultation", "profile": "proposal"}},
      "harry-potter": {"framing": "Divination notebook: Kin sight", "cost": {"units": 1, "unit": "local magical effort", "trigger": "explicit-consultation", "profile": "proposal"}},
      "dnd": {"framing": "Diviner appraisal: Kin sight", "cost": {"units": 1, "unit": "spell budget unit", "trigger": "explicit-consultation", "profile": "proposal"}},
      "soldiers-life": {"framing": "Surveyor chart: Kin sight", "cost": {"units": 1, "unit": "aether effort unit", "trigger": "explicit-consultation", "profile": "proposal"}},
      "ttks": {"framing": "Talent ledger: Kin sight", "cost": {"units": 1, "unit": "cultivation effort unit", "trigger": "explicit-consultation", "profile": "proposal"}},
      "mother-of-learning": {"framing": "Loop notebook: Kin sight", "cost": {"units": 1, "unit": "local mana effort", "trigger": "explicit-consultation", "profile": "proposal"}},
      "lotm": {"framing": "Divination reading: Kin sight", "cost": {"units": 1, "unit": "spirituality effort", "trigger": "explicit-consultation", "profile": "proposal"}},
      "coi": {"framing": "Cycle omen: Kin sight", "cost": {"units": 1, "unit": "spirituality effort", "trigger": "explicit-consultation", "profile": "proposal"}},
      "shadow-slave": {"framing": "Dream chart: Kin sight", "cost": {"units": 1, "unit": "essence effort unit", "trigger": "explicit-consultation", "profile": "proposal"}},
      "reincarnation-paradise": {"framing": "Contract readout: Kin sight", "cost": {"units": 1, "unit": "contract information credit", "trigger": "explicit-consultation", "profile": "proposal"}},
      "jjk": {"framing": "Technique readout variant: Kin sight", "cost": {"units": 1, "unit": "cursed-energy effort", "trigger": "explicit-consultation", "profile": "proposal"}},
      "bleach": {"framing": "Spirit reading variant: Kin sight", "cost": {"units": 1, "unit": "spiritual effort unit", "trigger": "explicit-consultation", "profile": "proposal"}},
      "fate": {"framing": "Mystic readout variant: Kin sight", "cost": {"units": 1, "unit": "magical-energy effort", "trigger": "explicit-consultation", "profile": "proposal"}},
      "hxh": {"framing": "Analysis ability variant: Kin sight", "cost": {"units": 1, "unit": "aura effort unit", "trigger": "explicit-consultation", "profile": "proposal"}},
      "fma": {"framing": "Research ledger: Kin sight", "cost": {"units": 1, "unit": "prepared research supply", "trigger": "explicit-consultation", "profile": "proposal"}},
      "naruto": {"framing": "Perception notebook variant: Kin sight", "cost": {"units": 1, "unit": "chakra effort unit", "trigger": "explicit-consultation", "profile": "proposal"}}
    }
  },
  "stages": [{"grade": 1, "grants": "Known subjects may share a root", "requires": "meaningful known-task use or source milestone; no render credit"}, {"grade": 2, "grants": "Relationship category with lawful evidence", "requires": "meaningful known-task use or source milestone; no render credit"}, {"grade": 3, "grants": "Authorized batch/lineage/root link", "requires": "meaningful known-task use or source milestone; no render credit"}, {"grade": 4, "grants": "Conditional counterpart divergence reading", "requires": "meaningful known-task use or source milestone; no render credit"}],
  "observers": [{"schema": 1, "kind": "lens", "stackWith": ["CL7", "CL11"], "truthPolicy": "honest", "sealedPolicy": "discovery-route-only", "freshness": "resolution-context-token", "backing": "selected-by-acquisition-source"}],
  "sources": [{"kind": "INFERRED", "owner": "GENERATION_FOUNDATION_RULES_2026-10-14 GC9", "acquisition": {"route": "researched", "aq": "AQ4", "journey": {"J1_J2": "Compare known batch or family records; verify one lawful shared origin", "J3": "Obtain teacher, carrier or reproducible research method with known terms", "J4": "Activate on an ordinary transaction; save acquisition and cost before reveal", "J5": "Apply the acquired permission to one real known decision and show its receipt", "J6": "Practice or queued research broadens the next declared stage", "J7": "Backing decides loss/carry; retain lawful observations separately"}}}]
}
```

## GC10. Branch preview

```json
{
  "id": "gc10-branch-preview",
  "family": "generation-manipulation",
  "name": "Branch preview",
  "ui": "simulator-foresight",
  "terms": "gift",
  "hooks": [{"schema": 1, "kind": "draw", "op": "branchPreview", "domain": "known-eligible-decisions", "scope": "own", "policyRef": "g5/HOOKS.md", "defaults": {"mode": "replay", "horizon": "one known action", "workBudget": "world-declared"}}],
  "state": {
    "schema": 1,
    "grade": 0,
    "activation": "unacquired-draft",
    "strengthDial": "world/source-defined",
    "worlds": {
      "village": {"framing": "Known-task simulation: Branch preview", "cost": {"units": 1, "unit": "luck charge", "trigger": "accepted-action", "profile": "proposal"}},
      "harry-potter": {"framing": "Conditional vision: Branch preview", "cost": {"units": 3, "unit": "local magical effort", "trigger": "accepted-action", "profile": "proposal"}},
      "dnd": {"framing": "Divination scenario: Branch preview", "cost": {"units": 3, "unit": "spell budget unit", "trigger": "accepted-action", "profile": "proposal"}},
      "soldiers-life": {"framing": "Tactical rehearsal: Branch preview", "cost": {"units": 3, "unit": "aether effort unit", "trigger": "accepted-action", "profile": "proposal"}},
      "ttks": {"framing": "Cultivation scenario: Branch preview", "cost": {"units": 3, "unit": "cultivation effort unit", "trigger": "accepted-action", "profile": "proposal"}},
      "mother-of-learning": {"framing": "Mental rehearsal: Branch preview", "cost": {"units": 3, "unit": "local mana effort", "trigger": "accepted-action", "profile": "proposal"}},
      "lotm": {"framing": "Conditional omen: Branch preview", "cost": {"units": 3, "unit": "spirituality effort", "trigger": "accepted-action", "profile": "proposal"}},
      "coi": {"framing": "Conditional cycle glimpse: Branch preview", "cost": {"units": 3, "unit": "spirituality effort", "trigger": "accepted-action", "profile": "proposal"}},
      "shadow-slave": {"framing": "Conditional dream glimpse: Branch preview", "cost": {"units": 3, "unit": "essence effort unit", "trigger": "accepted-action", "profile": "proposal"}},
      "reincarnation-paradise": {"framing": "Mission simulation: Branch preview", "cost": {"units": 3, "unit": "contract information credit", "trigger": "accepted-action", "profile": "proposal"}},
      "jjk": {"framing": "Conditional technique model: Branch preview", "cost": {"units": 3, "unit": "cursed-energy effort", "trigger": "accepted-action", "profile": "proposal"}},
      "bleach": {"framing": "Spiritual scenario: Branch preview", "cost": {"units": 3, "unit": "spiritual effort unit", "trigger": "accepted-action", "profile": "proposal"}},
      "fate": {"framing": "Conditional ritual model: Branch preview", "cost": {"units": 3, "unit": "magical-energy effort", "trigger": "accepted-action", "profile": "proposal"}},
      "hxh": {"framing": "Conditional ability model: Branch preview", "cost": {"units": 3, "unit": "aura effort unit", "trigger": "accepted-action", "profile": "proposal"}},
      "fma": {"framing": "Conditional experiment: Branch preview", "cost": {"units": 3, "unit": "prepared research supply", "trigger": "accepted-action", "profile": "proposal"}},
      "naruto": {"framing": "Conditional tactical model: Branch preview", "cost": {"units": 3, "unit": "chakra effort unit", "trigger": "accepted-action", "profile": "proposal"}}
    }
  },
  "stages": [{"grade": 1, "grants": "One safe omen", "requires": "meaningful known-task use or source milestone; no render credit"}, {"grade": 2, "grants": "One known action in a short model", "requires": "meaningful known-task use or source milestone; no render credit"}, {"grade": 3, "grants": "Exact model replay with assumptions", "requires": "meaningful known-task use or source milestone; no render credit"}, {"grade": 4, "grants": "Larger declared horizon or split comparison", "requires": "meaningful known-task use or source milestone; no render credit"}],
  "observers": [{"schema": 1, "kind": "lens", "stackWith": ["CL3", "CL10"], "truthPolicy": "honest", "sealedPolicy": "discovery-route-only", "freshness": "resolution-context-token", "backing": "selected-by-acquisition-source"}],
  "sources": [{"kind": "INFERRED", "owner": "GENERATION_FOUNDATION_RULES_2026-10-14 GC10", "acquisition": {"route": "researched", "aq": "AQ4", "journey": {"J1_J2": "Find a simulator or learn a scenario method; calibrate against a known result", "J3": "Obtain teacher, carrier or reproducible research method with known terms", "J4": "Activate on an ordinary transaction; save acquisition and cost before reveal", "J5": "Apply the acquired permission to one real known decision and show its receipt", "J6": "Practice or queued research broadens the next declared stage", "J7": "Backing decides loss/carry; retain lawful observations separately"}}}]
}
```

## GC11. Thin-world sense

```json
{
  "id": "gc11-thin-world-sense",
  "family": "generation-lens",
  "name": "Thin-world sense",
  "ui": "quiet",
  "terms": "gift",
  "hooks": [{"schema": 1, "kind": "draw", "op": "peek", "domain": "known-eligible-decisions", "scope": "own", "policyRef": "g5/HOOKS.md", "read": "fallback"}],
  "state": {
    "schema": 1,
    "grade": 0,
    "activation": "unacquired-draft",
    "strengthDial": "world/source-defined",
    "worlds": {
      "village": {"framing": "System readout: Thin-world sense", "cost": {"units": 0, "unit": "luck charge", "trigger": "explicit-consultation", "profile": "proposal"}},
      "harry-potter": {"framing": "Divination notebook: Thin-world sense", "cost": {"units": 1, "unit": "local magical effort", "trigger": "explicit-consultation", "profile": "proposal"}},
      "dnd": {"framing": "Diviner appraisal: Thin-world sense", "cost": {"units": 1, "unit": "spell budget unit", "trigger": "explicit-consultation", "profile": "proposal"}},
      "soldiers-life": {"framing": "Surveyor chart: Thin-world sense", "cost": {"units": 1, "unit": "aether effort unit", "trigger": "explicit-consultation", "profile": "proposal"}},
      "ttks": {"framing": "Talent ledger: Thin-world sense", "cost": {"units": 1, "unit": "cultivation effort unit", "trigger": "explicit-consultation", "profile": "proposal"}},
      "mother-of-learning": {"framing": "Loop notebook: Thin-world sense", "cost": {"units": 1, "unit": "local mana effort", "trigger": "explicit-consultation", "profile": "proposal"}},
      "lotm": {"framing": "Divination reading: Thin-world sense", "cost": {"units": 1, "unit": "spirituality effort", "trigger": "explicit-consultation", "profile": "proposal"}},
      "coi": {"framing": "Cycle omen: Thin-world sense", "cost": {"units": 1, "unit": "spirituality effort", "trigger": "explicit-consultation", "profile": "proposal"}},
      "shadow-slave": {"framing": "Dream chart: Thin-world sense", "cost": {"units": 1, "unit": "essence effort unit", "trigger": "explicit-consultation", "profile": "proposal"}},
      "reincarnation-paradise": {"framing": "Contract readout: Thin-world sense", "cost": {"units": 1, "unit": "contract information credit", "trigger": "explicit-consultation", "profile": "proposal"}},
      "jjk": {"framing": "Technique readout variant: Thin-world sense", "cost": {"units": 1, "unit": "cursed-energy effort", "trigger": "explicit-consultation", "profile": "proposal"}},
      "bleach": {"framing": "Spirit reading variant: Thin-world sense", "cost": {"units": 1, "unit": "spiritual effort unit", "trigger": "explicit-consultation", "profile": "proposal"}},
      "fate": {"framing": "Mystic readout variant: Thin-world sense", "cost": {"units": 1, "unit": "magical-energy effort", "trigger": "explicit-consultation", "profile": "proposal"}},
      "hxh": {"framing": "Analysis ability variant: Thin-world sense", "cost": {"units": 1, "unit": "aura effort unit", "trigger": "explicit-consultation", "profile": "proposal"}},
      "fma": {"framing": "Research ledger: Thin-world sense", "cost": {"units": 1, "unit": "prepared research supply", "trigger": "explicit-consultation", "profile": "proposal"}},
      "naruto": {"framing": "Perception notebook variant: Thin-world sense", "cost": {"units": 1, "unit": "chakra effort unit", "trigger": "explicit-consultation", "profile": "proposal"}}
    }
  },
  "stages": [{"grade": 1, "grants": "A safe fallback signal", "requires": "meaningful known-task use or source milestone; no render credit"}, {"grade": 2, "grants": "Fallback category when public", "requires": "meaningful known-task use or source milestone; no render credit"}, {"grade": 3, "grants": "Disclosed fallback reason and recorded count", "requires": "meaningful known-task use or source milestone; no render credit"}, {"grade": 4, "grants": "Predict a likely fallback in the supported model", "requires": "meaningful known-task use or source milestone; no render credit"}],
  "observers": [{"schema": 1, "kind": "lens", "stackWith": ["CL14", "CL15"], "truthPolicy": "honest", "sealedPolicy": "discovery-route-only", "freshness": "resolution-context-token", "backing": "selected-by-acquisition-source"}],
  "sources": [{"kind": "INFERRED", "owner": "GENERATION_FOUNDATION_RULES_2026-10-14 GC11", "acquisition": {"route": "researched", "aq": "AQ4", "journey": {"J1_J2": "Encounter a named public fallback; investigate its conditions", "J3": "Obtain teacher, carrier or reproducible research method with known terms", "J4": "Activate on an ordinary transaction; save acquisition and cost before reveal", "J5": "Apply the acquired permission to one real known decision and show its receipt", "J6": "Practice or queued research broadens the next declared stage", "J7": "Backing decides loss/carry; retain lawful observations separately"}}}]
}
```

## GC12. Counterpart call

```json
{
  "id": "gc12-counterpart-call",
  "family": "generation-manipulation",
  "name": "Counterpart call",
  "ui": "quiet",
  "terms": "gift",
  "hooks": [{"schema": 1, "kind": "draw", "op": "branchPreview", "domain": "known-eligible-decisions", "scope": "own", "policyRef": "g5/HOOKS.md", "requiresWorldAction": "counterpart-meet-and-consensual-trade"}],
  "state": {
    "schema": 1,
    "grade": 0,
    "activation": "unacquired-draft",
    "strengthDial": "world/source-defined",
    "worlds": {
      "village": {"framing": "Frontier echo: Counterpart call", "cost": {"units": 2, "unit": "luck charge", "trigger": "accepted-action", "profile": "proposal"}},
      "harry-potter": {"framing": "Mirror-world invitation: Counterpart call", "cost": {"units": 5, "unit": "local magical effort", "trigger": "accepted-action", "profile": "proposal"}},
      "dnd": {"framing": "Planar counterpart contact: Counterpart call", "cost": {"units": 5, "unit": "spell budget unit", "trigger": "accepted-action", "profile": "proposal"}},
      "soldiers-life": {"framing": "Crossing echo: Counterpart call", "cost": {"units": 5, "unit": "aether effort unit", "trigger": "accepted-action", "profile": "proposal"}},
      "ttks": {"framing": "Parallel-life invitation: Counterpart call", "cost": {"units": 5, "unit": "cultivation effort unit", "trigger": "accepted-action", "profile": "proposal"}},
      "mother-of-learning": {"framing": "Loop echo contact: Counterpart call", "cost": {"units": 5, "unit": "local mana effort", "trigger": "accepted-action", "profile": "proposal"}},
      "lotm": {"framing": "Continuity ritual variant: Counterpart call", "cost": {"units": 5, "unit": "spirituality effort", "trigger": "accepted-action", "profile": "proposal"}},
      "coi": {"framing": "Cycle echo contact: Counterpart call", "cost": {"units": 5, "unit": "spirituality effort", "trigger": "accepted-action", "profile": "proposal"}},
      "shadow-slave": {"framing": "Dream counterpart invitation: Counterpart call", "cost": {"units": 5, "unit": "essence effort unit", "trigger": "accepted-action", "profile": "proposal"}},
      "reincarnation-paradise": {"framing": "Parallel contractor contact: Counterpart call", "cost": {"units": 5, "unit": "contract information credit", "trigger": "accepted-action", "profile": "proposal"}},
      "jjk": {"framing": "Parallel-self technique: Counterpart call", "cost": {"units": 5, "unit": "cursed-energy effort", "trigger": "accepted-action", "profile": "proposal"}},
      "bleach": {"framing": "Parallel spirit contact: Counterpart call", "cost": {"units": 5, "unit": "spiritual effort unit", "trigger": "accepted-action", "profile": "proposal"}},
      "fate": {"framing": "Parallel-self ritual: Counterpart call", "cost": {"units": 5, "unit": "magical-energy effort", "trigger": "accepted-action", "profile": "proposal"}},
      "hxh": {"framing": "Parallel-self ability: Counterpart call", "cost": {"units": 5, "unit": "aura effort unit", "trigger": "accepted-action", "profile": "proposal"}},
      "fma": {"framing": "Parallel-self array: Counterpart call", "cost": {"units": 5, "unit": "prepared research supply", "trigger": "accepted-action", "profile": "proposal"}},
      "naruto": {"framing": "Parallel-self seal: Counterpart call", "cost": {"units": 5, "unit": "chakra effort unit", "trigger": "accepted-action", "profile": "proposal"}}
    }
  },
  "stages": [{"grade": 1, "grants": "Lawful counterpart signal", "requires": "meaningful known-task use or source milestone; no render credit"}, {"grade": 2, "grants": "Preview known divergence", "requires": "meaningful known-task use or source milestone; no render credit"}, {"grade": 3, "grants": "World-action meeting under declared law", "requires": "meaningful known-task use or source milestone; no render credit"}, {"grade": 4, "grants": "Consensual one-trait or memory trade through actor action", "requires": "meaningful known-task use or source milestone; no render credit"}],
  "observers": [{"schema": 1, "kind": "lens", "stackWith": ["CL7", "CL9"], "truthPolicy": "honest", "sealedPolicy": "discovery-route-only", "freshness": "resolution-context-token", "backing": "selected-by-acquisition-source"}],
  "sources": [{"kind": "INFERRED", "owner": "GENERATION_FOUNDATION_RULES_2026-10-14 GC12", "acquisition": {"route": "researched", "aq": "AQ4", "journey": {"J1_J2": "Discover a continuity route; negotiate contact and verify identity", "J3": "Obtain teacher, carrier or reproducible research method with known terms", "J4": "Activate on an ordinary transaction; save acquisition and cost before reveal", "J5": "Apply the acquired permission to one real known decision and show its receipt", "J6": "Practice or queued research broadens the next declared stage", "J7": "Backing decides loss/carry; retain lawful observations separately"}}}]
}
```

## GC13. Retcon

```json
{
  "id": "gc13-retcon",
  "family": "generation-manipulation",
  "name": "Retcon",
  "ui": "quiet",
  "terms": "gift",
  "hooks": [{"schema": 1, "kind": "draw", "op": "pin", "domain": "known-eligible-decisions", "scope": "own", "policyRef": "g5/HOOKS.md", "requiresWorldAction": "named-revision-with-residue"}],
  "state": {
    "schema": 1,
    "grade": 0,
    "activation": "unacquired-draft",
    "strengthDial": "world/source-defined",
    "worlds": {
      "village": {"framing": "Local rewrite rite: Retcon", "cost": {"units": 2, "unit": "luck charge", "trigger": "accepted-action", "profile": "proposal"}},
      "harry-potter": {"framing": "AU revision rite: Retcon", "cost": {"units": 8, "unit": "local magical effort", "trigger": "accepted-action", "profile": "proposal"}},
      "dnd": {"framing": "Wish-like revision variant: Retcon", "cost": {"units": 8, "unit": "spell budget unit", "trigger": "accepted-action", "profile": "proposal"}},
      "soldiers-life": {"framing": "Imprint revision variant: Retcon", "cost": {"units": 8, "unit": "aether effort unit", "trigger": "accepted-action", "profile": "proposal"}},
      "ttks": {"framing": "Destiny revision variant: Retcon", "cost": {"units": 8, "unit": "cultivation effort unit", "trigger": "accepted-action", "profile": "proposal"}},
      "mother-of-learning": {"framing": "Named loop revision variant: Retcon", "cost": {"units": 8, "unit": "local mana effort", "trigger": "accepted-action", "profile": "proposal"}},
      "lotm": {"framing": "History revision variant: Retcon", "cost": {"units": 8, "unit": "spirituality effort", "trigger": "accepted-action", "profile": "proposal"}},
      "coi": {"framing": "Named cycle revision variant: Retcon", "cost": {"units": 8, "unit": "spirituality effort", "trigger": "accepted-action", "profile": "proposal"}},
      "shadow-slave": {"framing": "Dream revision variant: Retcon", "cost": {"units": 8, "unit": "essence effort unit", "trigger": "accepted-action", "profile": "proposal"}},
      "reincarnation-paradise": {"framing": "Contract revision variant: Retcon", "cost": {"units": 8, "unit": "contract information credit", "trigger": "accepted-action", "profile": "proposal"}},
      "jjk": {"framing": "AU revision technique: Retcon", "cost": {"units": 8, "unit": "cursed-energy effort", "trigger": "accepted-action", "profile": "proposal"}},
      "bleach": {"framing": "AU spiritual revision: Retcon", "cost": {"units": 8, "unit": "spiritual effort unit", "trigger": "accepted-action", "profile": "proposal"}},
      "fate": {"framing": "AU revision ritual: Retcon", "cost": {"units": 8, "unit": "magical-energy effort", "trigger": "accepted-action", "profile": "proposal"}},
      "hxh": {"framing": "AU revision ability: Retcon", "cost": {"units": 8, "unit": "aura effort unit", "trigger": "accepted-action", "profile": "proposal"}},
      "fma": {"framing": "AU revision array: Retcon", "cost": {"units": 8, "unit": "prepared research supply", "trigger": "accepted-action", "profile": "proposal"}},
      "naruto": {"framing": "AU revision seal: Retcon", "cost": {"units": 8, "unit": "chakra effort unit", "trigger": "accepted-action", "profile": "proposal"}}
    }
  },
  "stages": [{"grade": 1, "grants": "Sense one lawfully revisable known fact", "requires": "meaningful known-task use or source milestone; no render credit"}, {"grade": 2, "grants": "Preview an authorized small revision", "requires": "meaningful known-task use or source milestone; no render credit"}, {"grade": 3, "grants": "Named world rewrite with old/new residue", "requires": "meaningful known-task use or source milestone; no render credit"}, {"grade": 4, "grants": "Broader revision permission through source development", "requires": "meaningful known-task use or source milestone; no render credit"}],
  "observers": [{"schema": 1, "kind": "lens", "stackWith": ["CL13", "CL7"], "truthPolicy": "honest", "sealedPolicy": "discovery-route-only", "freshness": "resolution-context-token", "backing": "selected-by-acquisition-source"}],
  "sources": [{"kind": "INFERRED", "owner": "GENERATION_FOUNDATION_RULES_2026-10-14 GC13", "acquisition": {"route": "researched", "aq": "AQ4", "journey": {"J1_J2": "Investigate a revision scar; earn and test a named rewrite source", "J3": "Obtain teacher, carrier or reproducible research method with known terms", "J4": "Activate on an ordinary transaction; save acquisition and cost before reveal", "J5": "Apply the acquired permission to one real known decision and show its receipt", "J6": "Practice or queued research broadens the next declared stage", "J7": "Backing decides loss/carry; retain lawful observations separately"}}}]
}
```

## GC14. Seed reader

```json
{
  "id": "gc14-seed-reader",
  "family": "generation-lens",
  "name": "Seed reader",
  "ui": "quiet",
  "terms": "gift",
  "hooks": [{"schema": 1, "kind": "draw", "op": "peek", "domain": "layout-only", "scope": "own", "policyRef": "g5/HOOKS.md", "read": "layout"}],
  "state": {
    "schema": 1,
    "grade": 0,
    "activation": "unacquired-draft",
    "strengthDial": "world/source-defined",
    "worlds": {
      "village": {"framing": "System readout: Seed reader", "cost": {"units": 0, "unit": "luck charge", "trigger": "explicit-consultation", "profile": "proposal"}},
      "harry-potter": {"framing": "Divination notebook: Seed reader", "cost": {"units": 1, "unit": "local magical effort", "trigger": "explicit-consultation", "profile": "proposal"}},
      "dnd": {"framing": "Diviner appraisal: Seed reader", "cost": {"units": 1, "unit": "spell budget unit", "trigger": "explicit-consultation", "profile": "proposal"}},
      "soldiers-life": {"framing": "Surveyor chart: Seed reader", "cost": {"units": 1, "unit": "aether effort unit", "trigger": "explicit-consultation", "profile": "proposal"}},
      "ttks": {"framing": "Talent ledger: Seed reader", "cost": {"units": 1, "unit": "cultivation effort unit", "trigger": "explicit-consultation", "profile": "proposal"}},
      "mother-of-learning": {"framing": "Loop notebook: Seed reader", "cost": {"units": 1, "unit": "local mana effort", "trigger": "explicit-consultation", "profile": "proposal"}},
      "lotm": {"framing": "Divination reading: Seed reader", "cost": {"units": 1, "unit": "spirituality effort", "trigger": "explicit-consultation", "profile": "proposal"}},
      "coi": {"framing": "Cycle omen: Seed reader", "cost": {"units": 1, "unit": "spirituality effort", "trigger": "explicit-consultation", "profile": "proposal"}},
      "shadow-slave": {"framing": "Dream chart: Seed reader", "cost": {"units": 1, "unit": "essence effort unit", "trigger": "explicit-consultation", "profile": "proposal"}},
      "reincarnation-paradise": {"framing": "Contract readout: Seed reader", "cost": {"units": 1, "unit": "contract information credit", "trigger": "explicit-consultation", "profile": "proposal"}},
      "jjk": {"framing": "Technique readout variant: Seed reader", "cost": {"units": 1, "unit": "cursed-energy effort", "trigger": "explicit-consultation", "profile": "proposal"}},
      "bleach": {"framing": "Spirit reading variant: Seed reader", "cost": {"units": 1, "unit": "spiritual effort unit", "trigger": "explicit-consultation", "profile": "proposal"}},
      "fate": {"framing": "Mystic readout variant: Seed reader", "cost": {"units": 1, "unit": "magical-energy effort", "trigger": "explicit-consultation", "profile": "proposal"}},
      "hxh": {"framing": "Analysis ability variant: Seed reader", "cost": {"units": 1, "unit": "aura effort unit", "trigger": "explicit-consultation", "profile": "proposal"}},
      "fma": {"framing": "Research ledger: Seed reader", "cost": {"units": 1, "unit": "prepared research supply", "trigger": "explicit-consultation", "profile": "proposal"}},
      "naruto": {"framing": "Perception notebook variant: Seed reader", "cost": {"units": 1, "unit": "chakra effort unit", "trigger": "explicit-consultation", "profile": "proposal"}}
    }
  },
  "stages": [{"grade": 1, "grants": "One earned layout clue", "requires": "meaningful known-task use or source milestone; no render credit"}, {"grade": 2, "grants": "Regional pattern chart", "requires": "meaningful known-task use or source milestone; no render credit"}, {"grade": 3, "grants": "Domain-scoped layout reading with context token", "requires": "meaningful known-task use or source milestone; no render credit"}, {"grade": 4, "grants": "Conditional unseen layout forecast within that domain", "requires": "meaningful known-task use or source milestone; no render credit"}],
  "observers": [{"schema": 1, "kind": "lens", "stackWith": ["CL7", "CL10"], "truthPolicy": "honest", "sealedPolicy": "discovery-route-only", "freshness": "resolution-context-token", "backing": "selected-by-acquisition-source"}],
  "sources": [{"kind": "INFERRED", "owner": "GENERATION_FOUNDATION_RULES_2026-10-14 GC14", "acquisition": {"route": "researched", "aq": "AQ4", "journey": {"J1_J2": "Find a Seed Cartographer chart; verify a clue and annotate a stale route", "J3": "Obtain teacher, carrier or reproducible research method with known terms", "J4": "Activate on an ordinary transaction; save acquisition and cost before reveal", "J5": "Apply the acquired permission to one real known decision and show its receipt", "J6": "Practice or queued research broadens the next declared stage", "J7": "Backing decides loss/carry; retain lawful observations separately"}}}]
}
```

The blocks are a reusable data catalog. They are not registered live content, granting instructions, canon research, balance acceptance or gameplay completion. The current C0 validator accepting their JSON would establish only shape compatibility; semantic hook authorization, cost bindings, world actions, acquisition and browser persistence still need builder gates.
