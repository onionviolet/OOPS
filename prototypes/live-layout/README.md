# Live layout preview

The launcher starts the real OOPS browser build on an isolated local origin and adds a layout picker to the footer. It uses the selected revision's default Appearance and links the local Gothic bitmap fonts. The fixture drops old Appearance settings and changes text size through the native profile data. Both layouts share the same running life, renderers and save owners.

Run each size in a separate terminal from the repository root.

```sh
node prototypes/live-layout/serve.mjs --fixture gear --text-size 14
node prototypes/live-layout/serve.mjs --fixture gear --text-size 21
```

Open the printed URL and press Play. Select and equip the 40%-quality Cheap leather pants. Close the item and select the 65%-quality Wolf leather armored pants. Use **Layout preview** in the footer to try **Compare beside Actions**, **Compare below Actions**, and **Compare below Journal**. Select **Full item** for the native expanded comparison. **Current** shows the committed card content. All three compact placements use the same summary from the existing item comparison model. The Journal option gives short quest lists only the height their contents need and keeps the existing height as a scroll cap for long quest lists.

The launcher defaults to HEAD. Use `--rev WORKTREE` for local source changes. `--fixture gear` adds the Wolf leather armored pants to the mid performance fixture, `--fixture crowded` gives a long list, and omitting the fixture gives a fresh life. Ctrl+C stops the server and removes its temporary source tree.

For a browser replay, pass the two printed gear URLs and an output folder to `node prototypes/live-layout/compare.mjs`. Append `journal` to run only the new placement. It records whether the actual Gothic strike, comparison and Equip button are visible at 1920×1080, 1800×1040 and 1536×864. It equips the second pair at the floor and checks focus on the exact item after Close. For a font check on the mid fixture, use `node prototypes/live-layout/verify.mjs <preview-url> [screenshot-directory]`.

The prototype applies [item-summary.patch](item-summary.patch) to a temporary tree before building. The patch uses the real comparison model and equipment controls. The former Content-fit version was retired after review. The chosen summary and placement can move into the existing renderer and shell, with the preview selector replaced by the owning selector.

## Return to the mark with a busy Journal

Start `node prototypes/live-layout/serve.mjs --fixture busy-journal` and open its URL with `?rewind_preview=1&test_hooks=1`. Use **All panels → Return to the mark**, choose **Set mark and seed two memories**, then press **Return to the mark**. The fixture activates six native quests and creates two memories through the owning registry command. The return itself uses the normal game action. The **Memory detail** switch moves the same readout between the Journal column and a disclosure on Return to the mark. The native result and cooldown remain local.

Run `node prototypes/live-layout/rewind-check.mjs <preview-url> <output-directory>` for captures at 1920×1080 and 1800×1072, plus a check at the 1800×1040 browser target. The replay checks that changing the display leaves the memory and rewind save owners unchanged and that the familiarity record survives reload.
