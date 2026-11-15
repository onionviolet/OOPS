// PS142: a repeat's time, chance and yield read as separate parts of one visible line, not only inside its tooltip:
// "Every 6 min (about 6 s real) · 40% · 1–2 Herb". Game time leads; real time follows, qualified, because a gathering
// period advances one game minute per tick at the configured rate (dev speed is not counted, so it says "about").
import {config} from '../config.js';
import {formatDuration} from '../number_format.js';

function realTime(minutes) {
    const s = Math.round(minutes / (config.tickrate || 1));
    if (s < 60) return `${s} s`;
    const m = Math.floor(s / 60), r = s % 60;
    return r ? `${m} min ${r} s` : `${m} min`;
}

const amount = count => Array.isArray(count) && count[0] !== count[1] ? `${count[0]}–${count[1]}` : `${Array.isArray(count) ? count[0] : count ?? 1}`;

const percent = c => { const n = Number(c) || 0; return n > 0 && n < 0.005 ? '<1%' : `${Math.round(100 * n)}%`; };

/** One line for a gathering period: time, then each find as chance and yield. `nameOf` gives the player-facing name. */
export function gatherLine({gathering_time_needed, gained_resources} = {}, nameOf = id => id) {
    const minutes = Number(gathering_time_needed) || 0;
    const finds = (gained_resources || []).map(r => `${percent(r.chance)} · ${amount(r.count)} ${nameOf(r.name)}`);
    if (!minutes && !finds.length) return '';
    return [`Every ${formatDuration(minutes)} (about ${realTime(minutes)} real)`, ...(finds.length ? [finds.join('; ')] : [])].join(' · ');
}

// PS141: what Stop keeps and what it loses, said before you stop. Gathering finds land at the end of each period, jobs pay
// per finished working period (their pay line says so already), and training XP lands every minute.
export function stopOutcome(type, period) {
    if (type === 'GATHERING') return `Stop keeps what you found; the current ${formatDuration(period)} search is lost.`;
    // Jobs already say it in their pay line ("Stop early: no pay for the unfinished round").
    if (type === 'TRAINING') return 'Stop keeps all practice so far.';
    return '';
}
