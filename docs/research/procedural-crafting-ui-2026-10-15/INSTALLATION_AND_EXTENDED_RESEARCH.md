# Authorized installation and extended research

2026-10-15. This follow-up supersedes the earlier pass's no-installation scope: Weibao explicitly requested installing both games if absent, then asked for broader procedural systems and specific Qud UI implementation research. Earlier source reports describe their initial static research phase; this document records the later installation. Research only still excludes YAIR implementation.

## I1: Caves of Qud

Installed at `/Users/weiwei/Applications/Caves of Qud.app` by copying the supplied previously expanded GOG app payload with ditto. No existing app was overwritten and the source package/payload was preserved. The GOG postinstall script was read; it was not executed. The copied assembly hash matches the traced 2.0.211.56 assembly. Its native executable is universal x86_64/arm64. No compatibility layer, quarantine removal or security-policy change was performed. App startup remains untested.

## I2: Cataclysm: Dark Days Ahead

Installed at `/Users/weiwei/Applications/Cataclysm.app`. The official GitHub latest stable release resolved to **0.I-1 (Ito-1)**. [Release](https://github.com/CleverRaven/Cataclysm-DDA/releases/tag/0.I-1). The graphics universal DMG was downloaded and its SHA-256 matched GitHub's published asset digest: `8c169974d93762d1bedffee75c6847eb70a1d5b05e6448c1b829e314ba8bfaf6`. The image was mounted read-only without opening a window, its app copied with ditto, and the mounted image ejected. No preexisting app was overwritten.

The bundle entrypoint is a shell launcher; the actual `Contents/Resources/cataclysm-tiles` binary is universal x86_64/arm64. Its hash and linked-library inspection are saved separately from the launcher hash. A bounded arm64 symbol inspection retained 1,822 exported-symbol lines, including twelve craft/recipe matches. These symbols confirm binary inspection, not detailed control-flow parity. Source code remains the stronger route for the current mechanism trace.

This stable binary and its data are **not** the same revision as research checkout `ef31b1fc…`. All five selected food/requirement data files differ; full installed copies and comparison hashes are retained privately. No installed-stable UI/crafting parity with the main-source trace is claimed. Startup remains untested.

## I3: Deeper Qud capture and source boundaries

The domain-driven extended export requested 182 concrete cooking/supporting types, reusing eleven earlier exports and adding 171 full classes successfully. It covers the concrete types named in the retained cooking-domain unit/trigger/action mappings, recipe/component classes and selected Statistic, Physics and popup dependencies. Separate UI passes add sixteen complete types for modern/legacy inventory, journal, navigation, contextual actions and popup/menu controllers.

Combined with the initial successful exports, the final archive contains 212 nonempty complete targeted Qud classes. Two initial wrong-name lookups remain as failed receipts with corrected full exports. Exporting a class is not equivalent to reviewing every method. The named ingredient/use chains and selected UI windows were read; no whole-game semantic audit or rebuilt Unity project is claimed.

The HP consumer now reaches the Statistic penalty setter and its synchronous change notification. Physics damage handling changes that penalty and owns HP/death checks. Full exact event ordering between all participating parts/effects and lethal-hit behavior remains unresolved. The report therefore preserves the real consumer without claiming invulnerability.

## Saved handback

| Record | Purpose |
|---|---|
| [Combined report](QUD_CDDA_REPORT.md) | Ingredient/knowledge/craft/use conclusions and evidence layers |
| [Qud trace](QUD_INGREDIENT_RECIPE_USE.md) | Raw fruit, preservation, effect generation, recipe recording, repeat cooking and HP consumer |
| [CDDA trace](CDDA_INGREDIENT_RECIPE_USE.md) | Recipe access, actual means, in-progress craft, output, eating and bodily nutrients |
| [UI evidence](QUD_CDDA_UI_EVIDENCE.md) | Inspected screenshots with versions, provenance and native gaps |
| [Qud UI implementation](QUD_UI_IMPLEMENTATION_NOTES.md) | Shared popup paths, input/focus, inventory actions, filtering and journal integration |
| [Other procedural aspects](OTHER_PROCEDURAL_ASPECTS.md) | Ranked adjacent questions, preserved distinctions and finite follow-ons |
| [Private archive](private/qud-cdda/README.md) | Complete selected source/data/text, exact locators and receipts |

No game was launched, no user save was accessed, no gameplay or source binary was patched, and no YAIR runtime/design owner was edited. No new agent/chat, commit or publication. Installed app bundles and saved reference documents are the completed actions; native behavior remains untested.
