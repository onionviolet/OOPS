import {registerPanelSettings} from './display_settings.js';
import {registerWorkspaceModule} from './workspace_layout.js';

const roleIcons = {actions: '⚔', character: '◆', records: '▤', log: '≡', optional: '✧'};

// Keep discovery, reveal and layout ownership in the workspace registry.
export function definePanel({id, title, role, node, home, discovered, eligible,
    unavailableReason, settings = [], emptyText, after, defaultDock}) {
    if (!Object.hasOwn(roleIcons, role)) throw new Error(`Unknown panel role: ${role}`);
    let settingsRegistered = false;
    return registerWorkspaceModule({id, title, node, home, discovered, eligible,
        unavailableReason: unavailableReason || (() => emptyText || 'This panel has no content here'), after, defaultDock, decorateShell(shell, known) {
            if (known && settings.length && !settingsRegistered) {
                settingsRegistered = true; registerPanelSettings({id, title, settings});
            }
            shell.dataset.panelKit = '1'; shell.dataset.panelRole = role;
            shell.setAttribute('role', 'region');
            if (known) {
                shell.setAttribute('aria-label', title); shell.removeAttribute('aria-labelledby');
            } else {
                // A generic referenced label keeps hidden content out of label text scans.
                let label = shell.querySelector('[data-panel-pending-label]');
                if (!label) {
                    label = document.createElement('span'); label.id = `panel-pending-${id}`;
                    label.dataset.panelPendingLabel = ''; label.hidden = true; label.textContent = 'Panel'; shell.append(label);
                }
                shell.removeAttribute('aria-label'); shell.setAttribute('aria-labelledby', label.id);
            }
            let icon = shell.querySelector('[data-panel-role-icon]');
            if (!icon) {
                icon = document.createElement('span'); icon.dataset.panelRoleIcon = '';
                icon.setAttribute('aria-hidden', 'true'); icon.textContent = roleIcons[role];
                shell.querySelector('.workspace-module-header > strong').before(icon);
            }
        }});
}
