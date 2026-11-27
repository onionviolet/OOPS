import {CH128_COMMISSION_REMAINDER} from '../lotm_personal_earmark.js';
export function renderPersonalShopping(view,{revise,buy,run,node}) {
    const box=node('section');box.dataset.lotmPersonalShopping='';
    box.append(node('h3','Commission money and shopping'),node('p',`Cash in your purse: ${view.total} pence. Intended commission remainder: ${view.earmark} pence. Available after that intention: ${view.available} pence.`),
        node('p','The money stays in your purse. You can change your intention or spend into it; the unpaid commission does not settle itself.'));
    if(view.shortfall)box.append(node('p',`Your purse is ${view.shortfall} pence short of your intended remainder.`));
    const form=node('form'),label=node('label','Keep for the commission, in pence '),input=node('input');input.type='number';input.min='0';input.step='0.5';input.value=String(view.earmark);input.dataset.lotm='commission-earmark-input';label.append(input);
    const save=node('button','Revise intended remainder');save.type='submit';save.dataset.lotm='commission-earmark-save';
    form.append(label,save);form.onsubmit=event=>{event.preventDefault();run(()=>revise(input.value===''?NaN:Number(input.value)),'Commission intention revised. Your cash is unchanged.');};
    const source=node('button','Set aside four pounds');source.type='button';source.dataset.lotm='commission-earmark-four';source.onclick=()=>run(()=>revise(CH128_COMMISSION_REMAINDER),'Four pounds intended for the commission. Your cash is unchanged.');
    const clear=node('button','Clear the intention');clear.type='button';clear.dataset.lotm='commission-earmark-clear';clear.onclick=()=>run(()=>revise(0),'Commission intention cleared. No payment was made.');form.append(source,clear);box.append(form);
    const quote=view.quote;
    if(quote){box.append(node('p',`Workshop offer: silver blank and ritual supplies together, ${quote.cost} pence. After purchase: ${quote.afterTotal} pence cash, ${view.earmark} pence intended for the commission, ${quote.afterAvailable} pence available after that intention.`));
        if(quote.afterShortfall)box.append(node('p',`This purchase leaves your intended commission remainder short by ${quote.afterShortfall} pence. You can revise it above or spend the money anyway.`));
        const button=node('button',quote.afterShortfall?'Buy supplies using intended commission money':'Buy the quoted supplies');button.type='button';button.dataset.lotm='commission-shopping-buy';button.disabled=!quote.eligible;button.onclick=()=>run(()=>buy(quote.id),'Supplies ordered. The payment comes from your purse.');box.append(button);
        if(!quote.eligible)box.append(node('p',quote.reasons.join(' ')));
        box.append(node('p','This order brings one blank and one packet of herbs and minerals. A larger basket needs its own quote.'));
    }
    return box;
}
