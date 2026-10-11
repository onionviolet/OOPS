# Findings and connected traces

Labels apply to each factual claim: **seen in data or code** means an inspected
resource definition, trigger or action; **seen in text** means a source's words,
including potentially mistaken testimony; **inferred** is interpretation.
A dialogue action proves a authored instruction, not native execution.
All S/T indices below are zero-based DLG state/transition indices. TLK means
`lang/en_US/dialog.tlk`, indexed by string reference. Private decoded files:
`~/.codex/research/planescape-torment/decoded/<resref>.DLG.json`. Original
DLGs are in `data/DLGFiles.bif`, with exact offsets/hashes in private receipts.
The review ledger in [COVERAGE](COVERAGE.md) bounds what these claims establish.

## F1 Death and return

**F1a, seen in data or code:** `AR0500.INI [nameless]` specifies destination
`ar0500`, point `[0543.1953]`, animation state35. `AR1201.INI` instead returns
to `ar1200`, point `[4457.1256]`, state35. `AR1800.INI` specifies a protagonist
destination in ar1800 and separate party destination ar1700. These are INI
resources in `data/inifiles.bif`, not user settings. `AR0202.INI [namelessvar]`
sets Mortuary alert globals. **Seen in text:** IESDP explains this section as
death-return routing, with the opening Mortuary slab as the fallback; it also
qualifies namelessvar initialization as apparent behavior. Do not turn its
qualified documentation into a native-code proof. [INI format](https://gibberlings3.github.io/iesdp/file_formats/ie_formats/ini_spawn.htm)

**F1b, seen in text:** Beamdog's manual section V describes ordinary death as
preserving items, stats and companions; death may reveal memories or abilities.
It also describes irreversible loss through extreme destruction, confinement,
insanity or overwhelming beings. **Inferred:** revival and continued agency
are distinct conditions. Exact native return HP, equipment retention and all
exception checks have not been recovered or exercised. [Manual](https://files.beamdog.com/files/PSTEE_Manual_en.pdf)

**F1c, seen in data or code:** `DDEATHAD T121/T136` increments `Death`, uses
fade/wait/fade, sets `Death_Lecture=2` and `CW_Suicide_Reason=1/2`, then enters
S48. **Seen in text:** the options present a self-killing demonstration to a
lecturer. This sequence contains no `Kill(Protagonist)` instruction. It is a
scripted conversation representation, not proof that every death uses the
same HP pipeline. **Inferred:** a surprising body property can overturn an
NPC's theory through a witnessed action.

**F1d, seen in data or code:** `DJOLMI T24/T26/T28` pays 1000/1500/2000 gold,
sets `Jolmi=4`, fades and returns to S10. T30 increments Death and adds TLK63981
as a journal entry. **Seen in text:** the entry records paid stabbing and her
disappointment. **Inferred:** immortality can be a service and a spectacle,
not only a penalty. This is a bounded authored deal; no infinite payment
exploit was demonstrated.

**F1e, seen in data or code:** `DDEIONS T220` sets
`Deionarra_Raise_Dead=1`, grants party XP1000 and applies
`SPECIAL_ADD_RAISE_DEAD` three times. **Seen in text:** its journal TLK66917
limits this acquired resurrection ability to traveling companions dying in
your presence. The spell's full effect pipeline was not decoded, so three
applications are not independently verified as three usable charges.

## F2 Amnesia is not a universal death tax

**F2a, seen in text:** `DDEIONS S25`, TLK791, proposes that repeated deaths
weaken thought and memory; `DINSCR6 S0`, TLK38107, contains an earlier record
of losing pieces of self with death. These are testimony and writing.

**F2b, seen in data or code:** `DNORDOM T363/T367` requires Death=1;
T364/T368 requires Death>1. They enter S115. **Seen in text:** the protagonist
corrects the proposed death/amnesia link and says memories have remained since
the Mortuary awakening. This is explicit contradictory source evidence, not
an analyst's reconciliation invented to fit the north star.

**F2c, seen in data or code:** `DTRANS T156/T157` gates a corresponding claim
by Death=1/>1; T158 sets `Trans_Know_Forget=1`. **Seen in text:** remembering
the adversary and its route makes repeated killing unable to erase the
current threat. **Inferred:** knowledge retention changes an enemy's available
strategy, not merely the player's XP.

## F3 Carriers of earlier lives

| ID | Label | Actual source behavior and locator |
|---|---|---|
| F3a | seen in text | Morte reads practical instructions on your back, including a journal and Pharod lead: `DMORTE S34`, TLK1117. S35 says the journal did not arrive with the body. Body record and loose document have different loss risks. |
| F3b | seen in text | The practical self claims authorship of the body instructions because journals can be lost: `DINCAR1 S61`, TLK63166. This is that self's account, not proof of every inscription's origin. |
| F3c | seen in data or code; seen in text | `P_JRNL S0/S13-S18` selects recognition based on P_Journal=0..5. The object hides a journal behind traps and an unread language. T4 permits an INT>8 route; T5 damages a low-INT user with HP>25. Discovery can hurt without ending the investigation. |
| F3d | seen in data or code; seen in text | `DFINNOTE S0` requires P_Journal=3; T0 records a journal entry, sound/fade and P_Journal=4. S1 describes recovering the Uyo language. `P_JRNL S16` then offers the readable object. The notes cue a latent language, rather than automatically importing all earlier knowledge. |
| F3e | seen in text | `P_JRNL S17/S27`, TLK46257/46297: the recovered author is unstable and describes killing a linguist to hide an identity. The player's own writing is neither a neutral guide nor automatically admirable. |
| F3f | seen in data or code; seen in text | `DF_SS_DE T35/T36` requires unrecovered Memory_Nameless_Legacy, distinguishes prior knowledge of the legacy, sets the memory flag, grants XP2000 and writes different journal text. Deionarra's recorded suggestion explains an earlier self's precautionary deposit. Records can supply motive as well as a destination. |
| F3g | seen in text | `DDAKKON S215`, TLK59287, describes service sworn until your death; S329/S330 ties the tattoo's old group to bondage. A forgotten promise still shapes somebody else's life. |
| F3h | seen in data or code; seen in text | `DDAKKON T1197` guards Memory_Shraktlor=0, sets it to1, grants XP6000 and writes TLK60191. Recollection questions whether saving Dak'kon really meant saving his blade. Recovery exposes a prior motive rather than simply restoring a heroic legend. |
| F3i | seen in data or code; seen in text | `DFELL T83/T84` needs OldArm1, prior Fell contact/work knowledge, and chooses partial/full translation at INT15. S53/S54 identify the arm; S56/S59 supply different certainty about the old companions. The preserved body part is evidence interpreted through an observer. |
| F3j | seen in text | `OLDARM1.ITM` identified description says it is your old arm and may unlock tattoos. `TTSILENT`, `TTWEEP`, `TTWASTIN`, `TTLOSTIN` descriptions connect recollection to an invoked reward and a continuing worn benefit. Effect opcodes and once-only behavior were not decoded; these are descriptions, not effect verification. |

## F4 Earlier selves can resist incorporation

**F4a, seen in text:** `DINCAR1 S14/S16/S19/S42/S49/S52/S53` presents
contending minds, threatened domination and the knowledge gained through
merging. These are preserved mental incarnations in a curated encounter,
not a general simulation that spawns an independent person on every death.

**F4b, seen in data or code:** practical-self T157 needs WIS>20;
T158 needs INT>20 and WIS<21. Both go to S52, then S53/T171 awards XP96000,
INT+1, WIS+1, FullHeal and removes that actor. Other routes remain in the
resource; these two are not claimed as the only solutions.

**F4c, seen in data or code:** paranoid-self `DINCAR2 T26` accepts either
INT>15 or P_Journal>3, with Uyo_Paranoid=0, to enter S23. Prior investigation
can substitute for an attribute on this branch. T76/T101 award XP64000,
STR+1, CON+1, heal and remove that actor. Different selves grant different
benefits; they are not interchangeable memory tokens.

**F4d, seen in data or code; seen in text:** `DINCAR3 T63` requires INT>16
and grants party XP96000 for pursuing the first-self question; T73 sets
Absorb_Real_Incarnation=1. T53-T58 award WIS+1, healing and XP32000 before
S25. S31-S35 give the first self's explanation of the original bargain.
**Inferred:** learning what a self represents is distinct from merely
absorbing a reward. Full branch reachability and repeat-award prevention
are not tested by this static pass.

## F5 A recovered name has downstream uses

**F5a, seen in data or code:** `BSPHERE S0` selects an unawakened inspection
at Absorb_Real_Incarnation=0; S2 selects the later one at1. From S4, T5
consumes BSphere, while T6 permits leaving it unopened. T8 grants XP2000000
and FullHealEx; T10 sets Know_Nameless_Name=1; T11 creates SymTorm.
**Seen in text:** S3-S8 portray the sphere as preserved pre-ritual moments,
opened through regret; S6-S7 recover the true name without printing it for
the player. Knowledge can be mechanically definite while text stays private.

**F5b, seen in data or code:** `DTRANS T207/T209/T216` requires
Know_Nameless_Name=1 and leads to S111; T212 pursues a noncombat claim against
the adversary. **Seen in text:** the recovered name grants knowledge of its
name too. **Inferred:** an obscure artifact route can change the terms of
a confrontation; it is not just an optional biography paragraph. The ending
cutscene and all final alternatives were not executed.

## F6 How the world treats an immortal

**F6a, seen in text:** `DDHALL S7/S14/S19/S24`, TLK844/878/901/929,
recognizes repeated arrivals, expects the collection cycle and says he
conceals the anomalous body from his faction. S22 calls the existence
unacceptable to that faction. Recognition is situated in a person's job
and beliefs, rather than uniform global hostility.

**F6b, seen in text:** `DRAVEL S23/S107-S117`, especially TLK51632/52048/52059,
attributes the condition to separated mortality, describes grave costs and
says death produces hostile shadows. `DDEIONS S67`, TLK63410, warns that
inside the Fortress death takes the closest living substitute. These are
lore explanations, not a decoded universal victim-selection algorithm.

**F6c, seen in data or code:** `AR1201.BCS CR blocks2/4,6/8,10/12,14/16`
(zero-based) tests Death<5, 5..9, 10..14, >=15 and sets progressively different
1201_Shadow globals. Paired variants inspect Dead_Truce. ACTION.IDS maps30
to SetGlobal; TRIGGER.IDS maps16436/16437 to GlobalGT/GlobalLT. **Inferred:**
this is an aggregate authored consequence of death history. It does not
prove persistent offscreen identities for each lore victim.

**F6d, seen in text:** `DTRANS S84/S89/S101` threatens confinement, wants
separation rather than mutual destruction, and demands memory loss.
**Inferred:** an immortal's enemy can attack access, memory and freedom
instead of trying to exhaust HP. Some threats are contradicted by the
current protagonist's retained-memory evidence in F2.

## F7 Alignment and identity change

**F7a, seen in data or code:** `DDEATHAD T142/T143` offers the same threat
as bluff or truth; the bluff changes Law by-1, the truthful threat changes
Good by-1. `DINCAR1 T79` similarly marks a merge bluff through a named
once-only Law decrement. Intention tags have state consequences.

**F7b, seen in data or code:** `D0202P T14-T19` awards positive Good for
regretting harm, while T20-T22 decrements Good for regretting not selling
companions. Options check the recorded Sell_<companion> event. Later
self-description reacts to actual history, not every imagined act.

**F7c, seen in data or code:** `DTRANS T1-T4` uses Good>-21 versus Good<-20
to choose different wording for concern about companions; party count
selects singular/plural. A hidden axis has a downstream text consumer.
Native conversion of Good/Law into all nine alignment categories remains
unrecovered. `ALIGNMNT.2DA` contains generic class restrictions, including
unavailable class families; table presence does not prove player availability.

**F7d, seen in data or code:** `DDAKKON T920/T1009/T1012` switches the
protagonist's class to Mage/Fighter through SetNamelessClass; it is not a
new lifetime transition. **Inferred:** identity can change during one
continuous playable life; class, recollection and ethics are separate axes.

## Unbiased readback

| ID | Label | Contradiction, weakness or missing fit |
|---|---|---|
| F8 | seen in text; inferred | F2's retained current memories contradict a blanket “every death resets knowledge” reading of F2a. Keep the historical loss and current exception distinct. |
| F9 | seen in data or code; inferred | F1c/F1d make death a demonstration and a paid service despite F6b's displaced deaths. That tension can support the story, but the audit cannot establish that the mechanical cost is evenly exposed to the player. |
| F10 | seen in text; inferred | F4 is an authored one-body identity story. It supplies no inspected evidence for births, heirs, procedural lifetimes, autonomous family inheritance or idle/offline simulation. It is not a blueprint for those whole systems. |
| F11 | seen in data or code; inferred | `CUBE T1/T7-T10/T28` assigns Law-1 once-only to playful arm-waving. Such coarse moral scoring can feel arbitrary; this is an analyst concern, not a surveyed complaint. YAIR need not adopt these moral categories. |
| F12 | seen in data or code; inferred | F4b and F3i reward high mental attributes with strong information or merge routes. F4c offers a journal alternative on one branch, so “all lore requires high INT/WIS” is false. Attribute-gated knowledge can still encourage optimization rather than the desired character fantasy. |
| F13 | seen in text; inferred | F3e's unstable journal and F6d's self-serving enemy undermine an omniscient Notebook. A player-facing record can preserve what a speaker said without endorsing it. |
| F14 | inferred | Large XP bursts in F4/F5 and the described retained tattoo bonuses in F3j may reward recollection more than ordinary routine. Balance quality and repetition safety cannot be judged without play; these numbers are not recommendations for YAIR. |

No player-consensus study was conducted. Sources inspected here show specific
mechanics and narrative claims, not how often players complain or which build
fixes an old complaint. No comparison ranking against other games is made.
