import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {dirname,resolve,extname,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=dirname(fileURLToPath(import.meta.url));
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.png':'image/png'};
const server=createServer(async(req,res)=>{
  try{
    const path=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    const file=resolve(root,`.${path==='/'?'/index.html':path}`);
    if(!file.startsWith(root+sep)){res.writeHead(403);res.end();return;}
    const body=await readFile(file);
    res.writeHead(200,{'Content-Type':types[extname(file)]||'application/octet-stream','Cache-Control':'no-store','Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; connect-src 'self'; frame-src 'self'; object-src 'none'; base-uri 'none'"});res.end(body);
  }catch{res.writeHead(404);res.end('Not found');}
});
// Port 0 always gives this run a fresh origin. Do not point it at a gameplay origin.
server.listen(0,'127.0.0.1',()=>console.log(`YAIR mockup workbench: http://127.0.0.1:${server.address().port}/`));
