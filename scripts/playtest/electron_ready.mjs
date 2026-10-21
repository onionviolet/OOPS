// Wait for native startup before asking Playwright to act. Starting click's
// actionability loop against the hidden initial PLAY node is unreliable in a
// hidden Electron window, whose animation frames can be deferred.
export async function resumeElectronGame(page,{timeout=30000}={}) {
    await page.waitForFunction(()=>{
        if(typeof window.saveProgress!=='function')return false;
        const state=document.documentElement.dataset.startScreen;
        if(state==='closed')return true; // Respect the native skip-PLAY option.
        const play=document.getElementById('loading_screen_play_button');
        return state==='open'&&play&&!play.classList.contains('none_display')&&getComputedStyle(play).visibility!=='hidden';
    },null,{timeout,polling:100});
    if(await page.evaluate(()=>document.documentElement.dataset.startScreen==='open')){
        const play=page.locator('#loading_screen_play_button:not(.none_display)');
        await play.waitFor({state:'visible',timeout});
        await play.click({timeout});
    }
    await page.waitForFunction(()=>document.documentElement.dataset.startScreen==='closed',null,{timeout,polling:100});
}
