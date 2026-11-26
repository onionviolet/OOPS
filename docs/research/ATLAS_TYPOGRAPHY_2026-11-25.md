# Atlas typography refinement

Status: implemented and checked on desktop, including keyboard navigation in the built-in browser.

| Preflight | Scope |
|---|---|
| Reading | Improve menus/Find, prose/status/evidence and dense records at 1366×768 and 1920×1080; also check 125% equivalent desktop scaling. |
| Authority | Coordinator assignment: “Improve readability … Preserve visual identity, user game font options and any intentional diagram/bitmap typography.” DSG1, DSG2, DSG16; UR6, UR65–UR68; AD36 desktop evidence. |
| Player sentence | n/a: no content or control labels changed. |
| Ordinary route | Normal Atlas → Lord of the Mysteries Reading; Find `magic`; actual Klein record selected from the admitted Find API. |
| Mechanism / fit | One stylesheet loaded last, scoped to the standalone Atlas `body:has(> main#main)`. Existing custom font/size variables take precedence. Existing diagram/brand faces remain. No remote font dependency. |
| Ring | Atlas presentation and keyboard navigation through existing records. |
| Files | This lane owns `atlas-type.css`, `prove-atlas-type.mjs`, this receipt and evidence. Atlas_passes owns the exact static allowlist and final stylesheet link. |
| Failure scenario | New sheet absent; font changes leak into diagrams/native game; small text remains illegible; larger type creates overflow; Find/record content changes between comparison states. |
| Checks | Normal headless desktop screenshots and computed styles; identical populated text except diagram fit scale; diagram font equality; zero page overflow/errors; custom font/size variables. |
| Deferred | Mobile optimization, search behavior, diagram density and native game typography. |

## Evidence

The [proof driver](../../prototypes/world-atlas/prove-atlas-type.mjs) uses the
normal Atlas server and actual adopted data. Baseline renders use the existing
cascade, with the newly linked sheet disabled. The baseline and revised views
share exact routes, populated content and disclosure state. The content comparison
excludes the diagram's fit percentage, which is a layout-derived value.

125% equivalent screenshots use a CSS viewport divided by 1.25 and device pixel
ratio 1.25. They test equivalent physical desktop readability/reflow; they are not
a claim that Chrome's native zoom control was operated.

| Check | Result |
|---|---|
| Before 1366/1920 | Captured; menus/body 14px bitmap, Find 16px system prose, metadata 13.28px; dense person body 15px/22.5px system text. |
| After 1366/1920 and 125% equivalent | Six normal captures and six equivalent-scaled captures preserved the same populated text with zero horizontal overflow. The custom Georgia 18px preference and diagram lettering passed. [Capture summary](../representations/evidence/atlas-typography-2026-11-25/summary.json) |
| Final stylesheet | 159d3964… preserves the tested typography prefix 8783093a… . The built-in browser rendered the green underlined link and amber keyboard outline. Tab selected the link and Enter opened the Roll override record. Palette contrast on the card background is 10.16:1. |
| Cleanup | The proof browsers and servers exited. The locked temporary profile and superseded diagnostic captures are listed in the capture summary. |
