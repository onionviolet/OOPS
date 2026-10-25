# C5 Git inventory, 2026-10-25

Bounded read-only snapshot from `/Users/weiwei/code/yet-another-idle-rpg`. Pinned master `3dfc49cf3422c0262d86810df47459f53f3a4a67`; primary HEAD `3dfc49cf3422c0262d86810df47459f53f3a4a67`. Captured from one worktree/ref listing; concurrent lanes may add or change registrations after this point. No Git state or worktree content was changed. No sealed file contents are reproduced.

Rule basis: AD32, AD36, AD41 and AU1–AU15, plus the shared-worktree procedure and 2026-10-25 lane common rules.

## Method and exact commands

Commands: `git rev-parse master`; `git rev-parse HEAD`; `git worktree list --porcelain`; `git status --short --ignored`; `git for-each-ref --format=%(refname:short)|%(objectname)|%(symref) refs/heads refs/remotes`; for each present checkout, `git -C <path> status --porcelain=v1 --untracked-files=normal --ignored=matching`; for each worktree HEAD and ref, `git merge-base --is-ancestor <ref> <pinned-master-oid>` and `git rev-list --left-right --count <pinned-master-oid>...<ref>`; `lsof -n -P -Fpcn -d cwd`, filtered to exact worktree path or descendants. Only lsof PID and cwd fields were consumed, never process arguments or prompts.

Status counts use `--untracked-files=normal`: a directory may count as one untracked entry, so counts are porcelain entries rather than expanded descendant-file totals. Tracked changes are entries other than `??` and `!!`; ignored entries are `!!` under `--ignored=matching`. Ahead/behind is relative to the pinned master OID. Safe retirement requires an ancestor HEAD, zero tracked/untracked/ignored residue and no cwd process.

## Registered worktrees

| Registered path | Exact branch ref | Directory / lock | HEAD / ancestor | Behind, ahead | Tracked | Untracked | Ignored | cwd PIDs |
|---|---|---|---|---:|---:|---:|---:|---|
| `/Users/weiwei/code/yet-another-idle-rpg` | `refs/heads/master` | present | `3dfc49cf3422`; true | 0, 0 | 141 | 756 | 2166 | `554,557,2655,2657,3371,3373,4475,4477,13239,13240,13270,13389,13390,13408,13507,13508,13526,13567,13568,13585,13657,13658,13679,14201,14419,14938,21846,22206,23155,23229,23230,23245,23248,24616,24617,24625,24649,24699,24918,24919,24936,26111,28464,35390,35617,35728,35729,35751,35814,35815,35835,36949,37041,37400,37401,37402,37403,37405,37406,37408,37409,37463,40166,40944,40947,40972,40974,40976,40977,41003,41090,41454,43658,43659,43687,43689,51683,54880,54881,54908,54936,55650,59502,59538,59642,59775,59778,59786,59788,61380,65137,65252,65253,65268,65298,65299,65338,66262,66263,66289,66292,66294,66295,66296,66297,66299,66300,66302,66363,69236,73793,73794,73795,73796,73797,73798,73799,73803,73807,75670,75672,76478,76479,76480,76481,76482,76483,76489,76491,76499,77089,79729,79948,80025,82650,82651,82652,85236,85237,85252,87173,87175,87177,91022,95047` |
| `/Users/weiwei/.codex/worktrees/agentic/yet-another-idle-rpg` | `refs/heads/codex/agentic-2026-10-25` | present | `3dfc49cf3422`; true | 0, 0 | 0 | 0 | 1 | `none` |
| `/Users/weiwei/.codex/worktrees/cheats/yet-another-idle-rpg` | `refs/heads/codex/cheats-2026-10-25` | present | `3dfc49cf3422`; true | 0, 0 | 0 | 0 | 1 | `none` |
| `/Users/weiwei/.codex/worktrees/engine-modularity/yet-another-idle-rpg` | `refs/heads/codex/engine-modularity-2026-10-25` | present | `3dfc49cf3422`; true | 0, 0 | 0 | 0 | 1 | `none` |
| `/Users/weiwei/.codex/worktrees/game-mcp-play/yet-another-idle-rpg` | `refs/heads/codex/game-mcp-play-2026-10-25` | present | `5a2ed4c9e3f3`; false | 1, 2 | 5 | 1 | 1 | `40155,40650,40651,40652,40655,40656,40658,40742,41397,57987,58050,58069,58270,58303,58818,59385,59418,59510,59526,59530,59591,59593,59613,59654,59660,59699,59753,59787` |
| `/Users/weiwei/.codex/worktrees/hp-world/yet-another-idle-rpg` | `refs/heads/codex/hp-world-2026-10-25` | present; locked initializing | `3dfc49cf3422`; true | 0, 0 | 16718 | 28 | 57 | `59504` |
| `/Users/weiwei/.codex/worktrees/lean-tests/yet-another-idle-rpg` | `refs/heads/codex/lean-tests-2026-10-25` | present | `9b997ea60a7e`; true | 1, 0 | 0 | 1 | 1 | `40162,40772,40773,40774,40775,40776,40777,40802,41470,49168,49171,49197,52719,52921,53303` |
| `/Users/weiwei/.codex/worktrees/lotm-q3/yet-another-idle-rpg` | `refs/heads/codex/lotm-q3-2026-10-25` | present | `99d3a202bbcb`; false | 1, 3 | 5 | 1 | 1 | `40152,40330,40331,40332,40333,40334,40335,40376,41393,47310` |
| `/Users/weiwei/.codex/worktrees/playtest-fixes/yet-another-idle-rpg` | `refs/heads/codex/playtest-fixes-2026-10-25` | present | `9b997ea60a7e`; true | 1, 0 | 11 | 5 | 1 | `40158,40678,40680,40681,40682,40683,40685,40834,41430,50098,50119,57785,57882,57916,57927,58209` |
| `/Users/weiwei/.codex/worktrees/ui-detail/yet-another-idle-rpg` | `refs/heads/codex/ui-detail-2026-10-25` | present | `3dfc49cf3422`; true | 0, 0 | 0 | 0 | 1 | `none` |
| `/Users/weiwei/code/yet-another-idle-rpg/.claude/worktrees/blissful-greider-a005bd` | `refs/heads/claude/gtl10-overflow-pilot-49f9f4` | present | `547209e82c29`; true | 28, 0 | 0 | 0 | 2 | `65298,65299` |
| `/Users/weiwei/code/yet-another-idle-rpg/.claude/worktrees/modest-wescoff-80952c` | `refs/heads/claude/d1-gate-deps-7a78e1` | present | `547209e82c29`; true | 28, 0 | 0 | 0 | 2 | `65252,65253` |
| `/Users/weiwei/code/yet-another-idle-rpg/.claude/worktrees/nostalgic-mendeleev-5a565c` | `refs/heads/claude/ability-engine-4c5ccb` | present | `062aa98a227d`; true | 32, 0 | 0 | 0 | 2 | `13567,13568` |
| `/Users/weiwei/code/yet-another-idle-rpg/.claude/worktrees/sleepy-wing-82bb46` | `refs/heads/claude/desktop-interaction-closure-2e51ef` | present | `547209e82c29`; true | 28, 0 | 0 | 0 | 2 | `13389,13390` |

The primary checkout has active cwd processes plus extensive dirty, untracked and ignored residue. Codex and Claude lane checkouts with PIDs remain in use. `ui-detail` has no cwd PID in this sample, but has ignored residue; it is not safe to retire. No present checkout passes the safe-retirement gate because all have ignored entries.

### Primary ignored residue classes

`--ignored=matching` reports 2166 ignored porcelain entries in the primary checkout; directory matches are not expanded into every file. Broad classes seen:
- other ignored docs artifacts: 2039
- docs/research private/local source material: 94
- docs/reviews local logs/evidence: 17
- other local/build/cache artifacts: 8
- Python bytecode caches: 3
- Claude launch registry: 1
- node_modules: 1
- private packs: 1
- private fonts: 1
- workers data: 1

## Branch state interpretation

Refs whose tips are ancestors of pinned master are historical/preserved refs with no pending landing by ancestry alone. Older families include `absorb-all/*`, `absorb/*`, `claude/*`, `core/*`, `gen/*`, `integrate/*`, `kit/*`, `proc/*`, `r15-*`, `slice/*`, `ui-*`, `ui/*`, `w1-campaign`, `worktree-agent-*`, and `worktree-closure-*`. Exact mapping from a historical branch to an owner is unknown from Git inventory alone.

`codex/game-mcp-play-2026-10-25` is two commits ahead and `codex/lotm-q3-2026-10-25` is three commits ahead of master on active lanes; landing waits for their lane gates and coordinator review. `codex/preserved-primary-before-master-2026-10-21` is a one-commit-ahead, 88-behind recovery ref with unknown intended use; it is not classified as pending landing. `origin/ghpages` and `upstream/ghpages` are publishing refs separate from application-master integration. New Codex lane refs currently at master remain in progress; Git ancestry does not establish finished status. Branches remain untouched.

## Branch appendix (machine-readable TSV)

One row per non-symbolic local or remote ref. Exact branch name and object ID are included. `ancestor_of_master` means the tip is an ancestor of pinned master. `behind` and `ahead` are `git rev-list --left-right --count <pinned-master>...<ref>`.

```tsv
ref	scope	object_id	ancestor_of_master	behind	ahead
absorb-all/air-wider	local	83f8384062094b88a1721b6884f450d5e92195b3	yes	741	0
absorb-all/fork-fort	local	892beb4f56c86cb5901175a98fceb96a7334fdd7	yes	743	0
absorb-all/fork-resurvey	local	733f0b2c26ccda217182df131856f4ccb66d4936	yes	742	0
absorb-all/integration	local	d4bcb1b89736ed1a71843e7e35fd09f30209fd08	yes	304	0
absorb-all/p23-combat-options	local	d4fcc35a38a805845b32412a68fe1375319f5422	yes	743	0
absorb-all/p23-encounter-profiles	local	110b4ccb6230ad1b688410833692ca07e6385a19	yes	743	0
absorb-all/p23-exposure	local	5ba2ec4f65fc75958759b35480a919b27f09295b	yes	742	0
absorb-all/p23-field-familiarity	local	7b3b7249c01c441ef180879e29f2e433a9e56a79	yes	742	0
absorb-all/p23-growth-profile	local	3fb645a3d45be528f51564f2d9e4e055c71513aa	yes	743	0
absorb-all/p23-host-joins	local	30cea72852ab2ab0aed626580cda0853ba1b8c24	yes	466	0
absorb-all/p23-household	local	f53cdfbf928e65444964244226c3bff2bfb7e5cb	yes	743	0
absorb-all/p23-known-detail	local	b30fd87f39b4cab1392c76e9666041ce0c34328f	yes	743	0
absorb-all/p23-leisure-memory	local	4f8a035671bc6d758a1b463acc6f3b73ab5aa0b4	yes	742	0
absorb-all/p23-life-loops	local	090fcb0d8807283a8dd652c845a3db0a8f56fc24	yes	743	0
absorb-all/p23-living-gear	local	7a739fc79acf800094f739c2d5bcbf176e23c3b6	yes	741	0
absorb-all/p23-long-life	local	3c0fdb97f313fbc9ce36f710e05dd250acadca8e	yes	742	0
absorb-all/p23-market-life	local	6adb34c0a329852fb656dffb240e65fa9074f779	yes	743	0
absorb-all/p23-repeat-search	local	e4679325644b3a385c95dd68ca6fdb2ca4dcfaa0	yes	742	0
absorb-all/p23-reread	local	c0fae23da16c4bf0e8daf7e8afab96289b53731c	yes	742	0
absorb-all/p23-reveal-chain	local	1cf32c0f9832a0a343d50b7930ed9c087e756c56	yes	743	0
absorb-all/p23-salvage	local	58afaf185b0a06c5fafd3fa0cb9a23f6992fb24f	yes	743	0
absorb-all/p23-save-time-options	local	7ab1c66ea3f9773242ca337b4039469a95a54515	yes	743	0
absorb-all/p23-ui-polish	local	6cca47b71893b8d86551867d74882be4a78d337a	yes	743	0
absorb-all/p23-world-adaptation	local	b73a1ba3be81f199938fb47a5445dfbfc4fa44e6	yes	743	0
absorb-all/reach-fixes	local	d208523bacfef82bacf87404ffb0d7113408fc51	yes	511	0
absorb-all/sim-stepper	local	78749564ccb1c36a440da98bd68c4e5d03e9ea3d	yes	577	0
absorb-all/stepper-perf	local	1fc4cc32798285a4e416d43ee3311d3696a188ca	yes	405	0
absorb-all/upstream-dev	local	2dd47f05f9ccddcddbf00084fed922bdcf7830c7	yes	743	0
absorb/air-a5-native-audit	local	219270e4d20ab0b3fbf92166f43bb5335629d19e	yes	775	0
absorb/air-minigame-management	local	219270e4d20ab0b3fbf92166f43bb5335629d19e	yes	775	0
absorb/air-structured-packs	local	219270e4d20ab0b3fbf92166f43bb5335629d19e	yes	775	0
absorb/air-systems-cheats-completion	local	f60638d1176f860c271032b6227cada7e0bee8c0	yes	739	0
claude/ability-engine-4c5ccb	local	062aa98a227d78d4fcb0941d58af4c85dd288884	yes	32	0
claude/admiring-perlman-6ce62b	local	43d2e0c8b80e5e32455ef16f64beeab56e6e95f8	yes	123	0
claude/d1-gate-deps-7a78e1	local	547209e82c29e897e6b602a4ef5d8e8ab46b3ebf	yes	28	0
claude/d3-overflow-pilot-9433a4	local	547209e82c29e897e6b602a4ef5d8e8ab46b3ebf	yes	28	0
claude/desktop-interaction-closure-2e51ef	local	547209e82c29e897e6b602a4ef5d8e8ab46b3ebf	yes	28	0
claude/elated-bhaskara-f9178d	local	b12f5161af7c8996d34229a29a9a41d0fbe8b575	yes	559	0
claude/engine-a1-a2-native-5dda5c	local	e063b16ee7d2e48e335af52d8ad4d8b746f725ad	yes	117	0
claude/engine-perf-core-5a93e1	local	951792bac514b0ca13cedc19c55f9d1d6a771136	yes	415	0
claude/engine-perf-d1	local	96aad3dff7f74d4aa7d63cb7bca0960a35539bc1	yes	413	0
claude/engine-perf-gate-853189	local	6ec2baa84dd986befc6ccc44d2a460d86dd417aa	yes	524	0
claude/engine-perf-harness-7fa4db	local	d8fb43a377814ba55d660b6a094e5350371dd74d	yes	417	0
claude/engine-perf-layout-4d6570	local	eca2ca23891a4cea3edd32563929f87c9956955d	yes	415	0
claude/engine-perf-scaling-afdada	local	c3a9369d09f4c3969ea31ba0d89ffaae2d8da33f	yes	417	0
claude/family-habits-3f2101	local	513738c1399b6c24cccf068b597f6e5d68b61cd8	yes	32	0
claude/features-and-fixes-f490c6	local	914e8d5799a50403c6e27472a2bf86a60ff5ac2b	yes	130	0
claude/fix-f1-sequence-426668	local	9062f6579140b06983b415dabe74da27b9a5ac86	yes	373	0
claude/gear-affixes-l3-add84f	local	d87b9f8a33553d545b6def123cfaf4c699f976a3	yes	104	0
claude/gtl10-overflow-pilot-49f9f4	local	547209e82c29e897e6b602a4ef5d8e8ab46b3ebf	yes	28	0
claude/integration-o-f-a-2026-10-23	local	e3c50c0c314cc0415a4316ff9eac4918668e0f44	yes	14	0
claude/interesting-ritchie-0389d6	local	a92deb672e09c30310856bd6d043aa669b0351f6	yes	104	0
claude/lotm-pathways-2e8786	local	4f060ef3853c0959fdc49dfabad2282a68adf6ad	yes	19	0
claude/p1-baseline-92e0aa	local	e716f6ee559d2ac026050c077ee80acda0a3c5fc	yes	114	0
claude/p2-pack-loader-0a3cd2	local	8e49690e97ce757573fa9f87db3f7412c0b9224e	yes	112	0
claude/p2-pack-loader-50a210	local	f88ce6ab978e16cadd2300f502ced88ea6d753a9	yes	114	0
claude/paradise-chart-fix	local	547209e82c29e897e6b602a4ef5d8e8ab46b3ebf	yes	28	0
claude/party-cargo-stock-161ca8	local	a2952f78401d89d30c9310958f616c804f8ba495	yes	32	0
claude/qud-g1-reference-123844	local	d8af620f2bc1e5aa589eabf2e0b0328206ba01e7	yes	33	0
claude/qud-g2-rank-4363ba	local	d8af620f2bc1e5aa589eabf2e0b0328206ba01e7	yes	33	0
claude/qud-g3-fetch-6ccc86	local	d8af620f2bc1e5aa589eabf2e0b0328206ba01e7	yes	33	0
claude/qud-g4-implants-cb17f7	local	d8af620f2bc1e5aa589eabf2e0b0328206ba01e7	yes	33	0
claude/qud-g5-history-57e13f	local	d8af620f2bc1e5aa589eabf2e0b0328206ba01e7	yes	33	0
claude/qud-g6-naming-69da15	local	d8af620f2bc1e5aa589eabf2e0b0328206ba01e7	yes	33	0
claude/qud-g7-fields-66ba3f	local	d8af620f2bc1e5aa589eabf2e0b0328206ba01e7	yes	33	0
claude/qud-integration-c0781f	local	547209e82c29e897e6b602a4ef5d8e8ab46b3ebf	yes	28	0
claude/salvage-spatial-pacing-879697	local	18ba1d72880089632623aafdff9737434e08aca9	yes	30	0
claude/tools-ip1-3-8c989c	local	98192d5692efbe1fb79e8fbe2ff3b72858ff8e7c	yes	193	0
claude/trusting-hamilton-9e04c1	local	fb8b87574acc1c028aa134e3649a4a1e5603d0b6	yes	104	0
claude/ui-a1-a2-integration-dcbeef	local	8a21e6a798243493de01d953185b4f4621963f2c	yes	115	0
claude/ui-r20-opponent-board-be97bc	local	71a74be07211fabfd93711c80cad05e2c764e688	yes	233	0
claude/ui-r21-layout-edit	local	a44e0a809538dbf8219cf7f1da3cc9efdceee79b	yes	226	0
claude/ui-r21b-retire-selector	local	dbf1b3ce50bfdda87af653d14fe785c156dd938b	yes	218	0
claude/ui-r21c-status-window-home	local	42f39b7cee393d9d4f896e143a7a1c484e63b229	yes	216	0
claude/ui-r22-combat-log	local	2cbdbdaea7f4f3055a9c9464cd08544e16e15d1f	yes	214	0
claude/ui-r22b-screen-use	local	8d9d02adb56d8026765587c1c197954255f13cfe	yes	186	0
claude/wave-a-loop-53c42e	local	df259bda28efbc015315764179727efdf33deb97	yes	401	0
claude/wave-b-state-f96892	local	439bf0593f8918641ebb9bd426419840cd1347a2	yes	399	0
claude/wave-c-headless-0f7b1d	local	e942ff902039f165354911fbcac844f15a40666c	yes	403	0
claude/wave-d-simfuzz-b76281	local	b8045d2778731a66d8a44b242c08d77d5c9e2c1f	yes	400	0
claude/wave-e-replay-37566f	local	ead6735f215b4ccf6d35d6075395cd3e3e003345	yes	403	0
claude/wave-f-checks-4616ad	local	89f5c760fee340d9a69088f3d21f1da937717e23	yes	403	0
claude/wave-g-render-887951	local	451f3297e1e13103e96cba924dff5b48459bf388	yes	402	0
claude/wave-h-startup-67e16e	local	35201e4d475594b1e5630eeee19ef476e2fb0e9d	yes	403	0
claude/wave-i-combat-d8c88a	local	f76904f4da3b371d670554862385ae12167b6672	yes	402	0
claude/weakling-description-27e8a2	local	05d5b88307bb88d6e6cf1d2dd0707b4440e7af9f	yes	32	0
claude/world-pack-loader-9cff81	local	37fe99eaa1ac783c1e51bdd47fbe01d0ff4c0a91	yes	251	0
codex/agentic-2026-10-25	local	3dfc49cf3422c0262d86810df47459f53f3a4a67	yes	0	0
codex/cheats-2026-10-25	local	3dfc49cf3422c0262d86810df47459f53f3a4a67	yes	0	0
codex/desktop-quote-refresh-20261022	local	629254f307bfd6489ff1275649918d474ba74096	yes	39	0
codex/engine-combat-projection	local	576f2e97c1a15317236eae28149448d80895f5b8	yes	232	0
codex/engine-modularity-2026-10-25	local	3dfc49cf3422c0262d86810df47459f53f3a4a67	yes	0	0
codex/game-mcp-play-2026-10-25	local	5a2ed4c9e3f302970d5a19f4e9b1fd35507d7f13	no	1	2
codex/gameplay-foundations	local	b0af7db5bd21770ca603fdf1e7b865b376f46857	yes	88	0
codex/gear-shared-example	local	2ddfdbc2665002b97b6cc61de2115920e804e248	yes	90	0
codex/hp-world-2026-10-25	local	3dfc49cf3422c0262d86810df47459f53f3a4a67	yes	0	0
codex/invention-planner	local	144ed1a0ca8312bc336a57ae716c57b4877d60b6	yes	739	0
codex/invention-planner-qa	local	400d6a836a53ce4d2e5a5295e90ee575aa58f8bd	yes	738	0
codex/inventory-overhaul-20261021	local	e59df9a285dfb157c6b38c46c4ee9fd6a54692f9	yes	61	0
codex/lean-tests-2026-10-25	local	9b997ea60a7eb12200dbc825684e6668403aa015	yes	1	0
codex/lotm-q3-2026-10-25	local	99d3a202bbcb6821cad3e15db0f586250f84ca9c	no	1	3
codex/modular-seams	local	163d9a818f6ef77dc53a03d8ec2eda89fb9da7e9	yes	237	0
codex/playtest-fixes-2026-10-25	local	9b997ea60a7eb12200dbc825684e6668403aa015	yes	1	0
codex/pre-v06-checkpoint	local	62f100f9975e856517b623c9ba6c568b6d143aac	yes	909	0
codex/preserved-primary-before-master-2026-10-21	local	b81a86de745c5c8a04f11d5278b6b62b79c3c1c0	no	88	1
codex/review-ready-20261022	local	b6e9332dcb5095dcc853e8b86c5e6a14b37a9f7c	yes	41	0
codex/tool-registry-2026-10-21	local	5249b64cebca8bfcc2d7bf2f3bda86a3553f3eee	yes	92	0
codex/ui-detail-2026-10-25	local	3dfc49cf3422c0262d86810df47459f53f3a4a67	yes	0	0
codex/ui-r18-inventory-tabs	local	d791e5d16ad13cfc3d68b9161751ce4cf8ca7ab7	yes	233	0
codex/v06-foundation	local	43adf6f96a22c4bc9be8384ac4a016a98571d38a	yes	856	0
codex/v06-migration	local	43adf6f96a22c4bc9be8384ac4a016a98571d38a	yes	856	0
core/a2-tags	local	d666e20fbe8906170eeb782a1564c74ac47f6ab4	yes	735	0
core/a3-travel-tests	local	030c476bbcc33e1cf42b40804cedae3a1c71092b	yes	735	0
core/a5-determinism	local	6fbc31934350be6178cf1c6a4ff22fddfa8b4412	yes	735	0
gen/g1-kit	local	adaa4e181b6a0c172837f9bf433267ab3e7b6cfc	yes	731	0
integrate/cb-t3	local	9c4602a9e36975564f59935f77a65976ba5b5329	yes	527	0
integrate/p01	local	838f805250f5d93622ae82c9c45543d817ce9050	yes	349	0
kit/w28-world-climate	local	024d4da98268cd04b7d534e796d94c97bb6f6837	yes	618	0
kit/w36-calendar-climate	local	45c75e9cd2fd8e792756599a5ee50dfbc78d1dd8	yes	615	0
kit/w36-integrate	local	51b045e01315169caf91eb492526b814869dbbd2	yes	560	0
master	local	3dfc49cf3422c0262d86810df47459f53f3a4a67	yes	0	0
proc/cb-t2-inspector	local	da1ced88de85364df8bc963a0e65480989437fd4	yes	541	0
proc/cb-t3-rules	local	879eb4d4b6eb4e11fa693e9fe785150e80f3aa50	yes	536	0
proc/gx5-appearances	local	cb98f67fb0cc5bee0b8673c169eca8707c517b62	yes	700	0
proc/hv1-carcass	local	dbf266c7cbdc0117344951c5b1ae5cb7966a0e95	yes	583	0
proc/p1-streams	local	7b787fdddc72c3d6a5f6fabba0bbe643e98ea576	yes	751	0
proc/p2-mixing	local	f8fe699487c90ec06e83bfc020dfa8a6dc234705	yes	751	0
proc/p3-storylets	local	4e444a5e19c0ba5815ef2a7bc03886305479081d	yes	751	0
proc/p34-story-spine	local	f9a95e6aafdcff4308a3c75c5a24a77cbd4d3dea	yes	725	0
proc/p4-people	local	09403f5c948e072444d29dc41fde15caac23286a	yes	751	0
proc/r3-merge	local	ad11f8ababc7c8fe7efa1fa92d9980ab2e502c78	yes	607	0
proc/wave1-integration	local	ff24c75f17410cda78578c8fe19a810c856aa227	yes	721	0
r15-g10-remaining	local	df21cd50da7692655a32916ca1ce30caa99756aa	yes	763	0
r15-g9-world1	local	cf04734c2662bf83d3f784f819f79aefbdd12ebc	yes	770	0
slice/p01-mixing-feedback	local	77c0851a63fc6e773fc1e8c6725514f3e542da8a	yes	519	0
ui-modular-2026-10-22	local	e59df9a285dfb157c6b38c46c4ee9fd6a54692f9	yes	61	0
ui/cheats-r1	local	6ddf720f1cc3850636d2938bbdec45b3f9d82ef5	yes	642	0
w1-campaign	local	bc999ea491fe4f7e3f77a2dc5facdd4583f49c1b	yes	742	0
worktree-agent-a09658bcd5ecc072d	local	643b7f1b9479071a5a14cfeb8466346418790c7c	yes	808	0
worktree-agent-a31a7ac7607bfd391	local	ce76f3cca27c0a0bf98a30447775917643e7b0d7	yes	776	0
worktree-agent-a355d67700960c941	local	08cb69514e8bd281d71d5ce87efae521a01b6be8	yes	35	0
worktree-agent-a69210d5dc7a62447	local	5fca93d94bcaf6fa919ff30aa527aafaf0d31995	yes	808	0
worktree-agent-a98ba83b128c9a0c3	local	0810bdf9e9df5605dcbc4228396f9fba69bc3aa7	yes	808	0
worktree-agent-aa1b92c2c914395de	local	08cb69514e8bd281d71d5ce87efae521a01b6be8	yes	35	0
worktree-agent-ab32482a518df251b	local	3dcfe7ba58bf128d65c44c7694ad4e9665ceca07	yes	807	0
worktree-agent-ac52ddffa4e1deb75	local	11c0640ae4488b92aae37520b74295496f38974e	yes	142	0
worktree-agent-ad82f23d94f196fae	local	943bfca548a1ee5c44651668d27068a65858dc7a	yes	776	0
worktree-agent-aedda304f5f9605f0	local	a3cac4aabe62fe6d87a54be881327e847b28b204	yes	776	0
worktree-closure-combined-h1h2	local	08cb69514e8bd281d71d5ce87efae521a01b6be8	yes	35	0
origin/claude/world-pack-loader-9cff81	remote	37fe99eaa1ac783c1e51bdd47fbe01d0ff4c0a91	yes	251	0
origin/codex/gameplay-foundations	remote	8dc3ce117484e019c6ce4b6a0711493d05643898	yes	93	0
origin/codex/gear-shared-example	remote	2ddfdbc2665002b97b6cc61de2115920e804e248	yes	90	0
origin/codex/tool-registry-2026-10-21	remote	5249b64cebca8bfcc2d7bf2f3bda86a3553f3eee	yes	92	0
origin/ghpages	remote	fc047803a3f6e1c9a032cce1fc407bfd1c906fc7	no	910	51
origin/master	remote	3dfc49cf3422c0262d86810df47459f53f3a4a67	yes	0	0
upstream/ghpages	remote	fc047803a3f6e1c9a032cce1fc407bfd1c906fc7	no	910	51
upstream/master	remote	e3356432ad5112f30842cfe6a6b5c3a4ced77de9	yes	910	0
```

## Coverage and done check

Covered 14 registered worktree entries (14 present, 0 missing) and 157 non-symbolic local/remote refs. Each entry includes directory/lock state, exact ref, HEAD ancestry, tracked/untracked/ignored residue and cwd PID evidence. Each branch has exact name, scope, OID, ancestry and ahead/behind. Snapshot can age immediately because other agents are active; refresh before any later retirement or merge decision. No changes, merges, cleanup or deletes were performed.
