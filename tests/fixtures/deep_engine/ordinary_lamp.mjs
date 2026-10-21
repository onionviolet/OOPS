export const LAMP_FIXTURE = Object.freeze({id:'deep-engine.ordinary-lamp', version:1, seed:11,
    wallStart:Date.UTC(2026, 9, 20, 16), setup:'Developer current-format setup: owned lamp and one oil flask in the Village at 22:00. No natural acquisition claim.'});
export function ordinaryLampFixture(fresh) {
    const save = structuredClone(fresh), key = id => JSON.stringify({id});
    Object.assign(save['current time'], {hour:22, minute:0});
    for (const id of ['Oil lamp', 'Lamp oil']) save.inventories.person.main_character[key(id)] = {count:1};
    save.lamplight = {schema:1,lit:false,oil:0,noticed:{}};
    return save;
}
