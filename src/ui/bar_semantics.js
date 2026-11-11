// Bar semantics shared by the native work, reading and vitals bars (element audit UIC113, UIC106).
// Moved out of display.js so it does not grow (AR1). Leaf module: DOM writes only, no game state.

// Fill a work or reading bar by its real fraction of its own track (UR116; element audit UIC113). The old
// fixed 385 px fill read 34% at minute 119 of 120 once the track grew wider.
export function set_bar_fraction(bar, fraction) {
    const f = Math.max(0, Math.min(1, Number(fraction) || 0));
    bar.style.width = `${(f * 100).toFixed(2)}%`;
    const track = bar.parentElement;
    if (track) {
        track.setAttribute('role', 'progressbar');
        track.setAttribute('aria-valuemin', '0');
        track.setAttribute('aria-valuemax', '100');
        track.setAttribute('aria-valuenow', String(Math.round(f * 100)));
    }
}

// Vitals and xp bars announce what they measure, their value and a low state (UR115, UR61; element audit
// UIC106), the way meter_bar.js meters already do. `low` is the fraction at or under which the pool reads low.
export function mark_vital_meter(host, {label, value, max, unit, low = 0}) {
    if (!host) return;
    const v = Math.max(0, Number(value) || 0), m = Math.max(0, Number(max) || 0);
    if (host.getAttribute('role') !== 'meter') host.setAttribute('role', 'meter');
    host.setAttribute('aria-label', label);
    host.setAttribute('aria-valuemin', '0'); host.setAttribute('aria-valuemax', String(Math.round(m)));
    host.setAttribute('aria-valuenow', String(Math.round(v)));
    const state = m > 0 && low > 0 && v <= m * low ? 'low' : 'ok';
    host.setAttribute('aria-valuetext', `${Math.round(v)} of ${Math.round(m)} ${unit}${state === 'low' ? ', low' : ''}`);
    if (host.dataset.state !== state) host.dataset.state = state;
}
