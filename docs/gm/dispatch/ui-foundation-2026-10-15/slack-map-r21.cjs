// R21 slack map (WX13) over the MB7 target set: runs slack-map-r16.cjs's measure with the target
// set (including the MacBook case at DPR 2) and a 900 s browser bound.
// Usage: R4_URL=… node slack-map-r21.cjs <label>   (writes evidence/r16/../r21/<label>/slack-map.md)
const fs=require('fs'),path=require('path'),Module=require('module');
const T=require('./target-set.cjs');
let src=fs.readFileSync(path.join(__dirname,'slack-map-r16.cjs'),'utf8');
src=src.replace("const TARGETS=[[1366,768,14],[1366,768,21],[1920,1080,21]];","const TARGETS=require('./target-set.cjs').targets().map(t=>[t.w,t.h,t.font,t.dpr]);")
 .replace("for(const [w,h,font] of TARGETS){const tag=`${fx}-${w}x${h}-${font}`;","for(const [w,h,font,dpr] of TARGETS){const tag=`${fx}-${w}x${h}${dpr>1?'@2x':''}-${font}`;")
 .replace("await L.open(b,{w,h,data})","await L.open(b,{w,h,data,dpr})")
 .replace("const {fs,path}=L;","const {fs,path}=L;L.launch=()=>require('./target-set.cjs').launch(1500);");
if(!src.includes("dpr})"))throw Error('slack-map-r16 changed shape');
process.argv[2]='../r21/'+(process.argv[2]||'slack');
const m=new Module(path.join(__dirname,'slack-map-r21-inner.cjs'),module);m.filename=m.id;m.paths=Module._nodeModulePaths(__dirname);m._compile(src,m.filename);
