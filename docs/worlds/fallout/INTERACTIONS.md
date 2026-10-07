# Fallout 4: conversations at the Water Line

Status: Develop/Research scene briefs r1, 2026-10-03. Speech, voice/schedules and branches are provisional `O`; final prose follows settled lore/mechanics and the shared writing gate. No runtime or authentic source dialogue.
Owners: [shared contract](../DIALOGUE_AND_INTERACTIONS.md), [campaign](CAMPAIGN.md), [brief](WORLD_BRIEF.md), [modules](MODULE_CATALOGUE.md), [ledger](SOURCE_LEDGER.md), [packet](IMPLEMENTATION_PACKET.md).
Five families cover ordinary testing, equipment demonstration, service claims, confidentiality and return. IDs are proposed author identities, not commands.
F2 supports maintained/modified equipment; F3 is a bounded logistics/exposure reference, not a selected Survival policy. F4 supplies faction anchors only.
FU1/FU2/FU3/FU5/FU6 leave named armor/fuel/therapy/companion/faction scripts unresolved. No canonical leader/companion speaks or joins here.

## People, means and voice

| Original person | Voice and practical stake |
|---|---|
| Mina Voss | Clipped diagnosis, dry humor; wants a viable bay, knows handled parts and invoices |
| Imani Price | Careful questions, readable uncertainty; finite tests/medicine and actual patients |
| Orren Pike | Blunt negotiator; protects transport control with hoist, crew and fixed armored means |
| Hana Bell | Specific about allotments and planting; has seeds, water rights and a lease |
| Edda Shaw | Warm in private, guarded about routes; two safe stops and one funded convoy |
| Vale Mercer | Polite buyer who reads every clause; credit, inspection tools and bounded authority |

Mina books one actual bay; Imani triages available tests/patients; Edda meets between actual freight legs, not at every player return.
Faction recognition uses a credential/witness under particular local terms. Clothing or imported technology does not identify intent or provenance.

## Compact reaction matrix

| Cue | Observer's supported reading and response |
|---|---|
| Attire | Imani asks a wet courier to keep the sample tray clean; a uniform suggests affiliation but needs authentication |
| Module | Mina sees mounted ram/guard and asks for a stop test; no hidden-core reading or automatic canonical model identification |
| Visible power | Orren sees a real heavy lift or defeated unit and revises immediate tactics; he cannot infer unlimited fuel or remote reach |
| Injury | Imani sees limp/shown wound or reads a disclosed test; radiation, ordinary injury and contamination remain different questions |
| Known history | Hana remembers delivered allotments; Edda remembers disclosed route exposure; neither knows unreported laboratory work |
| Relationship | Mina gives a known supplier a direct answer; unpaid accepted invoice remains due, affection does not mint spare parts |
| Location | Clean bay needs controlled samples; harbor witnesses can expose cargo movements that a private workshop conversation cannot |

A manual bypass mechanic earns credible work through gauges and repairs. A genuinely strong powered operator can remove the heavy obstruction without also proving clean water.
Result bindings: native local goods/currency, simulation knowledge/directed memories/custody/claims, paid jobs/sites and instance utility/access facts.
Read-only remarks never award parts, standing, medicine or new power. Unknown quotas/prices must be frozen in the campaign quote before implementation.

## 1. fallout.interaction.sample: a clean tray, a cloudy answer

Participants/place/time: player, Mina and Imani at the stopped pump/test bay, with an available measured-test or known batch slot.
Opening, Imani: “Put the sample here. The wrench can live on the other side of the line for once.”
Known evidence: observed cloudy water and actual readings; neither a bad batch nor author truth proves deliberate sabotage.
| Choice | Actual cost/condition | Distinct result and owner |
|---|---|---|
| Buy a diagnostic test | Actual charge, sample/container and Imani's time under displayed terms | Consumed diagnostic input and measured knowledge, even if cause stays unresolved |
| Run known certification work | Six-minute bay, actual charge/filter/seal/clean container | Two proposed allotments via work settlement; stock/capacity receipt |
| Ask what the reading means | Existing disclosed measurement and available explanation | “It tells us this sample failed. It has not confessed to a motive.” No free diagnosis |

Refusal/exit: decline the quote without debt; Imani says “Then keep it out of the drinking stock” only if the failure was actually measured.
Interruption: patient demand can close an unbooked slot; completed diagnostic charges cannot refund with later uninstalled parts.
Afterwards: share, sell or donate only actual certified allotments through a separate transfer; Hana learns receipt/donation, not secret tests.
Nonfarming/reload: new certification consumes a new batch and slot; revisiting a reading yields no allotments or interpretation upgrade.

## 2. fallout.interaction.rig: show me where it stops

Participants/place/time: player and Mina at a safe service bay; actual owned rig, source support and available test booking.
Opening, Mina: “Nice ram. Now show me the part that makes it stop being a nice ram.”
Known state: visible chassis/mounts, handled condition and a demonstrated load. Armor silhouette is not FU1/FU2 verification or piloting competence.
| Choice | Actual cost/condition | Distinct result and owner |
|---|---|---|
| Demonstrate powered lift/stop | Supported supply, control, actual safe load and booked test | Paid performance/condition evidence; no complete blueprint or hidden fuel disclosure |
| Use manual bypass tools | Actual gauge/winch/seals, learned repair and bay labor | Real narrow bypass work; stock/site and useful procedure result |
| Inspect or refit a handled part | Actual part custody, tools, labor and selected repair quote | Same specimen repaired/replaced; removed condition and ownership retained |

Mina refuses an unsupported mount: “That plate fits the advertisement. It does not fit these bolts.”
Exit/interruption: leave before booking freely; a stopped test preserves spent supply and observed failure, with untouched reservations handled by the selected job policy.
Afterwards: she can offer work within the tested envelope, including larger work for a stronger build; no instant sensor, combat rank or fusion recharge lesson.
Nonfarming/reload: return the same removed part once; repeated demonstration is paid new work, not repeat first-test standing.

## 3. fallout.interaction.claim: Orren's terms at the carrier

Participants/place/time: player, Orren and actual crew at the intake/carrier before the original funded survey/departure changes custody.
Opening, Orren: “I have the crew and the hoist. You may have a better idea. Tell me what arrives with it.”
Evidence/goals: he knows his invoice/claim and witnessed equipment; wants reliable controlled transport, not proof that the player is secretly weak.
| Choice | Actual cost/condition | Distinct result and owner |
|---|---|---|
| Accept joint reservation | Transfer actual service goods; available crew and explicit local obligation | Custody/stock and accepted service/access facts; unique valve result settles once |
| Offer technical bypass | Real seal/test inputs plus supported lift/repair | Paid job and alternate access, no joint debt invented |
| Refuse or dispute with evidence | No commitment; disclose actual invoice/measurement if chosen | Negotiation can fail; Orren continues only his funded survey/departure |

Threat/deescalation: a player who can actually reach/overpower the unit may offer withdrawal terms; Orren can yield, bargain or use his fixed crew under a separately selected conflict rule.
Poor-build response: “I will read the plan. I will not put three people under an untested beam.” A strong demonstrated lift changes that objection, not every obligation.
Exit/interruption: departing before acceptance creates no debt; after commitment the accepted goods/terms remain. Crew departure blocks stale acceptance rather than resetting it.
Afterwards: confiscation or violence is known to witnesses/report recipients only; Orren needs their leads to search, not the player's unseen loadout.
Nonfarming/reload: one valve claim, original occurrence/departure time and actual ownership persist; no second reward for switching routes.

## 4. fallout.interaction.discretion: the quiet cargo

Participants/place/time: player and Edda privately at an actual safe stop/harbor appointment, with a funded convoy and real crane/cargo access.
Opening, Edda: “The boxes need a ride. Their owners need fewer introductions.”
Known state: what Edda chooses to disclose, the actual terms and observable witnesses; hidden identities and canon faction plans stay absent.
| Choice | Actual cost/condition | Distinct result and owner |
|---|---|---|
| Buy or trade for crane access | Actual crane fee or paid repair work, lawful cargo rights | Service/currency or job receipt; separate confidentiality commitment if accepted |
| Use sufficient lifting | Supported body/rig reach, real fuel/time and cargo custody | Real transfer, possible witnessed movement; strength does not suppress witnesses |
| Decline secrecy terms | No new promise or spend | Edda selects another funded carrier; no universal faction hostility |

Edda refuses an indiscreet plan: “I asked for transport. A speech from the dock is a different service.”
Exit/interruption: stop talk freely; crane delay or a discovered witness changes available plans. Accepted disclosure/confidentiality outcomes require a real report channel and causal rule.
Afterwards: fulfilled quiet work can open one local trusted service; actual public exposure can close that route while leaving other faction services independent.
Nonfarming/reload: repeated assurances earn nothing; same accepted cargo cannot be delivered twice, and remembered privacy survives an outfit change.

## 5. fallout.interaction.return: water already accounted for

Participants/place/time: player with available Mina/Imani/Hana at actual pump/farm/bay after a supported return report or visit.
Opening, Hana after received supply: “The beans survived your grand departure. I credited the water, if that helps.”
| Choice | Actual cost/condition | Distinct result and owner |
|---|---|---|
| Ask about earlier allotments | Actual recipient/receipt and learned report | History projection, no new water, coins or regional standing |
| Make a new donation or supply order | Actual allotments/materials and recipient/storage capacity | New transfer/order receipt and specific memory; not blanket moral reputation |
| Repair a failed promise or request care | New paid stock/work or disclosed symptom/test and available supported treatment | Separate recovery job; old failure/input expenditure remains |

Mina after a known bad fitting: “I kept the broken one. Useful reminder. Also, still broken.”
Exit/interruption: a patient or unavailable supplier ends ordinary talk; accepted recovery keeps its costs/cancellation terms and cannot restore destroyed sites by a line.
Afterwards: an apology may restore discussion, not erase Edda's known exposure or replenish Imani's medicine. Filtering is not automatic bodily radiation removal.
Nonfarming/reload: earlier donation/valve remains settled; same transcript pays nothing, parts stay worn and fuel stays spent through same-instance return.

## Checkpoint and remaining gate

Owned file only; input four-owner group SHA256 `002ad647ea86546e014aed53e9f10395fb9088e641a2707981edaa009d8c06e9`, base `97c28efece4fd6248b6f075ad0c6927c3d0432df`.
Names/work/markers inherited from current local owners; these original scenes add no canon fuel/armor/medical claim or severe Survival selection.
Static results belong to [shared checkpoint](../DIALOGUE_AND_INTERACTIONS.md#owned-checkpoint-and-review); FU gates remain before exact canonical recipes/cameos.
Runtime gate: shared D1-D6, then measured/unknown-fault branches, paid lift/claim/refusal, confidentiality witnesses, repeated greeting and generated-save failure/reload.
No build/browser/save, smaller-model qualification, runtime implementation or human writing/balance acceptance is claimed.
