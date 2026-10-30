// Pure decision for the load part of slot_run's gate (tested in tests/slot_run.test.js).
// maxLoad null: load never holds the gate. loadWaitMs null: load is a hard gate (explicit opt-in).
// loadWaitMs set: load is a soft wait; after that long the gate stops caring and the command runs anyway.
export function loadGate({load, maxLoad, waitedMs, loadWaitMs}) {
  if (!maxLoad || load <= maxLoad) return 'go';
  if (loadWaitMs == null) return 'wait-load';
  return waitedMs >= loadWaitMs ? 'run-anyway' : 'wait-load';
}
