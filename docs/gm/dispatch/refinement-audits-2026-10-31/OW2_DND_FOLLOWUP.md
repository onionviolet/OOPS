# OW2 D&D follow-up: suppression and concentration

**Scope:** SRD 5.2.1 only; prepared local primary extract, exactly 1,500 words from PDF pp. 109 and 179. This qualifies MD4/MD6 narrowly. No older edition, supplement, author ruling or secondary debate was used as authority.

## Supported qualifier (V; I for model)

SRD 5.2.1 p109 says an ongoing spell in Antimagic Field is suppressed, does not function while suppressed, and continues to spend its duration. The explicit exceptions are spells cast by an Artifact or a deity. P179 says an effect ends if its creator loses Concentration; it lists another concentration effect, damage, and incapacitation/death as breaks. Together these support separating **effect function/lifetime** from **concentration support**: suppression pauses function in the area, not the duration clock, and these passages do not say suppression itself ends the creator's concentration. This does not establish every aftermath or a general concentration rule for other suppressors.

**MD4 refinement:** retain its lifetime-versus-function split, but avoid implying concentration support is owned by the target. Candidate row: effect producer/creator owns concentration; the produced effect owns its remaining duration and suppression state; the affected target owns only target-side consequences. The field is a contextual suppressor. Where creator and target differ, leaving the field can restore a still-live effect if concentration remains; if the duration elapsed under suppression, it cannot resume. This is a source-supported interpretation of the two passages, not a complete timing ruling.

**MD6 remains open:** the extract does not settle a field suppressing its own spell, whether its caster can maintain that concentration while in its aura, or any self-dependent created-actor loop. Do not turn the distinction above into an answer to that case.

## Proposed presentation and implementation seam (P)

Group the effect row with its producer, duration and current suppressor; display “suppressed here” plus remaining duration. Keep the creator's concentration control/status on the creator row, linked to the effect. Return the effect to functioning only when suppression ends and its lifetime and concentration support remain. An effect exception such as Artifact/deity source is a qualified producer attribute, not a target toggle. Candidate owners remain `simulationFacts` (producer, effect, profile and clocks), `applySimulationEffects` (suppression and end settlement), and `jobs` (elapsed time). No UI or runtime change is made here.

**Save/refactor risk:** persist producer identity, pinned rules profile/revision, elapsed/remaining duration, suppression cause and concentration state separately. A combined “active” bit could wrongly resume an expired effect or end one merely because its target entered the aura. Existing saves need an explicit compatibility decision before introducing this split.

## Smallest differing-input check and reopen

Hold effect, duration and creator constant; vary only whether the target is inside the aura, then whether the creator loses concentration. Expected distinction: target entry suppresses function while time advances; creator concentration loss ends the effect. Repeat with a duration that expires inside the aura and verify no return after exit. Keep creator=target/self-dependent field as an explicitly unsupported case until an exact selected-profile passage or adopted table ruling addresses it. Reopen at the first implementation of Antimagic Field, a suppression consumer, or that self-dependent combination.

**Source binding:** official [SRD 5.2.1 PDF](https://media.dndbeyond.com/compendium-images/srd/5.2/SRD_CC_v5.2.1.pdf), pp. 109 and 179; source contract [S02](../../../worlds/dnd/SOURCE_CONTRACT.md). Attribution follows the contract's SRD license-page requirement. Evidence types: V = printed text; I = narrow synthesis; P = proposed model. No game behavior verified.

This work includes material from the System Reference Document 5.2.1 by Wizards of the Coast LLC, available at [the official SRD page](https://www.dndbeyond.com/srd), licensed under [Creative Commons Attribution 4.0 International](https://creativecommons.org/licenses/by/4.0/legalcode).
