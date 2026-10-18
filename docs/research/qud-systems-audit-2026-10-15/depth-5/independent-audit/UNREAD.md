# Remaining independent audit gaps

2026-10-15. Captured is distinct from reviewed. [Exact selected reading ranges and complements](private/READ_WINDOWS.json) are the authoritative reading scope for this audit. [Machine-readable gaps](private/UNREAD.json) retain open consumers. The primary depth5 inventory owns cumulative Qud coverage.

| ID | State | Remaining question |
|---|---|---|
| AU1 | Open | Assembly-wide direct/indirect callers and field writers for RequireDestinationZone, Queue, Locations and DestinationZoneID; this audit searched captured classes only. |
| AU2 | Open | Every external owner, game-state save root, event registry and actor reference that can retain or serialize an individual queued victim. |
| AU3 | Open | Exact reflection instance factory and pooled-part reset during reload; all compatibility/invalid-object cleanup bodies. |
| AU4 | Open | Full graveyard retention/pooling and registry lifetime through all zone freeze/reload cases; exact runtime garbage collection and later actor placement after failed teleport. |
| AU5 | Open | All inherited blueprint listeners and mod/subclass behavior; this audit inspected the source XML chain and selected standard consumers. |
| AU6 | Open, deliberately untested | Native queues across contact veto, failed placement, expiry, stabilization, collision, zone freeze, save/load and reload. No game or save was opened. |

Resolved narrowly: actual inherited serializer excludes transient transport fields; scheduler removes inactive victims; explicit flush does not check teleport success; vortex has no local expiry/destroy/save contents adapter. None closes AU2 or AU6.

Full exports of ComponentReflection and large unused regions of IComponent, ActionManager, SerializationReader/Writer remain unread. The two small context dispatcher classes were read completely. Only declared windows of GameObject, Physics, Zone and ZoneManager were reviewed. Complete SpaceTimeVortex and Temporary were read for this audit's questions; unrelated supporting event consumers were not all followed.
