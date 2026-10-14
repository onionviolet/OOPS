"""Render the reviewed row table and integration routes; only writes r9/."""
import collections
import json
import os
import re
from pathlib import Path

LANE = Path(__file__).parent
rows = json.loads((LANE / 'ROW_DISPOSITIONS.json').read_text())
baseline = {r['code']: r for r in json.loads((LANE / 'ROW_INVENTORY.json').read_text())}
counts = collections.Counter(r['relation'] for r in rows)

def clean(value):
    return str(value).replace('|', '\\|').replace('\n', ' ')

def link(path, line):
    relative = os.path.relpath(path, LANE)
    return f'[{path}:{line}]({relative}#L{line})'

table = [
    '# Part 22 sections 8-20: per-row dedupe table', '',
    '2026-10-14, R9, prefix D. Proposed integration dispositions only. Part 22 was not edited by R9.', '',
    f'**D60: all {len(rows)} rows covered.** ' + '; '.join(f'{count} {kind}' for kind, count in counts.items()) + '.', '',
    '`duplicate`: cite the older semantics instead of restating them. `refines`: keep only the concrete application/delta stated here, then merge under the compact outline. `contradicts`: reconcile a clear authority conflict or keep a source/balance choice flagged for Weibao. The label also includes unqualified wording that would contradict a fitting existing option; it does not claim a runtime bug. `no demonstrated overlap`: keep qualified, not a claim of originality. `source metadata retained`: preserve R1 evidence and open gaps.', '',
    '**D61: current text, baseline evidence.** Thirteen rows changed through peer R2-R5 integration while R9 ran. Rows marked `peer update` use the reread current wording. The initial inventory remains available for audit history. All owner lines below were checked against the final readable files; E2 line locators were shifted after its new status block. Exact line references are evidence, not a replacement for durable owner headings.', '',
    'The required corpus was searched for every coded row. Mechanical keyword hits in SEARCH_EVIDENCE.json are discovery leads only. The relation and reason below are manual judgments. A general related owner is not certification of the source-world facts or of implemented gameplay. Related same-day owners remain proposals where so labeled.', '',
    '| Audit code | Part 22 row:line | Older owner / evidence file:line | Relation | Recommended action and retained delta |',
    '|---|---|---|---|---|',
]
last_section = None
for row in rows:
    if row['section'] != last_section:
        if last_section is not None:
            table += ['', f'## Section {row["section"]}', '', '| Audit code | Part 22 row:line | Older owner / evidence file:line | Relation | Recommended action and retained delta |', '|---|---|---|---|---|']
        last_section = row['section']
    update = ' (peer update)' if baseline[row['code']]['text'] != row['text'] else ''
    source = f'{row["code"]}:{row["line"]}{update}'
    owner = link(row['owner'], row['owner_line']) if row['owner'] else 'No sufficiently specific older equivalent demonstrated'
    table.append('| ' + ' | '.join([row['audit_code'], source, owner, row['relation'], clean(row['action'] + '. ' + row['reason'])]) + ' |')
table += ['', '## D62: what the row table does not repeat', '',
          'Internal contradictions, reference ambiguity, standing-direction checks, persistence boundaries and peer-resolved defects are in REPORT.md D2-D33. COMPACT_REPLACEMENT_OUTLINE.md D41-D56 groups the retained applications, dials and builds. Duplicate rows remain reachable through their citations and stable-ID redirects, not as removed gameplay possibilities.', '']
(LANE / 'DEDUPE_TABLE.md').write_text('\n'.join(table))

integration = [
    '# R9 integration routes', '',
    '2026-10-14. Claude integrates; R9 writes only this lane. Do not apply an audit as new accepted design.', '',
    '**D63:** the lane request explicitly covers sections 8-20, extending COMMON\'s usual 8-12 destination convention. The per-row table below gives the actual original section and a primary 8-12 parent for common-wave routing. Later-section material belongs in the compact application/index proposed by D46-D53; do not paste all its prose into that parent.', '',
    '**D64:** duplicate rows become owner citations and stable-ID redirects exactly as listed in DEDUPE_TABLE.md. Every non-duplicate retained or flagged row appears below. Treat related older proposals as proposals. Keep the 15 R1 source rows qualified and the four no-demonstrated-overlap rows source/metadata-qualified.', '',
    '| Audit code | Correction / consolidation | Primary integration destination | Binding owner or evidence |',
    '|---|---|---|---|',
    '| D5 | Structural validity versus believed/actual feasibility | 9 QA/QR and T10 | docs/worlds/CHOICES_THAT_GATE_CHOICES_2026-10-13.md:13; docs/RULES_FROM_SCRATCH.md:186 |',
    '| D6-D7 | Untaken-offer costs and conditional absence | 8 sources; 9 failure/idle; 12 shelf/resume | docs/worlds/DIALOGUE_AND_INTERACTIONS.md:121; docs/RULES_FROM_SCRATCH.md:190 |',
    '| D8-D11 | Causal canon, quiet late play, scoped death and looper access | 10 QE; 11 QBC; 12 RL | docs/TIMELINES_AND_DIVERGENCE.md:49; docs/RULES_FROM_SCRATCH.md:202; depth part 02:19 |',
    '| D12-D14 | Labels, actual fork, historical snapshot, administrative merge versus power | 12 RB/RS and T19/T20; downstream 13 T25 | docs/TIMELINES_AND_DIVERGENCE.md:68,338,433,461 |',
    '| D15-D17 | Knowledge-filtered names/lists, ordinary discovery logs and honest migration | 9 QA6; 11 ending view; 12 atlas/records | docs/worlds/WORLD_SECRETS_AND_DISCOVERY.md:110,128; docs/TIMELINES_AND_DIVERGENCE.md:25 |',
    '| D18 | Shared thread/run outcome bindings instead of parallel arc stores | 8 generation; 11/12 records; downstream 16 T32 | docs/PROCEDURAL_STORY_AND_CONTENT_CONSIDERATIONS_2026-10-14.md:29 |',
    '| D19 | Four frontiers, adapted endpoint and dates | 11 metadata/frontier | r1/REPORT.md:35; docs/PROCEDURAL_STORY_AND_CONTENT_CONSIDERATIONS_2026-10-14.md:58 |',
    '| D20-D23 | Continuing-self alternatives, local conversion/costs, reachable creation options and archive versus switching | 12 retention/operations; downstream 13-16 | docs/worlds/SELF_AS_PLAYER_LORE_CONSIDERATIONS_2026-10-13.md:7; docs/RULES_FROM_SCRATCH.md:28,168,181,202; depth part 13:33; docs/CHEAT_LIBRARY.md:553,678 |',
    '| D24-D29 | Local cheat test, repeat identity, net prices, actual core demand/estate and complete endgame index | 9 QW; 10 QE/QZ; downstream 17-19 | depth part 28:42; procedural owner:147,383; nonhuman society:218; north star:3608 |',
    '| D30-D31 | Source-only evidence, desktop scope, palette versus causal exclusions | 8 QC; 9/10 surfaces; 12 milestone | AGENTS.md:21; PROJECT.md:307; RULES_FROM_SCRATCH.md:168 |',
    '| D33 | Background past selves and optional changed-branch continuation | 12 RX3; downstream 13 NP5 | docs/USER_VISION.md:2262-2268 |',
    '',
    '## D65: per-row retained delta / flag destination', '',
    '| Audit code | Original row | Actual section | 8-12 parent | One-line integration reason |',
    '|---|---|---|---|---|',
]
for row in rows:
    if row['relation'] == 'duplicate':
        continue
    section = row['section']
    parent = str(section) if section <= 12 else ('8/9' if section == 14 else '10' if section in (17,18,19) else '12' if section in (13,15,16) else '8-12 owner map')
    integration.append('| ' + ' | '.join([row['audit_code'], row['code'], str(section), parent, clean(row['relation'] + ': ' + row['reason'])]) + ' |')
integration += ['', '## D66: already resolved during R9', '',
                'Do not reinstate stale wording in QC4, QBC1, QBC6, RL3, RL8, RB4, RP8, T19, NT10, NE2, NE3, NP2 or NP5. Their current rows were read after peer integration. READ USER_VISION\'s past-self lean before carrying RX3/NP5 into the replacement. Remaining D findings apply only where their problematic wording remains or to future implementation contracts.', '',
                '## D67: acceptance and ownership', '',
                'Docs-only audit is complete. Claude owns integration; the requested part-22 replacement has not been applied by R9. No code/build/gameplay/persistence acceptance, commits or publication are claimed. Clear accepted-direction conflicts can be corrected from owners without asking Weibao to repeat his preference; genuinely unsettled source/clock/economic choices stay flagged proposals.', '']
(LANE / 'INTEGRATION.md').write_text('\n'.join(integration))
print(f'Rendered {len(rows)} row dispositions and {sum(r["relation"] != "duplicate" for r in rows)} retained/flagged integration routes.')
