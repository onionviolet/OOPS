// Mark an existing fact by what its words mean. The shared theme supplies the ink.
export function semanticInk(node, role) {
    if (role) node.dataset.semanticInk = role;
    else delete node.dataset.semanticInk;
    return node;
}
