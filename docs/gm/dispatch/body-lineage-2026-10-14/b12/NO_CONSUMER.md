# B12 needs a new consumer

2026-10-14, docs-only. This is the missing portion of each **P/N** row in
[HOOKS](HOOKS.md), not a second B2 audit. There are 29 such rows; the other
three (MI6, MG3's callus example, MP3's log output) have narrow reusable action
and trigger examples. Even those require adapter work before any new effect
runs. A generic log renderer is not proof of lockpicking, dream production,
kin recognition or a treatment.

F1: Existing receivers are plentiful. Missing state and provenance joins are
usually the actual work. F2: Named micro actions without consumers should stay
in the palette until an owner selects them. F3: Presentation must show an
observation without converting it into ancestry, diagnosis or NPC knowledge.

| Row | Needs a new consumer or state join | Reuse, rather than replace | Smallest proposed observable gate |
|---|---|---|---|
| MI1 | Hand exposure/warmth, gear warmth and fine-task eligibility; actual lockpick, writing and spell gesture checks | Native temperature + C05 craft chance | Cold exposed hands alter the same item-craft preview/result; warm state clears it. Lockpick/writing/spell branches remain explicitly unavailable. |
| MI2 | Sweat/exertion state, chalk/wrap use and grip-dependent attack tags; real climbing outcome if that claim is selected | C03 accuracy; C09 native Climbing XP only | Named grip task changes; an unrelated weapon/task stays neutral. XP is labeled practice gain, never success chance. |
| MI3 | Actually consumed large-meal tags, body reaction timer and reading/Meditation adapters | C02 food used flag and fullness; C08/C09 | Retained native meal buff still allows nourishment and drowsiness only when food really consumed; no-op use makes no state. |
| MI4 | Qualified stimulant item/dose, jitter condition, tolerance origin and explicit alertness action if wanted | C02 duration, C05 final chance, C08 reading | Dose produces declared benefit and cost; ordinary bread creates no stimulant state. No general detection claim from reading rate. |
| MI5 | Thirst/water/canteen ownership and action; appraisal and timed-negotiation focus check | C08 reading; C10 quote only if separately selected | Actual water clears an authored headache; lacking water cannot pretend to drink. Price/diagnosis remains neutral in first candidate. |
| MI7 | Warm-up episode/timer, movement routine, valid combat clock and cost-affordability adapter | C03/C04 native combat | Same session warms once, not each enemy; source/native clock mismatch blocks shipping. Stretching must have its own paid action. |
| MI8 | Tagged hunting gathering, fullness-to-mood transition and an observer's actual irritation/quote reaction | Home hunger owner; C07/C10 | Hunger off stays neutral; only tagged hunting and willing authored merchant respond. Turning hunger on cannot infer hostility from all NPCs. |
| MI9 | Directional wind/sun/facing, ranged task qualification, scent carrier and mitigation custody | C11 light/temperature; C03 only after adapter | Looking into actual authored glare changes qualified aim. Darkness/breeze labels do not substitute; no hound tracking without a scent observer. |
| MI10 | Retained posture/continuous-sit duration, posture-shift treatment and movement-specific quote | Native meditation; C06 frozen costs | Interrupted sits do not total an uninterrupted episode; next qualified movement costs 2.1, with exact cancellation semantics. |
| MG1 | First-per-body/action receipt, unbroken sleep session, pull-up/qi circulation actions | Grip completion; C13 life memory | One genuine completion creates one first receipt and memory; reload/failed commit cannot replay it. Migration invents no prior firsts. |
| MG2 | Per-body measured run/lift/breath records; player-only strongest-hit attribution and final damage measurement | Native raw strongest_hit at `src/models/combat.js:422`; C13 | Genuine better measurement replaces the best once; equal/worse/replayed receipt does not. No synthetic feat text from skill level. |
| MG4 | Located bruise/scab/scar dates, colour/fading stages and clock policy | Existing palm scrape/mark projection | Expired scrape can become faint-mark wording now. Richer bruise stages need actual injury type and dates, never inferred from title “Bruised.” |
| MG5 | Selected illness/injury end, saved baseline and return-to-form elapsed practice state | Actual condition expiry/recovery; C03/C09 | Only the selected recovery episode starts the temporary effect; reload, manual rest or cosmetic edits cannot reset it. |
| MG6 | Validated body seed/profile, stable local-day adapter, deterministic cache and observation cursor | B2 native record, C01/C08/C11 | Same full day key yields identical rates before/after real save/reload/import/probe; no changes to shared RNG. See HOOKS D2. |
| MB1 | Graft-site sensation definition, install cause and healing timer | Existing installed brass part identity; C12 | Only explicitly biological/qualified part emits itch; removed/nonexistent part cannot keep speaking. Neutral numeric default. |
| MB2 | Drift state attached to exact part, counted use threshold, tuning action/custody and task adapter | Existing specimen.uses and operation ownership | Real uses create drift, real tuning clears it; merely opening panel/reloading never advances uses or grants repair. |
| MB3 | Changed-hand motor map, prior learned habits, eligible relearning and signature-writing action | Body custody and original practice receipts | New body keeps learned knowledge but has its own hand control; no free skill copying and no unrelated task penalty. |
| MB4 | Palate/smell/preference field plus carrier-change provenance; actual food-pair compatibility definition | C02 B2 food adapter | Changed preference can be narrated without weaker buffs. Only a separately defined food reaction changes duration. |
| MB5 | Actual missing limb and phantom-sensation episode | Removal receipt and log output only | Limb loss qualifies sensation; brass lung removal alone does not. No hidden attack penalty. |
| MB6 | Actual reflective surface/view action and known perceived-self comparison | Controlled-body projection and log | Reflection requires supported access; own unknown anatomy and prior life remain unrevealed. Repeat guard keys change receipt. |
| MB7 | Frame dimensions/tool fit, calibration practice, doorway clearance and voice-volume outcomes | Current controlled body; C05 precision work | Qualified fine work changes temporarily; fitted tools can bypass it. No invented broken inventory or impossible doorway from a race label. |
| MH1 | Feature inheritance/generation, visual comparison and kin-evidence claim consumer | Named kin relation and observation owner | Two witnessed features can support a resemblance claim; absence does not disprove kinship and resemblance does not prove it. |
| MH2 | Voice descriptor, hearing channel, acoustic comparison and attributed speaker uncertainty | Dialogue answer and observed log | Through-door resemblance leaves true speaker distinct from guessed speaker; message stone must actually convey sound. |
| MH3 | Learned-gesture observation and teacher/learner link independent of genes | Family packing source and one craftsman's observation | Adopted/taught person can share gesture without being recorded as a genetic child. |
| MH4 | Family preference/upbringing/heredity records, spice/salt food tags and individual reaction provenance | C02 individual meal-duration adapter | Taste preference has numeric 0; known individual sensitivity can alter its tagged food only. Kinship alone grants no sensitivity. |
| MH5 | Dream motif/report production and family comparison through actual received accounts | Sleep and log output only | Dreamer knows own dream; another actor learns it by a real message. Common motif is not automatic secret disclosure. |
| MP1 | Voice/gait lesson, observer recognition and supported disguise/passing checks | Exact conceal command and discrete practice owner | Taught movement can reduce declared masking effort; voice slips cannot secretly close a pursuit or impersonate an actor. |
| MP2 | Clothing dimensions, borrowed ownership, tailoring and culture/observer recognition | Equipment/merchant quote owners | Real fitted garment can change one willing observer's response; naked stat item/name cannot establish status. |
| MP4 | Pure per-observer body projection and evidence-qualified stranger/friend templates | Existing craftsman knowledge/relationship and pure bio | Friend's wording uses only learned history; no hidden body IDs, counts or implied diagnosis leak through DOM/accessibility. |

## D1 Do not force these into nearby hooks

- Lockpicking cannot be modeled as native item crafting solely to avoid adding
  a consumer. It needs a lock, approach, actual tools, difficulty and resolution.
- Concealment stamina is a masking effort quote. It is not stealth probability,
  scent direction, mistaken identity, camping sleep-talk or authority immunity.
- Meditation XP is not qi circulation, a breakthrough or an integer technique
  proficiency award. Source-qualified cultivation needs its actual faculty,
  method, fuel, host and completion consumer.
- Dialogue rendering and trade margin do not provide long negotiations, lie
  detection, appraisal or voice matching. Add only the selected actual check.
- Event feed and life history are views/records. They cannot supply missing
  biology, ancestry, rewards or NPC knowledge just because they display text.

## D2 Default, dial and in-world cost

Default: keep unselected rows dormant and native/old saves neutral. No penalty
exists merely because a model has not been authored. Dial: a qualified world can
make any row neutral, stronger, permanent, temporary or solved by an actual
faculty; no global every-body flaw or fixed once-only treatment limit is proposed.
Reason/cost: new effects come from actual physiology, work, environment or
observation. Remedies need the corresponding real item, location, time, teacher
or means. A constitution may remove a cost completely when it really supplies
the missing function.

## Evidence limits

Read-only local JS inspection and targeted identifier searches for lockpick,
thirst, glare, wind, prosthetics, body/condition, food, practice, dialogue,
weather and event/log paths. Wind hits in native locations are descriptive
failure text, not directional weather. Other bounded source-qualified modules
may own particular powers; none was activated or audited here as a universal
micro hook. Private packs, generated source worlds, all-world semantic search,
runtime gameplay and save behavior were not verified. No new consumer was
implemented by writing this list.
