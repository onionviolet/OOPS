# Headless `checkVisibility()` compatibility, 2026-10-21

## Diagnosis

Input revision: OOPS `origin/master` `e84856e7da5d32ae11542b3180f751a8cadcab05`, isolated clone. Before the change, `node --test tests/crafting_native_reload.test.js` failed during boot with `TypeError: n2.checkVisibility is not a function` from the shell's `fitSecondary()` consumer. The headless DOM supplied zero-geometry methods and a separate visibility helper, but did not expose `Element.checkVisibility()` or connect that method to the helper.

Game callers use the no-argument form. CSSOM View defines it as a box-tree check: `display:none`, `display:contents` on the element itself, a detached element and other absent-box cases return false, while `visibility:hidden` does not return false unless the visibility option is requested. Children of a `display:contents` element retain their own boxes. The harness's existing `hiddenReason()` intentionally treats CSS visibility as hidden for user-facing clickability, so the two checks remain separate. [CSSOM View checkVisibility algorithm](https://drafts.csswg.org/cssom-view-1/#dom-element-checkvisibility).

## Change

- `scripts/headless/dom.mjs` adds `Element.checkVisibility()` and delegates to the headless runner's live visibility owner; standalone DOM use has a small connected/inline-style fallback.
- `scripts/headless/css.mjs` separates box suppression from CSS visibility and recomputes selector/style state on each `checkVisibility()` call so class and ancestor changes take effect immediately. It supports `visibilityProperty` and the harness's `checkVisibilityCSS` alias as opt-in visibility checks.
- `scripts/headless/runner.mjs` connects the DOM method to the existing stylesheet cascade.
- `tests/headless/runner.test.js` covers connected and detached elements, hidden ancestors, dynamic class changes, `display:contents` elements and descendants, default handling of `visibility:hidden`, and opt-in behavior.
- `scripts/headless/README.md` records the modeled subset and zero-geometry limits.

## Verification

On the isolated candidate, the focused check `node --test --test-name-pattern='checkVisibility follows box state dynamically' tests/headless/runner.test.js` passes (1/1). The original unchanged `node --test tests/crafting_native_reload.test.js` passes (1/1), including its native Save/reload journey. A small local Chrome fixture confirms connected true, ancestor `display:none` false, `display:contents` parent false and child true, detached false, `visibility:hidden` default true and opt-in false, and dynamic ancestor hiding false. This is API parity evidence, not a game visual review.

Build passes; `npm run check:arch` passes; `npm run check:rules` passes (21 register rows, 38 AD codes, 88 relative links, 0 warnings).

The default-concurrency suite command `node scripts/test_queue.mjs suite -- npm test` produced 2,222 pass, 1 fail, 3 todo (2,226 total). The lone failure was `tests/alloy_equipment.test.js`'s `equipped native brace with an open road offer` fixture command, which exceeded its existing 60-second timeout (~90.9 seconds). The same default suite on pristine `e84856e7` produced the same one failure (2,222 pass, 1 fail, 3 todo; ~53.8 seconds reported overall). That test passes alone on both pristine master and candidate (1/1 each). The complete candidate suite with bounded concurrency, `node scripts/test_queue.mjs suite -- node --test --test-concurrency=2 tests/*.test.js`, passes: 2,223 pass, 0 fail, 3 todo (2,226 total; ~93.4 seconds). No timeout was changed.

The harness still does not model layout/geometry, opacity, or content-visibility evaluation, and this fix makes no general browser-fidelity claim. It changes no game UI, persistence, migration, or gameplay systems.
