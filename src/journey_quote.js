"use strict";
// AK17: one quote per walk, so the exit label, the minutes the journey charges and the arrival clock agree.
// The composition root registers the pace reader; each part is {id, source, mult} and names one known cause.
// Body state (DL1) and stat methods (DL3) join as further parts without a new shape.

// Village road tuning. The tired and timber factors apply to the departure quote.
export function villageRoadPace({running, stamina, maxStamina, logs}) {
    const parts = [];
    if (running) parts.push({id: 'running', source: 'Running', mult: 0.8});
    if (maxStamina > 0 && stamina < maxStamina / 4) {
        parts.push({id: 'low-stamina', source: 'Low stamina', mult: 1.25});
    }
    if (logs >= 3) parts.push({id: 'timber-load', source: 'Carrying three or more rough logs', mult: 1.25});
    return parts;
}

let paceReader = () => [];
export function setJourneyPace(reader) { paceReader = typeof reader === 'function' ? reader : () => []; }

export function journeyParts() {
    let parts = [];
    try { parts = paceReader() || []; } catch { parts = []; }
    return parts.filter(p => p && p.id && Number.isFinite(p.mult) && p.mult > 0);
}

const pad = n => String(n).padStart(2, '0');
// Minutes after a clock of {hour, minute}: the hour and minute of arrival, and how many midnights the walk crosses.
export function clockAfter(now, minutes) {
    const total = now.hour * 60 + now.minute + minutes;
    const hour = Math.floor(total / 60) % 24, minute = total % 60, days = Math.floor(total / 1440);
    return {hour, minute, days, text: `${pad(hour)}:${pad(minute)}${days ? ` (+${days}d)` : ''}`};
}

// null when no route is known. The charge never drops below one minute, as the journey always did.
export function quoteJourney(baseMinutes, {parts = journeyParts(), now = null} = {}) {
    if (!Number.isFinite(baseMinutes)) return null;
    const mult = parts.reduce((m, p) => m * p.mult, 1);
    const minutes = Math.max(1, Math.ceil(baseMinutes * mult));
    return {base: baseMinutes, minutes, parts, arriveAt: now ? clockAfter(now, minutes) : null};
}

const times = mult => `×${Number(mult.toFixed(2))}`;
// The hover line: base, each known cause, then the arrival. Plain text so every travel row can use it as a title.
export function journeyTitle(quote, format = m => `${m}m`) {
    if (!quote) return '';
    const lines = [`Route: ${format(quote.base)}`, ...quote.parts.map(p => `${times(p.mult)} ${p.source}`)];
    if (quote.parts.length) lines.push(`Total: ${format(quote.minutes)}`);
    if (quote.arriveAt) lines.push(`Arrive ${quote.arriveAt.text}`);
    return lines.join('\n');
}
