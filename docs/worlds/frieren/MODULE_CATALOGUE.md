# Frieren module catalogue proposal: magic as learned, local means

Every module, threshold, acquisition path and UI mapping here is a **proposal**. The wiki’s category names are not all official: "Spells", rev. 14938 explicitly says broad offense/defense/support categories are fan-made, while identifying Goddess magic and curses as exceptions.

## System rules and proposed engine shape

| ID | Source fact (title, revision) | Proposed state / consumer |
|---|---|---|
| FR-R1 | Spells consume user mana; can be recorded or conferred ("Spells", rev. 14938). | Per-actor mana reserve, known spell reference, execution conditions and actual cost; cast commits only after target/support validation. Cost numbers remain authored per spell. |
| FR-R2 | Mana concealment is trained and can deceive observers; Frieren and Fern have examples ("Frieren", rev. 14471; "Fern", rev. 14749; "Flamme", rev. 14594). | Separate true mana, presented signal, observer skill and observation context. Concealment is not invisibility or automatic success. |
| FR-R3 | Mana detection can be interrupted briefly by casting ("Frieren", rev. 14471). | Perception timeline with a brief cast window; duration is unknown, so no fixed implementation value is sourced. |
| FR-R4 | Human defenses improved after analysis of Zoltraak ("Beyond Journey’s End Arc", rev. 14281; "Timeline", rev. 14231). | Versioned public spell knowledge/counter coverage per region or institution. Do not globally change all NPCs from one discovery. |
| FR-R5 | Auserlese compares soul mana; a mistaken judgment risks reversal, and will can resist ("Aura", rev. 14618). | Explicit participants, comparison result, will resistance, contest risk and reversible control state. Tie rule/threshold remain unknown. |
| FR-R6 | Fearvelia creates a grimoire that grants instant learning, and Serie forgets the transferred spell ("Serie", rev. 14764). | Transaction moves a known spell from giver to grimoire/recipient; giver loses that knowledge. This is a specific method, not universal copying. |
| FR-R7 | Blue-Moon Weed magic required observing a real specimen before formulating the spell ("Turk Region", rev. 14484). | Observation record linked to target species and authored spell-learning prerequisite. Generalization to all spells is unsupported. |
| FR-R8 | Curse text describes effects defense spells cannot block and Goddess magic as dispeller; wiki also notes broad claims need exceptions ("Spells", rev. 14938). | Separate curse classification, detection, defense eligibility and dispel provider; validate exact curse instance. Do not assume every hostile magic is a curse. |
| FR-R9 | Stille exam required group capture and return with all members by sunset; escape bottle means failure ("First Class Mage Exam", rev. 14828). | Job contract with roster, deadline, objective, prohibited exit and failure state; stage-specific authoring rather than a reusable exam formula. |

## Proposed catalog at a glance

| Family | Coverage / neighbors | Proposed acquisition and cost | Conflict or limit |
|---|---|---|---|
| General mage spells | Offense, defense, utility, concealment, barriers, detection; neighbors: grimoires, tools, training | Study, teacher, practice, research; mana and time | Broad families are wiki/editor classification; spell-specific rules required ("Spells", rev. 14938). |
| Goddess magic / priestcraft | Healing, support, curse response | Scripture, priestly practice and blessing where sourced | Theological claims remain belief or attributed statement; exact activation costs often unknown ("Heiter", rev. 14835; "Goddess of Creation", rev. 14930). |
| Curses | Sleep, petrification, transformation, other authored outcomes | Encounter/source-specific; may need Goddess magic to dispel | Wiki generalization conflicts with scene-level examples; retain visible tension ("Spells", rev. 14938; "Laub Hills", rev. 7232). |
| Demon magic | Specialized combat, deception, curses, control | Individual practice and demon means; no universal demon kit | Demons read mana hierarchy; claimed social/cognitive rules are wiki summaries ("Demon", rev. 14737). |
| Warrior body and weapon | Strength, timing, endurance, weapon technique | Training, mentorship, equipment and risk | Technique costs/conditions often not given; no mana substitution ("Stark", rev. 14497; "Eisen", rev. 14925). |
| Knowledge transfer | Teaching, grimoires, institutional privilege, research | Time, access, a giver, or sacrifice | Serie’s transfer has a forget cost; do not erase it ("Serie", rev. 14764). |
| Ecology / fieldcraft | Flora, fauna, weather, venom, terrain | Observation, tools, local knowledge and preparation | Manga/anime ecology depiction differs; this pack uses manga-referenced facts only ("Ecology", rev. 14559). |
| Association qualification | Mage classes and exam | Prior qualification, team performance, proctor judgment | Exam is episodic and proctor-specific ("First Class Mage Exam", rev. 14828). |

## Proposed data model

`ActorMeans`: body, species, learned techniques, known spells, tools, sources, mana reserve, practiced control, language, records, relationships, status and local access. `SpellDefinition`: stable ID, source/version, user eligibility, target and observation requirements, activation, mana cost (unknown until authored), effect, duration, counter relations, learning routes and transfer semantics. `ManaObservation`: observer, target, time, presented signal, inferred result, confidence and concealment context. `PublicKnowledgeRevision`: source event, region/institution, known spell version, counter spread and actors actually reached. `CurseCase`: exact effect, perception, defenses tested and dispeller. `ExamContract`: stage, roster, objective, deadline, allowed means, prohibited exit, proctor and result.

Every field and record above is a **proposed authoring shape**, not an existing engine API. Unknown values must remain unknown rather than be filled with generic mana costs or ranges.

## Proposed progression and UI mapping

Show **heard of / observed / understood / practiced / executable here** as separate knowledge states. A grimoire is an owned source, not automatic mastery unless its authored transfer semantics say so. Mana bars are one resource display, not overall power. Exam rank is institutional access, not a universal ability scalar. Notebook entries identify the observer and whether a statement is rumor, inference or tested fact. All remain proposals pending a source-grounded runtime design.
