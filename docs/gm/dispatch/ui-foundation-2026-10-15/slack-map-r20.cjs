// R20 wrapper: runs slack-map-r16.cjs with a 900 s browser bound (r11-lib's 120 s cuts nine cases).
// Usage: R4_URL=… node slack-map-r20.cjs <label>   (writes evidence/r20/<label>/slack-map.md)
const L=require('./r11-lib.cjs');
const {chromium}=require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
L.launch=async()=>{const b=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});const t=setTimeout(()=>b.close(),900000);t.unref();b.on('disconnected',()=>clearTimeout(t));return b;};
process.argv[2]='../r20/'+(process.argv[2]||'slack');
require('./slack-map-r16.cjs');
