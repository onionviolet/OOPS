// Static server on an OS-assigned port. Usage: node serve.cjs <root>; prints port.
const http=require('node:http'),fs=require('node:fs'),path=require('node:path');const root=path.resolve(process.argv[2]);
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.svg':'image/svg+xml','.map':'application/json','.woff2':'font/woff2'};
const s=http.createServer((q,r)=>{let p=decodeURIComponent(q.url.split('?')[0]);if(p.endsWith('/'))p+='index.html';const f=path.join(root,p);if(!f.startsWith(root)){r.writeHead(403);return r.end();}
fs.readFile(f,(e,d)=>{if(e){r.writeHead(404);return r.end();}r.writeHead(200,{'content-type':types[path.extname(f)]||'application/octet-stream','cache-control':'no-store'});r.end(d);});});
s.listen(0,'127.0.0.1',()=>{console.log(s.address().port);});
