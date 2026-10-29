# Lane brief: MF1, mechanism-fit audit (read only): what existing systems carry the remaining book verbs, and what to build

Model: `gpt-6.1-sol`, medium. Local, `/Users/weiwei/code/yet-another-idle-rpg`. Read-only for `src/`, `tests/`, `scripts/` and packs; the only file you write is `cast-lives-lanes/MF1_AUDIT.md` (counts and generic words only; no canon
names or book text; sealed secrets by id only). Do not commit; never stash, reset, force or push. Rules: AD38 (things work by how they work: model mechanisms, not allowed-outcome lists), AD1-AD45 as relevant,
`.claude/rules/runtime-code.md` AR1-AR16, MD1-MD3, MR1-MR36 for making systems, WPR and SR rules where a pass touches worlds/sites. Read first: [X4_CHECKPOINT](X4_CHECKPOINT.md) (family table and mechanism fit),
[RV2](RV2_CHECKPOINT.md), [RV4](RV4_CHECKPOINT.md), [RV6](RV6_CHECKPOINT.md) when it exists, [H2_CHECKPOINT](H2_CHECKPOINT.md), [LEAD_LIFE_SYSTEMS_DESIGN](../LEAD_LIFE_SYSTEMS_DESIGN.md), `docs/MAKING_RULES.md`,
`docs/LIFE_SIM_NORTH_STAR.md`, and the reviewed-rows gap reasons (private `reviewed-rows-2026-10-29/*.jsonl`, `gapReason`/`paraphrase`).

## Question

Weibao asked how to adapt the book's remaining verbs to the game's systems: a crafting system, upgrading the brewing system, new divination systems, "and more for the future". For each family the replay still cannot
carry (divination or ritual 232 steps, use an ability 160, fight or evade 161, make or write 366, trade or pay 165, exchange a message 175, reason or plan 832, direct another actor 127, obtain or learn information 104,
agree or refuse 311, change or maintain state 284, rest and care, speak or ask 1,144 beyond topic rows, plus any family the reviewed gap reasons add):

1. What existing system could carry it by the mechanisms already in play (the Lord of the Mysteries host files `src/book_world_lotm_brew.js`, `_pathways.js`, `_ritual.js`, the `craft_*` modules, native dialogue, trade, combat, knowledge, relationships, work, law,
   needs, `place_acts` operations, topic talk, journeys, G1 waits)? Cite file and function and what it already does; test its actual depth by reading, not by its name.
2. What would need a deeper upgrade (name the system, the missing mechanism, and a default/dial/reason framing, no hard "never/only"), and what is genuinely new (for example a divination mechanism: means, cost, result, who learns what,
   uncertainty and misreading), including how it generalizes to other worlds (palette, not spec).
3. For each, the smallest first slice that moves replay fidelity, an estimated step count unlocked (from the census), the owner files, the lane model (Luna rows/data vs Sol src), conflicts with other lanes, and a Codex usage estimate in points
   of the weekly window (use 0.25 per small Luna lane and 0.5-1 per Sol src lane as the measured scale tonight; state your uncertainty).
4. A ranked build order of at most 8 lanes with disjoint grants, each described in a short lane brief paragraph the coordinator can expand, plus a short list of future-proofing suggestions (kept separate from required work, per AGENTS "more to consider").
Write counts, file paths and generic mechanism names only. Do not edit any other file. One line per check you ran (greps/reads).
