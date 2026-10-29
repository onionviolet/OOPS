// A disposable same-origin game instance tests the real loader without saving/running.
export function preflightImport(save) {
    return new Promise((resolve, reject) => {
        const token = crypto.randomUUID();
        const frame = document.createElement("iframe");
        frame.hidden = true;
        frame.title = "Save compatibility check";
        const url = new URL(window.location.href);
        url.searchParams.set("import_probe", token);
        frame.src = url.href;
        let submitted = false;
        const finish = error => {
            clearTimeout(timer);
            window.removeEventListener("message", receive);
            frame.remove();
            if(error) reject(error); else resolve();
        };
        const receive = event => {
            if(event.origin !== window.location.origin || event.source !== frame.contentWindow || event.data?.token !== token) return;
            if(event.data.type === "save-probe-ready" && !submitted) {
                submitted = true;
                frame.contentWindow.postMessage({type: "save-probe-load", token, save}, window.location.origin);
            } else if(event.data.type === "save-probe-result" && submitted) {
                finish(event.data.ok ? null : new Error(event.data.error || "This save cannot be loaded by this build."));
            }
        };
        // The real loader shares browser resources with the current game. A
        // progressed save can need longer to load without being incompatible.
        // Keep the probe bounded and preserve the current save on any failure.
        const timer = setTimeout(() => finish(new Error("Save compatibility check did not finish; current save kept.")), 60000);
        window.addEventListener("message", receive);
        document.body.append(frame);
    });
}

export function installImportProbe(token, load) {
    let handled = false;
    window.addEventListener("message", event => {
        if(handled || event.source !== window.parent || event.origin !== window.location.origin ||
            event.data?.token !== token || event.data.type !== "save-probe-load") return;
        handled = true;
        const warnings = [];
        const warn = console.warn, error = console.error;
        console.warn = (...args) => warnings.push(args);
        console.error = (...args) => warnings.push(args);
        let message;
        try {
            const result = load(event.data.save);
            if(result?.warnings || warnings.length) throw new Error("This save contains data this build cannot load completely.");
            message = {ok: true};
        } catch {
            message = {ok: false, error: "This save contains incompatible or malformed game data. Current save kept."};
        } finally {
            console.warn = warn; console.error = error;
        }
        window.parent.postMessage({type: "save-probe-result", token, ...message}, window.location.origin);
    });
    window.parent.postMessage({type: "save-probe-ready", token}, window.location.origin);
}

// Creates a genuine native fresh beginning in a disposable, non-saving instance.
export function freshNativeSave({be=false}={}) {
    return new Promise((resolve,reject)=>{
        const token=crypto.randomUUID(),frame=document.createElement('iframe'),url=new URL(window.location.href);
        frame.hidden=true;frame.title='Fresh native beginning check';url.searchParams.set('import_probe',token);url.searchParams.set('authority_fresh','1');if(be)url.searchParams.set('be_fresh','1');frame.src=url.href;
        const finish=(error,bytes)=>{clearTimeout(timer);window.removeEventListener('message',receive);frame.remove();if(error)reject(error);else resolve(bytes);};
        const receive=event=>{if(event.origin===window.location.origin&&event.source===frame.contentWindow&&event.data?.token===token&&event.data.type==='save-fresh-result')finish(typeof event.data.serialized==='string'?null:new Error(`The new life could not start: ${event.data.error||'the fresh beginning could not be created'}. Your current save is kept.`),event.data.serialized);};
        const timer=setTimeout(()=>finish(new Error('Fresh beginning check timed out; current authority kept.')),60000);window.addEventListener('message',receive);document.body.append(frame);
    });
}
