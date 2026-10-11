# Coverage and limits

2026-10-10, targeted section C source pass complete. Every source claim in
FINDINGS has a label. No runtime check was allowed by this assignment.

## Machine extraction, seen in data or code

| Layer | Inventory / extraction | Meaning |
|---|---|---|
| KEY | All entries indexed; unique case-insensitive (resref,type) identities | Locates resources, not semantic understanding |
| English TLK | 106854 string entries decoded, bounds checked | Searchable text, not 106854 strings read |
| DLG | 854 parsed; 16201 states; 46393 transitions; zero parse exceptions | State text, flags, state/response triggers, actions, journal references and next links recovered |
| BCS | 2222 resources exported as compiled textual token streams | Partial targeted opcode annotation using installed IDS; not a complete decompiler or native method recovery |
| IDS | 89 exported | ACTION/TRIGGER and animation identifiers used for selected checks |
| 2DA | 146 exported | ALIGNMNT, DEATH and ENGINEST sampled, not every row reviewed |
| ITM | 730 item-name/description records decoded | Names/descriptions read for selected objects; effects/abilities not decoded |
| INI | 286 extracted from resource type2050 | Return/party routing sections and selected death-related fields inspected |
| Native application/media/other languages | Inventory only | Native engine execution and audio/visual presentation opaque |

Receipts: `~/.codex/research/planescape-torment/EXTRACTION_RECEIPT.json`,
`INI_RECEIPT.json`, `RETENTION.json`. The Python reader follows documented
[KEY](https://gibberlings3.github.io/iesdp/file_formats/ie_formats/key_v1.htm),
[BIFF](https://gibberlings3.github.io/iesdp/file_formats/ie_formats/bif_v1.htm),
[DLG](https://gibberlings3.github.io/iesdp/file_formats/ie_formats/dlg_v1.htm) and
[TLK](https://gibberlings3.github.io/iesdp/file_formats/ie_formats/tlk_v1.htm)
layouts. It reads only indexed slices in place. Each retained raw resource
has a source container offset, size and SHA256, plus a retained-file SHA256.
No install copy, media extraction or writes over200MB occurred.

Qualification: header signatures, resource type matches, slice lengths,
TLK bounds, DLG code-string bounds and state response ranges were checked.
Spot reviews matched source text and actions across DMORTE, DDEATHAD,
DFINNOTE, DINCAR1 and BSPHERE. Initial BCS/IDS type IDs were wrong and
corrected before accepted receipts; incorrectly exported private files were
removed. A startup GAM briefly misidentified as INI was discarded; it is
not evidence for this audit. DLG parsing and retained-resource hash checks
are verified. Native fidelity is not established by parser success.

## Semantic review ledger

These are targeted nodes/ranges inspected in context, not whole-resource
semantic completion. Cross-resource prerequisites/effects/consumers are
traced in FINDINGS. Additional search hits were discovery inputs, not
independent findings unless cited there.

| Resource | Reviewed subject and bounded locators |
|---|---|
| DMORTE | Body directions, missing journal, journal reminders, old betrayal: S13/S34/S35/S259/S443/S446-S448/S650/S651/S699/S720 |
| DDHALL | Repeated arrival, faction doctrine, secrecy and collection cycle: S7/S10-S24/S39/S52 |
| DDEIONS | Memory-loss warning, local substitution threat and acquired resurrection: S25/S66/S67, T203/T220 |
| DNORDOM | Current death-memory counterexample: S111-S115, T355/T358/T363-T368; other INT/WIS search samples |
| DRAVEL | Separation bargain, imperfect recollection and shadows: S11/S15/S23/S107-S119, T33 |
| DTRANS | Memory retention, links, containment, self-destruction threats and true name: S2-S9/S26-S38/S84/S89/S101/S126; T1-T4/T72/T74/T79/T99/T146/T149/T156-T160/T168-T169/T176/T183/T191-T195/T207/T209/T212/T216/T242/T257 |
| DINCAR1 | Domination, bodily instructions and merge: S14/S16/S19/S42-S44/S49/S52/S53/S61/S70-S74; T12-T16/T78-T80/T157/T158/T171 |
| DINCAR2 | Identity conflict, language alternative, physical merge benefits: S22; T26/T76-T78/T84/T101 |
| DINCAR3 | First-self identification, reason for bargain, merge flag/rewards: S5/S15/S31-S35; T53-T58/T63/T67/T71/T73 |
| BSPHERE | Entire 13-state/15-transition object interaction reviewed, especially absorption prerequisite, spend/refuse, reward, true-name flag and symbol |
| P_JRNL | Recognition and trap stages, unread language and unreliable author: S0/S12-S18/S27; T4/T5 |
| DFINNOTE | Entire 3-state/4-transition language-note interaction |
| DFINAM | Living linguist's limits: S3, T4 |
| DF_SS_DE | Recorded legacy and recollection variants: T35/T36/T67 |
| DDAKKON | Promise, old group, memory and class transitions: S97/S167/S215/S277/S329/S330; T920/T1009/T1012/T1197 |
| DFELL | Arm, translation certainty and tattoos: S18/S19/S53-S69/S76/S85; T75/T76/T83/T84/T506/T513 |
| DJOLMI | Paid stabbing stages: T24/T26/T28/T30 |
| DDEATHAD | Death lecture, demonstration and intention-scored threats: S4/S5; T121/T136/T142/T143 and next-state linkage |
| DINSCR6 | Historical amnesia inscription S0 |
| D0202P | Historical regrets gated by prior acts: T14-T22 |
| CUBE | Playful arm-wave Law changes: T1/T7-T10/T28 |
| DVHAIL | Confession and displaced-death statement: T492/T518 |
| DYI'MINN / DUDESIRE | Offered memory recovery and desire manipulation: DYI'MINN S20-S22; DUDESIRE S17/S20. Not verified as honest recovery services. |
| AR1201.BCS | Death-band shadow selectors CR2/4/6/8/10/12/14/16 |
| 0000NFRD.BCS / 0109GRD1.BCS | Die() samples and incremented death/moral globals, not full actor scripts |
| AR0202 / AR0500 / AR1200 / AR1201 / AR1800 INI | nameless/namelessvar and selected spawn headers; no claim of whole spawn execution |
| OLDARM1 / P_JRNL / BSPHERE / TTSILENT / TTWEEP / TTWASTIN / TTLOSTIN / TTDEATHI ITM | Display descriptions, no effect pipeline proof |
| ALIGNMNT / DEATH / ENGINEST 2DA | Generic alignment/class table and death/string lookup samples; DEATH is a voice-response matrix, not a resurrection policy |

## Unread or opaque

**Seen in data or code:** the extracted corpus contains far more dialogue,
quests, areas and effects than the ledger reviews. Most resources remain
semantically unread. CRE, ARE, SPL, item effects, UI layouts, audio, map art,
other languages and the native executable were not decoded for this pass.
No full alignment-score classification function was recovered. No save-file
format or compression claims are made; user saves were never inspected.

**Inferred limits:** static next-state linkage does not prove every branch is
reachable in the executable, all flags are initialized as expected, an action
is correctly implemented, or a once-only named action is bug-free. INI death
routing is corroborated by format documentation, not browser/native play.
Full current-build resolution of the documented EE multiple-spawn-group caveat
is not verified; see the [format caveat](https://gibberlings3.github.io/iesdp/file_formats/ie_formats/ini_spawn.htm).
That caveat is not asserted as a measured bug in build25492483.

**Seen in text:** official manual claims are marked as documentation, including
ordinary item/stat retention and permanent ending examples. They do not
replace installed-build evidence. No player complaint survey was read.

## Completion and follow-on gates

All assigned questions have evidence-bounded answers; eight proposals and
25 small touches are saved. Source extraction and source-locator validation
are the completed gates. A future selected implementation needs a rebuild,
fresh-origin browser proof and save/reload/import for persistence. There is
no gameplay implementation or playable acceptance in this audit.

The game remains installed. Relevant raw slices and decoded text are retained
privately; the full executable and media are not. Future native reverse
engineering would require the install again after removal. Weibao manages
uninstall; this source pass has no outstanding extraction consumer.
