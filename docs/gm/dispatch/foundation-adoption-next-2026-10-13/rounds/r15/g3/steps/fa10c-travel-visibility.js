// Compare travel-control visibility with and without a pending BOH job.
const vis = () => page.evaluate(() => [...document.querySelectorAll('[data-travel]')].map(b => {
  const style = getComputedStyle(b); let hiddenBy = null;
  for (let a = b; a; a = a.parentElement) { if (a.hidden || getComputedStyle(a).display === 'none') { hiddenBy = (a.id || a.className || a.tagName); break; } }
  return {t: b.dataset.travel, vis: !!b.offsetParent, hiddenBy};
}));
const during = await vis();
const done = await waitJobs();
const after = await vis();
const actionsBtn = await page.evaluate(() => [...document.querySelectorAll('button')].filter(b => /action|travel|location/i.test(b.textContent) && b.offsetParent).map(b => b.textContent.slice(0, 50)).slice(0, 12));
return {during, after, afterClock: done.clock, actionsBtn};
