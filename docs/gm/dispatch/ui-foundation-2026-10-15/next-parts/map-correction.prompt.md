CORRECTION from Weibao: "rather than math thing I meant map/representation style and more?"
Re-aim your lane at **map and spatial representation styles** for Around you, not a numeric ledger. Keep any useful
findings you already have (counts and lenses can annotate a map), but the main deliverable is now: how each reference
game draws or represents space and the player's surroundings, and what map style suits YAIR.
For each reference, record the representation style: tile/hex grid (Taiwu blocks, Trimps), ASCII/glyph map with fog
(A Dark Room, Candy Box 2, Caves of Qud, Dwarf Fortress), node/graph of named places (text RPGs, Warsim, YAIR's own
connected_locations + travel_time in src/models/location.js:169-201), region/world map with zones (Tale of Immortal,
Immortal Life, ACS), illustrated scene or diorama, list-only (no map), or room/scene sketch. Note: what scale it shows
(room, place, area, world), how fog/discovery works, how people/enemies/resources sit on it, how travel is chosen and
timed, how it stays readable at small sizes, how perception/skills change it, and its cost to build.
Then propose for YAIR, as options with defaults plus dials (no either/or questions): which style at which scale
(local place, area around, world), how it fits the existing center-mode controller, Back/Esc, 1366×768 at 14/21px,
the log column (never shrink it), sealed places (no leaks), procedural/other worlds, and Proto23 baseline. Update your
mockups to show map styles instead of (or alongside) the ledger. Keep COMMON rules and your file/scratch scope.
