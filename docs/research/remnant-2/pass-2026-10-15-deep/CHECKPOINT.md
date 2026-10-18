# Deep Remnant II checkpoint

Status: PARTIAL

2026-10-15, lane mw-remnant2. New dossier complete at the static evidence boundaries below. Installed Steam build 16320528, internal build 453438, shipping SHA256 0f4783f75ec178724ddbe10baee55a38ce4311bebf1a8bacd0626b9d8f7d0265. No game, injector or Windows executable run; no player saves accessed.

## D1: AES reached

CLOSED for these two archives. Inspected aesdumpster-rs revision 9cba14126662ddc82afcd679c25fcb82260bccff; Python signature scan found six candidates. First tested candidate from installed file offset 0x1ffb999 successfully decrypted pakchunk0's V11 index with repak. Same key listed pakchunk1. 4,428 + 2 entries; config extracted privately. Key and candidate values stay outside the repo.

## D2: mappings and clean-read counts

PARTIAL, substantial recovery. Static reflection recovered 4,659 class + 2,893 struct property lists. Hybrid usmap has 7,775 types, including 223 retained archive fallback types, and 1,770 archive enum-label tables. 205 compared native layouts changed. Native VariableValue serializer at 0x1424ec010 was read with REA and added to an isolated CUE4Parse source copy.

| Exact old failing slice | Before | After, binary generated usmap + native serializer |
|---|---:|---:|
| Package attempts | 161 | 161 |
| Packages without logged object errors | 0 | 160 |
| Export objects | 24,589 | 24,589 |
| Named/logged failing objects | 2,361 | 1 |
| Export objects without a named/logged failure | 22,228 | 24,588 |

These are read-log metrics, not full semantic acceptance. Remaining failure: Player_F_1R_Action_WeaponMod, AnimNotify_PlaySoundSetSound_3, GunfireAudioPlayParams/GunfireAudioAttachParams. Actual native layout, archive layout and cooked bytes do not yet yield a justified compatibility read. No guessed patch or skipped bytes.

## D3: native generation reached

PARTIAL. 53 successful REA pseudocode outputs retained, with exact target/provider receipts. Main path: RemnantQuestSubQuest vtable slot 205 at 0x14201f700 -> selection helper 0x141ffcf90. Traced chance, tag inclusion/intersection, usage cap, rarity weights 100/50/25/10/5, saved QuestFailCount weight adjustment, root creation/destruction, mode/award/one-shot filtering, and required-tile failure at 0x14201bbc0. SpawnTable.GenerateWithSeed is a separate seeded selection layer. Capstone verified exact selected instructions when REA's FunctionManager body was only one byte or a leaf procedure was undefined.

Full spatial connectivity solver, all indirect callers, full entitlement enforcement, reroll carrier cleanup and failure settlement remain open. Seed API sentinels differ; no all-content single-seed guarantee claimed. Source usage/one-shot caps are not proposed as universal YAIRPG limits.

## D4: wider systems reached

| New selected pass | Clean / attempts | Result |
|---|---:|---|
| Gameplay/data | 749 / 749 | 34,818 exports; 206 quest defaults; 58 DataTables / 911 rows; 223 recipes; selected trinkets, progression, faction definitions and overrides |
| Crossing/world-menu UI | 20 / 20 | Static list/create/destroy/activate/save calls and root-mode joins, unrendered |
| World rule / portal actions | 20 / 20 | Hazard/portal/curse/event/transition definitions and scripts, unplayed |

These passes overlap systems and are not additive unique-game coverage totals. All 127 selected EventTree assets read cleanly, with 8,787 text-bearing dialogue nodes, 2,207 choice branches and 43,096 local export-reference checks passing. External reachability/closure still unproved. Full available text, IDs, conditions and effects remain private.

Public lib.remnant2.saves revision d5190d44e1ded9c2b2bc0c5968c593aa390a4518 was source-read for version/build framing, zlib chunks, CRC, name/object tables and component/property structure. Native reflected profile and world domains were read separately. No personal or public sample save parsed; no engine migration or recovery test claimed.

## Unread table and exact next routes

| Gap | Evidence boundary / next static route |
|---|---|
| One animation audio-notify record | Native lists differ from archive/cooked layout; inspect cooked version/custom-version provenance and the exact asset serializer before changing its reader. Do not infer it is used in play. |
| Full mapping qualification | 223 fallback types and archive enum labels remain; statically regenerate missing parameter/enum records and validate distinct real consumers. Existing 160/161 and 789 new-pass reads are bounded evidence. |
| Full spatial connectivity and retries | Required-tile rejection traced; complete tile/zone solver and root failure propagation not reconstructed. Start from 0x14201bbc0 callers and the owning tile component's virtual methods. |
| Seed replay across all systems | Selected seed update and sentinels traced; debug override propagation, profile/history and call ordering incomplete. Pin those inputs before any replay claim. |
| Entitlement and adventure admission across every caller | Mode filter plus default entitlement fields read; join all registration/cache/admission callers, rather than equating a DLC payload with permission to enter it. |
| Exact reroll retention / failed-save recovery | UI-to-native creation/destruction chain and save domains read; trace cleanup's carrier consumers and GunfireSaveSystem write/failure path. A CommitSave call is not atomicity proof. |
| Complete five-world faction/hazard/boss matrix | Selected matrix in SYSTEMS and private boss IDs; not every placed character override, combat phase or hazard exception has been read. Join character defaults, map instances and event-driven mutations next. |
| Dialogue external references and full branch reachability | Local references pass; validate external object consumers and condition semantics per selected route. Preserve repeatable cycles and discovery IDs. |
| Complete economy/craft execution | Recipe rows, quote/eligibility and selected price paths read; actual craft/debit virtual overrides, all level rules and SSE rounding edges remain partial. Start at CraftItem validation/implementation virtual slots. |
| Native save format/migration/backup behavior | Third-party parser source and reflected domains only. Statically trace game's own version/CRC/container/migration paths before asserting parser parity or recovery. No player saves needed. |
| UI behavior, audio, gameplay and persistence acceptance | Explicitly excluded game launch. None of the above proves rendered interaction or played/save behavior. Any future YAIRPG implementation has its own owner and rebuilt desktop/persistence gates. |

## Durable evidence and resume

REPORT, FINDINGS.json, SYSTEMS, TOOLING and this checkpoint exist. All proposals map to multiworld-synthesis MWA-P02/P06 and related P03/P04/P05/P09 plus K codes. A01-A12 deltas are in SYSTEMS; the first aspect dossier remains unchanged as history. No accepted owner or implementation priority changed.

Private work: ~/.codex/research/mw-remnant2/deep/. Latest measured logical bytes: 776,191,500 in deep, 1,601,599,872 in the whole lane including first pass and new source clones, before a few final text receipts. No game payload copied. 1,295 deep extract files hashed in deep/extract/HASHES.txt; source/helper/native evidence hashes in deep/notes/provenance-hashes.json. Earlier extracts and hashes unchanged. Full available text/tables/bytecode and native notes preserved; AES values remain private.

Resume from a named row above and use NEW extraction roots. Reuse the regenerated usmap and custom reader; do not restart with the archive map alone. Use the saved exact selections and log-based sink. REA session closed; no background analysis intentionally left running.

Validation: exact selection/receipt counts, JSON parses, local branch-reference checks, source hash, extract hash manifest, absence of AES candidate values in public dossier, output presence, A01-A12 delta codes, and first-pass preservation checked. Research verification only. No commit/push, shared source change, game install modification or save access.
