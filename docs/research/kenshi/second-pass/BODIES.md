# Bodies, hardship and ways out

Reviewed 2026-10-08. These are retained-source findings, not an executed Kenshi playtest. Locators use the private `~/.codex/research/kenshi/` root. Database offsets name the original binary record starts, also retained as `offset` in each `.json` export. Explicit base and patch values are reported separately; no full merge is asserted. Shipped tips are author explanations, not proof of current native thresholds.

## B1: Losing a limb changes what the body can do

`decompiled-fcs/forgotten_construction_set/LimbState.cs` distinguishes original, stump, replaced and crushed. `inputs/fcs.def:102` documents starting health below -100 as amputated. Rock Bottom is not only a zero-money description: `gamedata.base` `2287-gamedata.base` @1000369 has money 0; its `rebirth.mod` patch @75691 references squad `46039-rebirth.mod` @791864, which is malnourished and leads with character `2184-gamedata.base`. That character's rebirth patch @92767 sets left-arm starting health to -150. The bodypart resolves to `gamedata.base` `28-gamedata.quack` @978957, Left Arm. This supplies the concrete origin → deprived squad → amputated arm chain absent from the first pass.

`inputs/data/tips.txt:42` explains that a disabled arm prevents two-handed fighting and leads to a secondary weapon when available; line 57 describes permanent severing and replacement. The tip's specific sharp-hit/-100 threshold is not promoted to a recovered native combat formula. Proposal connection: an injury should disable a relevant function and make another loadout useful, rather than subtracting the same percentage from everything.

## B2: Replacement is a new capability with a tradeoff

`Newwworld.mod` `96022-Newwworld.mod` @1857359 defines an Industrial Lifter left arm; `rebirth.mod` @454029 changes strength multipliers to 1.0/1.25 and dexterity to .6/1.0, thievery base to .5, craft hours to 40 and top value to 28000. The same world's Stealth Leg `95579-Newwworld.mod` @1832034 has a rebirth patch @448481 with stealth .75/1.25 and athletics .7/1.05. Scout Leg `96020-Newwworld.mod` @1855016 has a rebirth patch @452978 with athletics 1.0/1.4, stealth .25/.95 and top HP 150. `inputs/fcs.def:1328–1356` identifies slots and maximum-quality endpoints. Do not sum both limbs or assume quality interpolation from these endpoints.

Recovery can therefore become specialization: lifting, speed and concealment have different costs. These are purchasable/craftable parts, not evidence that race, innate talent or all physical aptitude can be freely rewritten.

## B3: An affordable repair can preserve room for ambition

Economy Arm `96134-Newwworld.mod` @1860032 is patched in `rebirth.mod` @455534 to value endpoints 500/3500, HP 35/100, dexterity .66/.8 and thievery 0/.5; it links two ingredient records. This contrasts with B2's industrial arm endpoint 28000. These are item value fields, not a verified final vendor price or availability promise. `inputs/data/tips.txt:59` explicitly presents cheap prosthetics as emergency help. Original proposal: a rough repair restores the basic work function now, while a better design remains a project. Avoid requiring elite surgery simply to rejoin ordinary life.

## B4: Different bodies need different households

Skeleton `17946-stick_people.mod`: `gamedata.base` @356729 declares robot=true, hunger rate 0, swim=false and heal stat 6; `rebirth.mod` @24498 makes it playable, patches heal rate 2 and weather immunities 1/2/3. The recovered `StatsEnumerated.cs` maps 6 to robotics. `inputs/fcs.def:1501` describes non-swimmers as walking on the lake bottom; equipment exclusions are separate fields. This is not ordinary physiology with extra HP.

Shek `5276-chareditor.mod`: base @2892849 has 125-HP anatomy references, heal rate .8 and trained-stat preferences; rebirth @232486 patches hunger rate 1.25, strength 1.1 and dexterity .8. Hive Worker `18960-gamedata.base`: base @4090470 has 75-HP anatomy and labor/engineering/thievery preferences; rebirth @329249 patches hunger .5, no shoes, acid immunity enum 2, a stronger head and special foods. See `WeatherAffecting.cs` for weather enum labels and `StatsEnumerated.cs` for stat labels. Some authored defaults are legacy explanations: `fcs.def:1556` suggests fixed robot attributes, which was not established from the native executor and should not be claimed as actual play.

Proposal: body traits change provisions, available equipment, repair services and viable work. Race preferences are not a universal rank or hard career prohibition. A repaired worker can pursue a different trade without requiring a new soul or reset.

## B5: Maintenance and healing are different services

`inputs/data/tips.txt:56` describes accumulating robot wear reducing maximum HP and a dedicated bed repairing it. `rebirth.mod` building `64614-rebirth.mod` @2456212, Skeleton Repair Bed, lists construction materials and output rate 8; functionality `64615-rebirth.mod` @2458078 has function 25 and one operator. `BuildingFunction.cs` maps 25 to skeleton bed. Ordinary camp bed `16845-nodes_otto1.mod` has base @3888134 and rebirth @307263, whose construction uses Sleeping Bag `56645-rebirth.mod`; its functionality `42331-rebirth.mod` @1509727 is function 6, ordinary bed. Build-rate numbers do not establish actual repair throughput.

Proposal: a borrowed bed, medicine and a mechanic are distinct routes, with travel or a favor substituting for owning a full hospital. In Frontier, preserve existing `src/main.js` sleep recovery and unconsciousness; only an opt-in scenario should add persistent injury or mechanical maintenance.

## B6: Suffering can teach without turning every defeat into a reward

All 62 shipped tips were read. `inputs/data/tips.txt:2–5` distinguishes defense practice against beatings, faster learning against stronger opponents and a toughness benefit for ordering a survivor up from playing dead. Lines 17 and 45–47 connect load, hard martial practice, strength and toughness. The global record `110-gamedata.quack` in base @1074793 carries toughness XP 1.33, strength-from-walking .35, skill-difference XP fields and damage-resistance endpoints -.5/.5; rebirth @78558 patches walking .5, resistance -.65/.65, high-toughness wound degeneration .03, KO-time multipliers 3/.75 and max toughness coma point 85. `inputs/fcs.def:685–731,765–774` explains the intended fields. XP triggers and actual interpolation remain native-unread; starvation is not proven to grant XP.

Proposal: training under a declared handicap is useful, while rescue, retreat and ordinary work remain useful growth paths. No recommendation to reward repeated self-injury in the vanilla opening. `src/data/skills.js` already defines Running, Weightlifting, Iron skin and Fortitude; reuse their distinct purposes before proposing another universal endurance number.

## B7: Captivity is an ongoing condition, not a fail screen

`SlaveStateEnum.cs` distinguishes not slave, slave, escaping slave and ex-slave. The Slaves origin `1532934-rebirth.mod` @3324590 has money 0 and town/squad links; squad `1532935-rebirth.mod` @3325365 is malnourished and contains two `1532936-rebirth.mod` @3326210 characters with slave=1 and a SHACKLES reference. `gamedata.base` SHACKLES @3572677 is locked, weighs 20 and has stealth .6 and athletics .4; its rebirth patch @283174 changes athletics to .8. These are separate from legal bounty and faction relation.

`inputs/data/tips.txt:35` describes subsistence rations that permit work without easy escape. This supplements the first pass's captive-work schedule; it does not repeat its scheduler claim. Captive survival, restraint removal, escape and social reintegration need their own boundaries. Joining a faction or gaining a prosthetic does not automatically erase the capture record.

## B8: The ways out use different resources

The retained source supports the following route inventory. It is every recovery route reviewed in this pass, not a claim to enumerate every native Kenshi possibility.

| Bad situation | Reviewed route | Locator | Cost or unresolved constraint |
|---|---|---|---|
| Whole squad down | A survivor waits, gets up and rescues others | tips 5,10,12 | Enemy distance, first aid and someone able to act; death remains possible |
| Overmatched | Defense-only stance buys time, protected movement | tips 11,29 | Trades attack for survival; not guaranteed escape |
| Shackled | Pick the lock or use a saw | tips 8; Hacksaw `581-gamedata.base`, base @694500, item function 9 | Lock skill/tool; own cage has a skill penalty (tip 1) |
| Lock beyond skill | Use another route instead of repeating an impossible roll | `fcs.def:667`; base global @1074793, minimum chance 5 | Threshold is authored; native check unread |
| Escaped but recognizable | Hide, wait for pursuit to cool, choose a sympathetic destination | tips 9; PEOPLE P-F4/P-F5 | Does not prove universal timer, amnesty or automatic recruitment |
| Gear confiscated | Find the captor's storage and recover it | tip 13 | Location, access and witnesses; not a free restore |
| Marked appearance | Surgeon restores shaved appearance | tip 14 | Service access; cosmetic repair is not proven to erase slave recognition |
| Limb lost | Buy emergency prosthetic, later specialize | tips 57,59; B2/B3 | Money, stock, fitting and maintenance |
| Mechanical wear | Visit or build a repair bed | tip 56; B5 | Specialized infrastructure |
| Exposure | Protective clothing, shelter or weather-timed travel | tips 49–51,58 | Materials and local hazard knowledge |
| No safe home | Purchase a vacant/ruined town building before founding outside | tip 19; SETTLEMENTS S-F1 | Money, availability and political obligations |
| Poor fighter | Work, trade, recruit allies, specialize gear or exploit terrain | tips 17,20,25,40,41; PEOPLE; SETTLEMENTS | No universal power spike or guaranteed escape authored |

Use the actual file-local P-F and S-F identifiers in the linked [people](PEOPLE.md) and [settlement](SETTLEMENTS.md) findings; those are scoped findings, not accepted design rules. The north star's broader promise of a way around does not establish native limb regrowth, resurrection or a rewind here. A second world's medicine is an original YAIR proposal with a separate compatibility decision.

## B9: Everyday surroundings determine whose power works

`inputs/data/tips.txt:41–51,62` describes large weapons being awkward indoors, two-handed requirements, bare-hand damage against metal, encumbrance reducing martial skill, closed doors muffling sound, storms reducing sensing and asymmetric visibility between lit and dark positions. These are specific advantages and counters, rather than a generic enemy rank. `src/data/locations.js` already has narrow/dark environmental types, while `src/main.js` has a technique-observation call. Source inspection establishes those hooks exist; it does not verify the current dirty build or prove a generic counter system.

Proposal: observe a patrol's weapon and protective equipment, learn what makes it dangerous, then decide between a doorway, a storm, an ally or new gear. Taking a weapon can transfer the tool without transferring practiced attacks. Robotics can Works in a compatible physical world and require Rechannel through a local maintenance ecosystem; imported magic should retain its actual effects wherever the selected local rules support it. Those compatibility modes belong to the original world card, not Kenshi evidence.
