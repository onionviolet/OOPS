import {bindSubjectGesture} from './recipe_connections.js';
// Crafting screen detail region (2026-10-13, Proto23-inspired list + detail).
// Presentation only: display.js builds the model from itemRecipeStatus() (the same
// availability the row, the filter and the native craft read) and owns every command.
// No craft mechanics, odds, save or transaction logic belongs here.

export const UNKNOWN_MATERIAL_LABEL = 'Unfamiliar material';
import {craftCue} from './craft_cues.js';
import {craftGlance, GLANCE_MARKS} from './ui/craft_glance.js';

let resultDetailsOpen = false;

const mark = state => GLANCE_MARKS[state] || GLANCE_MARKS.info;

// The glance: one status line (the blocked reason lives here, once) and the facts weighed before Craft.
function renderGlance(model) {
    const glance = craftGlance(model);
    const wrap = el('section', 'craft_glance');
    wrap.setAttribute('data-craft-glance', '');
    wrap.setAttribute('aria-label', 'Before you craft');
    const status = el('p', 'craft_glance_status', '');
    status.dataset.state = glance.status.state;
    status.append(el('span', 'craft_mark', mark(glance.status.state)), el('span', '', glance.status.text));
    if(!model.available) {
        status.classList.add('craft_blocked_reason');
        status.setAttribute('data-craft-blocked-reason', '');
        status.tabIndex = -1;
    }
    if(Number.isFinite(model.attempts)) status.setAttribute('data-craft-attempts', '');
    wrap.append(status);
    const attrs = {result: 'data-craft-output', station: 'data-craft-station'};
    const grid = el('div', 'craft_glance_grid');
    for(const row of glance.rows) {
        const cell = el('div', 'craft_glance_row');
        cell.dataset.glance = row.key;
        if(row.state) cell.dataset.state = row.state;
        if(attrs[row.key]) cell.setAttribute(attrs[row.key], '');
        cell.append(el('span', 'craft_detail_label', row.label));
        if(row.chips) {
            const chips = el('span', 'craft_glance_chips');
            for(const c of row.chips) {
                const chip = el('span', 'craft_chip');
                chip.dataset.state = c.state;
                chip.append(el('span', 'craft_mark', mark(c.state)), el('span', '', `${c.text} · ${c.note}`));
                chips.append(chip);
            }
            if(!row.chips.length) chips.append(el('span', '', 'Nothing'));
            cell.append(chips);
        } else {
            const value = el('span', 'craft_detail_value', row.number ?? row.value);
            if(row.key === 'chance') {
                value.setAttribute('data-craft-chance', '');
                cell.classList.add('craft_detail_odds');
                cell.append(value);
                if(row.word) cell.append(el('span', 'craft_chance_word', `· ${row.word}`));
            } else cell.append(value);
        }
        grid.append(cell);
    }
    wrap.append(grid);
    return wrap;
}

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
    const kind = focused && ['data-craft-commit', 'data-craft-amount', 'data-craft-req', 'data-craft-blocked-reason', 'data-craft-related', 'data-craft-back','data-craft-continue','data-craft-cancel-goal'].find(a => focused.hasAttribute(a));
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

    body.append(renderGlance(model));
    const uses = el('details', 'craft_detail_section craft_detail_stock');
    uses.open = model.requirements.some(req => req.missing || req.held_back);
    uses.append(el('summary', '', 'Input stock'));
    uses.append(el('div', 'craft_detail_label', model.requirements.every(req=>req.stockKnown) ? 'owned / unblocked / blocked' : 'carried / needed'));
    for(const req of model.requirements) {
        const row = el('div', 'craft_req');
        row.setAttribute('data-craft-req', '');
        const owned=req.owned??req.have,usable=req.stockKnown?req.usable:undefined,blocked=req.stockKnown?req.blocked:undefined;
        row.setAttribute('aria-label', req.stockKnown ? `${req.label}: owned ${owned}, unblocked ${usable}, blocked ${blocked}, need ${req.need} per attempt${req.held_back?', selected material group blocked':''}` : `${req.label}: ${owned} carried, need ${req.need}`);
        row.tabIndex = -1;
        if(req.missing) row.setAttribute('data-missing', '');
        if(req.unknown) row.setAttribute('data-unknown', '');
        row.append(el('span', 'craft_req_name', req.label), el('span', 'craft_req_count', req.stockKnown ? `${usable} unblocked · ${blocked} blocked · ${req.need} per attempt (owned ${owned})` : `${owned} carried · ${req.need} selected`));
        if(req.missing) row.append(el('span', 'craft_req_short', `missing ${req.need - req.have}`));
        else if(req.held_back) row.append(el('span', 'craft_req_short', 'selected material group blocked; release its commitments or finish the current activity'));
        if(!req.unknown && Number.isFinite(req.stock) && req.stock !== req.have) row.append(el('small', '', `${req.stock} carried in all material groups`));
        if(!req.unknown && req.variants?.length) row.title = `Consumption order: ${req.variants.map(v=>`${v.name}${Number.isFinite(v.quality)?` ${v.quality}%`:''} ×${v.count}`).join(', ')}`;
        uses.append(row);
    }
    body.append(uses);
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
    const about = el('details', 'craft_detail_about');
    about.append(el('summary', '', 'About this recipe'));
    about.append(fact('XP', model.xp, 'data-craft-xp'));
    if(model.policy) about.append(el('p', 'craft_detail_policy', model.policy));
    body.append(about);
    if(model.related?.length) {
        const related = el('div', 'craft_detail_section craft_detail_related');
        related.setAttribute('data-craft-related-list', '');
        related.append(el('div', 'craft_detail_label', 'Known producers and uses'));
        for(const r of model.related) {
            const link = el('button', 'craft_related');
            link.type = 'button';
            link.setAttribute('data-craft-related', r.recipe_id);
            if(!r.available) link.dataset.unavailable = '';
            link.append(el('span', 'craft_related_name', r.title), el('span', 'craft_related_via', r.via));
            link.setAttribute('aria-label', `Show recipe ${r.title}, ${r.via}${r.available ? '' : ', not craftable now'}`);
            link.addEventListener('click', () => handlers.onRelated?.(r.target || r.recipe_id));
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
    const buttons = el('div', 'craft_detail_buttons');
    const preview=el('p','craft_batch_proposal','Focus or hover a batch choice to preview its maximum input use. The preview reserves nothing.');
    actions.append(preview);
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
        const showProposal=()=>{preview.textContent=craftBatchProposal({requirements:model.requirements,available:model.attempts??0,requested:amount});};
        b.addEventListener('mouseenter',showProposal);b.addEventListener('focus',showProposal);
    }
    const showOne=()=>{preview.textContent=craftBatchProposal({requirements:model.requirements,available:model.attempts??0,requested:1});};
    commit.addEventListener('mouseenter',showOne);commit.addEventListener('focus',showOne);
    for(const b of buttons.children) {
        if(!model.available) b.setAttribute('aria-disabled', 'true');
        bindSubjectGesture(b, ()=>model.subject || model.title, () => {
            if(!model.available) { handlers.onBlocked(root); return; }
            handlers.onCommit(b.dataset.craftAmount ? Number(b.dataset.craftAmount) : 1);
        });
    }
    actions.append(buttons);
    if(model.goal){
        const g=model.goal,remaining=g.target-g.attempted,goal=el('section','craft_goal');goal.dataset.craftGoal='';
        goal.append(el('p','',`Session goal: ${g.attempted} of ${g.target} attempts · ${g.successful} successes · ${g.made} useful outputs. ${remaining?`${remaining} attempts remain; continue explicitly after reviewing current stock and station.`:'Goal finished.'} This intent survives navigation and clears on loading a save. It reserves nothing.`));
        if(remaining){const resume=el('button','',`Recheck and continue ${remaining} attempts`);resume.type='button';resume.dataset.craftContinue='';resume.disabled=!model.available;resume.title=model.blocked_reason||'Native material, station and skill limits are checked again on each click.';resume.onclick=()=>handlers.onContinue?.();goal.append(resume);}
        const cancel=el('button','',remaining?'Cancel remaining goal':'Clear goal');cancel.type='button';cancel.dataset.craftCancelGoal='';cancel.onclick=()=>handlers.onCancelGoal?.();goal.append(cancel);actions.append(goal);
    }
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
export function craftReceiptText({made, result_name, used, xp, skill_id, skill_level, attempted, successful}) {
    const usedText = used.map(u => `${u.count} ${u.name}`).join(', ');
    const xpText = xp > 0 ? ` (+${Math.round(xp * 10) / 10} XP)` : '';
    if(made > 0) {
        const cue = craftCue(skill_id, skill_level, {made});
        const tally=Number.isFinite(attempted)&&Number.isFinite(successful)?` ${successful} of ${attempted} native attempts succeeded.`:'';
        return `Made ${made} ${result_name}${usedText ? ` from ${usedText}` : ''}${xpText}${tally}${cue ? ` ${cue}` : ''}`;
    }
    if(usedText) {
        const tally=Number.isFinite(attempted)&&Number.isFinite(successful)?` ${successful} of ${attempted} native attempts succeeded.`:'';
        return `Failed: ${usedText} used, nothing made${xpText}${tally}`;
    }
    return 'Nothing was crafted. Your materials are unchanged.';
}

export function craftBatchProposal({requirements, available, requested}) {
    const request=Number.isFinite(requested)?Math.max(0,Math.floor(requested)):Infinity;
    const limit=Math.max(0,Math.floor(Math.min(Number.isFinite(available)?available:0,request)));
    if(!limit)return 'No attempts are available. This preview reserves nothing.';
    const requestLabel=Number.isFinite(request)?String(request):'all available';
    const uses=requirements.map(req=>`${Math.max(0,Math.floor(req.need*limit))} ${req.label}`).join(', ');
    return `Proposed up to ${limit} attempt${limit===1?'':'s'} (request: ${requestLabel}): ${uses}. Native skill limits can stop earlier; this preview reserves nothing.`;
}
