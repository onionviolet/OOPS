# Runtime patch merging, source trace

**Shown** means inspected installed .NET source or previously decoded shipped bytes. **Inferred** means a passive reconstruction. No game, assembly, cache constructor, save or bottle was run. Prior extract paths below are relative to `/Users/weiwei/.codex/research/academagia-decompile/extract/`.

## M1. Selection and cache

`GameLogic.dll/Academagia.Storage/RepositorySerializer.cs::CreateGame` preserves the order of supplied `GameModInfo[]`, records the mod GUIDs in that order, asks `GameCache.GetCachePath`, and builds only if no matching cache exists. It copies base resources, unpacks each selected ZIP into a temporary directory, calls `MemoryDB.Create` and serializes the resulting database with a string cache. Matching-cache reuse bypasses rebuilding.

`GameLogic.dll/RepositoryCache/GameInfo.cs::AreEquals` compares official-content GUID, number of mods and each mod GUID at the same list position, then compares mod metadata when both sides have it. Thus this code treats mod order as part of cache identity. A selected profile is not established merely by finding both .mdm files in the installation. This lane did not read the player's selected mods or cache.

## M2. Base to patch to later patch

`Storage.dll/Storage.DB/MemoryDB.cs::Create` checks that each mod's base official-content GUID matches. The first patch merges over base. Every later patch merges over the previous intermediate header/data files, preserving input order. No generic priority field is used here.

`Storage.dll/Storage.Publish/CustomSerializer.cs::Merge`:

| Phase | Shown behavior | Consequence |
|---|---|---|
| Allocate | Reads base GUIDs and new-header GUIDs for each type and creates entities before loading their bodies | GUID references can resolve to shared entity instances |
| Existing ID | Reads the complete base body; if its ID appears in the modified header, reads the modified body into that same entity | Changed record replaces serialized values, rather than arithmetic addition or a field-by-field conflict diff |
| New ID | Reads bodies from new_data after existing records | New entities append to that type's list |
| Normalize | Builds a GUID dictionary from each list, assigning later entries last | Duplicate GUID in a type keeps the last entity in the normalized type list; arbitrary malformed duplicate references are not proven safe |
| Resources | Copies patch resources with overwrite enabled | Later patch asset with the same filename replaces the prior file |
| Output | Writes the merged intermediate header/data with official-content version | Next mod sees the merged database as its base |

`ContentModel.dll/ContentModel/PersistEntity.cs::Deserialize` invokes `LoadFromStream`. `Adventure.LoadFromStream` assigns the investigation and exit lists from the modified body. A patch's exit list is a replacement list, not appended to the old one. Other serialized fields follow their type reader; unencoded transient state is outside this claim.

Modified records are consumed while walking base IDs. A modified ID absent from the input database is not a general upsert in this loop. Shipped valid ordering is assumed by the passive reconstruction; a future mod tool should validate stream/header ordering and identifiers rather than silently accepting malformed patches.

## M3. Deletion discrepancy resolved at source level

The shipped deleted.bin streams are NRBF `List<Guid>` with 5,261 entries for Content and 5,287 for Summer, established by the prior passive decoder. `GetDeletedObjects` deserializes an object but builds its deletion dictionary only when the object **is string[]** and nonempty. Otherwise it returns null. `IsObjectDeleted(null, guid)` returns false.

Therefore **inference from the inspected source and decoded types:** this reader ignores these shipped deletion lists. It does not throw an invalid cast at that test. The prior phrase “casts to string[]” needs this qualification. This lane uses no-deletion unions as its source-compatible profiles and preserves intended-deletion totals for comparison.

| Profile | Source-compatible union Adventure count | Intended List<Guid> deletion reconstruction | Roots |
|---|---:|---:|---:|
| Base | 1,555 | 1,555 | 237 |
| Base + Content | 3,022 | 3,018 | 383 |
| Base + Summer | 3,030 | 3,026 | 384 |

These totals model each patch separately. They do not assert that the installed game selected either, or both. The runtime algorithm allows sequential patches; a combined Content + Summer profile has not been reconstructed in this pass.

A separate dormant deletion branch calls BinaryFormatter.Deserialize to skip a deleted base object, although the installed base content reader uses a custom primitive stream. That is an additional compatibility concern if string-array deletions activate the branch. It has not been executed and is not called a proven runtime crash.

## M4. What remains unverified

Actual cached bytes, selected mod order, cache reuse in the player's installation and behavior of the original .NET runtime are unverified. COMMON forbids launching or touching saves/bottles; source tracing is the permitted answer to the runtime algorithm question. An isolated future execution experiment needs its own authorization and must not reuse user saves. No such experiment is required to use the structural research as a proposal.

**PROPOSAL M5:** For YAIRPG content overlays, keep stable IDs, explicit ordered replacement, separate append/remove operations, a profile fingerprint and a passive graph check. Reject an unsupported deletion representation with a clear diagnostic. This is a proposed authoring improvement, not authorization to add runtime mod support.
