#!/usr/bin/env node
// Run one browser check against this checkout and record wall time and Chrome CPU seconds.
// Usage: node scripts/measure_check.cjs <label> <scripts/x_browser.cjs> [more scripts...]
// Appends one JSON line per script to $YAIRPG_MEASURE_OUT (default measure-<label>.jsonl in tmpdir).
// The check runs against a fresh static server on an OS-assigned port (never a fixed lane port),
// with a fresh browser origin per context, one browser at a time (scripts run serially).
// CPU: ps cputime of every descendant process of the check, sampled every 200 ms, max per pid.
// The renderer figure is the sum over `--type=renderer` processes; chrome_total adds browser/GPU/utility.
// A process that exits between samples loses at most its last 200 ms.
const http = require('node:http'), fs = require('node:fs'), path = require('node:path'), os = require('node:os');
const {spawn, execFileSync} = require('node:child_process');

const root = path.resolve(__dirname, '..');
const [label, ...scripts] = process.argv.slice(2);
if(!label || !scripts.length) {console.error('usage: measure_check.cjs <label> <script...>'); process.exit(2);}
const outFile = process.env.YAIRPG_MEASURE_OUT || path.join(os.tmpdir(), `measure-${label}.jsonl`);
const TYPES = {'.html':'text/html', '.js':'text/javascript', '.mjs':'text/javascript', '.css':'text/css', '.json':'application/json',
    '.png':'image/png', '.jpg':'image/jpeg', '.svg':'image/svg+xml', '.ico':'image/x-icon', '.woff2':'font/woff2', '.map':'application/json', '.txt':'text/plain'};

const serve = () => new Promise(resolve => {
    const server = http.createServer((req, res) => {
        const rel = decodeURIComponent(new URL(req.url, 'http://x').pathname);
        const file = path.join(root, rel.endsWith('/') ? rel + 'index.html' : rel);
        if(!file.startsWith(root)) {res.writeHead(403).end(); return;}
        fs.readFile(file, (err, data) => {
            if(err) {res.writeHead(404).end(); return;}
            res.writeHead(200, {'content-type':TYPES[path.extname(file)] || 'application/octet-stream', 'cache-control':'no-store'}).end(data);
        });
    });
    server.listen(0, '127.0.0.1', () => resolve(server));
});

const toSeconds = t => { // [[dd-]hh:]mm:ss.ss
    const [d, rest] = t.includes('-') ? t.split('-') : [0, t];
    const parts = rest.split(':').map(Number);
    while(parts.length < 3) parts.unshift(0);
    return +d * 86400 + parts[0] * 3600 + parts[1] * 60 + parts[2];
};
const psTable = () => execFileSync('ps', ['-axo', 'pid=,ppid=,cputime=,command='], {encoding:'utf8', maxBuffer:64 << 20}).split('\n').filter(Boolean).map(l => {
    const m = l.trim().match(/^(\d+)\s+(\d+)\s+(\S+)\s+(.*)$/);
    return m && {pid:+m[1], ppid:+m[2], cpu:toSeconds(m[3]), cmd:m[4]};
}).filter(Boolean);

const measure = (script, port) => new Promise(resolve => {
    const url = `http://127.0.0.1:${port}/${/systems_workshop_|simulation_stepper/.test(script) ? '?test_hooks=1' : ''}`;
    const proofDir = path.join(os.tmpdir(), `measure-${label}-${path.basename(script, '.cjs')}`);
    fs.mkdirSync(proofDir, {recursive:true});
    const seed = path.join(os.tmpdir(), `measure-${label}-${/zz_head_/.test(script) ? 'zz_head_' : ''}exchange_browser`, 'return-save.json');
    // observation_browser reads exchange_browser's output; fall back to the shared proof path when this label has none.
    const extra = /observation_browser/.test(script) ? {YAIRPG_OBSERVATION_SEED:fs.existsSync(seed) ? seed : '/tmp/yairpg-exchange-proof/return-save.json'} : {};
    const started = Date.now(), seen = new Map();
    const child = spawn(process.execPath, [script], {cwd:root, env:{...process.env, YAIRPG_PROOF_URL:process.env.YAIRPG_MEASURE_URL || url, YAIRPG_PROOF_DIR:proofDir, ...extra}, stdio:['ignore', 'pipe', 'pipe']});
    const limit = setTimeout(() => child.kill('SIGTERM'), +(process.env.YAIRPG_MEASURE_TIMEOUT_S || 1200) * 1000);
    let log = '';
    child.stdout.on('data', d => log += d); child.stderr.on('data', d => log += d);
    const sample = () => {
        try {
            const rows = psTable(), kids = new Map();
            for(const r of rows) (kids.get(r.ppid) || kids.set(r.ppid, []).get(r.ppid)).push(r);
            const stack = [child.pid];
            while(stack.length) for(const r of kids.get(stack.pop()) || []) {
                const prev = seen.get(r.pid);
                seen.set(r.pid, {cmd:r.cmd, cpu:Math.max(prev ? prev.cpu : 0, r.cpu)});
                stack.push(r.pid);
            }
        } catch {}
    };
    const timer = setInterval(sample, 200);
    child.on('close', code => {
        clearInterval(timer); clearTimeout(limit);
        const wall = (Date.now() - started) / 1000;
        let renderer = 0, total = 0, chromeProcs = 0;
        for(const p of seen.values()) {
            if(!/Chrome|chrom/i.test(p.cmd)) continue;
            chromeProcs++; total += p.cpu;
            if(/Helper \(Renderer\)|--type=renderer/.test(p.cmd)) renderer += p.cpu;
        }
        // Anything still alive that we started must be a leak; report, never kill.
        const alive = [...seen.keys()].filter(pid => {try {process.kill(pid, 0); return true;} catch {return false;}});
        resolve({label, script, exit:code, wall_s:+wall.toFixed(1), renderer_cpu_s:+renderer.toFixed(1), chrome_cpu_s:+total.toFixed(1),
            chrome_procs_seen:chromeProcs, leaked_pids:alive, load1:os.loadavg()[0].toFixed(0), url, tail:log.trim().split('\n').slice(-4).join(' | ').slice(0, 400)});
    });
});

(async () => {
    const server = await serve(), port = server.address().port;
    try {
        for(const script of scripts) {
            const r = await measure(script, port);
            console.log(JSON.stringify(r));
            fs.appendFileSync(outFile, JSON.stringify(r) + '\n');
        }
    } finally {server.close();}
})();
