# SRD 5.2.1 first start

2026-10-14. `dnd.st2.srd521@1`, status **proposed**. Frozen research snapshot for ST2 at PS01, not a registered runtime start or an accepted setting branch. R5 continues [FIRST_SLICE A1](FIRST_SLICE.md#finite-next-units-and-acceptance). It qualifies one start, not ST1/ST3 or the complete three-start slice.

## Evidence and freeze

SHOWN means inspected source; INFERRED means an authored selection or ruling; UNKNOWN means unresolved. All character choices below are INFERRED selections within SHOWN SRD options. Only SRD 5.2.1 applies, without supplements, 5.1 rules or full-PHB-only options. A setting era does not choose an edition. Root trace: RB4, RB9, RB12, L1, A1-acc–A3-acc.

The canonical private text is `docs/research/tabletop-library-2026-10-14/private/text/dnd-srd-521.txt`, SHA-256 `4456eaa81743ed341c13f19d1d7ced344a6adcbb15367941875ee45cd3f2e562`. The 364-page PDF hash is `8974902d109d6e63672d7c490bde9ccf052410503d9cfa768237154fbc5e3d87`. Both were read locally; selected headings, not the whole book, were inspected. PDF and printed page numbers coincide here.

Exact private locators: [registry](../../gm/dispatch/rulebook-engine-2026-10-14/r5/private/LOCATORS.json), [selected-page text](../../gm/dispatch/rulebook-engine-2026-10-14/r5/private/SOURCE_EXCERPTS.md). `Lxx` below names a registry group with exact PDF pages and canonical text line ranges; the heading narrows the passage. The private [snapshot](../../gm/dispatch/rulebook-engine-2026-10-14/r5/private/START_SNAPSHOT.json) and [validation](../../gm/dispatch/rulebook-engine-2026-10-14/r5/private/VALIDATION.json) preserve arithmetic and hashes. Private links intentionally require the local research checkout.

Freeze means retain this revision and the selected values when the proposed start is instantiated. Later changes require `@2` and a stated compatibility choice. It does not mean the proposal is approved.

## ST2 at entry

| Field | Frozen selection | Source / classification |
|---|---|---|
| Identity | Adult human, age 22, Medium Humanoid, 5 feet 8 inches; itinerant student; Neutral Good | L02 pp19–22 origin/alignment; L06 p86 Human. Age, appearance and livelihood INFERRED, no canonical biography |
| Class | Wizard 1, XP 0, no subclass, no multiclass; proficiency bonus +2 | L02 p19 level/XP; L03 p77 Wizard table |
| Origin | Sage; +2 Intelligence, +1 Constitution; Magic Initiate (Wizard), casting ability Intelligence | L05 p83 Sage/background increases; L07 p87 feat |
| Scores | Standard array assigned STR 8, DEX 14, CON 13, INT 15, WIS 12, CHA 10; final **8, 14, 14, 17, 12, 10**; modifiers **−1, +2, +2, +3, +1, +0** | L02 pp20–22 character creation, L05 p83. No random draws |
| Skills | Sage: Arcana +5, History +5. Wizard: Investigation +5, Insight +3. Human Skillful: Perception +3 | L03 p77 class choices, L05 p83, L06 p86. Five distinct proficiencies; all others use their ability modifier |
| Saves | STR −1, DEX +2, CON +2, INT +5, WIS +3, CHA +0 | Wizard Intelligence/Wisdom saves, L03 p77 |
| Training | Simple weapons; no armor training; Calligrapher's Supplies proficiency. No Weaver's Tools proficiency | L03 p77, L05 p83, L12 pp93–94 tools |
| Human features | Resourceful; Skillful as above; Versatile selects **Alert**. Heroic Inspiration initially **0** | L06 p86; L07 p87 Alert; L10 p8 inspiration. No prior Long Rest event or GM award is assumed |
| Vitals | HP 8/8; temporary HP 0; Hit Die 1d6 unspent; AC 12 unarmored; initiative +4 including Alert; Speed 30 feet; passive Perception 13 | L02 p22 details; L03 p77; L06 p86; L07 p87 |
| Languages | Common, Dwarvish, Elvish, spoken/read/written | L02 p20 standard languages; chosen, not rolled |
| Other state | No conditions, exhaustion 0, no attuned items, no concentration, no active spells, no debt or accepted job | INFERRED opening state, not rewards or a completed rest |

Simple-weapon proficiency grants no weapon mastery. Alert changes initiative, not AC or ability checks. Its willing-ally swap is retained as a legal feature for a future combat consumer, not claimed playable here. Resourceful grants inspiration on a future qualifying Long Rest; absence/offline time does not itself perform one.

## Means and acquisition

Choose **Wizard equipment A** and **Sage equipment A**, without selling, replacing or merging duplicate grants (L03 p77; L05 p83).

| Owned means | Count and custody at PS01 | Binding |
|---|---|---|
| Weapons/focus | Two Daggers; one Arcane Focus (Quarterstaff); one ordinary Quarterstaff | Wizard A plus Sage A. The two staffs remain distinct item IDs |
| Books/clothes/tools | Personal Wizard Spellbook; Sage history Book; Calligrapher's Supplies; eight sheets of Parchment; two Robes, one worn and one carried | Starting packages. Calligraphy does not confer tailoring or spell transcription for free |
| Scholar's Pack, expanded once | Backpack, Book, Ink, Ink Pen, Lamp, ten Oil flasks, ten Parchment sheets, Tinderbox | L13 p99 Scholar's Pack. Its Book is distinct from the history Book and Spellbook; total loose parchment 18 sheets |
| Money | 5 GP Wizard cash + 8 GP Sage cash = **13 GP**, represented as 13 gold coins, 1,300 CP value | L03/L05. No purchase, wage, room voucher or free components added |

All items are on the actor's person at the work yard, apart from the Robe being worn. Pack children use the one inventory/custody owner, not duplicate inventory rows plus a second filled pack. A 53-pound equipment manifest plus 13 coins at 50 coins/pound gives 53.26 pounds, below STR 8 Medium carrying capacity 120 pounds (L13 pp95–100; L15 p178). Coin and container ownership must be real, even where a table rounds weight. No purchased spell scroll, component pouch, food, needle/thread, room or mount is presumed.

| Spell source | Frozen choices and counters | Exact binding |
|---|---|---|
| Wizard cantrips | **Mending, Light, Mage Hand**, three known; not counted among prepared level 1 spells | L03 pp77–78 Cantrips; L04 p79 Wizard list |
| Magic Initiate (Wizard) | **Minor Illusion, Prestidigitation**; **Alarm** always prepared; INT; one no-slot Alarm casting available, independent of slots | L05 p83 Sage, L07 p87 Magic Initiate, L04 p79 list |
| Spellbook | Six level 1 spells: Detect Magic, Feather Fall, Mage Armor, Magic Missile, Sleep, Thunderwave | L03 p78 Spellbook; L04 p79 list. Class-created initial book, not six paid transcriptions |
| Wizard preparation | Detect Magic, Feather Fall, Mage Armor, Magic Missile; four prepared. Sleep and Thunderwave remain in the book, unprepared | L03 p78 Prepared Spells. Alarm adds a separate always-prepared spell, not a fifth class preparation choice |
| Capacity | Two level 1 slots, both unspent; no higher slots. Spell save DC 13, spell attack +5 | L03 pp77–78 Wizard table/Intelligence; L08 pp104–105 |
| Recovery/access | Ritual Adept and Arcane Recovery available as level 1 features. Arcane Recovery not yet used; at this level its recovery ceiling is one level 1 slot after a qualifying Short Rest | L03 p78. Runtime rest/ritual consumers still open |

Five known cantrips are three class cantrips plus two feat cantrips, not five class choices. Mending is a known Wizard cantrip, not a purchased book entry or a feat benefit. A class cantrip can be replaced after a Long Rest; four class prepared spells can then be reselected from the book (L03 pp77–78). The feat's spell replacements occur on gaining a level (L07 p87); they are not free daily swaps. A new level 1 Wizard spell found later costs 2 hours and 50 GP to copy; a backup of an already known level 1 spell costs 1 hour and 10 GP (L03 p78). A lesson alone grants neither.

All listed abilities are legal parts of the snapshot. Listing them does not establish a runtime implementation; unsupported actions must say unavailable without spending a slot, replacing a spell or silently giving another power.

## PS01 through PS03 fixture

INFERRED authored branch, pending the [rulings ledger](RULINGS_LEDGER.md). Location `dnd.branch.work-yard`, elapsed day 0 at 09:00, bright daylight. This is a relative test clock, not a DR year, Harptos date or verified Phandalin street. The student has heard of a local carrier seeking help and can see the carrier and bag. The student knows their own means; they do not know the bag's detailed condition, job terms, other actors' private thoughts or any sealed scenario truth before the relevant interaction.

| Entity / action | Frozen proposed facts and behavior |
|---|---|
| Carrier `dnd.branch.carrier:01` | Original unnamed local carrier, adult human Commoner base template (L20 p275), Indifferent toward the student. Owns the bag, cargo and 2 GP. No spells, class or repair proficiency inferred from occupation. Work window 09:00–12:00 |
| Object `dnd.branch.bag:01` | Ordinary Sack (L13 pp96/99), owner carrier; accessible on the yard bench. Empty during repair; intact capacity 30 lb / 1 cubic foot. One six-inch fabric tear, no missing material, no other damage, nonmagical. Inspection reveals these facts. Proposed condition fields refer to the authoritative item ID, its revision, accessible location, damage ID/type/dimensions and repaired state; no second item inventory |
| PS01 | Meet, inspect or ask terms, each taking one minute; no check for this exposed tear or an ordinary willing answer. Inspection grants observed condition knowledge, no agreement or fee. Decline has no debt or penalty |
| PS02 | Proposed repair-and-deliver commission reserves 1 GP from the carrier's actual 2 GP; deadline noon. Cash, board or instruction alternatives stay reachable subject to funded provider/bed/teacher availability. Exact terms must be shown before agreement; see RL18/RL19. The fixture freezes **cash** if accepted, never auto-accepts it at entry |
| PS03 magic | Mending requires known spell, reachable touch target, normal-voice V, free-hand S, and M access. The held Wizard focus Quarterstaff substitutes for the unpriced, unconsumed two lodestones (L03 p78; L08 pp105–106; L09 p148). Keep the other hand free and target within touch throughout. One minute with Magic actions and concentration during casting. No slot, lodestone consumption, spell attack or repair check. On completion remove this tear only; retain item ID, custody and cargo |
| PS03 alternatives | Ask a qualified local worker for a quoted mundane repair, use owned/borrowed appropriate tools with a declared approach, or buy a replacement Sack at 1 CP if stocked. ST2 owns no weaving kit. Replacement creates a different item and requires the owner's assent; it does not mark the original bag repaired. A hired cantrip service is separately priced under the SRD service table, not assumed affordable |

Mending is instantaneous after casting; concentration is required **during** its minute-long casting (L08 p105). Interruptions end the unfinished cast with no repair and no spell slot cost; a fresh attempt takes a new full minute. Focus availability does not waive V/S, reach, timing, or priced/consumed components for other spells. Mending is not a ritual, cannot create missing fabric under this fixture, and cannot restore lost magic (RL08–RL11).

For PS04–PS06, [FIRST_SLICE](FIRST_SLICE.md) still owns the connected journey. Proposed local route: a nearby dry path and a shallow stepping-stone shortcut; the repaired Sack safely holds a later 20-pound cargo, while the torn bag cannot carry that loose cargo until repaired. Courier custody and carrying capacity remain explicit. Detour, paid help, replacement, stay local and turn back all remain options. The ledger supplies provisional hazard and settlement calls, not a claim that the route exists in canon or code.

## Shipping classification and attribution

SHOWN: the [official SRD page](https://www.dndbeyond.com/srd) and [SRD 5.2.1 PDF p1](https://media.dndbeyond.com/compendium-images/srd/5.2/SRD_CC_v5.2.1.pdf) were checked on 2026-10-14. Its [CC-BY-4.0 terms](https://creativecommons.org/licenses/by/4.0/) allow reuse with attribution and indication of changes. The SRD grant does not cover the separate setting. Paraphrasing setting research is not a new license to ship a Forgotten Realms setting pack.

| Tier | First-slice material | Disposition |
|---|---|---|
| `srd521-cc-by-4.0` | Wizard, Sage, Human, Alert, Magic Initiate; named spells actually present in SRD; ability checks, conditions/rest rules when implemented; equipment/prices; Commoner block | May ship as edition-pinned SRD data with the notice below, source page, pack revision and change record. Reuse only the inspected/encoded definitions, not similarly named full-book or 5.1 data |
| `yair-original-proposed` | This student selection, carrier identity, bag tear, yard, relative clock, job terms, authored route, rulings and storyteller policy | Original proposals. A public playable pack needs independently original place/person/history content; it may reuse the CC-BY rules. These selections do not become SRD-authored facts |
| `setting-reference-not-srd` | Phandalin, Forgotten Realms, Faerûn, named canonical factions/NPC biographies, Harptos, adventure maps/events/dialogue and setting cosmology | Research docs can paraphrase with source links. Direct setting adaptation stays under the project's private-pack boundary. For a public original pack, author distinct setting content rather than relabel or closely paraphrase a published adventure. No setting prose, art or map is granted CC-BY merely by sharing an SRD monster name |
| `unqualified/deferred` | Exact DR year and town chapter; other starts; bastions/sidekicks or full-book-only options; cross-edition imports | Not qualified by this pass; do not advertise or bundle as verified SRD 5.2.1 content |

Required notice, reproduced from SRD p1 for the eventual included SRD material:

> This work includes material from the System Reference Document 5.2.1 (“SRD 5.2.1”) by Wizards of the Coast LLC, available at https://www.dndbeyond.com/srd. The SRD 5.2.1 is licensed under the Creative Commons Attribution 4.0 International License, available at https://creativecommons.org/licenses/by/4.0/legalcode.

Change notice: rules are selected and reformatted into a proposed YAIR snapshot; original selections, jobs, rulings and storyteller policies are labeled above. No endorsement is implied. This document preserves the notice within the allowed new-file scope; a shipped pack must include the notice in its distributed attribution surface. No runtime pack or license file outside R5's allowed paths was created.

## Compatibility and remaining gate

Proposed future fields are instance/profile `id@rev`, start `id@rev`, source hash, ruling-set revision, storyteller revision, actor means, authoritative object condition references, committed job terms, knowledge and effect/check/settlement receipts. This is not a save-schema edit. Compatibility decision: old saves remain inert with respect to this optional pack; no retroactive class, bag, job, spell slot, source-profile switch or storyteller pick. A new opted-in instance gets the frozen start. Missing pack/version must preserve saved data and report unavailable content; never reroll. Any later conversion requires explicit migration and save/reload/import proof.

OPEN: root/Weibao review; qualified setting chapter and era for faithful Phandalin play; ST1/ST3 audits; shared object/spell/check/time/receipt consumers; fresh-origin rebuilt desktop play and save/reload/import. R5 completes the bounded source/design documents only. It neither completes full A1 nor changes the accepted one-realm/one-prestige milestone or other canon-world priorities.
