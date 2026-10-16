// Crafting screen detail region (2026-10-13, Proto23-inspired list + detail).
// Presentation only: display.js builds the model from itemRecipeStatus() (the same
// availability the row, the filter and the native craft read) and owns every command.
// No craft mechanics, odds, save or transaction logic belongs here.

export const UNKNOWN_MATERIAL_LABEL = 'Unfamiliar material';
import {craftCue} from './craft_cues.js';

let resultDetailsOpen = false;

function el(tag, className, text) {
    const node = document.createElement(tag);
    if(className) node.className = className;
    if(text != null) node.textContent = text;
    return node;
}

function fact(label, value, attr) {
    const row = el('div', 'craft_detail_fact');
    row.setAttribute(attr, '');
    row.append(el('span', 'craft_detail_label', label), el('span', 'craft_detail_value', value));
    return row;
}

/**
 * Renders the detail for one items recipe.
 * @param {HTMLElement} root the [data-craft-detail] region
 * @param {Object|null} model null shows the empty prompt
 * @param {Object} handlers {onCommit(amount), onBlocked(), onRelated(recipe_id), onBack()}
 */
export function renderCraftingDetail(root, model, handlers) {
    const focused = root.contains(document.activeElement) ? document.activeElement : null;
    // Re-renders keep focus on the equivalent control (button, requirement row or reason).
    const kind = focused && ['data-craft-commit', 'data-craft-amount', 'data-craft-req', 'data-craft-blocked-reason', 'data-craft-related', 'data-craft-back'].find(a => focused.hasAttribute(a));
    const focusIndex = kind ? [...root.querySelectorAll(`[${kind}]`)].indexOf(focused) : -1;
    root.replaceChildren();
    root.dataset.state = model ? (model.available ? 'ready' : 'blocked') : 'empty';
    if(!model) {
        root.append(el('p', 'craft_detail_empty', 'Select a recipe to see what it uses and makes.'));
        return;
    }

    const body = el('div', 'craft_detail_body');
    if(model.back) {
        // R12: one local return after following a related recipe on this station.
        const back = el('button', 'craft_detail_back', `← Back to ${model.back}`);
        back.type = 'button';
        back.setAttribute('data-craft-back', '');
        back.addEventListener('click', () => handlers.onBack?.());
        body.append(back);
    }
    const title = el('h3', 'craft_detail_title', model.title);
    title.setAttribute('data-craft-title', '');
    body.append(title);

    const uses = el('div', 'craft_detail_section');
    uses.append(el('div', 'craft_detail_label', 'Uses · have / need'));
    for(const req of model.requirements) {
        const row = el('div', 'craft_req');
        row.setAttribute('data-craft-req', '');
        row.setAttribute('aria-label', `${req.label}: have ${req.have}, need ${req.need}`);
        row.tabIndex = -1;
        if(req.missing) row.setAttribute('data-missing', '');
        if(req.unknown) row.setAttribute('data-unknown', '');
        row.append(el('span', 'craft_req_name', req.label), el('span', 'craft_req_count', `${req.have}/${req.need}`));
        if(req.missing) row.append(el('span', 'craft_req_short', `missing ${req.need - req.have}`));
        else if(req.held_back) row.append(el('span', 'craft_req_short', 'reserved'));
        uses.append(row);
    }
    body.append(uses);

    body.append(fact('Makes', `${model.output.name} x${model.output.count}${model.output.scaled ? ' (partial results possible)' : ''}`, 'data-craft-output'));
    if(model.effects?.length) {
        // Known effects of using the result, before committing (same data as Result details).
        const effects = el('div', 'craft_detail_effects');
        effects.setAttribute('data-craft-effects', '');
        effects.append(el('span', 'craft_detail_label', 'When used'));
        for(const e of model.effects) {
            const chip = el('span', 'craft_effect');
            chip.dataset.effectKind = e.kind;
            chip.append(el('span', 'craft_effect_name', e.name), el('span', 'craft_effect_duration', e.duration));
            if(e.description) chip.title = e.description;
            effects.append(chip);
        }
        body.append(effects);
    }
    const odds = el('div', 'craft_detail_fact craft_detail_odds');
    odds.append(el('span', 'craft_detail_label', 'Success'), el('span', 'craft_detail_value', `${model.chance}%`));
    odds.querySelector('.craft_detail_value').setAttribute('data-craft-chance', '');
    if(Number.isFinite(model.attempts)) {
        // Attempts the materials allow now, not guaranteed outputs. Zero when the native guard refuses.
        const attempts = el('span', 'craft_detail_attempts', `Can craft now: ${model.attempts} attempt${model.attempts === 1 ? '' : 's'}`);
        attempts.setAttribute('data-craft-attempts', '');
        odds.append(attempts);
    }
    body.append(odds);
    const quiet = el('div', 'craft_detail_quiet');
    quiet.append(fact('Station', model.station, 'data-craft-station'), fact('XP', model.xp, 'data-craft-xp'));
    body.append(quiet);
    if(model.related?.length) {
        const related = el('div', 'craft_detail_section craft_detail_related');
        related.setAttribute('data-craft-related-list', '');
        related.append(el('div', 'craft_detail_label', 'Related on this station'));
        for(const r of model.related) {
            const link = el('button', 'craft_related');
            link.type = 'button';
            link.setAttribute('data-craft-related', r.recipe_id);
            if(!r.available) link.dataset.unavailable = '';
            link.append(el('span', 'craft_related_name', r.title), el('span', 'craft_related_via', r.via));
            link.setAttribute('aria-label', `Show recipe ${r.title}, ${r.via}${r.available ? '' : ', not craftable now'}`);
            link.addEventListener('click', () => handlers.onRelated?.(r.recipe_id));
            related.append(link);
        }
        body.append(related);
    }
    if(model.result_details) {
        // Filled only while open, so closed details add no hidden text to the window.
        const more = el('details', 'craft_detail_more');
        more.append(el('summary', '', 'Result details'));
        const inner = el('div', 'craft_detail_result');
        more.append(inner);
        more.addEventListener('toggle', () => {
            resultDetailsOpen = more.open;
            inner.innerHTML = more.open ? model.result_details : '';
            if(more.open && model.cue) inner.append(el('p', 'craft_cue', model.cue));
        });
        more.open = resultDetailsOpen;
        body.append(more);
    }
    root.append(body);

    const actions = el('div', 'craft_detail_actions');
    if(!model.available) {
        const reason = el('p', 'craft_blocked_reason', model.blocked_reason);
        reason.setAttribute('data-craft-blocked-reason', '');
        reason.tabIndex = -1;
        actions.append(reason);
    }
    const buttons = el('div', 'craft_detail_buttons');
    const commit = el('button', 'craft_commit', 'Craft 1');
    commit.type = 'button';
    commit.setAttribute('data-craft-commit', '');
    buttons.append(commit);
    for(const [amount, label] of [[5, '5'], [10, '10'], [Infinity, 'All']]) {
        const b = el('button', 'craft_amount', label);
        b.type = 'button';
        b.dataset.craftAmount = String(amount);
        b.setAttribute('aria-label', `Craft ${label === 'All' ? 'all you can' : label}`);
        buttons.append(b);
    }
    for(const b of buttons.children) {
        if(!model.available) b.setAttribute('aria-disabled', 'true');
        b.addEventListener('click', () => {
            if(!model.available) { handlers.onBlocked(root); return; }
            handlers.onCommit(b.dataset.craftAmount ? Number(b.dataset.craftAmount) : 1);
        });
    }
    actions.append(buttons);
    const receipt = el('p', 'craft_receipt', model.receipt || '');
    receipt.setAttribute('data-craft-receipt', '');
    receipt.setAttribute('aria-live', 'polite');
    receipt.hidden = !model.receipt;
    actions.append(receipt);
    root.append(actions);

    if(kind) (root.querySelectorAll(`[${kind}]`)[focusIndex] || commit).focus({preventScroll: true});
}

// Focus the first missing requirement (or the reason when nothing is missing). Changes nothing.
export function focusFirstBlocker(root) {
    const target = root.querySelector('[data-craft-req][data-missing]') || root.querySelector('[data-craft-blocked-reason]');
    target?.focus();
}

/**
 * Receipt from measured inventory and XP deltas, so it states what actually happened.
 * @param {Object} r {made, result_name, used: [{name, count}], xp}
 */
export function craftReceiptText({made, result_name, used, xp, skill_id, skill_level}) {
    const usedText = used.map(u => `${u.count} ${u.name}`).join(', ');
    const xpText = xp > 0 ? ` (+${Math.round(xp * 10) / 10} XP)` : '';
    if(made > 0) {
        const cue = craftCue(skill_id, skill_level, {made});
        return `Made ${made} ${result_name}${usedText ? ` from ${usedText}` : ''}${xpText}${cue ? `. ${cue}` : ''}`;
    }
    if(usedText) return `Failed: ${usedText} used, nothing made${xpText}`;
    return 'Nothing was crafted. Your materials are unchanged.';
}
