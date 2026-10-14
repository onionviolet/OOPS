You are lane `hoi4` in the YAIRPG game research wave of 2026-10-14.
Repo: /Users/weiwei/code/yet-another-idle-rpg (main checkout, read-only for you except your output dir).
Read first: docs/gm/dispatch/game-research-wave-2026-10-14/COMMON.md (hard rules, output shape, done check). It governs this prompt.
Output dir (the only repo path you may write): `docs/research/hearts-of-iron-iv/`
Work area: `~/.codex/research/hoi4/`

## Source
Hearts of Iron IV, Steam app 394360, installed natively: `/Users/weiwei/Library/Application Support/Steam/steamapps/common/Hearts of Iron IV`. Game rules are plain-text Clausewitz script (`common/`, `events/`, `history/`, `interface/`, `documentation/` has script docs and effect/trigger lists). No decompile needed. Read DLC-gated content too; note which DLC gates it (`dlc/`, `integrated_dlc/`).

## Questions, priority order
1. **Modular campaign chains:** how national focus trees, decisions, missions, events (triggers, mean time to happen, options, hidden events), scripted effects/triggers and `on_actions` compose. Count them; describe the grammar. How does the game keep hundreds of authored chains from colliding (flags, variables, `is_triggered_only`, mutually exclusive focuses, AI weights)?
2. **Persistent modifiers:** national spirits/ideas, dynamic modifiers, advisors, traits. How timed, stacking and removal work. This maps to YAIRPG per-world adjectives and conditions.
3. **Economy and production:** factories, production lines with efficiency growth and retention, resources and trade, construction queue, supply and logistics, state buildings and slots.
4. **Research and doctrine:** tech tree grammar, ahead-of-time penalty, research bonuses, doctrine trees, equipment variants and designers, division designer and templates.
5. **Politics and AI:** ideology drift, stability and war support, balance of power, faction/alliance logic, AI strategy plans and `ai_will_do` weights.
6. **Save shape:** the plain-text save format and how DLC or mod content stays optional in saves.

## Two consumers
- **YAIRPG:** proposals for world-event chains, campaign paths, per-world modifiers, the Village/realm economy and the chain-build work (`docs/gm/dispatch/` lanes with "chain" in the name, `docs/research/ABSTRACTION_INVENTORY_2026-10-14.md`).
- **Province War** (`/Users/weiwei/code/province-war`, read-only for you): a WWII grand-strategy / Call of War style game. Read its `README.md`, `docs/audits/HOI4_UI_ADAPTATION_20260930.md` and the HOI4 rows of `docs/audits/SIMILAR_GAME_CANDIDATES_AUDIT.md` first and do not redo them. Write `PROVINCE_WAR_FIT.md` in your output dir: which HoI4 rule families (research, production, supply, divisions, air/naval, AI fronts, diplomacy) fit its packets in `docs/implementation/AUDIT_WORK_QUEUE.md`, with exact HoI4 file paths and short paraphrase. A later lane registers this in Province War.

Add digests: `CHAINS_DIGEST.md`, `ECONOMY_DIGEST.md`, `RESEARCH_DIGEST.md`.
