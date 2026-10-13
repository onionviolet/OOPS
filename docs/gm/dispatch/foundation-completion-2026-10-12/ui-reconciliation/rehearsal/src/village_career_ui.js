import {registerWorkspaceModule, workspaceOwns, unregisterWorkspaceModule} from './workspace_layout.js';
import {CAREER_RANKS,KIT_DEBT,villagePromotionRequirements,villageColleagueMemory,WATCHCRAFT_BOOK,WATCHCRAFT_BONUS,WATCHCRAFT_PRACTICE, recruitMemory, TEACHING_TERMS} from './village_career.js';
const node=(tag,text='')=>{const n=document.createElement(tag);n.textContent=text;return n;};
// Lives inside the native center menu, including the ongoing patrol display.
export function createVillageCareerControls({read,resolve,promote,notes,readNotes,practice,mentor,tutor}) {
    const panel=node('section');panel.id='village_career_controls';
    const title=node('h4'),status=node('p'),memory=node('p'),requirements=node('p'),study=node('p'),outcome=node('p'),buttons=node('div'),error=node('p');study.id='village_watchcraft_status';outcome.id='village_watchcraft_outcome';
    const junior=node('p');junior.id='village_mentor_status';panel.append(title,status,memory,requirements,study,outcome,junior,buttons,error);let signature='';
    const action=(id,label,fn,disabled)=>{const b=node('button',label);b.type='button';b.id=id;b.disabled=disabled;b.onclick=()=>{try{fn();error.textContent='';}catch(e){error.textContent=e.message;}render();};return b;};
    function render() {
        const v=read();panel.hidden=!v.visible;
        if(!v.visible)return;
        const s=v.state,next=JSON.stringify([s,v.study,v.hasNotes,v.canWrite,v.busy,v.canTeach,v.recruitAlive]);
        if(next!==signature) {signature=next;title.textContent=`Village patrol · ${CAREER_RANKS[s.rank]}`;
            status.textContent=s.loan?.status==='active'?'Loaned lantern and baton in your custody. Finish the two-hour round for 50 base coins; leaving early earns no shift credit.':s.loan?`Kit ${s.debt?'debt: 50 coins':'return due'}. Return it before your next shift, or record a 50-coin debt if you keep it.`:'Take a loaned lantern and baton through the native patrol job below. Each full round pays 50 base coins; the report bonus is shown below.';
            memory.textContent=villageColleagueMemory(s);
            const unmet=villagePromotionRequirements(s);
            requirements.textContent=s.rank===2?'Mentor: all three career ranks earned.':`Next: ${CAREER_RANKS[s.rank+1]}. ${unmet.length?unmet.join(' '):'All requirements met. Ask Tessa for your promotion.'}`;
            const controls=[],disabled=!v.canWrite||v.busy;
            const w=v.study;
            study.textContent=`Watchcraft: known ${w.known?'yes':'no'} · practiced ${w.practiced?'yes':`no (${w.practiceMinutes}/${WATCHCRAFT_PRACTICE} meditation minutes)`} · executable now ${w.executable?'yes, loaned lantern and baton held on this round':'no'}.`;
            outcome.textContent=s.loan?.status==='active'?(w.executable?`This full round: 50 coins + ${WATCHCRAFT_BONUS} for a clear report = 60 coins. Leaving early pays nothing.`:'This full round: 50 coins. Watchcraft bonus unavailable on this round.'):
                w.nextPatrol?`Next full patrol with the loaned lantern and baton: 60 coins. Without that kit the method cannot execute.`:
                s.debt?'Next patrol blocked by kit debt. Return the kit or pay before borrowing another.':
                'Next full patrol: 50 coins. Read Tessa’s notes or learn from her in person, then rehearse calm sector scanning during five minutes of Village meditation for the tool-dependent report bonus.';
            junior.hidden=s.rank<2;
            junior.textContent=s.rank===2?`${recruitMemory(s)}${s.recruit?.soloRemaining?` ${s.recruit.covering?'Covered shift':'Solo round'}: ${s.recruit.soloRemaining}/120 minutes left. Pays ${s.recruit.covering?50:10} coins on return; progresses only while you are in Village.`:''}`:'';
            if(s.rank===2) {
                if(!s.recruit)controls.push(action('village_assign_recruit','Ask Tessa to assign Iona',()=>mentor('recruit'),disabled));
                else if(!v.recruitAlive)junior.textContent+=' Iona is no longer available for patrol.';
                else {
                    if(s.recruit.practiceMinutes<5) {
                        junior.textContent+=' Choose terms before teaching. Five shared teaching minutes block other activities; Time commits a fresh full two-hour shift. Paid mentor is the default.';
                        const labels={paid:'Paid mentor (default) · 5 teaching minutes · post pays +10 stipend · full round 70 coins',pay:'Teach on your shift · 5 minutes · 10 lost wages, you worked less · full round 50 coins',time:'Time · full fresh 120-minute teaching shift · no pay',favor:'Favor · 5 minutes · no coin cost · Iona owes one covered shift · full round 60 coins',free:'Free · 5 minutes · no coin cost or obligation · full round 60 coins'};
                        for(const term of TEACHING_TERMS)controls.push(action(`village_teach_${term}`,labels[term],()=>mentor(`teach:${term}`),!v.canTeach || !v.study.executable || !!s.loan?.teaching));
                    }
                    if(s.recruit.practiceMinutes===5 && s.recruit.soloRemaining===null) {
                        controls.push(action('village_recruit_solo','Send Iona on a solo patrol · 120 Village minutes · +10 coins',()=>mentor('solo'),disabled));
                        if(s.recruit.favors)controls.push(action('village_recruit_cover','Spend 1 favor · Iona covers 120-minute shift · +50 coins · no player career credit',()=>mentor('cover'),disabled));
                    }
                    if(s.recruit.tuition==='offered') {
                        controls.push(action('village_tuition_accept','Accept Iona’s tuition · +5 coins from her first solo stipend',()=>mentor('tuition:accepted'),disabled));
                        controls.push(action('village_tuition_decline','Decline Iona’s tuition · no coins or obligation',()=>mentor('tuition:declined'),disabled));
                    }
                }
            }
            if(s.loan?.teaching)outcome.textContent={paid:'Paid mentor: full round 60 coins + 10 teaching stipend = 70. Leaving early pays nothing.',pay:'Taught on your shift: full round 60 − 10 lost wages (you patrolled less) = 50 coins. No fee paid to Iona.',time:`Time: full fresh 120-minute shift earns no pay (${s.loan.teachingMinutes}/120).`,favor:'Favor: full round 60 coins, no coin cost. Completing the lesson earns one favor.',free:'Free: full round 60 coins, no cost or obligation. Only the teaching minutes block other activities.'}[s.loan.teachingTerm];
            if(s.watchcraft.tutoring)outcome.textContent=`Tessa’s in-person instruction: ${s.watchcraft.tutorMinutes}/6 meditation minutes. Leaving pauses it; resume Village meditation. No coin cost.`;
            if(s.rank>=1 && !w.known && !s.watchcraft.tutoring)controls.push(action('village_watchcraft_tutor','Learn from Tessa in person · 6 meditation minutes · no book or coin cost',tutor,disabled));
            if(s.rank>=1 && !s.watchcraft.notesIssued)controls.push(action('village_watchcraft_notes',`Ask Tessa for ${WATCHCRAFT_BOOK}`,notes,disabled));
            if(s.watchcraft.issued && !w.known)controls.push(action('village_watchcraft_read','Read watchcraft notes · 6 minutes',readNotes,disabled||!v.hasNotes));
            if(s.watchcraft.issued && !w.known && !v.hasNotes)outcome.textContent+=' Retrieve your notes from storage to read them.';
            if(w.known && !w.practiced)controls.push(action('village_watchcraft_practice','Rehearse watchcraft while meditating · 5 minutes',practice,disabled));
            if(s.loan && s.loan.status!=='active') {
                controls.push(action('village_return_kit','Return loaned kit',()=>resolve('return'),disabled));
                controls.push(s.debt?action('village_pay_debt',`Pay ${KIT_DEBT}-coin kit debt`,()=>resolve('pay'),disabled):action('village_keep_kit','Keep kit and record debt',()=>resolve('keep'),disabled));
            }
            if(s.rank<2)controls.push(action('village_promotion',`Ask Tessa: ${CAREER_RANKS[s.rank+1]}`,promote,disabled||!!unmet.length));
            buttons.replaceChildren(...controls);
        }
        const host=document.getElementById('location_actions_div');if(host && !workspaceOwns(panel) && panel.parentElement!==host)host.append(panel);
    }
    render();registerWorkspaceModule({id:'patrol',title:'Patrol & custody',node:panel,home:'right',eligible:()=>!panel.hidden});const timer=setInterval(render,250);return {render,destroy:()=>{clearInterval(timer);unregisterWorkspaceModule('patrol');panel.remove();}};
}
