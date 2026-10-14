# Source ledger

Status: **[PROPOSAL]** Evidence ledger for a world-pack design. Wiki is secondary and dated. Citation convention: page title + revision ID; use the linked oldid URL for lookup. Every design rule remains a proposal.

## Snapshot and reading record

| ID | Source | Evidence boundary |
|---|---|---|
| S1 | [Kimetsu no Yaiba Wiki dump index](../../research/power-systems/wiki-digests/full-dumps/kimetsu-no-yaiba_INDEX.json) | WikiTeam Internet Archive 2023-12-19 history dump; 26,300 XML pages; 962 content-page inventory; not proof all pages were read |
| S2 | [Full-dump notes](../../research/power-systems/wiki-digests/full-dumps/workers/demon-slayer-full/NOTES.jsonl) | 353 rows; each note reports complete reading of selected payload/spans; 45 full-page rows, 117 mechanic-section rows, remaining rows include narrative/metadata/out-of-scope dispositions |
| S3 | [Prior digest](../../research/power-systems/wiki-digests/DIGEST_demon-slayer.md) | Older status says blocked/no revision; superseded as a source-status lead by S1/S2, but its old mappings remain unverified |
| S4 | Private retained cited payloads | Raw page bodies remain outside tracked files; direct core checks made against Demon rev 130890, Total Concentration Breathing rev 127065, Nichirin Sword rev 126696, Corps rev 125400, Mark rev 129116, Bright Red Nichirin Sword rev 123577, Repetitive Action rev 116919 |

## Core source claims and design translation

| Claim | Source | Proposed engine shape |
|---|---|---|
| Demons feed on humans; sunlight and Nichirin are stated weaknesses; wisteria is repellent/poisonous; regeneration can exceed ordinary weapons | Demon rev 130890 | **[PROPOSAL]** Distinct body, nutrition, condition, weapon/material interaction and environment rules; keep named exceptions |
| Breathing enhances human physical capacity through respiratory and circulatory changes; constant practice is difficult and trained | Total Concentration Breathing rev 127065 | **[PROPOSAL]** Training and sustained state with body fatigue, duration, practice and recovery; no elemental creation by visual motif |
| Nichirin ore is sunlight-exposed; recruitment chooses ore after selection; skill affects color change; red state has stated methods/effects | Nichirin Sword rev 126696; Bright Red Nichirin Sword rev 123577 | **[PROPOSAL]** Track material, custody, maker, condition, owner and time-limited state; preserve condition disagreement below |
| Corps is covert; cultivators train candidates; Kakushi support and swordsmiths provide specialized craft | Demon Slayer Corps rev 125400 | **[PROPOSAL]** Membership, duty, access, support services and qualified instruction as separate institutions |
| Mark has dangerous awakening conditions and lifespan-cost statements | Demon Slayer Mark rev 129116 | **[PROPOSAL]** Preserve exact source language and counterexamples; do not encode a universal numeric death timer until reconciled |
| Repetitive Action uses repeated action/prayer/emotional memory to raise concentration and output; Genya is described without a Breathing Style | Repetitive Action rev 116919 | **[PROPOSAL]** Alternative concentration route distinct from style acquisition; personal anchor and context tracked |

## Visible wiki contradictions and limits

| ID | Conflict or gap | Handling proposal |
|---|---|---|
| C1 | Demon rev 130890 overview calls decapitation the only guaranteed demon-kill method; its weaknesses section names Muzan, Akaza and Kokushibo as survivors of Nichirin decapitation | **[PROPOSAL]** Keep both statements visible; require named-source exception handling. Do not infer guaranteed kill |
| C2 | Bright Red Nichirin Sword rev 123577 opens with a Marked-user restriction (L14, L17), then lists friction (L21) and pressure (L22), while explicitly saying Nezuko's ignition does not require a Mark (L23); Nichirin Sword rev 126696 says grip and clash require a Mark (L278) | **[PROPOSAL]** Preserve the opening generalization and the explicit ignition exception side by side. Model friction/clash and pressure/grip as Mark-gated in these cited method descriptions; model Nezuko ignition as the stated exception. The red state is temporary (Bright Red Nichirin Sword L14, L17), hampers or can nullify regeneration and causes heat/pain (L27); permanent death after head regrowth is an inference on that page (L29), not a universal established outcome. Primary manga verification remains open. |
| C3 | Transparent World rev 127620 gives a mark-centered overview yet includes Tanjiro's pre-mark Daki example | **[PROPOSAL]** Do not turn the mark into a universal hard prerequisite |
| C4 | Total Concentration Breathing rev 127065 has anime-only feats mixed with manga citations | **[PROPOSAL]** Claim-level medium tags; manga baseline only unless branch opts into anime corroboration |
| C5 | Demon rev 130890 says demons were originally human (L42), describes Muzan blood converting humans (L44–54), then says Tamayo scientifically converted Yushiro and also transformed her cat Chachamaru (L56) | **[PROPOSAL]** Preserve the human-origin/general recipient wording beside the animal example as a narrow eligibility conflict. Keep Tamayo's scientific route separate from Muzan blood exposure; do not generalize either into a universal conversion formula. Primary verification remains open. |
| C6 | Wiki snapshot ends 2023-12-19; later anime seasons and later revisions are outside evidence | **[PROPOSAL]** Leave as explicit gaps; do not fill from memory |
| C7 | Character and narrative notes may contain speaker assignment or omitted-condition errors; SPOTCHECK_1 patterns P2/P3 | **[PROPOSAL]** Core laws checked directly against payload; all conditions/speakers require page-local verification before implementation |
| C8 | The assigned 353 retained rows, two scope supplements, 27 noncharacter restorations, nine empty-input restorations and all 38 named audit entries are complete; the 962-page inventory, unexpanded/transcluded content and underlying source material do not establish exhaustive mechanic coverage | **[PROPOSAL]** Record the named assigned restoration audit as complete, while keeping broader page/content completeness and primary-source verification open |

No claim is assigned to anime/game/novel/fanbook merely because a mixed character article contains it. Note the cited medium per row. Source references: [SPOTCHECK_1](../../gm/dispatch/wiki-lanes-2026-10-13/SPOTCHECK_1.md), [digest](../../research/power-systems/wiki-digests/DIGEST_demon-slayer.md), [notes](../../research/power-systems/wiki-digests/full-dumps/workers/demon-slayer-full/NOTES.jsonl).
