# D1 package manifest

Receipt: [D1_INPUT_RECEIPT](../D1_INPUT_RECEIPT.md) sha256 `b6965629e7703e971bc0d4f1639c100283cd3e38c9f196bfe1398738b835c50b`. Base HEAD 547209e82.

Apply to a clean HEAD: `git apply patches/ALL_TRACKED.patch` (seven tracked files, per-path patches alongside), then copy `files/*` to the same repo paths (six new files). If a target already holds the same content (sha256 in the table), skip it; if it differs, merge the hunk, never overwrite.

```
path | state | sha256 | lines
src/components/levelable_component.js |  M | a813ed42b198f435a197eeb8646b798d2d71aa6f2ab54a6dfa8329992e373702 |      357
src/display.js |  M | b8c3dbf0cf97ba93da963cd655eea8df82ffd64ba9f45a1512d24dab17b145fe |     6717
src/reveal_chain.js |  M | 467b840551d0a0b191b25a2dbb584ad9fe8c93722777bcd0184bdfcd76b958fa |      145
src/chain_inspector.js |  M | edbda4a5a177d959b44e88909c545a9da47ab70c460afd55bd3c1247a39345b6 |      106
src/chain_inspector_ui.js |  M | c0f94b730e18ac1e1443117a6c21f4aada63caf9337d8ea1e88137c78f65406c |       66
tests/micro_p1_xp.test.js |  M | d39935b55885b5ffd805fb8c88ae96660ad5f074c474702f8d7386367bf7c027 |       64
tests/chain_inspector.test.js |  M | 86bf219c0ee7d3954dd06116420b922e5b716138d22bbaa68b557cecf89978c1 |       58
src/progression_gates.js | ?? | 3e7cf4951422a89006120887da6f68723ba9fcb7a99b91913a406605de2157d4 |       71
src/skill_overflow_domain.js | ?? | c4157ab7d7b49f8c79446d7494dcf2e34966bc61004777529af05f0b2b4d4072 |       62
tests/progression_gates.test.js | ?? | 7ba437e03dd2a60c3cbf1be2b34fa385092fa6e083e6a5974102d2d753e3a6cc |       54
tests/skill_overflow.test.js | ?? | c6ed52a36c88647c1ea810bde8a2ccbd679c36557f1c2efb7aa5be85df55cb2c |       50
docs/PROGRESSION_GATE_RULES.md | ?? | b745b94b13bd4372292dbf5b6c3873a1995ed0a7eb038a3bdbf2e21eb93d46b4 |      196
docs/PROGRESSION_GATE_OVERFLOW_2026-10-23.md | ?? | 0f4e2ca367b69b777daa33093aacc26b6a6b9ebea64fdd1acae85b3f18c44dc3 |      147
```

ALL_TRACKED.patch sha256 e0663ccfa9420d1878e252e8cb9c913147f3d8111cfb18dc7fe57178597f84ce
