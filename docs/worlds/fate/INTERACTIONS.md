# Fate / TYPE-MOON interaction proposals

Status: **Develop/Research proposals only.** These rows specify what a future implementation should keep distinct; none claims a native YAIRPG consumer exists. Evidence boundaries are in [SOURCE_LEDGER](SOURCE_LEDGER.md).

| ID | Interaction proposal | Valid combination / observable result | Boundary and useful countercase |
|---|---|---|---|
| `FT-X01` | Circuit + Foundation + formula + command + energy | A compatible magus executes the supported Mystery and spends the correct source. | A circuit alone is not the formula, Foundation access, teacher, or unlimited energy. |
| `FT-X02` | Master authority + Servant contract + deliverable order | A specific order uses its authority carrier and has a source-supported chance/effect. | Broad order, interrupted speech/carrier, high energy demand, or refusal may change outcome. |
| `FT-X03` | Master + Magical Path + Servant upkeep | Energy sent over the actual path changes sustainment; cutoff has profile-specific consequences. | Independent Action, alternate sources, or recipient refusal can change supply. Loyalty is a separate state. |
| `FT-X04` | Heroic record + class vessel + instance | Summoning creates the selected version and a bounded class kit. | Does not reveal the complete record's power or unify all class appearances. |
| `FT-X05` | Catalyst + ritual + qualified participant | Catalyst can influence a summon according to the selected ritual. | A catalyst does not guarantee success, desired class, loyalty or exact identity. |
| `FT-X06` | NP identity + activation + true-name disclosure | A sourced activation delivers its documented effect and may expose an identity/counter. | A hidden true name is not blanket invulnerability; rank alone predicts no universal matchup. |
| `FT-X07` | Familiar + operator + sensory link + report route | An operator receives evidence only after the actual observation and communication path. | Destroying/interrupting carrier can block later reports; already-delivered evidence remains. |
| `FT-X08` | Mystic Code + operator + compatible effect | Item function works through the authored interface, charge and operator rules. | Custody does not equal compatibility, skill, permanent ownership of effect, or body transformation. |
| `FT-X09` | Tool or ordinary weapon + supernatural target | Apply only a sourced interaction rule for this branch, target and method. | A mundane label alone neither guarantees contact nor forbids it; don't use verse equalization silently. |
| `FT-X10` | Field / Foundation / bounded jurisdiction + local action | A local power has its evidenced strength while the field/infrastructure and route apply. | Outside jurisdiction the action can fail for a real rule; earned method remains owned and may resume on return. |
| `FT-X11` | Body + soul/source + injury or death | State each affected carrier and available recovery. | Healing body, repairing artifact, restoring soul/source and returning a dead person are different effects. |
| `FT-X12` | Contract + ordinary relationship | Keep formal authority, energy obligation, trust, affection, and hostility in separate axes. | Consuming authority does not automatically end a relationship or prove consent. |
| `FT-X13` | Knowledge + witness/report + interpretation | An actor may act on what was actually observed or credibly told, with uncertainty. | A character sheet, Clairvoyance, future knowledge or true-name insight is profile-specific. |
| `FT-X14` | Route branch + consequential intervention | Recheck downstream events for the selected live instance and retain actual changes. | A route menu is not a rewind; past-canon facts from another route are not this actor's knowledge. |
| `FT-X15` | Singularity / Lostbelt / loop / simulation | Apply the history mechanism of the selected event and retain its records by source-defined rule. | Pruned branch, simulated world, recurring loop and minor parallel interference are not synonyms. |
| `FT-X16` | Class rank / attributes / matchup trait | Compare only within the local evidenced framework. | Do not convert letter ranks into cross-franchise scores or treat a matchup counter as general weakness. |
| `FT-X17` | Church / Clock Tower / Chaldea / Moon Cell office | Institution confers only sourced access, duties, support or jurisdiction. | Reputation or title cannot grant a private power or rewrite another institution's jurisdiction. |
| `FT-X18` | Original vs remake Tsukihime rules | Keep profile version explicit through character, place, taxonomy and event interactions. | Shared name does not establish same mechanic, hierarchy, body or future. |

## Proposed interaction record

`Interaction(id, continuity, actor, sourceCarrier, method, trigger, target, range, costSource, jurisdiction, interruption, counter, observation, outcome, persistence, sourceLocator, confidence)` is a proposed authoring shape only. If a field is unknown, author the uncertainty; do not fill it from analogy.

## Branch and information handling

**[O-PROPOSAL]** A source event needs distinct records for event occurrence, observer knowledge, public interpretation, character belief, and branch-specific downstream effects. A public franchise reveal may appear as canon reference text; a changed or randomized result is stored only as a sealed slot ID until the discovery route fires. The discovery UI shows clues available to that actor, not the author-only catalog.
