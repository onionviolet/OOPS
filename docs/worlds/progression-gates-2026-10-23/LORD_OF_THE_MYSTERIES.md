# Lord of the Mysteries: progression gate catalog (2026-10-23)

**Status: proposal.** A reuse-and-check world pass (WPR1, WPR2) applying [GTR5 and GTR6](../../PROGRESSION_GATE_RULES.md). Nothing here is an accepted decision, a standing priority or implemented gameplay, and no code was changed. Codes use the prefix LMG (gate rows), LMX (new gate shapes proposed as rule text), LMC (engine coverage), LMP (proposed per-world rows), LMA (absences), LMK (kept contradictions). Prefixes checked unused by `grep -rn "LMG\|LMX\|LMC\|LMP\|LMA\|LMK" docs` before writing (no hits outside this file).

Every default below is an engine proposal for a pack. The text shows only the cases cited. Defaults carry a dial and an in-world reason (WPR5, AD5, AD38).

## 0. Pass record (WPR1, WPR7)

| Field | Value |
|---|---|
| World, part | Lord of the Mysteries (first novel; the Circle of Inevitability sequel is outside the BRIEF boundary, so its rows are marked COI and kept apart). Part: progression gates and caps |
| Mode | Reuse and check. No source chapter was opened this pass |
| Edition | Chinese compilation, SHA-256 `6126274478a9...` (see [institutions pass](../LORD_OF_THE_MYSTERIES_INSTITUTIONS_ROLES_AND_SUBTLE_DETAILS_2026-10-23.md) section 1). English glosses are translation-dependent |
| Output owner | this file (new file: the GTL folder has no LOTM owner, WPR3). Link it from the world card and from [LOTM_SEER_SLICE_LAWS](../LOTM_SEER_SLICE_LAWS_2026-10-19.md) when accepted |
| Source words read | **0** from the novel (the ~30k-word allowance was not used; no named gap needed a reread). Reader notes read: `readers-2026-10-10/LOTM_RULES.md` (4,638 words), deep dive (sections 1, 4, 6, 8), wiki cross-check (sections 2 to 4), the institutions pass (all), LTS1 to LTS14, REFINEMENT_CASES, the engine files below |
| Invocations | 0 subagents; one coordinator (sonnet) |
| Locators | All inherited from the reader notes and the institutions pass. Reader format `NNNN` is EPUB member `lotm_c_NNNN`; institutions format `[serial pN]`. I reopened none of them. "R" = reader-reported, "V" = verified by the institutions pass spot-check, "W" = a reviewed owner, "COI" = Circle of Inevitability, outside the first-novel boundary |
| Sealed secrets (WPR8) | None met or needed. Where the institutions pass tags a row [S], this file refers to it by that ID only (F20, F21) |
| Review state (WPR21) | Drafted from saved owners; engine citations opened at current line numbers. Another session is editing `src/book_world_lotm_*.js`, so line numbers can drift |

Gate kinds are GTR3: capacity, knowledge, credential, resource, maturation, world state, social, law, presentation. Overflow vocabulary is GTR16: lost, banked, converted, spill, pressure.

## 1. The gate catalog (GTR5)

Row shape: **reads** (the fact checked) and **enforced by**; **default / dial / reason**; **routes past it and cost** (GTR4, GTR6); **failure and overflow** (GTR16, GTR21); **visibility** (GTR10, GTR15, GTR24); **label and locator**.

### 1.1 Potion access: formula, ingredients, conservation

| Code | Gate (kind) | Reads / enforced by | Default / dial / reason | Routes past and cost | Failure and overflow | Visibility | Label, locator |
|---|---|---|---|---|---|---|---|
| LMG1 | Formula knowledge (knowledge) | A held formula: main plus auxiliary ingredients, amounts and order. Enforced by the brewing itself and by whoever sells or issues the formula | Default: a formula is known before a dose can be brewed. Dial: how many formulas a world makes findable per Sequence. Reason: formulas are rare and hard to verify (a normal Seq 6 formula is under 2,000 pounds; Psychology Alchemists asked 3,000) | Church issue after merit and assessment (cost: waiting, oaths, attention); black-market purchase (premium over 50%); divining a characteristic for its formula (`0374`; cost: spirituality, rank limit on what can be divined); a dead Beyonder's relic as "a potion without auxiliaries" | A wrong or forged formula wastes the brew or harms: "a ruined brew is hard to extract again" (`0461`). Overflow: a surplus formula is held, not consumed | Known to the holder; a buyer cannot read a forgery without a verifier (F10, F13) | stated(Hanged Man) [459 p26-p31] V; shown `0132` price list R; stated `0374` R |
| LMG2 | Ingredient access (resource) | The main ingredient (a creature part or a same-pathway characteristic) plus auxiliaries. Enforced by market, church stores and the brewer's skill | Default: ingredients are bought, issued or looted. Dial: price band and premium by Sequence (Seq 8 materials about 300, Seq 7 500 to 700, Seq 6 1,500 or more each). Reason: scarcity rises with Sequence; the order lacks stock (F13, F15) | The main material may be swapped for a same-pathway characteristic (`0142`, `0214`); church stores (cost: rank and merit); an artisan can turn a characteristic into a mask or tool instead (`0526`, cost: 1,000 pounds crafting) | Spoiled or mis-measured brew: loss of the materials. Overflow: spare materials are held and keep value; precise order matters (`0461`) | Prices are visible on boards; purity is not | stated `0132`, `0278`, `0302`, `0344`, `0405` R; stated `0526` R |
| LMG3 | Characteristic conservation (law) | A world ledger of characteristics per pathway. Enforced by the world; no actor | Default: characteristics are not destroyed (`0209`). A dead Beyonder leaves one, roughly a potion without auxiliaries (`0221`). Totals within a pathway are conserved: more high Sequences mean fewer low ones (`0220`). Dial: surplus slack, and how a world lets a characteristic be spent or shattered. Reason: the book states it as a law and uses it to explain plots | A shattered characteristic recombines as light motes and loses pollution (`0491`, inferred); a characteristic used as main material or crafted into an item is spent into the pathway's flow, not destroyed; a church vault, the black market or an outsider holds it (F12) | Overflow: **banked** in the world ledger, kept by default; an NPC death moves power to a killer, a vault or a market. Pressure: used characteristics carry imprint (LMG20) | The ledger is not visible; the player sees prices and rumor | stated(Dunn) `0209` V (cited as verified); stated `0220`; shown `0232`; inferred(Klein) `0491` |
| LMG4 | Convergence of like characteristics (law) | Same-pathway mass nearby (people, items, monsters). Enforced by the world | Default: like pulls like, stronger with rank, so a pathway keeps meeting its own. Dial: pull strength and range. Reason: the book gives it as the cause of recurring encounters (`0467`, `0444`; inferred for Amon `0903`) | Anti-divination and distance blunt the pull; a hidden holder of a strong mass can be found by it (cost: attention drawn) | Pressure rather than block: it raises encounter weight and does not refuse an action by default. Overflow: n/a | Subtle; the character infers it from coincidence | stated `0467`, shown `0444` R, inferred(Klein) `0903` |
| LMG5 | Pathway lock-in and switching (law) | Count of pathways whose potion the body has taken. Enforced by the potion's own residual spirit | Default: one pathway per life. A first switch to a fitting-rank potion gives hybrid distorted powers and a half-mad state, once; after that any potion causes outright loss (stated, Dunn). Dial: switch ladder length, the severity of half-mad, and special methods that clear it. Reason: spirit cannot hold two sources | Neighbor swap at Seq 4 (LMG15); a forced switch in COI (`C0864`); a hidden method from a god or a special item; all with ongoing cost | Failure: half-mad, no further advancement, then loss. Overflow: n/a (a counter, not a bank) | The counter is stated by a church officer; the half-mad state is felt | stated(Dunn) `0018`, `0033` V-by-reuse; COI `C0864` R |
| LMG6 | Order and tier skipping (law) | The Sequence of the potion against the digested Sequence | Default: drink the next Sequence up, once the last is digested. Dial: how hurried a drink is penalised. Reason: a too-high or out-of-order potion kills the spirit, overwrites personality or drives instant madness | A same-pathway characteristic as main material still sits at its own Sequence; no tier-skip route is shown | Loss of control (LMG11), terminal | Stated by officers; felt as a bad sign | stated(Dunn) `0018`; `0214` do not skip tiers R |

### 1.2 Digestion, advancement and loss of control

| Code | Gate (kind) | Reads / enforced by | Default / dial / reason | Routes past and cost | Failure and overflow | Visibility | Label, locator |
|---|---|---|---|---|---|---|---|
| LMG7 | Digestion by acting (maturation) | In-role acts matching the potion's hidden principles (about three per potion in COI, `C0301`). Enforced by the potion's residual spirit | Default: act the role, digest in about a month to half a year at low Sequence (Klein's Seq 9 took about one month); Seq 7 takes 6 months to 3 years even with the method (inferred); the shortcut holds at Seq 7 and below, with later potions taking years. Dial: act kinds, count and duration per pathway; a world may digest by time alone far slower. Reason: acting tunes body, mind and spirit to the potion's name (`0101`). Cost: role drift | Without the method: at least 3 years, then an exhaustion test (stated, Hanged Man `0093`); a quiet observing route (Spectator, `0299`); a chaotic fast route (Seq 9 to 5 in about six months, COI `C0653`); impersonating a real identity with feedback speeds it (inferred, `0529`) | Persona bleed and role reversal raise loss risk (`0603`, `0170`). Overflow: acts past digestion add nothing; proposed in LMP3 to convert into role steadiness | Felt: "you just know" (`0093`); a number only through outside help | stated `0093`, `0170`, `0451`, `0306`; shown `0299`; inferred `0529`, `0604`; COI `C0301`, `C0653` |
| LMG8 | Digestion feel (presentation) | The felt stage of the potion | Default: unsettled, settling, settled, in words. Dial: how fallible an outside assessor's reading is. Reason: readings can be wrong (rulebook 6) and the book says the Beyonder knows | A Psychiatrist, a divination or a church assessor can read it (cost: attention, risk of error) | Overflow: n/a | Words, not a bar | stated `0093`; shown `0101` |
| LMG9 | Church waiting rule and examination (credential + maturation) | Three years on the prior potion plus an examination by a senior deacon, even with merit. Enforced by the church: the captain refuses to push a candidate early | Default: wait three years and pass an examination; the formula and materials are handed over afterward. Dial: wait length and examiner rank by church and Sequence. Reason: residue from rushing is a stated cause of loss, and many lose control each year anyway | Acting shortens digestion (LMG7) but the church still gates the handover; outside routes (black market, club, a found formula) skip the church at their own cost | Failure: a hurried drink drives LMG11. Overflow: merit past the wait is held as favor, not converted to speed | Stated by the captain; the exam date is shown | stated(Dunn) [18 p56], [106 p55] V; [168 p8-p13] V; shown `0170` |
| LMG10 | Residue (maturation + pressure) | Undigested residue of the source creature. Enforced by the body | Default: advancing before shedding it piles up madness. Dial: how fast residue clears by acting, rest and anchors. Reason: stated cause 4 of loss of control | Acting; church stabilising rites; time | Overflow: **pressure** that rises with each rushed step; it feeds LMG11 | Pre-signs only | stated(Dunn) `0018`; stated(Old Neil) `0033` |
| LMG11 | Loss of control (law / pressure) | A risk budget over five causes: tier skipping, wrong-pathway or switched potion, rushed residue, temptation through heightened senses, plus imprint (inferred). Enforced by the body and spirit | Default: pre-signs first (hallucinations, persona bleed, whispers), reversible within about a week if the drain stops; full loss is terminal. Dial: pre-sign length, the share of each cause, and whether a lost Beyonder leaves a monster, materials, a sealed item or a characteristic. Reason: the book shows no probability, so numbers are balance choices (K7) | Near-loss recovery by ritual stabilisation (inferred, Klein; Dunn agrees); at demigod level a Spectator "psychologist" (`1405`); none shown for full loss | Terminal loss spawns loot for others (LMG3). Overflow: **pressure** through the pre-sign stage | Pre-signs are visible to the character; the budget is not | stated(Dunn) `0018`; shown `0165`, `0166`, `0167` (Old Neil); stated(Hanged Man) `0348`; stated `0205` |
| LMG12 | Spirituality and strain (capacity) | A pool for vision, rituals, divination and items; strain from overuse. Enforced by the body | Default: spirit vision costs the pool, causes headaches and hallucinations on overuse, and sleep restores it (Sleepers need none). Dial: capacity, per-use cost, recovery. Reason: shown costs (`0033`, `0040`) | Meditation lowers side effects (`0040`); item-based storage; some pathways do not sleep | Keeping spirituality dry for two days gives warning signs that fade within a week (`0348`). Overflow: recovery above capacity is **lost** (engine clamps), strain is **pressure** | Felt as symptoms | shown `0033`; stated `0348`; engine facts LTS5 to LTS7 |
| LMG13 | Mid-Sequence rituals, Seq 5 (world state) | A staged condition per promotion: sing with a mermaid at sea (Marionettist), buried in ice in absolute darkness (Priest of Light), drink under a full moon (Crimson Scholar), mythical-creature blood (Mystic) | Default: each Seq 5 promotion is a set-piece quest, not a roll. Dial: scale and a scaled-down shortcut (COI `C1048`, `C1126`). Reason: each ritual is a counterweight to the potion's corrosion of the spirit-thread (inferred, Klein `0684`); any similar sound or ability can substitute | A substitute counterweight of the same mechanism (GTR2); a church or secret order that stocks the rite | Interrupting wrongly gives backlash (`0086`). Overflow: n/a | Stated by the one who knows the rite | stated `0254`, `1020`, `1039`, `1041`; inferred `0684` |
| LMG14 | Seq 4 demigod threshold (capacity + law) | The body's step toward a mythical-creature form: a non-human mix of knowledge, divinity and symbols whose sight harms lower ranks (stated, Azik `0725`) | Default: from Seq 4, power comes with a form that must be hidden and a rising divinity tax; Seq 4 to 2 is gradual, only Seq 2 is a true creature. Dial: harm to onlookers, tolerance, which pathways differ. Reason: the Seq 5 to Seq 4 gap is qualitative: "a peculiar normal human" against "a divine creature" (`0604`) | Anchors (LMG16); partial transformation boosts power at a loss tendency (`0931`) | Failure: inability to retract the form is the demigod signature of loss (`0725`). Overflow: **pressure** (divinity) | Onlookers are harmed; the holder feels it | stated `0096`, `0725`, `0150`; shown `0931` |
| LMG15 | Seq 4 neighbour swap (law) | A neighbouring pathway on the swap table. Enforced by the potion | Default: past Seq 5, Seq 4 can be taken from one or two sister pathways; a non-neighbour is half-mad at best and ends advancement. Dial: which pathways neighbour (wiki table, wiki-only for some groups), and the swap point (Seq 4 or 3 for Fool, Error and Door). Reason: sister pathways share a group source (wiki section 3) | A special method for a non-neighbour (the book shows only the price); an outer-deity compatible pathway (wiki calls several risky) | Failure: half-mad, no advancement. Overflow: n/a | Stated by an archbishop | stated `0146`, `0222`; inferred `0214`; wiki cross-check section 3 (wiki-only for two groups) |
| LMG16 | Divinity and anchors (law + pressure) | A divinity meter that rises with accumulated characteristics; anchors (faith, worshippers, humanity habits). Enforced by the holder's own stability | Default: humans need a faith anchor by about Seq 2, dragons around Seq 3 or 4; gods preach partly to stabilise themselves; eating and hobbies preserve humanity (`1405`). Dial: anchor strength and meter slope. Reason: everyone carries a trace of the creator, which wakes as characteristics accumulate | Anchors: people, rites, a staged drama (`0975` for Trickmaster); each anchor is a social cost | Overflow: **pressure** rising with rank | Subtle dreams of light, an ocean and a cross | stated `0848`, `1405`; shown `0975` |
| LMG17 | Seq 2 and above: uniqueness and the seat (world state + law) | The pathway's Uniqueness and, in COI, all three Seq 1 characteristics; a held seat. Enforced by the world | Default: one Seq 0 per pathway, and no Seq 1 of that pathway exists while a god holds it. Dial: how a world lets a seat open or share. Reason: stated law, `0269`, `0449`, COI `C0889` | Seq 3 and Seq 2 rituals are authored set pieces: Ancient Scholar (cut yourself from the present 300 years, `1086`), Miracle Invoker (restore a lost history, `1204`, `1307`) | Overflow: n/a; a seat is occupied or empty | Public to those who know the god exists | stated `0269`, `0449`; shown `1086`, `1204`, `1307`, `1330` |
| LMG18 | Heredity (law + social) | A Beyonder parent's partial characteristic passes to children involuntarily | Default: Seq 6 and 5 parents pass part on; enough children can drop the parent a Sequence; a high-rank parent's child can be born at Seq 5. Dial: the pass rate. Reason: stated by the Hanged Man (`0451`) | Surplus beyond Seq 7 to 9 allows passing | Overflow: **spill** to the next generation, as a cost to the parent | The parent's decline is felt | stated `0451` |

### 1.3 Institutions, admission and ranks

| Code | Gate (kind) | Reads / enforced by | Default / dial / reason | Routes past and cost | Failure and overflow | Visibility | Label, locator |
|---|---|---|---|---|---|---|---|
| LMG19 | Church civil-staff contract (credential + social) | An offer with an answer window, a usual five-year term, lifetime secrecy, travel and registration limits. Enforced by the church tribunal, not a court | Default: a signed contract, not a potion. Dial: term, pay (2 pounds 10 soli weekly plus 10 soli allowance), secrecy scope, whether a recruit can be hired within a week (late book, F8). Reason: the church wants control and secrecy | Declining keeps the ordinary job; the address is revealed only after consent | Failure: leaks are judged by tribunal. Overflow: n/a | The terms are read before signing | stated(Dunn) [15 p57], [83 p61] V; [1355 p40-p47] R |
| LMG20 | Church rank record and field membership (credential) | A rank record held by the church: clerk by contract, formal member (4.5 pounds a week), captain, senior deacon (nine), archbishop (thirteen), pope | Default: rank is a church record with rights and duties. Dial: headcounts (Klein's hedged belief, X5), the pay scale. Reason: the church controls access to doses and sealed items by rank (GTR25) | An outside route skips the church (club, market) at its own cost | Failure: revocation, forged papers (GTR13, GTR25). Overflow: merit is held as favor | Public to members | stated(Dunn) [17 p79-p83], [168 p8-p13] V |
| LMG21 | Jurisdiction (law) | Worship first, then territory. Enforced by the church teams | Default: Nighthawks hold the north, west and Golden Plane; Mandated Punishers the docks, east and south; Machinery team the university area and outskirts. Dial: strength of the territory fallback; whether a royal body takes a mixed case over. Reason: churches avoid fights over a case | A vouch from the home warden (cost: his attention); a mobile elite unit crosses jurisdictions (WORLD.md r023, W) | Failure: the case escalates to headquarters. Overflow: n/a | Stated by the captain | stated(Dunn) [17 p79], [17 p83] V; stated [446 p18-p57] L |
| LMG22 | Secrecy oath and tribunal (law + social) | An oath before the church relic, and for one order a mind-binding net on the swearer (F20 [S]) | Default: leaks are judged by the church, not a court; witnesses to an incident sign secrecy agreements. Dial: scope and who can lift it. Reason: the churches know the acting method and hide it behind oaths (`0150`) | Becoming an angel does not clear the order's net (F20 [S]) | Failure: tribunal. Overflow: n/a | The oath terms are shown; the net is invisible to its bearer | stated `0150`; [524 p101] V; F20 [S] |
| LMG23 | Hidden knowledge of the acting method (knowledge) | Who has been told | Default: churches hold the method behind oaths; Silver City teaches it in classes with one warning, "remember you are acting" (`0160`); the Hidden Order openly has it (inferred `0144`); the Psychology Alchemists lack it (inferred) | A fast riser stumbles on it (`0150`) | Overflow: n/a | Hidden by rank | stated `0150`, `0160`; inferred `0144` |
| LMG24 | Dose release and assessment (credential) | Digestion judged by an assessor, then the next dose released from church stores | Default: merit, assessment, then handover (LMG9). Dial: who assesses (a senior deacon in the book; Warden Hale in the slice, authored, X3). Reason: a dose in hand grants nothing (LTS1) | Outside purchase skips the church | Failure: assessment refused; the dose stays unissued. Overflow: the released dose is held exactly once until drunk | The player is told the result | shown `0170`; LTS13; engine below |
| LMG25 | Sealed-artifact clearance (credential) | Grade, clearance and group size. Enforced by the cathedral | Default: grade 2 needs a bishop or captain, with three to five held at a central cathedral; grade 3 needs a group of three or more and formal-member clearance. Storage: behind the Chanis Gate in each cathedral basement. Dial: number held per cathedral, whether a team may carry them. Reason: danger grades; Nighthawks request one only for expected mid-Sequence targets (`0198`) | A team on a long chase carries local items (EF6); a Storm team took three for one fight (F3) | Failure: misuse. Overflow: n/a | The request form is shown | stated(Dunn) [19 p51] V; shown `0019`, `0198`; [524 p99] V |
| LMG26 | Sealed-artifact negative effects (law + pressure) | Scheduled, area-based effects with a contact rule and a handling method (gloves, darkness, range, grey-fog storage) | Default: the item carries a cost to its holder and bystanders. Examples: 3-0611 touch over 2 hours becomes permanent; 3-0217 self-triggers every 3 hours in light; the Sea God's Scepter freezes thought every 20 to 35 minutes within 600 m to 1 km and broadcasts prayers. Dial: effect size, interval, radius. Reason: sealed items are the remains of failed or mismanaged Beyonders and keep their wrongness | The handling methods cancel specific effects; a grey-fog store (Klein) | Overflow: **pressure** by schedule, area-limited | The record format shows number, grade, secrecy, method and appendix | shown `0165`, `0198`, `0563`, `0564`; wish machine F22 V for [1355 p14] |
| LMG27 | Characteristic imprint and pollution (pressure) | The dead owner's mental imprint, evil-god pollution | Default: a used characteristic adds imprint risk unless the user resembles the owner; polluted ones poison as materials. Dial: imprint strength. Reason: stated cause in L7 (inferred) | A similar person; a god-descent rite to remove pollution (cost: many lives); the destroy-and-recombine route (`0491`) | Overflow: **pressure** into LMG11 | Felt on use | shown `0357`, `0403`; inferred `0269`, `0491` |
| LMG28 | Tarot Club seat (social, credential) | A reply to the Fool's invitation and a code name. Enforced by the Fool | Default (COI-era structure): Minor Arcana are ordinary members reporting to a Major card; Majors are demigods; rewards are Traveler's Bags, sealed artifacts and formulas on credit; do not bother your patron with trivia. LOTM-era admission is invitation by the Fool, labelled **memory, not verified here**. Dial: seat count, who invites, reward cadence. Reason: a mutual-aid information club with a patron | Not applicable until a pack includes the Fool | Failure: favor drops. Overflow: favor is an unspent bank | Members see only what their card shows | COI_RULES 2.3: stated `0264`, `0265`, `0495`; first-novel admission: memory |
| LMG29 | Psychology Alchemists and other secret orders (social) | Contribution to research material | Default: no fee, members contribute and receive; a formula can be advanced against future contribution; item barter at equal value is accepted. Dial: contribution rate. Reason: a young order weak in stock (F6) | Barter | Failure: unclear | Terms are told to a candidate | stated [459 p31], [1358 p45-p60] V in part |
| LMG30 | Brokered trade and market access (social + resource) | A trusted middleman who holds money and item until verified; hooded attendees, anonymous boards, private rooms | Default: trades pass a broker with a stake in reputation; prices have a market band plus a premium; commission can be a percentage with a floor (15% on a floor of 3,500 pounds). Dial: premium, verification method (divination, test), broker cut. Reason: fraud and forged formulas | Direct barter at equal value; an informant is paid a share of a sale (F11) | Failure: fraud policed by the organizer. Overflow: n/a | Boards are visible; the price floor is shown | shown `0132`; [459 p32], [460 p76-p80], [460 p15-p19], [498 p75] V |
| LMG31 | Names, divination and attention (knowledge + law) | An honorific name addressed to a god; a divination target within the diviner's tier | Default: praying with a wrong, unknown or leaked name draws hostile attention; divination misleads, has rank limits and is blocked by anti-divination. Dial: how severe the attention. Reason: shown consequences (`0413`, `0440`, `0142`) | A safe addressee among the seven orthodox gods (`0049`); the grey fog blocks even a god-level look (`0232`) | Failure: hostile attention, a divination near-death (`0142`). Overflow: n/a | The character sees the outcome, not the cause | stated `0049`, `0413`, `0440`; shown `0142`, `0269` |
| LMG32 | Identity papers and travel (credential) | A certificate; a new identity costs money, papers and a custody arrangement | Default: papers about 8 pounds, third-class passage 4 pounds a leg, an ocean ticket needs an official identity certificate; old ties stay known to the church teams (F16, F25). Dial: document price and who vouches. Reason: the state controls passage | A circle that sells papers; entrusting assets to a third party | Failure: caught at a port. Overflow: n/a | A "papers needed" gate (F29, proposed surface) | stated [494 p20], [494 p53-p56] V |
| LMG33 | Outer-deity boons (social + law, COI) | A ritual petition to an outer deity | Default (COI): boons are graded 9 to 0 for convenience, kept only while the giver allows and pull you toward the giver's nature. Dial: revocation rule and the pull strength. Reason: a second power system beside potions | Not part of the first-novel boundary | Failure: loss of boon, corruption. Overflow: **pressure** | Felt | COI `C0060`, `C0037`; deep dive section 1 |

## 2. Where the engine already covers each gate (LMC)

Engine state as read now (line numbers are from `cat -n` at the time; another session is editing the LOTM files). The base fact: `src/progression_gates.js` (`defineGate` at 34 to 53, `evaluateGate` at 58 to 71) is imported by `chain_inspector.js`, `pledges.js`, `pledges_content.js` and `reveal_chain.js`, and by **no** `book_world_lotm_*.js` file (`grep -ln progression_gates src/*.js`). LOTM gates run as raw command `requires` rules in `book_world_lotm_actions.js`, not as GTR descriptors, so GTR27 treats them as live ad hoc gates (GTR9 keeps them as they are until a change touches them).

| Code | Covers | File and line | State |
|---|---|---|---|
| LMC1 | LMG1, LMG2 (formula and ingredients) | `book_world_lotm_actions.js:50-52` (accept reads `lotm.supplierDoses >= 1` and moves the dose from the supervisor); `:63` and `:64` (assessment releases one dose); `book_world_lotm_envelope.js:25-29` (each dose held exactly once) | Doses are pre-made and issued; no formula, ingredient, price or brewing exists. Covered as custody only |
| LMC2 | LMG3, LMG4 (characteristics, convergence) | none | **Absent.** No characteristic object, ledger or pull exists in `book_world_lotm_*.js` (grep for `characteristic` and `convergence` returns no code) |
| LMC3 | LMG5, LMG6 (switching, order) | `pathways.js:19-24` rows `switching`, `skippingSequence`, `wrongPotion` with `defaultBlock:true`; `actions.js:50` (accept blocked by `lotm.block.<id>.switching`), `:54` and `:66` (ingest and promote blocked by `wrongPotion`); `:134-140` the block facts; `state.js:55` (a save holding two pathways is valid only with `loc.switching`) | **Blocked, not priced.** The book prices switching as half-mad then loss; the slice refuses the step |
| LMC4 | LMG7, LMG8, LMG24 (digestion, assessment) | `actions.js:22-23` (`undigested` and `actGate` end acts once digested); `:58-61` acts add `book.lotm.acting`; `:62-64` assess requires `digestedFact` and spends 1 of the assessor's attention; `:65-67` promote requires assessed, digested and the held next dose; `book_world_lotm_ids.js:17` `LOTM_DIGEST_ACTS=6`; `:24` `LOTM_CC_ACTS=4`; `pathways.js:11-15` assessor rows with `sourceKind:'senior deacon'`; `path.js:23-25` felt state in words; `state.js:45-49` acting bounded by digestActs, assessment needs digestion | **Live.** Matches LTS11 to LTS13. Role drift, impersonation speed-up and time-only digestion are absent |
| LMC5 | LMG11 (loss of control) | `pathways.js:19-24` five cause rows, `temptation` has `defaultBlock:false` and `enforcedBy:'not modelled in this slice'`; `path.js:32-33` shows `lossOfControl` from `loc.*` flags; `state.js:53-55` validates them | **Record without producer.** No command in `actions.js` sets any `loc.*` flag (grep for `loc\.` finds only state, pathways and path). No risk budget, pre-sign stage or terminal stage runs |
| LMC6 | LMG12 (spirituality) | `ids.js:14` `LOTM_ENERGY` capacity 3, strain limit 6, per-use 1; `actions.js:19` `use()`; `:88-89` sleep recovers to capacity and cools strain over 120 minutes | **Live** for the Seer; the Corpse Collector row has no pool (`pathways.js:49-50`, `energy:false`) and spends supervisor attention instead |
| LMC7 | LMG13 to LMG18 (rituals, Seq 4+, swap, divinity, seat, heredity) | `path.js:15` (Seq 7 crossing with `fact:'never'`, "Not offered in this slice"), `:21-22` (`ceiling:2`, so `pathView` reports `capped`, `ascension_paths.js:53`) | **Capped at Sequence 8 by design.** Nothing above is modelled. The finished track says "Not offered", which is GTR22-compatible wording |
| LMC8 | LMG19 to LMG21 (contract, rank, jurisdiction) | `districts.js:14-32` three rows (team, church, `doseHere`, `vouch`, `shift`); `:42` `onShift`; `:44-48` district facts; `actions.js:95-99` vouched acts spend 1 or 2 of Hale's attention | **Live for jurisdiction.** No contract, no rank record, no pay; Hale is an authored stand-in (X3) |
| LMC9 | LMG22 to LMG23 (oath, method secrecy) | none | **Absent.** The slice has no oath or method-secrecy gate (the lesson at `actions.js:78-81` is granted by the supervisor) |
| LMC10 | LMG25, LMG26 (sealed items) | none in `book_world_lotm_*.js` (the repo's artifact and custody work is elsewhere) | **Absent** for LOTM |
| LMC11 | LMG28 to LMG30 (club, orders, trade) | none | **Absent** |
| LMC12 | LMG31 (divination limits, names) | `actions.js:33-36` findings text and the method row at `:107` ("presence only: no identity, safety or foresight"); LTS8 | **Live** for one bounded method; no names or attention |
| LMC13 | Cap overflow | `src/skill_overflow_domain.js:10-15` rows `base.frontier` (banked) and `default` (lost, stated); `:33` unlisted worlds return `Math.min(xp, cap)`; the LOTM world id is `book.lotm.tingen` (`ids.js:7`) | **No LOTM row.** Where a skill gain is capped in Tingen, the excess is lost with the default stated reason |
| LMC14 | Ceiling and capped | `ascension_paths.js:11` crossing types include `digest`, `recognition`, `ingest`; `:45-59` `pathView` with `capped`; `path.js:8-15` the ladder uses all three | **Live** and a good fit; only `quota`, `trial` and `bodyPoint` are unused by LOTM |

Verification state: source read at current line numbers; no build, test, browser or save run this pass. The two modules ran only as a scratchpad snippet (section 4, LMP5) that I executed once with `node`; that proves the descriptor shape loads, not that LOTM uses it.

## 3. Overflow behaviour by cap (GTR16, GTR21)

Today's behaviour is read from the engine; the proposal column is a default with a dial and an in-world reason.

| Code | Cap | Behaviour now | Proposed default (dial, reason) |
|---|---|---|---|
| LMP1 | Single-gain skill XP in the Tingen world (`skill_overflow_domain.js:10-15`) | Lost with the default stated reason | **Banked**, `limitLevels` 0.5, `drainRatio` 1. Reason: "A lesson settles over several sittings." Inert until a Tingen skill is read; the slice reads none today. Add the row to `SKILL_GAIN_OVERFLOW` when a skill path appears |
| LMP2 | Acts past the digestion count | Refused: `undigested` closes the act commands (`actions.js:22-23`) so no time or spirituality is spent | Keep as the default (refused, not spent), because the player is told the potion has settled. Dial: allow further acts to count toward the next potion's role steadiness |
| LMP3 | Digestion surplus (proposed) | none | **Converted** to a "role steadiness" bank that lowers role-drift pressure (LMG7). Dial: conversion rate; 0 turns it off. Reason: living the role beyond digestion still keeps the hands in character |
| LMP4 | Spirituality above capacity | Recovery clamps to capacity (`actions.js:89`) | **Lost**, stated: "Spirit mends only to its measure." Dial: a rested bonus for a good place. Strain above its limit is **pressure** (`ids.js:14` `strainLimit` 6) |
| LMP5 | A held but unused dose | Held exactly once until drunk (`envelope.js:27-28`) | **Banked** by custody; it grants nothing (LTS1). Dial: shelf life for an unsealed dose, with an in-world reason (spoilage, residue) |
| LMP6 | Characteristics beyond need | none | **Banked** in the world ledger or **converted** to material (LMG3); kept by default |
| LMP7 | Residue and divinity | none | **Pressure** into loss of control (LMG10, LMG11, LMG16); visible as pre-signs first |
| LMP8 | Finished Sequence track (Seq 8 in the slice) | `capped` and "Not offered in this slice" (`path.js:15`, `:21-22`) | GTR22 wording: say the track is held, progress toward Seq 7 is not tracked, and what would reopen it (a later slice or a ritual). Dial: per-world ceiling |

## 4. Proposed per-world rows (b)

All rows are proposals. Fact names follow the engine's `lotm.flag.*` and `lotm.<fact>` convention (LTS10).

### LMP5 Maturation row: digestion (GTR7 shared descriptor shape)

This descriptor loaded and evaluated under `node` as a scratchpad snippet (`defineGate` then `evaluateGate`, result `met:false` with the vague-or-known hint split). It is not wired to LOTM.

```js
defineGate({id:'lmg.seer.digestion', kind:'maturation',
 requires:{all:[
  {fact:'lotm.flag.stabilized', op:'eq', value:true, hint:'The potion still feels unsettled.'},
  {fact:'lotm.acting', op:'gte', value:{dial:'digestActs'}, hint:'The potion is not yet at home in you.'}]},
 reason:'A potion digests as you live the role its name hides.',
 dials:{digestActs:{default:6}},          // authored; the book gives months, not a count
 routes:[{id:'time_only', reason:'Without acting the residue still fades.', cost:'about three years, then an exhaustion test'},
         {id:'impersonation', reason:'Acting a real identity with feedback speeds it.', cost:'role drift and blown cover'}],
 closes:'persist',
 overflow:{policy:'pressure', reason:'Acts past digestion are refused, not spent.'}})
```

| Code | Row | Default | Dial | Reason |
|---|---|---|---|---|
| LMP9 | Seer digestion | 6 completed in-role acts (LTS11) | act kinds; count 4 to 8 | Klein's first Seq 9 took about a month; the count is a prototype |
| LMP10 | Corpse Collector digestion | 4 acts, supervised (`ids.js:24`) | count; supervised or solo | Quiet repeated handling of the dead |
| LMP11 | Time-only digestion | About 3 years of played time, then an exhaustion test | years; test difficulty | `0093`, `0018` |
| LMP12 | Digestion by quality | Progress per act scales with an in-role quality (impersonating a real identity higher) | quality weights | inferred `0529`; adds LMX4 |
| LMP13 | Waiting rule | 3 years on the prior potion before the church assessment, unless an assessor exempts for merit | wait length; exempt rank | [18 p56], [106 p55] |

### Admission rows (GTR25 credentials are records held by their institution)

| Code | Row | Reads | Default | Dial | Routes past (cost) |
|---|---|---|---|---|---|
| LMP14 | Civil-staff contract | Offer accepted inside its answer window | Signed contract, five-year term, secrecy, pay 2 pounds 10 soli plus 10 soli | term, pay, allowance, window | Decline and keep the clerk's job; none other shown |
| LMP15 | Formal membership | Church record plus a captain's sponsorship | Formal member at 4.5 pounds a week | headcount, pay | Stay a clerk; outside orders |
| LMP16 | Dose release | Digestion judged by an assessor; assessor attention spent | Hale prescreens (authored, X3) and releases one dose; a senior-deacon row may be added before release | assessor rank, attention cost | Black-market purchase (premium over 50%); club credit |
| LMP17 | Sealed-item request | Grade, applicant rank, group size | Grade 2 needs bishop or captain; grade 3 needs three or more and formal-member clearance | grade rules, items held | Local team items on a long chase |
| LMP18 | Tarot Club seat | Invitation by the Fool and a code | COI-era structure only; first-novel admission is memory | seats, favor cadence | n/a until a pack includes the Fool |
| LMP19 | Psychology Alchemists membership | Contribution record | No fee; formula advanced against future contribution; barter accepted | contribution rate | Barter at equal value |
| LMP20 | Papers and passage | Identity certificate | About 8 pounds for papers; ocean ticket needs the certificate | price, vouch | A circle selling papers |

## 5. New gate shapes GTR1 to GTR27 do not cover (LMX, proposed rule text)

GTR1 to GTR27 treat a gate as a rule that reads the actor's own means and either opens or does not. LOTM adds shapes where the thing read is a world total, the gate biases instead of blocks, or progress costs upkeep. Each rule is a default with a dial, a reason and a cost (WPR5).

| Code | Proposed rule (default) | Dial | In-world reason and cost | Why GTR does not cover it |
|---|---|---|---|---|
| LMX1 | **A conserved supply gate reads a world ledger, not the actor's stock.** A promotion consumes a slot from a per-pathway total that other actors, deaths and vaults also move; the gate's visible state is price and rumor, not the count. | Slack in the total; who may spend a slot; how a world lets a slot be created | Characteristics are not destroyed and totals within a pathway are conserved (LMG3). Cost: every kill, death and promotion has a counterparty | GTR1 reads "actual means" held by the actor and GTR3 lists `resource` as a cost paid; neither covers a shared total that moves |
| LMX2 | **A pull gate biases arrival instead of blocking.** Like characteristics raise the weight of encounters with their own pathway; it does not refuse an action by default. | Pull strength and range; anti-divination offsets | Convergence is the book's reason the plot keeps finding you (LMG4). Cost: attention that cannot be hidden | GTR gates open or close; none shifts what arrives |
| LMX3 | **A stage-reversible hazard.** A hazard has a pre-sign stage that is reversible inside a window if the drain stops, then a terminal stage; pre-signs pause risky automation so an idle player is not removed offline without warning. | Window length (about a week), which causes feed it, what a terminal loss leaves (monster, sealed item, characteristic) | Loss of control has five stated causes, visible pre-signs and recoverable near-loss (LMG11). Cost: the pause costs time | GTR14 covers one risky attempt with a failure ladder (GTR26), not a slow budget with a reversible window and an idle-safe pause |
| LMX4 | **A role-quality maturation gate.** Digestion advances with the quality of in-role acts, not time or a count; a role-drift counter pushes the other way. | Quality weights; drift slope; whether time alone digests at a much slower rate | Acting is the book's own method, and persona bleed raises loss risk (LMG7). Cost: a quiet life is slower, a chaotic one faster but riskier | GTR3 maturation is time, practice or growth; the in-role quality input and the opposing drift are new |
| LMX5 | **A fallible outside read.** Progress is felt by default; an outside assessor (a Psychiatrist, a divination, a church officer) can give a number that may be wrong, at a cost. | Error rate; cost per reading | Readings can be wrong (rulebook 6); the book says the Beyonder simply knows (LMG8). Cost: attention or money | GTR15 covers vague senses and exact bars, not a priced reading that can mislead |
| LMX6 | **An exclusive-commitment gate with a stated switch ladder.** The first potion closes the other pathways; the first switch is a one-time distorted state, the second is loss. | Ladder length; special methods that clear the state | A body holds one source (LMG5). Cost: the build choice is real | GTR13 closes a gate with a reason but does not model a gate that closes alternatives by commitment |
| LMX7 | **An upkeep gate.** A high rank holds while a maintenance reading is met (anchors, humanity habits, worship); the reading falls as rank rises. | Meter slope; anchor strength and kinds | Gods and demigods stabilise through worship and human habits (LMG16). Cost: social and daily-life upkeep | GTR13 closes a gate on an event; it does not tighten continuously with rank |
| LMX8 | **A singular-seat gate.** A seat is held by one actor; while held, adjacent tiers of that pathway are unavailable; opening requires displacing or outliving the holder. | Seat count per pathway; how a world lets a seat share | One Seq 0 per pathway; no Seq 1 while a god holds it (LMG17). Cost: a race with named rivals | GTR20 has NPCs meet the same gates; none models an exclusive occupied slot |
| LMX9 | **A holding gate with a scheduled cost and a neutraliser.** Possessing an item is permitted by clearance, and the item's effect fires on a schedule and radius; a handling method cancels a named effect. | Interval, radius, which methods cancel which effect | Sealed items keep the wrongness of what made them (LMG26). Cost: storage, range and tools | GTR gates admit or refuse an action; none charges for holding after the grant |
| LMX10 | **A dynastic transfer.** One actor's progression moves a portion to another (a child inherits part of a characteristic and the parent can drop a Sequence). | Pass rate; parent's loss | Heredity (LMG18). Cost: the parent's decline | GTR gates read one actor; this crosses two |

## 6. Honest absences (LMA) and unread parts

| Code | Absence | Where searched / state |
|---|---|---|
| LMA1 | No formulas above Seq 5 for most pathways (about 50 of 220 slots have full formulas) and no Seq 9 formula and material price | deep dive section 6 K2 and section 8; institutions pass section 9 ("no window found"). Searched by reader notes, not by me this pass |
| LMA2 | No probability for loss of control or ritual failure appears in the book | deep dive K7. All numbers in LMP rows are balance choices |
| LMA3 | The swap point for Fool, Error and Door (Seq 4 or 3) is unsettled; sefirah groups for Black Emperor, Justiciar, Mother and Moon come from the wiki only | deep dive section 8; wiki cross-check sections 2 and 3 |
| LMA4 | Tarot Club admission in the first novel is not documented in the saved owners I read; I wrote it as memory. COI_RULES 2.3 describes the COI-era structure | grep of `readers-2026-10-10`, `world-design-2026-10-11` and `census-2026-10-19` for "Tarot" found only COI-era rows and one design line that forbids assuming a Tarot invitation (DESIGN.md:46) |
| LMA5 | No engine path produces a loss-of-control record | LMC5: `loc.*` flags are validated and displayed but no command sets one |
| LMA6 | The slice has no brewing, formulas, market, characteristics, sealed items, club or rituals | LMC1, LMC2, LMC9 to LMC11 |
| LMA7 | Hospitals, banks, newspapers and mid-book markets were not read (institutions pass section 9) | institutions pass |
| LMA8 | R and L rows in the inherited pass are reader-reported or unreviewed worker notes; I did not reopen them | label column |
| LMA9 | Chinese compilation authenticity is unverified; English glosses vary (Mechanical Heart, Machinery Hivemind) | institutions pass section 1, X6 |
| LMA10 | No text search in the novel was run this pass, so "not found" claims are about the saved notes, not about the book (WPR23) | pass record |

## 7. Contradictions kept (WPR20)

| Code | Side A | Side B | Treatment |
|---|---|---|---|
| LMK1 | Acting digests in at most half a year at low Sequence, about one month for Klein (`0093`, `0170`) | Seq 7 takes 6 months to 3 years even with the method (inferred, `0306`); Daly took 3 years at Seq 7 (`0145`); church custom is 3 years plus assessment (`0018`, `0106`) | Keep both. The slice count of 6 is authored; the dial spans the range |
| LMK2 | Churches hide the acting method behind oaths (`0150`) | Silver City teaches it in common classes with one warning (`0160`) | Different institutions; keep as a dial on LMG23 |
| LMK3 | Switching is "once only" half-mad, then any potion kills (stated, Dunn) | A forced switch in COI (`C0864`) and a god-given hidden method exist | Default stays Dunn's ladder; exceptions need an in-world agent |
| LMK4 | Deep dive L8: neighbour swaps "normally at Seq 4" | Reader notes: "past Seq 5, Seq 4 can be taken from one or two sister pathways"; the wiki lists Seq 3 for some | Keep Seq 4 as the default, Seq 3 as a dial for Fool, Error and Door |
| LMK5 | A senior deacon examines (F9) | Slice has Warden Hale prescreen (X3) | Authored divergence, labelled |
| LMK6 | 13 archbishops and 9 senior deacons "answerable to the pope" (LOTM_RULES) | The line is Klein's hedged belief and does not say "answerable" (X5) | Headcounts stay a dial |

## 8. More to consider (WPR24)

**ACT NOW (done in this file):** the catalog, the coverage map, the overflow table, the LMX shapes, the absences and the kept contradictions.

**ACCOUNT FOR NOW:** the slice treats loss of control as a block, and the book treats it as a priced risk. Any promotion beyond Seq 8 should read LMX3 first. A character who stops at the ceiling needs GTR22 wording (LMP8).

**LATER/DELEGATE (level, effort, done check):**

| Item | Level | Effort | Done check |
|---|---|---|---|
| Wire one LMG row (digestion, LMP5) through `defineGate` and the inspector for the Seer, ad hoc code kept (GTR9, GTR27) | sonnet | small | Inspector lists the row; the focused LOTM test is unchanged |
| A loss-of-control pre-sign producer (LMX3) with a pause on risky automation | designer plus sonnet | medium | A stepped test walks pre-sign, recovery inside the window, and terminal loss; save, reload, import |
| Read the open windows in the institutions pass section 9 (Punishers, Psychology Alchemists terms, sealed-item operations) | haiku readers plus sonnet judge | medium | Rows get a V or stay L |
| A characteristic ledger (LMX1) as a world record | designer plus sonnet | large | One death moves a characteristic to a vault or market in a stepped test |

**Separate short suggestions (not reasons to stop):** put the districts' `vouch` rows through a GTR25 credential record when a rank record exists; name the engine's `defaultBlock` dial in the inspector so a world can set it false with an in-world reason.

## 9. Future pathway and authority design from lore discussions (2026-11-09)

**ACT NOW (done):** Bounded LOTM/COI K3 and WPR14 intake under WPR1–5,
WPR24 and WPR27. Read the two supplied discussions and questions 2, 3, 5,
8 and 10 of the linked Q&A archive, and checked the existing catalog and
runtime switching facts. No subagents or novel chapter reread. The official
English chapter 1386 preview does not expose the cited passage. The Q&A is a
community archive with Chinese transcription, screenshots and fan translation.
The findings below are future design proposals under AD5/AD38. Klein's
first-novel journey retains its order and ordinary starts retain their
low-spoiler boundary.

### ACCOUNT FOR NOW

**LMD1. Distinguish powers by what they act on and what remains.** The
[powers discussion](https://www.reddit.com/r/LordofTheMysteries/comments/1xqj15p/coi2_questions_about_powers/)
suggests this authored comparison. Give every method the same objective
(get out of a warded cell) and compare what a jailer can learn or do next.
The examples are test ideas whose exact feasibility needs the relevant scene,
Sequence, target and ward.

| Method | Proposed escape and consequence |
| --- | --- |
| Fooling | Fool the relevant history so an earlier free state applies now. A mundane lock inspection can still find a locked cell. A source-qualified historical check may uncover the discrepancy. |
| Grafting | Connect the threshold to a different destination. Trace or sever the connection. Anyone using the threshold while the link holds may be affected if the scope permits it. |
| Black Emperor | Exploit or distort the operative rule, such as how the ward recognizes an authorized release. Compare the ward's actual ruling with the original instruction. A rule independent of the altered ward may still hold. |
| Error | Exploit a mismatch in how the ward identifies its authorized actor. A second, independent identity check may close this particular opening. |

The comments disagree about which powers can create or exploit loopholes.
Keep overlap where the mechanism supports it. Treat the gap, altered rule,
changed relation or fooled fact as the thing the effect depends on. For the
first selected case, follow it through existing access, custody, witness and
investigation owners. Let evidence differ by observer and preserve any settled
consequences across expiration and reload.

**LMD2. Similar results can come from different means.** In the
[archived author Q&A](https://docs.google.com/document/u/0/d/10vx-jc_ZUe4tVSJNmE34kCdyVC_4hNnFNo-FSx5TLmY/mobilebasic),
Q3 allows Hanged Man flesh and bone manipulation to alter appearance with
less precision than Faceless. Q5 distinguishes a Mystery Pryer's technique
from domain authority and names analysis as a counter. Q10 describes a Fool
advantage in the Spirit World. In a future slice, test resemblance, what an
inspection can detect, and how the place affects the contest. Begin with the
ability, its source and its limits in that scene. A common effect label need
not confer the rest of a pathway's powers or a uniform strength ranking.

**LMD3. Model a transition as a specific attempt.** LMG5, LMG15, LMK3
and LMK4 preserve the in-world warning and the unresolved swap thresholds.
The [compatibility discussion](https://www.reddit.com/r/LordofTheMysteries/comments/1xpz26w/coi_end_compatible_pathways_canon_and/)
raises two useful checks: a shared symbol might matter to one operation more
than another, and a viable route into a pathway might be harder in reverse.
The Tail-Devourer example is a COI lead to verify against the text before
authoring a route. Start with the directed source and destination, Sequence,
operation, materials or patron, ritual and current stability. Distinguish
characteristic accommodation, a granted boon (LMG33), and Sefirah
accommodation. Separate what a character has been taught, what they can
attempt, and what the attempt costs or leaves behind. Retained abilities,
residue, convergence and recovery follow the qualified case. The fan
proposals for a continuous proximity scale and extra risk gradients among
neighbors are hypotheses. The Q&A's Q2 supports a specific high-tier
combination with consequences. The Fifth Pillar/reset idea remains fan
speculation.

### LATER / DELEGATE

| Reopen when | Level and effort | Done check |
| --- | --- | --- |
| An arc needs its first authority contest | Substantive design and implementation, medium for one scene | Qualify the book scene, compare two routes to one result, and verify distinct prerequisites, defenses, traces and settled aftermath after reload. |
| A selected arc or alternate life needs a switch or boon | Bounded source review then substantive implementation, medium for one transition | Locate primary evidence for that direction and Sequence. Exercise an ordinary promotion and the exceptional attempt with its specific cost, recovery and save/import behavior. |

## 10. Book checks on nested powers, grants and switches (2026-11-09)

**ACT NOW (done):** Book checks on LMD1–3. WPR4 evidence labels below.
Locators give the **displayed** English Webnovel chapter and, in parentheses,
the EPUB member number where it differs. See the [cross-series pass and
scope](../../research/LORE_EDGE_CASES_2026-11-09.md) for the wider intake.
These are inputs to future slices under TD2, AD5 and AD38.

### ACCOUNT FOR NOW

- **LMD4. A projection can summon more projections, with a real maintenance
  burden.** **Shown:** LOTM ch1165, *The Grand Lineup* (1185), has nested
  angel-level projections. **Inferred by Klein:** he might sustain this
  arrangement for less than ten seconds. The same paragraph explicitly
  considers the recursive self-summon and why this load changes it. For a
  future projection slice, trace the original caster, active controller,
  each dependent effect and the maintenance burden. Prove that a child can
  act, that adding one can shorten sustain, and what happens if parent
  support ends mid-action. The ten seconds is a scene estimate.
  [Nested projections discussion](https://www.reddit.com/r/LordofTheMysteries/comments/1cf5mpc/)
- **LMD5. Error can exploit the target's way of recognizing someone.**
  **Shown:** LOTM ch1386, *Narrow Path* (1412), uses resemblance across
  multiple signals to get a specific defense to accept an impostor. This
  closes the chapter-preview evidence gap in LMD1. The scene supports a
  particular recognition exploit. For a ward encounter, an independent
  check can matter if the power did not also compromise it. Keep actual
  identity, the ward's verdict and the witnesses' evidence distinct.
  [Powers discussion](https://www.reddit.com/r/LordofTheMysteries/comments/1xqj15p/coi2_questions_about_powers/)
- **LMD6. A boon has a delivery route, a recipient and an ongoing influence.**
  **Stated:** COI ch37, *Dangerous Forest* (039), distinguishes a gift from
  a characteristic and discusses bodily conflict and change. Ch61,
  *Description* (063), treats preparation, dose strength and the seal as
  consequential. **Attributed:** ch166, *In Return* (169), gives Lumian's
  explanation for his reduced susceptibility, including filtering,
  behavior and partial digestion. He generalizes from examples, so a
  universal list of boon side effects remains unproved. Track the source
  and route of the grant, its usable power, existing digestion and the
  resulting changes separately. A boon rank alone gives insufficient
  evidence for skipping the equivalent potion rungs or for what remains
  after withdrawal. Test both questions if the chosen scene needs them.
  [Boon-to-potion discussion](https://www.reddit.com/r/LordofTheMysteries/comments/1gi5uko/),
  [Boon side-effects discussion](https://www.reddit.com/r/LordofTheMysteries/comments/1xcei0a/coi_end_question_about_boons/)
- **LMD7. Switching changes more than the current label.** **Stated:** LOTM
  ch145 (149) establishes a high-Sequence exception to the early lesson.
  Ch1103, *Hint* (1119), names particular groups and ranks. Ch1168,
  *My Anchors* (1188), reports a failed attempt even though the destination
  is in a related group. COI ch392, *Switching Pathways* (396), gives
  Franca's reasoning about how old acting and bodily consequences affect
  the choice. Ch877, *Promised Matters* (883), distinguishes an eligible
  route from a route with the materials, ritual and help actually available
  under pressure. **Attributed:** ch488, *Mutual Provocation* (492), has
  Franca observe a combined effect and speculate about reproducing it.
  Preserve the acquired characteristic history and qualify retained or
  combined effects individually. Test a clean promotion, a viable switch
  with a real cost, and an otherwise plausible switch lacking its rite or
  support. Keep source availability and the character's knowledge separate.
  [Retained-powers discussion](https://www.reddit.com/r/LordofTheMysteries/comments/1fvuw8q/),
  [COI switching discussion](https://www.reddit.com/r/LordofTheMysteries/comments/1ocjnws/)

### LATER / DELEGATE

| Reopen at | Level and effort | Done check |
| --- | --- | --- |
| First projection sustaining a child effect | Runtime designer, medium | Reproduce one bounded stack, end support during a child action, save and reload the correct cost and consequences. |
| First switch or boon whose source changes | Source reviewer plus runtime designer, medium | Confirm precise rank and delivery case. Show which powers work now, which traces persist, and which prerequisites prevent the next step. Keep Tail-Devourer directionality and Sefirah combinations as distinct source questions. |

## 11. Fan rules, community gaps and pathway chart (2026-11-09)

**Act now (done).** Compared the supplied Pathways screenshot, indexed wiki
excerpts and community feedback with samples from the acquired English volumes.
The full Fandom page returned an access error. The screenshot shows the standard
pathway table, and indexed excerpts point to additional sections on neighboring
pathways and boons. See the [reference intake](../../research/LIBRARY_INDEX.md#implementation-references-2026-11-09).
This was a bounded source comparison under WPR4 and WPR24.

**Account for now.**

- **LMD8. Compare rank coverage with capability coverage.** The chart provides a
  roster and alias crosswalk for the standard pathways. Check the mechanics
  separately. The community review flags missing abilities, a disputed unlock
  rank, and limits on detection, damage and interruption. Some flags are already
  addressed in the held PDFs. Vol I pp. 77–78 names the three Psychiatrist
  techniques, Vol I p. 20 gives the Marionettist's damage interruption and
  object limitations, and Vol II p. 49 gives Savant perfect memory. The author
  said they planned a correction. The rules file is labeled 0.1 and the exact
  revision history of the volumes is unverified. Treat each comment as a lead
  tied to the edition and page reviewed.
  [Community review](https://www.reddit.com/r/LordofTheMysteries/comments/1xhuigb/v8_fan_project_ttrpg_the_fool_wanted_a_tabletop/)
- **LMD9. Keep the author view separate from the character's view.** A
  development crosswalk can use stable pathway and rank IDs with translation
  aliases. An ordinary start can show only what this character has learned or
  been told, with provenance where it matters. Keep the chapter locator and
  whether the evidence was shown, stated or inferred in the source record. The
  encyclopedia and wiki are leads for gaps in the standard table. For
  compatibility, boons and retained powers, use the particular book cases in
  LMD3 and LMD6–7 before authoring the operation.
  [Pathways wiki](https://lordofthemysteries.fandom.com/wiki/Pathways)
  · [Official encyclopedia](https://www.lomworld.com/handbook/en?categoryId=3)
- **LMD10. Verify an ability where the shortcut would break play.** For one
  selected early power, pair the ordinary use with a qualified counter or
  interrupted attempt. Record what happened, what each observer can tell, what
  the character paid, and whether the effect or its aftermath persists after
  reload. Separate a canon limit, an unresolved inference and a tabletop ruling
  before using any of them in a test. That carries forward the thread's
  distinction between giving a GM discretion and spelling out a repeatable
  rule. [Community discussion](https://www.reddit.com/r/LordofTheMysteries/comments/1xhuigb/v8_fan_project_ttrpg_the_fool_wanted_a_tabletop/)

**Later / delegate.** At the first selected ability flagged by the review,
run a bounded source check and one runtime comparison (medium effort). Done
when the book scene supports the unlock and scope, a plausible counter or
interruption changes the result, and reload preserves both cost and the
character's earned knowledge. Handle each further row when an arc needs it.

## 12. Early Seer and the first Blackthorn case (2026-11-09)

**ACT NOW (done).** Bounded WPR4/WPR24/WPR30 source and runtime audit. “First
case” here means the first civilian commission Klein takes after drinking the
Seer potion, Elliott Vickroy's kidnapping (displayed English ch42–44, EPUB
members 46–48). The pre-potion notebook investigation precedes it. The ch46
search is a nearby counterexample for dowsing, with its own case state. Read
the held English Webnovel text, the locally held Fandom snapshot (Abilities
revision 127676 and Divination Art 123606), and screened *Beyonders &
Mysteries* Pathways Vol I pp. 13–14. Wiki and fan claims below are attributed.
[Novel intake](../../research/LIBRARY_INDEX.md#prime-books)
· [Wiki abilities](https://lordofthemysteries.fandom.com/wiki/Fool_Pathway/Abilities)
· [Wiki divination](https://lordofthemysteries.fandom.com/wiki/Divination_Art)
· [Fan reference intake](../../research/LIBRARY_INDEX.md#implementation-references-2026-11-09)

| Capability | Novel evidence | Wiki and fan comparison | OOPS state |
|---|---|---|---|
| Learning and memory | **Stated** by Dunn, ch29 and 31, that the potion gives the capacity to learn divination and rites without supplying the knowledge. **Shown** ch32 that Klein enters Cogitation readily, then learns to see auras. **Stated in Klein's experience** ch40 that memory improves slightly. Neil says practice still matters. Ch43 shows a specific absence of memory that defeats a search. | **Wiki:** enhanced memory and learned methods agree. Its claim that memory improves during digestion reaches beyond this early check. **Fan:** immediate mastery of dream divination, dowsing and cards plus a generic difficulty bonus are tabletop choices. | Seer ingestion, steadying, pool, Cogitation and learned/real method gates exist in `book_world_lotm_be_seer.js` and `book_world_lotm_divination_method.js`. The case's dowsing does not use that gate. No separate memory stat is needed to play this case. |
| Spirit Vision | **Shown** ch32–33: auras, taught switch, exhaustion, rest. **Shown** ch43: count the auras through the obstruction and infer the shorter one is likely Elliott. The firearms information comes from Klee. | **Wiki:** perception of auras and spirits agrees. **Fan:** fixed radius and success thresholds for characteristics, curses, and thread following are tabletop rules. Ch43 does not establish those thresholds or capabilities. | A real vision condition, exhaustion and repeatable cast exist. The current `kj3u.floor3` act spends spirituality and emits the authored aura finding without reading or setting the vision condition. No target-scoped case observation consumes the switch here. |
| Dowsing Rod Seeking | **Shown** ch43: acquired clothes and worn amulet, cane and half-Cogitation produce a direction. Klein corrects the route and narrows the search on location. The amulet serves as the focus without clothes for a later reading. **Shown** ch46: a different search with portrait and clothing produces motion without usable direction. Interference is Klein's reading. | **Wiki:** differentiates forms of divination and cites the directional method. **Fan:** broad divination talent is a useful reminder, while fixed difficulty and success grades can make symbolic evidence too definite. | The current `kj3u.medium`, `dowse1`, `route` and `block` use authored facts and prose. They do not supply typed dowsing tool/contact/method facts to the real gate or produce a direction consumed by the route. `lotm_divination_rows.js` has a distinct obscured cane search for the ch46 scene, with a Ray/Riel English-name discrepancy to check at the binding. |
| Spiritual intuition and teamwork | **Shown** ch44: Klein barely resists Leonard's poem with spiritual perception and Cogitation, notices someone approaching before he knows who it is, and later reflects on spiritual perception without enhanced ordinary senses. His firearms practice supplies the response. | **Wiki:** distinguishes spiritual and ordinary senses. **Fan:** guaranteed threat warnings, reactive bonus and universal scene-trace reading are tabletop rules. No tested chapter here makes the approach cue disclose allegiance or give immunity to the poem. | Current `kj3v.poem`, `stairwell` and `shot` record fixed results. The rescue uses Leonard's authored actions and a narrated shot. The police report and commission are facts and notes here. They do not show an ammunition debit or a shared case handoff that consumes the observation. |

[Ch32, Spirit Vision](https://www.webnovel.com/book/lord-of-mysteries_11022733006234505/spirit-vision_31326423721503881)
· [Ch42, Butler Klee](https://www.webnovel.com/book/11022733006234505/31486397009422267/)
· [Ch43, Search](https://www.webnovel.com/book/11022733006234505/31486452592339902/)

**ACCOUNT FOR NOW.** The route is playable as authored content. The
[KJ3U search](../../gm/dispatch/refinement-audits-2026-10-31/KJ3U_IMPLEMENTATION_RECEIPT.md)
and [KJ3V rescue](../../gm/dispatch/refinement-audits-2026-10-31/KJ3V_IMPLEMENTATION_RECEIPT.md)
were browser-verified on B10 and scratch packs, including Export/Import and
reload. Static inspection of the current local private pack
`cast-reviewed-kj3av-41c38c0d9dd13f92` confirmed that the named acts still use
the authored effects in the table. The 54 focused source tests passed.
They cover the Seer seat, method sessions, divination suppliers and rows,
authority witnesses, records and Tingen deck. The current full case was
not replayed in a browser for this audit.

- **LMD11. First integration is evidence to action.** Reuse the learned/real
  method gate and case-owned observations. Let the obtained focus and
  learned technique produce a direction, then let the search consume it.
  At the door, record the aura count, Klein's inference, and the weapons
  report as distinct entries. The report that reaches Leonard or police
  follows the actual disclosure. Preserve case clock, tool and focus
  custody, and earned evidence on reload. The book gives no numeric
  dowsing cost. Treat any metering as calibration.
- **LMD12. Make different failed approaches legible.** No usable focus and
  an obscured reading have different recovery paths. The former can prompt
  a specific request to the client. The latter can prompt an independent
  check or qualified help if the scene offers one. The ch46 example supplies
  neighbor confirmation and a police handoff after the occult search stalls.
  GUMSHOE is a design reference for preserving a viable lead; the book does
  not establish a second proven rescue route for Elliott. Keep any new
  rescue alternative labeled as authored divergence.
- **LMD13. Keep the client's version of events separate.** Klee supplies
  contact material and a witness account, Leonard supplies field help, and
  Klein can make a factual police report under the security company's
  cover. A private perception, the explanation given to the client, and a
  public handoff can differ without changing what happened. Test who learns
  each fact. Urgency can change what the team does while Klein waits or
  leaves. A civilian variant can pass an actionable observation to the
  team without gaining occult knowledge or taking over Klein's case.

**LATER / DELEGATE.** At the next authorized pass on the case, medium
runtime effort for one authored stretch. Prove briefing → usable focus →
direction → corroboration → handoff from the earned route or named fixture.
Save before corroboration, reload, and finish once. Exercise missing focus
and exhausted vision, and preserve a specific next action when the case
supports one. Then use the ch46 obscured search to check that a result can
remain inconclusive without inventing a direction. Reopen the firearm,
custody and commission seams when the encounter or its aftermath needs
those systems to settle consequences. No new runtime behavior in this audit.

## 13. Elliott's search and handoff integration (2026-11-09)

**ACT NOW.** WPR24/WPR30 and AD38 implementation of the first evidence
chain from §12. This uses the existing Klein route and Wave 3 contracts.
The local cast pack, `private_packs/lotm-cast/cast.json`, keeps the authored
facts, reports and sequence. The private patch,
`private/elliott-case-2026-11-09/bind-case.mjs`, can be reapplied from the
repository root if that pack is regenerated.
The native catalog supplies two exact, non-consuming focus items.

- Klee's return gives one set of Elliott's clothes and his amulet. The
  first reading takes the learned dowsing method, live Seer source, the
  scene's cane and both held items. The native divination attempt records
  a signal and forward bearing. The carriage consumes that bearing.
  Later route steps use the amulet and the last bearing, narrowing toward
  the stairs and upper floor. No numeric charge was added for dowsing.
- The landing uses the existing Spirit Vision condition and one existing
  spirituality charge. It records an aura observation, a qualified
  inference, and a reference to Klee's separate account. The authored
  hold time uses the repeatable vision cast's existing 60-minute dial.
  Leonard receives the qualified spoken account when the existing
  co-located handoff and poem act settles. His record attributes it to
  Klein. The original observation stays with Klein.
- The original command IDs remain. Legacy completed acts can satisfy the
  new checks through their specific old receipt keys. New acts write
  different keys, so the old path cannot bypass an item or bearing check
  on a new run. The patch leaves final return of the focus items open.
  No general custody or new case save slice was added.

**ACCOUNT FOR NOW.**

- **LMD14.** Inventory is adequate for borrowed material within this
  sequence. If later play can stash, return, or transfer the focus,
  move its custody to the shared transfer owner and test that only the
  holder can use it. Reopening the case must not duplicate either piece.
- **LMD15.** The canonical search uses authored directions on a known
  route. A later case with multiple viable exits would test whether the
  shared inquiry and travel owners can carry a direction scoped to the
  location and observation time. Add a reusable contract only when that
  consumer needs it. A stale bearing should prompt a new reading, and an
  obscured reading should preserve the clue already obtained without
  making up a direction.
- **LMD16.** Preserve the report as a disclosed account with a recipient.
  A second recipient such as a constable can get a different, actionable
  account. Add a report-selection or sharing interface when the player can
  actually choose which observations to disclose. For this case the
  spoken handoff is fixed to the source sequence.

**LATER / DELEGATE.** Medium runtime effort for the next qualifying
consumer. Exercise the ch46 obscured result or a case that offers two
routes, with an interruption after a real signal and before delivery.
Done when the case keeps its prior evidence, pays any committed cost
once, and accurately shows which option remains open after reload.

**Verification.** Full private pack schema and lowering passed (1,313
place commands). Isolated `npm run build`, `check:arch`, `check:rules`
and 37 focused tests passed. The [browser regression](../../../tests/lotm_elliott_case_browser.mjs)
used the current canonical case rows in a named shortened entry after
the office briefing. At 1920×1080 it exercised both missing items, wrong
bearing, exhausted vision, reload during the search, literal Export and
Import before the handoff, and reload during and after the handoff. The
brief was published at settlement with no duplicate and no browser
errors. The settled desktop view passed the overflow check at 1920×1080
and 1536×864, at 14 and 21 px. Bundle SHA-256
`533a16a6b22ca07c09043775d4e1dd2913f1c0360f33dcbf8b1a32315ffc4f72`.
Evidence in `private/elliott-case-2026-11-09/browser-final/`. This proof
covers the selected case steps. A replay from the opening and historical
save imports were outside this proof.
