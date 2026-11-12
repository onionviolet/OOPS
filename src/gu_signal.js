// The reader compares what arrived with its own requirements. Custody comes
// from the host's live state rather than the emission or its history.
export function readGuSignal({reader, emission, current}) {
    if (emission.pattern !== reader.pattern || emission.force < reader.minForce) return 'wrong-signal';
    if (reader.authority && (emission.method !== 'live' || emission.specimen !== reader.authority.specimen ||
        current?.specimen !== emission.specimen || current.operator !== reader.authority.operator)) {
        return 'authority-required';
    }
    return 'accepted';
}
