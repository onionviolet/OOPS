# Private reference routing

The new bulk reference area is [academagia-aspects/extract](/Users/weiwei/.codex/research/academagia-aspects/extract). Full writing stays outside Git under the standing deep-reference rule. No repo-private folder was added outside this lane's authorized output path. The bulk-work-area alternative preserves the writing without changing shared ignore rules or other owners.

| Private artifact | Holds | Context / limit |
|---|---|---|
| reference-text-base.json.gz | Full nonempty text/description/interface fields from base decoded records | Each entry includes source table, byte-hex GUID, field keys and available scene/actor/gate/parent references |
| reference-text-Content-modified.json.gz | Full text fields from Content modified records | A patch layer, not a selected live merged profile |
| reference-text-Content-new.json.gz | Full text fields from Content new records | Same source-layer boundary |
| reference-text-The_Blush_of_Summer-modified.json.gz | Full text fields from Summer modified records | Same source-layer boundary |
| reference-text-The_Blush_of_Summer-new.json.gz | Full text fields from Summer new records | Same source-layer boundary |
| FlowDocExtractor.cs, Storyline.cs, StoryLineDataContext.cs | Three targeted UI decompiles, including renderer/helper literals | Private source reference, not copied implementation or playable proof |
| census.json | Full aggregate inventory/count analysis | Text field counts include descriptions and HTML wrappers, not all dialogue lines |
| HASHES.txt | Source-input, targeted-assembly and new-artifact hashes | Hashes establish bytes, not behavior |

The five text corpora preserve **61,533 text-bearing records and 159,499 nonempty retained text fields across layers**. These are not unique merged records or dialogue lines: a base record may also appear in a modified stream, and fields include title, method, practice, talent and descriptions. Whitespace/empty HTML wrappers can be nonempty fields. CENSUS gives per-layer counts and compressed sizes.

Original full typed tables and conditions remain read-only in [prior decompile extraction](/Users/weiwei/.codex/research/academagia-decompile/extract): content.json plus each patch's new.json/modified.json, the original 112-type schema, headers, deleted lists and installed-code decompiles. The new text corpora retain prerequisite references; follow those IDs into the original Prerequisite/PrerequisiteItem/SelectionItem records for exact conditions. Full actor binding paths and downstream effects are also already retained there.

[Prior adventure analysis work](/Users/weiwei/.codex/research/academagia-2/extract) retains uncompressed mechanical maps and club candidates. The committed prior pass holds compressed paraphrased mechanical analysis. No prior area was rewritten in this aspect pass.

Record IDs use the prior decoder's little-endian GUID byte hex. A reference text field can be addressed as `layer/table/id/field`. This is an artifact address, not a claimed native line ID. Story actor/lore/entity anchors preserve context references, not reliable speaker labels. No automatic quote-to-speaker inference is made. Rendered actor names can depend on live state, which was not read.

Use Python standard-library gzip/json to inspect these private corpora. Do not copy their raw writing into public repo docs, commits or original YAIRPG content. The three targeted UI source files additionally retain hardcoded UI helper text; code-generated court story literals remain in the prior StorySystem.cs. Portrait/media payloads remain in the original prior extraction/installed resources; no user-save material is part of this reference collection.
