# Codex sessions (2026-10-14, setsid detached)

| Lane | Kind | Worktree / branch | Session id |
| --- | --- | --- | --- |
| air-workshop | impl | absorb/air-systems-cheats-completion | 01a138aa-4f49-7401-a344-9d0edf742a5c |
| upstream-dev | impl | absorb-all/upstream-dev | 01a138aa-4f7c-7000-980e-bd25804b5704 |
| fork-resurvey | impl | absorb-all/fork-resurvey | 01a138aa-4f8b-7b63-b94e-36b2e7b831aa |
| fork-fort | impl | absorb-all/fork-fort | 01a138aa-4fdb-72e0-848c-896dc32b5407 |
| p23-reveal-chain | impl | absorb-all/p23-reveal-chain | 01a138aa-4ff8-77d3-925e-73afae3d4262 |
| p23-life-loops | impl | absorb-all/p23-life-loops | 01a138aa-5056-7680-b463-b9dc0a372500 |
| p23-ui-polish | impl | absorb-all/p23-ui-polish | 01a138aa-512f-70c2-a7ae-113ab5fe28d8 |
| p23-reaudit | audit, docs only | main checkout (own report only) | 01a138aa-50af-7d00-89ea-4b8aded74175 |
| air-reaudit | audit, docs only | main checkout (own report only) | 01a138aa-50ac-7ee2-b74f-d9e5329def53 |

Resume: `LANE_CWD=<worktree> python3 runs/launch.py <lane> runs/<lane>.prompt.md <session id>`.

Wave 2 (after p23-reaudit, air-reaudit, fork-resurvey report): launch the unpark/restore packets they write. Integration: authorized by Weibao ("merge when they're done"); see COMMON.md "Merge authorization". Coordinator merges passing lanes via absorb-all/integration.

## Wave 2 (launched 2026-10-14, base 0216ccde)

| Lane | Session id |
| --- | --- |
| p23-long-life | 01a138b8-6953-7600-9c74-104657c64e4d |
| p23-exposure | 01a138b8-70b1-7c11-b142-9eb2c45a582e |
| p23-household | 01a138b8-78a9-7080-ab52-afce78c12bec |
| p23-living-gear | 01a138b8-8a3c-7aa3-867f-80a46dba1d7e |
| p23-reread | 01a138b8-9f01-7252-9d17-87659e874eb9 |
| p23-combat-options | 01a138b8-b35a-7752-89b8-1e89de50e5c6 |
| p23-field-familiarity | 01a138b8-c632-71b3-ba84-38884fae6a43 |
| p23-salvage | 01a138b8-d40e-7901-a54a-eac3818cd8f9 |
| p23-market-life | 01a138b8-df2b-7c43-be08-6cf8feca1924 |
| p23-leisure-memory | 01a138b8-ea30-7531-a7bb-fa681823c4b1 |
| p23-known-detail | 01a138b8-f452-70f3-b663-27e9c29575ed |
| p23-world-adaptation | 01a138b8-fb99-7fd2-9d02-ceeb1e4198df |
| p23-repeat-search | 01a138b9-01b9-7761-b451-f9b959076765 |
| p23-save-time-options | 01a138b9-0846-71d0-bfa7-067a1e593409 |
| p23-encounter-profiles | 01a138b9-0e65-7e22-81b1-a65db2b7a4b8 |
| p23-growth-profile | 01a138b9-1945-7593-bf09-e046b6b8ae82 |
| air-wider | 01a138b9-212c-79e0-ad57-be753751dfad |

Pending: p23-host-joins (P00) launches on absorb-all/integration after wave 1 merges; it joins wave-2 modules natively.

## Integration pass 1 (2026-10-14)

Merged via `absorb-all/integration`: air-workshop, upstream-dev, fork-resurvey, fork-fort, p23-ui-polish, p23-reveal-chain, p23-life-loops. Record: [INTEGRATION.md](../INTEGRATION.md). Wave-2 p23 lanes wait for P00 (`p23-host-joins`), which launches on the merged tip.
