# Everyday systems: static source and recovered pages

Code references use the pinned distribution revision from SKILL_GROWTH.md. None of these systems was run.

## F23: Death and ghosts, shown

`global/player.c::second_life` sets the dead state, asks Death whether to count the death, carries selected effects through death, creates a corpse and notifies guild hooks. It clears held XP/resources and temporary effects, then installs a ghost shadow. Seven is the initial maximum-deaths value. The final-death branch uses a strict greater-than comparison, so source semantics should be read with the missing Death handler rather than equated to a modern displayed counter.

`std/shadows/misc/death_shadow.c` prevents ordinary combat and spell/guild actions, changes the short description and allows only specially marked objects to be added. It stores whether the death cost a life and whether resurrection should restore one through auto-load properties. `remove_ghost` removes the state/shadow and tells inventory to recover. The branch trying to reject final return is not a modern audited resurrection implementation.

The `DEATH` path points to omitted `/d/underworld/death/chars/death`; no source read here proves the prior lane's serialized greeting scene. Modern AshkEnte also postdates these core files and is absent. The [official 2012 announcement](https://discworld.starturtle.net/lpc/blog/blog.c?action=filter&blog=recent%20developments&id=422) states that final-death recovery was added through a costly rite. Current costs, complete side effects and NPC behavior remain help-derived/unread at source level.

## F24: Languages, shown historical mechanism

`obj/handlers/languages.c` registers capabilities such as spoken, written, distance communication and magical text, then dispatches to language-specific garblers. This stripped distribution registers only a few sample languages; it is not the modern world catalogue.

`std/languages/language_inherit.c` derives comprehension from both speaker and listener, seeds its random stream from the message and garbles words consistently for that input. Its header says 0–200, while the actual body clamps to 100. Prefer the implementation when describing this release. Practice requires current-language selection, enough GP, imperfect understanding and eligible speaker/listener relation. It excludes shouting, dead/unconscious/disconnected listeners; repeated identical text is remembered for six minutes. This is a separate language-learning path with its own chance and normal skill-addition throttle, not simply a taskmaster call.

The GP sufficiency check uses difficulty, while spending uses twice difficulty in this historical function. Do not turn a comment or this old mismatch into a claimed current price. `std/skills.c` separately controls which language skills may be taught or self-trained.

## F25: Languages, archived player account

[2026-09-22 Languages snapshot](https://web.archive.org/web/20260922031240/https://dwwiki.mooo.com/wiki/Languages), revision 73807, read in full. **Stated:** native speech and reading start at 100. Other languages begin through schools, then improve with exposure. Speech and writing are separate; grunt is spoken but not understood. Schools differ in prerequisites, schedules, price, texts and examination form. Some documented outcomes are marked as needing research, so they are not firm balance constants.

The page describes language selection and GP for eligible listening/reading, with NPC comprehension thresholds and player exposure at higher proficiency. Portable player-made primers and newspapers create a study market. Guild languages have separate restrictions. Its reported GP rule differs from the historical implementation. Its post-fluency trick is described as a minor bug, not a sound progression design to import.

**Proposal:** preserve meaningful partial comprehension and diverse study sources, but supply NPC/text alternatives for solo mastery. Do not copy a requirement to find another human at a narrow skill range, mutually blocking school choices or a documented bug.

## F26: Housing, shown

`obj/handlers/housing.c` owns a saved registry of houses, rooms, address, region, ownership type, owner, bank and value. Owner changes notify house/room objects. Region mappings choose required citizenship and local bank/money context. Refresh/deletion can release holdings. This shows persistent property identity separate from an individual room's contents.

Its rent process uses the game calendar's month, a stored last-paid marker and bank account deductions. First failure marks arrears; next cycle requires three months' value, described as old rent, fee and current rent, otherwise repossession and account recovery. Owner/renter inactivity timeouts are in `include/housing.h`: 11,520,000 and 5,760,000 real seconds respectively in this source. These historical values are not today's rent policy or the price of an individual house.

`std/room/inherit/player_housing.c` inherits placement and room saving. It keeps surface decoration, guest permissions, door/lock/trap state and exit information. Relative surfaces are resolved against facing. The room retries initial door setup to reduce an unlocked initialization window. This is evidence of intended lifecycle handling, not a tested race-free guarantee.

The public registry code has suspicious cross-use of temporary owner/rental arrays in an owner check. No runtime bug claim is made. A new YAIRPG implementation should use stable property IDs and explicit arrears state rather than embedding status in owner strings.

## F27: Three official help gaps closed, stated

| Source | What it adds |
|---|---|
| [crafts](https://discworld.starturtle.net/lpc/playing/documentation.c?path=/concepts/crafts) | Craft competence includes building, repair, art/music and medical healing; it can matter to quests and wizard training, not just a separate crafting class. |
| [currency](https://discworld.starturtle.net/lpc/playing/documentation.c?path=/concepts/currency) | Regions use their own denominations with base-brass values and local notation. Cities offer exchange. Example: an Ankh-Morpork dollar is listed at 400 brass; a Genua livre at 300. Prices are page statements, not verified exchange quotes or proof of arbitrage. |
| [accents](https://discworld.starturtle.net/lpc/playing/documentation.c?path=/concepts/accents) | Origin city gives an accent; outsiders notice it. Players can select altered spelling or readable text with an accent label. The readability choice preserves character identity without requiring distorted text. |

The adaptation value is coherent small joins: a school charges local money, a book supplies practice, a profession values literacy or medicine, and a rented home supplies safe storage. A long system list alone does not establish these joins in YAIRPG.

## F29: Recovered Death page, stated by players

[Death, 2026-06-09 capture](https://web.archive.org/web/20260609024619/https://dwwiki.mooo.com/wiki/Death), read in full. It distinguishes basic raising from resurrection that may recover some held XP and restore stats. It warns that both leave low HP and that gear recovery can trigger dangerous checks. It lists NPC return routes as well as player rescue groups, so ordinary ghost recovery is not exclusively dependent on online humans. It reports corpse decay continuing while logged out, with inventory at risk when rooms unload. Final return requires AshkEnte with major losses. The life-restock price is on a linked page, not on this page; it remains unread. Exact XP-return claims are explicitly uncertain on the page and were not promoted to source facts.
