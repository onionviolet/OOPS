# Proto23 optional widgets and component preview, 2026-10-21

Current status, reconciled2026-10-21: the [combined baseline browser gate](../gm/BASELINE_CONSOLIDATION_2026-10-21.md#final-completion-evidence)
records actual Find, component preview isolation and explicit overrides across
six desktop/text cases. The source-lane handoff below is historical; its root
browser gate is closed. Human visual acceptance remains separate.

Scope: CRL31 optional-widget failure containment and the actual preview coverage
behind CRL29/39. Target remains 1920×1080 with 14px and 21px text; mobile is
deferred. This records source coverage and a browser handoff, not human acceptance.

## CRL31

The actual Find route mounts `mountUiExtras` from `workspace_navigation.js`, then
opens the command palette through its real Find button. Palette sources are
optional projections. The original collector contained a source reader that
throws, but it accepted malformed returned rows; a null label then failed during
search ranking and could interrupt the palette render path. The collector now
checks each row's label, group, optional detail and run callback inside a
per-entry boundary. A regression exercises both Find and Ctrl+K, searches beside
a malformed null-label row, and confirms a healthy sibling renders while native
Inventory navigation stays connected. Run callbacks still invoke their native
controls; no gameplay or persistence error boundary was added.

## CRL29/39

The existing shared customization editor already has one component-theme preview
in `customization_ui.js`; no second editor is needed. It contains a selected tab,
ordinary and disabled buttons, readonly input, table, warning, error and live
contrast notice. `renderPreview` passes `previewModule` to
`applyCustomizationProfile`, which adds `.customization-module`, qualifies native
tabs and assigns draft theme tokens. The preview therefore receives the
production selected, focus, heading and surface rules in
`styles/component_themes.css`. It is a real component-style preview, not a
detached chip. The desktop matrix still needs to compare it with a neighboring
native surface and inspect draft transitions; root owns that browser pass.

Browser handoff for the rebuilt fresh-origin pass:

- Open the existing Customization center panel and locate `#customization_preview_host .theme-preview`.
- At 1920×1080, inspect the preview and a neighboring real `.customization-module` with the same draft theme; compare `button[aria-pressed="true"]`, `:focus-visible`, `table`, `[data-theme-state="warning"]`, and `[data-theme-state="error"]` at 14px and 21px.
- Change component theme and palette, then reset the draft. Confirm preview-only states change immediately, neighboring production controls retain the active theme, and no profile is saved before Apply.

The component preview path is present in source. Whether it renders and responds
as intended at the target viewport remains unverified until the rebuilt browser
pass; source inspection is not runtime proof.
