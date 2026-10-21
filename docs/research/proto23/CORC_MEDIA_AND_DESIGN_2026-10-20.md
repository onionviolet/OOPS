# Corc / Proto23 media and design collection

2026-10-20. Weibao supplied 23 local images/GIFs and seven Discord attachment
links, requested saving them and collecting more relevant Corc attachments, then
asked for surrounding design discussion, a reusable toolset, existing-tool
research and a separate YAIR developer pass. This continues the
[Discord research owner](DISCORD_RESEARCH_2026-10-15.md).

Research evidence and proposals. AD32, AD35 and AD36 apply; AD6–AD8, AD34,
AD38 and the existing making/UI owners govern any later adaptation. This pass
changes no accepted mechanic, runtime code, UI priority, save, bundle or release.
The target of any later UI implementation remains desktop first. No new UI was
implemented or browser-tested here.

## Saved evidence and coverage

Private package: `private/discord-media-2026-10-20/`, covered by the existing
Git ignore rule. [Offline gallery](private/discord-media-2026-10-20/gallery.html),
[coverage](private/discord-media-2026-10-20/coverage.json),
[post index](private/discord-media-2026-10-20/index.json),
[missing attachments](private/discord-media-2026-10-20/missing-attachments.json).
The gallery contains raw source captions and should remain private.

| Evidence | Verified result |
|---|---|
| Supplied files | All 23 copied byte-for-byte, with original paths and SHA256 in `supplied-manifest.json`. The two supplied GIFs remain GIFs. |
| Supplied links | All seven have saved browser-captured media in `linked/`. Five are animated GIFs with 97, 61, 66, 180 and 109 decoded frames; the other two are PNGs. Preserve all captured variants rather than asserting exact equality with expired CDN originals. |
| Author and query | Signed-in Arcanum search `in:proto-23 from:corc_lp5 has:file`. Display name Corc, observed account ID `172432875638095872`; not the similarly named account from the old research pass. |
| Search traversal | All 13 displayed result pages, 308 distinct message IDs, first-page Previous disabled and last-page Next disabled. Dates derived from snowflakes: February 17, 2021 to October 18, 2026 Eastern. This is the complete displayed search result, not an independently complete channel/thread archive. |
| Attachment inventory | 313 distinct attachment IDs mapped to the 308 post records. 285 have saved media representations and two more have original HTML files. 26 listed IDs have no saved bytes. |
| Media storage | 311 distinct captured media files covering 291 attachment IDs, including six IDs from surrounding discussion. Multiple representations of one attachment are retained. Most images are browser WebP derivatives; some originals/full animated resources were available in viewers or cached snapshots. |
| Surrounding discussion | 17 selected windows, 671 rendered rows before deduplication, 623 distinct actual message rows. Coverage is selected context, not a full read of every surrounding conversation. Raw text, DOM and source links remain in `contexts/`. |
| Source files | Two original 2021 HTML attachments downloaded and hashed, stored without execution. Twelve other listed HTML source attachments are not acquired. Preview bodies are truncated, so they are not substitutes for full source files. Other missing IDs include images, audio, a font and a community save attachment. |
| Verification | Saved-file hashes/sizes and full image/GIF decoding passed with zero errors. The seven linked resources were visually sampled at beginning/middle/end; the 23 supplied images were inspected. The rest have caption/topic indexing, not complete visual or semantic review. |

`corc-attachment-posts.json` retains the original first capture plus refreshed
HTML/link fields. `index.json` supplies dates, topic tags, media associations,
context locators and expected message permalinks. Topic classification is a
retrieval aid; ambiguous images stay marked for visual/context review. For
thread results, attachment paths support a channel-ID inference, not a claim
that every expected permalink was independently opened.

The gallery is saved and its local references are checked. Browser rendering
was not verified: the browser security policy rejected `file:` navigation.
No alternate browser route was used to evade that rejection.

## Context-backed findings

These extend F1–F13 in the earlier Discord owner. Developer statements describe
what Corc said at that date. They do not certify a public release or a working
current build. Community responses remain attributed suggestions.

| Code | Source observation and design reasoning | Evidence / consequence |
|---|---|---|
| F14 | The blue matching-frame tooltip is an unused alternate draft. Corc said he did not plan to use that particular variant; several replies liked its appearance. The exchange does not establish when the draft was created, which variant superseded it, or the latest shipped style. | [October 3, 2026](https://discord.com/channels/622495527485046805/811370601129705483/1556108309105344552). Weibao challenged the earlier blanket “rejected experiment” label. Retain the dated variant and uncertainty rather than converting the caption into a complete design chronology. |
| F15 | Weather can remain part of the world while its display becomes unavailable underground. Nearby discussion distinguishes another developer's event system from Corc's own system; Corc says event handling improved his game's flexibility. | [July 11, 2026](https://discord.com/channels/622495527485046805/811370601129705483/1525632186236145846). Good precedent for separating world state, observer access and representation under AD6–AD8. Other participants' combat plans are not Proto23 mechanics. |
| F16 | Climbing media communicate height, grip loss, debris, rain and a fall outcome. Corc explicitly connects one animation to wet rock. The captures show rain and descent/fall feedback; exact success formulas are not exposed. | [Wet rock](https://discord.com/channels/622495527485046805/811370601129705483/1535071007424126997), [debris](https://discord.com/channels/622495527485046805/811370601129705483/1534727563966939146), [fall outcome](https://discord.com/channels/622495527485046805/811370601129705483/1534830288256106567). Adapt feedback tied to an actual changing situation, not a generic particle layer. No deterministic injury or weather formula is inferred from a GIF. |
| F17 | Logging GIFs expose the target, level, toughness, remaining durability and selected tool/power, with a visible fell-tree transition. Corc described an early version as unfinished and later posted the completed base. | [June 28 prototype](https://discord.com/channels/622495527485046805/811370601129705483/1520669885502455860), [June 29 base](https://discord.com/channels/622495527485046805/811370601129705483/1521016485944885269). These are dated development demonstrations. They support a candidate pattern of showing the mechanism and selected means alongside ongoing work. |
| F18 | A discussion about gathering into inventory versus a pile leads to explicit distinctions: large objects consume a slot each, storage-ring limitations have an in-world strain reason, and the item clock begins in the pile rather than waiting for pickup. | [July 7, 2026](https://discord.com/channels/622495527485046805/811370601129705483/1524215264537739426). The inventory decision was being discussed; the later details should not be flattened into a universal gathering rule. Useful under AD38 and existing storage/time owners. |
| F19 | A crafting batch can stop after a specified quantity to avoid running indefinitely and consuming unwanted resources. | [April 10, 2026](https://discord.com/channels/622495527485046805/811370601129705483/1492270294709305455). A concrete intent-to-stop control, not evidence of a general scheduler. Any adaptation belongs in the existing making job owner. |
| F20 | Sharp/blunt recipe requirements reveal which actual tool will be selected, and using it wears that tool. Nearby posts show timed-crafting feedback intended to remain visible when the crafting menu is closed, with inclusion in the update still uncertain at that date. | [December 18, 2025 and surrounding exchange](https://discord.com/channels/622495527485046805/811370601129705483/1451305842501615646). Selection, costs and background feedback are connected; the timed feature's tentative status matters. |
| F21 | Smashing an object can work without large tools and can coexist with disassembly, usually giving less output. Nearby CSS/DOM discussion is implementation commentary, not an additional gameplay rule. | [October 6, 2025](https://discord.com/channels/622495527485046805/811370601129705483/1424795106522828971). Supports mechanism-based alternative methods under AD38, with outcomes/costs rather than an arbitrary allowed-method list. |
| F22 | Food-expiry disclosure is debated separately from food lifetime. A player suggests cooking knowledge; Corc sees cooking as plausible but raises average versus actual lifetime uncertainty. Another player suggests learning through experience. | [March 30, 2024](https://discord.com/channels/622495527485046805/811370601129705483/1223511074372845630). Preserve the questions and attribution. This is not proof that any particular disclosure scheme shipped. |
| F23 | The configurable-name screenshot responds to long item text failing to fit. Nearby skill-number discussion considers whether qualitative per-level descriptions, exact values and indirect formulas communicate appropriately; a player proposes unlocking numerical insight through knowledge. | [April 10, 2026](https://discord.com/channels/622495527485046805/811370601129705483/1492309608058847242). The screenshot demonstrates a local text/layout problem and a proposed solution. It does not establish one final global numbers policy. |
| F24 | Compact oxygen placement drew a specific complaint that HP was harder to read. A reader pointed to the border crossing text; Corc posted a lighter-border revision and said it was still being tweaked. | [June 13, 2026](https://discord.com/channels/622495527485046805/811370601129705483/1515288902909427744). Useful evidence of the tradeoff between density, resource placement and text legibility. No user-accepted OOPS layout follows automatically. |
| F25 | Repeated-message stacking was posed as a design question. Corc later said he would make it optional, in a surrounding exchange about how changing counts should remain noticeable. | [February 6, 2023](https://discord.com/channels/622495527485046805/811370601129705483/1072079511363006485). Prefer retaining the settled event history independently from a compact display choice if this is adapted. |
| F26 | Cultivation discussion distinguishes passive XP, absorption modifiers and technique practice with stages resembling skill milestones. Corc connects it with existing absorption skills; the UI was unfinished in that post. | [October 26, 2021](https://discord.com/channels/622495527485046805/811370601129705483/902703368290598932). A historical intended integration, not a newly verified current feature or authority for OOPS to duplicate progression systems. |
| F27 | Randomized accessories were proposed with wear and eventual breakage. A player welcomed variety while asking for stable alternatives. Corc framed random item values narrowly for his own game at that time. | [November 4, 2025](https://discord.com/channels/622495527485046805/811370601129705483/1435208947869941880). Keep his preference distinct from our gear direction and from the player's request. No universal wear requirement is adopted. |
| F28 | Recipe search by component was added before the expected recipe collection grew large. Earlier recipe-detail media report success chance, skill teaching and craft count; surrounding players discuss hints from lore, merchants or notices. | [Component search, May 26, 2023](https://discord.com/channels/622495527485046805/811370601129705483/1111779482752274432), [recipe information, November 3, 2021](https://discord.com/channels/622495527485046805/811370601129705483/905448996988940328). Inverse lookup and discovery hints are different mechanisms; the latter comments are suggestions, not established implementations. |
| F29 | Cat interaction and thought screenshots combine ordinary care actions with comic text. The nearby final-boss interpretation is a player's joke/question. | [July 10, 2026](https://discord.com/channels/622495527485046805/811370601129705483/1525227182631419966). Preserve the personality and observation route without converting jokes into canonical hidden mechanics. |

## Collection method and existing tools

Signed-in browser collection used visible Discord search and selected message
contexts. Read-only DOM extraction preserved captions, identifiers, link
metadata and replies. Browser `Page.captureSnapshot` preserved cached MIME
resources after scrolling and opening selected media viewers. MIME decoding,
SHA256 and image decoding verified the actual saved bytes. No credentials or
browser internal application state were extracted.

Direct CDN/proxy fetches returned 403 and were stopped. The cached browser route
recovered the supplied media; this is a separate acquisition route, not a claim
that those direct downloads succeeded. Image-link download attempts opened a
viewer or timed out. Two actual HTML file downloads succeeded; later offscreen
and preview-menu downloads did not. No 429 was observed in this collection;
the [earlier 429 incident](DISCORD_RESEARCH_2026-10-15.md#load-all-failure-http-429-october-15)
remains relevant to a larger export.

Use existing exporters before adding a new collector. Current primary docs for
[Discrub](https://github.com/pratherbytecraft/discrub) describe JSON/HTML/media
exports, author filters, operation delays, waits based on Discord's retry
response, and saved workspaces/resume. Its installed version and these controls
have not been runtime-tested here. [DiscordChatExporter](https://github.com/Tyrrrz/DiscordChatExporter)
is the other candidate for the toolset comparison; it has not been installed
or run in this task. These are candidates, not equivalent verified routes.

[Discord's rate-limit documentation](https://docs.discord.com/developers/topics/rate-limits)
says to derive limits from headers rather than hardcoding them, and use
`Retry-After` or `retry_after` after 429. A future exporter run should preserve
partial output and its cursor, serialize collection at first, honor the actual
wait and stop repeated access failures. Avoid overlapping large exports from
the same account. Resume source acquisition from gaps instead of refetching
already saved files. This is a practical operating plan, not a measured safe
requests-per-second promise.

Weibao requested a separate toolset chat. Local repo:
`/Users/weiwei/code/discord-reference-workbench`, branch
`codex/initial-toolset`. Chat **Build Discord reference workbench** owns it and
is building an existing-exporter-oriented indexing/verification layer. Its
implementation and tests have their own completion state. No commit, push,
remote repo publication or new installed tool was performed by this collection.

## Remaining boundaries

The 26 missing listed attachment IDs and all derivative/original distinctions
remain explicit in the private manifests. Most received media have not had a
full visual review. Search-index coverage is not independently verified full
history or thread coverage, and the 17 context windows are selected samples.
No current release, save compatibility or playable behavior has been certified.
The separate chat **Research YAIR developer design and media** was created
after this collection. It owns its own YAIR research record, will verify
Miktaew's author identity, inspect surrounding discussions and reuse the
exporter/toolset findings. Its collection is a separate, ongoing task.
