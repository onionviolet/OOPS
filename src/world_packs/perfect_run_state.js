// One key contract shared by Ryan's checkpoint and its later world adapters.
export const RYAN = 'ryan';
export const MEMORY = 'perfect_run.memory';
export const ATTEMPT = 'perfect_run.attempt';
export const memory = engine => engine.world.holders[RYAN].state[MEMORY];
export const attempt = engine => engine.world.holders[RYAN].state[ATTEMPT];
export const stateOp = (pack, value) => ({op: 'state', holder: RYAN, pack, value});
