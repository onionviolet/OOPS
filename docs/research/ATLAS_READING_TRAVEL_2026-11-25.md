# Reading travel evidence precision, 2026-11-25

| Preflight | Scope |
| --- | --- |
| Trigger and authority | Root assigned precision for Reading's “Walkable” stage: cast/district presence counted two worlds while HP and RI ordinary movement showed zero. AD36/AD43, AR2–AR7, UR43/UR74. No native game change. |
| Existing source | Adopted native-map snapshot has 33 HP and 41 RI native locations but zero `connected_locations` edges in those rows. These lives register movement through explicit player relocation commands. Existing LOTM `/data.places` includes authoritative host walk quotes. A cast place or district alone is not a travel edge. |
| Seam | Pure `registeredTravel` projects native connections and explicit player relocation source/destination pairs between admitted same-world native locations. The normal native-map build now embeds this measurement during its existing fresh boot. A standalone refresh can also write a small sibling leaf for an existing snapshot. No game files changed or extra server-startup game boot. |
| Failure checks | NPC movement, unknown/dynamic endpoints, duplicate edges and district-only presence must not inflate player movement. Host route `dest` must take precedence over its command `id`. Actual HP/RI and negative MOL display tested on the normal 1366×768 page. Mobile deferred. |

F1: The stage is now “Registered travel”. Its selected status says “Definitions available” or “Not projected”. The view counts directed native/host connections and explicit relocation paths, and explains that definitions can be conditional, story-gated or use methods beyond walking. Current access and played travel proof are not established by these counts. Existing dated “Proven”/“Delivered” progress evidence remains separate.

F2: The adopted definition measurement gives HP 40 distinct directed paths across 31 native locations from 42 commands, and RI 74 across 40 locations from 99 commands. The count includes multiple life profiles and conditional movement; it is not an ordinary-start reachability denominator. Focused tests also use the actual ordinary HP glass-trade walks and RI base lead movement definitions. NPC relocation does not contribute.

F3: The existing LOTM host quote data contributes 12 directed walks across four places. Shadow Slave contributes four explicit paths. Thus four reading worlds have registered movement evidence in this projection. Mother of Learning's 23 cast-place projections no longer manufacture a travel claim: its native movement is not projected here, which does not establish that travel is absent.

F4: Follow-up build integration makes this survive ordinary Atlas refreshes. `native-map.mjs` uses its existing boot to produce `registeredTravel`, and `buildSnapshot` stores it in the snapshot. Both that path and the optional standalone CLI share `nativeTravelReport`. Serve uses embedded data, or a newer standalone refresh bound to the same snapshot bytes. A stale or older leaf cannot replace the embedded measurement. Old snapshots can still use a matching standalone leaf; missing or invalid data falls back to the existing connection/host-route projection without manufacturing cast edges.

| Check | Result |
| --- | --- |
| Definitions | `node prototypes/world-atlas/measure-registered-travel.mjs`: exit 0. Wrote `work/atlas-snapshot/registered-travel.json` bound to existing snapshot SHA-256 `1a6bb2199238025ab26cddae81269a585646ae80fa5130f7a7ee78a29e9f49a1`. Snapshot bytes unchanged. No game save or default bundle written. |
| Focused | Final `node --test tests/atlas_registered_travel.test.js`: 7/7 passed. Directed deduplication, NPC/cross-world/unknown exclusion, cast-only negative, native and host route shapes, actual HP/RI definitions, shared native projection and old/missing/stale/embedded/standalone selection covered. |
| Normal browser | `node prototypes/world-atlas/prove-reading-travel.mjs`: final exit 0, headless Chrome 1366×768. Actual HP and RI Reading routes plus MOL negative; no page errors or horizontal page overflow. Existing LOTM quotes remain positive. [Result](../representations/evidence/atlas-reading-travel-2026-11-25/result.json), [HP](../representations/evidence/atlas-reading-travel-2026-11-25/hp-1366.png), [RI](../representations/evidence/atlas-reading-travel-2026-11-25/ri-1366.png), [MOL negative](../representations/evidence/atlas-reading-travel-2026-11-25/mol-1366.png). |
| Syntax | `node --check` on library view and normal server: passed. |
| Ordinary build integration | `ATLAS_READER_ROOT=work/atlas-travel-build-20261125/empty-readers node prototypes/world-atlas/build.mjs --out work/atlas-travel-build-20261125/snapshot.json`: passed, exit 0, no build failures. Isolated empty-reading fixture prevents archive re-reading or WUS adoption claims. Real native definitions embedded HP 40 and RI 74 paths during the existing native boot. Candidate has no sibling travel leaf. Default snapshot remained at `1a6bb219…`; root owns its WUS adoption rebuild. |
| Embedded-source browser | Normal proof with `ATLAS_SNAPSHOT` pointing to that candidate and `ATLAS_EXPECT_TRAVEL_SOURCE=snapshot`: passed, exit 0 at 1366×768 for actual HP, RI and MOL negative. Asserted the API used embedded snapshot travel with no standalone leaf. [Result](../representations/evidence/atlas-reading-travel-build-2026-11-25/result.json). Candidate snapshot, isolated reader digests and cited evidence retained for this proof. Its scoped server/browser closed; runner retained Windows-locked private profile suffix `9H3duG`. |
| Cleanup | Proof servers/browsers closed. Retained adopted definition leaf and cited screenshots/count artifact. Shared runner warned of private locked profiles on some attempts (`M0bn8x`, `8w2UvO`, `IBfEw3`, `wNFKAQ` suffixes); retained for runner owner. No profile deletion retry. |
| Review | Agent-verified, not human-reviewed. This is Atlas evidence precision, not a new played travel proof or gameplay acceptance claim. |

The ordinary Atlas build now refreshes travel automatically. To refresh movement definitions against an existing older snapshot without a full rebuild, the standalone command remains available:

```powershell
node prototypes/world-atlas/measure-registered-travel.mjs
```

`ATLAS_SNAPSHOT` selects another existing snapshot. The server reads available embedded and leaf data on launch; a mismatched leaf is stale and does not replace embedded data. Missing or unprojected edges remain unknown rather than a claim that the world lacks travel. This bounded projection does not enumerate dynamic endpoints or all possible host mechanisms.
