# Harry N2 native playtest attachments

Agent-verified through the normal Workbench attachment form and reopened at 1920×1080. No new gameplay run, runtime/test/script edit, default rebuild or gate-input change. Scope: AD36/AD43, immutable proposal/report with separate playtest sidecars.

Proposal `5f0c07c35f376c6433a9967abc683ba9044ea752881f5a93cf23592ae7813f9c`, report `5a7c2d8333dd67df6f1ef9dac6d2d605397b454b80bf5bbb0e04b0a1be31bb25`.

| Existing run | Attached proof and exact tested bundle | Sidecar |
|---|---|---|
| Composed school-day/library route: both retrieval methods, real Astronomy/homework and Save/reload/Export/Import | [Archival proof](harry-library-native-proof.json), bundle `d803bcd7105c173bf64e4e2153c71f79c67312dd9e1bc05490ce062c7d49827f` | `b5acd1dcd32eb2e7e9dc0562cffcc66dac922de1f311d9140a49d246eef38e51` |
| Later fresh entry, actual household sequence, optional natural summer routine, train/Sorting/week and ladder/chart notes | [Original summer proof](../harry-summer-2026-11-25/proof.json), bundle `c869f0d2c060a81af5ed0c04c75f9bdbca4d0f1bff2ff0147fd1a8489f44b408` | `bb342cc938f7337a26a78854fd00ea5596253a997357899741eef89fcedb697d` |

The earlier library result JSON omitted the sidecar-required viewport and bundle fields. Its original bytes remain unchanged. The new archival JSON adds those exact historical metadata from the frozen receipt, verifies the retained bundle bytes, preserves original result/receipt hashes, and explicitly says this is metadata normalization of the prior composed run. It does not relabel that run as an earned opening-to-library route. The later summer proof is attached directly and does not claim learned Levitation or Astronomy homework was earned in that fresh route.

After reload, both sidecars were present and both Compare checkout build controls returned `different-build`, with unchanged proof bytes. The compared current bundle was `9a960b6694049fb0da8063c09e6245254469cebeaa20c96c8793a7f54f8e9fc1`. Full tested/current identities are recorded in [verification data](harry-native-playtest-attachments.json). The implementation report retained its original byte hash, equal to its report ID. The frozen library receipt remained unchanged. Zero page errors; browser/server exited 0. Both captures were inspected: [library](harry-library-playtest-reopened.png), [summer](harry-summer-playtest-reopened.png).
