// Deliberately stalled public BrowserServer.close for the explicit lifecycle proof.
const path=require('node:path');
const {homedir}=require('node:os');
const real=require(process.env.YAIRPG_PLAYWRIGHT||path.join(homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')).chromium;
exports.chromium={
    connect:real.connect.bind(real),launch:real.launch.bind(real),
    launchServer:async options=>{
        const server=await real.launchServer(options);
        server.close=()=>new Promise(()=>{});
        return server;
    }
};
