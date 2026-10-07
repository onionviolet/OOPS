const openNotebook = async page => {
    await page.locator('#journal_show_notebook').waitFor({state:'visible'});
    if(!await page.locator('#notebook_box_div').isVisible()) await page.locator('#journal_show_notebook').click();
};
module.exports = {openNotebook};
