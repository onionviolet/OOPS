// Display-only wording for a Condition row: what the effect does now and what eases it.
// Reads the effect's own tooltip text; decides nothing.
const EASES=Object.freeze({
    'Wet':'Get out of the rain. It dries about half an hour after the last soaking.',
    'Cold':'Lifts about an hour after the air is warm enough for you. Staying dry holds it off longer.',
    'Very cold':'Lifts about an hour after the air is warm enough for you. Staying dry holds it off longer.',
    'Freezing':'Lifts about an hour after the air is warm enough for you. Staying dry holds it off longer.',
});
export function effectSummary(html){
    return String(html||'').split(/<br\s*\/?>|<\/div>|<\/p>/i).map(part=>part.replace(/<[^>]*>/g,'').replace(/&nbsp;/g,' ').replace(/\s+/g,' ').trim())
        .filter(Boolean).map(part=>part.replace(/: x(\d)/g,': ×$1').replace(/, x(\d)/g,', ×$1').replace(/: -(\d)/g,': −$1')).join(' · ');
}
export function easesText(name){return EASES[name]||'';}
