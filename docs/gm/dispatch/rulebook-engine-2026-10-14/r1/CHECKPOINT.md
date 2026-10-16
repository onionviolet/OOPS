# R1 checkpoint

Branch: `codex/rbe-r1-resolver`, clean baseline `ba46670a`.
Owner: R1 only, five new `src/check_*` files, two test files, golden fixture
and this lane's report/checkpoint. Existing runtime files remain read only.

SOURCE COMPLETE: parameterized families, shared outcome/odds semantics, pure
spend proposals, JSON receipts/replay, rule-module wrapper and author read model.
Targeted tests: 72/72 pass, including 72,000 addressed-check sweep samples.
Final `npm test`: 1828 pass, 0 fail, 3 existing TODO, 1831 total.
Final verification includes the fixed draw envelope for conditional rerolls;
unused prepared reroll dice remain in receipts with `used:false` and no cost.
No runtime, save, dist, UI, merge or push work performed.
All ten task paths are ready for the lane commit. Ownership transfers back
to the coordinator after that commit; recover it with this branch's git log.
Root review and playable D&D consumer remain later merge gates. REPORT.md
owns API, exactness limits and consumer integration. No lane writes pending.
