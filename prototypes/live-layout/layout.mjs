const layouts = [
    ['', 'Current'],
    ['item-beside', 'Compare beside Actions'],
    ['item-below', 'Compare below Actions'],
    ['item-journal', 'Compare below Journal'],
];

const root = document.documentElement;
const toolbar = document.createElement('label');
toolbar.id = 'layout-lab';
toolbar.append('Layout preview ');
const select = document.createElement('select');
for (const [id, title] of layouts) select.add(new Option(title, id));
const requested = new URLSearchParams(location.search).get('layout');
select.value = layouts.some(([id]) => id === requested) ? requested : '';
const update = () => {
    root.dataset.previewLayout = select.value;
    document.dispatchEvent(new CustomEvent('workspace-presentation-change'));
};
select.addEventListener('change', update);
update();
toolbar.append(select);

const mount = () => {
    const controls = document.querySelector('#game_bar > .game-bar-right');
    if (!controls) return false;
    controls.prepend(toolbar);
    return true;
};
if (!mount()) {
    const observer = new MutationObserver(() => {
        if (mount()) observer.disconnect();
    });
    observer.observe(document.body, {childList: true});
}
