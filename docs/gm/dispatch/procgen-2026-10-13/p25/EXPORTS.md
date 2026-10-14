# P25: hero wiki, light novel and chosen past-save legends

2026-10-14. **PROPOSAL ONLY.** Extends root U1-U3, with E3's export route. No exporter, parser, file picker, private-save access or content scan implementation was run. [P14 CONTRACT](../p14/CONTRACT.md) owns receipts/accounts/editions/legacy traces; [P6 CREATIVE_WORKS](../p6/CREATIVE_WORKS.md) owns in-world work/edition/copy production; [P15 AUTHORING_PIPELINE QA10/QA11](../p15/AUTHORING_PIPELINE.md) and [P18](../p18/) own general disclosure/attribution QA. P25 extends their delivery surfaces and export acceptance cases.

## U0.1: separate reading, files and in-world consequences

A Stories text/Markdown/HTML export is a readable publication artifact, not the existing full save export, a restorable branch or an in-world owned book. A hero wiki page is a projection, not a new factual authority. A player-layer novel does not consume paper or earn fame. Producing/selling a physical book, performing a ballad, gaining narrative power, replaying a ghost and entering an old branch use [P6](../p6/CREATIVE_WORKS.md), [P14](../p14/), [P17](../p17/) and [P16](../p16/) respectively, with real means/receipts. These routes remain reachable separately and can compose after their owners are selected.

Take one immutable observer-safe snapshot and selected editions for preview/download. A new gameplay event arriving while the preview is open does not quietly alter its file. Show **as of** scope and sequence/date; explicit Refresh prepares a new candidate. Proposed MVP formats: plain text and Markdown, with accessible HTML/print view as a later sibling format. EPUB/PDF are later rendering choices, not gates for the first readable export. No external service is needed. Any optional prose API remains separately opt-in under P15; exporting never authorizes transmission or publication.

Logical export manifest: artifact/edition ID, schema/renderer revision, world/continuity/life/branch scope, coverage, observer/audience policy and spoiler setting, selected safe receipt/claim refs, attribution/locator entries, format and hash of final serialized bytes, scanner versions/status and snapshot identity. This is artifact metadata, not a new game save owner. A public-safe manifest omits private paths, hidden IDs, private seed/alias mappings, restriction reasons and suppressed-entry totals. Opaque agent secret IDs may be used only in private/internal checks or ID/status reports; public files should not advertise an undiscovered secret's existence.

## U0.2: one export gate for every format

Applies to wiki files, novels, chapter extracts, recaps, timeline tables, map captions/SVG, annotations, citations, manifest sidecars and legend capsules. An optional rich format cannot bypass it. The current **full save** remains a private gameplay backup; this proposal does not retrofit a disclosure scan onto that different contract or call it safe to publish.

| Gate | Proposed check on the actual candidate bytes | Failure/degradation |
|---|---|---|
| X1 disclosure | Project permitted records before selection/ranking. Trace all text bindings and derived outputs; enforce secret discovery route, intended audience, character/player lens and spoiler horizon. Locally check private restricted canaries/variants plus semantic review. Include title, filename, TOC, infobox, alt text, links, search metadata, SVG labels, footnotes and sidecar. | Block unsafe candidate; offer a separately regenerated simple safe summary. Public diagnostics: check ID/status only, no answer, excerpt, hidden count or alias reason. |
| X2 canon prose | P15 provenance allowlist: original summaries and approved generated/player text only. Locally compare to selected canon corpus for exact/normalized copied spans and reviewed similarity; exclude raw canon quotations and private-note text, even if already present in old saves. | Remove/replace with original summary plus safe locator and revalidate; uncertain spans stay unapproved. Scan errors/unavailable source review do not mean PASS. |
| X3 evidence | Every factual clause maps to safe actual receipt/claim, with SHOWN/STATED/INFERRED, speaker and uncertainty where relevant. Preserve contradiction/correction/coverage, distinguish background, canon expectation, premise and lived outcome. | Simplify or label the literary invention; no fake dialogue, cause, date, death, romance or capability. |
| X4 delivery | Validate inert serialized format, escaping, size, stable receipt links, safe filenames and offline readability. HTML contains no scripts, remote assets/tracking, executable handlers or auto-fetch citations; treat imported/player notes as untrusted text. Locators are plain safe metadata when links would disclose restricted info. | Fall back to text/Markdown if rich packaging fails; never export a partially reviewed rich file. |
| X5 freeze/review | Show preview of the same byte-hashed candidate subsequently downloaded. Freeze spoiler/lens/scope/annotation choices; final serializer output and all packaged assets must pass X1-X4. A changed snapshot/config requires a new review. | No download of stale/unscanned bytes. Keep draft locally; failed file creation does not mark it delivered or alter game state. |

These are proposals for bounded deterministic checks plus human/source-qualified review, not a claim that keyword scans prove secrecy or paraphrase legality. Use synthetic canary fixtures publicly; real sealed material stays local and is never echoed in reports. Detection that needs an unavailable source corpus reports **review unavailable** for that candidate. Original receipt-only export can remain reachable if it uses qualified original templates and no unreviewed imported prose. Do not force library access merely to export an original Village recap.

## U1.1: a receipt-backed hero page

Reach through Stories > Hero page. Offer **My journal** and **In-world account** lenses, both constrained to authorized evidence. An in-world page has a named/qualified compiler or institution and audience; it can report beliefs/rumors only with attribution. Player knowledge does not become village public knowledge by clicking a lens. Becoming a real distributed wiki/book belongs to P6/P11 circulation, rather than this preview.

```text
1366x768: Stories > Hero page   Lens [My journal v] [Export preview]
+------------------+----------------------------------+--------------------+
| Infobox          | Hero's known life                | Evidence / sources |
| Known name       | Overview (2-3 supported lines)   | SHOWN: R17         |
| Life / branch    | History (dated sections)         | STATED: C2, speaker|
| Last known place | Relationships (dated, directed)  | INFERRED: note N3  |
| Known role       | Pursuits / learned methods       | Contradiction C2/C3|
| Coverage         | Trivia (supported small moments) | [Inspect basis]    |
|                  | Corrections / unfinished matters | [Print / text]     |
+------------------+----------------------------------+--------------------+
```

At 1600x1000 keep infobox and readable body width; grow the evidence/source column and visible section navigation. No inferred portrait, age, species, private allegiance, quantified power rank or complete partner list. Use known life/body/occupant identity from the proper owner; an old body's deeds do not silently belong to its next occupant. Directed relationship evidence does not mean reciprocal affection. Office/rank, source possession, competence, reputation and title are separate fields.

Trivia selects ordinary supported details, such as a repeated visited workshop or a recorded favored activity, with conservative wording. Three visits can mean **visited three times**, not **favorite place**. Lore-flavored formatting is optional; it does not justify a wiki's confident omniscient tone. Corrections retain the earlier attributed claim and new evidence. A world with belief-changing reality still needs its own qualified consequence owner.

| Missing data | Hero page degradation |
|---|---|
| Unknown birth/age/end | Omit or **not recorded** when the field is a normal expected field; no age estimate, no death from absence |
| No relation receipts | No relationships section; do not expose hidden-field counts |
| Lost detailed history | Display approved legacy summary with coverage label; no fabricated infobox statistics |
| No in-world compiler/audience model | My journal stays available; proposed in-world layout preview is labelled editorial, not published testimony |
| Missing pack or source horizon | Retained permitted original summary only; unknown/source unavailable stays distinct from canon contradiction |

## U2.1: a light-novel style reading export

Offer a title page, scope/coverage note, chapter contents, cast of introduced people, episode titles/recaps, selected factual scenes, unresolved threads, and optional evidence/attribution appendix. The output can be enjoyable without pretending a recap is full newly generated dialogue. Default proposed style: short third-person summaries with factual scene detail. First-person journal, illustrated chapter cards, screenplay and serialized volumes are compatible optional renderings; no forced genre choice changes the source history.

Modes compose: **documented chronicle** uses only supported clauses; **literary treatment** can add clearly labelled nonfactual sensory/transitional texture if P15 validates it, while factual clauses remain mapped. Invented speech/motives and alternate endings require an explicit separate fiction section with no claim of recorded gameplay. The authoring pipeline supplies originals, never rewrites a novel's paragraphs into the hero's name. P13 canon/source-summary sidebars use work/creator, edition, chapter/member/paragraph or reviewed wiki revision/section locator and mode; no raw prose.

```text
Export preview: Light novel  [Text | Markdown | Print proposal]
Scope: life L1 / branch B1    Coverage: partial    Lens: My journal
+----------------------+-----------------------------------------------+
| Contents             | Title: Work beside the river                  |
| 1 Recorded beginning | Chapter 2: The repaired cart                  |
| 2 The repaired cart  | Original summary from completed receipts ...  |
| 3 Unfinished work    | [Show sentence basis]                         |
| Cast / Sources       | Corrections retained; earlier interval absent |
+----------------------+-----------------------------------------------+
Scans: disclosure [status] canon prose [status] evidence [status]
[Refresh candidate] [Download reviewed file]    No publication action
```

At 1600x1000 expand source drawer beside the reading column; at 1366 keep contents + reading and an optional source drawer. A printable view hides buttons and repeats chapter headings, while preserving basis/coverage footnotes. No portraits/art copied from source works. Any optional generated artwork receives only safe projected inputs, attribution and X1-X5 scans, including captions and metadata.

| Missing data | Novel degradation |
|---|---|
| No literary renderer | Deterministic chapter titles and factual recaps remain readable |
| No stored dialogue | Summarize the recorded exchange as an attributed account; no quotation marks around invented words |
| Sparse/quiet interval | Short interval chapter, or player-chosen grouping; no compulsory climax |
| No exact dates | Relative producer order with clock labels; no false date conversion |
| Too much history | Select volumes/time windows with explicit coverage and safe appendices; no silent loss labelled complete |
| Rich output unavailable | Reviewed text/Markdown; EPUB/PDF remain future choices |

## U3.1: player-chosen old file, reviewed legend capsule

Reach through Stories > Legends > **Choose past-save file**. The player selects a particular local file through the native file input. No directory scanning, save-slot enumeration, automatic localStorage discovery, Downloads access, remembered path reopening, cloud sync or background search. File choice authorizes parsing that file for this preview, not loading it into the running game or importing every contained branch. Closing/cancelling clears the staged payload; no effect on the source file/current save.

Proposed flow: select file → decode/validate on a detached local model → choose one life/branch and supported retained evidence → preview a safe legend capsule under destination law/audience/spoiler settings → X1-X5 → explicit **Add this legend** → durable receipt in the destination history owner. Capture actual source version/coverage and export hash for provenance without displaying path or private payload. Duplicate exact capsule delivery is idempotent; later evidence or distinct legends can be admitted under local repeatable/generous/ancestral/ritual-bound adjectives, with no fixed once cap.

Do not invoke the ordinary live load/import routine for extraction: it can hydrate runtime/native/storage state. Reuse its version validation only through a verified pure decoder. Bound input size/depth/arrays, reject executable/HTML content as code, validate supported versions before extraction, and never replay effects/controllers/events from imported definitions. A forged user file can author fiction but cannot certify prior play, grant item/power ownership, establish canon kinship or make a false deed earned. Provenance labels mean retained local receipt evidence, not an anti-cheat or authenticated competition claim.

```text
Legends: [Choose past-save file]
+-------------------------+---------------------------------------------+
| Selected file, temporary| Preview: a remembered local repair          |
| Supported life L1       | Origin: chosen past life / other branch     |
| Branch B1 / partial     | Destination: original local account         |
| [Select known interval] | Evidence coverage + compiler/audience       |
| [Cancel / clear]        | [Basis]   [Add this reviewed legend]         |
+-------------------------+---------------------------------------------+
```

At 1600x1000 expose a side-by-side source-summary/destination-account comparison. At 1366 keep selection and preview visible; raw source/save details never appear. Unsupported source revision, ambiguous life identity, no adequate receipts, scan failure or incompatible destination produces a neutral explanation and no mutation. Safe legacy text can be a clearly labelled player-provided tale after review, not exact history. No file selected is an ordinary empty state, not a prompt to search private folders.

## U3.2: legends, ghosts, ancestors and continuation stay distinct

Initial slice proposes an attributed legend/account only. Its fact is **this account was imported/received**, not **the old hero lived in this current timeline**. Linking an existing ancestral relationship needs a source-qualified branch/genealogy owner; selecting ancestor cannot mint a canon relative. A ghost needs P16 identity/body/agency/presence and supported interaction. Past-self NPC replay requires full actual retained behavior/means and timeline rules. A preserved playable branch uses the timeline archive contract, not a novel file. All remain selectable future routes, with declared missing dependencies rather than either/or exclusions.

After admission, a willing in-world custodian may relay the safe account through [P11 N5/N6](../p11/INFORMATION_AND_LIBRARIES.md), or a physical legacy work can be made through P6. Those are real publication/custody/channel operations. A literary preview alone creates no listeners, renown, sponsorship, bloodline, stock or story power. Supported belief-powered worlds use P17's actual audience/assessment receipts, and retain differences between source deed, imported account and destination belief.

## U0.3: future proof, all OPEN

X1-X5 must run on every chosen format's final bytes and packaged assets. Test undiscovered and legitimately discovered synthetic seals, private aliases, canon-copy canaries, player notes, file/TOC/ARIA/metadata leaks, contradiction updates, absent pack, old lossy save and unsupported revision. No answer-bearing scan output may enter public evidence. Exact preview/download identity and deterministic title/recap persistence are separate from prose quality review.

Natural rebuilt journey at 1366x768 and 1600x1000: earn a deed → inspect hero page → select episodes → review/download a safe novel → open file offline and inspect basis. U3 uses a deliberately created disposable **player-chosen test file**, never Weibao's private saves: parse/preview → cancel → no mutation; select again → Add legend → one safe destination account; failed write preserves source and destination. Save/reload/Export/literal-file Import compare editorial refs, known basis, scopes, next gameplay draws and legend admission, without awarding old money/items. Human fiction/format acceptance stays OPEN independently.
