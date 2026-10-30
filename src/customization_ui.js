import {createSettledTextEffects} from './settled_text_effects.js';
import {COMPONENT_THEMES} from './component_themes.js';
import {mountDisplaySettings} from './display_settings.js';
import {defaultCustomizationState, defaultPresentationSettings, validateCustomizationState, getCustomizationSettings, mergePresentationSettings, applyCustomizationProfile, createLuminousGothicDraft, EFFECT_MODULES} from './customization_profiles.js';

export function createCustomizationUI({container, effectsContainer, read, save, season = () => '', canWrite = () => true, moduleIds = [], previewContainer, readPreview = () => []}) {
    function surface(host, title, explanation, {collapse = false} = {}) {
        const panel = document.createElement('section'); panel.className = 'customization-panel customization-surface';
        const heading = document.createElement('h3'); heading.textContent = title; panel.append(heading);
        const notice = document.createElement('p'); notice.className = 'customization-draft-status'; notice.setAttribute('role', 'status'); panel.append(notice);
        const body = document.createElement('div'); body.className = 'customization-editor customization-fields-scroll'; panel.append(body);
        const intro = document.createElement(collapse ? 'details' : 'p'); intro.className = 'customization-explanation';
        // A long explanation sits behind a named disclosure so the settings come first (UR75).
        if (collapse) { const sum = document.createElement('summary'); sum.textContent = 'What this changes'; const text = document.createElement('p'); text.textContent = explanation; intro.append(sum, text); } else intro.textContent = explanation;
        body.append(intro);
        const actions = document.createElement('div'); actions.className = 'customization-actions'; panel.append(actions);
        host.append(panel); return {panel, notice, body, actions};
    }
    const appearance = surface(container, 'Appearance', 'Profile, typography, palette and seasonal theme for native modules. Changes remain a draft until applied.');
    const effectSurface = surface(effectsContainer || container, 'Effects & sound', 'Original effects for settled Work Ledger and crafting receipts, plus first skill discoveries. Sound requires a gesture.', {collapse: true});
    const {panel, body, actions} = appearance;
    const effectContext = document.createElement('p'); effectContext.className = 'customization-target-context'; effectSurface.body.prepend(effectContext);
    let draft = defaultCustomizationState(), target = '', busy = false, disposed = false, savedSignature = null, validSaved = true, renderedSettings = null, lastAllowed = null;
    const fields = document.createElement('fieldset'); body.append(fields);
    const effectFields = document.createElement('fieldset'); effectSurface.body.append(effectFields);
    let currentFields = fields;
    const row = (label, element) => { element.setAttribute('aria-label', label); const node = document.createElement('label'); node.append(document.createTextNode(`${label} `), element); currentFields.append(node); return element; };
    const select = (label, values) => { const element = document.createElement('select'); for (const value of values) { const option = document.createElement('option'); option.value = value; option.textContent = value || 'Whole profile'; element.append(option); } return row(label, element); };
    const input = (label, type, min, max) => { const element = document.createElement('input'); element.type = type; if (min !== undefined) element.min = min; if (max !== undefined) element.max = max; return row(label, element); };
    const profile = select('Profile', []), module = select('Native module', ['', ...moduleIds]);
    const theme = select('Seasonal theme', ['off','automatic','manual']), manualSeason = select('Manual season', ['spring','summer','autumn','winter']);
    const componentTheme = select('Component theme',Object.keys(COMPONENT_THEMES));
    const name = input('New profile name', 'text'); name.maxLength = 40;
    const font = select('Font', ['system','serif','mono','gothic']), size = input('Font size', 'number', 10, 28);
    const background = input('Background', 'color'), text = input('Text', 'color'), accent = input('Accent', 'color'), spacing = input('Spacing', 'number', 0, 32);
    currentFields = effectFields;
    const effects = select('Effects', ['off','reduced','full']), sound = input('Sound after gesture', 'checkbox'), presentation = select('Receipt placement', ['inline','margin']);
    // The basics stay in view; the receipt's look sits behind one disclosure.
    const lookBox = document.createElement('details'); lookBox.className = 'customization-look';
    const lookSummary = document.createElement('summary'); lookSummary.textContent = 'Receipt look'; const lookBody = document.createElement('div'); lookBody.className = 'ui-field-grid'; lookBox.append(lookSummary, lookBody); effectFields.append(lookBox); currentFields = lookBody;
    const motif = select('Original VFX motif', ['receipt','seal','guidance','closing']), duration = input('Receipt duration (ms)', 'number', 200, 10000);
    const effectColor = input('VFX color', 'color'), effectBackground = input('VFX background', 'color'), staticMode = input('Static VFX', 'checkbox'), plain = input('Plain text VFX', 'checkbox');
    // Per-browser display settings sit outside the save-bound fieldset, so they stay usable when the save is read-only.
    const displaySettings = mountDisplaySettings(effectSurface.body);
    const button = (label, callback) => { const node = document.createElement('button'); node.type = 'button'; node.textContent = label; node.addEventListener('click', callback); actions.append(node); return node; };
    const componentPreview=document.createElement('section');componentPreview.className='theme-preview';componentPreview.setAttribute('aria-label','Component theme preview');
    const previewModule=document.createElement('div');componentPreview.append(previewModule);(previewContainer||body).append(componentPreview);
    previewModule.innerHTML='<h4>Draft component preview · sample controls</h4><nav class="theme-preview-tabs" aria-label="Sample tabs"><button type="button" aria-pressed="true">Selected tab</button><button type="button">A longer comparison label</button></nav><div class="theme-action-row"><button type="button">Inspect sample action</button><button type="button" disabled>Unavailable action</button></div><label>Sample input <input value="Readable text and numbers" readonly></label><table><thead><tr><th>Sample material</th><th>Amount</th></tr></thead><tbody><tr><td>Prepared component</td><td>12 units</td></tr></tbody></table><p class="theme-warning">Warning: sample requirement unmet.</p><p class="theme-danger">Error: sample write unavailable.</p>';
    const knownFacts=document.createElement('dl');previewModule.append(knownFacts);const contrastNotice=document.createElement('p');componentPreview.append(contrastNotice);
    let previewSignature='';
    function renderPreview(){
        const facts=readPreview(),signature=JSON.stringify([draft,target,season(),facts]);if(previewSignature===signature)return;previewSignature=signature;
        applyCustomizationProfile(draft,{season:season(),moduleNodes:{[target||'customization']:previewModule}});
        knownFacts.replaceChildren();for(const fact of facts){const label=document.createElement('dt'),value=document.createElement('dd');label.textContent=fact.label;value.textContent=fact.value;knownFacts.append(label,value);}
        contrastNotice.textContent=previewModule.dataset.contrastRecovered==='1'?'Low contrast palette: readable text and accent recovered on live components. Reset draft restores defaults.':'Draft preview only. Apply activates component states. Cosmetic themes grant no powers.';
    }
    const jsonLabel = document.createElement('label'); jsonLabel.textContent = 'Profile import / export JSON '; const json = document.createElement('textarea'); json.rows = 8; json.spellcheck = false; jsonLabel.append(json); body.append(jsonLabel);
    const allowed = () => typeof canWrite === 'function' ? canWrite() : !!canWrite;
    const status = text => { appearance.notice.textContent = text; effectSurface.notice.textContent = text;for(const notice of [appearance.notice,effectSurface.notice])notice.dataset.themeState=/^(Not applied|Import rejected)/.test(text)?'error':text.startsWith('Read-only')?'warning':''; };
    const context = () => { effectContext.textContent = `${draft.active} · ${target || 'Whole profile'}${target && !EFFECT_MODULES.includes(target) ? ' · Effects apply to Ledger, crafting and skill discoveries only' : ''}`; };
    function editable() { fields.disabled = effectFields.disabled = busy || !allowed() || !validSaved; for (const node of [...actions.querySelectorAll('button[data-write]'), ...effectSurface.actions.querySelectorAll('button[data-write]')]) node.disabled = busy || !allowed() || !validSaved; }
    function render() {
        profile.replaceChildren(); for (const key of Object.keys(draft.profiles)) { const node = document.createElement('option'); node.value = key; node.textContent = key; profile.append(node); } profile.value = draft.active;
        context();
        module.value = target; theme.value = draft.theme.mode; manualSeason.value = draft.theme.season;
        const settings = mergePresentationSettings(draft.profiles[draft.active].settings, draft.profiles[draft.active].modules[target]);
        renderedSettings = structuredClone(settings);
        componentTheme.value=settings.componentTheme||'neutral';
        font.value = settings.typography.font; size.value = settings.typography.size;
        background.value = settings.palette.background; text.value = settings.palette.text; accent.value = settings.palette.accent; spacing.value = settings.spacing;
        effects.value = settings.effects; sound.checked = settings.sound; presentation.value = settings.presentation;
        motif.value = settings.effectDefinition.motif; duration.value = settings.effectDefinition.duration; effectColor.value = settings.effectDefinition.color; effectBackground.value = settings.effectDefinition.background; staticMode.checked = settings.effectDefinition.static; plain.checked = settings.effectDefinition.plain;
        manualSeason.disabled = draft.theme.mode !== 'manual';
        for(const node of [effects,sound,presentation,motif,duration,effectColor,effectBackground,staticMode,plain])node.disabled=!!target&&!EFFECT_MODULES.includes(target);
        editable();renderPreview();
    }
    function capture() {
        const settings = {componentTheme:componentTheme.value,typography: {font: font.value, size: Number(size.value)}, palette: {background: background.value, text: text.value, accent: accent.value}, spacing: Number(spacing.value), effects: effects.value, sound: sound.checked, presentation: presentation.value, effectDefinition: {motif: motif.value, duration: Number(duration.value), color: effectColor.value, background: effectBackground.value, static: staticMode.checked, plain: plain.checked}};
        const next = structuredClone(draft); next.theme = {mode: theme.value, season: manualSeason.value};
        if (target) {
            const inherited = next.profiles[next.active].settings;
            const override = next.profiles[next.active].modules[target] || {};
            // Visiting a module retains its partial override. Only edited leaves
            // diverge from the rendered snapshot, so inheritance stays live.
            for (const [key, value] of Object.entries(settings)) {
                if (typeof value === 'object') {
                    for (const [field, leaf] of Object.entries(value)) {
                        if (leaf === renderedSettings[key][field]) continue;
                        if (leaf === inherited[key][field]) {
                            if (override[key]) { delete override[key][field]; if (!Object.keys(override[key]).length) delete override[key]; }
                        } else { override[key] ||= {}; override[key][field] = leaf; }
                    }
                } else if (value !== renderedSettings[key]) {
                    if (value === inherited[key]) delete override[key]; else override[key] = value;
                }
            }
            if (Object.keys(override).length) next.profiles[next.active].modules[target] = override;
            else delete next.profiles[next.active].modules[target];
        } else next.profiles[next.active].settings = settings;
        draft = validateCustomizationState(next);
        renderedSettings = structuredClone(settings);
    }
    function changed() { try { capture(); context(); status('Draft changed. Apply saves and activates it.'); } catch (error) { status(error.message); } }
    for (const node of [theme,manualSeason,font,size,background,text,accent,spacing,effects,sound,presentation,motif,duration,effectColor,effectBackground,staticMode,plain]) node.addEventListener('change', changed);
    componentTheme.addEventListener('change',()=>{const preset=COMPONENT_THEMES[componentTheme.value];background.value=preset.background;text.value=preset.text;accent.value=preset.accent;changed();render();});
    for(const node of [size,spacing,background,text,accent])node.addEventListener('input',changed);
    theme.addEventListener('change', () => { manualSeason.disabled = theme.value !== 'manual'; });
    profile.addEventListener('change', () => { try { capture(); draft.active = profile.value; render(); status('Draft profile selected. Apply to activate.'); } catch (error) { status(error.message); } });
    module.addEventListener('change', () => { try { capture(); target = module.value; render(); status(target ? `Editing ${target} override. Apply to save.` : 'Editing whole profile. Apply to save.'); } catch (error) { status(error.message); } });
    const create = button('Create profile draft', () => { try { capture(); const next = structuredClone(draft); if (Object.hasOwn(next.profiles, name.value)) throw new Error('Choose a new profile name.'); next.profiles[name.value] = structuredClone(next.profiles[next.active]); next.active = name.value; draft = validateCustomizationState(next); render(); status('New profile draft. Apply to save.'); } catch (error) { status(error.message); } }); create.dataset.write = 'true';
    const luminousDraft = button('Luminous Gothic draft', () => { try { capture(); draft = createLuminousGothicDraft(draft); target = ''; render(); status('Luminous Gothic profile draft created. Apply to save and activate.'); } catch (error) { status(error.message); } }); luminousDraft.dataset.write = 'true';
    const apply = button('Apply and save', async () => {
        if (busy || !allowed()) return;
        try { capture(); busy = true; editable(); await save(structuredClone(draft)); if (disposed) return; status(`Saved ${draft.active}. Native season: ${season() || 'unavailable'}.`); }
        catch (error) { status(`Not applied: ${error.message}`); }
        finally { busy = false; if (!disposed) editable(); }
    }); apply.dataset.write = 'true';
    const reset = button('Reset draft', () => { if (target) delete draft.profiles[draft.active].modules[target]; else draft.profiles[draft.active].settings = defaultPresentationSettings(); render(); status('Default draft restored. Apply to save.'); }); reset.dataset.write = 'true';
    button('Discard draft', () => { refresh({force: true}); status('Restored saved presentation.'); });
    // GU6: the verified text sizes as one-step presets. Each sets the draft Font size and applies it
    // through the same Apply and save path, so the preset is the normal customization and nothing more.
    for (const px of [14, 17, 21]) {
        const preset = button(`Text size ${px}`, () => {
            // The preset saves the whole draft, so it refuses rather than commit edits made elsewhere,
            // and it applies to the whole profile, never to one native module's override.
            if (target) { status('Select "Whole profile" before using a text size preset.'); return; }
            try { capture(); } catch (error) { status(error.message); return; }
            const pending = JSON.stringify(validateCustomizationState(draft)) !== savedSignature;
            if (pending) { status('Apply or discard your other draft changes first; the preset saves the whole draft.'); return; }
            size.value = String(px); changed(); apply.click();
        });
        preset.dataset.write = 'true'; preset.dataset.textSizePreset = String(px); preset.title = `Set the font size to ${px}px and save it`;
    }
    const importButton = button('Import to draft', () => { try { draft = validateCustomizationState(JSON.parse(json.value)); target = ''; render(); status('Imported and validated draft. Apply to save.'); } catch (error) { status(`Import rejected: ${error.message}`); } }); importButton.dataset.write = 'true';
    button('Export draft JSON', () => { try { if (allowed()) capture(); json.value = JSON.stringify(validateCustomizationState(draft), null, 2); status('Export ready in the JSON field.'); } catch (error) { status(error.message); } });
    for (const [label, original] of [['Apply and save', apply], ['Reset draft', reset], ['Discard draft', [...actions.children].find(node => node.textContent === 'Discard draft')]]) {
        const node = document.createElement('button'); node.type = 'button'; node.textContent = label;
        if (original.dataset.write) node.dataset.write = 'true';
        node.addEventListener('click', () => original.click()); effectSurface.actions.append(node);
    }
    const preview = createSettledTextEffects({container:effectSurface.panel,readSettings:()=>getCustomizationSettings(draft,EFFECT_MODULES.includes(target)?target:'ledger',{season:season()})});
    let previewSequence=0;
    for(const [label,callback] of [['Preview receipt',()=>{try{capture();preview.gesture();preview.present({actorId:'preview',sequence:++previewSequence,type:target==='ledger'?'preview':'native-craft',motif:'seal',text:'Preview only. No work, reward or save.'},{anchor:effectContext});}catch(error){status(error.message);}}],['Cancel preview',()=>preview.cancel()]]) {
        const node=document.createElement('button');node.type='button';node.textContent=label;node.onclick=callback;effectSurface.actions.append(node);
    }
    function refresh({force = false} = {}) {
        try {
            const saved = validateCustomizationState(read()), signature = JSON.stringify(saved);
            validSaved = true;
            if (force || signature !== savedSignature) { draft = saved; target = ''; savedSignature = signature; render(); }
            else {editable();renderPreview();}
            const writable=allowed();if(!writable)status('Read-only: profile changes require the active save owner.');else if(lastAllowed===false)status('Saving available. Draft changes can now be applied.');lastAllowed=writable;
        } catch (error) { validSaved = false; editable(); status(error.message); }
    }
    refresh(); status(allowed() && validSaved ? 'Saved presentation. Changes here remain a draft.' : appearance.notice.textContent);
    return {refresh, destroy() { disposed = true; preview.cancel();componentPreview.remove();displaySettings?.destroy();panel.remove(); effectSurface.panel.remove(); }, getDraft: () => structuredClone(draft), getSettings: id => getCustomizationSettings(draft,id,{season:season()})};
}
