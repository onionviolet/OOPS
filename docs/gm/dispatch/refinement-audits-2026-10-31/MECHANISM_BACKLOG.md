# Mechanism and panel backlog for the book campaign (proposal board, 2026-11-02; AD32)

One board for what the story needs from the runtime, kept one arc ahead of the content builders. Lane accepted under AD48; ordering, owners and statuses here are proposals. Source of rows: [gap probe](../../../research/novels/lord-of-mysteries/private/kj-mechanisms-2026-11-02/MECHANISM_GAPS.md) (private; read-only, source reading only). Update a row's status from the implementer's receipt, not from memory.

| ID | Need | First consumer | Needs panel or display | Status | Owner and lane | Blocks |
| --- | --- | --- | --- | --- | --- | --- |
| B1 | BE-seat Seer chain: drink, stabilize, spirituality pool | ch32 P010 | potion and stabilization state on the existing character views | in progress (session `b1-be-seer`, own worktree) | Sonnet high; Opus only if the validator cannot be split | B2-B6, builds past ch31 |
| B2 | Darkened eyes visible to cast observers | ch32 P041 | none | queued after B1 | Sonnet high | none |
| B3 | Spirit Vision switch and exhaustion condition | ch33 P034 | a visible on/off and exhaustion indicator | queued after B1 | Sonnet high | content M5 |
| B4 | Energy as a legal cost in divination and ability steps | ch43 P063 | energy shown in the step cost line | queued after B1 | Sonnet high | Dowsing and divination content |
| B5 | Method gate for divination means | ch54 P041 | none | queued after B1 | Sonnet high | pendulum staging |
| B6 | Paid client session: fee income and favor | ch54 | client, fee and favor in existing Reports | queued | Sonnet high | none |

Rules for the board. Rows are added by a demand scan of the next arc's seams (mechanism tags, unclear items), in consumer order, with a locator for the first use. A panel need names the target viewport (desktop 1920x1080 first, mobile deferred per the standing UI priority), the existing owner (DESIGN.md, UI rules) and is built only after its mechanism exists. One implementer per file area; runtime and UI work that touch the same files serialize or use separate worktrees. Money and currency needs (conversions, fees, institution purses) are rows here when a story first uses them, owned by the economy rules (ECC25, ECX6).

## Arc 2 additions (ch55-84; probe #2, 2026-11-02, read-only, source reading, partial unverified; proposals)

Source: private `kj-mechanisms-2026-11-02/MECHANISM_GAPS_ARC2.md` (28 merged mechanisms: 1 exists, 18 partial, 2 missing, 7 content-only; 14 need runtime work, 7 need UI work). Briefs in consumer order. R1 depends on B1 being merged.

| ID | Need | First consumer | Panel or display | Status | Notes |
| --- | --- | --- | --- | --- | --- |
| R1 | Method gate and acting for the BE seat (divination rows, potion acting) | ch55 P001, ch57 P003 | none | queued after B1 merge | Sonnet high |
| R2 | Halfpence and exact change (exchange quotes accept mainly whole numbers (default; the dial is the quote format)) | ch56 P036 | coins and fees on screen (U4) | queued | Sonnet high; economy owners ECC25, ECX6 |
| R3, U1 | Spirit Vision switch, exhaustion and aura-reading line | ch62 P008, ch72 P047 | aura reading line | queued after B1 | overlaps B3 |
| R4, U2 | Gathering display: seat symbols, Sequence aura, illusory items | ch58 P018-P076, ch61 P046 | the existing remote-meeting render, not `gathering_panel.js` (resource gathering) | queued | UI after the mechanism; desktop 1920x1080 first |
| R5, U3 | Wire the act engine so rite, craft and summons rows are reachable from play; altar and ritual step display | ch57 P022, ch60 P067 | altar layout, four candles, step display | queued, large | first brief of its own; Opus justified only if the backlash seam in `src/harm_engine.js` must change |
| R6 | Document clearance and pathway reading | ch65 P052 | clearance level | queued | |
| R7 | Sealed Artifact 2-049 area effect | ch71 P033 | none | queued | |
| R8 | Amulet protection and potency decay | ch69 P014 | none | queued | depends on R5 |
| R9 | Services sold and referral reputation | ch55 P067, ch56 P044 | existing Reports | queued | |

Reader mismatches the probe found (checked against the text; locators in the reader output are not trusted without the paragraph): the weekly income claim at ch66 P037 is wrong; three locators are off (ch83 P011 is P084, ch75 P036 is P043-P044, the ch72 pendulum is P049-P054); the three-second hold at ch74 P069 is a requirement Lorotta states at P067, not a measured effect; the Savant gloss at ch59 P030 misreads a diary entry. My earlier locator check proved only that each locator exists, not that it points at the right paragraph.

