# R2 resume 1: new places need travel to become walks (coordinator, 2026-10-29)

Your candidate `/tmp/r2-pack/cast.json` adds 41 places (86 total), and place resolution rose to 0.30, but **none of the
new places has `travel`**, so none is a walk target: the be seat builds walks only from `places.filter(p => p.travel
&& !p.anchorOnly)` (`src/book_world_lotm_cast_host.js:63`). The coordinator has since made the replay generator walk
to each scene's place (committed); with the live pack it now emits 29 walks for chapters 1-24, and with your
candidate 28.

Do what the brief asked: streets, buildings and rooms-you-enter that the lead walks between get `travel` in the same
shape as existing pack places (read three existing rows), with minutes from evidence or a district default marked
`fill` with its basis (LSD108); true sub-places (a desk, a corner) stay attached to their parent without travel.
Also: the live pack changed since R1 (H1 added a `householdActs` field). Rebuild with `--base
private_packs/lotm-cast/cast.json` as it is now, and keep that field untouched. Rerun the X2 command (the generator
now takes `--pack`) against your candidate and report walks. Same grant. Update `R2_CHECKPOINT.md`. Do not commit.
