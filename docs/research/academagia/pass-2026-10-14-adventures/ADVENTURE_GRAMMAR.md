# Shipped adventure grammar and map guide

**Shown:** decoded records and inspected engine methods. **Inferred:** profile reconstruction, graph traversal and design meaning. **Not verified:** a concrete player's satisfied gates or played branches. No story prose, assets or code is copied into YAIRPG.

## A1. Counts

| Profile | Stages | Root candidates | Investigation choices | Exit choices | Non-null outcome links | Structurally reached from roots | Outside that traversal |
|---|---:|---:|---:|---:|---:|---:|---:|
| Base | 1,555 | 237 | 1,190 | 4,065 | 6,402 | 1,516 | 39 |
| Content union | 3,022 | 383 | 1,630 | 7,809 | 11,463 | 3,005 | 17 |
| Summer union | 3,030 | 384 | 1,632 | 7,856 | 11,503 | 3,013 | 17 |

Counts cover every Adventure record, not only player-facing adventure titles. Each profile includes one Court, Ending and Introduction; all others have Default type. “Root” means not targeted by **any Continuance record**, matching StorySystem.Initialize. Links are each success/failure continuance occurrence on an exit with a non-null target, so repeated links count repeatedly. The complete ledger also retains null-target continuances: four in base and two in each patch union; VERIFICATION counts those too. Root descendant counts in ROOTS files overlap; do not sum them.

Root-to-exit traversal is a structural diagnostic only. Court can be forced through dedicated engine calls. Location discovery can force-start a story. Initiate effects request stories through normal StartStory membership guards. An isolated node is not automatically dead content. The patch profiles retain the 17 outside-traversal IDs in the private work stats; they include Court, the Cold Room chain, two Mole branches, two Aymeri stages and two Extra records.

All 5,255 base choices have zero or one roll (894 / 4,361). Content has 2,509 zero-roll / 6,930 one-roll choices. Summer has 2,533 / 6,955. The engine supports OR roll lists, but these linked shipped choices do not demonstrate multi-roll alternatives inside one choice. Alternate **choices** provide most skill diversity.

## A2. Record grammar

| Layer | What is mapped | Runtime role and caution |
|---|---|---|
| Adventure stage | ID, short authoring name, kind, root/continuation classification, gate, location, actors, investigations, exits, incoming links | Stage is not a whole adventure page |
| Entry gate | AND/OR predicate list with left/right selections, comparator, number/date range and occurrence chance | Empty or missing prerequisite passes; expression selection presence is recorded, expression prose is omitted |
| Actor selection | Path, selected entity IDs, mode and parent | Dynamic actor binding needs the source resolver and player state; no concrete actor reachability is claimed |
| Investigation | Gate, check, success benefits and failure effects | Successful investigation is remembered; failure may disclose its checked skill |
| Exit choice | Gate, skill/attribute check, success and failure effects, both continuance lists | No roll means success in the check route, but choice gate and effect costs still apply |
| Benefit | Effect plus an independent threshold | Executes if max roll power > benefit threshold OR threshold = 0; this is not the exit's roll threshold |
| Continuance | Destination, gate, relative/absolute dates, offset, duration and variance | Immediate or pending semantics differ; multiple targets may be scheduled |
| Effect | Verb, magnitude/value, subject/target/object selections and conditions | Skill Step, Skill Level, permanent Expand and temporary Increase are distinct; an Add may unlock an action or ability |
| Ability/action | Entry gate, effects, conditional roll-effect relations and duration | Maps downstream action unlocks without embedding their narrative descriptions |

PrerequisiteNumericChecker reads the selected child skill level when the path selects a child. Existence checker tests owned information, memories, actions, abilities, items and other typed facts; NotEqual negates its boolean. Date checker ignores the item comparator and checks an inclusive normalized-order interval. The ledger preserves authored comparator and dates without mistaking that comparator for date runtime logic.

Occurrence checks apply while the prerequisite ID has not yet been recorded as passed. This is not a universal repeatability rule for YAIRPG. Failed resolution rejects most prerequisites. Selection labels in JSON come from XML node IDs, not guessed narrative intent; pathCodes preserve the exact address. Zero and negative path numbers encode selected GUID positions. Labels cannot replace full dynamic entity resolution.

## A3. Timing and failure details

An immediate link requires UseContextDate true and offset, duration and context variance all zero. Its Continuance gate must pass to execute immediately. If that test fails, FillContinuance places it in the suspended list rather than simply discarding it. Later availability tests the **destination Adventure's** gate, along with its stored date window. Do not collapse continuation-gate and stage-gate behavior into one test.

Relative start = current date + max(0, offset + signed variance draw). The inspected end-date code adds max(0, a fresh signed variance draw) to the start. **ContextDateDuration is read and used by the immediate classifier but is not used to compute the end date in this method.** This is a shown source discrepancy; intended data durations cannot be reported as actual available windows. Absolute dates are varied and clamped so start is no earlier than now and end no earlier than start. Expired pending targets are removed; scheduling the same destination ID again replaces its pending dictionary entry.

Success exits apply qualifying benefits and success links. Failure informs a skill, applies drawbacks and follows failure links. The same next stage on both sides therefore does not mean the result is identical. Sacrificing a clique member uses the successful route at a social cost. These source rules are documented, not proposed as YAIRPG's sole failure or cost model.

`StorySystem.GetComplications(Exit)` returns an empty list in this installed build. The ledger keeps complication type/count fields as authored metadata, but does not claim that they insert encounters in this path. A separate complication failure path applies its Benefits list, another source detail that should not be inferred from the words benefit/drawback alone.

## A4. Read the complete mechanical ledgers

ADVENTURES_BASE.json.gz, ADVENTURES_CONTENT.json.gz and ADVENTURES_SUMMER.json.gz are gzip-compressed **analysis**, not raw game data. They contain no story prose, HTML, choice descriptions, copied implementation or assets. Every stage and linked choice is covered mechanically. They include downstream Ability/Action analysis so earned access has a consumer to inspect.

Top level `nodes` is the complete ordered list of stage IDs; `definitions[id]` gives its analysis. Gates, selections, choices, rolls, effects, continuances and actions are also interned in definitions. `symbols[id]` provides a short type/name for referenced entities. A referenced ID can have both a symbol and a definition. `abilitiesAndActions` lists the auxiliary consumers. IDs use little-endian GUID bytes as in the prior decoder; convert with Python uuid.UUID(bytes_le=bytes.fromhex(id)) for Guid.ToString form.

Example read-only lookup using Python standard library:

```python
import gzip, json
with gzip.open('ADVENTURES_SUMMER.json.gz', 'rt') as stream:
    audit = json.load(stream)
root = audit['definitions']['63a4c388f3d1284b969e9ea0e36816d8']
for choice_id in root['exits']:
    choice = audit['definitions'][choice_id]
    print(choice['gate'], choice['successNext'])
```

The ROOTS files give all root identifiers and structural descendant counts. CLUB_PATHS.md paraphrases the two explicitly club-named narratives and enumerates all their mechanical choices in readable tables. The complete map remains **partial for semantic narrative coverage**: every non-club prose scene and choice has not been manually paraphrased, all other organization names have not been traced as club paths, and the wiki's 258-page crosswalk is absent. A mechanical census does not close those gaps.

## A5. Evidence

Prior `content.json` plus each patch's modified.json/new.json; `ContentModel` readers for Adventure, Story, Exit, Investigation, Continuance, Benefit, Effect and SelectionItem; `Academagia.GameSystems/StorySystem.cs` methods Initialize, StartStory, GetPossibleStoriesForCurrentDate, GetPossibleExits, ExecuteExit, ApplyBenefits, FillContinuance and CalculateContinuanceDate; `VisitSystem.cs`; `Academagia.Effects/InitiateImpl.cs`; prerequisite checkers; SelectionItemHelper and XML selection trees. Original payload and input hashes remain private. COUNTS.json is the aggregate result and TOOLING.md explains the repeatable passive method.
