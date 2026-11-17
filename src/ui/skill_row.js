// Skills box row behaviour (round 25, PS281, PS282; proposals). Presentation only, no state, no saved key.
// PS281: in a wide column the percent sits inside the bar's end; in a narrow one it stays beside the name. A CSS
// container query cannot decide this, because .skill_tooltip is position:fixed and container-type would make the row
// its containing block, so the list's own width sets data-skill-wide and styles/shell_layout.css reads it.
// PS282: a name the row cuts with an ellipsis shows in full on hover (the native title is set only while it is cut).
export const WIDE_EM = 22; // the list is wide at this many body-size characters

export function watchSkillColumn(list, win = globalThis) {
    if (!list || !win.ResizeObserver) return null;
    const set = () => {
        const size = parseFloat(win.getComputedStyle(list).fontSize) || 14;
        list.dataset.skillWide = String(list.clientWidth >= WIDE_EM * size);
    };
    const watcher = new win.ResizeObserver(set); watcher.observe(list); set();
    return watcher;
}

export function fullNameOnHover(list) {
    list?.addEventListener('pointerover', event => {
        const name = event.target.closest?.('.skill_bar_name');
        if (!name) return;
        if (name.scrollWidth > name.clientWidth + 1) name.title = name.textContent.trim(); else name.removeAttribute('title');
    });
}
