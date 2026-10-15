# World definitions and portability

Evidence classes and source pins are in [SOURCE_LEDGER](SOURCE_LEDGER.md). This is a static data audit. No playable transformation was observed.

## The layers

| Code | Layer | KH evidence | Transfer lesson |
|---|---|---|---|
| W1 | World identity and room coordinates | KH2 indexes 00..12 hex. `LM=0b`, `LK=0a`, `NM=0e`, `WI=0d`, `TR=11`. ARD and map filenames carry world/room prefixes. KH1 uses its own two-letter roster and room archive convention. | Pin source title/edition, world, room and instance separately. Shared franchise names are not interchangeable IDs. |
| W2 | Actor appearance and local party role | KH2 `memt`: default plus conditional world/story/area rows; indexed player, friends, local guest, Drive and high-poly variants. `Memt.cs` declares 18 FM member slots and seven party selectors. | Resolve local manifestation from actor identity. Do not duplicate the actor because the asset changes. |
| W3 | Present command legality | `Cmd` has flags and DisableForm bits. ARD `Party` and mission headers select additional limits; item ownership/requirements are other inputs. | Owned, equipped, locally supported and currently permitted are separate questions. |
| W4 | Durable earned state | Save-tool fields for characters, inventory, total experience, forms and summon level are outside room appearance tables. | A blocked function remains earned unless a source law actually changes it. |
| W5 | Visit state | Per-world story progress, room-program selections, visited flags and party choices occur in save declarations. | Return to changed native state rather than replay a fresh destination template. |

## Selected native member rows

Rows use installed `03system.bin/memt`; object labels come from pinned `docs/kh2/dictionary/obj.md`. Full rows are private.

| Code | World / condition | Observed binding | Boundary |
|---|---|---|---|
| M1 | NM base | Player 693, guest 95 | Identified as local Sora and Jack. A local look does not prove different base XP. |
| M2 | NM area selector 2 | Player 2389 and changed friend/form variants | Subarea context can override a world's presentation. Exact CheckArea evaluator not read. |
| M3 | NM flag 0x383a | Guest 96 | A story-qualified guest presentation changes independently of player growth. |
| M4 | MU default, then flag 0x2018 | Guest 100, then 99 | Ping/Mulan role change. The exact progress flag's own script terminates without side effects; the member-table reader is the distinct consumer of that state. |
| M5 | LK | Player 650, friends 1519/1563, guest 97; Drive-member fields zero | Local lion cast shown. Docs describe fallback for zeros, so zero fields alone cannot prove universal Drive prohibition. Use command/mission/native caller evidence for restrictions. |
| M6 | LM | Player 958, friends 918/919; local guest field zero | Mermaid presentation is shown. Local text describes swimming and musical controls. It does not establish a combat guest party equivalent to KH1 Ariel. |
| M7 | TR | Player 1622, guest 724, own Drive/high-poly variants | Shared traveler can have a complete setting-specific presentation family. |
| M8 | WI | Player 1623 and changed friend/form variants | Retro presentation is separately supported by Arif Monochrome flag declarations. Exact native rendering path unread. |

## KH1 versus KH2

SHOWN: 239 KH1 ARDs were extracted and their section-5 resources indexed. Atlantica accounts for 17 of these, Halloween Town 13. Example `lm08.ard` contains the world-specific Sora/Donald/Goofy and local companion resources; `docs/kh1/dictionary/mdls.md` resolves local visual models. KH1's `Ard.cs` exposes a 32-section archive rather than KH2's typed BAR room structure.

STATED: KH2's LM messages 17820/17821 teach local horizontal/vertical movement and Dolphin Kick. LM 5273 identifies a musical tutorial. World-map IDs 19499..19501 and journal IDs 10837/10839/10843 ask the traveler to return with global growth or magic. This is strong evidence for a local activity connected to the wider journey.

UNREAD: KH1 swimming controller, combat adaptation, precise summon exclusions, local party-selection predicates, ability/Keyblade grant callers and revisit logic. Its different art/resource format does not imply different persistence semantics. KH2 Drive tables must not be assigned to KH1. No end-of-KH1 to start-of-KH2 save transfer is established by this dossier.

INFERRED: KH is strong at a stable party touring authored settings. It is weaker evidence for YAIRPG's long residence, local careers and autonomous relationships. Borrow the boundaries and mechanical variety, then build those lived systems from their own owners.
