'use strict';
// The small page behind window.prompt in the desktop host. It reports its
// answer by setting the page title, so it needs no preload or Node access.
const PROMPT_RESULT = 'yairpg-prompt-result:';

const escapeHtml = text => String(text)
    .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;').replaceAll("'", '&#39;');

function promptPage(message, initial) {
    return `<!doctype html><meta charset="utf-8"><title>YAIRPG</title>
<style>
body{margin:0;padding:16px;background:#1b1b1b;color:#e8e8e8;font:14px system-ui,sans-serif}
p{margin:0 0 12px;white-space:pre-wrap}
input{width:100%;box-sizing:border-box;padding:6px;font:inherit;background:#111;color:inherit;border:1px solid #555}
div{margin-top:12px;text-align:right}
button{font:inherit;padding:4px 14px;margin-left:8px}
</style>
<p>${escapeHtml(message ?? '')}</p>
<input id="v" value="${escapeHtml(initial ?? '')}" autofocus>
<div><button id="c">Cancel</button><button id="o">OK</button></div>
<script>
const send = v => { document.title = ${JSON.stringify(PROMPT_RESULT)} + JSON.stringify(v); };
const v = document.getElementById('v');
v.select();
document.getElementById('o').onclick = () => send(v.value);
document.getElementById('c').onclick = () => send(null);
addEventListener('keydown', e => { if (e.key === 'Enter') send(v.value); if (e.key === 'Escape') send(null); });
</script>`;
}

module.exports = { promptPage, PROMPT_RESULT, escapeHtml };
