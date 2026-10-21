# Tool registry implementation and improvement pass, 2026-10-21

Later authorized follow-up: [Cpp2IL repair, REA update and project-chat MCP
access](CPP2IL_REA_AND_CHAT_ACCESS.md) supersede this receipt's unavailable
Cpp2IL/source-only REA statuses and counts. This document preserves the initial
implementation and its still-useful per-tool considerations.

Scope: Weibao authorized the registry, launch wrappers, stale-doc reconciliation and a more-to-consider pass for each toolset. Applied AD32, AD35, AD36, AD37 and existing research/source contracts. This changes operational tooling and discovery, not gameplay or source-acquisition authority. Skills used: more-to-consider and current-state-hygiene. No agents dispatched.

## ACT NOW, completed

**I1 Registry:** [live usage/routing owner](../../TOOL_REGISTRY.md), [35 machine-readable entries](../../../scripts/toolsets/registry.json), [standard-library launcher](../../../scripts/toolsets.py). There are 25 launch definitions and ten reference/manual routes. Twenty-four launch definitions have present dependencies here; Cpp2IL is explicitly unavailable. Thirteen registered offline probes passed. Presence-only routes are not described as target-verified.

**I2 Launcher:** `list`, `show`, `doctor`, `doctor --probe` and `run`. Fixed roots and explicit environment defaults find the existing installations without global PATH/config changes. Caller overrides win; intended module paths prepend PYTHONPATH. Launch uses exec and argv arrays, preserving stdin/stdout/stderr, caller cwd, signals and child status. No shell evaluation, argv logging, retry, installation, version fallback or automatic registration. Collector/server/game routes have no doctor probe, so batch readiness checks cannot accidentally start them.

**I3 Discovery reconciliation:** linked the registry from PROJECT.md, USER_VISION, the rules-index register/router, research guidance, acquisition tools, deep-dive playbook and scripts guide. Added dated current-status pointers to reverse-engineering tool fit, acquisition queue and the older adoption report/tool-gap page. These retain their historical wording. Corrected Z-Library's top README from six to ten MCP tools, matching current source decorators/profile, and added launcher discovery links to both external tool READMEs. The earlier toolsets audit now points forward to the live registry and this receipt.

**I4 Tests/evidence:** eight focused launcher regressions pass, including a real subprocess from a path containing spaces, literal shell-looking arguments and exit 7 propagation. Twelve initial offline probes and the .NET version probe pass. Rules-index and architecture checks pass; rules check has two warnings for currently untracked docs, one newly created registry and one pre-existing gear document. No rule semantics changed. Probe summaries and input hashes are in [LAUNCHER_VALIDATION.json](LAUNCHER_VALIDATION.json).

**I5 Cpp2IL correction:** the retained ARM64 native executable is mode 0644. For one help probe, owner execute permission was temporarily added, with a temporary working directory. Child terminated with signal 9, produced no output and processed no target. Original mode 0644 was restored. Cause is unknown; no signature/quarantine diagnosis is claimed. The registry reports the executable unavailable. No replacement, re-sign, redownload or automatic permission change was built into the launcher.

## ACCOUNT FOR NOW

The JSON registry owns launch definitions; usage and evidence boundaries belong to the live Markdown owner. Per-tool owners retain transport, scope and source authority. Dated audits remain dated. Readiness is graded: reference, missing, present, probe-passed, probe-failed or probe-timeout. In particular, no successful help/import command proves source acquisition, native semantic recovery, browser geometry, persistence, human acceptance or complete reading.

Private raw media/text, credentials, personal saves and source bodies are not part of registry/evidence artifacts. Output directories remain caller-selected because some tools default to writing beside their input. For parallel activity, use the existing test queue and collector ownership rules; no new orchestration service or independent cache/refusal root was introduced. Default roots are machine-specific but overridable and inspectable. A registry path to a research cache does not make that cache durable or backed up.

## Per-tool improvements

Codes map to the original audit's T1–T20. ACT NOW cells describe this implementation. ACCOUNT FOR NOW cells are incorporated constraints. LATER cells are proposals; capability, effort and done checks describe an eventual bounded task, not dispatch authorization.

| Code | ACT NOW | ACCOUNT FOR NOW | LATER / DELEGATE: level, effort, done check |
|---|---|---|---|
| T1 Discord evidence | Added `discord` module wrapper and integrity/search route | Originals/derivatives, animation, locator/author and coverage are separate | Luna medium, small: validate one actual exporter fixture through import/catalog with scoped context and byte mapping. Done when source boundaries and expected gaps reconcile. |
| T2 Local collector | Added explicit `discord-web`/`discord-desktop`, no health auto-start | One collecting instance; manual sign-in; origin/scope continuity | Sol medium, medium: one authorized authenticated export/import journey. Done when exact IDs, original bytes, context/threads and pacing receipts are verified. |
| T3 Exporters/browser capture | Added reference route to existing collection comparison | Import support differs from installed exporter and live collection proof | Luna medium, small: identify actual installed exporter revision and one scoped export; do not add a third collector without a gap. |
| T4 Pinned REA | Environment wrapper and Ghidra scoped probe | Patched identity, structured coverage/limitations, temporary-project lifecycle | Sol medium, small: verify one selected multi-query chain against retained instruction evidence if a new research question needs it. |
| T5 New REA source | Marked as source-only, no silent fallback | Upgrade must preserve the old runnable route and patch provenance | Sol high, medium: isolated 6.5.0 comparison on one fixed question; done when results, state transfer and resource cost are compared. |
| T6 Native tools | Direct Ghidra route with explicit JDK | Preserve repaired projects and exact binary/address identity | Sol high, conditional medium: recover exact Factorio repaired-state locators and demonstrate equivalence before a new import replaces any evidence. |
| T7 Managed code | Explicit SDK/ILSpy wrappers and version probes | CIL/metadata, native code and executing consumers are different | Luna medium, small: selected method export fixture with caller/consumer locators and build hash; no full re-export by default. |
| T8 Unity/IL2CPP | UnityPy interpreter wrapper/probe, Dumper route, explicit Cpp2IL failure | Asset schemas and metadata versions bind recovery; stubs are not bodies | Sol high, medium: verify retained Cpp2IL release/platform/signature and repair bounded launch. Done when help and one invented/authorized fixture recover expected identities without killing the process. |
| T9 Saved sources | Registry/playbook routes require exact corpus receipts | Existing root does not establish all old paths or reading coverage | Luna medium, small per selected source: resolve manifest/hash and one referenced artifact; retain missing versus unread distinctions. |
| T10 Polite acquisition | Dedicated isolated polite wrapper/help probe | Same transport data/refusal owner and font mapping; no generic crawler substitution | Luna medium, small: add one source adapter only for a selected gap, passing every request through existing transport with source/receipt checks. |
| T11 Book MCP/intake | CLI/server/prepare wrappers, six-to-ten correction | Server launch differs from registration, auth and acquisition; EPUB preparation differs from reading | Luna medium, small: local invented-edition end-to-end MCP search/read fixture with hash/member locators; remote acquisition only when requested. |
| T12 Library/PDF/media | Calibre/PDF/OCR/FFmpeg routes and probes | Read-only discovery first; use explicit output to preserve sources | Luna medium, small: invented scanned/text PDF and animated-media fidelity fixtures. Done when expected text/frame coverage is reported; address PyMuPDF alias deprecation in its owner if selected. |
| T13 Browser/web/gh | Manual/session route instead of fake shell readiness | Session tools/authentication change; prefer background routes | Luna medium, small: selected source access proof in actual browser/connector, with source and scope receipt, no account-state export. |
| T14 Connected sources | Discover through current tool declarations | Availability, auth, permissions and send/write authority are separate | Luna medium, small: selected read-only connector smoke test only when needed by a task; do not poll unrelated private services. |
| T15 Assets/3D/docs | Routed to matching skills/current tools | Live connection, generated file, rendering and accepted result differ | Luna medium, small: one synthetic artifact roundtrip in the selected tool, visually verified if relevant. |
| T16 Mockups | Registry links current mockup owner | Preserve concurrent work; 1920x1080 current target; proposal versus acceptance | Sol medium, small: next selected mockup gets input identity plus rebuilt comparison and human decision, not an extra design system. |
| T17 Gameplay harnesses | Headless benchmark/playtest entries and coverage warning | No geometry in Node DOM; synthetic stepping differs from natural time | Sol medium, medium: parameterize headless visibility viewport and validate selected parity route, only if a real viewport-sensitive behavior justifies it. |
| T18 Replay/fuzz/perf | Named entries and queue route | Engine adapter/synthetic context boundaries and proposed performance budgets remain explicit | Sol medium, small: name relevant nested checks in each selected task receipt; any CI aggregation should avoid duplicate or unrelated heavy runs. |
| T19 Automation/coordination | Bounded executable dispatch; no background services | No inferred messaging, recurrence, publication or commit authority | Luna medium, small: add an offline registry-link/schema check to an existing tooling gate if maintenance frequency justifies it. |
| T20 Niche helpers | Source-owned reference entries | Quarry is a credentialed feed, GearScope needs calibration, Vimeo needs visible cue boundaries | Luna medium, small per selected helper: one task-specific fixture/receipt, not a new generic platform. |

## Verification scope and remaining gates

No gameplay code, bundle, personal save, source collection, global config or installed package was changed. The cached Cpp2IL mode was restored. External README edits are documentation only; their MCP and collector runtime behavior was not changed. No target binary import, authenticated export, remote acquisition, server registration, commit or push occurred.

This tooling slice uses focused Python regression/process checks and actual offline tool entry points, plus existing architecture/rules checks. A game build/full gameplay suite would not verify the launcher contract and would overwrite shared dirty bundle outputs, so those were not run for this slice. The still-open target/live gates are listed in the registry and per-tool rows, rather than being presented as completed by readiness checks.
