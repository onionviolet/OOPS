# Wang Er at the pit

Open the generated single-file HTML in a desktop browser. Rebuild from the repository root with `node prototypes/wang-er-duel/build.mjs`. The output defaults to `work/wang-er-duel/index.html`.

Play Fang Yuan manually by selecting a target and a move. Auto uses the existing contest chooser. Manual takes over at Fang Yuan's next choice. Switch between Text and 2D board any time. On the board, turn Animate off to compare the static view. Try to spot who is winding up and who is in punch range in each view. Restart returns to the same seeded encounter.

This uses the real Wang Er contest fixture and its authored numbers (seed 5, Moonlight Gu). The prototype starts in the fixture, with its supplies already assigned. The side-on view uses the encounter's existing one-dimensional positions. Vertical separation keeps labels readable. Board motion illustrates settled contest events, while text and board labels show pending actions. The slow playback pace leaves time to see individual exchanges. The prototype stays in memory, outside the game and its saves. It covers the desktop encounter only.

Decision check (CBD29–CBD32, CFC4/CFC6, UR91): compare how quickly each view makes reach and an incoming attack understandable. If the static board carries the decision, animation can focus on impact and movement. If players lose track during motion, keep the pending action and result readable throughout.

Browser check from the repository root: `node prototypes/wang-er-duel/check.cjs` after building. The check uses the project's headless browser helper and accepts its `YAIRPG_PLAYWRIGHT` override. It exercises the pending-cast switch, an auto-to-manual handoff, and outcome, clock, resources and log parity between views and motion settings. Screenshots are saved alongside the generated HTML.
