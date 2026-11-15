// Interval ticks that piled up while the page was busy run once, not once each.
//
// index.html loads HackTimer, which runs setInterval in a worker so timers keep
// going in a background tab. Its worker posts one message per period whether or
// not the page could run the last one, so a long synchronous stretch (a late save's
// 20-plus-second boot) leaves every display poll with a queue of stale ticks. They
// then fire back to back and keep the page busy for many more seconds before it can
// show PLAY (G18 follow-up, 2026-11-14). A native setInterval never queues a missed
// tick; this restores that: a tick that arrives less than half a period after the
// last run of the same interval is dropped. One-shot timers, and so the game loop
// (a setTimeout chain), are untouched.
//
// Installed once, at import, and only in a real browser page (window is the
// global), so node tests keep their own timers.
const clock = () => globalThis.performance?.now?.() ?? 0;

export function coalescedInterval(setIntervalFn, now = clock) {
    return function setInterval(callback, period, ...rest) {
        if (typeof callback !== 'function' || !(period > 0)) return setIntervalFn.call(this, callback, period, ...rest);
        let last = -Infinity;
        return setIntervalFn.call(this, function tick(...args) {
            const at = now();
            if (at - last < period / 2) return undefined;
            last = at;
            return callback.apply(this, args);
        }, period, ...rest);
    };
}

if (typeof window !== 'undefined' && globalThis.window === globalThis && !globalThis.setInterval.coalesced) {
    const wrapped = coalescedInterval(globalThis.setInterval);
    wrapped.coalesced = true;
    globalThis.setInterval = wrapped;
}
