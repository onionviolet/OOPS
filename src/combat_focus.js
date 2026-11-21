// Read only facts already emitted by the native combat renderer. No enemy model,
// hidden stats, level inference, random draw or command belongs in this adapter.
const firstLine=node=>(node?.innerText||node?.textContent||'').split('\n')[0].trim();
const labels={Atk:'Attack',Spd:'Speed',Hit:'Hit you',Ddg:'Evade you',Def:'Defense',AP:'Attack rating',EP:'Evasion rating'};
export function combatFactEntries(texts) {
    return texts.flatMap(text=>{const match=/^([^:]+):\s*(.+)$/.exec(text.replace(/^[|·\s]+/,'').trim());if(!match)return [];
        const key=match[1].trim(),value=match[2].replace(/(\d)dmg\b/g,'$1 dmg');
        return [{label:labels[key]||key,value:key==='Spd'?`${value} /s`:value}];});
}
// Keep the visible bars and their mirrors on the same published timing. A
// hidden native panel has no computed animation transform to read.
const attackCycles = new WeakMap();
const animations = new WeakMap();
export function drawNativeAttackBar(slot, index, progress, remainingMs, due = null) {
    const bar = slot?.children?.[index]?.querySelector?.('[data-attack_bar]');
    if (!bar) return;
    animations.get(bar)?.cancel();
    animations.delete(bar);
    const start = Math.max(0, Math.min(1, progress));
    attackCycles.set(bar, {start, at: performance.now(), remainingMs, due});
    bar.style.width = '100%';
    bar.style.transformOrigin = bar.classList.contains('enemy_attack_bar') ? 'right' : 'left';
    bar.style.transform = `scaleX(${start})`;
    if (remainingMs > 0 && typeof bar.animate === 'function') {
        animations.set(bar, bar.animate([{transform: `scaleX(${start})`}, {transform: 'scaleX(1)'}],
            {duration: remainingMs, easing: 'linear', fill: 'forwards'}));
    }
}

export function nativeAttackProgress(bar, now = performance.now()) {
    if (!bar) return null;
    const cycle = attackCycles.get(bar);
    const value = cycle ? 100 * (cycle.start + (1 - cycle.start) * (cycle.remainingMs > 0 ?
        Math.max(0, Math.min(1, (now - cycle.at) / cycle.remainingMs)) : 0)) : parseFloat(bar.style.width);
    return Number.isFinite(value) ? Math.max(0, Math.min(100, value)) : null;
}

export function freezeNativeAttackBar(slot, index) {
    const bar = slot?.children?.[index]?.querySelector?.('[data-attack_bar]');
    if (!bar || !attackCycles.has(bar)) return;
    const start = nativeAttackProgress(bar) / 100;
    animations.get(bar)?.cancel();
    animations.delete(bar);
    attackCycles.set(bar, {start, remainingMs: 0});
    bar.style.transform = `scaleX(${start})`;
}
export function nextNativeAttackBar(...slots) {
    let earliest = Infinity, next = null;
    for (const slot of slots) for (const row of slot?.children || []) {
        const bar = row.querySelector('[data-attack_bar]');
        const due = attackCycles.get(bar)?.due;
        if (!Number.isFinite(due)) continue;
        if (due < earliest) { earliest = due; next = bar; }
        else if (due === earliest) next = null;
    }
    return next;
}
export function readNativeCadence(defenders, attackers) {
    const next = nextNativeAttackBar(defenders, attackers);
    return {enemies: readNativeCombatFocus(defenders, next), heroAttackNext: !!next && !!attackers?.firstElementChild?.contains(next)};
}
export function readNativeCombatFocus(host, next = null) {
    return [...(host?.querySelectorAll('.fighter_div')||[])].map(row=>({id:row.dataset?.combatSubject || row.id,
        name:firstLine(row.querySelector('.fighter_name'))||'Unassessed opponent',role:'Current opponent',
        hp:firstLine(row.querySelector('.health_value'))||'Health not yet available',
        healthProgress:row.querySelector('.healthbar_current')?Math.max(0,Math.min(100,parseFloat(row.querySelector('.healthbar_current').style.width)||0)):null,
        facts:[...combatFactEntries([...row.querySelectorAll('.enemy_stat')].map(firstLine)),...(row.dataset?.playerHitChance?[{label:'You hit them',value:row.dataset.playerHitChance}]:[])],
        stats:[...row.querySelectorAll('.enemy_stat')].map(firstLine).filter(Boolean).join(' · '),
        attackProgress:nativeAttackProgress(row.querySelector('[data-attack_bar]')),
        ...(next && row.contains(next) ? {attackNext:true} : {})}));
}
export function chooseCombatFocus(enemies,selected) {return enemies?.find(row=>row.id===selected)||enemies?.[0]||null;}
