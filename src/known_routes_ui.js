import { sameKnownRouteQuote } from './known_routes.js';
import { recordRouteTraffic, routeTraffic } from './economy_standing_domain.js';

const node = (tag, text = '', className = '') => {
    const element = document.createElement(tag);
    element.textContent = text;
    if (className) element.className = className;
    return element;
};
const reasonsText = rows => (rows || []).map(row => typeof row === 'string' ? row : row?.text || '').filter(Boolean).join(' ');

/** Mount a compact read-only route overview inside the existing Notebook. */
export function createKnownRoutesPanel({ container, read, present, command, focusFallback = null }) {
    if (!container || typeof read !== 'function' || typeof present !== 'function' || typeof command !== 'function') {
        throw new TypeError('Known Routes needs the existing Notebook container, reader, presenter and command dispatcher.');
    }
    const panel = node('details', '', 'expedition_panel');
    panel.id = 'known_routes_panel';
    const heading = node('summary', 'Known routes');
    heading.tabIndex = 0;
    const current = node('p', '', 'expedition_preview');
    const commitments = node('ul', '', 'expedition_history');
    const routes = node('div');
    const status = node('p', '', 'expedition_notice');
    status.setAttribute('role', 'status');
    panel.append(heading, current, commitments, routes, status);
    container.append(panel);

    let notice = '';
    const routeRows = new Map(), commitmentNodes = new Map();
    const fallback = () => focusFallback || container;
    if (!container.hasAttribute('tabindex') && !focusFallback) container.tabIndex = -1;
    const moveFocus = target => {
        const candidate = target || fallback();
        if (typeof candidate?.focus === 'function') candidate.focus();
    };
    function focusPanel() {
        panel.open = true;
        heading.focus();
    }
    function activate(id, fingerprint) {
        try {
            const snapshot = read();
            if (!snapshot.canWrite || snapshot.error) throw new Error(snapshot.error || 'Saving is currently unavailable.');
            const fresh = present(snapshot);
            const route = fresh?.section?.routes?.find(row => row.id === id);
            if (!route || !sameKnownRouteQuote(fingerprint, route)) throw new Error('This route changed. Review its current terms again.');
            if (!route.eligible) throw new Error(reasonsText(route.reasons) || 'This route is currently blocked.');
            command(route.command);
            recordRouteTraffic(route.id);
            notice = 'Route action sent.';
        } catch (error) {
            notice = error?.message || String(error);
        }
        render();
    }
    function render() {
        // This projection owns discovery. The workspace parks undiscovered panels
        // in its hidden vault, so waiting for a visible parent would prevent the
        // first known route from ever revealing this panel. Native presenters
        // still decide which destinations and quotes the player knows.
        const snapshot = read(), view = present(snapshot), section = view?.visible ? view.section : null;
        if (!section && !panel.hidden && panel.contains(document.activeElement)) moveFocus(fallback());
        panel.hidden = !section;
        if (!section) return;
        current.textContent = `You are at ${section.current}.`;
        current.hidden = !section.current;
        const commitmentRows = (section.commitments || []).filter(row => row.text);
        const commitmentIds = new Set();
        for (const row of commitmentRows) {
            commitmentIds.add(row.id);
            let item = commitmentNodes.get(row.id);
            if (!item) { item = document.createElement('li'); commitmentNodes.set(row.id, item); commitments.append(item); }
            item.textContent = row.text;
        }
        for (const [id, item] of commitmentNodes) if (!commitmentIds.has(id)) { item.remove(); commitmentNodes.delete(id); }
        commitments.hidden = !commitmentIds.size;
        for (const route of section.routes || []) {
            let entry = routeRows.get(route.id);
            if (!entry) {
                const card = node('section', '', 'expedition_card'), button = node('button');
                const destination = node('p'), description = node('p', '', 'expedition_preview');
                const terms = node('p', '', 'expedition_preview'), blocker = node('p', '', 'expedition_requirements');
                const commitment = node('p', '', 'expedition_requirements'), wear = node('p', '', 'expedition_preview');
                button.type = 'button';
                button.addEventListener('click', () => entry.current && activate(entry.current.id, entry.current));
                card.append(button, destination, description, terms, blocker, commitment, wear);
                entry = { card, button, destination, description, terms, blocker, commitment, wear, current: route };
                routeRows.set(route.id, entry);
                routes.append(card);
            }
            entry.current = route;
            const { button, destination, description, terms, blocker, commitment, wear } = entry;
            button.textContent = route.label;
            button.disabled = !snapshot.canWrite || !!snapshot.error || !route.eligible;
            button.setAttribute('aria-label', `${route.direction === 'return' ? 'Return to' : 'Travel to'} ${route.destinationLabel}: ${route.label}`);
            destination.textContent = `${route.direction === 'return' ? 'Return route' : 'Onward route'} · ${route.destinationLabel}`;
            description.textContent = route.description;
            terms.textContent = route.costText;
            blocker.textContent = route.blockerText || reasonsText(route.reasons);
            commitment.textContent = route.commitmentText;
            const worn = routeTraffic(route.id);
            wear.textContent = worn.count ? `Walked ${worn.count} time${worn.count === 1 ? '' : 's'}; worn in ${Math.round(worn.gain * 1000) / 10}% (these doorway routes are instant; the wear shortens ordinary journeys between places).` : '';
            for (const row of [description, terms, blocker, commitment, wear]) row.hidden = !row.textContent;
        }
        const currentRouteIds = new Set((section.routes || []).map(route => route.id));
        for (const [id, entry] of routeRows) if (!currentRouteIds.has(id)) {
            if (entry.card.contains(document.activeElement)) moveFocus(heading);
            entry.card.remove();
            routeRows.delete(id);
        }
        routes.hidden = routeRows.size === 0;
        status.textContent = snapshot.error || snapshot.notice || notice;
        status.hidden = !status.textContent;
    }
    render();
    return { element: panel, render, focus: focusPanel };
}
