# Tale of Immortal: three deeper systems

Chosen for payoff and gaps in prior coverage. Static findings and original proposals remain separate.

## D1 Dialogue schema and a real option edge

Sources: A01; DramaDialogue10008; DramaOptions100081/100082; LocalText.

Shown: Dialogue10008 lists two option IDs. Option100081 invokes joinSchool and returns to10002;100082 has no function and returns to10003. The table separates text, conditions, hidden-choice/cost flags and click tips. This establishes a declarative edge/effect pair but not whether the interpreter charges before or after effect execution. 21926 rows include specialized/placeholder paths; counts cannot stand for played branch coverage. Exact key lookup into the available LocalText resolves9824 dialogue keys; other localization/sub-source routes remain untraced.

PROPOSAL: Validate IDs and execution ordering separately; preserve refusal and repeated access through world rules.

Boundary: Full tables/text retained under own private extract; native interpreter absent.

## D2 Triggered story and weighted effects

Sources: A02/A09; DramaTrigger703 rows; DramaFunctionGroup25 rows.

Shown: Triggers include map scene loads and prior dialogue/dungeon conditions; actor slots and dramaID bind the context. repeat/CD fields govern repetition. Function groups offer weighted alternatives with their own condition/effect. These are at least three separate layers: occurrence, eligible content, resulting action. No field-name guess establishes units, probability denominator or exactly-once settlement.

PROPOSAL: One original timed lead can change a site and leave a report; define clock units and outcome receipt.

Boundary: Command grammar and consumers absent; full trigger graph not semantically read.

## D3 Artifact companion talk as a separate subsystem

Sources: A01/A11; ArtifactSpriteDialogue104 rows, ArtifactSpriteDialogueSub457 rows.

Shown: Trigger rows bind acquisition, player death or revival-style events to probability/interval/repeat/group fields. Sub rows bind spriteID, active interaction, closeLevel, text key, animation and voice. Example1001002 has playerDie_0, prob20, interval12 and repeat1. Units and denominator remain unknown. Closeness-gated chat and event barks are represented independently. DLC dialogue is inventoried as a separate145-row source, not assumed active.

PROPOSAL: Use companion voice sparingly for earned state changes, with rereadable memories and private knowledge gates.

Boundary: No audio files played or assets imported; controller/relationship evaluation order is unread.
