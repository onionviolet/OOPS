// In-page "type a word to confirm" dialog. Replaces window.prompt, which the
// Tauri host cannot answer synchronously and hidden runs suppress (N3).
// Resolves true only when the typed text matches `word` and Confirm is pressed.
export function askTypedConfirm({title, message, word, confirmLabel = 'Confirm', doc = document}) {
    return new Promise(resolve => {
        const dialog = doc.createElement('dialog');
        dialog.className = 'typed-confirm';
        const heading = doc.createElement('h2'); heading.textContent = title;
        const text = doc.createElement('p'); text.textContent = message;
        const label = doc.createElement('label'); label.textContent = `Type "${word}" to continue`;
        const input = doc.createElement('input'); input.type = 'text'; input.autocomplete = 'off'; input.spellcheck = false;
        label.append(input);
        const cancel = doc.createElement('button'); cancel.type = 'button'; cancel.textContent = 'Cancel';
        const confirm = doc.createElement('button'); confirm.type = 'button'; confirm.textContent = confirmLabel; confirm.disabled = true;
        const row = doc.createElement('div'); row.className = 'typed-confirm-actions'; row.append(cancel, confirm);
        dialog.append(heading, text, label, row);
        const matches = () => input.value.trim().replace(/^"(.*)"$/, '$1') === word;
        let settled = false;
        const finish = value => { if (settled) return; settled = true; dialog.close(); dialog.remove(); resolve(value); };
        input.oninput = () => { confirm.disabled = !matches(); };
        input.onkeydown = event => { if (event.key === 'Enter' && matches()) finish(true); };
        cancel.onclick = () => finish(false);
        confirm.onclick = () => finish(matches());
        dialog.addEventListener('cancel', () => finish(false));
        doc.body.append(dialog);
        dialog.showModal();
        input.focus();
    });
}
