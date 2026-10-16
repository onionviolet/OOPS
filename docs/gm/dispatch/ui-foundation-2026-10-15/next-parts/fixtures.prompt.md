Lane `fixtures`, code prefix FX. Read next-parts/COMMON.md in docs/gm/dispatch/ui-foundation-2026-10-15/ first and obey it.

Task: subtle-detail fixture matrix for Parts 1–6.
- Turn UX13–UX22, V17–V21, R1–R6 and W1–W6 into concrete test states per Part (e.g. empty category vs
  no-match search vs unknown; selected row filtered out; 1/3/5/8/9 identical and 8 mixed opponents at 21px;
  effect with unknown duration; nonhuman body slots; menu open during a tick; import replacing state).
- For each state: which existing fixture or check library covers it (r12-lib.cjs, r11-lib.cjs, check-r14-*.cjs,
  tests/ dirs; cite file:line), what is missing, and whether native game data can produce it at all
  (if not, the state is dropped or marked as needing content, per W2).
- Propose each Part's done check as a short list built from these states, replacing vaguer done text.
Effort: medium. Done: next-parts/fixtures.md with the matrix and the COMMON sections.
