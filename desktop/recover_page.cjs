'use strict';
// The page the host shows after the game's renderer crashed or was stopped
// for hanging (EL46). It is served on the game origin so it can read, never
// write, the last save in localStorage and show when it was made. Reload
// boots the game from that save as usual.
const { escapeHtml } = require('./prompt_page.cjs');

const RECOVER_PATH = '/__host/recover.html';

const REASONS = {
    hung: 'The game stopped responding and was stopped.',
    crashed: 'The game window crashed.',
    oom: 'The game window ran out of memory.',
};

function recoverPage(reason) {
    const message = REASONS[reason] || `The game window stopped (${reason}).`;
    return `<!doctype html><meta charset="utf-8"><title>YAIRPG: recover</title>
<style>
body{margin:0;display:grid;place-items:center;height:100vh;background:#1b1b1b;color:#e8e8e8;font:15px/1.5 system-ui,sans-serif}
main{max-width:520px;padding:20px 24px;border:1px solid #555;background:#222}
h1{font-size:17px;margin:0 0 8px}
p{margin:0 0 10px}
button{font:inherit;padding:4px 16px}
</style>
<main>
<h1 id="recover_reason">${escapeHtml(message)}</h1>
<p id="recover_save">Looking for your last save...</p>
<p>Progress since that save is lost; the save itself is untouched.</p>
<button id="recover_reload" type="button">Reload the game</button>
</main>
<script>
let text = 'No save found on this origin.';
try {
    const save = JSON.parse(localStorage.getItem('save data'));
    // saved_at reads like 2026-10-20 15_43_44 (file-name safe).
    if (save) text = 'Last save: ' + (save.saved_at ? String(save.saved_at).replace(/_/g, ':') : 'time unknown') + '.';
} catch { text = 'The last save could not be read here; reloading will try it as usual.'; }
document.getElementById('recover_save').textContent = text;
document.getElementById('recover_reload').onclick = () => location.replace('/index.html');
</script>`;
}

module.exports = { RECOVER_PATH, recoverPage };
