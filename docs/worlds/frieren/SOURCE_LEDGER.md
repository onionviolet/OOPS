# Frieren source ledger proposal

## Frozen evidence boundary

**Source report:** WikiTeam IA snapshot dated 2023-12-12, Frieren Wiki, under `docs/research/power-systems/wiki-digests/full-dumps/`. Worker notes: `workers/frieren-full/NOTES.jsonl` (git-ignored); cited payloads are under `~/.codex/research/wikis/frieren.fandom.com/dump/full-reading/cited-pages/`. This is a secondary wiki snapshot. Its articles cite manga chapters in many places, but the tracked notes do not establish that every claim was independently checked against the manga. Each claim below therefore means “the cited wiki revision reports,” not unqualified primary canon.

The series digest `docs/research/power-systems/wiki-digests/DIGEST_frieren.md` predates the recovered snapshot and says no article revision was acquired at its time. This full-dump lane adds revision-qualified secondary evidence; it does not retroactively make the earlier digest verified. Material after 2023-12-12, including later manga and anime scenes, remains outside evidence and is marked as a design-changing gap in [SYNTHESIS](SYNTHESIS.md).

## Core law claims checked against payloads

| Claim as reported by wiki | Revision | Direct payload spot-check / qualification |
|---|---|---|
| Spells consume mana; records and conferral exist | "Spells", rev. 14938 | Payload states this directly. It labels broad offense/defense/support categories fan-made and names Goddess magic/curses as exceptions. |
| Concealment is trained and deceptive; not a universal invisibility effect | "Frieren", rev. 14471; "Flamme", rev. 14594; "Fern", rev. 14749 | Payload confirms concealment, examples of observers failing, and exceptional observers detecting it. Exact duration/threshold is not supplied by the relevant entries. |
| Mana perception can have a brief interruption during casting | "Frieren", rev. 14471 | Payload states a fraction-of-a-second interruption, characterized as an apprentice error Frieren has not overcome. Do not claim exact frame timing. |
| Auserlese weighs soul mana; incorrect judgment can expose Aura to control; will can resist | "Aura", rev. 14618 | Payload confirms comparison, indomitable-will break, Aura’s decapitation response, and high personal risk. Its intro says complete control while ability text qualifies partial defiance. Conflict retained. |
| Fearvelia transfer grants instant learning and Serie forgets the transferred spell | "Serie", rev. 14764 | Payload explicitly contains the forgetting cost. Do not reduce this to a free copy. |
| Exam objective has party, deadline, return and escape consequences | "First Class Mage Exam", rev. 14828 | Payload confirms group capture and deadline with all members, barrier boundary, and escape bottle causing automatic failure. Other stages have different rules. |
| Blue-Moon Weed magic requires first observing an actual specimen | "Turk Region", rev. 14484 | Payload directly states the prerequisite, half-year search, seed-rat clue and later formulation. It does not say every spell has this requirement. |
| Zart’s spatial transfer requires direct contact; upper limit unknown | "Zart", rev. 14943 | Payload confirms touch and examples of person/landmass transfer; full limits are explicitly unknown. |
| Tot’s planetary curse is under development, not shown complete | "Tot", rev. 14705 | Payload says she is developing it and retreats to finish it; no active global effect, progress or counter is given. |

These checks target the P2/P3 failure patterns in `docs/gm/dispatch/wiki-lanes-2026-10-13/SPOTCHECK_1.md`: preserve exact actor and speaker, conditions, costs, timing and negative cases. Notes can omit explicit conditions; the retained payload controls this table.

## Revision-qualified source rows

All lines below are **source reports**, not proposals. All derived game uses are proposals in the other owners.

| Topic | Wiki source (title, revision) | Reported fact or limitation |
|---|---|---|
| Mana and spell taxonomy | "Spells", 14938 | Spells are effects created by consuming mana and may be conferred or recorded; broad functional categories are wiki-made; curse and Goddess magic treatment is separately described. The page estimates around half of grimoires use ancient Elvish; this is a wiki-reported estimate, not an access rule. |
| Concealment | "Frieren", 14471; "Flamme", 14594; "Fern", 14749; "Demon", 14737 | Training and deception are reported; observers differ; demons assess hierarchy through mana and do not expect constant suppression. Heiter’s separate circle spell prevents mana detection of those affected ("Heiter", 14835). |
| Detection | "Frieren", 14471; "Heiter", 14835 | Brief cast interruption and examples of estimating mana are reported; Heiter also uses a circle spell that prevents mana detection of those affected, distinct from trained concealment. Precise thresholds, coverage and termination conditions are absent. |
| Control / resistance | "Aura", 14618 | Soul-mana comparison, control, resistance by will and catastrophic reversal risk. Introduction and ability prose differ on completeness. |
| Spell transfer | "Serie", 14764; "First Class Mage Exam", 14828 | Fearvelia transfers one learned spell via grimoire; Serie forgets transferred spells. First-class mages have a one-spell privilege after exam. |
| Learning from observation | "Turk Region", 14484 | Real specimen observation precedes formulating Blue-Moon Weed growth magic. The “Spells” page estimates around half of grimoires use ancient Elvish (rev. 14938); this is not a universal access requirement. |
| Public counter learning | "Beyond Journey’s End Arc", 14281; "Timeline", 14231 | Wiki says humans analyzed Zoltraak, integrated it and developed defense/equipment. In a separate training case, broad defensive coverage quickly drains Fern’s mana and she identifies area-at-impact coverage as the response; this is not a universal numeric cost. |
| Examination | "First Class Mage Exam", 14828 | Three-year recurrence and distinct proctored stages; eligibility exception and stage conditions reported. Proctor discretion varies. |
| Priesthood | "Heiter", 14835; "Spells", 14938; "Goddess of Creation", 14930 | Healing, directed spears, survival support maintained by Heiter for up to two months, and curse dispelling claims; exact costs and theological truth not independently established. |
| Warrior methods | "Stark", 14497; "Eisen", 14925; "Revolte", 14713 | Named attack/traits and material/maintenance constraints reported; many activation costs are unstated. |
| Demon rules | "Demon", 14737; "Aura", 14618; "Lügner", 14599; "Grausam", 14767 | Wiki reports mana hierarchy, post-death dissolution and specialized deception/abilities. These are not universal templates for every demon. |
| Ecology | "Ecology", 14559; "Alt Woods", 14478; "Laub Hills", 7232 | Manga-facing monster/fauna distinction, venom timing and specific curse encounter. Page explicitly notes anime depiction differs for one creature. |
| Timeline | "Timeline", 14231 | Rough chronology; most era designations fan-made; some ordering uncertain; spin-off events marked. |
| Afterlife | "Aureole", 13994; "Bredt Region", 8889; "Goddess of Creation", 14930 | Aureole is described as a place where souls rest. Flamme’s notes report that she visited and spoke with former comrades; Frieren doubts the conclusion, while Heiter chooses belief. Goddess residence is presumed. Communication mechanics remain unknown. |

## Visible conflicts and exclusions

- **Heiter’s two distinct routes:** his personal mana sensing and the circle spell that prevents detection are separate source-reported abilities ("Heiter", rev. 14835). The latter is not trained concealment.
- **Aura control:** article introduction says the greater-mana soul gains complete control; abilities describe partial defiance and release by indomitable will ("Aura", rev. 14618). Preserve both descriptions; model the demonstrated resistance rather than promise absolute control.
- **Curse scope:** "Spells", rev. 14938 makes a broad claim that curses evade defense and require Goddess magic to dispel; "Laub Hills", rev. 7232 gives a specific sleep-curse incident and an asserted monster-removal approach. Do not collapse these into one universal cure law.
- **Names:** "Appetit Region", rev. 7230 spells Stark’s brother “Stolz”; character entry "Stoltz", rev. 14314 uses “Stoltz.” Keep the mismatch visible.
- **Ecology adaptation:** "Ecology", rev. 14559 says one creature dissolves in the anime but not the manga. The manga-referenced pack does not import anime behavior.
- **Timeline:** fan-made eras, unordered entries and spin-off-only events are not canonical chronology labels ("Timeline", rev. 14231).
- **Later works:** the snapshot cannot support anime season 2/later seasons, later manga chapters, official fan book contents published after snapshot, or unretained spin-off details. Do not fill from memory.
- **Wiki-only interpretations:** “living grimoire,” mana-equivalent year calculations, and unsourced capability generalizations remain attributed wiki statements or inference, never numeric rules.

## Source/use hierarchy (proposal)

For this pack, direct retained payload and revision text outrank worker paraphrase; where the payload is a wiki summary, it remains secondary to manga primary text not present in this task. Anime is a separate adaptation. Wiki interpretation is not upgraded to canon by repetition. Any later primary-source check should add a dated row and explicitly reconcile the affected claim rather than silently replacing it.
