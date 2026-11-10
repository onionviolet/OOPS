# AI field scan, 2026-11-08: what a news roundup offers OOPS

Status: proposals only. Nothing here changes direction, a rulebook or build order.
Weibao asked (2026-11-08): "consider progress in the field of ai and more, and anything
that could be potentially useful for this program", linking an AI Search news video,
then "consider levels of usage and more, or just interesting ideas in general, such as
using the weather simulation for some grand 3d game which isnt too applicable to here
for now".

Source: [AI Search, "AI NEWS" roundup, 2026-11-08, 48 min](https://www.youtube.com/watch?v=9RIK3A24ZxA).
Read: the video description and the linked primary pages below. Not read: the
transcript (subtitle fetch hit HTTP 429), the OpenAI Images 2.6 page (HTTP 403), and
the LongCat 2.5 and Hy4 pages (empty to the fetcher). Items never opened: HairDeck,
RelayVSR, NitroFusion 2, FlowHMR, ReLift, OpenRoboKit, PJiT, ERNIE 5.5 Flash, GPT-6
Cyber, Solver, VoxLution. Page summaries came through a small fetch model; numbers
and benchmarks are vendor claims.

Levels of usage, from closest to the work to furthest:

- **L1, dev time:** agents that build, read books and playtest. Nothing ships.
- **L2, offline content:** a model runs once and its output is baked into data files.
- **L3, optional runtime:** a model runs inside the shipped game, off by default.
- **L4, interesting, not for this project now.**

## F: findings that sort everything else

- **F1. The local model is not answering today.** `localhost:11434/api/tags` gave no
  reply, `ollama` is not on PATH, and no Ollama app or model manifests were found
  (checked 2026-11-08). The October baseline (`qwen3.8:27b`, [LOCAL_AI_MODEL_CONSIDERATIONS F1](LOCAL_AI_MODEL_CONSIDERATIONS_2026-10-14.md#f1-verified-local-baseline))
  is not current evidence. Any local lane needs `python3 scripts/toolsets.py doctor --probe` first.
- **F2. Big open weights do not fit 64 GB.** Kimi K3.1 Pro is 2.8T total / 104B active
  ([card](https://huggingface.co/moonshotai/Kimi-K3.1-Pro)), Inkling 2 Small 594B / 17B
  active ([post](https://thinkingmachines.ai/news/inkling-2-small/)), Ling 3.2 Flash
  560B / 25B active ([docs](https://developer.ant-ling.com/en/docs/models/ling/#ling-32-flash)).
  Ripple 65B Preview is dense with 1M context and open weights ([page](https://www.ricursive.com/ripple));
  it is the only one plausibly local at 4-bit (inference, roughly 35 to 40 GB). License and
  MLX support are unverified.
- **F3. Runtime models collide with three standing rules.** The 8 GB older-computer
  target ([direction](../USER_VISION.md#comfortable-play-on-older-8-gb-computers-2026-11-06)),
  sealed secrets (generated NPC text can leak a sealed truth outside its route), and
  deterministic report wording (RPT rules under DSG13). That keeps L3 small.
- **F4. Images sit low already.** Portraits were judged largely unnecessary on 2026-10-14
  and visuals are prose-first (DSG5). The one open image model read, P-H3 Image, needs
  21 GB at 4-bit, excludes US use without a separate MiniMax license and requires a
  "Powered by MiniMax H3" credit ([post](https://www.pruna.ai/blog/oss-p-h3-image-launch)).
- **F5. Off-machine reading is a usage decision, not a model decision.** Any new
  provider for book reading sends source text off this Mac. Route choices stay under
  AU1-AU15 ([agent usage rules](../AGENT_USAGE_RULES.md)); the batch readers run on Haiku 5.5
  today (`scripts/lead_run/batch_lib.mjs`).

## L1: dev time

- **O1. Re-probe the local lane before trusting it (ACCOUNT FOR NOW).** See F1. The
  census lane guidelines in [LOCAL_AI_READER_TEST](LOCAL_AI_READER_TEST_2026-10-27.md) assume
  a model that may be gone.
- **O2. Ripple 65B as a local reader candidate (LATER).** Default: keep the current
  route. Condition to try: Ollama or MLX serves it, license allows local use. Haiku, S.
  Done check: license and quant source cited, one census shard from the 2026-10-27 test
  run on Ripple and on the old baseline, scored on the same sheet.
- **O3. Rehearse before acting, keep failures (ACCOUNT FOR NOW).** Hydrogen 1.0 compiles
  a lab protocol in a virtual rehearsal before running it, and keeps failed attempts as
  training material ([post](https://blog.deepprinciple.com/introducing-hydrogen-1.0/)).
  We already have the parts: `game_quote` for a dry run, `game_freeze` and saved
  scenarios (AD54), the `game_report_limit` ledger. The constraint: a playtest route that
  fails gets saved as a scenario with its failing step, not discarded.
- **O4. A fine-tuned reader on our own schema (LATER).** Inkling 2 Small is fine-tunable
  through Tinker now, with Apache 2.0 weights promised after safety testing. A reader
  tuned on accepted census rows could cut prompt size. Sonnet, L. Done check: cost per
  shard and census agreement against the Haiku batch on three held-out shards. Blocked
  by F5 until a usage decision covers it.
- **O5. Small-model looping is a known, fixable failure (ACCOUNT FOR NOW).** The
  weight-space post fixed Qwen3.5-0.8B mostly by removing a repetition loop (MATH-500
  7.9% to 48.1%) ([post](https://rikiyat.github.io/blog/weight-space-programming/)).
  For our local lanes: count token-limit hits as loop failures in the score sheet,
  separate from wrong answers.

## L2: offline content baked into data

- **O6. Climate tables calibrated offline (LATER, the strongest tie).** STRATA is a
  331.7M-parameter emulator of a storm-resolving climate model, OpenMDW license
  ([card](https://huggingface.co/nvidia/strata)). We do not need it. We need its
  pattern: run the expensive thing once, ship a cheap stand-in. `src/weather.js`,
  `src/world_climate.js` and the six-phase cycle ([BALANCE](../BALANCE.md)) already exist.
  Default: each world's weather draws from a small monthly table (rain, fog, frost,
  storm odds) taken from cited real climatology for its stand-in place and era
  (Backlund fog from late-Victorian London records, Hogwarts from Highland data), then
  bent where the lore states a number (AD49). Dial: worlds without a real stand-in keep
  the current cycle. Sonnet, M. Done check: a seeded year in one world reproduces the
  table's monthly frequencies within a stated tolerance, with the source cited in the
  content file.
- **O7. Bulk drafting pass (no change).** Already a later option in the
  [digest](../VISION_DIGEST.md). Newer models make it cheaper; the gate stays the same:
  every draft passes `npm run check:rules`, PRS1-PRS8 and a sealed-secret check.
- **O8. Illustrations (LATER, low).** Only through a deliberate illustration route under
  DSG5, with the model's license read first (F4).

## L3: optional runtime

- **O9. Paraphrase-only NPC flavour (LATER, large).** Default off. If ever built: a local
  model may restyle an authored line in a character's voice, never add facts, names or
  outcomes, and the authored line stays the saved and logged text. Reason: keeps sealed
  secrets, determinism and the 8 GB target intact (F3). Sonnet design, then a spike.
  Done check: a fuzz run of 1,000 restyled lines finds no token outside the authored
  line's fact set.
- **O10. A front and back split for a talking companion (LATER, low).** MOSS-Live runs a
  fast front model for conversation and a back model for slow tool work, sharing task
  state ([page](https://www.moss.cn/models/moss-live)). Only relevant if O9 happens.

## L4: interesting, not for this project now

- **O11. A grand 3D weather game.** A STRATA-class emulator steps the whole atmosphere in
  10-minute steps at about 4.9 km. A sailing, flight or survival game could use real
  forecast fields as its storms, so weather becomes the opponent and route planning the
  skill. Closest home: `~/code/recoverable-flight-lab`, for wind fields (fit unchecked).
  Cost: GPU inference and a 25-million-column grid, far past a browser game.
- **O12. Book page to explorable room.** LucidLyra turns one image into a queryable 3D
  Gaussian scene with object labels; code not out
  ([page](https://research.nvidia.com/labs/sil/projects/lucidlyra/)). CoLa3D splits a
  scene into separate object meshes, code open ([page](https://master-cai.github.io/CoLa3D/)).
  Together: an illustration becomes a room whose objects you can pick up.
- **O13. Animation from prose.** Möbius generates and captions human motion from text,
  0.6B and 1.7B ([page](https://jiazhishu.github.io/mobius/)). A 3D life sim could drive
  its characters from the same action text a text game prints.
- **O14. Train a small model to play the game.** ZAP taught a 27B vision-language model
  motor control in simulation only, with RL on partial-credit rewards and tool-call
  actions ([page](https://zero-real.github.io/)). The far version of our playtest
  harness: a local model trained through the game MCP's tools, rewarded by quest
  progress. DreamX learns compact action codes from video
  ([page](https://cvlab-kaist.github.io/DreamX/)), the same idea for games with no API.
- **O15. Weight-space programming as a curiosity.** An LLM read and wrote network
  weights directly: it identified which game a tiny policy learned and wrote Breakout
  weights that beat a 100M-step PPO run. Networks were tiny, and the authors say edits
  remove obstacles but do not add abilities.
- **O16. Video and voice avatars.** Gemini Omni 1.2 Flash makes 3 to 15 second clips at
  $0.07 per 720p second ([post](https://blog.google/innovation-and-ai/technology/developers-tools/introducing-gemini-omni-1-2-flash/));
  Meta's Muse adds voice avatars ([post](https://about.fb.com/news/2026/11/introducing-muse-ai-voice-expressive-avatars/)).
  A trailer, maybe; nothing for play.

## Rejected for now

- Mirage, a 22 MB vision model that returns JSON from photos
  ([post](https://cactuscompute.com/blog/mirage)), as a screenshot checker: the game MCP
  and DOM reads already give structure without guessing from pixels.
- Switching coding or reading lanes to an open frontier model on benchmark claims
  alone (F5).
