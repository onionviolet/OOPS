# Skyrim: conversations along the Lower Road

Status: Develop/Research scene briefs r1, 2026-10-03. Dialogue, voice and schedules are provisional `O`; final prose follows settled lore/mechanics and the shared writing gate. No runtime or authentic canon speech is claimed.
Read [shared contract](../DIALOGUE_AND_INTERACTIONS.md), [campaign](CAMPAIGN.md), [brief](WORLD_BRIEF.md), [modules](MODULE_CATALOGUE.md), [ledger](SOURCE_LEDGER.md) and [build packet](IMPLEMENTATION_PACKET.md).
Scope: five representative families across paid opening work, magical instruction, competing orders and later return. Scene IDs are proposed author identities only.
Source limits: S1b/S1c support destructive study/eligible enchantment and charge distinctions; S2 anchors Jorrvaskr/Vilkas/College existence. SU1/SU3 leave exact boot effects/spells unresolved.
No canonical character speaks here. A College reference establishes neither Orven's access nor a canon teacher's terms; direct cameos need scene-level source/era evidence.

## People, means and voice

| Original person | Voice and social stake |
|---|---|
| Runa Ironwake | Short practical jokes; protects haulers and yard solvency, offers her actual bench/stock |
| Serevyn Dal | Precise, gently impatient with vague claims; keeps treatment affordable with finite doses |
| Orven Vale | Careful about ownership and procedure; wants College access, has one pattern and finite Magicka |
| Odda Reed | Counts stock and paid shifts before promises; protects timber rights and kiln crew |
| Vela Dorn | Direct about exposure and people left behind; limited shelter, provisions and scouts |
| Teren Marr | Courteous when evidence helps his title claim; partial ledger and one financed survey |

Public yard contact occurs between actual shifts; an occupied bench or Orven escort/study closes competing bookings.
People know handled work, witnessed promises or supported reports. There is no universal “the yard knows” audience.

## Compact reaction matrix

| Cue | Observer's supported reading and response |
|---|---|
| Attire | Runa sees wet cheap boots and offers liner work; costly armor suggests weight/fit questions, not a College rank |
| Module | Orven recognizes a handled eligible specimen or a tested outfit; hidden enchantment details require inspection/known method |
| Visible power | Odda trusts a witnessed supported lift for that load; a stronger successful lift opens larger hauling discussion without revealing private reserves |
| Injury | Serevyn notices a shown scrape or reported pain, asks its cause and proposes only a supported available service |
| Known history | Runa distinguishes supplied cart, clean refusal and witnessed broken promise; unobserved archive work is absent |
| Relationship | Familiar supplier gets concise terms/warm greeting; familiarity does not erase wages, custody or another customer's booking |
| Location | Vela at the refuge discusses shelter stock; Runa at her bench discusses fitting, not remote troop locations |

An ordinary joiner can earn respect through sound braces. A strong work-caster can really exceed that load, but a good lift does not establish a dragon-safe convoy.
Authoritative bindings remain proposed: native local stock/currency, actor knowledge/completions, NPC-directed memories, site reservations and instance-world supply/access facts.
Each branch below names which binding changes; none writes another inventory, reputation meter or reward path.

## 1. skyrim.interaction.shift: counting the fittings

Participants/place/time: player, Runa and Odda at the yard/mill, during an available funded shift; sound timber rights and an actual bench slot required.
Opening, Runa: “If that nail is bent, put it in the bent tin. We have achieved two tins. Civilization.”
Evidence/goals: she sees the player's handled fitting; Odda knows posted mill terms and needs paid work finished, not an apprentice hero.
| Choice | Actual cost/condition | Distinct result and owner |
|---|---|---|
| Take the mill shift | Four played minutes, two stamina; Odda's funded shift available | Three proposed septims via work settlement; no unique shipment claim |
| Ask about a brace job | Inspect actual cart/stock; accept only a displayed timber/fittings/bench quote | Paid craft work can supply a brace; stock/site/craft receipt, not enchanting knowledge |
| Ask how stock is sorted | Available ordinary conversation, no spend | “Dry timber here. Hopeful timber outside.” Read-only explanation awards nothing |

Refusal/exit: “Another day, then. Leave the saw where you found it.” No shift accepted and no debt; closing paid work's pane does not cancel it.
Interruption: another booking or lost work access blocks acceptance; an accepted shift follows its frozen cancellation policy, without paying unfinished wages.
Afterwards/return: completed work earns a specific witnessed work memory only if that disclosure is authored; casual repeats use “Same two tins” and no new familiarity.
Nonfarming/reload: new funded shifts can pay for new labor; one old completion cannot pay twice, and a menu/reload creates no shift.

## 2. skyrim.interaction.supply: the cart leaves with whom?

Participants/place/time: Runa, available Orven, player and named hauler at the damaged cart during the original 24-minute public supply window.
Opening, Runa: “The cart can wait. The medicine on it is less philosophical.”
Known state: cart damage, heard prices and actual remaining offer time. Runa does not know the player's ring effect, ancestry or hidden casting capacity.
| Choice | Actual cost/condition | Distinct result and owner |
|---|---|---|
| Offer durable work boots | Completed eligible study/craft, actual boots; named hauler and loan consent | Custody loan and six-minute supported delivery; pattern/boots retained, shipment claim once |
| Hire Orven and keep the ring | Ten septims, owned recovery dose, six Orven Magicka and six-minute availability | Currency/item/energy/service receipts; same unique shipment, different retained property |
| Decline the delivery | No commitment or spend | Runa can fund her longer route; discoverable aftermath is instance supply state |

Orven, if unavailable: “I can teach or I can walk beside a cart. I have only the one afternoon.”
Exit/interruption: before acceptance no loan; after acceptance preserve actual custody, consumed service and frozen work terms. Loss of hauler/contact needs the shared interruption adapter.
Afterwards: Runa says “They came back with the soles attached. I counted” only after actual loan return; Orven cannot announce unseen boots research.
Nonfarming/reload: route switching after settlement rejects; sacrifice stays absent, loan stays held until matched return, and expiry never restarts at greeting.

## 3. skyrim.interaction.study: the ring is part of the price

Participants/place/time: player and Orven at a rented enchanter appointment; Orven is free, the specimen is legally owned and exact eligibility is declared.
Opening, Orven: “I can preserve the effect as knowledge. I cannot preserve the ring as a ring.”
Evidence: S1b/S1c, actual specimen/holder and demonstrated fit; the proposed hauling boots remain `O` pending SU1, not an alleged universal ring recipe.
| Choice | Actual cost/condition | Distinct result and owner |
|---|---|---|
| Accept destructive study | Two septims/two minutes and actual eligible ring; nonrefundable study | Ring consumed once, learned-pattern receipt; knowledge does not grant casting/body support |
| Keep the ring and ask service terms | No sacrifice; separate paid escort only through family 2 | Read-only quote then optional real contract; retained item unchanged |
| Craft known eligible boots later | Learned compatible effect, plain boots, filled gem, three septims/four minutes | Actual crafted item and paid inputs; untouched craft reservations refund only under that commitment |

Orven refuses a loaned specimen: “Your lender asked for a ring back. I intend to remain boring on that point.”
Exit/interruption: decline before study freely; stopping accepted study retains the destroyed ring/no completed lesson under its disclosed nonrefund rule.
Afterwards/return: “Bring a blank pair this time” requires actual learned-pattern completion; witnessing Orven's work alone remains observation.
Nonfarming/reload: no duplicate ring, gem or knowledge settlement; changing clothing cannot qualify an incompatible effect.

## 4. skyrim.interaction.orders: whose bench is it today?

Participants/place/time: Runa, Odda, player and actual customer representative at the yard when real civilian/militia bookings exceed capacity.
Opening, Odda: “A promise takes no room on a bench. The fifth promise has proved otherwise.”
Known evidence: posted orders, owned stock and buyer terms; Teren's unspoken strategy and distant military plans are absent.
| Choice | Actual cost/condition | Distinct result and owner |
|---|---|---|
| Fund dry-stock/capacity work | Actual timber, paid fitting and sheltered storage; phased project quote | Site capacity/stock and specific contributor memory, not instant completed depot |
| Prioritize a known customer | Actual control of own allocation and informed terms | Instance order/access changes; notified customer's directed memory |
| Let Runa choose | No new player contract | Her funded policy resolves orders; player learns only a later report |

Threat branch: demand Runa's bench by force only as a separately accepted conflict with actual reach/means; she can refuse and Vela cannot retaliate without a report and access.
Exit/interruption: negotiation may end without debt; an alarm stops uncommitted talk, while paid project reservations retain their selected terms.
Afterwards: Serevyn reacts to actual received/missed medicine, not an invisible menu choice. Apology opens discussion; replacing lost stock is separate paid compensation.
Nonfarming/reload: capacity is not granted by persuading twice; old grievance remains after repair, and no public reputation spreads without transmission.

## 5. skyrim.interaction.return: useful boots, inconvenient history

Participants/place/time: player with whichever actual Runa/Serevyn/Vela is available at their current known yard/refuge; same-instance return only.
Opening after fulfilled shipment, Runa: “You found us again. Good. I kept your measurements, not your place in the queue.”
| Choice | Actual cost/condition | Distinct result and owner |
|---|---|---|
| Recount fulfilled or refused work | Actual known receipt/refusal; no reward | Specific greeting/history projection; refusal is not default |
| Repair a missed accepted delivery | New sound stock, funded route and available partners under new quote | New recovery job/access; earlier broken promise and expired fee remain |
| Show injury or new load handling | Visible injury or paid supported demonstration; no private source disclosure | Serevyn/observer records only actual evidence; supported treatment/test separately costs means |

Vela, after a supported evacuation report: “We kept the people on this list. Do not ask the list to tell you about the others.”
Exit/interruption: a busy or lost person is not replaced by a counterpart; end an ordinary greeting freely, cancel any new paid job by its actual rule.
Afterwards: loan returned, stock burned, taught method and surviving people remain separate; no refund from a prior-generation visit.
Nonfarming/reload: read-only recollection pays nothing; compensation gets one receipt, old shipment remains settled, unchanged greeting adds no memory.

## Checkpoint and remaining gate

Owned file only; input four-owner group SHA256 `e9b3a069b0974f5fc2a44aa08fb5fde1c30a1999df8171aebb69e438ef6fc2da` at HEAD `97c28efece4fd6248b6f075ad0c6927c3d0432df`.
Local names/actions and S/SU markers are inherited from the live owners; voices/conditional lines are original drafts, not newly inspected source speech.
Six-file static review passed in [shared checkpoint](../DIALOGUE_AND_INTERACTIONS.md#owned-checkpoint-and-review). Source item/effect/cameo gates remain SU questions.
Runtime gate: D1-D6 shared adapters, then rebuilt branching/refusal/loan-return, consumed ring, repeated greeting and generated-save reload/storage-failure proof.
No unit/build/browser/save check, model trial, severe loss selection or human fiction/balance acceptance is claimed here.
