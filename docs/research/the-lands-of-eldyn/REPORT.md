# The Lands of Eldyn: installed wrapper audit

Build 7520224 is an Electron shell that loads `https://eldyn.io` in an iframe. The retained app-owned source exposes navigation, menus and a Steam cookie bridge. It contains no recovered territory, army, progression, NPC-life or server simulation logic. **The wrapper source pass is complete; actual gameplay mechanics remain blocked.** No game was launched or remote authenticated state fetched.

F1 remote delivery, F2 distinct close/home/logout/quit handlers, F3 faction-link entry, F4 session cookies and F5 fullscreen/menu styling are source-backed observations in [FINDINGS.json](FINDINGS.json). Their exact private-file line anchors stay in that file; raw game source remains private. An empty renderer module and source maps without embedded source add no gameplay coverage.

Five ranked original proposals concern native YAIR interface clarity: P1 clear close/return destinations, P2 visible unavailable/busy reasons, P3 optional invitation preview using internal IDs, P4 local save/resume status, and P5 keyboard/narrow-screen controls. These are proposals we derived from the shell's affordances and omissions, not Eldyn gameplay features or accepted decisions. The twenty-two small touches, bounded packets and browser acceptance gates are in [IMPLEMENTATION_PACKETS.md](IMPLEMENTATION_PACKETS.md). Preserve the vanilla opening, quests, skills, professions and center menu. No network, Steam login or faction layer is proposed from this evidence.

The retention gate passed: all three private raw inputs match the coordinator's original hashes and current installed files; eleven selected runtime/source entries match ASAR bytes. Receipt: `~/.codex/research/the-lands-of-eldyn/AUDIT_VERIFICATION.json`. The 3,901,611-byte raw recovery set supports later wrapper reinspection after uninstall. Release automation and SDK packaging are excluded from the selected source inventory; the raw container is private. No YAIR source, build, saves or commits changed. Coordinator owns the uninstall request and north-star update.

Parent follow-up: verified retained raw inputs again and requested `steam://uninstall/1740540` with shell exit 0. Dialog confirmation and removal remain unobserved; see [uninstall receipt](../../gm/dispatch/steam-installs-2026-10-09/ELDYN_UNINSTALL.json). No Steam dialog clicked. Parent now owns this dossier after reader handback.

Remote-source check: web open could not access `https://eldyn.io`; switching to a public header-only curl request returned exit 6, “Could not resolve host: eldyn.io”. No game or authenticated session was opened, and no further retries occurred. This bounds remote recovery; it does not establish permanent shutdown. [Reachability receipt](../../gm/dispatch/steam-installs-2026-10-09/ELDYN_REMOTE_GATE.json).

## Final Steam receipt, 2026-10-09

Source scope: installed Electron wrapper; remotely delivered gameplay unavailable. Parent verified retained-copy gates and requested uninstall through Steam. Final observed removal state: **not-verified; request sent, dialog confirmation unobserved**. [Per-app receipt](../../gm/dispatch/steam-installs-2026-10-09/ELDYN_UNINSTALL.json). No dialog clicked or game launched. Parent owns the dossier after reader handback. Earlier acquisition-only queue text is superseded by this pass.
