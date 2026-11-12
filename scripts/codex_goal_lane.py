#!/usr/bin/env python3
"""Run one Codex goal thread for a foundation lane, detached, with a usage guard.

Usage (run with python3 -I):
  codex_goal_lane.py start --name fdn-g-codex-1 --cwd <worktree> --brief <CODEX_LANE.md>
        [--token-budget 4000000] [--auto-compact 200000] [--max-turns 40]
        [--usage-ceiling 30] [--credit-floor 64000] [--runs-dir <dir>]
  codex_goal_lane.py status [--runs-dir <dir>]
  codex_goal_lane.py usage
  codex_goal_lane.py stop --name <name> [--runs-dir <dir>]

The lane talks to `codex app-server --stdio`: thread/start in the worktree
(workspace-write sandbox, no approvals), thread/goal/set with the brief as the
objective and a token budget, then turns until the goal leaves `active`, the
turn cap is hit, or the guard trips. The guard reads account/rateLimits/read
every few minutes and pauses the goal when the Codex window reaches the usage
ceiling or the credit balance reaches the floor (Weibao, 2026-11-12). Each lane
writes <runs-dir>/<name>/status.json and events.log. Stop by process group.
The lane never commits; the owning Claude chat reviews and commits.
"""
import argparse, json, os, select, signal, subprocess, sys, time

CODEX = '/Applications/ChatGPT.app/Contents/Resources/codex-cli/CodexCLI.app/Contents/MacOS/codex'
DEFAULT_RUNS = os.path.expanduser('~/.codex/foundation-lanes')
GUARD_EVERY = 300


class Server:
    def __init__(self, extra_config=()):
        args = [CODEX]
        for kv in extra_config:
            args += ['-c', kv]
        args += ['app-server', '--stdio']
        self.p = subprocess.Popen(args, stdin=subprocess.PIPE, stdout=subprocess.PIPE,
                                  stderr=subprocess.DEVNULL, text=True, bufsize=1)
        self.next_id = 10
        self.backlog = []

    def send(self, obj):
        self.p.stdin.write(json.dumps(obj) + '\n')
        self.p.stdin.flush()

    def read(self, timeout):
        r, _, _ = select.select([self.p.stdout], [], [], timeout)
        if not r:
            return None
        line = self.p.stdout.readline()
        if not line:
            raise EOFError('app-server closed')
        try:
            return json.loads(line)
        except ValueError:
            return None

    def request(self, method, params, timeout=60):
        self.next_id += 1
        rid = self.next_id
        self.send({'id': rid, 'method': method, 'params': params})
        end = time.time() + timeout
        while time.time() < end:
            msg = self.read(1)
            if msg is None:
                continue
            if msg.get('id') == rid:
                if 'error' in msg:
                    raise RuntimeError(f"{method}: {msg['error'].get('message')}")
                return msg.get('result')
            self.backlog.append(msg)
        raise TimeoutError(method)

    def init(self):
        self.send({'id': 1, 'method': 'initialize',
                   'params': {'clientInfo': {'name': 'foundation_lane', 'version': '1.0'}}})
        end = time.time() + 30
        while time.time() < end:
            msg = self.read(1)
            if msg and msg.get('id') == 1:
                break
        self.send({'method': 'initialized'})

    def close(self):
        try:
            self.p.terminate()
        except Exception:
            pass


def usage(server):
    res = server.request('account/rateLimits/read',
                         {'excludeResetCreditDetails': True, 'supportsLunaReserve': False})
    codex = (res.get('rateLimitsByLimitId') or {}).get('codex') or res.get('rateLimits') or {}
    used = (codex.get('primary') or {}).get('usedPercent')
    credits = codex.get('credits') or (res.get('rateLimits') or {}).get('credits') or {}
    bal = credits.get('balance')
    try:
        bal = float(bal) if bal is not None else None
    except ValueError:
        bal = None
    return {'usedPercent': used, 'creditBalance': bal,
            'reached': codex.get('rateLimitReachedType') or res.get('rateLimitReachedType'),
            'ordinaryUsageAllowed': res.get('ordinaryUsageAllowed')}


def guard_trips(u, ceiling, floor):
    if u['usedPercent'] is None or u['creditBalance'] is None:
        return 'usage unreadable'
    if u['usedPercent'] >= ceiling:
        return f"usage {u['usedPercent']}% >= {ceiling}%"
    if u['creditBalance'] <= floor:
        return f'credit balance at or below {floor}'
    return None


def run_lane(a):
    d = os.path.join(a.runs_dir, a.name)
    status_path = os.path.join(d, 'status.json')
    log = open(os.path.join(d, 'events.log'), 'a', buffering=1)
    status = {'name': a.name, 'cwd': a.cwd, 'pid': os.getpid(), 'pgid': os.getpgid(0),
              'started': time.time(), 'state': 'starting', 'turns': 0}

    def save(**kw):
        status.update(kw, updated=time.time())
        with open(status_path + '.tmp', 'w') as f:
            json.dump(status, f, indent=1)
        os.replace(status_path + '.tmp', status_path)

    def note(text):
        log.write(time.strftime('%H:%M:%S ') + text + '\n')

    brief = open(a.brief).read()
    cfg = [f'model_auto_compact_token_limit={a.auto_compact}']
    s = Server(cfg)
    try:
        s.init()
        u = usage(s)
        trip = guard_trips(u, a.usage_ceiling, a.credit_floor)
        save(usage=u)
        if trip:
            note('guard before start: ' + trip)
            save(state='refused', reason=trip)
            return
        t = s.request('thread/start', {'cwd': a.cwd, 'approvalPolicy': 'never', 'sandbox': 'workspace-write',
                                       'serviceName': 'foundation_lane'})
        tid = t['thread']['id']
        save(threadId=tid, state='running')
        note(f'thread {tid}')
        try:
            s.request('thread/name/set', {'threadId': tid, 'name': a.name})
        except Exception as e:
            note(f'name not set: {e}')
        tail = '\n[The full brief is CODEX_LANE.md in your working directory.]'
        objective = brief if len(brief) <= 3900 else brief[:3900 - len(tail)] + tail
        s.request('thread/goal/set', {'threadId': tid, 'objective': objective, 'tokenBudget': a.token_budget,
                                      'status': 'active'})
        prompt = ('You are a Codex worker lane for the YAIRPG foundation run. Read AGENTS.md and the brief below, '
                  'then work toward the goal. Edit only the files the brief allows. Do not run git commit, git stash, '
                  'git reset, git checkout or git push; the owning Claude chat reviews your diff and commits. '
                  'Run only the focused tests the brief names. No visible windows. Write your return to '
                  'CODEX_RETURN.md in the working directory when the goal is met or you stop.\n\n' + brief)
        s.request('turn/start', {'threadId': tid, 'input': [{'type': 'text', 'text': prompt}]})
        status['turns'] = 1
        last_guard = time.time()
        goal_state = 'active'
        idle_since = None
        while True:
            msg = s.backlog.pop(0) if s.backlog else s.read(5)
            now = time.time()
            if msg:
                m = msg.get('method', '')
                if m == 'thread/goal/updated':
                    g = msg['params']['goal']
                    goal_state = g.get('status')
                    save(goal=goal_state, tokensUsed=g.get('tokensUsed'))
                    note(f'goal {goal_state} tokens {g.get("tokensUsed")}')
                elif m == 'turn/started':
                    idle_since = None
                elif m == 'turn/completed':
                    st = msg['params']['turn'].get('status')
                    note(f'turn completed: {st}')
                    idle_since = now
                elif m == 'thread/compacted':
                    note('context compacted')
            if goal_state != 'active':
                save(state='finished', reason=f'goal {goal_state}')
                return
            if now - last_guard >= GUARD_EVERY:
                last_guard = now
                u = usage(s)
                save(usage=u)
                trip = guard_trips(u, a.usage_ceiling, a.credit_floor)
                if trip:
                    note('guard: ' + trip)
                    try:
                        s.request('turn/interrupt', {'threadId': tid})
                    except Exception:
                        pass
                    s.request('thread/goal/set', {'threadId': tid, 'status': 'paused'})
                    save(state='paused', reason=trip)
                    return
            if idle_since and now - idle_since > 30:
                if status['turns'] >= a.max_turns:
                    s.request('thread/goal/set', {'threadId': tid, 'status': 'paused'})
                    save(state='paused', reason='turn cap')
                    return
                g = s.request('thread/goal/get', {'threadId': tid}) or {}
                goal_state = ((g.get('goal') or g).get('status')) or goal_state
                if goal_state == 'active':
                    s.request('turn/start', {'threadId': tid, 'input': [{'type': 'text', 'text':
                              'Continue toward the goal. If it is met, write CODEX_RETURN.md and mark the goal complete.'}]})
                    status['turns'] += 1
                    save()
                idle_since = None
    except Exception as e:
        note(f'error: {e}')
        save(state='error', reason=str(e))
    finally:
        s.close()


def start(a):
    d = os.path.join(a.runs_dir, a.name)
    os.makedirs(d, exist_ok=True)
    if os.fork():
        return print(json.dumps({'launched': a.name, 'status': os.path.join(d, 'status.json')}))
    os.setsid()
    if os.fork():
        os._exit(0)
    out = open(os.path.join(d, 'lane.out'), 'a')
    os.dup2(out.fileno(), 1)
    os.dup2(out.fileno(), 2)
    run_lane(a)
    os._exit(0)


def all_status(runs_dir):
    rows = []
    for n in sorted(os.listdir(runs_dir)) if os.path.isdir(runs_dir) else []:
        p = os.path.join(runs_dir, n, 'status.json')
        if os.path.exists(p):
            st = json.load(open(p))
            alive = False
            try:
                os.kill(st['pid'], 0)
                alive = True
            except Exception:
                pass
            rows.append({k: st.get(k) for k in ('name', 'state', 'goal', 'turns', 'tokensUsed', 'reason', 'pid', 'pgid')} | {'alive': alive})
    return rows


def main():
    ap = argparse.ArgumentParser()
    sub = ap.add_subparsers(dest='cmd', required=True)
    s = sub.add_parser('start')
    s.add_argument('--name', required=True)
    s.add_argument('--cwd', required=True)
    s.add_argument('--brief', required=True)
    s.add_argument('--token-budget', type=int, default=4_000_000)
    s.add_argument('--auto-compact', type=int, default=200_000)
    s.add_argument('--max-turns', type=int, default=40)
    s.add_argument('--usage-ceiling', type=float, default=30)
    s.add_argument('--credit-floor', type=float, default=64000)
    s.add_argument('--runs-dir', default=DEFAULT_RUNS)
    for n in ('status', 'stop'):
        x = sub.add_parser(n)
        x.add_argument('--runs-dir', default=DEFAULT_RUNS)
        if n == 'stop':
            x.add_argument('--name', required=True)
    sub.add_parser('usage')
    a = ap.parse_args()
    if a.cmd == 'start':
        start(a)
    elif a.cmd == 'status':
        print(json.dumps(all_status(a.runs_dir), indent=1))
    elif a.cmd == 'usage':
        sv = Server()
        try:
            sv.init()
            u = usage(sv)
            print(json.dumps({'usedPercent': u['usedPercent'], 'aboveCreditFloor64000': None if u['creditBalance'] is None else u['creditBalance'] > 64000,
                              'creditHeadroom': None if u['creditBalance'] is None else round(u['creditBalance'] - 64000), 'reached': u['reached']}))
        finally:
            sv.close()
    elif a.cmd == 'stop':
        st = json.load(open(os.path.join(a.runs_dir, a.name, 'status.json')))
        os.killpg(st['pgid'], signal.SIGTERM)
        print(json.dumps({'stopped': a.name, 'pgid': st['pgid']}))


if __name__ == '__main__':
    main()
