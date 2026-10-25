# Fan CYOA and jumpchain survey (2026-10-22)

Research input only. Findings are not accepted decisions. Perk text is not reproduced; this catalogs structure and design ideas.

## Method and limits

- WebSearch plus WebFetch only. Reddit (all routes), the Jumpchain Fandom wiki (HTTP 402), Scribd (410), TV Tropes (403) and Patreon (403) were blocked, so r/makeyourchoice, r/JumpChain and the wiki jump index could not be read. One failed fetch per site, then I switched route.
- Productive route: the Neocities ICC index `https://infaera.neocities.org/alpha/` (665 titled links, opened) and ICC `project.json` data files, which expose structure as text.
- Verification codes:
  - **V2**: the CYOA's own data was opened and structure read (read only the first ~100 KB when data was large).
  - **V1**: the listing page was opened and confirms the title, world and URL exist. Contents not read.
  - **U**: web-search snippet only. Treat as unconfirmed.
- Most ICC pages render with JavaScript, so a plain fetch returns only a title. `project.json` at the CYOA folder works for some and fails (404 or over 10 MB) for others.

## Catalog

| # | Title | World | URL | Creator | Format | Budget and categories | Design ideas | Check |
|---|---|---|---|---|---|---|---|---|
| 1 | Mother of Learning CYOA 1.1 | Mother of Learning | https://evericent.neocities.org/CYOAs/Mother%20of%20Learning/1.1/index.html | evericent (from host name) | ICC | Two pools: 25 Power Points (PP), 7 Item points. Rows: Classes (3 to 5 electives), Time loop entry, Exempt bonuses, Marker settings, Mana tier, Bloodlines, Bloodline control, Drawbacks, Perks. | Entry point in the loop is a priced choice: later start costs PP, earlier start (even "the beginning") grants PP. Marker (the loop device) has its own settings with trade-offs, including a markerless option. Mana magnitude tiers trade points. Bloodline control gated by bloodline picks. Drawbacks and items convert between pools (Broke gives an item point, Rich costs). Good model for a loop-aware start. | V2 |
| 2 | Fullmetal Alchemist CYOA | Fullmetal Alchemist | https://rednightphoenix.neocities.org/CYOAs/FMA/index.html | rednightphoenix (host name) | ICC | 50 Exchange Points (EP); final total must be 0 or more. Groups: You, Location, Perks & Drawbacks, Skills, Equipment, Homunculus, Human Chimera, Alchemy, Allies & Opponents. | Reincarnation insert with a fixed date (day before the Elrics arrive in Liore, 1914). Budget is called Exchange Points and the run is balanced to zero, so "equivalent exchange" is the cost rule. Sacrifices raise points and make the run harder. Homunculus and Chimera are alternate body paths. | V2 (first 100 KB; costs not read) |
| 3 | Harry Potter Multicross CYOA | Harry Potter plus crossovers | https://graev.neocities.org/cyoa/HarryPotterMulticross/index.html | Graev | ICC | Setup: Target (you / someone else / meta), Difficulty (Easy +2, Normal +1, Hard -1 Power), Powers (1 each, unlimited), House (free), Time (free), Drawbacks. | Difficulty is a sign flip on the budget. Powers are whole power systems (Mistborn, Magus, Wizard, Aura and so on), each tied to a ghostly mentor companion. Era choice (Philosopher's Stone, Order of the Phoenix, War Era, Fantastic Beasts) works as a free scenario selector. Low-granularity "pick a system" design. | V2 |
| 4 | Fate Another Pretender | Fate (Clock Tower magus) | https://anotherpretender.neocities.org/optimized/ | Om1cr0n | ICC (conversion of an image CYOA) | Data very large (about 2 MB). Visible row: choose one Clock Tower department (General Fundamentals, Individual Fundamentals, Spiritual Evocation, Mineralogy, Zoology, Astromancy). | Specialty department picks a magecraft discipline; later rows (not read) cover the rest. Conversion note on Patreon says the image original did not fit ICC cleanly. | V2 partial; Patreon note U |
| 5 | Naruto CYOA (Alpha Build) | Naruto | https://interactivenarutocyoa.neocities.org/Naruto%20CYOA/ | Punch (site title "Punch's CYOAs") | ICC | Search snippet: four counters, Bloodline Points, Character Points, a Bloodline Limit and a Summoning Limit. | Splits chakra-heavy choices (BP) from mundane ones (CP), and caps bloodline and summons by count. Useful model for a two-currency power/life split. Page body would not load, so details unread. | U (snippet); existence V1 |
| 6 | Naruto (Knot Not Applicable) | Naruto | https://knotnotapplicable.neocities.org/naruto | knotnotapplicable | ICC | Not read. | Second independent Naruto CYOA, useful for comparison. | V1 |
| 7 | Harry Potter CYOA (Kondor) | Harry Potter | https://kondor9543.neocities.org/HPcyoa/index.html | Kondor | ICC | Not read (project.json 404). | Same author also runs Fallout and RWBY jumpchain-style CYOAs. | V1 |
| 8 | Harry Potter JumpChain | Harry Potter (jump doc conversion) | https://infaera.neocities.org/cyoa/HarryPotterJC/index.html | Not shown (infaera hosts) | ICC | Not read (data over 10 MB). Jump style implies CP budget, origins with discounts, drawbacks. | Interactive form of a standard jump doc; would show origin discounts in action. | V1 |
| 9 | Harry Potter (Serenity) | Harry Potter | https://sinister.neocities.org/HarryPotter/ | sinister (host name) | ICC | Not read (404). | Another HP take. Note: neighbouring entries in the index are adult-themed variants (Harry Potter Lewd); skip those. | V1 |
| 10 | Bleach | Bleach | https://cityoftheabyss.neocities.org/bleach/ | cityoftheabyss (host name) | ICC | Not read (data over 10 MB). | Single-world Bleach build; would show Soul Reaper, Hollow, Quincy style origins. | V1 |
| 11 | Bleach (Multicross) | Bleach plus crossovers | https://ving.neocities.org/CYOA/ | ving (host name) | ICC | Not read (over 10 MB). | Crossover format like entry 3. | V1 |
| 12 | Jujutsu Kaisen | Jujutsu Kaisen | https://syladinthedragon.neocities.org/jujutsu%20kaisen/ | syladinthedragon | ICC | Not read (over 10 MB). | Likely cursed technique and cursed energy builds. Size suggests a deep CYOA. | V1 |
| 13 | JUJUTSU KAISEN CYOA | Jujutsu Kaisen | https://papilliona.neocities.org | papilliona | ICC | Not read. | Second JJK CYOA for comparison. | V1 |
| 14 | Hunter (Graev WIP) | Possibly Hunter x Hunter, possibly contract-killing original | https://graev.neocities.org/cyoa/HunterWIP/index.html | Graev | ICC | Not read (over 10 MB). Fandom unconfirmed. | Check before use. No confirmed HxH CYOA found. | V1, fandom unconfirmed |
| 15 | FGO: Create Your Own Lostbelt | Fate/Grand Order | https://particle9.github.io/cyoa/lostbelt_cyoa/ | particle9 | ICC (GitHub Pages) | Not read. | Builds a world (Lostbelt) rather than a character: inverse of a start CYOA, relevant to world-seed design. | V1 |
| 16 | Fate Changer and Interactive Fate (Modified) | Fate | https://fatechangernsfwcyoa.neocities.org/FateChanger/ and https://emyraa.neocities.org/cyoas/FateModified/ | Not shown | ICC | Not read. Fate Changer is adult-tagged; Modified is the Servant-or-Master style one. | Servant/Master picks. | V1 |
| 17 | Mushoku Tensei Reincarnation | Mushoku Tensei (isekai magic) | https://chuchurrumin.neocities.org/mushoku%20tensei%20cyoa%202.1/index.html | chuchurrumin | ICC | Not read. | Reincarnation-with-memory start plus magic aptitude; close to cultivation/life-sim shape. | V1 |
| 18 | Philosophy Cultivation | Original (cultivation) | https://evericent.neocities.org/CYOAs/Philosophical%20Cultivation/index.html | evericent | ICC | Not read. | Same author as the Mother of Learning CYOA; cultivation framing may map to this project. | V1 |
| 19 | LordValmar series (Avatar, One Piece, MHA, Danmachi, Dragon Age, Skyrim and others) | Many licensed worlds | https://valmar.neocities.org/cyoas/avatarcyoa/ (and sibling folders) | LordValmar | ICC | Not read. | One author, one consistent template across about 19 worlds. Good to sample one for a reusable shape. | V1 |
| 20 | Cosmic's Interactive Jumpchain Conversions | Yakuza LAD, FF7 Rebirth, Dead Rising, Overwatch | https://cosmicproposal.neocities.org | Cosmic; each credits the original jump author | ICC Plus 2 | Four conversions of standard jump docs. | Evidence that jump docs convert to interactive form with discounts intact. No target world here. | V2 (hub page) |
| 21 | Kondor jumpchain-style set | Harry Potter, RWBY, Fallout | https://kondor9543.neocities.org | Kondor | ICC | Hub lists three CYOAs. | Includes a "Fallout Jumpchain" and "RWBY JumpChain" in the index. | V2 (hub page) |
| 22 | The World-Expert CYOA | Multi-fandom (TV, anime, games) | https://archelon.neocities.org/ | Not shown | ICC | Snippet: Boon Points modify you and your world, Gift Points modify the CYOA itself, Difficulty sets starting points or debt. | Meta-currency that changes the rules of the build, and difficulty as starting debt. | U |
| 23 | Maximus Worm V6 multi-fandom page | Worm plus fandoms | https://maximuswormcyoav6m.neocities.org/ | Not shown | ICC | Snippet: powers priced in SP; locations priced per fandom (for example 3 to 10 CP for Akame ga Kill! locations). | Priced starting locations by world. | U |
| 24 | Harry Potter: Marauders Era jump | Harry Potter | Reddit jump drive (link not found) | Not shown | Google Doc jump | Snippet from a SpaceBattles thread: exists on the r/JumpChain drive. | Era-specific jump; matches the era selector idea in entry 3. | U |
| 25 | Hunter x Hunter jump (PDF) | Hunter x Hunter | SpaceBattles thread: https://forums.spacebattles.com/threads/general-jumpchain-thread.393563/page-630 | Not shown | PDF jump doc | Snippet: praised for not limiting Hatsu; only abilities made inside the jump are fiat backed. | Open-ended Hatsu design with fiat only for jump-made abilities: a clean rule for custom powers. | U |
| 26 | Naruto jump | Naruto | Jumpchain wiki page lists a Drive file (jumpchain.fandom.com/wiki/Naruto) | Not shown | Google Drive doc | Snippet only; wiki returned 402. SB thread mentions endjump choices (leave after Kaguya or after Boruto) and an Otsutsuki endjump scenario. | Exit-timing and clan-scenario ideas. | U |
| 27 | Fate servant supplement | Fate | https://n.gst.elementfx.com/dl/fate-servant-supplement (low-trust mirror) | Not shown | Doc | Snippet: any pre-1900 legend can be a Servant in Fuyuki wars; no EX Divinity. | Servant eligibility rule. Mirror quality is poor; find the original before use. | U |
| 28 | Bleach Jumpchain: Spiritual Origins Guide | Bleach | https://www.scribd.com/document/530109147/Bleach-JumpChain | Not shown | Scribd upload | Snippet: points to customize origin, abilities and starting location. Fetch returned 410. | Origin-first structure (soul, Soul Reaper, Hollow). | U |
| 29 | Fate Another Pretender (Patreon post) | Fate | https://www.patreon.com/interactiveapps/posts/fate-another-78486765 | Om1cr0n (conversion) | Patreon page | Snippet only (403). | See entry 4. | U |
| 30 | Harry Potter jump notes (r/JumpChain thread) | Harry Potter | https://lr.sudovanilla.org/r/JumpChain/comments/1fbvafv/choose_a_single_jumpchain_to_do | Not shown | Reddit mirror | Snippet: HP jump with Grey Perkline, Master of Death and Jumper Who Lived scenarios. Not opened. | Scenario-as-bundle examples. | U |

## Gaps (no CYOA or jump found)

- **Lord of the Mysteries**: no CYOA or jump doc surfaced in four searches and in the 665-title index. Only lore pages (22 pathways, Sequences 9 to 0, acting method).
- **Shadow Slave**: only an itch.io fan game, "A Missing Memory" (https://maschiat.itch.io/shadowslavefangame), a pixel puzzle game, not a build document. Opened (V2), not a CYOA.
- **Reincarnation Paradise**: nothing. A Mushoku Tensei CYOA (entry 17) is the nearest reincarnation-style build.
- **D&D**: only unrelated Dungeons & Deviants entries and a Pathfinder CYOA (https://cyoamoar.neocities.org/PFCyoa/, V1). No D&D CYOA confirmed.
- **Hunter x Hunter**: no CYOA confirmed; one unconfirmed Graev entry and one jump PDF mentioned in a thread.
- Not reached: r/makeyourchoice and r/CYOA posts, the Jumpchain wiki jump list, the Google Drive jump archive, 4chan and QQ archives, Imgur image CYOAs. These would add many more jump docs, especially Naruto, Bleach, HxH and HP jumps.

## Common structural patterns

Mix of verified (entries 1 to 3, 20) and snippet-level (jumpchain basics from the Jumpchain wiki via search, unverified):

1. **Budget.** A standard jump is about 1,000 CP and runs ten years (wiki snippet, U). ICC builds use small integers instead: 25 PP and 7 item points (MoL), 50 EP (FMA), or unit "Powers" (HP Multicross). Some split into two or more currencies (Naruto snippet: BP and CP; MoL: PP and items).
2. **Zero-sum balance.** FMA requires the final total to be 0 or more, so every pick has a visible price. MoL ties several rows (loop entry, mana, drawbacks) to the same pool, so a rich choice in one row is paid in another.
3. **Origins and discounts.** Jump docs offer a few origins that discount related perks and items (wiki snippet, U). ICC builds often replace origin with gating: MoL's Exempt bonuses need the Exempt entry, Marker settings need a non-Exempt entry, Bloodline control needs bloodline picks.
4. **Drawbacks for points.** Universal. MoL drawbacks give PP (Cripple, Insomnia, Savior's deal, Invader). Jump docs usually grant CP, sometimes at half value as a house rule (U). HP Multicross shows the minimal form: a Drawbacks row that gives more Powers.
5. **Difficulty as a budget switch.** HP Multicross Easy +2, Normal +1, Hard -1. The World-Expert CYOA starts from points or debt by difficulty (U).
6. **Scenarios and time selectors.** HP Multicross uses a free "Time" row (era) as the scenario. MoL uses the loop entry point (priced). Jump docs add scenarios as long optional bundles (U).
7. **Companions.** Usually a purchasable row. In HP Multicross each power system is paired with a named mentor.
8. **Starting location and date.** FMA fixes a date and has a Location group. Multi-fandom CYOAs price locations (U).
9. **Rule overrides.** A jump doc can override the general chain rules (wiki snippet, U).
10. **Meta currencies.** The World-Expert CYOA's Gift Points change the CYOA itself (U).
11. **Exclusive and capped picks.** One loop entry, one mana tier, capped bloodline or summoning counts, "once per type" drawbacks.

## Design ideas worth taking

1. **Priced entry point in time.** MoL's loop entry (start earlier, earn more) maps to a life-sim start age or moment. Source: entry 1.
2. **Hidden or fixed start date plus world knowledge.** FMA's "memories return the day before X" is a clean, cheap start hook. Source: entry 2.
3. **Pick a power system, not a power.** HP Multicross sells whole systems with a mentor companion. Source: entry 3.
4. **Two-pool budgets** that separate mundane from supernatural investment. Sources: entries 1 and 5.
5. **Gates instead of tags.** Requirements between rows create builds without lists of banned combinations. Source: entry 1.
6. **Open custom ability with a narrow fiat rule** (HxH jump praise). Source: entry 25, unconfirmed.
7. **Meta-lever rows** (target self or someone else, difficulty, rule gift). Sources: entries 3 and 22.

## Suggested next steps if this thread continues

- Open entries 5, 8, 10 and 12 in a real browser (the browser pane can read rendered ICC text where `project.json` is too large) and note budget and discount structure.
- Find the r/JumpChain jump archive through a route that is not blocked, for Naruto, Bleach, HxH, JJK and Harry Potter jump docs.
- Treat Lord of the Mysteries, Shadow Slave, Reincarnation Paradise and D&D as having no fan precedent found; design from the source novels and the patterns above.
