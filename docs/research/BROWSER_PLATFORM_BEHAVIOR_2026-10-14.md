# Browser platform behavior, 2026-10-14

## CHECKPOINT

ER10 source research and repo mapping complete. Both requested outputs written.
READ evidence is from the shared checkout on 2026-10-14. All linked external
sources were checked on **2026-10-14**; access dates are not publication dates.
No browser timing, eviction or gameplay experiment was run. No MEASURED runtime
claim appears here. Resume only for a named unresolved fact or an authorized
fresh-origin browser probe. Recommendations are proposals, not specs or accepted
offline policies.

Scope: desktop Chrome, Safari on macOS, Firefox and Chromium Edge. Proposed
playable checks target 1366×768 and 1600×1100. Mobile optimization stays deferred;
mobile event-loss examples explain API limits without adding a mobile gate.
No runtime, build, save, private pack, root palette or live-owner file was changed.
Files named `SECRETS*` and personal saves were not opened.

This extends the [root palette](../ENGINE_RUNTIME_PERFORMANCE_AND_STACK_CONSIDERATIONS_2026-10-14.md),
[E1–E10](../ENGINE_SAVES_AND_SCALE_REVIEW_2026-10-11.md) and
[offline audit](OFFLINE_TIME_AND_BRANCH_CLOCK_AUDIT_2026-10-14.md).
Use [ER1](RUNTIME_HOTSPOT_AUDIT_2026-10-14.md) for the timer/hotspot inventory
and [ER3](TECH_STACK_OPTIONS_2026-10-14.md) for backend/worker adoption contracts.
USER_VISION and PROJECT remain product authority. A browser capability does not
select who earns absent time, authorize a storage migration or close native gates.

## Per-browser facts

**STATED** means documented external behavior. **READ** means repo source.
**INFERRED** marks conclusions and proposals, including Chromium inheritance
where an Edge-specific source does not establish the exact behavior. Unknown
numeric limits are left unknown rather than copied from another engine.
Support floors below come from MDN browser compatibility data, not a local test.
API availability does not promise availability in every insecure/private context.

| Code / topic | Chrome desktop | Safari desktop | Firefox desktop | Edge desktop |
| --- | --- | --- | --- | --- |
| ER10-F1 Timers | STATED: chained timers with nesting ≥5 and requested delay <4 ms clamp to 4 ms. Hidden checks can batch at 1 s. Intensive checks at 1 min require hidden >5 min, silent ≥30 s, chain ≥5, no qualifying WebRTC. Sound within 30 s or visibility avoids intensive mode; silent audio does not count. [S1](#sources) | STATED: WebKit throttles background/obscured timers [S3]. Exact current minimum and intensive threshold not established by these official docs. Do not assert Chrome's 1 s/1 min rules for Safari. Nested HTML timer floor is 4 ms [S2]. | STATED: inactive desktop minimum 1 s; AudioContext exemption. Recognized tracking scripts can get a 10 s background minimum 30 s after load. Loading can defer timers until idle/load. Nested floor 4 ms [S2]. | INFERRED: Chromium timer policy is the starting expectation, not an Edge guarantee [S1]. STATED: Sleeping Tabs can pause a page, beyond ordinary clamping [S4]. User/enterprise settings change this. |
| ER10-F2 Hidden rAF | STATED common: rAF pauses in most hidden tabs/iframes; not an elapsed-time clock [S5]. | Same documented general behavior [S5]; no promised hidden cadence. | Same [S5]. | Same [S5]; sleeping further removes execution [S4]. |
| ER10-F3 Freeze/discard | STATED: `freeze`/`resume`, desktop `document.wasDiscarded`; frozen task queues stop timers/fetch callbacks. Discard fires no last event and requires reload [S6]. | STATED: Page Cache suspends a document [S7]. No portable Chromium freeze/resume/wasDiscarded contract; use standard lifecycle signals. | Chromium-only hook coverage is absent in the lifecycle support panel [S6]. Standard history/visibility signals apply. Process loss cannot be handled by a final guaranteed callback [S8/S9]. | STATED: Chromium lifecycle API support is listed [S6]; Sleeping Tabs freeze and can precede discard under pressure [S4]. Exact intervention time depends on configuration. |
| ER10-F4 Leave/restore signals | STATED common: `visibilitychange` to hidden is the last reliably observable session signal; `pagehide` is bfcache-compatible, with `persisted` indicating cache intent; `pageshow.persisted` proves a cache restoration. `pagehide` can be missed, and cache intent does not guarantee later restoration [S8/S9/S10]. | Same portable signals. Page Cache retains objects rather than doing normal startup [S7]. | Same portable signals. | Same portable signals. |
| ER10-F5 bfcache eligibility | STATED: timers/promises pause rather than proving a reload. Open IDB transactions/connections, ongoing requests, WebRTC and opener relationships can block in some engines [S10]. `unload` rules are changing [C2]. WebSockets no longer block Chrome as of 149 [S10]. Held Web Locks changed in 146 [F11/C3]. | STATED: Safari can cache despite an unload listener and skip firing it. Open WebSockets do not block according to current web.dev; other shared APIs can block [S10]. No universal eligibility list. | STATED: unload listener blocks per web.dev; beforeunload disagreement [C1]. Shared APIs can block; web.dev contrasts Chrome/Safari with other browsers on WebSockets [S10]. | INFERRED: Chromium baseline, subject to Edge policy/build. Do not infer cache success from engine family. Test navigation and restored events. |
| ER10-F6 beforeunload | STATED common: unreliable, especially process/app termination; dialog requires sticky activation and shows generic browser text. Use only for unsaved-change warning, attach conditionally [S11]. | Same; no save guarantee. | Same; bfcache blocker is disputed [C1]. | Same; no save guarantee. |
| ER10-F7 localStorage | STATED common: MDN documents 5 MiB localStorage plus a separate 5 MiB sessionStorage allowance per origin. Quota failure throws; privacy/settings can restrict storage. These are separate from IDB/OPFS capacity [S12]. | Same small Web Storage limit; do not replace it with Safari's disk percentage. | Same. | Same. |
| ER10-F8 IDB/OPFS quota | STATED: shared origin-managed storage allowance up to 60% total disk, best-effort or persistent [S12]. Actual free disk can prevent reaching it. | STATED Safari 17+: browser origin up to 60% disk, aggregate up to 80%; non-browser WebKit embedding 15%/20%; cross-origin frame quota one tenth. Standalone Dock/Home Screen app gets browser-sized quota [S13]. | STATED: best effort smaller of 10% profile disk and 10 GiB site group limit; persistent 50% disk capped at 8 TiB, without group limit [S12]. | STATED Chromium allowance up to 60% disk [S12]. Not 60% currently free space. |
| ER10-F9 Eviction / Safari cap | STATED common: best effort can be evicted under pressure; persistent storage is intended to resist automatic eviction, not user deletion. Private data usually clears when private mode ends [S12/S14]. | STATED: origin-level eviction, least-recent use, storage pressure/aggregate quota; active/persistent origins may be excluded [S13]. ITP deletes script-written data after seven days of **Safari use without site interaction**, not simply seven elapsed days [S15]. Exceptions and persist conflict below. | Best-effort eviction remains possible [S12]; no Safari ITP seven-day rule documented for Firefox. | Best-effort eviction remains possible [S12]; no Safari ITP rule documented for Chromium Edge. |
| ER10-F10 `storage.persist()` | STATED: request resolves boolean, may be denied; secure context. Chromium generally decides silently using engagement [S14/S12]. Check `persisted()`, do not assume success. | STATED: full Storage API policy described for Safari 17+; heuristics include installed Home Screen apps [S13]. MDN BCD lists method from 15.2 [S19]. Older API exposure is not full policy equivalence [C5]. Persist is not a proven ITP exemption [C4]. | STATED: persistence permission can prompt [S12]; method support from 57 [S19]. | STATED: generally silent engagement decision [S12], Chromium method support [S19]. |
| ER10-F11 Web Locks / tabs / bfcache | STATED: same storage bucket coordinates tabs/workers; exclusive callback holds ownership until its returned promise settles. Chrome 69+ [S17/S19]. Chrome 146 allows held locks into cache; active request **or query** of such a lock evicts holder to release it [S18]. | STATED API from 15.4 [S19/S20]. Exact current held/pending-lock cache rule is not established by the checked Safari release docs. Do not claim Chrome 146 policy here. | STATED API from 96 [S19]. Spec discussion records Mozilla interest but not a shipped adoption of Chrome 146 behavior [S18]. Exact current rule remains open. | STATED API in Chromium Edge [S19]. INFERRED: Chrome 146 change may carry through; no Edge-specific release confirmation found. Probe actual build. |
| ER10-F12 CompressionStream | STATED: constructor from 80; use portable gzip/deflate; feature-detect formats [S19/S21]. | STATED: from 16.4, also described in WebKit release [S19/S22]. | STATED: from 113 [S19]. | STATED: BCD mirrors Chromium support [S19]. |
| ER10-F13 Hidden workers | STATED: Worker timers are asynchronous requests, not deadlines [S23]. Neither the checked docs nor API availability establish immunity from background throttling. Freeze/discard removes any guaranteed delivery [S6]. | STATED: WebKit documents dedicated-worker suspension for Page Cache in implementation records [S24]. Exact merely-hidden worker throttle thresholds remain open. | No current official numeric hidden-worker cadence established here; Firefox TimerFirings logging can inspect timer execution [S25]. Do not copy the Window 1 s rule onto every worker type. | INFERRED: Chromium worker expectations with Sleeping Tabs intervention. No guaranteed worker keepalive [S4/S23]. |
| ER10-F14 Math precision | STATED common: transcendental/power functions may return implementation-dependent approximations, even across OS/CPU with one engine [S26/S27]. A universal one-ulp maximum is not established. Chrome uses V8, Safari JavaScriptCore, Firefox SpiderMonkey, Edge Chromium/V8; shared engine alone does not guarantee bit equality. | Same contract. | Same contract. | Same contract. |
| ER10-F15 Intl / collation | STATED common: omitted locales use implementation default; supported locale data and best-fit negotiation vary. Even explicit-locale output can vary, contain nonbreaking spaces/bidi controls; localeCompare guarantees sign, not exactly ±1 [S28/S29/S30]. Do not serialize localized text as canonical numbers/order. | Same; engine/OS locale data can differ. | Same; locale data/revision can differ. | Same; language settings can differ from Chrome. |

Quotas are upper policy limits, not reserved bytes. OPFS is part of origin storage,
not a second unlimited disk. `estimate()` is an estimate, not a localStorage
capacity test. IDB/OPFS availability and async commits do not remove crash,
quota, eviction or migration requirements. These adoption implications are
INFERRED, grounded in F7–F10 and ER3's async-publication contract.

## Safari seven-day scope and exceptions

ER10-F9 details, STATED: the 2020 WebKit post names LocalStorage, IndexedDB,
SessionStorage, media keys, service-worker registrations and cache [S15]. Moving
a save to IDB or a service worker is not an ITP escape. The current tracking
policy explicitly exempts the first-party domain of Home Screen web apps and
describes separate storage from Safari [S16]. A WebKit maintainer confirms the
same ITP exemption for macOS Dock web apps in bug 209563 [S31]. That confirmation
is an implementation-owner comment, not a timed retention experiment.

Site interaction resets the relevant counter; automated storage writes are not
documented as a substitute for user interaction. Seven days while Safari is not
used are not seven days of Safari use [S15]. Server-set cookies are outside the
general script-writable-storage list, but separate tracking rules can cap them
[S16]; moving an offline game save into cookies is not a useful proposed fix.
Dock/Home Screen exemption does not prevent user deletion or every storage-pressure
failure. OPFS is not named in the old list; WebKit's later File System storage
policy includes interaction-based eviction [S13], so no OPFS exemption is claimed.
Granted persistence versus ITP is explicitly unresolved in C4.

## Contradictions and version gaps, recorded both ways

| Code | Source A says | Source B says | Handling / affected codes |
| --- | --- | --- | --- |
| ER10-C1 | MDN beforeunload: Firefox listeners prevent bfcache [S11]. | web.dev: modern browsers no longer lose bfcache eligibility for beforeunload [S10]. | Direct conflict, not silently resolved. Keep conditional warnings; compare supported Firefox build with/without listener. MC15/16. |
| ER10-C2 | web.dev says desktop Chrome unload listeners block cache and describes deprecation as upcoming [S10]. | Chrome's deprecation page updated July 14, 2026 schedules 100% page-load rollout at 154, Sep 22, 2026, with opt-outs and dates subject to change [S32]. | Older blanket guidance cannot establish this origin's current rollout. Avoid unload in either case; do not claim measured rollout completion. MC15/16. |
| ER10-C3 | Web Locks draft terminates locks during unloading cleanup [S17]; MDN lists `lock` as a non-restoration reason [S33]. Older issue comments describe lock-related blocking. | Chromium implementers say held-lock caching and contention/query eviction shipped in Chrome 146 [S18]. Chrome lifecycle guide still recommends release on freeze [S6]. | Implementation/spec gap. Recommendation to release is compatible with newer behavior, but a blanket blocker claim is stale for Chrome 146+. No cross-engine inference as STATED. MC16/20, RT5. |
| ER10-C4 | MDN persistence summary describes automatic-eviction protection; WebKit policy says persistent origins may be excluded [S12/S13]. | WebKit bug reports ITP deletion despite persist; proposed fix PR 48369 was closed **unmerged**, confirmed via GitHub API [S31/S34]. | Policy categories differ, and the bug remains contrary evidence. No claim that persist defeats ITP. Reports are not proof every current Safari build fails. Use export and installation exemption, keep exact Safari retention check open. MC17, DA1/7. |
| ER10-C5 | MDN BCD lists Safari persist method from 15.2 [S19]. | WebKit describes fully supported Storage API/new storage policy starting Safari 17 [S13]. | API exposure versus complete storage policy, not necessarily a contradiction. Target modern Safari; verify result and installed mode, not constructor presence alone. MC17. |
| ER10-C6 | Current WebKit tracking page abbreviates cap to seven days without interaction [S16]. | Detailed WebKit launch post explicitly counts days of Safari use [S15]. | Wording gap; retain both links, use detailed use-day condition. Do not present a seven-calendar-day expiry promise. MC17. |

## Repo impact, severity, smallest handling and reproduction

Each row is READ plus INFERRED consequence/proposal. Severity describes a long
campaign risk, not an observed loss. Reproductions below are ideas, **not run**.
Use synthetic fixtures, a fresh origin and an isolated rebuilt candidate for any
future gameplay claim. All F1–F15 facts map below; absent APIs are prospective
adoption impacts rather than current defects.

| Code / facts | READ file:line | Severity / MC and root codes | Minimal reproduction idea | Smallest fix proposal and cost |
| --- | --- | --- | --- | --- |
| ER10-R1 / F1, F3, F13 | `src/main.js:7226-7246,7673-7693`; `src/main.js:2532`; `src/models/combat.js:198-215,241` | **Wrong outcome:** callbacks gate calendar, actions and attacks differently. MC1/2/5, RT1/2/8, PF4, TS4. Extends offline F2/F5/F6. | Equal foreground/hidden intervals, hide >6 min silent, lid sleep and return; compare game clock/action/combat counters and wall time. Run worker timer alongside only if evaluating TS4. | Define pause/resume eligibility and one elapsed reconciliation boundary before timer/worker replacement. Use monotonic durations while awake, separate capped wall cursor for authorized absence. Medium; worker migration is not the fix for a missing time policy. |
| ER10-R2 / F3–F6 | `src/main.js:7630-7654` callback autosave/backup; `src/main.js:7246` skips counters on no advancement; `src/main.js:5255-5266` guarded manual save; VFX-only visibility at `src/settled_text_effects.js:127-131`, `src/native_discovery_feedback.js:59-62` | **Data loss:** unsaved legacy progress and view state can vanish on termination. MC15/16, RT5, CH7, E2/10. No source gameplay lifecycle save handler found. | Make synthetic unsaved progress; hide then navigate, kill after hidden, Back, reload. Assert durable progress/last-success status, not just a fired event. | Add idempotent owner-only hidden checkpoint and pagehide fallback through existing save path, bounded to dirty state; continue normal saves during play. Preserve failure reporting, avoid unload. Small to medium; serialization cost matters, use ER1 evidence. No last event guarantees crash safety. |
| ER10-R3 / F3–F5, F11 | `src/main.js:588-597` never-settling lock promise; `src/main.js:7879-7891` one startup ownership result; `src/main.js:5256` stale boolean used as write guard | **Data loss / wrong outcome:** freeze can strand ownership; restore can show stale state. MC16/20, RT5, DA1, E2/3. Existing held lock is real protection; no observed duplicate writer is claimed. | A owns, navigate away, B acquires/queries, Back A; record pageshow.persisted, actual lock ownership, storage revision, and which tab can pay/save. Also freeze A without navigation. | Retain an explicit lock-release resolver; revoke ownsSave before release on pagehide/freeze, drain/stop writes, reacquire and reload latest compatible envelope before enabling commands. Deduplicate pageshow/resume/visible events. Medium; just rerunning acquire without stopping writers/reloading would be unsafe. Never use `steal` as routine handoff. |
| ER10-R4 / F7–F10 | `src/save_files.js:194-215` conservative 4 MiB shared-key budget and quota catch; `src/main.js:415-422` shared guarded adapter; `src/expansion_persistence.js:47-50` synchronous publish boundary | **Data loss / annoyance:** capacity failure is caught, but eviction removes all same-origin recovery copies. MC17/18/21, DA1/2/7, RT5, E2/3/6. | Synthetic primary+backup+display/layout keys near guard; deny writes; reload; repeat in private mode and simulated missing-origin storage. Never fill the user's origin/disk. | Keep guard and last-good records, expose durable-save/export status; optionally request persistence and display actual result. Distinguish IDB/OPFS allowance from localStorage limit. Small for status, medium/high for async migration, which must await transaction commit before live publication. |
| ER10-R5 / F9/F10 Safari | `src/main.js:7075-7093` localStorage load; `src/save_files.js:158-182` file roundtrip; `src/main.js:8490-8509` same-origin backup labels | **Data loss:** long absence can remove primary and backup together. MC17, DA7, OS6, E2. | Disposable Safari site: export, record mode/persist result, seven Safari-use days without site interaction; compare browser versus Dock app. An accelerated mock proves handling only, not ITP retention. | Make file export/reminders useful and optional installed-mode guidance truthful. Keep current file codec. Small; persist alone is insufficient evidence. No server/cloud requirement added. |
| ER10-R6 / F2/F13 | `src/display.js:377-392` 30 ms floating effects; `src/display.js:5930-5931` timeout plus rAF; `src/settled_text_effects.js:16,127-131`; no Worker/SharedWorker construction found in `src/` | **Annoyance / battery:** visual intervals still wake while hidden; rAF time is not sim time. MC27, RT3/4, PF5, TS4. | Hide during effects, count callbacks and CPU; restore after effect end; inspect animation cleanup. Future worker spike measures messages/timers in all four browsers. | Cancel/pause remaining visual timers on hidden and render current state on return. Small. If worker adopted, use it for bounded compute, persist resumable input/remainder, tolerate missing/late messages. |
| ER10-R7 / F12 | `src/save_files.js:158-182` marked UTF-8/base64 codec; `src/save_files.js:186-191` validation/preflight before write; no CompressionStream use found | **Prospective data loss / annoyance:** unsupported decoder/new marker could strand exported saves. MC19, DA3/4, RT5, E1/2. | Synthetic legacy and new export decoded in all supported browsers, absent constructor, invalid/truncated compressed input, unsupported format, oversized decompression. | Add optional versioned gzip file format only after a selected need; feature-detect, keep legacy decoder/export fallback, bound decoded size before load. Medium; compression does not increase raw localStorage capacity unless stored representation also changes. |
| ER10-R8 / F14 | `src/models/skill.js:347-359` rounded power coefficients; `src/items.js:615,625,661` fractional powers; `src/display.js:379,386` cosmetic trig | **Wrong outcome** near consequential thresholds; cosmetic differences are **annoyance**. MC6/8/10/34, RT2/9. | Same synthetic seed/commands and power inputs around rounding thresholds across engines/OS; compare canonical numeric state and receipts, not screenshot text. | Leave cosmetic trig alone. For strict replay, use pinned/versioned coefficient tables or explicit fixed-point rules in selected consequential domains. Medium; rounding after pow reduces sensitivity but does not prove identical threshold decisions. No actual cross-engine mismatch measured. |
| ER10-R9 / F15 | `src/simulation.js:498-511,522-525,545` locale-sorted effects/checks/controllers/programs; `src/pursuit.js:96,140`; `src/structured_equipment_runtime.js:75`; `src/misc.js:93-97` default formatting; `src/titles_ui.js:4` en-US formatter | **Wrong outcome:** locale sort can change causal tie order; **annoyance:** number strings differ. MC12/13/29/30/31, RT5/9. | Synthetic simultaneous checks/controllers and mixed case/accent/punctuation IDs; compare trace under en-US/sv/tr locales and browser engines. Compare text code points separately from numeric state. | Use locale-independent code-unit total order for machine IDs/command ties; keep Intl for player-facing text, with chosen locale/options and formatter reuse. Small comparator change but medium compatibility review: changed tie order must not silently reinterpret existing pending commands. Fixed locale alone does not pin ICU/CLDR data. |

READ absence check: `rg` across `src/`, excluding `SECRETS*`, found no IDB,
OPFS/storage-manager, CompressionStream, Worker/SharedWorker, beforeunload,
pagehide/pageshow, wasDiscarded or storage-event subscription. This is a bounded
source search, not proof against generated/dynamically injected code. Existing
display/layout localStorage keys share the game's origin quota
(`src/display_settings.js:41,72`; `src/workspace_layout.js:33,45`). Web Locks
coordinate cooperative writers, not arbitrary scripts, different browsers,
different profiles, origins/ports or separately partitioned storage [S17].

## Ranked proposals and open gate

| Rank / code | Value per effort, INFERRED | Codes informed |
| --- | --- | --- |
| 1 / ER10-A1 | Couple dirty-state checkpointing with explicit writer release/reacquisition and latest-save reload. This closes a save-safety seam before adding elapsed rewards. Cost: medium lifecycle/state-machine work. | MC15/16/20, RT5, E2/3/10 |
| 2 / ER10-A2 | Remove locale collation from consequential ID ties after a compatibility review; keep human sorting separate. Cost: small code change, medium replay/pending-order review. | MC12/13, RT9 |
| 3 / ER10-A3 | Add truthful last-success/export/persistence status; keep Safari ITP warning qualified by browser versus installed mode. Cost: small UI/status work. | MC17/18, DA7, OS6 |
| 4 / ER10-A4 | Gate elapsed-time reconciliation on the selected per-system policy. Workers only follow a measured compute bottleneck. Cost: medium/high core integration. | MC1/2/5, RT1/2/8, TS4 |
| 5 / ER10-A5 | Pause remaining visual intervals; use gzip or new storage only for an identified size/latency need. Cost: small VFX work; separate medium storage/codec adoption. | MC27, RT3, DA1/3 |

ER10-N1 adds an item missing from the palette: **capability, policy, mode and
browser version are separate evidence**. Record secure context, private/normal,
browser/OS build, installed/browser mode and actual persist result for platform
proof. `navigator.locks.query()` is not harmless monitoring of a cached holder
in Chrome 146; it can trigger eviction [S18].

Open acceptance: no fresh-origin desktop four-browser timing, freeze/discard,
bfcache two-tab ownership, Safari retention, storage-pressure or codec journey
was run. Browser binaries/version availability and supported minimums were not
inventoried. Firefox beforeunload, Safari/Firefox held-lock caching, exact Safari
hidden-worker cadence and Edge adoption of Chrome 146 remain specifically open.
Source statements are sufficient for this research output, not implemented
gameplay. Any future change requires isolated rebuilt bytes plus affected
Save/reload/literal-file Import, without user saves or private packs.

## Sources

Every URL below checked **2026-10-14**. Historical publications are marked where
material; checked-live sources can still lag implementations, as C1–C6 show.
Primary issue comments identify current implementations but are weaker than a
release note plus a local observed result. No third-party anecdote was used as
an authoritative browser rule.

| ID | Official source / relevant scope |
| --- | --- |
| S1 | [Chrome 88 chained timer throttling](https://developer.chrome.com/blog/timer-throttling-in-chrome-88/), published 2021; conditions/exemptions. |
| S2 | [MDN Window.setTimeout](https://developer.mozilla.org/en-US/docs/Web/API/Window/setTimeout), current nested/Firefox/Chrome policy. |
| S3 | [WebKit CPU Timeline](https://webkit.org/blog/8993/cpu-timeline-in-web-inspector/), 2019; background timer throttling, no current numeric guarantee. |
| S4 | [Edge sleep before discard](https://blogs.windows.com/msedgedev/2022/12/06/sleeping-tabs-edge-105-sleep-before-discarding/), 2022; [current SleepingTabsEnabled policy](https://learn.microsoft.com/en-us/deployedge/microsoft-edge-browser-policies/sleepingtabsenabled), Windows/macOS policy. |
| S5 | [MDN requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame). |
| S6 | [Chrome Page Lifecycle](https://developer.chrome.com/docs/web-platform/page-lifecycle-api), hook support, task suspension and release advice. |
| S7 | [WebKit Page Cache basics](https://webkit.org/blog/427/webkit-page-cache-i-the-basics/), 2009; mechanism, not a current blocker list. |
| S8 | [MDN visibilitychange](https://developer.mozilla.org/en-US/docs/Web/API/Document/visibilitychange_event). |
| S9 | [MDN pagehide](https://developer.mozilla.org/en-US/docs/Web/API/Window/pagehide_event). |
| S10 | [web.dev bfcache](https://web.dev/articles/bfcache), live text includes Chrome 149 WebSocket change. |
| S11 | [MDN beforeunload](https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeunload_event). |
| S12 | [MDN storage quotas/eviction](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria). |
| S13 | [WebKit storage policy](https://webkit.org/blog/14403/updates-to-storage-policy/), Aug 10, 2023; Safari 17 onward. |
| S14 | [MDN StorageManager.persist](https://developer.mozilla.org/en-US/docs/Web/API/StorageManager/persist). |
| S15 | [WebKit full third-party blocking and seven-day cap](https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/), Mar 24, 2020; use-day condition. |
| S16 | [WebKit Tracking Prevention policy](https://webkit.org/tracking-prevention/), current policy and Home Screen first-party exemption. |
| S17 | [Web Locks Editor's Draft](https://w3c.github.io/web-locks/), Sep 24, 2025 draft; scope/ownership/termination, not a shipped cross-browser cache promise. |
| S18 | [Web Locks bfcache issue 81](https://github.com/w3c/web-locks/issues/81), Chrome implementer comments Mar 9/12, 2026; 146 shipment and contention/query eviction. |
| S19 | MDN BCD fetched directly: [CompressionStream](https://github.com/mdn/browser-compat-data/blob/main/api/CompressionStream.json), [LockManager](https://github.com/mdn/browser-compat-data/blob/main/api/LockManager.json), [StorageManager](https://github.com/mdn/browser-compat-data/blob/main/api/StorageManager.json). Edge uses mirror entries; Chromium Edge support, not an old EdgeHTML claim. |
| S20 | [WebKit Safari 15.4](https://webkit.org/blog/12445/new-webkit-features-in-safari-15-4/), Mar 14, 2022; Web Locks. |
| S21 | [MDN CompressionStream](https://developer.mozilla.org/en-US/docs/Web/API/CompressionStream). |
| S22 | [WebKit Safari 16.4](https://webkit.org/blog/13966/webkit-features-in-safari-16-4/), Mar 27, 2023; Compression Streams. |
| S23 | [MDN WorkerGlobalScope.setTimeout](https://developer.mozilla.org/en-US/docs/Web/API/WorkerGlobalScope/setTimeout), API without cross-engine hidden cadence guarantee. |
| S24 | [WebKit dedicated-worker Page Cache suspension](https://bugs.webkit.org/show_bug.cgi?id=203186), 2019 implementation issue; [later suspension bug](https://bugs.webkit.org/show_bug.cgi?id=233980), not proof of current failure. |
| S25 | [Firefox TimerFirings logging](https://firefox-source-docs.mozilla.org/performance/timerfirings_logging.html); [Firefox Storage Inspector](https://firefox-source-docs.mozilla.org/devtools-user/storage_inspector/index.html), synthetic-origin verification routes. |
| S26 | [MDN Math](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math). |
| S27 | [ECMAScript Math contract](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-math-object), current living specification; implementation approximations versus defined integer rounding. |
| S28 | [MDN Intl](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl), default locale and negotiation. |
| S29 | [MDN Number.toLocaleString](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toLocaleString), allowed output differences. |
| S30 | [MDN String.localeCompare](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare), sign guarantee and locale sensitivity. |
| S31 | [WebKit bug 209563](https://bugs.webkit.org/show_bug.cgi?id=209563), open when checked; maintainer comment 14, Nov 4, 2023 confirms Dock exemption. User retention reports are contrary evidence, not this lane's measurements. |
| S32 | [Chrome unload deprecation](https://developer.chrome.com/docs/web-platform/deprecating-unload), updated July 14, 2026; rollout/opt-outs. |
| S33 | [MDN bfcache non-restoration reasons](https://developer.mozilla.org/en-US/docs/Web/API/Performance_API/Monitoring_bfcache_blocking_reasons), `lock` reason and browser-specific differences. |
| S34 | [WebKit persist/ITP proposed fix PR 48369](https://github.com/WebKit/WebKit/pull/48369), closed unmerged July 2025; fetched [GitHub API metadata](https://api.github.com/repos/WebKit/WebKit/pulls/48369) says `merged:false`, `merged_at:null`. No fix shipment inferred. |
