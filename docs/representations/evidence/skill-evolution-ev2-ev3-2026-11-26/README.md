# Village skill evolution, 2026-11-26

[Browser proof](proof.json) for the rebuilt game at `/` in fresh browser contexts at 1920×1080 and 1366×768. Each import used a separate fresh context. The proof records the bundle and setup fixture hashes, the game clock and XP while the offer was waiting, and the chosen identities after the save round trips.

| Check | Desktop | Laptop |
| --- | --- | --- |
| Stone skin becomes Iron skin with the existing YAIR report | [1920×1080](tier-1920.png) | [1366×768](tier-1366.png) |
| Growth offers Tempered skin and Breathing skin while combat continues | [1920×1080](form-waiting-1920.png) | [1366×768](form-waiting-1366.png) |
| Breathing skin restores stamina on a landed hit | [1920×1080](form-in-fight-1920.png) | [1366×768](form-in-fight-1366.png) |
| Sleeping offers two Uncommon upgrades in Growth | [1920×1080](grade-offer-1920.png) | [1366×768](grade-offer-1366.png) |
| Restorative sleep takes over the level 2 skill row | [1920×1080](grade-chosen-1920.png) | [1366×768](grade-chosen-1366.png) |

The combat setup started one XP below the YAIR tier boundary with Infested field available and no armor. Play advanced through native travel and attacks. The sleeping setup used a revision 1 A2 save with an earned Weightlifting specialization, Sleeping just below level 2, and the Shack available. Native load preserved that specialization and its XP. The ordinary Sleep action opened the grade offer.

The Growth report opened the Skills queue. The old skill's level and XP carried to its replacement at selection. Both replacements passed Save, reload, Export and Import at both sizes. The captures had zero horizontal overflow and the runs had zero page errors.
