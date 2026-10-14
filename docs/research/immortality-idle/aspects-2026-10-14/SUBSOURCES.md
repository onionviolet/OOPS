# Immortality Idle: version sub-sources

All entry points inspected statically, no bundle execution. Main source audit remains pinned current TypeScript. This is brief source/version coverage, not an audit of each old ruleset.

| Sub-source | Evidence | Boundary |
|---|---|---|
| current deployed | entry point read; runtime.cccd3b4b05a729d7.js, polyfills.f395b31f2305e083.js, main.541d4f3c93bbe955.js | mechanics unread; source variant only |
| classic | entry point read; runtime.18276b31f7984a46.js, polyfills.e4b599580948a22f.js, main.c2bc78a1dbdfafb0.js | mechanics unread; source variant only |
| old | entry point read; runtime.cccd3b4b05a729d7.js, polyfills.f395b31f2305e083.js, main.b16ecbbfa46bef2e.js | mechanics unread; source variant only |
| v1 | entry point read; runtime.cccd3b4b05a729d7.js, polyfills.f395b31f2305e083.js, main.541d4f3c93bbe955.js | mechanics unread; source variant only |
| experimental | entry point read; runtime.cccd3b4b05a729d7.js, polyfills.f395b31f2305e083.js, main.9eaec3c7a96ddc6b.js | mechanics unread; source variant only |
| experimental2 | directory exists; no index.html; no script entry point | unread payload |

Names, sizes and hashes retained in private immortality-deployed-subsources.json. The experimental2 directory has no index.html; an initial unconditional entry-point read failed, then the inventory was corrected to preserve absent-entry status. These variants cannot be merged into current behavior.
