# Corc missing-media recovery, 2026-10-21

**Recovered 26/26 requested attachment IDs; unresolved: 0.** The immutable request SHA256 is `362ecc4bf3daf5ffd3cb5bbb2de90645727f174259e836732d057de2ccd577a1`. Recovered originals total 31,701,366 bytes: 12 HTML files, eight PNGs, one GIF, three MP3s, one font collection and one text save. This is the Corc set, separate from YAIR's recovery-166.

Authority/scope: the packet's explicit user request; AD32/35/36/37, AU1–AU15 and sealed-secrets handling. No runtime work or new accepted design decisions.

## Evidence and verification

Private root: [recovery-26](../../../research/proto23/private/discord-media-2026-10-20/recovery-26-2026-10-21/).

- **E1:** [26-row coverage receipt](../../../research/proto23/private/discord-media-2026-10-20/recovery-26-2026-10-21/coverage-receipt.json) reconciles the exact requested set, source post/channel, refreshed resource URL, byte count, MIME, SHA256 and decode result. Every requested ID has one successful original CDN response. No publisher reference hash exists, so this proves bytes returned by the original URL and preserved locally, not independent historical byte identity.
- **E2:** [Private safe gallery](../../../research/proto23/private/discord-media-2026-10-20/recovery-26-2026-10-21/catalog/index.html) and [catalog report](../../../research/proto23/private/discord-media-2026-10-20/recovery-26-2026-10-21/catalog/report.md) retain 26 target posts and 26 selected nearby windows. Their seven additional context-only attachment IDs are outside the immutable request, not seven failures of this recovery. Context author headers remain unverified where grouped rows omit them.
- **E3:** [Transport log](../../../research/proto23/private/discord-media-2026-10-20/recovery-26-2026-10-21/transport.json), [source observations](../../../research/proto23/private/discord-media-2026-10-20/recovery-26-2026-10-21/observed.json) and per-post `contexts/` preserve provenance. The existing workbench's scoped serial relay consumed freshly observed signed-in Chrome links without credentials. One spoiler first yielded a WebP display derivative; it remains separate from the subsequently recovered original PNG.
- **E4:** `verify-recovery.py` passed: exact 26-ID reconciliation, all 27 source/derivative record hashes and sizes, image decode across every frame, complete FFmpeg decoding of all three MP3s, valid three-font TTC header/offsets, gallery local-reference checks and private Git ignore checks. The GIF is 17×22 with two frames. Workbench `catalog`, `gallery` and `verify` passed with zero import/integrity issues across 26 unique byte objects. Two distinct original attachment IDs share identical HTML bytes. No video is present in this request. Gallery browser rendering was not exercised.

HTML and the save stayed inert; the font was not installed. No source files were executed or saves imported. Prior manifests were preserved. No gameplay gates were run because no gameplay changed.

## Useful source corrections and proposals

These continue F14–F29 in the Corc owner. They describe dated source evidence, not current shipped behavior or accepted OOPS designs.

| Code | Correction / useful consequence | Source |
| --- | --- | --- |
| F30 | The “leveling sticks” screenshot contains an invalid numeric progress value. Corc explains that broadly levelable objects can lack the information needed to display correctly. This is evidence of an incomplete experiment, not a complete universal item-leveling feature. A candidate OOPS check is to distinguish a mechanically supported action from a readable, fully specified presentation. | [2021-11-23](https://discord.com/channels/622495527485046805/811370601129705483/912757826227666964), recovered PNG and nearby explanation |
| F31 | The font attachment follows a missing-font problem and a stated plan to bundle the font. It does not prove font bundling shipped or confer reuse rights. Proposed UI follow-up for the parent: verify intended typography on a clean host without relying on locally installed fonts; reconcile with UR59–UR64. | [2023-11-22](https://discord.com/channels/622495527485046805/811370601129705483/1176824068851388426) |
| F32 | Several HTML attachments are small standalone canvas experiments, rather than Proto23 releases. The March 2022 and May 2026 `34.html` posts have identical SHA256 despite different attachment IDs. The effect-icon HTML was described as a tool for a friend; static source exposes icon/color controls. Candidate UI-authoring follow-up: separate an authoring experiment from player-visible capability. No execution or working-tool claim. | [2022-03-18](https://discord.com/channels/622495527485046805/811370601129705483/954357973046669343), [2026-05-06](https://discord.com/channels/622495527485046805/811370601129705483/1501631996059979896), [effect tool](https://discord.com/channels/622495527485046805/811370601129705483/1476399903218335766) |
| F33 | The February 2024 HTML was offered in response to background-tab slowdown, with tentative developer confidence. Its recovery establishes an historical candidate fix and exact artifact, not successful background scheduling or offline progression. Any adaptation needs its own measured clock behavior. | [2024-02-22](https://discord.com/channels/622495527485046805/811370601129705483/1210396633863290942) |
| F34 | The recovered set includes personal music, a cat photo, reaction imagery, code-line/version crops and a shared save. These must not be counted as missing gameplay screenshots or treated as soundtrack/game-feature evidence. Nearby music discussion supplies attribution/context, not implementation. | [music demo](https://discord.com/channels/622495527485046805/811370601129705483/1177533483275538472), [photo context](https://discord.com/channels/622495527485046805/811370601129705483/1259562601755578458) |

## Completion boundaries

Recovery and local integrity are complete for the finite request. Design observations remain source-qualified proposals; gameplay implementation and human acceptance are untouched. Shared usage meter: 47% at start, 47% after pilot, 48% between/final batches, below the 52% ceiling. Shared movement is not task-attributable usage. No paid fallback, agents, successors, messages, commits or pushes.
