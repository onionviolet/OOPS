# Ideaboards in the World Atlas

The Ideas page scans eligible `docs/**/*.md` files. A file with at least three coded items becomes a board automatically. A smaller board needs a link from `docs/IDEA_INDEX.md` or `docs/gm/WRITEUP_REGISTER.md`. These indexes also mark a board as registered. The default reference tier includes registered boards and boards classified as `idea-board`, `considerations`, `plan`, or `backlog`. The **Show all boards** toggle includes audits, research, run outputs, rules and other files. Classification follows path and title; `BOARD_KINDS.json` holds reviewed `path -> {kind, note}` overrides.

Give each idea a stable code and a title. The parser reads these forms:

```md
| Code | Idea | Status |
|---|---|---|
| EX1 | Let a known place change after a visit | Proposal |

**EX2 · Remember a useful promise.** The player can follow it up later.

- EX3: Let a companion point to a missed clue.

### EX4 · Show the cost before choosing

EX5: Keep a small record of what changed.
```

A table idea needs a code cell and a separate title cell. A cell containing only codes, such as `W1/W2` or `S17 (C2)`, is treated as a reference. Status words are `proposal`, `sent`, `decided`, `accepted`, `built`, `retired`, `superseded`, and `working-default`. If none is stated, the atlas shows `proposal (AD32)`; it does not infer implementation from prose. Proposals stay proposals until Weibao decides under AD32.

Check a new board with `node prototypes/world-atlas/ideas.mjs search 'phrase' --family EX` (add `--all`, `--kind idea-board`, or `--json` as needed). In the Ideas page, open the board and inspect its **Residue** list for coded lines the parser could not read. Fix the source formatting rather than copying rows into a second store.
