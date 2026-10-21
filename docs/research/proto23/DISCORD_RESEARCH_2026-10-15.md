# Arcanum Discord: Proto23 development and YAIR community research

2026-10-15. Requested by Weibao: inspect Corc's latest development posts,
community feedback, archive the Proto23 and YAIR channels, and absorb useful
ideas. This is a partial direct-source review with an unfinished bulk archive.
Research and proposals only; no gameplay, save format, priority, or accepted
product decision changed. PROJECT.md and USER_VISION.md remain authoritative.
The current desktop UI work and one playable slice at a time remain in force.

## Collection and evidence

Arcanum guild: `622495527485046805`.

| Channel | ID | This pass | Remaining archive gate |
|---|---|---|---|
| [proto-23](https://discord.com/channels/622495527485046805/811370601129705483) | `811370601129705483` | Selected author searches and message-context reads | Full history, threads, attachments and oldest-message boundary |
| [yet-another-idle-rpg](https://discord.com/channels/622495527485046805/1458887440398942300) | `1458887440398942300` | Recent October search and cat-cafe/buff context | Full history, threads, attachments and oldest-message boundary |

The running Discord PTB session provided direct source access. Corc was selected
from Discord's author suggestions as `corc_lp5`, display name Corc. A similar
handle `corc7603` was excluded. This is account attribution within this server,
not an attempt to establish the developer's offline identity.

The [SMART research owner](/Users/weiwei/Documents/Claude/Projects/Weibao's%20Workspace/plans/03_WL_Career/Fellowships/SMART_Scholarship.md)
§7 identifies **Discrub** as the prior export tool. Its historical archive was
HTML with local media, not JSON. The [current upstream documentation](https://github.com/pratherbytecraft/discrub)
also supports JSON and HTML export and points to the official Chrome listing
`plhdclenpaecffbcefjmpkkbdpkmhhbj`. Installed extension availability was not verified.
Chrome's Discord session requested login. Browser approval rejected both the
extension-management URL (protocol restriction) and official store navigation.
No installation, token extraction, permission grant, export or message mutation
was performed. User authorized continuing and reinstalling if needed, but the
browser restrictions still apply.

Local evidence is in `private/discord-2026-10-15/`, ignored by Git:
`selected-posts.json` holds 11 manually transcribed selected posts with source
links where captured; `coverage.json` records scope, gaps, hashes and status;
`user-supplied-two-worlds.png` preserves the supplied screenshot. This is not
an automatic export, and raw accessibility trees were not saved. Message text
in search results can be visible even when the referenced reply says it could
not be loaded. Such rows are explicitly marked as missing context.

Searches included Corc's unfiltered author history and author plus update,
play, test, 2026 and year; YAIR after October 1. Search counts are query-specific,
not channel totals or coverage percentages. Only the visible first result pages
were reviewed. Displayed dates use the local session's Eastern time context.

## Verified findings

| Code | Finding | Evidence and qualification |
|---|---|---|
| F1 | Latest development reply verified in this pass: October 10, 2026, 00:13. Corc reports small engine changes. | [Direct reply to a progress question](https://discord.com/channels/622495527485046805/811370601129705483/1558331611379007549), opened in channel context. Later October 10 posts discuss other games; a comment about updating something after a year must not be presented as Proto23 release news without its context. |
| F2 | September 26: Corc reports restarting a test playthrough after damaging the test save. | [Direct post](https://discord.com/channels/622495527485046805/811370601129705483/1553544697673154651). Cause, recoverability and the state of other saves were not established. This proves a developer report of testing, not compatibility or release readiness. |
| F3 | September 16: Corc states an intention to release during 2026. | [Direct post and surrounding exchange](https://discord.com/channels/622495527485046805/811370601129705483/1549834536181960835). The conversation explicitly concerns release timing. Corc reinforces the year claim, while others respond with delay jokes. Treat as a dated target, not a guaranteed delivery date. |
| F4 | Search-visible developer notes describe new-area work, some skill-number disclosure, perishability and UI work. | September 14, September 12, October 1 and September 17 search results. Selected exact text is private. Individual context/links remain incomplete; no unreleased build was obtained or tested. Do not treat these as a complete feature list. |
| F5 | The community mixes sustained enthusiasm with frustration and jokes about long waits. | September 16 context and October 12–14 search results. This is a sample of visible participants, not a representative survey or consensus. |
| F6 | YAIR players disagree about temporary XP buffs: schedule/optimization pressure versus acceptable optional acceleration. | [October 15 anchor](https://discord.com/channels/622495527485046805/1458887440398942300/1560143275426320475). Opened context includes Guy's preference for permanent rewards, their enjoyment of optimization itself, BD Jim's defense of temporary buffs, and discussion of a cat-cafe effect. Claimed weeks saved were not independently measured. |
| F7 | Some players value comic interactions without mechanical rewards. | Mai's October 14 cat/patting discussion, in the same opened YAIR context. This is a player preference, not an upstream design commitment. |

Earlier Reddit statements about save incompatibility remain secondhand in this
pass. No direct compatibility post was recovered, so neither a forced reset nor
compatibility guarantee is established. Preserve/export existing saves before
any eventual upgrade; this task did not touch player saves.

## Ideas to account for, not new implementation priorities

| Code | Disposition | Candidate and YAIR fit | Evidence or acceptance still needed |
|---|---|---|---|
| P1 | Account for now | Keep optional temporary bonuses from controlling the player's real-life schedule. Consider earned lasting benefits, flexible activation or stored charges, while preserving meaningful optimization for people who enjoy it. | Compare ordinary and optimized progression in the existing food/activity/skill owners before selecting a mechanism. Do not universalize one player's preference or add a new daily chore. |
| P2 | Adapt in an existing slice | Let small funny actions remain worthwhile as flavor; some can later earn knowledge or a title when the world supports it. | Fits the existing tags/identity/comic-logic research. No compulsory new skill or stat reward for every joke. Rebuilt desktop discovery proof is required if implemented. |
| P3 | Trial later | Equipment merging could make repeated loot useful through a visible input-to-output transformation. | User screenshot shows Corc appreciating Two Worlds merging, not announcing a Proto23 feature. YAIR already has item quality, rarity and component-based equipment. Any trial needs explicit identity/quality rules, a preview, balance bounds and save compatibility; no second inventory system. |
| P4 | Park as a world-specific option | Rare exploration finds that permanently change a character can make travel memorable. | Screenshot records Corc's appreciation of stat-raising herbs. Verify Two Worlds as a separate source before detailed adaptation. Decide respawn, scarcity, stacking and economy effects; avoid turning repeated route-clearing into mandatory maintenance. |
| P5 | Account for now | Perishability adds storage and trading choices but can create loss anxiety, especially with offline time. | Corc's search-visible comment has incomplete context. YAIR's accepted food direction is comfortable unfed ordinary play and no hunger death. No universal spoilage rule is accepted. |

These extend [source mechanism research](SOURCE_MECHANISMS_AND_ADOPTION_2026-10-13.md),
[comic logic research](TAGS_IDENTITY_AND_COMIC_LOGIC_2026-10-15.md),
[food direction](../../USER_VISION.md), and existing design owners.
The screenshot is dated January 23, 2025 as displayed; its original message
IDs and timezone are unknown. Its text concerns another game and is not a
Proto23 roadmap. No Two Worlds game/source verification was done here.

## Finishing the archive

A1. Sign into Discord in Chrome and open the official Discrub extension manually
if browser restrictions persist. Choose only the two channel IDs above, with
all accessible history and their active/archived threads. JSON is preferable
for analysis; HTML and useful local media preserve readable context. Do not
select all servers or DMs. Preserve export warnings and completion status.

A2. Keep each original export unchanged in the private folder. Record SHA256,
export time, source channel/thread ID, format, per-channel message/system-event
counts and oldest/newest IDs. Inventory attachment URLs separately from files
successfully downloaded. Preserve authorship, replies, edited flags and source
links. Deleted messages and prior edit versions are not recoverable merely by
exporting currently accessible history.

A3. Check both ends of each channel, pagination and thread coverage against the
signed-in source, then deduplicate by message ID into a searchable local corpus.
A valid ZIP and sequential pages establish internal consistency, not complete
source coverage. State inaccessible channels, threads or failed media explicitly.

A4. Extract an attributed update timeline and feedback themes with surrounding
context. Track proposals, developer intentions, released behavior and independently
observed gameplay separately. Paraphrase findings in project docs and keep bulk
raw conversations and media private. Review proposals against live owners before
any future runtime adoption. No recurring monitor is created by this request.

Status: direct-source findings and initial absorption proposals saved. **Full
channel archive and comprehensive community review remain open**, pending the
browser/export step. No build, gameplay tests, commit or push was appropriate
for this research-only pass.


## Continuation: signed-in Discrub access, October 15

Weibao confirmed Chrome sign-in and Discrub readiness and authorized exporting
both channels followed by comprehensive review. Live inspection confirmed the
official extension ID in its embedded iframe and the Open Discrub control.
Navigated the existing Discord tab to the Proto23 channel. The extension panel
rendered as an empty iframe to the automation interface. A native Chrome check
also exposed no usable Discrub controls. On the subsequent state read, the
browser explicitly reported: "Google Chrome is blocking automation because
another extension UI is open on this page. Complete or dismiss that extension
UI in Google Chrome, then ask me to continue."

This supersedes the earlier login/reinstall diagnosis: sign-in and extension
presence are confirmed, but extension UI automation is blocked. No workaround,
credential extraction or additional installation was attempted. No new Arcanum
archive appeared among the newest Downloads entries inspected. Full export and
comprehensive review remain unfinished. The next required input is a manual
Discrub export of only the two listed channels, all accessible history and
threads, preferably JSON with media, left in Downloads. Close the extension
panel after export. Local archive verification and review can then proceed
without automating the extension UI. Existing selected evidence and proposals
remain intact; no newly comprehensive findings are claimed.


## Export verification: received archive, October 15

Weibao reported both exports in Downloads and requested checking proper export
before comprehensive review. **Result: the available Proto23 archive is intact
but incomplete; a YAIR channel export was not located.** This replaces the
previous assumption that no export had been started, not the earlier findings.

| Code | Check | Observed result |
|---|---|---|
| V1 | Received file | `/Users/weiwei/Downloads/proto_23.zip`, 1,394,227 bytes, SHA256 `1b6b3405d0fa57a9dbb6ad581b034e4c81451e81dcde2c1b3228a4e6aefa8ee2`. Original preserved unchanged; private copy retained. |
| V2 | Integrity and pagination | ZIP CRC passes for all 38 members. One HTML message page declares page 1 of 1. Exactly 100 message rows and 100 unique IDs. No referenced local avatar/emoji/media files are missing in that message page. |
| V3 | Source identity | HTML title/channel label is proto-23; shell identifies Arcanum through its name and guild icon URL. Numeric channel ID is not preserved explicitly in the inspected channel metadata. Expected channel links below use the previously observed live Proto23 ID. |
| V4 | Date span | October 13, 2026, 13:11:10.645 through October 14, 2026, 13:06:40.061 Eastern. Oldest `1559614489970610349`, newest `1559975742924914759`; timestamps independently derived from snowflake IDs in UTC and converted to Eastern. |
| V5 | Required content | Zero Corc-authored rows. All three previously opened developer posts are absent. Embedded thread map is empty and there are no thread files. Three media files: two embed thumbnails and one attachment. This cannot represent the full history already observed. |
| V6 | Second archive | No YAIR channel archive found by Discord/export/channel-name searches in Downloads or inspection of recently modified top-level ZIP/JSON/HTML files. Matching YAIR `.txt` files are existing game saves and were not opened as chat exports. The old `bulk-export.zip` is the previously verified SMART export, not evidence of either Arcanum channel. |

Exactly 100 recent rows is consistent with exporting the loaded message batch;
the export settings were not observed, so this cause is an inference. Valid ZIP
and page 1 of 1 do not establish that the source was fully collected. No source
side total or oldest-boundary match has been established. Thread coverage and
full attachment coverage remain unverified, not zero on the source.

Private `export-verification.json` records these results. `exports/proto_23.partial-100.zip`
retains the original bytes, with safe-path checked extraction beside it.
`partial-export-messages.json` preserves each of the 100 message rows, snowflake
time, author metadata where present and expected channel permalinks. Text parts
retain reply previews and reaction labels; they are not a clean content-only
field. The original HTML is authoritative for resolving attribution/context.

### Review of all 100 available message rows

All rendered text rows were read. The single local message attachment was
visually inspected. The two embed thumbnails, external links/videos and other
games' underlying mechanics were not reviewed. This is complete text review of
the received slice, not comprehensive channel research.

| Code | Observation | Attribution / useful consequence |
|---|---|---|
| F8 | Players discuss a large update and hope for release before year end; the surrounding exchange explicitly treats the five-hour claim as a meme and stresses uncertainty. | [Mai, October 14](https://discord.com/channels/622495527485046805/811370601129705483/1559947528571723930). These are community reports. No new developer commitment is added. |
| F9 | A player says Corc recommends wiping saves once the update arrives. | [Mai](https://discord.com/channels/622495527485046805/811370601129705483/1559947699040550924). Firsthand archive evidence of what Mai wrote; still secondhand evidence about Corc's recommendation. Do not convert it into established incompatibility or delete existing saves. |
| F10 | A different developer, SardineMilk, posts a retro-styled Protolike with status, actions, activity, combat and a tall log. They explain that the interface was made in-world by cultivators, while actions/activity were modified for the protagonist. | [Screenshot post](https://discord.com/channels/622495527485046805/811370601129705483/1559668535108571179), [diegetic explanation](https://discord.com/channels/622495527485046805/811370601129705483/1559704901431599155), [protagonist panels](https://discord.com/channels/622495527485046805/811370601129705483/1559705376373342319). This is another Protolike, not Corc's unreleased Proto23 UI. |
| F11 | Replies like the retro appearance, while the author seeks a font that retains the style and remains pleasant to read. | [Font discussion](https://discord.com/channels/622495527485046805/811370601129705483/1559679132332195971). Positive aesthetic feedback from a few participants is not usability or gameplay proof. |
| F12 | Participants debate broad moral categories versus contextual/faction relationships and graded labels. | [Faction relationship preference](https://discord.com/channels/622495527485046805/811370601129705483/1559864558812663809), [labeling explanation](https://discord.com/channels/622495527485046805/811370601129705483/1559704901431599155). Game-rule assertions about D&D/other systems are unverified player commentary. |
| F13 | Players disagree about an Idle Loops branch: one values storytelling and understandable optimization, another describes hitting a wall. Miktaew discourages designing purely to defeat another game. | [Positive account](https://discord.com/channels/622495527485046805/811370601129705483/1559649203603636257), [friction account](https://discord.com/channels/622495527485046805/811370601129705483/1559638064060436602), [Miktaew](https://discord.com/channels/622495527485046805/811370601129705483/1559635960981885001). Preserve the differing experiences; no representative frequency or independent evaluation is claimed. |

### Additional absorption proposals from the received slice

P6. **Account for now:** an in-world interface can have an author, audience and
blind spots. This extends the existing comic-logic/tag owner: a cultivator's
classification can express institutional judgment without silently becoming
universal moral truth. Where a world's alignment is mechanically objective,
preserve that premise. Consequential UI needs to distinguish a source's label
from the operative rule. No new global alignment engine is proposed.

P7. **Adapt within an authorized UI slice:** the Protolike screenshot separates
a list of available actions from the state of the ongoing activity. Its climbing
activity exposes height, grip and Leave Activity beside the actions. The useful
pattern is a readable ongoing situation with a clear exit, rather than only a
progress bar. Fit this into existing YAIR place/focus and activity owners if
selected. Do not copy the retro skin as a replacement for the accepted Proto23
Shell variant, or claim the screenshot proves functioning simulation. Check
rebuilt desktop discoverability and activity cancellation if implemented.

P8. **Trial later:** progression explanations and story framing should make
optimization understandable before demanding repeated attempts. The opposing
Idle Loops reactions justify inspecting a concrete bottleneck, not importing a
whole system or adjusting YAIR balance from anecdotes. Compare regular play and
an informed strategy, recording time-to-capability and explanation quality.

P9. **Account for now:** keep the shared recognizable UI structure, then let a
world's institutions and the continuing protagonist explain selected differences.
The Protolike's protagonist-only panels are an interesting design rationale,
not authorization to split YAIR's shared controllers or add duplicate panels.
This is consistent with current shared-component and in-world UI rules.

### Required correction before comprehensive review

Export both specified channels using Discrub's full-history/all-messages route,
not a loaded/selected-message export. Include accessible active and archived
threads. Prefer JSON for machine review and retain original HTML/media when
available. Preserve completion/warning information. If the YAIR file exists
elsewhere, provide its exact local path. No extension setting is asserted from
memory as an exact current control label. Recheck counts, boundaries and known
developer IDs after receiving replacements. Current state is **partial archive
verified and reviewed; full export and comprehensive review still open**.


## Second export and exact collection correction, October 15

`Downloads/proto_23 (1).zip` is 1,401,827 bytes and CRC-valid, but contains
exactly the same 100 message IDs and date boundaries as the first archive.
Private `second-export-verification.json` records its hash and set comparison;
the original second ZIP is preserved separately. No YAIR export is present
among the newest Downloads files inspected. Increasing media options did not
increase message coverage; a specific settings cause is not observed.

The installed Discrub panel still exposes only an empty extension iframe to
browser automation: no buttons were available through its frame locator. This
pass did not bypass the previously explicit Chrome extension-UI restriction.
No export was initiated by the agent.

Current upstream source establishes the important distinction more precisely
than the earlier generic full-history instructions:

- [ExportDialog.tsx](https://github.com/pratherbytecraft/discrub/blob/main/src/containers/ExportView/ExportDialog.tsx)
  selects `selectActiveFilteredMessages`. Ordinary export exports the active
  loaded/filtered messages; a Full Archive preset alone does not fetch history.
- [BulkExportDialog.tsx](https://github.com/pratherbytecraft/discrub/blob/main/src/containers/ExportView/BulkExportDialog.tsx)
  is the channel-selection route. Its title is **Bulk Export Channels** and
  the two-channel action is **Export 2 Channels**.
- [exportSlice.ts](https://github.com/pratherbytecraft/discrub/blob/main/src/features/export/exportSlice.ts)
  bulk execution calls `fetchAllChannelMessages` for each selected channel.
  With thread separation enabled it also invokes `fetchThreadMessages`.
  This documents the collection route, not a proof of successful collection
  or independent discovery of every archived source thread.
- [English UI strings](https://github.com/pratherbytecraft/discrub/blob/main/src/i18n/locales/en.json)
  name the option **Download threads (fetch and export thread messages into
  individual files)**. Choose JSON, enable this option and needed media,
  clear content/author/date filters, select only Proto23 and YAIR in Arcanum,
  and run **Export 2 Channels** from **Bulk Export Channels**. Keep the tab
  open through completion and retain warnings. Verify the result locally.

These are current upstream labels and behavior; the installed build revision
was not verified. The blocked UI means this precise manual step still remains.


## Load All failure: HTTP 429, October 15

User supplied a screenshot of YAIR's Load All failure: HTTP 429. This is a
rate-limit response, distinct from the earlier successful but partial exports.
Stop repeated attempts; use any reported retry/reset interval before continuing.
Current Discrub README documents Settings > Operation Delays, including search
pacing and retry waits. Increasing search delay is a reasonable diagnostic
trial, not proof of recovery. Preserve loaded messages and do not reset local
extension data. Retry one channel at a time after the cooldown; retain the
status log if the error recurs. Do not infer a fixed cooldown from the screenshot.

The SMART owner says the prior successful HTML/media ZIP was discovered after
completion; the agent did not observe the final export clicks or verify its
installed build. Thus prior exact settings and route are unknown. Earlier
instructions in this chat overstated certainty about matching that workflow.

## Corc attachment and design continuation, October 20

[Media and design collection](CORC_MEDIA_AND_DESIGN_2026-10-20.md) preserves all
23 newly supplied local files and seven linked media resources, traverses the
308-result Corc attachment search, saves cached media and 17 selected context
windows, and records F14–F29 with their source dates and attribution. It also
preserves the tooltip chronology correction and distinguishes saved derivatives,
original file downloads, missing attachments and unreviewed content. This does
not close the earlier full-channel/thread archive gate. A separate local
`discord-reference-workbench` chat now owns existing-exporter research and a
thin indexing/verification toolset; no new product direction or runtime work
is selected.
