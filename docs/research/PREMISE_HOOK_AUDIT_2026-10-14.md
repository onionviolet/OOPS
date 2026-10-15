# Premise hook audit, 2026-10-14

Status: research and proposals. Nothing here is an accepted decision, a work order or a gameplay change. Direction: Weibao's two quotes in [USER_VISION](../USER_VISION.md#premise-hooks-and-a-premise-generator-2026-10-14). Works: [premise hook source catalog](PREMISE_HOOK_SOURCE_CATALOG_2026-10-14.md). Start context: [intro and starts index](../INTRO_AND_STARTS_INDEX_2026-10-14.md).

Private evidence (gitignored, `docs/research/premise-hooks/private/`): `SHORTFORM_PREMISES.md` (167 premises with full H1-H6 breakdowns), `SHORTFORM_RAW.md` (captions, titles, search logs, failed routes), `CATALOG_DRAFT_A.md` and `CATALOG_DRAFT_B.md` (lane drafts), `ENGINE_MAP.md` (code lists with file:line refs and the src read). Committed text paraphrases.

Labels: SHOWN means read in repo source or files today. STATED means a public page says so. INFERRED means synthesis. UNKNOWN means not established.

## What was found

**F1. Counts.** 167 short-form premises (91 r/WritingPrompts titles via an archive mirror, 71 AniList synopses of manhwa, manhua and light novels, 5 other). 161 VERIFIED, 1 STATED, 4 MEMORY or partly MEMORY, 1 UNKNOWN. By primary category: raised by another species 31, oblivious caretaker 29, hidden lineage 19, misunderstanding cascade 14, overpowered baby 14, reunion 13, egg or hatchling 11, mistaken identity 9, changeling 8, fall or accident 8, mismatched scale 7, ugly duckling 4. By tone: comedic 99, cozy 27, bittersweet 21, grim 15, horror 5. The source catalog adds 66 works across ten sections (PH1 to PH10).

**F2. The dragon egg premise is UNKNOWN.** About fifteen searches in English, Chinese and Korean, AniList title searches, a TikTok search (needs sign-in) and two YouTube searches found no page for "egg kicked by two divine dragon siblings, falls into a snake nest, raised by an unsuspecting snake." Eleven near misses were checked and rejected, including Reborn as a Hatchling (a serpent reborn as a dragon, the reverse), Sora Tobu Umigame (an albatross raises a sea turtle egg), a WritingPrompts post about a hen brooding a dragon egg three times her size, and a YouTube Short where a cute snake hatchling turns out to be a dragon. A likely home is a Douyin or Kuaishou AI animation or comic drama, which web search indexes poorly (INFERRED). The original video link or a caption screenshot would settle it. Cultural note (MEMORY): Chinese calls the snake a "little dragon" and the Korean imugi is a serpent that becomes a dragon, so a snake mistaking a dragon for her own reads as a near-kin mistake, which is why the snake not noticing feels plausible.

**F3. TikTok itself was thin.** No verifiable TikTok or Shorts recap captions surfaced through web search, and TikTok search shows nothing without sign-in. The YouTube Shorts pass worked and surfaced wrong-nest and hidden-dragon clips. The recap channels mostly push regression power fantasies; wrong-nest and adoption comedies live in WritingPrompts, romance-fantasy webtoons and Japanese light novel titles (STATED by the lane's sample, INFERRED as a trend).

**F4. Already in the engine (SHOWN).** The Village start probe resolver supports locked, rolled and unknown axes with tags, needs and excludes ([start_records.js:51](../../src/start_records.js)). The canon-event override module can hold per-actor knowledge that differs from the facts, gate events on what someone knows and insert or substitute events ([anchor_snapshots.js:31-68](../../src/anchor_snapshots.js)). Live per-actor knowledge exists with a source basis ([causal_situations.js:52](../../src/causal_situations.js)). NPC traits that reveal one per talk exist ([generated_people.js:76](../../src/generated_people.js)). Dormant and awakened faculties exist as state.

**F5. Leak found (SHOWN, no fix made).** [main.js:8467](../../src/main.js) writes every start layer ID into the life record, including axes rolled as "unknown". A hidden-lineage premise layer would print its own ID in the life record. This must be fixed before any sealed premise ships. The probe card also prints the seed ([start_probe_ui.js:45](../../src/start_probe_ui.js)); SB15 already accepts that for solo play.

## The grammar

Six slots plus tone. A premise fills some or all of them. The short-form captions almost always state H1, H2 and H4 in one contrast sentence ("expected to die or be ordinary, but...") and leave H5 and H6 as teasers.

| Slot | Question it answers | Dragon egg reading |
| --- | --- | --- |
| **H1 origin** | What were you, and who made you? | Divine dragon clutch. |
| **H2 displacement** | How did you end up in the wrong place or role? | Kicked out of the sky by the siblings during play. |
| **H3 host** | Who takes you in, and how badly do they fit? | A snake mother, with a nest sized for snakes. |
| **H4 belief gaps** | Who wrongly believes what? | The siblings think the egg died. The snake thinks it is hers. |
| **H5 surfacing** | What hidden nature shows, when, and who notices first? | Size, wings or breath outgrow the nest. Other animals or a passing specialist notice before the snake. |
| **H6 payoff** | How does the gap pay out? | Siblings meet the survivor in front of the snake: reunion, rivalry and a mother finding out, all at once. |
| **Tone** | Cozy, comedic, bittersweet, grim, horror | Comedic; the same slots run grim if the snake eats her other eggs' share. |

**Refinements to the working grammar.**
- **H4 needs belief holders, not one gap.** The strongest premises carry two or more holders with opposite errors (P5 in the private file). The dragon egg has two: the droppers believe death, the host believes kinship. Its payoff is a three-way collision. A generator should count and place holders deliberately.
- **H4 includes the subject's own belief.** The hidden one may not know either (latent lineage), may know and hide it (cat posing as a wolf pup), or may know and assume the host doesn't when the host does (double irony).
- **H5 is a clock plus a witness list**, not a single reveal. Growth thresholds (hatching, horns, outgrowing the nest) set the pace; the witness order (who notices first) decides the comedy.
- **H2 has an agent.** Sibling, accident, discard, theft, swap, deliberate hiding or reincarnation. The agent becomes a future actor in H6 when it is a person.

## Pattern catalog

Codes are local to this audit. Examples cite SF IDs from the private premise file and catalog rows; paraphrased.

### PD: how displacement happens (H1 and H2)

| Code | Pattern | Examples | Engine note (INFERRED) |
| --- | --- | --- | --- |
| PD1 | Sibling or kin accident: your own kin dropped you and think you are gone | SF001; rare in the sample (P6 in private file) | Creates a rival pair for free; the droppers are named NPCs with a guilt or relief belief. |
| PD2 | Drift: river, rocket, storm, portal | SF019 river boat, SF102 Superman, Lilo & Stitch | No human agent; payoff must come from H1 kin searching. |
| PD3 | Discard or sacrifice: dump, stable, mountain offering | SF021, SF024, SF062, SF109 | The discarder believes you are dead or worthless; a natural rivalry or revenge seed. |
| PD4 | Theft or kidnapping | SF084, SF085, SF086 | The thief is the host; H4 includes the thief's own fear of discovery. |
| PD5 | Swap: changeling, swapped heiress | SF069, SF121, SF122, The Prince and the Pauper | Two subjects with mirrored belief gaps; needs a second generated life. |
| PD6 | Deliberate hiding for safety | SF083, SF120, Moses pattern | Hider holds the truth and may die; truth then lives only in a token or a witness. |
| PD7 | Reincarnation into the wrong body or family | SF004, SF005, SF110-SF115 | Subject knows more than the body should; adult-mind tells (PS1 of a different kind). |
| PD8 | Misfiled object: egg sold, stolen, mistaken for a gem or prop | SF007, SF008, SF009, SF165 | The egg is the ideal carrier: portable, sellable, identity hidden until hatching (P7). |

### PC: where the comedy comes from

| Code | Source | Examples | What the engine has to show |
| --- | --- | --- | --- |
| PC1 | Dramatic irony: the player knows what NPCs don't | SF001, SF090 (girl trains to kill the Demon King, her doting dad) | A view where NPC belief and player-known truth sit side by side. |
| PC2 | Oblivious caretaker: the host never notices | SF027 behemoth pet, SF034 slime that kept leveling, SF141 adults miss the fox ears | A notice threshold the host stays under, sometimes forever. Idle-friendly: it can run indefinitely (P10). |
| PC3 | Mismatched scale | SF003 hen and giant egg, SF041 kobold-raised dragon chips a horn on the ceiling, SF063 golem with orphans | Body size against host spaces, tools and food. Needs E1 bodies for nonhuman cases. |
| PC4 | Overpowered baby or adult mind in a baby | SF098, SF105, SF110-SF113, SF143 | Power far above what the host believes; the gap shows when outsiders test it. |
| PC5 | Misunderstanding cascade: each lucky outcome raises everyone's estimate | SF127-SF136, Let This Grieving Soul Retire!, The Government Inspector | Reputation as a belief that spreads by contact and grows faster than truth (P12). |
| PC6 | Double irony: the hidden one thinks the disguise works, the host knows and plays along | SF025 wolves smell the cat at once, SF054 roommate knew on day one | Each side holds a belief about the other's belief. Needs second-order beliefs, at least as a flag. |
| PC7 | Reverse reveal: parents confess, the child says it was obvious | SF043 dragon, SF044 orc, SF045 vampire family, SF161 AI parents | The belief gap sits with the parent. Cheap to stage; a single scene on a confession trigger. |
| PC8 | Prophecy fulfilled sideways: villain becomes a loving parent | SF088, SF089, SF093, SF095 | A canon expectation (V3) substituted by a softer event; foreknowledge misleads (SP10). |
| PC9 | Disguised power pet | SF027, SF031, SF032, SF035, SF082 | Player or NPC as owner; the pet's truth sealed; tells as small text. |
| PC10 | Near-kin mistake: the host's error is plausible because the species are close | Snake and dragon (F2), cat-duck SF038, elf-human SF047 | A similarity score between subject and host lowers the host's notice chance. |

### PS: how hidden nature surfaces, and who notices first

| Code | Pattern | Examples |
| --- | --- | --- |
| PS1 | Body thresholds: hatching, horns, a regrown finger, outgrowing the nest | SF032, SF041, SF075; growth is the reveal clock (P4) |
| PS2 | Outsiders, peers, animals and children notice first; caretakers last | SF025, SF040, SF054, SF141 (P1) |
| PS3 | A specialist names it: a bookseller, a passing mage, a DNA lab | SF070, SF071, SF072 (P16) |
| PS4 | Kin recognizes kin: other swans, other elves, matching golden eyes | SF022, SF040, SF049, SF108 |
| PS5 | Emotion or stress trigger: tears, danger to the host, rage | YouTube near miss (tears reveal the dragon), SF032 |
| PS6 | The caretaker learns second-hand, usually last and often by rumor | P16; Lilo & Stitch |
| PS7 | The subject didn't know either: latent lineage wakes | SF010, SF074, SF109, Percy Jackson |
| PS8 | Public accident: the reveal happens in front of a crowd | SF052 the wolf pack arrives at daycare pickup, SF098 villains learn what they took |

### PY: payoff types

| Code | Payoff | Examples |
| --- | --- | --- |
| PY1 | Birth family claims the child (resemblance, royal search, birth parents at 18) | SF068, SF085, SF119, SF120 |
| PY2 | The child seeks their own kind | SF049, SF050, SF051 |
| PY3 | Inheritance or throne claim | SF120, Superman's heritage, The Sword in the Stone |
| PY4 | Rivalry with those who dropped you | SF001 siblings, Dragon Ball's later kin, SF066 |
| PY5 | Caretaker finds out: accepts, fears, exploits or already knew | SF042, SF043, SF079 |
| PY6 | Three-way collision: droppers meet the survivor in front of the host | SF001 is the clearest example |
| PY7 | Revenge (grim) | SF116, SF121, SF122, SF151, Vinland Saga |
| PY8 | Child chooses the adoptive family | Kung Fu Panda 3, the usual close of P15 |
| PY9 | The false belief becomes true | The Eminence in Shadow (invented cult turns out real), SF138 |
| PY10 | Never resolved: the gap runs indefinitely as a running gag | SF027, SF034; idle-friendly |

### PV: grim and cozy versions of the same premise

Grim versions keep the grammar and swap one or two slots (P13).

| Code | Swap | Cozy form | Grim form |
| --- | --- | --- | --- |
| PV1 | Host is the killer of the real parents | Dark Lord adopts the prophesied orphan and goes soft (SF088) | Vikings raise the boy whose father they killed (SF156); Voldemort raises Harry (SF087) |
| PV2 | Hidden nature is monstrous | Hellhound puppy is still a good dog (SF032) | Brightburn; The Midwich Cuckoos; The Omen |
| PV3 | Swap is contested | Hero's and villain's kids adopted as siblings (SF083) | Real and fake heiress revenge (SF121, SF122, catalog PH2) |
| PV4 | Brood parasitism | Hen loves the giant egg (SF003) | Cuckoo chick pushes out the host's own young (PH10 framing) |
| PV5 | Host exploits the subject | Supervillain adopts a rival and becomes a sincere parent (SF093) | Rich man shopping for an heir is a villain (SF094) |
| PV6 | Origin family is the threat | Dragon god dad is startled by a noble family (SF068) | Demon hunters arrive for the good half-demon child (SF076) |

A tone dial per slot lets one premise roll into either form: the host's motive (love, use, fear), the subject's nature (gentle, hungry), the droppers' intent (accident, malice) and the payoff (reunion, revenge).

### PK: the player is the caretaker who doesn't notice

| Code | Seat | Example | Note |
| --- | --- | --- | --- |
| PK1 | Player raises a foundling whose truth is sealed | SF042 peasants raise a baby dragon; SF157 retired adventurer finds a baby | The player's ignorance is real, so the truth must stay sealed (see Sealing). |
| PK2 | Player owns a disguised power pet | SF027, SF032, SF034 | Tells arrive as text before any UI names them. |
| PK3 | Player is one of the droppers | The other side of SF001 | The player believes the sibling is dead; a later reunion is a surprise to them too. |
| PK4 | Player spreads the misunderstanding | PC5 from the rumor carrier's seat | Fits a gossip or reputation loop. |
| PK5 | Player is the neighbor who notices first | PS2 from the outsider's seat | Choice: tell the host, keep the secret, exploit it. |
| PK6 | Player is the host in a double irony | SF025 wolves, SF054 roommate | Player knows; the subject thinks the player doesn't. Comedy without sealing. |

PK1 and PK2 fit a human Village start today because the player stays human; only the foundling or pet is odd.

## Engine requirements and gaps

Codes map to [E1-E15](../worlds/NONHUMAN_STARTS_ENGINE_REQUIREMENTS_2026-10-14.md), NK codes in [nonhuman kin](../worlds/NONHUMAN_KIN_AND_RELATIONSHIPS_2026-10-14.md), GR rules in [generation rules](../GENERATION_FOUNDATION_RULES_2026-10-14.md), [P1 axes](../STARTS_ENDINGS_AND_RANDOMNESS_PALETTE.md) and V1/V3 in the [intro and starts index](../INTRO_AND_STARTS_INDEX_2026-10-14.md#built-and-verified-so-far). "Exists" is SHOWN from src; "Gap" is INFERRED.

| Ref | Piece | Existing codes | Exists in src | Gap |
| --- | --- | --- | --- | --- |
| PE1 | Premise grammar | P1 axes (Entry, History, Knowledge "mistaken beliefs", Exceptional means "latent, inherited"); RX1; GR1, GR6, GR7, GR15; V1 | `resolveStart` with lock/roll/unknown, tags, needs, excludes ([start_records.js:51](../../src/start_records.js)); `gen_kit` picks | H1-H6 as tagged layers. The probe consumer applies only items, money, location and quest ([main.js:8459-8467](../../src/main.js)); knowledge, text and hidden are dropped. No body or kin output. |
| PE2 | Kin and caretaker ties | NK-E2 (`basis` splits true provenance from claims), NK-E4 origin event, NK-E7 known family graph, NK4, NK12, NK16, NK18, NK-L3 | Village families with parents only ([npc_lives.js:5-33](../../src/npc_lives.js)) | No sibling, adoptive or caretaker tie, no `basis` field. Docs only. |
| PE3 | Belief ledger | GR5 truth and knowledge separate, OG3, M4 recognition, SEC P3, PSC M1/M3, OV8, CV5 | Two stores that don't meet: override knowledge can hold false values but has no gameplay consumer; live knowledge is monotonic stage strings with a basis | One owner holding per-observer claims with a truth reference, confidence, basis and time; correction and downgrade. The code itself lists "per-observer testimony/belief" as missing ([feature_expansion_book_recognition.js:189](../../src/feature_expansion_book_recognition.js)). |
| PE4 | Tells and notice thresholds | E10 how NPCs read you, M4, CV12 disguise per watcher, SB14 visible traces, MD136 | Detection and notice exist but only inside realm observation leases ([observation_channels.js:228](../../src/observation_channels.js)) | A generic tell score per subject and an attention value per watcher; host similarity (PC10) lowers notice. |
| PE5 | Surfacing schedule | E12 growth stages, NK-L5, CV11 lineage sight, SEC five stages, P1 Exceptional means | Faculty awakened/suppressed state; `traits`/`knownTraits` | Nothing raises tells over time or on growth. |
| PE6 | Divergence and exposure clocks | RV2, O1, TU2, CV8, OG1/C3 | `divergeAt` and `diffSnapshots` ([anchor_snapshots.js:171](../../src/anchor_snapshots.js)) give raw diffs | A derived "how close to exposure" per premise and "how far from canon" per world. |
| PE7 | Payoff seeds | V3, CV2-CV8, A2 planted hooks, A6 thread registry, NR12, NK-L9 | `insert`, `requires.knows`, `alternatives`, `fixed`, `reveal_at` in the override module | V3 has no gameplay or save consumer (index V3 row). Seeds keyed to premise IDs and belief state. |
| PE8 | Rumor spread | G5 gossip by contact, SL7, OT22 | `rumor` life entry kind ([life_record.js:4](../../src/life_record.js)), no propagation | Relay along relationship edges with distortion; the PC5 cascade engine. |
| PE9 | Irony view | PSC M3 dramatic irony, P2 meanwhile cutaways, GR15, `knownPeopleView` | [people_knowledge.js:12](../../src/people_knowledge.js) renders only learned facts | "X believes: ..." rows beside player-known truth, gated by sealing. |
| PE10 | Sealing hygiene | AGENTS.md sealed secrets, M11 sealed body truths, SEC:126 store truth ID only, GCR4, SB15 | Nothing | Fix the life-record leak (F5); lint that premise truth strings are absent from DOM and save text before discovery. |
| PE11 | Per-world fit | Nonhuman starts by world, IL29 law records, foundation pack `admission` ([foundation_start_content.js:43](../../src/foundation_start_content.js)) | Admission lists forms and life stages only | Premise admission per world: which H1-H6 combinations and which laws twist them. |
| PE12 | Nonhuman bodies | E1, E2, E14 | One reedling body record; E1-E14 docs only | Egg, hatchling and pet-subject premises with a nonhuman player wait on the body record. PK1/PK2 do not. |

**Cross-store note.** The generation rules doc says no generator has a live kit consumer; src shows `mixture_rules.js`, `rule_modules.js` and `mixture_native.js` importing `gen_kit` (doc drift, SHOWN). Code prefixes collide across docs (GR, CV5, P1, P2 each mean two things), so this audit names its own families PD, PC, PS, PY, PV, PK and PE.

## Sealing

The chosen premise can be public: if Weibao picks "an egg in your pack that a stranger left," that is his choice, not a sealed truth. Rolled specifics are sealed: what the egg is, which lineage, which tells, who the droppers are and when the payoff fires. They enter the irony view only after a discovery route. In PK1 and PK2 the whole truth stays sealed because the player's ignorance is the joke. Store only a truth ID in the save (SEC:126), keep it out of the life record (F5), and keep agents' reports to IDs and status ("S-premise-3: surfacing at stage 2").

## World fit

Hook keys: RS raised by another species, CH changeling, HL hidden lineage, MI mistaken identity, EG egg or hatchling, FS fell from the sky, UD ugly duckling, OC oblivious caretaker, CC misunderstanding cascade. Fit is INFERRED from each world's existing docs (refs in `ENGINE_MAP.md` section 4). Laws are paraphrased; no sealed truth is touched.

| World | Good fits | Local law that blocks or twists |
| --- | --- | --- |
| original-frontier (Village probe) | All hooks as original content; PK1, PK2, CC and MI first because the player stays human | Evidence opens actions; a reported lead differs from a witnessed one; closed-browser time is frozen, so surfacing clocks only move in play. |
| harry-potter | RS, HL, EG (creature eggs), UD | Recognition, ownership and legal standing are separate; stigma rules differ by being. |
| dnd | CH, MI, RS | One setting profile decides species law; an item persona is separate from its bearer. |
| mother-of-learning | RS, MI, UD | Some species are legally excluded; the loop resets everyone's knowledge, so belief gaps reset too unless carried. |
| naruto | HL, RS (summon families) | Bloodlines, transplants and tailed beasts are separate routes; no unearned bloodline by arrival. |
| bleach | MI | Hidden lineage is blocked by default; a visitor gets no hybrid soul by arrival. |
| jujutsu | CH, HL (common-source siblings, NK17) | Visibility, manifestation and recognition are separate; same source is not same soul. |
| fullmetal-alchemist | MI, CH, RS | Alternate bodies keep human memory; manga and 2003 anime ontologies differ. |
| hunter-x-hunter | EG, HL, MI | Offspring carry consumed traits; memory retention needs evidence. |
| chainsaw-man | MI, CH | Devils lack human legal standing by default; returning breaks memory. |
| frieren | CH, OC, PY10 | Long lives slow every payoff; a family-minded demon is an alternate-universe choice. |
| mha | UD, HL, CC (mistaken villain) | Public treatment of heteromorphs is authored per place, not one universal experience. |
| black-clover | UD | A grimoire ceremony at fifteen decides standing; no grimoire still has paid work. |
| demon-slayer | CH, OC | Demon status is lethal-hostile by default; a hidden demon child is a grim PV2 by default. |
| skyrim, elden-ring, fallout | FS, MI, CH | Disguise needs information control; owned but unsupported methods stay dormant. |
| paradise-hub | EG, RS, FS | Hatching and hive succession exist in its kin notes; mission bodies return at extraction, a safe test bed. |
| proto23 | MI | Narrow sourced visitor branch only. |
| proving-ground | Any, as a test harness | Testing world only. |
| novel worlds (Reverend Insanity, TTKS) | MI, CH, HL with detection ceilings | Mimicry needs an anchor; privilege does not transfer property. |

## Subtle details

- **The host's care should fit the wrong species.** The snake brings mice to a dragon; the dragon learns to swallow whole and later finds it odd that others chew. Habits copied from the host are not blood evidence (NK-M25), and they make a great PS4 tell when kin meet.
- **Names reveal the host's belief.** The host names the subject for what they think it is. A rename at reveal is a natural PY5 beat.
- **Siblings who dropped you grieve or don't.** PD1 droppers can carry guilt, relief or a cover story told to their parents. A cover story is a third belief holder (the parents) and seeds a later family scene.
- **Who notices first is a cast choice.** Children, animals and specialists first; the caretaker last (PS2). A generator should place at least one early noticer near the start so the player sees the gap acting.
- **Second-hand learning is funnier than a direct reveal.** The caretaker hearing it from gossip (PS6) gives a reaction scene plus a rumor trail.
- **The near-kin mistake should be measurable.** Species similarity (PC10) sets how long a host can stay oblivious. Snake and dragon score high; hen and dragon low, so the hen version is a "loves it anyway" joke rather than an oblivious one.
- **Growth thresholds belong to game time.** Idle time is the reveal clock: hatching, horns and outgrowing the nest happen while the player is away, so a return report can open with "the nest is too small."
- **The truth token.** PD6 hiders often leave a token (necklace, blanket, letter). It is portable proof and can be lost, sold or stolen, which keeps the payoff reachable without forcing it.
- **The payoff should survive a dead NPC.** If the snake dies or the siblings are killed before the reunion, V3 `alternatives` should substitute (another kin member, a token, a dream), not silently drop the seed.

## More to consider

Run with the more-to-consider skill's games lens.

**ACCOUNT FOR NOW** (constraints for any future slice, no new feature work):
- **Saves.** Premise truth, belief ledger entries and surfacing progress each need a decision: saved, derived or transient. The V1 probe adds no save field today; any premise slice that persists needs a migration or an explicit compatibility decision (AGENTS.md).
- **Determinism.** Premise draws use addressed streams (GR2) and freeze on reveal (GR3), so re-rolling one slot doesn't reshuffle the rest; tables carry `id@rev` (GR10) so old saves keep their premise when tables change.
- **NPCs act on belief, not truth** (SB21, GR13). A host who doesn't know must not behave as if it does; a generator that leaks truth into NPC behavior breaks the joke and the seal.
- **Sealing before irony.** Fix the life-record leak (F5) before any premise with a hidden axis ships.
- **Every premise stays reachable.** Per-world admission lists shape weights and twists; they don't delete premises (Default plus Dial plus Reasonably).

**LATER / DELEGATE** (not authorized here; suggested level, effort and done check):
- Read RN1 to RN3 from the source catalog for egg-stage play, cascade pacing and layered household beliefs. Mid-level reader, about an hour each for metadata plus opening chapters once acquisition follows the tools doc. Done when each has an H1-H6 sheet and three lessons.
- Seed-sweep the premise generator once it exists (GR16): count degenerate combinations (host and subject the same species, payoff with no living actor). Code-level agent, small. Done when a sweep report lists rates per combination.
- A debug inspector that shows the belief ledger with sealed rows redacted (inspection only, no mutation). Code-level agent, small. Done when the inspector renders on localhost and a test confirms sealed strings are absent.
- Ask Weibao for the dragon egg video link or a caption screenshot to close F2.

**New angles to keep.**
- Premise chains across lives: the heir of PK1's player inherits the grown foundling, now the caretaker's guardian (role swap).
- Premise collisions: two rolled premises in one village (a changeling and a cascade hero) meet; each one's belief holders are the other's audience.
- A world-level premise: the whole village is the oblivious host (SF062 the yearly sacrifice the dragon has been raising; SF164 the turtle egg the village must raise).
- Premise from the other seat: the same generated premise replayed from the dropper's, the host's or the neighbor's side in a later life.
- Meta premises: the system or patron itself misfiled the player (Tsukimichi in the catalog).

## Suggestions for a first generator slice, ranked

Proposals on top of the Village start probe (V1), human player, desktop first. Each keeps every other premise reachable later.

1. **S1. Premise axis with four human-compatible hooks, plus the leak fix.** Add a `premise` axis to the Village start world with tagged layers built from H1-H6: an egg left in your pack (PK1 with a sealed truth ID), a household that mistakes you for their missing relative (MI, PY5), a reputation that ran ahead of you (PC5), and a pet that is more than it seems (PK2). Fix [main.js:8467](../../src/main.js) so unknown axes don't print their layer IDs first. Done when the probe rolls each hook, a test proves sealed strings are absent from DOM and life record, and a rebuilt 1366x768 browser check shows the card.
2. **S2. Minimal belief ledger as a pure module.** One record shape for "who believes what about whom, with what basis and confidence, and the truth ID," seeded by the premise layer and read by the people view. Reconcile with override-module knowledge rather than adding a third store. Persistence waits for a save decision.
3. **S3. Irony view for public premises.** "Mira believes: you are her nephew" lines in the people view when the belief contradicts something the player knows; sealed truths never shown. Delivers the visible comedy (PC1) with little machinery.
4. **S4. Tells and an exposure clock.** Each hidden premise emits tells on game-time thresholds; one NPC with high attention (a child or the elder) notices first (PS2). The exposure number is derived, not stored.
5. **S5. One payoff seed on V3.** A single conditional event (the relative's real kin arrives, or the egg hatches) gated on belief state, with an `alternatives` fallback when the actor is gone. First real gameplay consumer of the override module.

## Checks run

Source reads of the files cited above; grep of `src/` for knowledge, belief, kin, trait and override terms; web metadata searches by three lanes; a built-in browser pass on TikTok (failed, sign-in) and YouTube (one search worked, one never rendered). No build, tests, gameplay changes, downloads or purchases.
