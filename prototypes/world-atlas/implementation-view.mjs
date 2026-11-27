import {element as el} from '/canvas.mjs';

const link = (label, href) => {
    const anchor = el('a', label);
    anchor.href = href;
    return anchor;
};

export function implementationView({main, data}) {
    main.append(el('h2', 'Implementation'));
    for (const work of data.implementation) {
        const card = el('article', null, 'implementation-card');
        const header = el('div', null, 'implementation-heading');
        header.append(link(work.world, '#' + work.worldView), el('h3', work.title), el('p', work.outcome));
        const body = el('div', null, 'implementation-columns');
        const outcomes = el('section');
        outcomes.append(el('h4', 'Browser-verified today'), el('p', work.verified),
            el('h4', 'Next playtest'), el('p', work.next));
        const replay = el('section');
        replay.append(el('h4', 'Earned replay start'), el('p', work.scenario));
        const download = link('Download replay save', '/implementation/' + work.id + '/save');
        download.className = 'implementation-download';
        replay.append(download, el('p', 'Import the save in a separate game profile to keep your current life.'),
            el('code', 'game_new({scenario: "' + work.id + '"})'));
        body.append(outcomes, replay);
        const resources = el('nav', null, 'implementation-references');
        resources.setAttribute('aria-label', work.title + ' references');
        for (const [key, ref] of Object.entries(work.references)) {
            resources.append(link(ref.label, '/implementation/' + work.id + '/' + key));
        }
        card.append(header, body, resources);
        main.append(card);
    }
}

export function snapshotStatus(container, data) {
    const {builtAt, commit, dirty, failures} = data.snapshot;
    const time = value => new Date(value).toLocaleString(undefined, {dateStyle: 'medium', timeStyle: 'short'});
    const details = el('details', null, 'atlas-freshness');
    details.append(el('summary', 'Atlas data · ' + time(builtAt)));
    const identity = [commit, dirty == null ? 'Working-tree state unknown' : dirty ? 'Includes working-tree changes' : 'Clean checkout'];
    details.append(el('p', identity.join(' · ')),
        el('p', 'Progress report · ' + (data.progress?.snapshot || 'Unavailable')),
        el('p', data.latestCollectedAt ? 'Latest batch collection · ' + time(data.latestCollectedAt) : 'No batch collection receipts found'));
    if (data.refreshError) details.append(el('p', data.refreshError, 'atlas-data-error'));
    for (const failure of failures || []) details.append(el('p', failure.part + ' · ' + failure.error, 'atlas-data-error'));
    const refresh = el('button', 'Refresh Atlas');
    refresh.type = 'button';
    const status = el('output');
    status.setAttribute('aria-live', 'polite');
    refresh.onclick = async () => {
        refresh.disabled = true;
        status.textContent = 'Refreshing…';
        try {
            const response = await fetch('/refresh', {method: 'POST', headers: {'Content-Type': 'application/json'}});
            if (!response.ok) throw new Error(await response.text());
            location.reload();
        } catch (error) {
            status.textContent = 'Refresh failed. ' + error.message;
            refresh.disabled = false;
        }
    };
    details.append(refresh, status);
    if (data.refreshError || failures?.length) details.open = true;
    container.append(details);
}
