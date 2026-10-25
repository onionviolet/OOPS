// Minimal MCP server over stdio (newline-delimited JSON-RPC 2.0), no packages.
// Covers what a tool server needs: initialize, ping, tools/list, tools/call.
// tool: {name, description, inputSchema, readOnly, handler(args) -> string | {text, data}}
const PROTOCOLS = ['2025-06-18', '2025-03-26', '2024-11-05'];

export function createServer({name, version, tools, instructions = ''}) {
    const byName = new Map(tools.map(t => [t.name, t]));
    const listing = tools.map(t => ({
        name: t.name, description: t.description, inputSchema: t.inputSchema ?? {type: 'object', properties: {}},
        annotations: {readOnlyHint: !!t.readOnly, openWorldHint: false},
    }));

    async function handle(message) {
        const {id, method, params} = message;
        const notification = id === undefined;
        const reply = result => notification ? null : {jsonrpc: '2.0', id, result};
        const fail = (code, text) => notification ? null : {jsonrpc: '2.0', id, error: {code, message: text}};
        switch (method) {
            case 'initialize': {
                const asked = params?.protocolVersion;
                return reply({
                    protocolVersion: PROTOCOLS.includes(asked) ? asked : PROTOCOLS[0],
                    capabilities: {tools: {}}, serverInfo: {name, version}, ...(instructions ? {instructions} : {}),
                });
            }
            case 'ping': return reply({});
            case 'tools/list': return reply({tools: listing});
            case 'tools/call': {
                const tool = byName.get(params?.name);
                if (!tool) return fail(-32602, `Unknown tool: ${params?.name}`);
                try {
                    const out = await tool.handler(params.arguments ?? {});
                    const text = typeof out === 'string' ? out : out.text;
                    return reply({content: [{type: 'text', text}], ...(out.data ? {structuredContent: out.data} : {}), isError: false});
                } catch (error) {
                    return reply({content: [{type: 'text', text: String(error.message ?? error)}], isError: true});
                }
            }
            default:
                if (notification) return null;   // notifications/initialized, cancelled, ...
                return fail(-32601, `Method not found: ${method}`);
        }
    }

    // Reads stdin lines, writes one JSON line per response. Requests run one at
    // a time so a game session never sees two calls at once.
    function listen(input = process.stdin, output = process.stdout) {
        let buffer = '';
        let chain = Promise.resolve();
        input.setEncoding('utf8');
        input.on('data', chunk => {
            buffer += chunk;
            let at;
            while ((at = buffer.indexOf('\n')) >= 0) {
                const line = buffer.slice(0, at).trim();
                buffer = buffer.slice(at + 1);
                if (!line) continue;
                chain = chain.then(async () => {
                    let message;
                    try { message = JSON.parse(line); } catch { output.write(JSON.stringify({jsonrpc: '2.0', id: null, error: {code: -32700, message: 'Parse error'}}) + '\n'); return; }
                    const response = await handle(message);
                    if (response) output.write(JSON.stringify(response) + '\n');
                });
            }
        });
        return new Promise(resolve => input.on('end', () => chain.then(resolve)));
    }

    return {handle, listen};
}
