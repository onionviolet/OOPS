# Desktop UI grammar

## Shown image

Official store screenshot 0 is 1680 by 1050 pixels, fetched via Steam appdetails on 2026-10-14. It shows build 0.427-2. URL and hash are in FINDINGS.json; the file stays privately in `notes/store-screen-0.jpg`. It is an earlier presentation example, not evidence of today's installed runtime.

The left roughly 300 pixels hold three color-coded resource meters, HP/attack/defense/gold, current rebirth time, reset/EXP and save/load actions. A second roughly 220-pixel rail holds feature buttons. The remaining width holds one large boss page, character/opponent images, prominent actions, HP bars and a lower story region. Several features are visibly locked even while NGU and later systems are unlocked. This concretely illustrates the permanent-versus-run distinction.

## Shown source

`MenuSwapper.swapMenu`, `swapOut` and `swapIn` select one active menu, disable outgoing canvases/raycasters and position the active page at small or big anchors. This is stable navigation plus a detail page, not simultaneous full-detail dashboards.

`ButtonShower.updateButtons` treats hidden, disabled, named and ready as different states. Money Pit, fruit, quest, cooking and blood readiness use distinct colors. Several humorous lock labels convey little by themselves, and some locked text is set to font size 10 or 12. `DisabledButtonTooltip` supplies a reason when a button cannot be used and advertises inventory modifier-click controls when it can.

`RebirthPowerDisplay.Update` shows current and next NUMBER, a gain/loss image, ratio and approximate boss consequence, with contributor rows. Some rows are gated by relevant progression; Blind challenge deliberately suppresses them. `RebirthReminders` checks actual ready events rather than a generic confirmation-only message.

`NGU.targetLevel` interprets 0 as unbounded and -1 as off. `AllNGUController.autoAdvanceEnergy` releases allocation and optionally redirects it through valid rows. `WishesController` separates fast simulation updates from slower bars/text. These are useful repeated controls, but their usability and timing have not been exercised.

## PROPOSAL and desktop acceptance

Adapt stable addresses, consistent row columns, explicit units, ready/blocked status and short consequence text. In YAIRPG, keep routine independent panels visible using laptop width and height, as USER_VISION requests. Do not simply copy NGU's one-page canvas swapping or shrink text to fit a tall feature list. A scoped trial should expose two real ongoing activities and one available action at 1366 by 768 and 1920 by 1080; use regions for long prose, with no mobile optimization workstream.

No YAIRPG browser build or screenshot was made in this research lane. A future UI implementation must rebuild on a fresh origin, verify displayed values against live owner facts and test reload/import if saved layout or progression projection changes. Human layout-feel acceptance remains separate.
