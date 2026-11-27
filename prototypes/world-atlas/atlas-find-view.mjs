import { element as el } from "/canvas.mjs";
import {worldTitle} from '/library-views.mjs';
function displayWorld(worlds, id) {
  const indexed = worlds.find(world => world.id === id)?.label;
  if (indexed && indexed !== id) return indexed;
  const canonical = worldTitle(id);
  if (canonical !== id) return canonical;
  return worlds.find(world => world.id === id)?.label || id;
}
function findRoute({ q = "", type = "all", world = "", page = 1 } = {}) {
  const p = new URLSearchParams();
  if (q) p.set("q", q);
  if (type !== "all") p.set("type", type);
  if (world) p.set("world", world);
  if (page > 1) p.set("page", String(page));
  return "#find" + (p.size ? "?" + p : "");
}
function findState() {
  const p = new URLSearchParams(location.hash.startsWith("#find?") ? location.hash.split("?")[1] : "");
  return { q: p.get("q") || "", type: p.get("type") || "all", world: p.get("world") || "", page: Number(p.get("page") || 1) };
}
function mountFind(header) {
  const form = el("form");
  form.className = "atlas-find-global";
  form.setAttribute("role", "search");
  form.setAttribute("aria-label", "Find across the Atlas");
  const label = el("label", "Find in Atlas");
  label.htmlFor = "atlas-find-input";
  const input = el("input");
  input.id = "atlas-find-input";
  input.type = "search";
  input.name = "q";
  input.maxLength = 160;
  input.placeholder = "People, places, rules, systems, game routes, cheats, ideas\u2026";
  const submit = el("button", "Find");
  submit.type = "submit";
  form.append(label, input, submit);
  header.append(form);
  let edited = false;
  input.addEventListener("input", () => { edited = true; });
  const sync = () => {
    if (!location.hash.startsWith("#find")) return;
    const query = findState().q;
    // Clear queues a hashchange. A real input event can arrive before it;
    // preserve that new draft rather than writing the queued empty query.
    if (!query && edited) return;
    input.value = query;
    edited = false;
  };
  window.addEventListener("hashchange", sync);
  sync();
  form.onsubmit = (e) => {
    e.preventDefault();
    const previous = location.hash.startsWith("#find") ? findState() : {};
    location.hash = findRoute({ ...previous, q: input.value.trim(), page: 1 });
  };
  return form;
}
async function atlasFindView({ main }) {
  const state = findState(), shell = el("section");
  shell.className = "atlas-find-page";
  shell.append(el("h1", "Find in Atlas"));
  const controls = el("div");
  controls.className = "atlas-find-filters";
  const type = el("select"), world = el("select");
  type.id = "atlas-find-type";
  world.id = "atlas-find-world";
  type.setAttribute("aria-label", "Result type");
  world.setAttribute("aria-label", "Result world");
  for (const [id, label] of [
    ["all", "All result types"],
    ["subjects", "Subjects and places"],
    ["rules", "World rules"],
    ["cheats", "Cheat catalogue"],
    ["scenes", "Reader scenes"],
    ["routes", "Game route evidence"],
    ["vision", "Vision themes"],
    ["ideas", "Ideas and backlogs"],
    ["systems", "Systems and comparisons"]
  ]) {
    const o = el("option", label);
    o.value = id;
    type.append(o);
  }
  type.value = state.type;
  type.disabled = true;
  world.disabled = true;
  world.append(el("option", "Loading worlds…"));
  const typeLabel = el("label", "Result type");
  typeLabel.append(type);
  const worldLabel = el("label", "Result world");
  worldLabel.append(world);
  const clear = el("button", "Clear search");
  clear.type = "button";
  clear.onclick = () => {
    location.hash = findRoute();
    document.getElementById("atlas-find-input").value = "";
    document.getElementById("atlas-find-input").focus();
  };
  controls.append(typeLabel, worldLabel, clear);
  const status = el("p");
  status.className = "atlas-find-status";
  status.setAttribute("role", "status");
  status.textContent = state.q ? "Searching public Atlas records\u2026" : "Start with a name, a rule, or an ID such as CTC64.";
  const content = el("div"), pager = el("nav");
  pager.className = "atlas-find-pager";
  pager.setAttribute("aria-label", "Find result pages");
  shell.append(controls, status, content, pager);
  main.replaceChildren(shell);
  try {
    const response = await fetch("/atlas-find?" + new URLSearchParams({ ...state, page: String(state.page) }));
    if (!response.ok) throw Error("Find could not load. Refine the search and try again.");
    const data = await response.json();
    if (!shell.isConnected) return;
    const all = el("option", "All worlds");
    all.value = "";
    world.replaceChildren();
    world.append(all);
    for (const w of data.worlds) {
      const o = el("option", displayWorld(data.worlds, w.id));
      o.value = w.id;
      world.append(o);
    }
    world.value = state.world;
    type.disabled = false;
    world.disabled = false;
    type.onchange = world.onchange = () => {
      location.hash = findRoute({ ...state, type: type.value, world: world.value, page: 1 });
    };
    if (!state.q) {
      content.append(el(
        "div",
        "Try \u201CKlein\u201D, \u201CD20 test succeeds\u201D, or \u201CCTC64\u201D. You can search here from any section.",
        "atlas-find-empty"
      ));
      return;
    }
    const count = state.type === "all" ? data.total.toLocaleString() + " indexed results" : "Indexed results";
    const scope = state.world ? " in " + displayWorld(data.worlds, state.world) : "";
    status.textContent = `${count} for “${data.query}”${scope}.`;
    if (data.sourceScope?.unreadableReaderFiles) {
      content.append(el("p", "Some admitted reader projections could not be indexed. These results cover the available public index.", "atlas-find-scope"));
    }
    if (data.sourceScope?.playableRoutesUnavailable) content.append(el("p", "Game route evidence could not be loaded. Other public results remain available.", "atlas-find-scope"));
    if (!data.total) content.append(el("div", "No matching public indexed records. Unindexed and withheld reading rows are not searched. Try fewer words, another name, or All worlds / All result types.", "atlas-find-empty"));
    const layout = el("div");
    layout.className = "atlas-find-groups";
    for (const group of data.groups) {
      if (!group.total) continue;
      const section = el("section");
      section.className = "atlas-find-group";
      section.dataset.findGroup = group.id;
      const head = el("h2", group.label + " \xB7 " + group.total.toLocaleString());
      section.append(head);
      for (const r of group.rows) {
        const article = el("article");
        article.className = "atlas-find-result";
        const titleStem = r.label.replace(/(?:…|\.\.\.)$/, "").trim().toLocaleLowerCase();
        const repeatedRule = r.type === "rules" && r.summary.toLocaleLowerCase().startsWith(titleStem);
        if (repeatedRule) article.classList.add("atlas-find-rule-statement");
        const a = el("a", repeatedRule ? r.summary : r.label);
        a.href = r.href;
        a.dataset.findResult = r.id;
        const h = el("h3");
        h.append(a);
        article.append(h, el("p", `${displayWorld(data.worlds, r.world)} · ${r.kind}`, "atlas-find-meta"));
        if (!repeatedRule && r.summary) article.append(el("p", r.summary));
        const statusNote = r.playGap || r.status;
        article.append(el("p", r.playStatus === statusNote || (r.type === "vision" && r.playGap) ? r.playStatus :
          r.playStatus+" · "+statusNote, "atlas-find-status-note"));
        section.append(article);
      }
      if (!group.rows.length) section.append(el("p", "No further results in this group on this page."));
      layout.append(section);
    }
    content.append(layout, el("p", data.scope, "atlas-find-scope"));
    if (data.pages > 1) {
      for (const [label, page, disabled] of [["Previous", state.page - 1, state.page <= 1], ["Next", state.page + 1, state.page >= data.pages]]) {
        const b = el("button", label);
        b.disabled = disabled;
        b.onclick = () => {
          location.hash = findRoute({ ...state, page });
          main.scrollIntoView();
        };
        pager.append(b);
      }
      pager.append(el("span", `Page ${state.page} of ${data.pages} \xB7 up to ${data.limit} results per group`));
    }
  } catch (error) {
    if (shell.isConnected) {
      status.textContent = error.message;
      const retry = el("button", "Retry search");
      retry.onclick = () => atlasFindView({ main });
      content.append(retry);
    }
  }
}
export {
  atlasFindView,
  findRoute,
  findState,
  mountFind
};
