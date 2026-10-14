# trimps-antimatter: three deeper systems

Ranked by payoff for this aspect backfill, especially earlier text/save/authoring gaps. These are targeted traces. Full semantic completeness and future YAIR selection are separate.

## D1 Celestial speech persistence

Prior status: Previously undocumented text family.

Trace: authored requirement -> BitUpgradeState unlock -> quoteBits -> queue presentation -> line speaker/background -> history.

Evidence: https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/5409e320cecef96a917cca1dfb68f1f183e499ca/src/core/celestials/quotes.js; https://github.com/IvarK/AntimatterDimensionsSourceCode/tree/5409e320cecef96a917cca1dfb68f1f183e499ca/src/core/secret-formula/celestials/quotes

Limit: Saved unlock bits are distinct from the UI queue. All callsites/line counts and skip/replay persistence remain partial; speech text stays private.

PROPOSAL: route this pattern through the existing owners named in ASPECTS; no new parallel scheduler/save store and no automatic source adaptation.

## D2 Automator lexer/parser boundary

Prior status: Explicit earlier grammar gap narrowed.

Trace: token categories/identifier alternatives -> structural rules -> compiler -> runtime commands.

Evidence: https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/5409e320cecef96a917cca1dfb68f1f183e499ca/src/core/automator/lexer.js; https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/5409e320cecef96a917cca1dfb68f1f183e499ca/src/core/automator/parser.js; https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/5409e320cecef96a917cca1dfb68f1f183e499ca/src/core/automator/compiler.js

Limit: Autocomplete metadata is attached to tokens. Parser has explicit resynchronization choices. Complete command grammar, diagnostics and editor parity remain unread.

PROPOSAL: route this pattern through the existing owners named in ASPECTS; no new parallel scheduler/save store and no automatic source adaptation.

## D3 Save fallback and compatibility staging

Prior status: Earlier save gap extended.

Trace: AD deserialize -> validation/patch -> slot/backups/offline; Trimps decode -> version/beta refusal -> reset -> restore/repair.

Evidence: https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/5409e320cecef96a917cca1dfb68f1f183e499ca/src/core/storage/serializer.js; https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/5409e320cecef96a917cca1dfb68f1f183e499ca/src/core/storage/storage.js; https://github.com/Trimps/Trimps.github.io/blob/b9edb1dfee270ebf81bef8d934dc71276bf8d963/main.js

Limit: Save shape, content version and retained backup are different guarantees. No corrupted save was imported or fixture run.

PROPOSAL: route this pattern through the existing owners named in ASPECTS; no new parallel scheduler/save store and no automatic source adaptation.

