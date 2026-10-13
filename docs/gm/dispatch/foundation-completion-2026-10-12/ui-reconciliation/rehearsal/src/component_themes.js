// Original cosmetic directions. No world, actor or command authority.
export const COMPONENT_THEMES = {
    neutral: {label: 'Neutral', background: '#202a32', text: '#f1f4f5', accent: '#a9c8bd', radius: '4px', heading: 'system-ui, sans-serif'},
    arcane: {label: 'Arcane', background: '#292637', text: '#f4f0e7', accent: '#e1c783', radius: '6px', heading: 'Georgia, serif'},
    workshop: {label: 'Workshop', background: '#302b25', text: '#f4eee2', accent: '#ddbb88', radius: '2px', heading: 'system-ui, sans-serif'}
};
const rgb = hex => hex.slice(1).match(/../g).map(n => parseInt(n,16));
const hex = values => '#' + values.map(n => Math.round(n).toString(16).padStart(2,'0')).join('');
const mix = (a,b,t) => hex(rgb(a).map((v,i) => v*(1-t)+rgb(b)[i]*t));
const luminance = color => rgb(color).map(v => {v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;}).reduce((sum,v,i) => sum+v*[.2126,.7152,.0722][i],0);
export const contrast = (a,b) => (Math.max(luminance(a),luminance(b))+.05)/(Math.min(luminance(a),luminance(b))+.05);
const readable = (color, background, ratio=4.5) => contrast(color,background)>=ratio ? color : contrast('#ffffff',background)>contrast('#000000',background)?'#ffffff':'#000000';
export function componentThemeTokens(settings) {
    const theme = COMPONENT_THEMES[settings.componentTheme || 'neutral'];
    const background = settings.palette.background, text = readable(settings.palette.text,background);
    const light = luminance(background)>.35;
    const surface = mix(background, light?'#000000':'#ffffff', .07);
    const control = mix(background, light?'#000000':'#ffffff', .12);
    const accent = readable(settings.palette.accent,background);
    const warning = readable(light?'#793d00':'#ffd391',background);
    return {'--theme-bg':background,'--theme-surface':surface,'--theme-control':control,'--theme-text':text,
        '--theme-surface-text':readable(text,surface),'--theme-control-text':readable(text,control),'--theme-muted':readable(mix(text,background,.2),background),
        '--theme-accent':accent,'--theme-border':readable(mix(text,background,.45),background,3),
        '--theme-selected':accent,'--theme-selected-text':readable(text,accent),'--theme-focus':readable(light?'#713ce5':'#b9ddff',background,3),
        '--theme-warning':warning,'--theme-danger':readable(light?'#a11520':'#ffb2ba',background),
        '--theme-radius':theme.radius,'--theme-heading-font':theme.heading,
        '--theme-contrast-recovered':text!==settings.palette.text||accent!==settings.palette.accent?'1':'0'};
}
