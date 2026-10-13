# Repaired rollback native gate

Bundle `6540b5a5701e8279f43800a89988d1cf1b24986f360560159ee2d9121ce776f2`.

F1: Actual component rejected storage restores selected native serialized owners
and displayed stats/skills. Ordinary later manual Save has no phantom output. The
actual retry makes one native attempt/receipt and the edited +20 assist reaches
the actual item quality. No new Created or Craft settled message survives rejection.

F2: Actual Iron ingot rejected storage crosses the generated near-level-10 Smelting
boundary before rejection, then restores native live/stored Smelting XP exactly
4533.19 and Springsteel recipe availability exactly zero. Inventory, logs, crafting
stats and fort state also match. However milestone tooltip still advertises the
rejected level-10 reward: `update_displayed_skill_bar` writes tooltip rewards only
when truthy and fails to clear them after rollback. Rejected level/recipe unlock
messages also remain in the log because those callbacks bypass queued craft text.

F3: An extra Crafting mastery bar after redraw is legitimate: its baseline parent
XP was already 10.6 from the previous successful component retry. It was omitted
by prior native parent-XP UI updating. Updated proof compares existing per-ID skill
text; it does not classify a now-correct bar for already-earned XP as phantom.

Root received exact source callback/clear fixes and safe rebuild boundary. Evidence
is preserved in `6540-milestone-failure/`, including before/live owner records and
stale tooltip/log assertions. No browser/driver remains. Quiet read-only server
18647/session 19261 remains for the repaired-build retry.

Harness corrections, not source defects: Python server connection resets caused
one LOADING timeout, fixed with quiet ThreadingHTTPServer backlog 128. The inherited
global save rejection stub could reject an unrelated native local-life clock save,
fixed to reject only the actual increased craft-attempt envelope and restore itself
immediately. Unrelated normal Breathing XP is excluded from selected craft-owner
comparisons. Item selectors use the actual `.recipe_item_name` class.

No whole craft pass, post-durable renderer pass, reload/import pass or technical
completion claim on this build. No shared source/helper/build changes by this worker.
