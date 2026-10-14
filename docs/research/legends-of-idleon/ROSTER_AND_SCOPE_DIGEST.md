# Roster and scope digest

## Character supply

SHOWN: shipped `ja.NewCharLvReq` and wiki `Mechanics.slots` agree on the first eleven combined-class-level thresholds:

| Slot | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Combined class levels | 0 | 8 | 30 | 70 | 150 | 300 | 500 | 750 | 1,100 | 1,500 | 5,000 |

STATED: [Character Creation](https://idleon.wiki/wiki/Character_Creation) says eleven slots are currently available. The shipped creation UI sums stored character class levels before comparing a slot threshold; it also includes a purchased-slot field in indexing. This pass does not establish purchase exceptions or executable availability for later table rows. Placeholder rows and a 38-entry array do not prove 38 playable characters.

## Mixed scope, not two isolated tracks

| Scope | Examples | Why another character still matters |
|---|---|---|
| Personal state | Class/skill levels, equipment, chips, equipped large bubbles, current AFK target | Different specialization, output, prerequisites and support reach. |
| Shared state | Storage, small bubbles/vials, buildings, meals, ships/artifacts, garden, farms, research grid | The character helps produce or unlock benefits used by the whole roster. |
| Personal contribution to shared effect | Lab network reach, construction rates, divine links, sampling, total skill mastery | A weaker character can help without matching the main fighter's combat power. |
| Separate subsystem units | Captains, pets, sneaking ninja twins | Multiple units need not occupy the roster's ordinary action. |

STATED: [Alchemy](https://idleon.wiki/wiki/Alchemy) requires each character to visit its cauldron before assignment/XP. Small bubbles always apply to the account; large bubbles need equipment. Shared progression is not automatic enrollment in every system.

STATED: [Laboratory](https://idleon.wiki/wiki/Laboratory) uses character-to-character range and character-to-node range separately. Multiple characters connected to one bonus do not multiply it. Chips can remain effective outside an upload. This means adding characters helps reach a network, but redundant placement can add no current benefit.

STATED: Rift 16 Skill Mastery rewards total skill levels across the roster. W7 Legend Talents award one account point for each character reaching class level 500 and each additional 100 class levels. Sources: skill article mastery sections and [Shimmerfin Deep](https://idleon.wiki/wiki/Shimmerfin_Deep). These are concrete reasons to keep broad training useful; they do not establish that every duplicate class is equally good.

INFERRED: all eleven can retain useful jobs, but optimal number of active farmers versus Lab support changes with reach, unlocks and production needs. No optimal composition or mandatory eleven-character login routine was measured.

## Divine link evidence caution

The generated wiki `Divinity.links` table assigns virtual Lab presence to Arctis, Lab/Divinity co-presence to Goharut and a random extra production claim to Omniphau. Literal shipped `GodsInfo` row text attaches some of these descriptions to different names. The code selects effects through `GodsInfo[*][13]`, not by the displayed name. Research grid 173 is explicitly checked by the major/minor effect branches and its wiki row says it grants Arctis to all characters. Thus indexed resolution exists, but this pass has not followed every row through display, links and all consumers. Preserve this discrepancy when reusing effect names.

For YAIRPG, shared resources or institutional infrastructure could support multiple actors without sharing their private perceptions or source ownership. That is P4, a future proposal; it does not authorize roster runtime, a new body or free cross-world knowledge.
