// Reads the published native cold threshold. The region above it means only
// "no cold exposure", not immunity to heat or other environmental effects.
export function temperatureBand(reading) {
    if (!reading || ![reading.temperature, reading.tolerance, reading.threshold].every(Number.isFinite)) return null;
    const edge = reading.threshold - reading.tolerance;
    const margin = reading.temperature - edge;
    return {edge, margin, cold: margin <= 0,
        text: `Cold exposure at ${edge} °C or below · current ${reading.temperature} °C`,
        position: margin < 0 ? 'below' : margin > 0 ? 'above' : 'at'};
}

export function createTemperatureBand(doc = document) {
    const node = doc.createElement('div'); node.className = 'temperature-band';
    const name = doc.createElement('span'), marker = doc.createElement('span'), note = doc.createElement('small');
    marker.className = 'temperature-band-regions';
    node.append(name, marker, note);
    return {node, update(reading) {
        const view = temperatureBand(reading); node.hidden = !view; if (!view) return;
        node.dataset.reading = view.position;
        name.textContent = view.text;
        marker.textContent = `${view.position === 'below' ? '● ' : ''}Cold ← ${view.position === 'at' ? '● ' : ''}threshold → No cold exposure${view.position === 'above' ? ' ●' : ''}`;
        note.textContent = 'Current local reading; tolerance changes this boundary. The warmer side makes no claim about heat safety.';
    }};
}
