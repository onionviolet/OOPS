// Present a draft without knowing its world, law, or execution entry point.
export function renderMethodEditor({element, operations, steps, change, limit}) {
    const editor = element('div');
    const order = element('ol');
    steps.forEach((id, index) => {
        const row = element('li', operations[id].label);
        const remove = element('button', 'Remove');
        remove.type = 'button';
        remove.setAttribute('aria-label', `Remove step ${index + 1}: ${operations[id].label}`);
        remove.onclick = () => change(steps.filter((_, position) => position !== index));
        row.append(remove);
        order.append(row);
    });
    editor.append(order);
    for(const [id, operation] of Object.entries(operations)) {
        const add = element('button', `Add: ${operation.label}`);
        add.type = 'button';
        add.disabled = steps.length >= limit;
        add.onclick = () => change([...steps, id]);
        editor.append(add);
    }
    return editor;
}
