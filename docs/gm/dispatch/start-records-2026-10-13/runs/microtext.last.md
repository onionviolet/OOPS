Updated six fragments in [start_layers_frontier.js](/Users/weiwei/.codex/worktrees/start-records/yet-another-idle-rpg/src/data/start_layers_frontier.js). Money, items, location, quest, exclusions and pocket lines are unchanged. MD233–MD234 remain outside the permitted file scope. Tests needed no text updates.

`node build.js` passed. `check_microtext.sh` exited **0**:

```text
PASS microtext_gate_integrity
PASS pockets_gate_integrity
PASS gate_integrity
PASS build
PASS npm_test # pass 667 # fail 0
PASS unit_file
PASS G1–G7
PASS P1–P5
PASS T1_length_budget []
PASS T2_no_em_dashes []
PASS T3_layer_fragments_short []
PASS T4_no_repeated_openers []
PASS T5_money_text_honest []
```

Port 18341 is free again. Gates were untouched; no staging, commits or pushes.

| Fragment | Before | After |
|---|---|---|
| F1: `entry/vanilla` | You wake in a village with no memory of how you arrived. The elder may know what happened. | A cloth seam presses against your skin as you wake in a village with no memory of how you arrived, where the elder may know what happened. |
| F2: `background/farmhand` | Your hands remember the weight of a harvest basket. A few coins remain in your pocket. | Your hands settle an imagined harvest basket by habit, and three more coins remain in your pocket. |
| F3: `background/runaway` | You remember leaving in a hurry, with one coin tucked into your sleeve. | One more coin is tucked into the seam of your sleeve. |
| F4: `background/scholars-child` | You remember a parent reading by lamplight. Four coins are tied in a corner of your coat. | Ink sits beneath a fingernail, and four more coins are tied in the corner of your coat. |
| F5: `possessions/packed-bread` | A small parcel holds two more pieces of bread. | Crumbs cling to a folded parcel holding two additional pieces of bread. |
| F6: `possessions/family-keepsake` | A little purse from home still holds two coins. | A little purse with a worn fastening holds two more coins. |