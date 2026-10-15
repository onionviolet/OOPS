# Aspect tooling and evidence

No installs, clones, downloads, web calls, game launch, original assembly execution, save/cache/bottle access, installation changes, agents or Git staging/commit/push. Only this new aspects directory was written in the repo. Source read/decompilation is passive; ILSpy reads managed files and does not run the target game.

## Reused inputs, read-only

- `/Users/weiwei/.codex/research/academagia-decompile/extract/`: original full base/patch decoded JSON, all six decompiled assemblies, headers/deletions and hash ledgers. Prior `notes/UI-types.txt` supplies UI class names. No finished binary reader/decompile was rerun.
- `/Users/weiwei/.codex/research/academagia-2/extract/`: full mechanical maps and club candidates from this session's first pass. Not changed.
- Both prior public dossiers, COMMON/ASPECTS, PROJECT top summary and USER_VISION save-deep-details/desktop/world priorities. No live owner edits.
- Installed `Academagia.UI.dll` read only for three previously unread types. Original installed app/build identity remains prior recorded evidence, not a refreshed Steam state claim.

New work root: `/Users/weiwei/.codex/research/academagia-aspects/`. Source paths in the report are relative to the original prior extract unless explicitly described as new UI types.

## Targeted UI decompile

Using the existing .NET SDK/ILSpy from prior TOOLING, set DOTNET_ROOT and PATH, then run:

```sh
DOTNET_ROOT="$HOME/.dotnet" PATH="$HOME/.dotnet:$HOME/.dotnet/tools:$PATH" ilspycmd -t Academagia.UI.Views.Storyline.FlowDocExtractor "/Users/weiwei/Library/Application Support/Steam/steamapps/common/Academagia The Making of Mages/Academagia.UI.dll" > "$HOME/.codex/research/academagia-aspects/extract/FlowDocExtractor.cs"
```

Repeat for `Academagia.UI.Views.Storyline.Storyline` -> Storyline.cs and `Academagia.UI.Views.Storyline.StoryLineDataContext` -> StoryLineDataContext.cs. All three corrected commands exited zero. ILSpy emits some unresolved-IL/type comments for WPF references; this is source reading, not a rebuild or verification of binary fidelity. The original UI binary and output files are hashed privately.

## Census and private detail preservation

```sh
python3 -I /Users/weiwei/.codex/research/academagia-aspects/tools/census.py
python3 -I /Users/weiwei/.codex/research/academagia-aspects/tools/refresh_inventory.py
python3 -I /Users/weiwei/.codex/research/academagia-aspects/tools/write_aspects.py
python3 -I /Users/weiwei/.codex/research/academagia-aspects/tools/verify.py
```

census.py reuses base and overlays modified/new records by GUID for each patch separately; no deletion application because the previously source-traced reader ignores the shipped List<Guid> object. It inventories every source class with System suffix plus ActionScheduler/SystemObjects/GameController, each namespace directory and all 112 table types. Source line/type counts are size signals, not reviewed-method or gameplay counts.

It exports private gzip reference-text corpora for base and all four patch streams, preserving nonempty full text/description/title/method/practice/talent fields, original record IDs and available actor/gate/parent references. It keeps stream layers separate and does not assign speakers. Those copies include embedded content wrappers and possible embedded media strings; they stay outside Git. Existing corpus files are reused by the rerun rather than recopied. Full typed rows/conditions remain in the prior private data. A changed input requires a new explicitly named corpus version rather than silently assuming an existing copy is refreshed.

refresh_inventory.py uses the already generated census counts to refresh only source registration/serializer labels and the inventory. write_aspects.py produces the twelve fixed-key rows and prose. Other digests/report/checkpoint were authored directly as paraphrase.

verify.py checks output shape/status values, actual source file presence, private corpus decompression, IDs/field counts, registry counts and the exact 47-field serializer order. It checks no raw HTML/narrative wrapper appears in public docs. HASHES.txt records newly produced files, scripts, private references, five reused content streams and the UI assembly. No user saves are fixtures.

## Corrections and limits

| Tooling issue | Fix |
|---|---|
| Initial targeted path used UI.dll | Listed actual installation files; exact assembly is Academagia.UI.dll. The three initial commands failed before decompile; corrected reads succeeded |
| Serializer field map initially keyed by type instead of field | Inverted the mapping, refreshed inventory and checked every saved position plus the sole registration-only AllowanceSystem |
| Guessed RumorImpl/Combat.cs paths did not exist | Used rg --files to locate actual namespaces/helpers; rumor-selection and full combat math remain unread rather than filling a guessed route |
| Article/NamedText appeared in the schema but had zero rows | Recorded zero rows and narrowed narrative claims; 20 newspaper issue records are not proof of delivered articles |

Raw writing is private. We retained deep source detail, not copied implementation or a direct adaptation. No login/fetch error or native app interaction occurred. All native UX, real corruption/migration and selected cache/player-state behavior remain unverified.
