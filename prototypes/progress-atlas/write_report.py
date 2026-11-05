from pathlib import Path
import json,re
import argparse
R=Path(__file__).resolve().parents[2];W=Path(__file__).resolve().parent
parser=argparse.ArgumentParser(description='Generate an atlas report draft without overwriting the reviewed report.')
parser.add_argument('--data',type=Path,default=W/'atlas-data.json')
parser.add_argument('--out',type=Path,default=W/'generated/report-draft.md')
args=parser.parse_args();d=json.loads(args.data.read_text())
def esc(v):return str(v).replace('|','/').replace('\n',' ')
def link(s):
 p=re.split(r':(?=\d)',s,1)[0]
 return f'[{s}](../../{p})' if (R/p).exists() else '`'+s+'`'
def table(items):
 out=['| ID / area | Current footing | Gap / consequence | Next useful outcome | Evidence owner |','|---|---|---|---|---|']
 for x in items:out.append('| '+' | '.join([esc(x['id']+' '+x['name']),esc(x['state']+'; '+x['now']),esc(x['gap']),esc(x['next']),'; '.join(link(s) for s in x['source'])])+' |')
 return '\n'.join(out)
text='''# Refined YAIR atlas: foundations, worlds, gaps and next work

2026-11-04. Dated assessment and proposals using progress-atlas and more-to-consider.
This is a broad view of existing owners, not a new product specification or queue.
Current direction remains LOTM first, Harry alongside, mechanisms plus display
leading their actual book consumers, and book worlds/menus receiving depth.
AD52/ACR1–ACR14 now governs repeated-activity compression with choices and
consequences retained; bounded delivery does not impose a short campaign target.

## What the picture means

- **F1:** YAIR has substantial reusable execution, state, making and presentation machinery. The uneven part is how deeply actual lives consume it: a strong engine can still support a thin journey.
- **F2:** The biggest practical gaps cross several layers. Actual means, a supported action, its cost/result, the next useful consumer and retained state must join. More isolated modules do not by themselves close that chain.
- **F3:** Recent progress changes the old map. Conversation consequences and retained-place identity have named joined fixture receipts. L2b health publication now has a later AD43 closure receipt; the interrupted 2026-10-31 status and PROJECT's below-floor wording are stale for that specific slice. Ordinary combat, injury/witness aftermath and legacy display limits remain separate.
- **F4:** Worlds make later worlds easier through specific capabilities, not whole-world resemblance. Shared payment, knowledge, preparation, clocks or reset boundaries reduce duplicated work; they do not author local law, content, upper-range powers or meaningful ordinary life.
- **F5:** The paid-work owner closed both-host fixture proof during this assessment. The immediate recommendation is N2 through the next already-owned Klein/Harry practical operation, with an exact workpiece or receiving consequence where that operation needs it. Future contrast cases remain opportunities, not a replacement world order.

## Scope and evidence

Broad coverage: all 48 maturity rows in the current systems front door are
accounted for below and grouped into the existing U01–U15 foundation vocabulary.
Ten current-world groups are summarized; the donor catalogue's 24 named entries
are retained as a separate future/signature inventory. E1–E10, FN1–FN6 and N1–N5
supply existing proposal identifiers; G1–G8 retain the earlier atlas gap family.
Mappings between them are this report's explanatory synthesis, not new rules.

Current source inspection was bounded: book-start composition; pack-save writer
and continuation carry; conversation knowledge/result projection; authored paid
cancellation policy; D&D composition; actual source references for selected ritual
supplies and firearm shot resolution. Other breadth comes from named owners and
dated receipts, with no fresh runtime validation implied. This is not full-source,
full-lore, every-world or every-player-route verification. Input identities and
closure drift are recorded in `work/progress-atlas-refined-2026-11-04/`.

Reference HEAD: `aef3cb1f81008e1eb815e57a703974d2447079eb`, with extensive concurrent
dirty/untracked work. A commit does not identify those inputs. No private save,
private pack contents or sealed truth was read for this assessment. No product
build, product tests, gameplay replay, installation, worktree cleanup, merge,
commit or push was performed. Interactive-map inspection is separate proof.

## Foundations

The native maturity words establish recorded use and unevenness, not universal
AD43 completion. An aggregate U family can contain working and unassessed parts.

'''+table(d['foundations'])+'''

## Worlds: existing footholds and depth

These rows distinguish a registered life, bounded journey and broader campaign.
The KJ3AC and HP W4 endpoints are receipt-specific, not proof of the current
combined installed game. The later tracker records 31 Klein slices/481 selected
stages at KJ3AC; PROJECT retains an older 28/431 subtotal. Neither is a campaign
completion denominator. Detailed lore/source acquisition was not re-audited.

'''+table(d['worlds'])+'''

## Gap intersections

Connections identify which parts to inspect together, not a degree-based priority
score. U06/U09/U11/U14/U15 meet at several valuable joins: know, obtain, do, keep,
and understand the result. A gap has no authority to become a universal gate.

'''+table(d['gaps'])+'''

## What to work on next

Recommendations, not a new implementation dispatch. Existing writers retain
ownership. The paid-work owner now records completion of its named fixtures. A1 selects a real
receiving operation through the current campaign owner; A2–A4 are relevant facets
or later consumers, not three mandatory new projects or a new world order.

'''+table(d['actions'])+'''

## What would make later worlds easier

All receiving-world edges below are documented hypotheses or bounded study
pressures. They are not claims of completed portability. The strongest near-term
opportunity is using two already-selected worlds to challenge a shared boundary.
The more distant setting resemblances need more qualification.

'''+table(d['leverage'])+'''

### Complexity stays visible

Use the existing C1–C7 dimensions: source/law; distinct operations; composition;
local content/ordinary life; upper-range scale; lifecycle/compatibility; and
presentation/proof. Keep interest, acquisition readiness and leverage separate.
A school toolkit may reduce scaffolding while leaving most curriculum, social
life and magic to author. A reset toolkit may retain a snapshot while getting
memory recipients or physical aftermath wrong. A drawing/making toolkit still
needs its own source-qualified grammar and material consequences.

## More to consider: this atlas pass

| ID / disposition | Consequence and action | Reopen trigger / suggested effort and done check |
|---|---|---|
| M1 ACT NOW, done | Correct the map's historical health/no-maturity assumptions. Use later named receipts; distinguish the completed conversation/place fixture from newly pending work. PROJECT's L2b wording remains documentation drift, not a request to repeat the health implementation. | This assessment; complete when old and current states are explicitly separated. |
| M2 ACCOUNT FOR NOW | Pending jobs, source arrival, costs and retained learning now have bounded both-host proof. Preserve exact identity checks; source readiness does not prove staged consumption or every missing-source recovery route. | Next real receiving consumer; medium slice, its actual spend/support law and affected round trip. |
| M3 ACCOUNT FOR NOW | A method, a physical/bodily carrier, sufficient reserve, practiced control and institution permission are different inputs. Naruto/Witch Hat study pressures can improve Klein/Harry now without first building those worlds. | Next N2 operation; medium bounded implementation if needed, one useful action plus a meaningful changed-condition counterexample. |
| M4 ACCOUNT FOR NOW | Known truth, a remembered belief and current changed reality differ after return/reset. A generic pack-person delta must not silently compete with per-actor knowledge or become a second truth store. | First actual pack-history writer/reader or different reset consumer; medium, observers and world instances retain the correct distinct records. |
| M5 LATER | Ordinary livelihood connects making, stock, time, institutions, housing and relationships. That can deepen the own world and book worlds more than adding unrelated panels. | A selected ordinary-life pursuit; medium–large, a complete work/spend/rest/relationship consequence loop with a useful next session. |
| M6 LATER | Long histories, concurrent jobs and large casts may expose scale limits that early slices do not test. No current performance defect is asserted. | Actual planned upper-range consumer or measured failure; small probe, then owner-scoped repair, named workload and unchanged semantics. |

## Source inventory appendix

Recorded labels below were read from the current systems front door; exclusivity phrasing is shortened here to avoid treating source observations as design rules. Recent
source/focused-test claims remain attributed, not rerun here. 'No map word' is
unassessed maturity, not absent implementation. Some rows still leave an owner
or native journey untraced even when a source path is connected.

| Row | System | Recorded maturity |
|---|---|---|
'''
for x in d['inventory']:text+=f"| {x['line']} | {esc(x['name'])} | {esc(x['maturity'].replace('UI only via','UI via').replace('imported only by','imported by').replace('code only.','code.').replace('UI only from','UI from'))} |\n"
text+='''
## Future mechanism catalogue appendix

These 24 donor/signature entries come from the existing donor study, not new
reading or a future build order. Public mechanism descriptions stay within that
owner's qualification. Naruto and Witch Hat have later bounded primary-window
study notes; that does not establish full-world source coverage.

| Entry | Proposed mechanism | Distinguishing candidate use |
|---|---|---|
'''
for x in d['candidates']:text+=f"| {esc(x['name'])} | {esc(x['mechanism'])} | {esc(x['test'])} |\n"
text+='''
## Checks and remaining limits

The local-link/data-coverage and headless visual results will be appended after
inspection. Close-time source drift and the paid-work/AD52 refresh are recorded below. No fresh product behavior or release proof is claimed. This report
retains current owner links rather than changing their acceptance or priorities.
'''
args.out.parent.mkdir(parents=True,exist_ok=True)
args.out.write_text(text)
print('Wrote report with',len(d['inventory']),'system rows and',len(d['candidates']),'donor entries.')
