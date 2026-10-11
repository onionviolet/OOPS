# People: recruitment, provisional company and personal reactions

Second-pass source worker, 2026-10-08. Research only. The useful connection is that rescue, payment, trust and membership are separate authored steps. A rescued person can remain independent, travel provisionally, decide to join, or reject the person responsible for the captivity. Named recruits then carry individual voices into healing, injury and travel scenes.

## Evidence boundary

Locators below refer to private `~/.codex/research/kenshi/<file>.json`, whose rows preserve the named binary layer. `offset` is the decoded record's starting byte in the original file, not a JSON line number. Record IDs retain historical mod suffixes; those suffixes do not identify the file currently containing the row. All dialogue summaries are paraphrases. Raw data and prose remain private.

This is authored/static evidence, not a runtime test or a complete active-layer merge. Action, condition, event and personality numbers are decoded through the managed editor's `DialogActionEnum.cs`, `DialogConditionEnum.cs`, `EventTriggerEnum.cs`, `PersonalityTags.cs`, and `ComparisonEnum.cs`. `ConditionControl.cs:66,203–205` identifies `DC_HAS_TAG` values as `CharacterPerceptionTags_LongTerm`, allowing tag 5 to be identified as `LT_MY_CAPTOR`. `inputs/fcs.def:902` defines the first AI-contract reference value as hours; lines 3–4 describe contract-end dialogue delivery. Neither those editor descriptions nor a field name prove the native executor's exact timing, selection, atomicity or target resolution.

Base records commonly have flags `2147483650`, newly authored mod records `16`, patches `17`. They are retained as layer evidence, not silently flattened. In particular, chance fields are **not** reported as measured player-facing recruitment probabilities. No native executable, installed game or user save was exercised.

These findings extend first-pass F1–F5, rather than repeating the nobody origin, production chain, prison work schedule, mercenary hire contract or ruler world-state chain.

## Connected findings

### P-F1: Paid recruitment can retain an independent motive

Griffin's character row in `Dialogue.mod`, `19643-Dialogue.mod`, offset **1764865**, sets `unique=true` and points `dialogue` at `19345-Dialogue.mod` and `dialogue package player` at `50661-Dialogue.mod`. The recruitment root `19345-Dialogue.mod`, offset **5702441**, leads through `19346-Dialogue.mod` at **2451940**, `19347-Dialogue.mod` at **4999669**, and `19361-Dialogue.mod` at **3195951**. Their authored account presents a former holy soldier on a pilgrimage, seeking historical truth as a way to reduce his society's fear. This is his belief and reported history, not independently verified world history.

Payment is concrete: line `19364-Dialogue.mod`, offset **534461**, references condition `5007272-Dialogue.mod` with value **9000**, TAKE_MONEY effect `52065-Dialogue.mod` with value **9000**, and JOIN_SQUAD_FAST effect `52652-Dialogue.mod`. Those records are at **11889621**, **7040456**, and **7174603**; the condition fields are `condition name=2`, `compare by=2`, `who=1`, so the authored comparator is player money **more than** 9000. A second branch, `19372-Dialogue.mod` at **4127446**, still takes 9000 and joins after the player declines interest in his religious purpose. Hiring is therefore compatible with different motives. It does not prove a mission progress meter, future departure, or transaction rollback behavior.

### P-F2: Persuasion is a conversation about a recruit's interpretation of failure

Ruka, `Dialogue.mod` `19576-Dialogue.mod`, offset **4227633**, is unique and links her recruitment root `19540-Dialogue.mod` at **1477866**, personality `19578-Dialogue.mod` at **4282669**, and a distinct player dialogue package `19499-Dialogue.mod`. The personality record sets `tags always0=9`, mapped to BRAVE.

The chain from `19545-Dialogue.mod` at **3545416** asks about being outnumbered; `19553-Dialogue.mod` at **1197984** reports surviving a lost battle, being judged a deserter and having her horns cut. Responses about unfair treatment or surviving to fight again converge on `19557-Dialogue.mod` at **881722**, which offers company. Acceptance `19558-Dialogue.mod` at **5023083** calls `19560-Dialogue.mod` at **3772437**, `action name=3` (JOIN_SQUAD_WITH_EDIT). An alternate acceptance `19559-Dialogue.mod` at **989877** calls fast-join effect `52635-Dialogue.mod` at **7172733**. Contempt for her honor code reaches `19574-Dialogue.mod` at **4924008**, calling `51301-Dialogue.mod` at **6520835**, `action name=36` (LOCK_THIS_DIALOG).

Thus worldview choices and a marked body are connected to eligibility, acceptance and a conversation-closing branch. This is not evidence that dialogue permanently changes her personality. Rebirth's patch of `19557-Dialogue.mod` at **480210** changes wording, so the report retains the older branch structure without claiming a perfectly reconstructed final text merge.

### P-F3: A weak recruit has authored ambitions and traits, not just poor stats

`rebirth.mod` Beep, `57390-rebirth.mod` at **2215221**, sets `unique=true`, `combat stats=0`, `strength=0`, `stats randomise=0`, and links recruitment/player packages and personality `57391-rebirth.mod` at **2216203**. That personality has `tags always0=6`, `tags always1=1`, `tags always2=9`, mapped to DUMB, HONORABLE and BRAVE. These are authored tags, not a judgment of the character's worth or a demonstrated learning ceiling.

Root `57337-rebirth.mod` at **2199361** leads to exile account `57354-rebirth.mod` at **2204686**, rejection by his former community `57356-rebirth.mod` at **2205337**, newfound independent thinking and fear of pursuit `57359-rebirth.mod` at **2206308**, and a desire to stop fleeing `57360-rebirth.mod` at **2206773**. Acceptance `57366-rebirth.mod` at **2208747** calls `57367-rebirth.mod` at **2209092**, `action name=18` (JOIN_SQUAD_FAST), with no TAKE_MONEY effect on this branch. A response about his lack of skills converges back into this story. The character row and voiced aspiration support a nobody with a personal growth goal; they do not prove automatic growth from aspiration alone.

### P-F4: Buying freedom can produce a provisional escape relationship

`Dialogue.mod` tough NPC package `16151-Dialogue.mod`, offset **3203668**, binds root `54741-Dialogue.mod` to `dialogs` event value **51**, mapped to BOUGHT_ME_FROM_SLAVERY. That root at **7778835** offers personality-conditioned lines. For example, `54747-Dialogue.mod` at **7781862** expresses uncertainty about whether the buyer is freeing or owning the speaker; it references condition `54751-Dialogue.mod` at **7783893**, `condition name=26`, `tag=14` (MANIACAL), and gives a temporary ally effect through `54828-Dialogue.mod` at **7804989**, `action name=20`.

This line also starts `54826-Dialogue.mod` as an `AI contract` with values **[1,0,0]**, and changes AI to `5402-gamedata.base`. Contract record `54826-Dialogue.mod` at **7804526** points `contract end talk passive` at `54807-Dialogue.mod`, inherits from `40514-gamedata.base`, and has `Leader AI Goals` pointing at `5092-gamedata.base` with values `[0,24,0]`. The editor defines the contract as **one hour**. This is a provisional escape arrangement followed by a later decision, rather than an immediate permanent recruit. Exact native countdown, contract inheritance and unloaded delivery remain unverified. `change AI` is documented as a whole-squad change (`fcs.def:903`), so a YAIR proposal should not blindly copy that executor scope.

### P-F5: Independent departure, gratitude and membership are distinct outcomes

The above contract's endpoint `Dialogue.mod` `54807-Dialogue.mod`, offset **7781355**, contains departure and joining branches. Departure line `54808-Dialogue.mod` at **7780735** uses MANIACAL condition `54817-Dialogue.mod` at **7801640**, changes AI to solo escape `5402-gamedata.base`, and calls RUN_AWAY effect `54840-Dialogue.mod` at **7807358** (`action name=34`). Another refusal `54810-Dialogue.mod` at **7800041** uses TRAITOROUS condition `54812-Dialogue.mod` at **7779491** (`condition name=26`, `tag=2`) and continues to `54811-Dialogue.mod` at **7800560**, also changing AI and invoking run-away through `54849-Dialogue.mod`.

In contrast, `54823-Dialogue.mod` at **7803553** reaches protective allegiance line `54825-Dialogue.mod` at **7804163**, then JOIN_SQUAD_FAST `54847-Dialogue.mod` at **7808900**. It requires MANIACAL plus recruitability condition `62666-Dialogue.mod` at **9874113** (`condition name=77`). Rebirth patches the line's `chance permanent` from **75** to **50** at offset **569965**. Brave branch `54842-Dialogue.mod` at **7807468** routes to either recruitable join `54844-Dialogue.mod` at **7807984** or grateful independent exit `54846-Dialogue.mod` at **7808540**, which changes AI and calls a temporary ally action rather than a join action. These are authored post-escape decisions. They do **not** establish that already permanent player characters desert because loyalty decays.

### P-F6: The rescuer's earlier harm is remembered

The same `54741-Dialogue.mod` root includes `55391-Dialogue.mod` at **7961940**, a rejection by someone whom the supposed rescuer previously sold into captivity, and `55422-Dialogue.mod` at **7967891**, a rejection recalling capture and confinement. The first uses `55392-Dialogue.mod` at **7962597** and the second `55424-Dialogue.mod` at **7968586**. Both have `condition name=23`, `tag=5`, `who=1`, with reference value **1**. The editor's tag mapping identifies this as HAS_TAG, MY_CAPTOR. The sale branch additionally checks `55421-Dialogue.mod` at **7967721**, `condition name=59` (IS_SLAVE), `who=0`, value **1**.

These branches converge on refusal `55399-Dialogue.mod` at **7963787**. Friendly alternatives in this root carry corresponding MY_CAPTOR references with value **0**, for example `55394-Dialogue.mod` at **7962937**. Connected authored distinction: the person offering rescue → prior captor memory → gratitude branch eligibility → refusal. Native creation, storage lifetime and direction of that relationship tag are not traced here; the authored text and editor tag identity support the intended attribution, not an independently replayed exploit test.

### P-F7: A wounded fugitive may hide their status before accepting help

`Dialogue.mod` `42042-Dialogue.mod`, offset **5133954**, is an escaped holy slave encounter; its injury-conditioned lines unlock/interrupt into `42056-Dialogue.mod` at **2743194**. Injury branch `42046-Dialogue.mod` at **5737753** uses `42047-Dialogue.mod` at **2663069**, `condition name=27` (BROKEN_LEG), `who=0`, value **1**, and invokes FOLLOW_WHILE_TALKING through `42104-Dialogue.mod` at **4737176**. Equivalent branches test near knockout, arm and head damage.

The talk tree can accept help directly via `42058-Dialogue.mod` at **2714757**, effect `42077-Dialogue.mod` at **2222323**, JOIN_SQUAD_WITH_EDIT. Asking about injury leads to an evasive account `42062-Dialogue.mod` at **2993265** and then disclosure `42066-Dialogue.mod` at **3252711** of escaped slavery. Acceptance after disclosure calls the same join action via `42079-Dialogue.mod` at **4565645**. Condemnation can instead lead to RUN_AWAY `42111-Dialogue.mod` at **3497974** or ATTACK_CHASE_FOREVER `42114-Dialogue.mod` at **2692083**. Fearful/brave-associated condition branches are authored on those outcomes. Thus status disclosure changes a social decision and can turn a potential recruitment into flight or hostility. It does not prove an active player follower betrayal. Rebirth at **528295** changes this encounter's repetition limit from 3 to 4; the original `chance permanent=30` is a field, not a measured encounter rate.

### P-F8: An unlocked cage can recruit a nonverbal character and start a specific friendship scene

`rebirth.mod` Agnu character `97095-rebirth.mod` at **3007293** has `unique=true`, `dumb=true`, `strength=50`, and references recruit package `97094-rebirth.mod` at **3007077**. That package binds cage-join root `97204-rebirth.mod` at **3017909** to `dialogs` event **13**, UNLOCK_MY_CAGE_OR_SHACKLES.

Its unlocked line `97205-rebirth.mod` at **3018262** references condition `97209-rebirth.mod` at **3019224**, `condition name=63` (IS_IN_LOCKED_CAGE), value **0**. It reaches `97211-rebirth.mod` at **3019562**, then fast-join effect `97212-rebirth.mod` at **3019910**. The still-locked line instead uses `97210-rebirth.mod` at **3019393**, same condition, value **1**, without that join effect. Post-join interjection `97229-rebirth.mod` at **3024771** sets `interjection=true`, `speaker=3`, and `is character` to **Beep's specific ID**. The following exchange is a brief nonverbal greeting. The source supports a named-pair scene rather than interchangeable party chatter; it does not establish a simulated friendship score. `dumb=true` and its presentation should not be treated as a numeric intelligence stat without executor evidence.

### P-F9: A paid-freedom recruit can have a deliberately sparse voice

`Dialogue.mod` Ray's squad row `51799-Dialogue.mod` at **6983798** sets `malnourished=true` and links character `51800-Dialogue.mod` at **6984738**. The character is unique, carries SHACKLES, and points to package `53393-Dialogue.mod` at **7369916** for both NPC and player dialogue. The package binds root `53394-Dialogue.mod` at **7370125** to event **51**, BOUGHT_ME_FROM_SLAVERY. Its minimal acknowledgement line `53395-Dialogue.mod` at **7370443** directly calls `53396-Dialogue.mod` at **7370727**, `action name=18`, joining the squad. Rebirth patches Ray's `dumb` to **true** at offset **561712**, unlike the Dialogue layer's false value.

This is authored direct joining after the purchase event, distinct from the generic provisional contract. Neither a purchase price nor the seller's transfer mechanism was traced, so this finding must not supply a price or imply that every bought slave joins. Minimal speech is supported; an exact injury cause or complete inability to perform every kind of dialogue is not proven by this chain.

### P-F10: A recruit's worldview continues into bodily care without proven desertion

Griffin's player package `Dialogue.mod` `50661-Dialogue.mod`, offset **3006181**, binds `50662-Dialogue.mod` to event **19**, BEING_HEALED_START. That root at **2829657** has `repetition limit=2` and `chance temporary=50`. It includes `50703-Dialogue.mod` at **3633816**, SAME_RACE_AS_ME, target value **0**. Lines `50663-Dialogue.mod` at **2302687** and `50666-Dialogue.mod` at **559505** also restrict `target race` to skeleton `17946-stick_people.mod`.

Follow-up `50664-Dialogue.mod` at **4769419** expresses discomfort with a skeleton healer in terms of his old beliefs; `50667-Dialogue.mod` at **2949440** reaches reassurance `50669-Dialogue.mod` at **304192** through player condition `50700-Dialogue.mod` at **1992351**. This connects the recruitment motive in P-F1 to a recurring practical task and a particular caregiver. No leave-squad or attack effect occurs in this reviewed reassurance chain. A voiced objection therefore is not evidence of mechanical rejection of the treatment or loss of membership.

### P-F11: Replacing a limb can change social presentation as well as bodily capability

`rebirth.mod` `1533764-rebirth.mod`, offset **3793609**, selects Beep by `is character=57390-rebirth.mod` and includes `1533781-rebirth.mod` at **3798046**. That line has `repetition limit=5` and references `1533782-rebirth.mod` at **3798816**, `condition name=79` (HAS_ROBOT_LIMBS), `who=0`, value **1**. Follow-up `1533783-rebirth.mod` at **3798987** portrays him as enjoying improved bodily capability. The dialogue is perception, not a quantified stat buff.

Greeting line `1533819-rebirth.mod` at **3808864** uses robotic-limb condition `1533820-rebirth.mod` at **3809531**, then three skeleton `target race` IDs and additional talking-range/KO predicates. It portrays Beep as treating the prosthetic as a new shared identity; reply `1533821-rebirth.mod` at **3809702** is awkward acknowledgement. A different institutional reaction exists in `Dialogue.mod` `43346-Dialogue.mod` at **895178**, where target robotic-limb condition `97256-Dialogue.mod` at **11205272** gates hostile rhetoric and ATTACK_CHASE_FOREVER effect `43347-Dialogue.mod` at **4257462**. That latter line's full root/package was not traced, so it proves an authored gated hostility fragment, **not** that every prosthetic wearer is universally attacked. Injury, equipment, individual self-image and institutional prejudice need separate consumers.

## Small-touch proposals for vanilla YAIR

These are candidates for the coordinating GM, not accepted decisions or implementation instructions. Each could fit an existing encounter, NPC detail, center choice or event entry without changing the familiar opening. Avoid adding mandatory hunger, slavery, permanent death or a new loyalty economy merely to reproduce a source example.

| Code | Small touch | Source connection | Proposed vanilla-facing interaction |
|---|---|---|---|
| P-T1 | A paid follower keeps a different goal | P-F1 | The same hire result supports a friendly acknowledgement or a purely practical contract reply. |
| P-T2 | Ask for a discount and receive a characterful refusal | P-F1 | One optional reply explains why this recruit values the price; no hidden discount system needed. |
| P-T3 | A scar or missing status marker has a social history | P-F2 | Inspect an NPC's marked equipment/body detail before hearing the battle story. |
| P-T4 | Compatible worldview opens the offer | P-F2 | Two sincere replies can converge on the same recruit; mockery closes this encounter. |
| P-T5 | A low-skill recruit states what they want to learn | P-F3 | An NPC detail records an aspiration and later work reports can acknowledge relevant practice. |
| P-T6 | Safe passage precedes membership | P-F4 | Offer escort as a bounded encounter outcome before presenting permanent recruitment. |
| P-T7 | Grateful departure remains a successful rescue | P-F5 | A resolved aid encounter can yield thanks and independent departure, without treating it as failure. |
| P-T8 | The rescued person recognizes their former captor | P-F6 | Check a specific past harm fact before displaying a gratitude response. |
| P-T9 | A vulnerable stranger gives an evasive first account | P-F7 | The player can help first, ask gently, or insist on disclosure; preserve distinct dialogue outcomes. |
| P-T10 | Recruiting one person changes another person's reaction | P-F8 | A specific existing companion adds a brief greeting during the new NPC's arrival. |
| P-T11 | A quiet recruit communicates through gestures | P-F9 | Use a distinctive arrival/repair reaction rather than the same paragraph for every NPC. |
| P-T12 | A healer's identity matters to the patient | P-F10 | A treatment report can include discomfort and reassurance, while preserving the actual recovery result. |
| P-T13 | A new piece of equipment changes a character's self-image | P-F11 | One equipment-sensitive event celebrates a change and one acquaintance answers it. |
| P-T14 | Institutions and individuals interpret the same equipment differently | P-F11 | A lawful service's authored local restrictions differ from a companion's enthusiasm. |

## Limits and worker checkpoint

Coverage: connected traces for paid hire, persuasion, freed-cage recruitment, purchase-event recruitment, provisional escape decisions, named motives/tags, prior-captor memory, status disclosure, race-specific healing and prosthetic reactions. Four parsed databases were searched; the chosen evidence is primarily Dialogue and rebirth layers. Newwworld supplied no necessary additional recruitment chain in this bounded slice. Named recruit profiles are representative, not exhaustive.

Not established: a universal recruitment formula; exact current spawn/price probability; active-layer merge semantics; native candidate stat limits behind IS_RECRUITABLE; ordinary permanent-player-follower desertion, wages, loyalty loss, succession or faction schisms. NPC package EV_BETRAYAL bindings exist, but a label is not a traced trigger or evidence that permanent companions autonomously turn. The trace shows some potential recruits turn hostile after condemnation, and provisional companions depart. Those are the strongest supported leave/turn cases in this pass.

Source-only checks: each cited row was inspected in its named JSON file; enum identities and contract duration were checked against retained editor definitions. No src, build, saves, first-pass documents or commits were changed. File ownership is only this report. Integration belongs to the source GM; gameplay or playable acceptance is outside this dispatch.
