// World substrate v0 quantity vocabulary (chat W). Packs import names from here
// so two domains that touch "humidity" mean the same unit and bounds. A new
// entry needs a reader and a writer in two packs (PFP5); otherwise it stays in
// the pack that uses it. Units are authored game units, not real physics.
export const WORLD_QUANTITIES = Object.freeze({
    humidity: Object.freeze({id: 'humidity', unit: 'percent', min: 0, max: 100}),
    daylight: Object.freeze({id: 'daylight', unit: 'flag', min: 0, max: 1}),
    moon_phase: Object.freeze({id: 'moon_phase', unit: 'eighth', min: 0, max: 7}),
    rain: Object.freeze({id: 'rain', unit: 'flag', min: 0, max: 1}),
    day: Object.freeze({id: 'day', unit: 'day', min: 0}),
});
