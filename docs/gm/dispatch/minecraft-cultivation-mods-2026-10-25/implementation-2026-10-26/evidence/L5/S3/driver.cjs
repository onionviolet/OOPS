const fs=require('node:fs/promises'),path=require('node:path'),{createServer}=require('node:http');
(async()=>{
 const cfg=JSON.parse(await fs.readFile(path.join(__dirname,'capture.json'),'utf8')),root=cfg.output;
 const server=createServer(async(req,res)=>{try{let f=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));if(f!==root&&!f.startsWith(root+'/')){res.writeHead(403).end();return;}if((await fs.stat(f)).isDirectory())f=path.join(f,'index.html');res.setHeader('Content-Type',({'.js':'text/javascript','.css':'text/css','.html':'text/html','.json':'application/json','.png':'image/png','.woff2':'font/woff2'})[path.extname(f)]||'application/octet-stream');res.end(await fs.readFile(f));}catch{res.writeHead(404).end();}});
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));process.env.URL=`http://127.0.0.1:${server.address().port}`;process.env.SOURCE_ROOT=cfg.source;process.env.BUNDLE_PATH=path.join(root,'dist/bundle.js');process.env.YAIRPG_PROOF_DIR='/Users/weiwei/.codex/research/minecraft-implementation-2026-10-26/L5/browser';
 await fs.writeFile(path.join(__dirname,'server.json'),JSON.stringify({pid:process.pid,url:process.env.URL,source:cfg.source,output:root},null,2));console.log('NATIVE START',process.env.URL);
 try{await require('./recipient.cjs');}finally{server.closeAllConnections();await new Promise(resolve=>server.close(resolve));}
})().catch(e=>{console.error(e.message);process.exitCode=1;});
