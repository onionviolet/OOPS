# Own-holdings display for the other non-native lives (plan, proposal, 2026-11-03)

Proposal under AD32; nothing built. Follows A1-A4 of [HP_O1_O2_RECEIPT](HP_O1_O2_RECEIPT.md). Rules: AD44, AD46, AD51, AR1-AR16, AR3, UR (display only), AD36, AD43. Default, dial and reason below replace an either/or question (AD5).

## Evidence (read this session, not run)

| Fact | Locator |
| --- | --- |
| The registry is display-only and its text is static strings (purse, items, body); the veil is CSS on `:root[data-own-holdings]` | `src/own_holdings.js`, `styles/world_look.css` |
| Today just the HP lead world registers | `src/book_world_hp_lead_domain.js:28` |
| School life holds a wand, paper, an allowance of 8 and a debt of 4 as local units; its text says the units are authored test values | `src/world_packs/book_hp_life_data.js` |
| Trade life holds a wand, glass stock, 12 local trade units and 6 units of rent debt; its text says the purse is separate from Frontier coins | `book_hp_life_data.js` (trade opening note) |
| Gu, Shadow Slave apprentice and the Shadow Slave fan-law life each declare their own world; their holdings were not read here (a grep for resource, money, coin and purse found no hit in the Gu and apprentice packs) | `book_gu_life.js:34`, `book_shadow_slave_life.js:28`, `book_shadow_company_life.js:35` |

## Default, dial, reason

- **Default:** every life that declares its own body and holdings shows those, not the native hero's. The veil follows the actor's current world, not the pack that was loaded.
- **Dial:** a life may declare that it uses the native purse or items (for example a crossing that carries the hero in). Then the native display stays.
- **Reason:** a life forces real systems (AD44); an invisible contradiction between the shell and the life is a bug in the life.

## Parts

| Part | Content | Disposition | Owner files | Done check |
| --- | --- | --- | --- | --- |
| P1 | Make the registry read live values, not fixed strings: an optional reader for purse and items over the life's own simulation resources and inventory (covers A3). Static text stays as the fallback | ACT NOW (first). **Built 2026-11-03** (agent-verified, not human-reviewed): [HP_HOLDINGS_P1_RECEIPT](HP_HOLDINGS_P1_RECEIPT.md) | `src/own_holdings.js`, `src/display.js` (the existing money hook, count against the AR1 line cap), `src/world_look.js` | HP lead still reads "no money of your own"; a test life with 3 units shows 3 and drops to 2 after a spend; no save change |
| P2 | School and trade register: purse from the allowance and trade units with the debt shown beside it, items from the life's own stock (wand, paper, panes) | ACT NOW after P1. **Built 2026-11-03** (agent-verified, not human-reviewed; reload/Import and trade spend verified headless): [HP_HOLDINGS_P2_RECEIPT](HP_HOLDINGS_P2_RECEIPT.md) | `src/book_world_hp_*` (existing domain files) | Before/after screenshots at 14 and 21 px; native Village identical; school and trade saves reload and import unchanged |
| P3 | Gu, apprentice and fan-law lives: read what each holds first (one bounded read), then register or declare the dial | ACT NOW after a read. **Built 2026-11-04 for the five Gu and Shadow Slave lives** (agent-verified, not human-reviewed; academy and keeper Import open, A1): [HP_HOLDINGS_P3_RECEIPT](HP_HOLDINGS_P3_RECEIPT.md). Fan-law = the Shadowbound company life; no separate apprentice/fan-law pack beyond those | the three life packs and their domain registration | A written holdings table per life; each screenshot shows its own state or an explicit native-purse declaration |
| P4 | Own vitals readout in place of the hidden native stat sheet (A2) | LATER, own slice | life-owned body state, UI owner | A lead life shows its own health and stamina; separate design pass |

## Consequences to account for

- **Crossings and carry:** the world key must come from the actor's current world; a hero who crosses between worlds shows the right purse on each side (L5 in the tracker owns crossings; do not decide it here).
- **Display versus truth:** the registry changes just what is shown. Any code reading the native purse for a rule (prices, rent) is a separate bug if it runs in a non-native life; P2 should grep the school and trade price paths for the native purse and report any hit, not fix it silently.
- **Spoilers:** a life's item labels pass the same observer filter as everything else; the reader does not expose unknown items.
- **Verification:** per AD43 a part is done just with a rebuilt isolated snapshot, both font sizes, native start unchanged, and save, reload and Import. Gu and Shadow Slave were not run in the O1/O2 pass, so P3 owns their first before/after.

## Cost and writer

One Sonnet implementer at high effort per part, serial (P1 first; P2 and P3 touch different life files but share `own_holdings.js`, so one writer at a time). No new reading, no paid calls.
