// Tauri desktop host (AD39, amended 2026-11-06). Serves the repository's web
// build over yairpg://localhost/ and exposes the same window.yairpgHost object
// the Electron preload does, minus the features not ported yet (see README).
// src/ never imports this folder.
mod builds;
mod desktop;
mod mirror;
mod store;

use sha2::{Digest, Sha256};
use std::{
    borrow::Cow,
    fs::OpenOptions,
    io::Write,
    path::PathBuf,
    sync::{
        atomic::{AtomicBool, AtomicU64, Ordering},
        Mutex, OnceLock,
    },
    time::Duration,
};
use tauri::{
    http::{Request, Response},
    utils::config::BackgroundThrottlingPolicy,
    Manager, WebviewUrl, WebviewWindowBuilder,
};

fn flag(name: &str) -> bool {
    matches!(std::env::var(name).as_deref(), Ok("1"))
}

fn mime(path: &str) -> &'static str {
    match path.rsplit('.').next().unwrap_or("") {
        "html" => "text/html; charset=utf-8",
        "js" | "mjs" | "cjs" => "text/javascript; charset=utf-8",
        "css" => "text/css; charset=utf-8",
        "json" | "map" => "application/json",
        "png" => "image/png",
        "jpg" | "jpeg" => "image/jpeg",
        "svg" => "image/svg+xml",
        "webp" => "image/webp",
        "woff2" => "font/woff2",
        "woff" => "font/woff",
        "ttf" => "font/ttf",
        "mp3" => "audio/mpeg",
        "ogg" => "audio/ogg",
        "wav" => "audio/wav",
        _ => "application/octet-stream",
    }
}

/// Test harness lines (YAIRPG_REPORT): page reports and missing files.
fn report(line: &str) {
    if let Ok(file) = std::env::var("YAIRPG_REPORT") {
        if let Ok(mut f) = OpenOptions::new().create(true).append(true).open(file) {
            let _ = writeln!(f, "{}", line.trim());
        }
    }
}

static QUITTING: AtomicBool = AtomicBool::new(false);
static CLOSE_MIRRORED: AtomicBool = AtomicBool::new(false);
static LAST_PONG: AtomicU64 = AtomicU64::new(0);
static BACKGROUND: AtomicBool = AtomicBool::new(false);
static MIRROR_DIR: OnceLock<PathBuf> = OnceLock::new();
static HANG_KILL: AtomicBool = AtomicBool::new(false);
static NAVIGATE_RECOVER: AtomicBool = AtomicBool::new(false);
static MIRROR: OnceLock<Mutex<mirror::Mirror>> = OnceLock::new();
static STORE: OnceLock<Mutex<store::Store>> = OnceLock::new();
pub(crate) const RECOVER_PATH: &str = "/__host/recover.html";

fn env_ms(name: &str, fallback: u64) -> u64 {
    std::env::var(name)
        .ok()
        .and_then(|v| v.parse().ok())
        .unwrap_or(fallback)
}

/// Page script: optionally save through the game, then post every storage key
/// to the mirror. The recovery page never mirrors itself.
pub(crate) fn mirror_js(reason: &str, force: bool, save_first: bool) -> String {
    format!(
        r#"(() => {{ if (location.pathname === '{RECOVER_PATH}') return;
  {save} const e = {{}}; for (let i = 0; i < localStorage.length; i++) {{ const k = localStorage.key(i); if (k !== '{rev}') e[k] = localStorage.getItem(k); }}
  fetch('/__host/mirror?reason={reason}&force={force}', {{method: 'POST', body: JSON.stringify(e)}}).catch(() => {{}}); }})()"#,
        save = if save_first {
            "try { window.saveProgress && window.saveProgress(); } catch (x) {}"
        } else {
            ""
        },
        force = if force { 1 } else { 0 },
        rev = store::REV_KEY,
    )
}

/// Writes pending host-store changes (store.rs). Quit calls it last.
fn flush_store() {
    if let Some(Ok(mut s)) = STORE.get().map(|s| s.lock()) {
        if let Err(e) = s.flush() {
            eprintln!("host store write failed: {e}");
            report(&serde_json::json!({"type": "store-flush", "error": e.to_string()}).to_string());
        }
    }
}

/// Quit path for every exit (window close, Cmd+Q, harness): save in the page,
/// copy it to the disk mirror, then give WebKit's storage process time to
/// write before the app ends. Without the wait the last write can be lost (T5).
fn quit(app: tauri::AppHandle) {
    if QUITTING.swap(true, Ordering::SeqCst) {
        return;
    }
    if let Some(window) = app.get_webview_window("main") {
        let script = if MIRROR.get().is_some() {
            mirror_js("close", true, true)
        } else {
            "try { window.saveProgress && window.saveProgress(); } catch (e) {}".into()
        };
        let _ = window.eval(&script);
    }
    let wait = env_ms("YAIRPG_QUIT_MS", 1500);
    std::thread::spawn(move || {
        let start = std::time::Instant::now();
        std::thread::sleep(Duration::from_millis(wait));
        // A slow mirror post gets up to 1.5 s more; a hung page never blocks quitting.
        while MIRROR.get().is_some()
            && !CLOSE_MIRRORED.load(Ordering::SeqCst)
            && start.elapsed() < Duration::from_millis(wait + 1500)
        {
            std::thread::sleep(Duration::from_millis(50));
        }
        flush_store();
        app.exit(0);
    });
}

fn respond(status: u16, kind: &str, body: Vec<u8>) -> Response<Cow<'static, [u8]>> {
    Response::builder()
        .status(status)
        .header("Content-Type", kind)
        .header("Access-Control-Allow-Origin", "*")
        // Frozen builds switch roots in place; never let WebKit reuse an old file.
        .header("Cache-Control", "no-store")
        .body(Cow::Owned(body))
        .unwrap()
}

fn serve(app: &tauri::AppHandle, request: Request<Vec<u8>>) -> Response<Cow<'static, [u8]>> {
    let raw = request.uri().path().to_string();
    let path = percent_decode(&raw);
    if let Some(route) = path.strip_prefix("/__host/") {
        return host_route(app, route, &request);
    }
    if path.starts_with("/__harness/") {
        if std::env::var("YAIRPG_REPORT").is_err() {
            return respond(404, "text/plain", vec![]);
        }
        if path == "/__harness/report" {
            report(&String::from_utf8_lossy(request.body()));
        } else if path == "/__harness/exit" {
            quit(app.clone());
        } else if path == "/__harness/popout" {
            let _ = desktop::open_popout(app, "events", BACKGROUND.load(Ordering::SeqCst));
        } else if path == "/__harness/kill" {
            kill_page(app, "crashed");
        }
        return respond(204, "text/plain", vec![]);
    }
    let rel = path.trim_start_matches('/');
    let rel = if rel.is_empty() { "index.html" } else { rel };
    if rel.split('/').any(|part| part == "..") {
        return respond(403, "text/plain", vec![]);
    }
    match std::fs::read(builds::root().join(rel)) {
        Ok(bytes) => respond(200, mime(rel), bytes),
        Err(_) => {
            report(&serde_json::json!({"type": "miss", "path": rel}).to_string());
            respond(404, "text/plain", vec![])
        }
    }
}

fn query(request: &Request<Vec<u8>>, name: &str) -> Option<String> {
    request.uri().query()?.split('&').find_map(|pair| {
        let (k, v) = pair.split_once('=')?;
        (k == name).then(|| percent_decode(v))
    })
}

fn json_response(value: serde_json::Value) -> Response<Cow<'static, [u8]>> {
    respond(
        200,
        "application/json",
        serde_json::to_vec(&value).unwrap_or_default(),
    )
}

/// Host routes on the game origin: mirror (A1/N1), recovery page, heartbeat (N2).
fn host_route(
    app: &tauri::AppHandle,
    route: &str,
    request: &Request<Vec<u8>>,
) -> Response<Cow<'static, [u8]>> {
    match route {
        "recover.html" => respond(
            200,
            "text/html; charset=utf-8",
            include_bytes!("recover.html").to_vec(),
        ),
        "build-state" => json_response(builds::state()),
        "popout.html" => respond(
            200,
            "text/html; charset=utf-8",
            desktop::popout_page(&query(request, "panel").unwrap_or_default()).into_bytes(),
        ),
        "projection" => {
            if let (Some(name), Ok(data)) = (
                query(request, "name"),
                serde_json::from_slice::<serde_json::Value>(request.body()),
            ) {
                desktop::projection(app, &name, &data);
            }
            respond(204, "text/plain", vec![])
        }
        "projection-latest" => json_response(desktop::projection_latest(
            &query(request, "name").unwrap_or_default(),
        )),
        "attention" => {
            let count = query(request, "count")
                .and_then(|c| c.parse().ok())
                .unwrap_or(0);
            let label: String = query(request, "label")
                .unwrap_or_default()
                .chars()
                .take(120)
                .collect();
            let result = desktop::attention(app, count, &label, BACKGROUND.load(Ordering::SeqCst));
            report(&serde_json::json!({"type": "attention", "result": result}).to_string());
            json_response(result)
        }
        "adopt-build" => json_response(serde_json::json!({"adopted": builds::adopt()})),
        "pong" => {
            LAST_PONG.store(mirror::now_ms() as u64, Ordering::SeqCst);
            respond(204, "text/plain", vec![])
        }
        "mirror" => {
            let Some(m) = MIRROR.get() else {
                return respond(404, "text/plain", vec![]);
            };
            let reason = query(request, "reason").unwrap_or_else(|| "poll".into());
            let force = query(request, "force").as_deref() == Some("1");
            let result = match serde_json::from_slice::<serde_json::Value>(request.body()) {
                Ok(serde_json::Value::Object(entries)) => {
                    let safe: String = reason
                        .chars()
                        .filter(|c| c.is_ascii_alphanumeric() || *c == '-')
                        .take(24)
                        .collect();
                    m.lock()
                        .map(|mut m| {
                            m.record(&entries, &safe, force)
                                .map(|r| r.to_string())
                                .unwrap_or_else(|e| format!("error: {e}"))
                        })
                        .unwrap_or_else(|_| "locked".into())
                }
                _ => "bad body".into(),
            };
            if reason == "close" {
                CLOSE_MIRRORED.store(true, Ordering::SeqCst);
            }
            report(
                &serde_json::json!({"type": "mirror", "reason": reason, "result": result})
                    .to_string(),
            );
            respond(200, "text/plain", result.into_bytes())
        }
        "store-state" => match STORE.get().and_then(|s| s.lock().ok().map(|s| s.state())) {
            Some(state) => json_response(state),
            None => respond(404, "text/plain", vec![]),
        },
        "store-read" => match STORE
            .get()
            .and_then(|s| s.lock().ok().map(|s| s.snapshot()))
        {
            Some(snapshot) => json_response(snapshot),
            None => respond(404, "text/plain", vec![]),
        },
        "store" => {
            let Some(s) = STORE.get() else {
                return respond(404, "text/plain", vec![]);
            };
            let Ok(batch) = serde_json::from_slice::<serde_json::Value>(request.body()) else {
                return respond(400, "text/plain", b"bad body".to_vec());
            };
            let result = s
                .lock()
                .map_err(|_| "locked".to_string())
                .and_then(|mut s| s.apply(&batch));
            report(&serde_json::json!({"type": "store", "full": batch["full"], "bytes": request.body().len(),
                "keys": batch["set"].as_object().map(|m| m.keys().cloned().collect::<Vec<_>>()), "result": result.as_ref().map_err(|e| e.clone())}).to_string());
            match result {
                Ok(rev) => json_response(serde_json::json!({"rev": rev})),
                Err(e) => respond(409, "text/plain", e.into_bytes()),
            }
        }
        "mirror-list" => match MIRROR.get().and_then(|m| m.lock().ok().map(|m| m.list())) {
            Some(list) => json_response(list),
            None => json_response(serde_json::json!([])),
        },
        "mirror-read" => {
            let Some(m) = MIRROR.get() else {
                return respond(404, "text/plain", vec![]);
            };
            let id = query(request, "id").unwrap_or_default();
            match m
                .lock()
                .map_err(|_| "locked".to_string())
                .and_then(|m| m.read(&id))
            {
                Ok(snapshot) => json_response(snapshot["entries"].clone()),
                Err(e) => respond(404, "text/plain", e.into_bytes()),
            }
        }
        _ => {
            let _ = app;
            respond(404, "text/plain", vec![])
        }
    }
}

/// Stops a hung or test-killed page: WebKit then reports the content process
/// gone and the terminate hook shows the recovery page (N2).
fn kill_page(app: &tauri::AppHandle, reason: &'static str) {
    if reason == "hung" {
        HANG_KILL.store(true, Ordering::SeqCst);
    }
    let Some(window) = app.get_webview_window("main") else {
        return;
    };
    let _ = window.with_webview(move |webview| {
        #[cfg(target_os = "macos")]
        unsafe {
            use objc2::{
                msg_send,
                runtime::{AnyObject, Bool},
                sel,
            };
            let view = webview.inner() as *mut AnyObject;
            let has = |s| -> bool {
                let r: Bool = msg_send![view, respondsToSelector: s];
                r.as_bool()
            };
            // End the content process by pid: WebKit reports that as a crash, so
            // the terminate hook shows recovery. WebKit's own stop skips the hook,
            // so that fallback asks for the recovery page directly.
            let pid: i32 = if has(sel!(_webProcessIdentifier)) {
                msg_send![view, _webProcessIdentifier]
            } else {
                0
            };
            let how = if pid > 0 {
                let _ = std::process::Command::new("/bin/kill")
                    .args(["-9", &pid.to_string()])
                    .status();
                format!("pid {pid}")
            } else if has(sel!(_killWebContentProcess)) {
                let _: () = msg_send![view, _killWebContentProcess];
                NAVIGATE_RECOVER.store(true, Ordering::SeqCst);
                "killWebContentProcess".to_string()
            } else {
                "unsupported".to_string()
            };
            report(&serde_json::json!({"type": "host", "kill": reason, "how": how}).to_string());
        }
    });
    std::thread::spawn(move || {
        std::thread::sleep(Duration::from_millis(500));
        if NAVIGATE_RECOVER.swap(false, Ordering::SeqCst) {
            HANG_KILL.store(false, Ordering::SeqCst);
            if let Ok(url) = format!("yairpg://localhost{RECOVER_PATH}?reason={reason}").parse() {
                let _ = window.navigate(url);
            }
        }
    });
}

fn percent_decode(s: &str) -> String {
    let bytes = s.as_bytes();
    let mut out = Vec::with_capacity(bytes.len());
    let mut i = 0;
    while i < bytes.len() {
        if bytes[i] == b'%' && i + 2 < bytes.len() {
            if let Ok(v) = u8::from_str_radix(&s[i + 1..i + 3], 16) {
                out.push(v);
                i += 3;
                continue;
            }
        }
        out.push(bytes[i]);
        i += 1;
    }
    String::from_utf8_lossy(&out).into_owned()
}

/// App Nap throttles timers of apps without a visible window; the game's clock
/// needs them. YAIRPG_APPNAP=1 lets the OS nap the app (diagnosis only).
#[cfg(target_os = "macos")]
fn hold_activity() {
    use objc2_foundation::{NSActivityOptions, NSProcessInfo, NSString};
    let info = NSProcessInfo::processInfo();
    let reason = NSString::from_str("Game clock runs while the window is hidden");
    let token = info.beginActivityWithOptions_reason(
        NSActivityOptions::UserInitiatedAllowingIdleSystemSleep
            | NSActivityOptions::LatencyCritical,
        &reason,
    );
    std::mem::forget(token);
}

/// WebKit throttles DOM timers and lowers process priority for pages it thinks
/// are hidden. The game's loader and clock yield through timers, so a hidden
/// run crawls. YAIRPG_WK_THROTTLE=1 keeps WebKit's defaults (diagnosis only).
/// Private WKPreferences setters, each checked with respondsToSelector first.
#[cfg(target_os = "macos")]
fn unthrottle(webview: *mut std::ffi::c_void) -> Vec<&'static str> {
    use objc2::{
        msg_send,
        runtime::{AnyObject, Bool},
        sel,
    };
    let mut applied = vec![];
    unsafe {
        let webview = webview as *mut AnyObject;
        let config: *mut AnyObject = msg_send![webview, configuration];
        let prefs: *mut AnyObject = msg_send![config, preferences];
        let off = Bool::NO;
        let has = |s| -> bool {
            let r: Bool = msg_send![prefs, respondsToSelector: s];
            r.as_bool()
        };
        if has(sel!(_setHiddenPageDOMTimerThrottlingEnabled:)) {
            let _: () = msg_send![prefs, _setHiddenPageDOMTimerThrottlingEnabled: off];
            applied.push("hiddenPageDOMTimerThrottling");
        }
        if has(sel!(_setHiddenPageDOMTimerThrottlingAutoIncreases:)) {
            let _: () = msg_send![prefs, _setHiddenPageDOMTimerThrottlingAutoIncreases: off];
            applied.push("hiddenPageDOMTimerThrottlingAutoIncreases");
        }
        if has(sel!(_setPageVisibilityBasedProcessSuppressionEnabled:)) {
            let _: () = msg_send![prefs, _setPageVisibilityBasedProcessSuppressionEnabled: off];
            applied.push("pageVisibilityBasedProcessSuppression");
        }
    }
    applied
}

/// Main-window storage sync (store.rs): reconcile at page start, then send each
/// localStorage change to the host in order. Only the main window runs it.
fn store_script() -> String {
    format!(
        r#"(() => {{
  const REV = '{rev}', S = Storage.prototype, set = S.setItem, rem = S.removeItem, clr = S.clear, ls = window.localStorage;
  const sync = (method, path) => {{ const x = new XMLHttpRequest(); x.open(method, path, false); x.send(); if (x.status !== 200) throw Error(path + ' ' + x.status); return JSON.parse(x.responseText); }};
  const all = () => {{ const e = {{}}; for (let i = 0; i < ls.length; i++) {{ const k = ls.key(i); if (k !== REV) e[k] = ls.getItem(k); }} return e; }};
  let local = Number(ls.getItem(REV)) || 0, full = false, pending = {{set: {{}}, del: [], clear: false}}, busy = false, dirty = false, status = 'off';
  try {{
    const remote = sync('GET', '/__host/store-state');
    if (remote.present && remote.rev > local) {{
      // WebKit lost or rolled back its data: the host copy wins.
      const snap = sync('GET', '/__host/store-read');
      clr.call(ls); for (const k of Object.keys(snap.entries)) set.call(ls, k, snap.entries[k]);
      local = snap.rev; set.call(ls, REV, String(local)); status = 'restored';
    }} else {{
      full = !remote.present || local > remote.rev; status = full ? 'push' : 'same';
      dirty = full;
    }}
  }} catch (e) {{ status = 'unavailable'; console.warn('[host store]', e); return; }}
  const flush = async () => {{
    if (busy || !dirty) return;
    busy = true; dirty = false;
    const batch = full ? {{full: true, clear: true, set: all(), del: []}} : pending;
    pending = {{set: {{}}, del: [], clear: false}}; full = false;
    local += 1; set.call(ls, REV, String(local)); batch.rev = local;
    try {{ const r = await fetch('/__host/store', {{method: 'POST', body: JSON.stringify(batch)}}); if (!r.ok) throw Error(String(r.status)); }}
    catch {{ full = true; dirty = true; }}
    busy = false;
    if (dirty) setTimeout(flush, full ? 1000 : 0);
  }};
  const note = () => {{ dirty = true; if (!busy) queueMicrotask(flush); }};
  S.setItem = function (k, v) {{ set.call(this, k, v); if (this === ls && String(k) !== REV) {{ pending.set[String(k)] = String(v); pending.del = pending.del.filter(d => d !== String(k)); note(); }} }};
  S.removeItem = function (k) {{ rem.call(this, k); if (this === ls && String(k) !== REV) {{ delete pending.set[String(k)]; pending.del.push(String(k)); note(); }} }};
  S.clear = function () {{ clr.call(this); if (this === ls) {{ set.call(ls, REV, String(local)); pending = {{set: {{}}, del: [], clear: true}}; note(); }} }};
  window.__yairpgStore = () => ({{status, rev: local, busy, dirty}});
  if (dirty) queueMicrotask(flush);
}})();"#,
        rev = store::REV_KEY
    )
}

pub(crate) fn host_script(background: bool, mirror: bool, build: &str) -> String {
    format!(
        r#"(() => {{
  const background = {background}, mirror = {mirror};
  const readStorage = () => {{ const e = {{}}; for (let i = 0; i < localStorage.length; i++) {{ const k = localStorage.key(i); if (k !== '{rev}') e[k] = localStorage.getItem(k); }} return e; }};
  window.yairpgHost = Object.freeze({{
    desktop: true, shell: 'tauri', background, build: {build:?}, capabilities: [...(mirror ? ['mirror'] : []), 'attention', 'projection'],
    prompt: () => null,
    mirrorList: () => mirror ? fetch('/__host/mirror-list').then(r => r.json()).catch(() => []) : Promise.resolve([]),
    // Restore only from the recovery page, on the player's click; the current
    // state is mirrored first so a restore can itself be undone.
    mirrorRestore: async id => {{
      if (!mirror || location.pathname !== '{RECOVER_PATH}') return false;
      try {{
        await fetch('/__host/mirror?reason=pre-restore&force=1', {{method: 'POST', body: JSON.stringify(readStorage())}});
        const r = await fetch('/__host/mirror-read?id=' + encodeURIComponent(id));
        if (!r.ok) return false;
        const e = await r.json();
        localStorage.clear(); for (const k of Object.keys(e)) localStorage.setItem(k, e[k]);
        return true;
      }} catch {{ return false; }}
    }},
    // Something is waiting (A4): Dock badge, and a notification when unfocused.
    attention: (count, label) => {{ fetch('/__host/attention?count=' + (Number(count) || 0) + '&label=' + encodeURIComponent(String(label || '').slice(0, 120)), {{method: 'POST'}}).catch(() => {{}}); }},
    // Pop-out panels (A3): the game page sends projections; pop-outs only show them.
    projection: (name, data) => {{ fetch('/__host/projection?name=' + encodeURIComponent(name), {{method: 'POST', body: JSON.stringify(data)}}).catch(() => {{}}); }},
    onProjection: callback => {{ window.__yairpgProjection = callback; }},
    projectionLatest: name => fetch('/__host/projection-latest?name=' + encodeURIComponent(name)).then(r => r.json()).catch(() => null),
  }});
  // Frozen builds (EL18, N4): a newer snapshot is offered; nothing reloads
  // until the player clicks. Saving goes through the game's own saveProgress.
  const showBuild = () => {{
    if (location.pathname === '{RECOVER_PATH}' || !document.body || document.getElementById('yairpg_host_build_notice')) return;
    const box = document.createElement('div'); box.id = 'yairpg_host_build_notice'; box.setAttribute('role', 'status');
    box.style.cssText = 'position:fixed;left:12px;bottom:12px;z-index:2147483000;display:flex;gap:8px;align-items:center;padding:6px 10px;font:13px/1.3 system-ui,sans-serif;color:var(--p23-notice,#e8e8e8);background:var(--p23-message-fill,#1f1f1f);border:1px solid var(--p23-frame,#555);box-shadow:0 2px 8px rgba(0,0,0,.4)';
    const text = document.createElement('span'); text.textContent = 'New build ready';
    const reload = document.createElement('button'); reload.type = 'button'; reload.id = 'yairpg_host_build_reload'; reload.textContent = 'Save and reload';
    reload.onclick = async () => {{
      reload.disabled = true;
      try {{ window.saveProgress && window.saveProgress(); }} catch (e) {{}}
      const r = await fetch('/__host/adopt-build', {{method: 'POST'}}).then(r => r.json()).catch(() => ({{}}));
      if (r.adopted) location.reload(); else box.remove();
    }};
    const later = document.createElement('button'); later.type = 'button'; later.textContent = 'Later'; later.onclick = () => box.remove();
    for (const b of [reload, later]) b.style.cssText = 'font:inherit;padding:2px 8px;cursor:pointer';
    box.append(text, reload, later); document.body.append(box);
  }};
  window.__yairpgBuildReady = () => {{ if (document.body) showBuild(); else addEventListener('DOMContentLoaded', showBuild, {{once: true}}); }};
  addEventListener('DOMContentLoaded', () => fetch('/__host/build-state').then(r => r.json()).then(s => {{ if (s.announced) showBuild(); }}).catch(() => {{}}), {{once: true}});
  if (background) {{
    window.alert = m => console.warn('[background alert]', m);
    window.confirm = m => {{ console.warn('[background confirm, cancelled]', m); return false; }};
    window.prompt = () => null;
  }}
}})();"#,
        rev = store::REV_KEY
    )
}

/// Mirror poll (A1) and hang guard (N2, EL46). The guard asks the page for a
/// heartbeat; a page that has answered once and then stays silent past
/// YAIRPG_HANG_MS (default 30 s) is stopped and the recovery page shown.
fn spawn_watchers(app: tauri::AppHandle, mirror_on: bool) {
    {
        // Frozen builds (N4): offer a newer snapshot; the page adopts on a click.
        let app = app.clone();
        let gap = env_ms("YAIRPG_BUILD_POLL_MS", 3000);
        std::thread::spawn(move || loop {
            std::thread::sleep(Duration::from_millis(gap));
            if QUITTING.load(Ordering::SeqCst) {
                return;
            }
            if let Some(id) = builds::poll() {
                report(&serde_json::json!({"type": "host", "announced": id}).to_string());
                if let Some(window) = app.get_webview_window("main") {
                    let _ = window.eval(&format!(
                        "window.__yairpgBuildReady && window.__yairpgBuildReady({})",
                        serde_json::Value::String(id)
                    ));
                }
            }
        });
    }
    if mirror_on {
        let app = app.clone();
        let gap = env_ms("YAIRPG_MIRROR_MS", 30000);
        std::thread::spawn(move || loop {
            std::thread::sleep(Duration::from_millis(gap));
            if QUITTING.load(Ordering::SeqCst) {
                return;
            }
            if let Some(window) = app.get_webview_window("main") {
                let _ = window.eval(&mirror_js("poll", false, false));
            }
        });
    }
    if STORE.get().is_some() {
        // Host store (store.rs): write the file at most every YAIRPG_STORE_MS.
        let gap = env_ms("YAIRPG_STORE_MS", 5000);
        std::thread::spawn(move || loop {
            std::thread::sleep(Duration::from_millis(gap));
            if QUITTING.load(Ordering::SeqCst) {
                return;
            }
            flush_store();
        });
    }
    let hang = env_ms("YAIRPG_HANG_MS", 30000);
    if hang == 0 {
        return;
    }
    std::thread::spawn(move || loop {
        std::thread::sleep(Duration::from_millis(2000));
        if QUITTING.load(Ordering::SeqCst) {
            return;
        }
        if let Some(window) = app.get_webview_window("main") {
            let _ = window.eval("fetch('/__host/pong', {method: 'POST'}).catch(() => {})");
        }
        let last = LAST_PONG.load(Ordering::SeqCst);
        if last > 0 && (mirror::now_ms() as u64).saturating_sub(last) > hang {
            LAST_PONG.store(0, Ordering::SeqCst);
            kill_page(&app, "hung");
        }
    });
}

fn main() {
    let hidden = flag("YAIRPG_HIDDEN");
    let ephemeral = flag("YAIRPG_EPHEMERAL");
    let profile = std::env::var("YAIRPG_USER_DATA").ok();
    // A hidden (agent) run never touches the player's store.
    if hidden && profile.is_none() && !ephemeral {
        eprintln!("YAIRPG_HIDDEN needs YAIRPG_USER_DATA or YAIRPG_EPHEMERAL=1");
        std::process::exit(2);
    }
    #[cfg(target_os = "macos")]
    if !flag("YAIRPG_APPNAP") {
        hold_activity();
    }
    let url =
        std::env::var("YAIRPG_URL").unwrap_or_else(|_| "yairpg://localhost/index.html".into());
    // Save mirror (A1): on for normal play; background runs only with YAIRPG_MIRROR=1.
    let mirror_on = match std::env::var("YAIRPG_MIRROR").as_deref() {
        Ok("1") => !ephemeral,
        Ok("0") => false,
        _ => !hidden && !ephemeral,
    };
    let harness = std::env::var("YAIRPG_HARNESS_SCRIPT")
        .ok()
        .map(|p| std::fs::read_to_string(p).expect("harness script unreadable"));

    BACKGROUND.store(hidden, Ordering::SeqCst);
    let mut builder = tauri::Builder::default();
    if !hidden {
        // Window size and position (A7) for the player's window only.
        builder = builder.plugin(
            tauri_plugin_window_state::Builder::default()
                .with_denylist(&["popout-events"])
                .build(),
        );
    }
    builder
        .on_menu_event(|app, event| {
            desktop::on_menu(app, event.id().as_ref(), MIRROR_DIR.get().cloned())
        })
        .register_asynchronous_uri_scheme_protocol("yairpg", |ctx, request, responder| {
            let app = ctx.app_handle().clone();
            std::thread::spawn(move || responder.respond(serve(&app, request)));
        })
        .on_web_content_process_terminate(|webview| {
            let reason = if HANG_KILL.swap(false, Ordering::SeqCst) {
                "hung"
            } else {
                "crashed"
            };
            report(&serde_json::json!({"type": "host", "terminated": reason}).to_string());
            if let Ok(url) = format!("yairpg://localhost{RECOVER_PATH}?reason={reason}").parse() {
                let _ = webview.navigate(url);
            }
        })
        .setup(move |app| {
            let data_dir = match &profile {
                Some(dir) => PathBuf::from(dir),
                None => app.path().app_data_dir()?,
            };
            let live = std::env::var("YAIRPG_ROOT")
                .ok()
                .map(PathBuf::from)
                .or_else(|| (hidden && !flag("YAIRPG_FROZEN")).then(builds::repo_root));
            builds::init((!ephemeral).then_some(data_dir.as_path()), live)?;
            let mut start_url = url.clone();
            let build_id = builds::state()["serving"]
                .as_str()
                .unwrap_or("live")
                .to_string();
            if !hidden {
                app.set_menu(desktop::menu(app.handle())?)?;
            }
            if mirror_on {
                let dir = match &profile {
                    Some(dir) => PathBuf::from(dir).join("save-mirror"),
                    None => app.path().app_data_dir()?.join("save-mirror"),
                };
                // First launch after scripts/tauri/import_save.mjs: show the copied
                // save on the recovery page; the player restores it with a click.
                let marker = dir.join("import-pending");
                if marker.exists() && std::fs::remove_file(&marker).is_ok() {
                    start_url = format!("yairpg://localhost{RECOVER_PATH}?reason=import");
                }
                let _ = MIRROR_DIR.set(dir.clone());
                let _ = MIRROR.set(Mutex::new(mirror::Mirror::open(dir)));
            }
            if !ephemeral && std::env::var("YAIRPG_STORE").as_deref() != Ok("0") {
                let _ = STORE.set(Mutex::new(store::Store::open(data_dir.join("storage"))));
            }
            #[cfg(target_os = "macos")]
            if hidden {
                app.set_activation_policy(tauri::ActivationPolicy::Accessory);
                app.set_dock_visibility(false);
            }
            let mut builder =
                WebviewWindowBuilder::new(app, "main", WebviewUrl::External(start_url.parse()?))
                    .title("Yet Another Idle RPG")
                    .inner_size(1920.0, 1080.0)
                    .visible(!hidden)
                    .focused(!hidden && !flag("YAIRPG_INACTIVE"))
                    .background_throttling(BackgroundThrottlingPolicy::Disabled)
                    .initialization_script(host_script(hidden, mirror_on, &build_id));
            if STORE.get().is_some() {
                builder = builder.initialization_script(store_script());
            }
            if let Some(script) = &harness {
                builder = builder.initialization_script(script);
            }
            if ephemeral {
                builder = builder.incognito(true);
            } else if let Some(dir) = &profile {
                let digest = Sha256::digest(dir.as_bytes());
                let mut id = [0u8; 16];
                id.copy_from_slice(&digest[..16]);
                builder = builder.data_store_identifier(id);
            }
            let window = builder.build()?;
            #[cfg(target_os = "macos")]
            if !flag("YAIRPG_WK_THROTTLE") {
                window.with_webview(|webview| {
                    let applied = unthrottle(webview.inner());
                    report(
                        &serde_json::json!({"type": "host", "unthrottled": applied}).to_string(),
                    );
                })?;
            }
            spawn_watchers(app.handle().clone(), mirror_on);
            Ok(())
        })
        .on_window_event(|window, event| {
            if let tauri::WindowEvent::CloseRequested { api, .. } = event {
                if window.label() == "main" && !QUITTING.load(Ordering::SeqCst) {
                    api.prevent_close();
                    quit(window.app_handle().clone());
                }
            }
        })
        .build(tauri::generate_context!())
        .expect("Tauri host failed")
        .run(|app, event| {
            if let tauri::RunEvent::ExitRequested { api, .. } = event {
                if !QUITTING.load(Ordering::SeqCst) {
                    api.prevent_exit();
                    quit(app.clone());
                }
            }
        });
}
