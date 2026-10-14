# AX1 extended: sound follows known, settled stories

2026-10-14. **PROPOSAL ONLY.** Extend [root AX1](../../../../PROCEDURAL_STORY_AND_CONTENT_CONSIDERATIONS_2026-10-14.md#ax-sound-for-stories). This is optional presentation and retains AX1's low priority. [P14](../p14/CHRONICLE.md) supplies known story editions, [P25](../p25/VIEWS.md) supplies reading scope, and P20 supplies current place state. [P6 CREATIVE_WORKS](../p6/CREATIVE_WORKS.md) owns in-fiction music objects/performance; P35 presentation music cannot grant their mechanical effects.

## AX1.1: live audio source audit

SHOWN/SOURCE means inspected source, not audible/runtime proof. Main checkout locators are separate from P2 branch locators. No device, browser, audio playback or build was used here.

| Code | File:line | Verified source structure and limit |
|---|---|---|
| AU-S1 | `src/settled_text_effects.js:4–6,30–57` | Presentation-only interface; sound defaults false. `gesture()` creates/resumes AudioContext when enabled. `tone()` uses a sine oscillator at 440 Hz with gain 0.035 decaying over 0.12 seconds and stop at 0.13 seconds. This is one receipt cue, not musical person/thread/place motifs. |
| AU-S2 | `src/settled_text_effects.js:58–70,100–104,127–133` | Visible-document presentation deduplicates within a bounded in-memory set, cancels prior presentation, and calls tone only after Effects is not off. Hiding the document cancels current work; destroy closes the context. Restore-session cue identity is not a durable story ledger. Effects-off currently gates the sound path too. |
| AU-S3 | `src/customization_profiles.js:11–20,41–49`; `src/customization_ui.js:17,34–36,120–124` | Ledger/crafting/skills effect modules, sound boolean default false and visual motif enum. Effects & sound offers gesture-enabled preview. The seal/guidance/closing motif setting selects visual geometry; it does not select a different audio melody. |
| AU-S4 | `src/main.js:2307–2318,4167–4169,8328–8333`; `src/work_ledger_ui.js:14–28` | Work Ledger saves before presenting receipt events; native craft entry and ledger submit unlock their sound engines by gesture. Separate effect hosts can own separate contexts. Reuse the settled boundary, with explicit ownership of any future shared mixer. |
| AU-S5 | `src/native_discovery_feedback.js:8,22–24,35–57,59–65` | Discovery feedback uses the same effect engine, pointer/key gestures, queued settled events and a reset/cancel path. It does not provide a story score or narrator. |
| AU-S6 | `src/main.js:7572–7582` | Background “sounds” are randomly chosen strings passed to the message log. They are textual ambience, not audio playback. Those `Math.random` sites are presentation source in this snapshot; they do not establish saved music variation. |
| AU-S7 | Search of `src/`, `index.html`, `package.json` for AudioContext, oscillator, Audio constructor, speechSynthesis and SpeechSynthesisUtterance | Audio construction was found in settled_text_effects; no speech synthesis call was found in that search scope. Absence is scoped source evidence, not a claim about browser capabilities, all assets or future concurrent changes. |

INFERRED joins: restore must not announce an old deed as new; muting should discard a pending cue rather than replay it later; adding music/TTS needs channel settings beyond a boolean; stopping one host must not leave another host playing. These are proposed extensions, not reproduced defects. The existing sound default and Effects-off behavior stay intact unless a selected compatibility decision changes them.

## AX1.2: motif and ambience bindings

Proposed binding: safe known subject/thread/place handle, original score/asset revision, known emotional/episode phase, qualifying settled receipt or observed state revision, presentation policy and stable motif identity. Do not choose a motif by secret allegiance, hidden power rank, undiscovered death, actual culprit or an unlearned relationship. A familiar theme for an anonymous figure can reveal identity; use distinct public handles until the discovery route connects them.

| Binding | Original candidate | Transition basis |
|---|---|---|
| Person | A short two/three-note phrase using curated pitch/rhythm/instrument families | First actual introduction; later known departure/return or chosen relationship milestone |
| Thread | Same phrase with a different ending for pending, resolved or interrupted work | Settled request phase and observer-visible outcome, not pacing tension guessed from private truth |
| Place | Soft wind, work rhythm, rain or quiet room layer | Current observed place/weather/work state under its domain owner; no remote unseen fire alarm |
| Object | Optional brief recognizable timbre for a known heirloom or workshop | Supported acquired/provenance evidence; raw product key never enters labels/audio metadata |

Generate coherent arrangements from a small authored grammar or ship original licensed loops. Keep note/asset binding stable across reload/source revision if recognizable identity is promised; audio rendering/timing can be device-dependent. New score editions may be explicitly selected. No combat or crafting draws are consumed by listening, previewing, pausing or returning to a tab. Avoid inventing wall-time story events to align a beat.

Proposed mixer: one place layer, one foreground phrase, optional narration ducking, each with independent volume/mute and a master Stop. These are engineering presentation budgets, not fictional frequency caps. Local tone/pacing adjectives can permit frequent or continuous music. Let player choose sparse/full/quiet policies; several themes and routes remain available. Synthesized originals avoid asset downloads; recorded originals remain an option with creator/license and revision manifests. No copied franchise soundtrack or borrowed character theme is proposed.

## AX1.3: optional system TTS narration

Prefer a deliberate **Read this** control on the selected already-projected scene, codex passage or recap. Optional automatic narration can later target explicitly selected known channels. It never acknowledges a recap, accepts an offer, changes the clock or interprets undisplayed text. Speak the displayed basis labels and uncertainty, retaining the same observer lens. Do not send raw context, truth records, hidden DOM, private novel notes or a full save to speech.

STATED-primary documentation checked 2026-10-14: MDN's [SpeechSynthesisVoice.localService](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisVoice/localService) distinguishes local from remote synthesis services. Therefore “system voice” alone is not proof of local processing. Proposed default: permit only a voice explicitly reported local, and leave narration unavailable if none qualifies; remote voices remain a separately deliberate option with the routing stated before use. Actual installed voices and browser behavior were not inspected.

MDN's [SpeechSynthesis.cancel](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis/cancel) documents clearing queued utterances and stopping current speech. Proposed owner: a single narration controller, cancellable on Stop, changed selection/lens, import/reset, loss of visibility or disabled narration. Clear pending utterances too; callback tokens prevent an old completion callback from starting another passage. Pause/resume can be exposed if verified for the selected browser/voice; do not promise exact resume across reload. The general SpeechSynthesis page failed to yield usable content in this pass; the cited narrower pages support only the stated claims.

Voice/rate/volume are presentation preferences. Store a voice preference as a hint with a graceful local/text fallback, not a universally portable installed voice. Text/captions remain complete when speech fails. Render safe original text; public canon names can be pronounced, but no imitation of actors/characters or canon dialogue is needed. Player notes stay excluded from automatic narration unless selected. Screen-reader reading and TTS should not both announce a passage by default. This requires an actual accessibility review; do not disable a screen reader to make narration work.

## AX1.4: failure, silence and future gates

Audio failure is presentation failure. It cannot refund committed craft, repeat settlement, replace a request, alter a draw or block ordinary play. Restore shows the current known scene with no automatic backlog fanfare; explicit Replay/Read remains possible. Hiding a tab stops optional output while the gameplay clock follows its own existing policy. Separate local-browser preferences from saved story bindings; root chooses whether new settings belong in save profiles or per-browser display settings.

Candidate S35-4: one known traveler phrase plus one current-place layer that changes only after a real observed settled transition, using existing gesture/default-off semantics. Candidate S35-5: local-voice Read this for one safe recap with Stop and silent fallback. Audio synthesis source tests or an offline-rendered waveform do not prove hardware hearing.

At 1366x768/1600x1000 keep master Stop, active sound/narration label, independent channels and original text reachable in the relevant workspace. Mobile, cinematic scoring, every character voice, native OS bridge and offline story catch-up are deferred. All gates OPEN: gesture blocking/default-off; channel independence under selected compatibility policy; mute/cancel/hidden-tab teardown across hosts; hidden-state equivalence for audible choices/metadata; no draws/saves/mechanics from playback; no old cue replay on reload/import; unknown voice/local-only fallback; literal-file Import retains safe motif refs/preferences; rebuilt browser API behavior; physical hearing and human tone/comfort separately verified.
