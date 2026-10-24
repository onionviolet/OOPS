// Usage (from the worktree root): node docs/gm/dispatch/o-f-a-proof-2026-10-23/b/serve-and-run.cjs <script.cjs>
// Serves the worktree root (built dist untouched) on a fresh port, runs the script with URL set, then stops the server.
const http=require('node:http'),fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process');
const root=process.cwd(),types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.map':'application/json','.woff2':'font/woff2','.svg':'image/svg+xml'};
const server=http.createServer((req,res)=>{const u=decodeURIComponent(req.url.split('?')[0]),f=path.join(root,u==='/'?'index.html':u);
 if(!f.startsWith(root)||!fs.existsSync(f)||fs.statSync(f).isDirectory()){res.writeHead(404);return res.end();}
 res.writeHead(200,{'content-type':types[path.extname(f)]||'application/octet-stream'});fs.createReadStream(f).pipe(res);});
server.listen(0,'127.0.0.1',()=>{const url=`http://127.0.0.1:${server.address().port}/`;console.log('serving',url);
 const c=cp.spawn('node',process.argv.slice(2),{stdio:'inherit',env:{...process.env,URL:url,YAIRPG_PROOF_DIR:path.join(__dirname,'evidence')}});
 c.on('exit',code=>{server.close();process.exit(code||0);});});
