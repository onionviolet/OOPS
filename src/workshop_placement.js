// Which section of the "Craftsman & workshop" panel owns a command (WS-1, WS-4; Weibao 2026-10-30).
// An allowlist by group: a command whose group is not listed here has no home in this panel,
// so it is never drawn for the player and shows only in the dev-mode "Unplaced commands" list.
// Other panels keep their own group filters (simulation_ui.js still skips groups they own).
export const WORKSHOP_HOMES = Object.freeze({
    talk: ["social"],
    work: [undefined, "workshop"],
    leads: ["promise", "storylet", "nested_campaign", "systems_workshop"],
});
export const workshopHome = command => Object.keys(WORKSHOP_HOMES).find(home => WORKSHOP_HOMES[home].includes(command.group)) || null;
