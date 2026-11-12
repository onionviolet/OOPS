// Expression slots preserve the difference between a fixed part and a
// reference that changes with the selected target.
export function bindSpellExpression(entry, targets) {
    return entry.expression.grammar.map(({part, binding, optional})=>{
        if(part!==undefined) return entry.expression.parts[part];
        return {role:'target reference', target:targets[binding], optional:optional===true};
    });
}

// Compile an ordered working against one world's rules. The plan contains
// resolved roles and operation order. Native owners still settle the attempt.
export function compileSpellWorking(steps, dictionary, worldRules) {
    if(!Array.isArray(steps) || steps.length===0) throw Error('Choose at least one method.');
    return steps.flatMap(({method, revision, bindings}, index)=>{
        const entry = dictionary.find(row=>row.id===method && row.revision===revision && row.world===worldRules.world);
        if(!entry) throw Error('This world does not have that version of the method.');
        const targets = {};
        for(const {name,type} of entry.roles){
            const target = worldRules.target(bindings?.[name]);
            if(!target || target.type!==type) throw Error(`${entry.label} expects ${name} to be of type ${type}.`);
            targets[name]=target.id;
        }
        const expression = bindSpellExpression(entry, targets);
        return entry.operations.map(({operation, bindings: roles})=>{
            if(!Object.hasOwn(worldRules.operations,operation)) throw Error(`${entry.label} needs an unavailable operation: ${operation}.`);
            const bound=Object.fromEntries(Object.entries(roles).map(([slot,name])=>{
                if(!Object.hasOwn(targets,name)) throw Error(`${operation} refers to an undeclared role: ${name}.`);
                return [slot,targets[name]];
            }));
            return {step:index,method,revision,operation,bindings:bound,expression};
        });
    });
}

// Adjacent operations of a method can share one native transaction. Keep
// identical commands in different steps so repeated casts still pay and run.
export function nativeSpellSteps(plan, worldRules) {
    const commands = [];
    for(const operation of plan){
        const command = worldRules.operations[operation.operation](operation);
        if(!command) throw Error('That operation cannot reach the selected target here.');
        const previous = commands.at(-1);
        if(previous?.step===operation.step && previous.command.id===command.id && previous.command.type===command.type) continue;
        commands.push({step:operation.step,command});
    }
    return commands;
}
