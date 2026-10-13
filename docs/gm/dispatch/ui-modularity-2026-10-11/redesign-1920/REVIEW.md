# Independent UI redesign review

Reviewer: `/root/review`. Updated 2026-10-12. Scope: bounded U2–U5 source review and independent fresh-context browser qualification after the implementation owner releases a stable build. Only this file is reviewer-owned. No runtime/source edits, builds, broad suites, personal saves or shared integration changes.

Candidate: `/Users/weiwei/.codex/candidates/yairpg-ui-modularity-2026-10-11`. Comparison: frozen `/Users/weiwei/.codex/candidates/yairpg-ui-baseline-1920-2026-10-11`. Independent slice tested rebuilt bundle `ff1d436750420776460f6ad2a9a37f63544a187ef7170c4f202fec260c9fc448`; layout source `cd1f84ec07c17306e30ed13aa909468e37a535c88b14bef2b5db52e92630af62`; state `22e824b8e6695d9749485223ff5a35ad8ae3d14273ad347eaf6baa4c5a12260c`; CSS `343a88bfa8bedd24412aaf1c29a25705405244a9584aca6e0300b9546aea1d56`. Source inspection alone does not qualify human design acceptance.

## Findings under qualification

| Code | Severity | Reproducible trigger / consequence | Status |
|---|---|---|---|
| F1 | P2 | Drag either column divider. Initially both buttons lacked positioning at the actual column boundaries, making the advertised divider interaction hard to find/use. | Repaired and independently exercised: dividers at x515.59 and x1335.98; first divider drag changed fractions to .31937/.38063/.30. |
| F2 | P2 | Start header drag with keyboard focus outside the workspace, then press Escape before release. The original root-only Escape listener cannot receive this key, so releasing commits instead of cancelling. | Repaired and independently exercised: visible preview followed by Escape leaves Skills in right dock; the same drag without Escape moves it to center. |
| F3 | P2 | Place two overlapping floating modules; click or use Panels to bring one forward. CSS gives untouched floats z-index 200, while the first bring-forward action writes 21, so the chosen panel can remain behind the other. | Repaired and independently exercised: picker-selected float 201 exceeds untouched float 200. |
| F4 | P2 | Restore a desktop layout with floats at widths 768–1000. CSS stacks the docks at 1000, while the JS layout/storage/float breakpoint remains 760. Floating panels and width resize semantics therefore persist over the stacked view. | Repaired and independently exercised: 768 viewport has zero live floats and no horizontal overflow; returning to 1920 restores saved desktop float. |
| F5 | P2 | Import a desktop layout with Skills and Records floating at x700/y200, width500/height300. Apply `document.documentElement.style.zoom='2'`. Previously rendered floats had x1400/right2400/bottom1074.78 in 1920×1080, while footer starts y992. Saved floating position used CSS pixels while bounds used scaled viewport geometry. | Repaired and independently rechecked after rebuild: both floats x904/right1904/top301.21875/bottom976, within1920×1080 and16px above footer y992. The CSS 200% geometry gate passes; native browser zoom remains untested by this reviewer. |

The initial restore-button eligibility race is corrected in current source: construction now sets the disabled state immediately. Generic unavailable panel titles do not reveal definitions or sealed truths; actor detail rendering remains gated by the existing known-person projection. The review has not observed a new gameplay command, reward owner or gameplay clock in the workspace delta. Existing presentation refresh timers do not establish whole-world gameplay correctness.

## Current candidate identity and limits

Private manifest schema 1 currently lists seven optional assets. Six are structured schema 2; one is legacy schema 1. Metadata was inspected as ID/schema/hash only. This is the retained UI candidate's private input set, not proof of the shared World1 successor's completed edition, all private routes, or integration. No source prose or sealed definitions appear here.

The workspace reuses live native nodes rather than cloning views. Layout import/export normalizes to registered presentation IDs and geometry, dropping unknown IDs and arbitrary fields. The visible current-work projection filters pending/jobs and discovered waiting decisions to the player. The notebook retains its existing waiting-response route; fresh-browser hidden/collapsed recovery remains to be checked.

## Independent browser evidence and visual judgment

Two ephemeral headless Chrome contexts used a generated fresh opening at 1920×1080 on preview 18571, never personal storage. Real pointer events exercised title-header drag, preview, cancellation, dock drop, divider drag, float relocation and corner resize. Keyboard Escape cancelled an active gesture. Pin disabled the movement handle; unpin restored it. Panels expanded a collapsed floating module. A retained Skills DOM reference survived movement, and native `skill_sort_by_name` focus survived refresh. Reload restored the float at x1432/y798.625, width480/height229.375, above the footer. Viewport transition to768 and back preserved independent responsive layouts. No page errors were observed in the movement context.

Layout export contained only `id,dock,order,width,height,collapsed,pinned,hidden,x,y` module keys. Import dropped an unknown presentation ID and title. Malformed JSON reported preservation of the current layout. These are presentation configuration checks, not gameplay save tests.

Independent measured opening: left dock width507.59, center808.41, right564, with a1920 document width and no horizontal overflow. Vitals, preparation and belongings are visible alongside location, current work and local actions; journal, skills and reports are simultaneously accessible. This meets the complaint more convincingly than a static Classic opening or narrow equal boxes. The opening and busy images show less stranded space and useful body/inventory/work context side by side. Residual blank inventory/skill space at the fresh opening is moderate and becomes useful in the busy view. Five repeated module-header controls remain a visible tradeoff, but Options and secondary modules are calm disclosures, and the toolbar explicitly teaches dragging and resizing. This is review judgment about the reversible proposal, not Weibao's acceptance.

Images inspected: `evidence/after-opening.png` and `evidence/after-busy.png`; reviewer did not create or expose private-world screenshots.

## Release boundary

F5 recheck and one normal title-header pointer dock journey passed on final tested bundle `09061d6d7a2aa49603a56146d3f0255275c3233969350dbc1271b8d9b3f9760b`; layout source `639927d5bd67da4c60e78539c2dbd674ef55bca6d9db6f78230be14077e05feb`; CSS `e53477558f8fcce9da4fdca170609de125198155cbe036f67a078f8285b39bdb`; state hash unchanged. These targeted rechecks do not imply the entire first slice was repeated on this final bundle. No remaining defect was found in this bounded review.

## Final narrow-order focused recheck

Root reacquired this file for a narrow-only review after discovering and correcting character-first stacking. Final tested bundle `944f2e700b50f2ddd765a1b799743cd73520eaf93475b619c9cd5663eed5ffbb`; layout `b7a0bface54fa6b2e810230a4fd839e16dd8f037712aac059fd7d7707b355d56`; CSS `e867eda204c907bbe11a204d83fc7ccf6e76f36efdb5f8a74c328ab61d9ec639`; state hash remains `22e824b8e6695d9749485223ff5a35ad8ae3d14273ad347eaf6baa4c5a12260c`.

Fresh390×1080 and768×1080 contexts put Time, Location, Current work and Local actions before Vitals, preparation and belongings. Native Talk/work actions appeared at y599.06/639.06 for390 and529.03/569.03 for768, without first scrolling through character panels. Both Inventory and Combat buttons fit390: x15.59/197, each177.41px wide. Neither width had horizontal document overflow. Independent390×844 opening confirmed `scrollY=0`, Talk y599.06 above footer y800; actual pointer click expanded Talk with `scrollY` still0.

On both390 and768, collapsing Skills wrote the narrow layout; switching to1920 showed expanded desktop Skills; returning to narrow restored collapse. Reload also restored narrow collapse. This confirms independent desktop/narrow policy and responsive recovery for the final ordering change. The first390×844 click probe used an overly exact text locator including no icon text and timed out; repeating with the actual native dropdown selector passed. This was a test locator mismatch, not a game interaction defect.

The narrow recheck is focused evidence and does not relabel previous F1–F5 checks as rerun on this last build. No new defect found in this requested slice.

Review reservation released again. Required gameplay journeys, hidden waiting decisions, read-only control ownership and generated gameplay-save roundtrips remain the implementation owner's qualification; this reviewer did not repeat them. Shared integration and Weibao's visual acceptance remain separate gates.
