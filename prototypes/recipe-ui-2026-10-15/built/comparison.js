// src/crafting_detail.js
var resultDetailsOpen = false;
function el(tag, className, text) {
  const node2 = document.createElement(tag);
  if (className) node2.className = className;
  if (text != null) node2.textContent = text;
  return node2;
}
function fact(label, value, attr) {
  const row = el("div", "craft_detail_fact");
  row.setAttribute(attr, "");
  row.append(el("span", "craft_detail_label", label), el("span", "craft_detail_value", value));
  return row;
}
function renderCraftingDetail(root, model2, handlers) {
  const focused = root.contains(document.activeElement) ? document.activeElement : null;
  const kind = focused && ["data-craft-commit", "data-craft-amount", "data-craft-req", "data-craft-blocked-reason"].find((a) => focused.hasAttribute(a));
  const focusIndex = kind ? [...root.querySelectorAll(`[${kind}]`)].indexOf(focused) : -1;
  root.replaceChildren();
  root.dataset.state = model2 ? model2.available ? "ready" : "blocked" : "empty";
  if (!model2) {
    root.append(el("p", "craft_detail_empty", "Select a recipe to see what it uses and makes."));
    return;
  }
  const body = el("div", "craft_detail_body");
  const title = el("h3", "craft_detail_title", model2.title);
  title.setAttribute("data-craft-title", "");
  body.append(title);
  const uses = el("div", "craft_detail_section");
  uses.append(el("div", "craft_detail_label", "Uses"));
  for (const req of model2.requirements) {
    const row = el("div", "craft_req");
    row.setAttribute("data-craft-req", "");
    row.tabIndex = -1;
    if (req.missing) row.setAttribute("data-missing", "");
    if (req.unknown) row.setAttribute("data-unknown", "");
    row.append(el("span", "craft_req_name", req.label), el("span", "craft_req_count", `${req.have}/${req.need}`));
    if (req.missing) row.append(el("span", "craft_req_short", `missing ${req.need - req.have}`));
    else if (req.held_back) row.append(el("span", "craft_req_short", "reserved"));
    uses.append(row);
  }
  body.append(uses);
  body.append(fact("Makes", `${model2.output.name} x${model2.output.count}${model2.output.scaled ? " (partial results possible)" : ""}`, "data-craft-output"));
  body.append(fact("Success", `${model2.chance}%`, "data-craft-chance"));
  body.append(fact("Station", model2.station, "data-craft-station"));
  body.append(fact("XP", model2.xp, "data-craft-xp"));
  if (model2.result_details) {
    const more = el("details", "craft_detail_more");
    more.append(el("summary", "", "Result details"));
    const inner = el("div", "craft_detail_result");
    more.append(inner);
    more.addEventListener("toggle", () => {
      resultDetailsOpen = more.open;
      inner.innerHTML = more.open ? model2.result_details : "";
    });
    more.open = resultDetailsOpen;
    body.append(more);
  }
  root.append(body);
  const actions = el("div", "craft_detail_actions");
  if (!model2.available) {
    const reason2 = el("p", "craft_blocked_reason", model2.blocked_reason);
    reason2.setAttribute("data-craft-blocked-reason", "");
    reason2.tabIndex = -1;
    actions.append(reason2);
  }
  const buttons = el("div", "craft_detail_buttons");
  const commit = el("button", "craft_commit", "Craft 1");
  commit.type = "button";
  commit.setAttribute("data-craft-commit", "");
  buttons.append(commit);
  for (const [amount, label] of [[5, "5"], [10, "10"], [Infinity, "All"]]) {
    const b = el("button", "craft_amount", label);
    b.type = "button";
    b.dataset.craftAmount = String(amount);
    b.setAttribute("aria-label", `Craft ${label === "All" ? "all you can" : label}`);
    buttons.append(b);
  }
  for (const b of buttons.children) {
    if (!model2.available) b.setAttribute("aria-disabled", "true");
    b.addEventListener("click", () => {
      if (!model2.available) {
        handlers.onBlocked(root);
        return;
      }
      handlers.onCommit(b.dataset.craftAmount ? Number(b.dataset.craftAmount) : 1);
    });
  }
  actions.append(buttons);
  const receipt = el("p", "craft_receipt", model2.receipt || "");
  receipt.setAttribute("data-craft-receipt", "");
  receipt.setAttribute("aria-live", "polite");
  receipt.hidden = !model2.receipt;
  actions.append(receipt);
  root.append(actions);
  if (kind) (root.querySelectorAll(`[${kind}]`)[focusIndex] || commit).focus({ preventScroll: true });
}
function focusFirstBlocker(root) {
  const target = root.querySelector("[data-craft-req][data-missing]") || root.querySelector("[data-craft-blocked-reason]");
  target?.focus();
}
function craftReceiptText({ made, result_name, used, xp }) {
  const usedText = used.map((u) => `${u.count} ${u.name}`).join(", ");
  const xpText = xp > 0 ? ` (+${Math.round(xp * 10) / 10} XP)` : "";
  if (made > 0) return `Made ${made} ${result_name}${usedText ? ` from ${usedText}` : ""}${xpText}`;
  if (usedText) return `Failed: ${usedText} used, nothing made${xpText}`;
  return "Nothing was crafted. Your materials are unchanged.";
}

// src/crafting_visibility.js
function itemRecipeStatus({ recipe, stationTier, findMaterial, isMaterialKnown, canConsume }) {
  const availability = recipe.get_availability();
  const requirements = recipe.materials.map((material, i) => {
    const found = availability.materials[i] || findMaterial({ material, needed_count: material.count });
    const known = material.material_type ? true : isMaterialKnown(material.material_id);
    const held_back = found.count >= material.count && !found.items.every((entry) => canConsume(entry.item.getInventoryKey()));
    return { material, have: found.count, need: material.count, missing: found.count < material.count, known, held_back, items: found.items };
  });
  const reasons = [];
  if (!recipe.isUnlocked()) reasons.push("not learned");
  if (!(stationTier > 0)) reasons.push("no station here");
  const missing = requirements.filter((r) => r.missing);
  if (missing.length) reasons.push(`missing ${missing.length} material${missing.length > 1 ? "s" : ""}`);
  if (requirements.some((r) => r.held_back)) reasons.push("a material is reserved or you are busy");
  const available = !reasons.length && availability.available_ammount > 0;
  return { available, amount: available ? availability.available_ammount : 0, requirements, reasons, availability };
}

// src/ui_components.js
var reasonSequence = 0;
function decorateActionComponents(root) {
  let queued = false;
  const notes = /* @__PURE__ */ new WeakMap();
  function refresh() {
    queued = false;
    observer.disconnect();
    for (const button2 of root.querySelectorAll("button")) {
      const reason2 = button2.disabled ? button2.dataset.disabledReason || button2.title : "";
      let note = notes.get(button2);
      if (!note) {
        const existing = document.getElementById(button2.getAttribute("aria-describedby"));
        if (existing?.classList.contains("ui-disabled-reason")) {
          note = existing;
          notes.set(button2, note);
        }
      }
      if (reason2 && !note) {
        note = document.createElement("small");
        note.className = "ui-disabled-reason";
        note.id = `ui-disabled-${++reasonSequence}`;
        button2.after(note);
        notes.set(button2, note);
        button2.setAttribute("aria-describedby", note.id);
      }
      if (note) {
        if (note.hidden !== !reason2) note.hidden = !reason2;
        if (note.textContent !== reason2) note.textContent = reason2;
      }
    }
    observer.observe(root, { subtree: true, childList: true, attributes: true, attributeFilter: ["disabled", "title", "data-disabled-reason"] });
  }
  const observer = new MutationObserver(() => {
    if (!queued) {
      queued = true;
      queueMicrotask(refresh);
    }
  });
  refresh();
  return { refresh, destroy: () => observer.disconnect() };
}

// prototypes/recipe-ui-2026-10-15/comparison.js
var recipes = await fetch("built/recipes.json").then((r) => r.json());
var $ = (s) => document.querySelector(s);
var board = $("#board");
var task = $("#task");
var state = { variant: "compact", scenario: "ready", selected: recipes[0].id, stock: {}, station: 1, reserved: false, limited: false, view: "recipes", subject: null, history: [], query: "", listScroll: 0, receipt: "", steps: 0, running: true, unread: 0 };
function node(tag, text, cls) {
  const n = document.createElement(tag);
  if (text !== void 0) n.textContent = text;
  if (cls) n.className = cls;
  return n;
}
function button(text, fn, cls) {
  const b = node("button", text, cls);
  b.type = "button";
  b.onclick = fn;
  return b;
}
function knownRecipes() {
  return state.limited ? recipes.slice(0, 1) : recipes;
}
function selected() {
  return knownRecipes().find((r) => r.id === state.selected) || knownRecipes()[0];
}
function materialKnown(id) {
  return !state.limited || id !== "Rat meat chunks";
}
function lookup({ material }) {
  const count = state.stock[material.material_id] || 0;
  return { count, items: [{ item: { getInventoryKey: () => material.material_id } }] };
}
function status(r) {
  const shim = { ...r, isUnlocked: () => knownRecipes().some((x) => x.id === r.id), get_availability: () => {
    const materials = r.materials.map((material) => lookup({ material }));
    return { available_ammount: Math.min(...materials.map((g, i) => Math.floor(g.count / r.materials[i].count))), materials };
  } };
  return itemRecipeStatus({ recipe: shim, stationTier: state.station, findMaterial: lookup, isMaterialKnown: materialKnown, canConsume: () => !state.reserved });
}
function reason(r) {
  const s = status(r);
  if (!state.station) return "No cooking station here. Return to a place with cooking access.";
  const missing = s.requirements.filter((x) => x.missing);
  if (missing.length) return "Missing " + missing.map((x) => `${x.need - x.have} ${materialKnown(x.material.material_id) ? x.material.material_id : "unfamiliar material"}`).join(", ") + ".";
  if (state.reserved) return "Materials are reserved by another commitment.";
  return "";
}
function chance(r) {
  const level = Math.min(5, r.levels[1]) - r.levels[0] + 1;
  return Math.round(100 * r.chance[0] * (r.chance[1] / r.chance[0]) ** Math.min(1, level / (r.levels[1] - r.levels[0] + 1)));
}
function model(r) {
  const s = status(r);
  return { title: r.name, requirements: s.requirements.map((x) => ({ label: materialKnown(x.material.material_id) ? x.material.material_id : "Unfamiliar material", have: x.have, need: x.need, missing: x.missing, unknown: !materialKnown(x.material.material_id), held_back: x.held_back })), output: { name: r.name, count: r.outputCount, scaled: false }, chance: chance(r), station: state.station ? "Cooking, tier 1" : "Cooking: not available here", xp: "Not simulated; production bonuses and XP are outside this comparison.", available: s.available, blocked_reason: reason(r), receipt: state.receipt, result_details: r.effects.map((x) => `${x.name} \xB7 duration ${x.duration} (native units)`).join("<br>") };
}
function rememberView() {
  state.listScroll = $(".rows")?.scrollTop ?? state.listScroll;
  return { view: state.view, subject: state.subject, selected: state.selected, query: state.query, listScroll: state.listScroll, focus: document.activeElement?.dataset.restore || null };
}
function openView(view, subject) {
  state.history.push(rememberView());
  state.view = view;
  state.subject = subject;
  render();
  $("#task-title").focus();
}
function back() {
  const prev = state.history.pop();
  if (!prev) return;
  Object.assign(state, prev);
  render();
  const target = [...document.querySelectorAll("[data-restore]")].find((n) => n.dataset.restore === prev.focus);
  target?.focus({ preventScroll: true });
}
function log(text, snapshot = null) {
  const box = $("#log"), atBottom = box.scrollHeight - box.scrollTop - box.clientHeight < 35;
  const row = node("div", void 0, "entry");
  row.append(node("time", `Step ${state.steps} \xB7 `), node("span", text));
  if (snapshot) {
    const b = button("Inspect recorded attempt", () => openView("event", structuredClone(snapshot)), "link");
    row.append(b);
  }
  box.append(row);
  if (atBottom) box.scrollTop = box.scrollHeight;
  else state.unread++;
  $("#unread").textContent = state.unread ? `${state.unread} unread` : "";
}
function simulate(r) {
  if (!status(r).available) {
    state.receipt = reason(r);
    render();
    return;
  }
  const used = r.materials.map((m) => ({ name: materialKnown(m.material_id) ? m.material_id : "Unfamiliar material", count: m.count }));
  for (const m of r.materials) state.stock[m.material_id] -= m.count;
  state.stock[r.name] = (state.stock[r.name] || 0) + r.outputCount;
  const text = craftReceiptText({ made: r.outputCount, result_name: r.name, used, xp: 0 });
  state.receipt = text;
  const snapshot = { title: r.name, text, step: state.steps };
  log(text + " \xB7 scripted success", snapshot);
  render();
}
function renderStock() {
  const root = $("#stock");
  root.replaceChildren();
  for (const [id, count] of Object.entries(state.stock)) {
    if (!materialKnown(id) || state.limited && (id === "Belmart leaf" || recipes.some((r) => r.id === id) && !knownRecipes().some((r) => r.id === id))) continue;
    const row = node("div", void 0, "stock-row");
    row.append(node("span", id), node("span", String(count)));
    root.append(row);
  }
}
function refButton(id, label = id) {
  const b = button(label, () => openView("reference", id), "link");
  b.dataset.restore = "ref:" + id;
  return b;
}
function recipeList() {
  const list = node("div", void 0, "recipe-list");
  const input = node("input");
  input.placeholder = "Find known recipe";
  input.setAttribute("aria-label", "Find known recipe");
  input.value = state.query;
  input.dataset.restore = "search";
  const rows = node("div", void 0, "rows");
  rows.setAttribute("aria-label", "Known recipes");
  function fill() {
    rows.replaceChildren();
    const shown = knownRecipes().filter((r) => r.name.toLowerCase().includes(state.query.toLowerCase()));
    for (const r of shown) {
      const b = button("", () => {
        state.listScroll = rows.scrollTop;
        state.selected = r.id;
        state.receipt = "";
        render();
        [...document.querySelectorAll("[data-restore]")].find((n) => n.dataset.restore === "recipe:" + r.id)?.focus({ preventScroll: true });
      }, "recipe-row");
      b.append(node("span", r.name), node("small", status(r).available ? "Ready" : reason(r)));
      b.setAttribute("aria-pressed", String(r.id === selected().id));
      b.dataset.restore = "recipe:" + r.id;
      rows.append(b);
    }
    if (!shown.length) rows.append(node("p", "No matching known recipe. Clear search to return.", "empty"));
  }
  input.oninput = () => {
    state.query = input.value;
    fill();
  };
  fill();
  list.append(input, rows);
  requestAnimationFrame(() => {
    rows.scrollTop = state.listScroll;
  });
  return list;
}
function summary(r) {
  const wrap = node("div", void 0, "summary"), body = node("div", void 0, "summary-body");
  body.append(node("h3", r.name), node("p", `Makes ${r.outputCount} \xB7 ${chance(r)}% base chance`));
  for (const req of model(r).requirements) {
    const p2 = node("p");
    if (!req.unknown) p2.append(refButton(req.label));
    else p2.append(node("span", req.label));
    p2.append(node("span", ` \xB7 ${req.have} / ${req.need}`));
    body.append(p2);
  }
  body.append(node("p", r.effects.map((e) => e.name).join(" + "), "muted result-effects"));
  body.append(node("p", reason(r) || "Cooking station ready.", reason(r) ? "reason" : "muted"));
  if (state.receipt) body.append(node("p", state.receipt, "receipt"));
  const actions = node("div", void 0, "summary-actions");
  const craft = button("Cook 1", () => simulate(r), "primary");
  craft.setAttribute("aria-disabled", String(!status(r).available));
  craft.setAttribute("aria-describedby", "compact-reason");
  const p = body.querySelector(".reason") || body.querySelector(".muted");
  p.id = "compact-reason";
  const detail = button("Full recipe \u203A", () => openView("full", r.id));
  detail.dataset.restore = "full:" + r.id;
  actions.append(craft, detail);
  wrap.append(body, actions);
  return wrap;
}
function fullRecipe(r) {
  const body = node("div", void 0, "full-body");
  body.append(node("h3", r.name));
  const facts = [["Makes", `${r.outputCount} ${r.name}`], ["Chance", `${chance(r)}% base at Cooking 5 / tier 1. Bonuses not simulated.`], ["Station", state.station ? "Cooking \xB7 tier 1" : "Not available here"], ["Result", r.effects.map((x) => `${x.name}, duration ${x.duration} native units`).join("; ")]];
  for (const [a, b2] of facts) {
    const row = node("div", void 0, "fact");
    row.append(node("strong", a), node("span", b2));
    body.append(row);
  }
  const sec = node("section");
  sec.append(node("h3", "Ingredients"));
  for (const m of model(r).requirements) {
    const p = node("p");
    p.append(m.unknown ? node("span", m.label) : refButton(m.label), node("span", ` \xB7 have ${m.have}, need ${m.need}${m.missing ? `, missing ${m.need - m.have}` : ""}${m.held_back ? " \xB7 reserved" : ""}`));
    sec.append(p);
  }
  body.append(sec, node("p", reason(r) || "Ready to attempt. An attempt can fail in the game; this lab scripts a successful result.", reason(r) ? "reason" : "muted"));
  if (state.receipt) body.append(node("p", state.receipt, "receipt"));
  const actions = node("div", void 0, "full-actions"), b = button("Cook 1", () => simulate(r), "primary");
  b.setAttribute("aria-disabled", String(!status(r).available));
  actions.append(b);
  task.append(body, actions);
}
function renderReference(id) {
  const body = node("div", void 0, "full-body");
  body.append(node("h3", id), node("p", "Known reference \xB7 browsing does not travel or spend materials.", "muted"), node("h3", "Used for"));
  const related = knownRecipes().filter((r) => r.materials.some((m) => m.material_id === id));
  for (const r of related) {
    const b = button(r.name, () => {
      state.selected = r.id;
      openView("full", r.id);
    }, "link");
    b.dataset.restore = "use:" + r.id;
    body.append(b, node("p", r.materials.map((m) => `${m.count} ${materialKnown(m.material_id) ? m.material_id : "unfamiliar material"}`).join(" + ")));
  }
  if (!related.length) body.append(node("p", "No uses in your current known recipe list."));
  body.append(node("p", "Other acquisition routes are outside this comparison. This reference grants no station access.", "muted"));
  task.append(body);
}
function render() {
  renderStock();
  $("#station-state").textContent = state.station ? "Cooking available \xB7 tier 1" : "No cooking station in this fixture state.";
  task.replaceChildren();
  const expanded = state.view !== "recipes";
  board.dataset.expanded = String(expanded);
  $("#task-title").textContent = state.view === "reference" ? "Reference" : state.view === "event" ? "Recorded attempt" : "Cooking";
  $("#task-title").tabIndex = -1;
  const backButton = $("#back");
  backButton.hidden = !state.history.length;
  backButton.textContent = state.history.at(-1)?.view === "reference" ? "\u2190 Reference" : state.history.at(-1)?.view === "full" ? "\u2190 Recipe" : "\u2190 Cooking";
  $("#task-context").textContent = expanded ? "Esc returns to previous view" : "Village \xB7 cooking recipes";
  if (state.view === "reference") renderReference(state.subject);
  else if (state.view === "full") fullRecipe(selected());
  else if (state.view === "event") {
    const body = node("div", void 0, "full-body");
    body.append(node("h3", state.subject.title), node("p", `Recorded at step ${state.subject.step}`), node("p", state.subject.text), node("p", "This is the recorded result, independent of current stock.", "muted"));
    task.append(body);
  } else {
    const layout = node("div", void 0, "recipe-layout");
    layout.append(recipeList());
    if (state.variant === "compact") layout.append(summary(selected()));
    else {
      const detail = node("div", void 0, "crafting_detail");
      renderCraftingDetail(detail, model(selected()), { onCommit: () => simulate(selected()), onBlocked: () => focusFirstBlocker(detail) });
      detail.querySelector("[data-craft-commit]").textContent = "Cook 1";
      for (const b of detail.querySelectorAll("[data-craft-amount]")) b.remove();
      const wrap = node("div", void 0, "summary");
      wrap.style.padding = "0";
      const links = node("div", void 0, "reference-links");
      for (const m of selected().materials) if (materialKnown(m.material_id)) links.append(refButton(m.material_id));
      wrap.append(links, detail);
      layout.append(wrap);
    }
    task.append(layout);
  }
}
function reset() {
  Object.assign(state, { stock: { "Rat meat chunks": 6, "Belmart leaf": 2, "Stale bread": 3, "Roasted rat meat": 0, "Roasted purified rat meat": 0 }, station: 1, reserved: false, limited: false, view: "recipes", subject: null, history: [], query: "", listScroll: 0, receipt: "", selected: recipes[0].id });
  if (state.scenario === "short") state.stock["Rat meat chunks"] = 1;
  if (state.scenario === "station") state.station = 0;
  if (state.scenario === "reserved") state.reserved = true;
  if (state.scenario === "knowledge") state.limited = true;
  $("#log").replaceChildren();
  state.unread = 0;
  $("#unread").textContent = "";
  render();
  log("Known cooking recipes are available for inspection.");
}
$("#variant").onchange = (e) => {
  state.listScroll = $(".rows")?.scrollTop ?? state.listScroll;
  state.variant = e.target.value;
  render();
};
$("#scenario").onchange = (e) => {
  state.scenario = e.target.value;
  reset();
};
$("#reset").onclick = reset;
$("#text-size").onchange = (e) => document.documentElement.style.fontSize = e.target.value + "px";
$("#back").onclick = back;
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && state.history.length) {
    e.preventDefault();
    back();
  }
});
$("#pause-work").onclick = () => {
  state.running = !state.running;
  $("#pause-work").textContent = state.running ? "Pause routine" : "Resume routine";
};
$("#follow").onclick = () => {
  $("#log").scrollTop = $("#log").scrollHeight;
  state.unread = 0;
  $("#unread").textContent = "";
};
decorateActionComponents(document.body);
reset();
log("Practice routine started. Opening references leaves it running.");
setInterval(() => {
  if (!state.running) return;
  state.steps++;
  $("#work-progress").textContent = `${state.steps} steps`;
  if (state.steps % 5 === 0) log("Practice routine continues. No recipe materials consumed.");
}, 1e3);
//# sourceMappingURL=comparison.js.map
