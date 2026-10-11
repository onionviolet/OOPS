# Tale of Immortal acquisition checkpoint

Tale of Immortal has no installed manifest or source snapshot. Steam reports “Invalid install path” after an explicit NotProton compatibility mapping was already set. Repeating that setting is not an evidence-backed fix.

F1. The local Neutron parser returns exactly `ROOT_KEYS=appid,common,public_only`. The current appinfo cache contains common metadata but lacks `config` and `depots`; it supplies no install directory. This is a concrete acquisition gap, but the exact cause of the Steam path error is still unproven. No non-ASCII path was available to test.

F2. Steam registered the local `notproton` tool and logged the game mapping at 16:07:36 on October 7. The next install failure occurred at 16:08:25. Prior failures occurred at 15:11:59 and 16:01:09.

F3. The finite gameplay pass is blocked: no NPC, cultivation, event, failure or aftermath source has been read. The game does not qualify for uninstall. No gameplay proposal is attributed to its source.

A1. Root owns the smallest Steam diagnostic: refresh extended app metadata through its console (`app_info_update 1`, then `app_info_print 1468810`) and check for config/install-directory and depots. This is a proposed diagnostic, not a proven remedy or an action this worker ran. If metadata remains missing, hand acquisition to the Neutron owner. Do not edit manifests or cached appinfo to manufacture readiness.

Once a real install is finalized and stable, resume this lane with useful managed code, dependencies and data copied privately and hash verified. Trace five bounded chains before handing original proposals to the life-sim experience GM. Preserve saves and keep game code/prose outside Git.

Evidence: `~/.codex/research/tale-of-immortal/ACQUISITION.json`, `appinfo-metadata.json`; Steam content and compatibility logs; local Neutron parser and compatibility hook. Source/data/pass/uninstall all remain pending. No commit or runtime edit occurred.
