// Read only facts already emitted by the native combat renderer. No enemy model,
// hidden stats, level inference, random draw or command belongs in this adapter.
const firstLine=node=>(node?.innerText||node?.textContent||'').split('\n')[0].trim();
const labels={Atk:'Attack',Spd:'Speed',Hit:'Hit you',Ddg:'Evade you',Def:'Defense',AP:'Attack rating',EP:'Evasion rating'};
export function combatFactEntries(texts) {
    return texts.flatMap(text=>{const match=/^([^:]+):\s*(.+)$/.exec(text.replace(/^[|·\s]+/,'').trim());if(!match)return [];
        const key=match[1].trim(),value=match[2].replace(/(\d)dmg\b/g,'$1 dmg');
        return [{label:labels[key]||key,value:key==='Spd'?`${value} /s`:value}];});
}
export function readNativeCombatFocus(host) {
    return [...(host?.querySelectorAll('.fighter_div')||[])].map(row=>({id:row.id,
        name:firstLine(row.querySelector('.fighter_name'))||'Unassessed opponent',role:'Current opponent',
        hp:firstLine(row.querySelector('.health_value'))||'Health not yet available',
        healthProgress:row.querySelector('.healthbar_current')?Math.max(0,Math.min(100,parseFloat(row.querySelector('.healthbar_current').style.width)||0)):null,
        facts:[...combatFactEntries([...row.querySelectorAll('.enemy_stat')].map(firstLine)),...(row.dataset?.playerHitChance?[{label:'You hit them',value:row.dataset.playerHitChance}]:[])],
        stats:[...row.querySelectorAll('.enemy_stat')].map(firstLine).filter(Boolean).join(' · '),
        attackProgress:Math.max(0,Math.min(100,parseFloat(row.querySelector('[data-attack_bar]')?.style.width)||0))}));
}
export function chooseCombatFocus(enemies,selected) {return enemies?.find(row=>row.id===selected)||enemies?.[0]||null;}
