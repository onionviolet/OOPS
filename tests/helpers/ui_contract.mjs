import {readFileSync,readdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {join,relative} from 'node:path';
const color= /#[\da-f]{3,8}\b|rgba?\([^)]*\)/gi;
const literalSpacing=v=>/(?<![\w.-])-?(?:\d*\.)?\d*[1-9]\d*(?:\.\d+)?(?:px|em|rem)\b/.test(v.replace(/var\([^()]*(?:\([^()]*\)[^()]*)*\)/g,''));
export function scanUiText(text) {
    const hits=[];
    const add=(rule,snippet)=>hits.push({rule,snippet:snippet.trim()});
    // Exact declarations, including token consumers, stay reviewable in the ledger.
    for(const m of text.matchAll(/(?:border-radius|font-family)\s*:[^;\n}]+/g))add('declaration',m[0]);
    for(const m of text.matchAll(color))add('color',m[0]);
    // UR65: spacing comes from --ui-space-*; zero, auto, percentages and tokens pass.
    for(const m of text.matchAll(/(?<![\w-])(?:padding|margin|gap|row-gap|column-gap)(?:-(?:top|right|bottom|left|inline|block)(?:-(?:start|end))?)?\s*:[^;\n}"'`]+/g))
        if(literalSpacing(m[0]))add('spacing',m[0]);
    // JS forms: el.style.paddingTop='4px' and {padding:'4px'}.
    for(const m of text.matchAll(/(?<![\w-])(?:padding|margin|gap|rowGap|columnGap)(?:Top|Right|Bottom|Left|Inline|Block)?(?:Start|End)?\s*[:=]\s*(['"`])([^'"`\n]*)\1/g))
        if(literalSpacing(m[2]))add('spacing',m[0]);
    // UR67: stacking order comes from --ui-layer-*.
    for(const m of text.matchAll(/(?<![\w-])z-index\s*:\s*-?\d+/g))add('layer',m[0]);
    for(const m of text.matchAll(/\bzIndex\s*=\s*['"`]?-?\d+/g))add('layer',m[0]);
    // UR68: size, leading and weight come from the type tokens.
    for(const m of text.matchAll(/(?<![\w-])(?:font-size|line-height|font-weight)\s*:[^;\n}"'`]+/g))
        if(!/^[\w-]+\s*:\s*(?:inherit|normal|initial|unset|0|1|var\([^;]*\))\s*(?:!\s*important)?\s*$/.test(m[0].trim()))add('type',m[0]);
    // DL10 / P08: transition and animation timing comes from --ui-motion-*, so reduced motion is one switch.
    for(const m of text.matchAll(/(?<![\w-])(?:transition|animation)(?:-duration)?\s*:[^;\n}"'`]+/g))
        if(/(?<![\w.-])(?:\d*\.)?\d+m?s\b/.test(m[0].replace(/var\([^()]*\)/g,'')))add('motion',m[0]);
    // UR66: controls take their height from --ui-control-*.
    for(const m of text.matchAll(/([^{}]*)\{([^{}]*)\}/g)){
        if(!/(?:button|select|summary|input|\[role=["']?button|\btab\b|-tab\b|-button\b|\bbtn\b)/i.test(m[1]))continue;
        for(const d of m[2].matchAll(/(?<![\w-])(?:min-)?height\s*:[^;\n}]+/g))if(literalSpacing(d[0]))add('control-height',d[0]);
    }
    for(const line of text.split('\n'))if(/\.style\.cssText\s*=/.test(line))add('cssText',line);
    // UR128-UR138 guards from the 2026-11-10 element fixes (UI audit round 45).
    // UR130: a clickable div in markup is a button that keyboards cannot reach.
    for(const m of text.matchAll(/<div\b[^>]*\bonclick\s*=/gi))add('clickable-div',m[0]);
    // UR131: fills and sizes come from fractions or tokens, not from a fixed pixel width.
    for(const m of text.matchAll(/\.style\.(?:width|height|minWidth|maxWidth)\s*=\s*(?:[^;\n%]*\b\d+\s*\*[^;\n%]*px|['"`](?:[1-9]\d*(?:\.\d+)?|0?\.\d+)px['"`])/g))add('pixel-geometry',m[0]);
    // UR133: a blocking screen makes the whole page inert, not one region.
    for(const m of text.matchAll(/\bmain_content\??\.inert\s*=/g))add('partial-inert',m[0]);
    // Detect both direct foreign-host writes and aliases obtained by DOM lookup.
    const hosts=new Set([...text.matchAll(/(?:const|let|var)\s+(\w+)\s*=\s*(?:document|root)\.getElementById\(/g)].map(m=>m[1]));
    for(const line of text.split('\n'))if(/(?:getElementById\([^;]+|(?:document|root)\.querySelector\([^;]+)\??\.(?:prepend|append|appendChild)\(/.test(line)||[...hosts].filter(host=>!new RegExp(`(?:const|let)\\s+${host}\\s*=\\s*projectsHome\\(`).test(line)).some(host=>new RegExp(`\\b${host}\\??\\.(?:prepend|append|appendChild)\\(`).test(line)))add('foreign-host',line);
    return hits;
}
export function uiViolations(root) {
    const walk=dir=>readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(join(dir,e.name)):[join(dir,e.name)]);
    const files=[join(root,'style.css'),join(root,'index.html'),...walk(join(root,'styles')),...walk(join(root,'src'))].filter(p=>/\.(?:css|js|html)$/.test(p)&&!p.endsWith('/styles/ui_tokens.css'));
    const counts=new Map();
    for(const file of files)for(const hit of scanUiText(readFileSync(file,'utf8'))){
        const path=relative(root,file),key=path+'|'+hit.rule+'|'+createHash('sha256').update(hit.snippet).digest('hex').slice(0,16);
        const old=counts.get(key);if(old)old.count++;else counts.set(key,{key,path,...hit,count:1});
    }
    return [...counts.values()].sort((a,b)=>a.key.localeCompare(b.key));
}
