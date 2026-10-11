# Foundation E/F report, 2026-10-07

E and the bounded F household slice are browser-verified in isolated rebuilt snapshots. Proposals stay proposals, and no commit was made.

## E: a life that fits in a save

The previous native save paths had no size guard. Save/import/durable expansion writes now check a conservative 4 MiB budget for the entire origin, measured as UTF-16 storage bytes including other keys and backups. Quota errors keep the previous save. Manual export stays available under storage pressure, including after a rejected expansion transaction. This is a conservative guard, not a guarantee that every browser supplies exactly that quota, and it does not delete backups.

`life_record` is a separate optional schema1 component, retaining expansion schemas5 through11. Absent old records start at their loaded date, without a fabricated past. Recent milestones retain words; overflow and older milestones fold into yearly count/highlight summaries. Bounds:64 recent,200 years,4 highlights/year,8 worlds/year. Older years retain an honest total/range. This lossy biography never grants rewards or controls eligibility. Existing expansion history stays intact.

Playable behavior: Remember this day in the existing side-log column. Beginnings and world crossings are observed on saves. Chronicle-note ingestion is not yet connected. Experience acknowledged the API; it owns stage/chronicle/feed mechanics, while foundation owns save and record paths. See FOUNDATION_RESPONSE.md for the limited youth-XP function handoff and remaining heir integration request.

E measured real native save envelopes: fresh42,022 UTF-8 bytes (84,040 storage bytes), generated mid-game52,427 (104,850), generated120-year record span76,758 (153,512). The mid-game fixture adds money/skill progress; the long fixture simulates the record, not all quests/worlds. See E_BROWSER.json.

RimWorld evidence supports selective bounded retention, protected used references and compact numeric data. Annual summaries are our original design. Dwarf Fortress documents compressed saves, but its local native history/save algorithm remains unrecovered. Detailed source paths/lines are in SOURCE_NOTES.md.

## F: one household while you travel

An optional original Village household gains yearly age, family ties, a marriage, births, deaths and bounded public news. Future family members stay hidden until their year. Its saved seed fixes old-age dates, so reload cannot reroll. Coarse catch-up examines a bounded event schedule, with no minute ticks or extra timers. This is one finite family, not a regenerated population or a replacement for native elder/craftsman actors.

Optional `npc_lives` schema1 is absent in old/unmet saves. Native save/load/export/import preserve it; invalid/future records reject before writes. The playable entry is Get to know your neighbors in the existing side log. At most32 people,64 scheduled events and16 news items are admitted; this slice uses6 people.

## Checks and limits

E:10 narrow tests passed, then2 targeted busy-year overflow/guard tests passed. Fresh-origin browser checks passed:day memory,save,reload,export,import,generated oldschema11,120-year record span,manual quota preservation/export and rejected chronicle transaction/export,zero page errors. E's final quota repair bundle is48da96c27f3d.

F:3 NPC tests and5 existing save-file tests passed. Large catch-up equals repeated yearly catch-up; events do not replay; names/relationships remain hidden before their years; saved schedules retain death dates. The invalid/future-household import rejection test also passed. Browser proof passed the optional meeting, hidden future relatives,24-year family catch-up,94-year deaths,save/reload/export/import and oldschema11 import over an existing life. Primary checks passed before the original script failed in its independent fixture encoder; corrected separate OLD_IMPORT.json passed with zero page errors. This failed script run is not reported as an exit0. The village-lives screenshot was visually inspected. F build succeeded in isolated snapshot, bundle3ad476cf6ef5; fingerprints in F_BUILD.json, owning live areas compared in LIVE_READBACK.json. There are15 distinct targeted tests passed across the bounded runs, not a full suite.

No full-game regression, real-world travel proof, packaged release, deployment or human acceptance is claimed. Private saves stayed untouched. One shared build was generated early by mistake; later proof uses isolated snapshots. Shared index.html has a generated fingerprint change and may also be updated by other live lanes; do not treat it as this pass's authoritative build.
