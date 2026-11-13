export const GU_RUBBLE_EXIT = 'gu_blocked_exit';
export const GU_RUBBLE = 'stock:rubble';

// Only the exit named by this pile can reopen when the last rubble is gone.
export function clearGuRubble({place, amount, force, exitId, links}) {
    const cleared = Math.min(amount, force);
    if (cleared <= 0) return {cleared: 0, effects: []};
    const exit = cleared === amount && links.find(link => link.id === exitId && link.state === 'closed' &&
        (link.from === place || link.to === place));
    return {cleared, effects: [{op: 'add', holder: place, quantity: GU_RUBBLE, amount: -cleared},
        ...(exit ? [{op: 'link_set', id: exit.id, state: 'open'}] : [])]};
}
