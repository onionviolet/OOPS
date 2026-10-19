// Installed packs are registered in manifest order. The first is the current
// authored edition; later editions remain available to exact saved receipts.
// Reading this choice neither draws randomness nor provisions a life.
export function initialStructuredBeginning(definitions, probeId = null) {
    return (probeId && definitions.get(probeId)) || definitions.values().next().value;
}
