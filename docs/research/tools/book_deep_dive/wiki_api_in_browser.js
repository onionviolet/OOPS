// Fandom/MediaWiki wikis often return HTTP 403 to scripted fetches.
// Route that works: open any page of the wiki in the in-app browser, then run
// these snippets with the browser's javascript tool (same-origin API calls).
// Record the revid of every page you cite.

// 1. List a category.
const cat = async c => (await (await fetch(`/api.php?action=query&list=categorymembers&cmtitle=${encodeURIComponent(c)}&cmlimit=200&format=json`)).json()).query.categorymembers.map(x => x.title);

// 2. Raw wikitext plus revision id.
const wikitext = async t => { const p = (await (await fetch(`/api.php?action=parse&page=${encodeURIComponent(t)}&prop=wikitext|revid&format=json`)).json()).parse; return { revid: p.revid, text: p.wikitext['*'] }; };

// 3. Rendered text of a template or Lua module call (for data kept in modules).
const render = async wt => { const h = (await (await fetch(`/api.php?action=parse&contentmodel=wikitext&prop=text&format=json&text=${encodeURIComponent(wt)}`)).json()).parse.text['*']; const d = document.createElement('div'); d.innerHTML = h; return d.textContent.replace(/\s+/g, ' ').trim(); };

// 4. Infobox field and one section from a rendered page.
const pageParts = async (t, field, sectionRe) => {
  const h = (await (await fetch(`/api.php?action=parse&page=${encodeURIComponent(t)}&prop=text&format=json`)).json()).parse.text['*'];
  const d = document.createElement('div'); d.innerHTML = h;
  const ib = d.querySelector(`[data-source="${field}"] .pi-data-value`);
  let sec = ''; const h2 = [...d.querySelectorAll('h2')].find(x => sectionRe.test(x.textContent));
  for (let n = h2 && h2.nextElementSibling; n && n.tagName !== 'H2'; n = n.nextElementSibling) sec += ' ' + n.textContent;
  return { field: ib ? ib.textContent.trim() : '', section: sec.replace(/\s+/g, ' ').trim() };
};
