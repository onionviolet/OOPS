# Implementation, persistence and desktop UI

## E1: architecture

SHOWN S01/S02: plain ZIP NW.js package; Construct generator in HTML; `scripts/main.js` provides the browser/worker bridge; `scripts/c3runtime.js` contains the engine, plugins, reference table and generated expressions. `data.json` contains serialized event sheets and object/layout definitions. Most gameplay logic is encoded as event records plus references, not loose RPG Maker scripts.

Six event sheets: main, global parameters, loading, start, initialization and battle. Main has 177 top-level records; battle has 63. Those counts include declarations and groups, not just executable events. There are 1,407 object types, six layouts and 1,782 named groups across the inspected event tree. The decoder resolves 296 object references and 10,832 generated expression entries statically. Entries retain bindings to objects, variables and named functions. It does not execute callbacks.

External `c2array` tables supply content and translations. Shape is `[x,y,z]`, with nested singleton cells in this build. Row-zero sentinels, blank rows, mixed types, placeholder descriptions and non-row-major tables mean a schema validator would add value. No shipped mod contract, editor source project or validator was found in the archive inventory; deliberate extension hooks remain unread. A JSON file is not automatically a supported mod API.

## E2: saves

SHOWN S07: application save handler serializes the gameplay `save` array and separate metadata arrays using Construct's array JSON exporter. `Arr.GetAsJsonString()` emits the `c2array`, `size` and `data` structure; `JSONLoad` checks the marker then replaces the size/data. This does not prove semantic validation or robust migration.

LocalStorage route uses distinct normal and backup metadata/slot keys. NW.js route creates/checks folders and writes text to normal and backup `saveinfo.dat` and slot files such as `save/ea<slot>save.dat`. Generated expression strings use Windows separators. A further directory-copy route exists. Settings use a separate dictionary and `sys/sys.dat`. Prefixes resembling `ztea` are identifiers in the inspected strings; no encryption claim follows from their names.

The live `save.json` inside the package is only a 1x1x1 zero template. It is not the user's saved game. No installed record, user profile, slot file or CrossOver bottle was opened. No write reliability, fallback restore, migration, corruption rejection or Cloud roundtrip is proven. Direct file writes are separate operations, so atomic whole-save backup cannot be assumed.

SHOWN positional state includes plane and alternate-world coordinates plus shared actor/progress fields. S13 progress reader clamps internal completion to 0..1001, derives floor with a modulo-100 operation and difficulty with a ceiling/clamp to 1..10. This compact representation is source-specific. For YAIRPG reuse existing versioned native owners and the staged durable publisher (integration map IR1/IR4), preserving complete instances rather than copying numeric array offsets.

## E3: UI and authoring boundary

SHOWN: manifest window 2016x1136, resizable; main layout 2560x1440. Other layouts include loading/start/art stores, so layout count is not screen count. Events build sprite/text lists, detail views, tabs, item tooltips/comparisons, roster filters, paging, quick travel, help, contribution and reputation displays. Generated expressions construct BBCode-rich text; table `lau.json` has 5220x3x1 translation capacity. Native art, simultaneous panel layout, clipping, font sizing and discoverability were not viewed.

S09 dialogue uses portrait/speaker/text records, side-position choices, a typewriter action and progression into special events. Records and execution are present, but line completion, skip behavior, branching closure and save-during-dialogue restoration need more reading and runtime evidence. No native screenshot was fabricated by rendering the executable web export.

Any YAIRPG UI proposal targets a populated save at 1366x768. Surface: detail/reference in the current center view, or a status/receipt in its existing home. Use shared tokens/components/controller and Back/Esc under `docs/UI_RULES.md`; preserve the full-height log; mobile remains deferred. Source window size does not prove the proposed layout will fit.
