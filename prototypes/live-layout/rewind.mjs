// The rewind domain still owns the memory list and its changes. This preview
// only chooses a host for the same list.
const params = new URLSearchParams(location.search);
if (params.has('rewind_preview')) {
    const mount = () => {
        const panel = document.getElementById('rewind_panel');
        const memory = panel?.querySelector('[aria-label="Who half-remembers"]');
        const journal = document.querySelector('[data-region="journal"]');
        if (!memory || !journal) return false;

        const row = document.createElement('div');
        row.className = 'rewind-preview-controls';
        const label = document.createElement('label');
        label.append('Memory detail ');
        const select = document.createElement('select');
        select.add(new Option('On demand', 'demand'));
        select.add(new Option('Below Journal', 'journal'));
        select.value = params.get('memory') === 'journal' ? 'journal' : 'demand';
        label.append(select);

        const disclosure = document.createElement('details');
        disclosure.className = 'rewind-preview-disclosure';
        const summary = document.createElement('summary');
        summary.textContent = 'Who half-remembers';
        disclosure.append(summary);
        const dock = document.createElement('section');
        dock.className = 'workspace-module rewind-preview-companion';
        dock.dataset.memoryPlacement = 'journal';
        const heading = document.createElement('h3');
        heading.className = 'workspace-module-header';
        heading.textContent = 'Who half-remembers';
        dock.append(heading);
        const empty = document.createElement('p');
        empty.className = 'rewind-preview-empty';
        empty.textContent = 'After a return, signs of familiarity appear here.';
        const content = document.createElement('div');
        content.className = 'rewind-preview-readout';
        content.append(memory, empty);

        const place = () => {
            document.documentElement.dataset.rewindMemoryPlacement = select.value;
            (select.value === 'journal' ? dock : disclosure).append(content);
            disclosure.hidden = select.value !== 'demand';
            dock.hidden = select.value !== 'journal';
        };
        select.addEventListener('change', place);
        row.append(label);
        if (params.has('test_hooks')) {
            const seed = document.createElement('button');
            seed.type = 'button';
            seed.textContent = 'Set mark and seed two memories';
            seed.addEventListener('click', () => {
                panel.querySelector('button').click();
                const remember = window.__rewind.registry.command('memory', 'remember');
                const episode = about => ({kind:'helped', about, fact:'fact.shared_a_meal', source:'saw', certainty:90, feeling:40, day:0, count:1});
                remember('player', episode('person.rowan'), {});
                remember('rowan', episode('person.player'), {});
                seed.disabled = true;
                seed.textContent = 'Fixture memories seeded';
            });
            row.append(seed);
        }
        panel.append(row, disclosure);
        journal.append(dock);
        place();
        return true;
    };
    if (!mount()) {
        const pending = new MutationObserver(() => { if (mount()) pending.disconnect(); });
        pending.observe(document.body, {childList: true, subtree: true});
    }
}
