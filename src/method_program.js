// An ordered method binds the output kind of each operation to the next input.
// World adapters own operation definitions, payment, and execution.
export function bindMethod(steps, operations, {input, output, limit}) {
    if(!Array.isArray(steps) || steps.length === 0 || steps.length > limit)
        throw Error(`Choose one to ${limit} operations.`);
    let kind = input;
    const bound = steps.map(id => {
        if(typeof id !== 'string' || !Object.hasOwn(operations, id)) throw Error('Choose an available operation.');
        const operation = operations[id];
        if(operation.input !== kind) throw Error(`${operation.label} needs ${operation.input}. The preceding step leaves ${kind}.`);
        kind = operation.output;
        return {id, ...operation};
    });
    if(kind !== output) throw Error(`The method must finish with ${output}.`);
    return bound;
}
