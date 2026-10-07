# Four-game absorption checkpoint

2026-10-07, revision1. Root `01a116c6-9556-74c1-a50d-e689d91785a0`, matching active unbudgeted host goal. [Assignment](ASSIGNMENT.md) owns scope.

Verified live: Factorio parent `01a1146c` is active repairing native recovery, with no active shared runtime/build lease. Latest audit GM `01a114d2` is inactive and its finite source/build release exists. Current baseline bundle `e77080593d4b`; its existing immutable preview18197 remains independent.

Internal selectors `/root/source_mechanics_a` (DF/BOH) and `/root/source_mechanics_b` (ONI/Lamb) are read-only. No gameplay source edits or builder dispatch yet. Root retains shared integration ownership; all existing dirty inputs are preserved.

Next: review exact source-backed distinct mechanic selections, freeze builder interfaces/scopes, implement four original behaviors and integrate native/UI/reader consumers. Only source/syntax/import/definition/link/build checks are permitted. Gameplay/save/browser acceptance stays deferred and unrun.
