# Save shape and optional-content limits

## H-S1: What is actually established

SHOWN in a pinned third-party parser authored by its maintainer, not Paradox engine source: [rakaly/hoi4save](https://github.com/rakaly/hoi4save/tree/a3f1e65ec2da113652152a00aa32631182bbc03f), `src/file.rs:18` distinguishes `HOI4txt` and `HOI4bin` headers and routes them to different parsers. Its text path uses Clausewitz text parsing. `src/models.rs:10` models player/date/countries; country fields include stability, war support and variables. This is a deliberately small subset, not the full serialization schema. `tests/parse.rs:17` uses older 1.10 fixtures. It was read, not built or run. No user's saves were read.

STATED, shipped `documentation/console_commands_documentation.md:1490`: a save/load/save comparison command expects the two outputs to match. This suggests a useful round-trip check, not proof that it passes on the installed build. No console command was run.

INFERRED: a text save serializes mutable instance state and references to authored content; definitions in common/ and history/ are not themselves a complete save. Exact current field names for pending events, focus state, production progress, design instances, DLC/mod metadata and caches remain unverified.

## H-S2: Optional content at start is shown; removal at restore is not

SHOWN, `history/countries/GER - Germany.txt:103` to 154 branches initial technology and naval OOB on No Step Back and Man the Guns. Later branches select legacy versus newer air/order-of-battle variants. `common/scripted_triggers/00_scripted_triggers.txt:1280` abstracts alternate tank capabilities. The rules can choose coherent starting behavior for different content combinations.

SHOWN DLC descriptors set `affects_checksum = yes` and `affects_compatability = no` (the literal shipped spelling) in `integrated_dlc/dlc023_man_the_guns/dlc023.dlc:1` and `dlc/dlc034_no_step_back/dlc034.dlc:1`. That metadata is not a demonstrated guarantee that an existing save can lose those packages. No mod-removal behavior was established.

INFERRED: optional-at-creation differs from optional-after-use. A save referencing a removed focus, module, designer or actor may need a compatibility gate even if an unused DLC had an alternate starting path. This pass cannot honestly answer that HoI4 gracefully drops all missing DLC/mod content.

## H-S3: YAIRPG compatibility proposal

PROPOSAL: use optional revisioned domains with explicit content manifest/definition references and migrations or a recorded compatibility decision. Missing unused domains preserve old behavior. An active missing definition must produce a named unsupported state or migration, not silent loss or replacement rewards. Preserve committed choices, actor/world scopes, clock, condition expiry, reserved inputs and seeded-stream position together. Existing AB8/AB9 owners govern this; no new serializer is proposed.

Not-run acceptance cases: old save without new domain; new save with unused optional pack removed; active content absent; partial chain pending a response; active timed condition; workshop mid-switch; unknown optional field; unsupported required revision. Literal import into a second fresh test origin must preserve the selected compatible state. Current full HoI4 save schema and missing-content restore remain PARTIAL gaps.
