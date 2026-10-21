// The words a control shows, without the icon ligatures (Material Icons print their name as text,
// "check_box_outline_blank") and without tooltips. Reads a clone, so the page is not touched.
export function visibleText(node) {
    const clone = node.cloneNode(true);
    // Icons, tooltips and controls nested inside this one (a dropdown's choices) are not its label.
    clone.querySelectorAll('.material-icons, [class*="icon"], [aria-hidden="true"], .item_tooltip, .tooltip, button, [role="button"]').forEach(n => n.remove());
    return clone.textContent.replace(/\s+/g, ' ').trim();
}
export const controlLabel = node => (node.getAttribute('aria-label') || visibleText(node) || node.title || '').replace(/\s+/g, ' ').trim();
