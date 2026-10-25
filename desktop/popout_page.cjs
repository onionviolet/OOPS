'use strict';
// Pop-out panel page (A3, EL3/EL44). A separate page on the game origin that
// never boots the game: it only shows projections the game page sends through
// the host (src/host.js reportProjection), so there is still exactly one state
// owner and one save writer (AR3). Read-only in this slice: acting on a lead
// still happens in the game window. Host chrome, built for a second screen
// (target 480x720, desktop first; mobile deferred).
const POPOUT_PATH = '/__host/popout.html';
const PANELS = { events: 'World events' };

function popoutPage(panel) {
    const title = PANELS[panel] || 'Panel';
    return `<!doctype html><meta charset="utf-8"><title>YAIRPG: ${title}</title>
<style>
:root{color-scheme:dark}
body{margin:0;background:#1b1b1b;color:#e8e8e8;font:14px/1.45 system-ui,sans-serif}
main{padding:12px 16px;max-width:640px}
h1{font-size:16px;margin:0 0 4px}
h2{font-size:13px;margin:16px 0 6px;color:#b9b9b9;font-weight:600}
p.note{margin:0;color:#9a9a9a;font-size:12px}
ul,ol{margin:0;padding:0;list-style:none}
li{padding:6px 8px;border:1px solid #444;background:#222;margin-bottom:6px;overflow-wrap:anywhere}
li strong{display:block}
li span{color:#b9b9b9;font-size:13px}
ol li{border-color:#333;background:transparent;padding:3px 0;border-width:0 0 1px}
.empty{color:#8a8a8a}
</style>
<main>
<h1 id="popout_title">${title}</h1>
<p class="note" id="popout_status">Waiting for the game window...</p>
<div aria-live="polite">
<h2>Waiting for you</h2><ul id="popout_leads"></ul>
<h2>Recent news</h2><ol id="popout_news"></ol>
</div>
</main>
<script>
const leads = document.getElementById('popout_leads'), news = document.getElementById('popout_news'), status = document.getElementById('popout_status');
function li(tag, text) { const n = document.createElement(tag); n.textContent = text; return n; }
function show(data) {
    if (!data) return;
    status.textContent = 'Read-only. Act on these in the game window.';
    leads.replaceChildren(...(data.leads.length ? data.leads.map(l => { const row = li('li', ''); const s = li('strong', l.label + (l.available ? '' : ' (not yet)')); row.append(s, li('span', l.detail || '')); return row; }) : [Object.assign(li('li', 'Nothing is waiting.'), { className: 'empty' })]));
    news.replaceChildren(...data.news.map(t => li('li', t)));
}
const host = window.yairpgHost;
if (host && host.capabilities.includes('projection')) {
    host.onProjection((name, data) => { if (name === ${JSON.stringify(panel)}) show(data); });
    host.projectionLatest(${JSON.stringify(panel)}).then(show);
}
</script>`;
}

// Projection payloads are plain data from the game page; trim them before they
// reach another window so a bad payload cannot flood it.
function cleanProjection(name, data) {
    if (name !== 'events' || !data || typeof data !== 'object') return null;
    const text = (v, n) => String(v ?? '').slice(0, n);
    const leads = (Array.isArray(data.leads) ? data.leads : []).slice(0, 30)
        .map(l => ({ label: text(l?.label, 160), detail: text(l?.detail, 240), available: l?.available === true }));
    const news = (Array.isArray(data.news) ? data.news : []).slice(0, 40).map(t => text(t, 300));
    return { leads, news };
}

module.exports = { POPOUT_PATH, PANELS, popoutPage, cleanProjection };
