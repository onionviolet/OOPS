#!/usr/bin/env python3
"""macOS process attribution, including launchd-parented WebKit XPC helpers."""
import ctypes, json, subprocess, sys
lib = ctypes.CDLL('/usr/lib/libSystem.B.dylib')
responsible = lib.responsibility_get_pid_responsible_for_pid
responsible.argtypes = [ctypes.c_int]
responsible.restype = ctypes.c_int
class Usage(ctypes.Structure):
    _fields_ = [('uuid', ctypes.c_byte * 16)] + [(k, ctypes.c_uint64) for k in
        ['user', 'system', 'pkg_idle', 'interrupt', 'pageins', 'wired', 'resident', 'footprint', 'start', 'exit']]
usage = lib.proc_pid_rusage
usage.argtypes = [ctypes.c_int, ctypes.c_int, ctypes.c_void_p]
class Timebase(ctypes.Structure):
    _fields_ = [('numer', ctypes.c_uint32), ('denom', ctypes.c_uint32)]
timebase = Timebase()
lib.mach_timebase_info(ctypes.byref(timebase))
seconds_per_tick = timebase.numer / timebase.denom / 1e9
root = int(sys.argv[1])
rows = []
for line in subprocess.check_output(['ps', '-axo', 'pid=,ppid=,comm='], text=True).splitlines():
    a = line.strip().split(None, 2)
    if len(a) == 3:
        rows.append(dict(pid=int(a[0]), ppid=int(a[1]), command=a[2]))
owned = {root}
for _ in range(8):
    added = {r['pid'] for r in rows if r['ppid'] in owned}
    if added <= owned: break
    owned |= added
for r in rows:
    r['responsible'] = responsible(r['pid'])
    if 'WebKit' in r['command'] and r['responsible'] in owned:
        owned.add(r['pid'])
result = []
for r in rows:
    if r['pid'] not in owned: continue
    u = Usage()
    if usage(r['pid'], 0, ctypes.byref(u)) == 0:
        result.append(dict(**r, cpuSeconds=(u.user+u.system)*seconds_per_tick,
                           residentBytes=u.resident, footprintBytes=u.footprint))
print(json.dumps(result))
