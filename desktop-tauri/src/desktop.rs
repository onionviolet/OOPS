// Desktop chrome for the player's window (N6-N8), ported from desktop/:
// app_menu.cjs (menu), presence_host.cjs (Dock badge, notifications),
// popout_host.cjs + popout_page.cjs (pop-out panels). Window size and position
// (A7) use tauri-plugin-window-state, registered in main only for visible runs.
use std::{
    collections::HashMap,
    sync::{
        atomic::{AtomicI64, AtomicU64, Ordering},
        Mutex,
    },
};
use tauri::{
    menu::{Menu, MenuBuilder, MenuItemBuilder, PredefinedMenuItem, SubmenuBuilder},
    AppHandle, Manager, WebviewUrl, WebviewWindowBuilder, Wry,
};

pub const POPOUT_PATH: &str = "/__host/popout.html";

// ---- menu (A7) ----

pub fn menu(app: &AppHandle) -> tauri::Result<Menu<Wry>> {
    let app_menu = SubmenuBuilder::new(app, "Yet Another Idle RPG")
        .item(&PredefinedMenuItem::about(app, None, None)?)
        .separator()
        .item(&PredefinedMenuItem::hide(app, None)?)
        .item(&PredefinedMenuItem::hide_others(app, None)?)
        .item(&PredefinedMenuItem::show_all(app, None)?)
        .separator()
        .item(&PredefinedMenuItem::quit(app, None)?)
        .build()?;
    let file = SubmenuBuilder::new(app, "File")
        .item(
            &MenuItemBuilder::with_id("save-now", "Save now")
                .accelerator("CmdOrCtrl+S")
                .build(app)?,
        )
        .separator()
        .item(&MenuItemBuilder::with_id("restore-backup", "Restore a backup...").build(app)?)
        .item(&MenuItemBuilder::with_id("show-backups", "Show backups folder").build(app)?)
        .separator()
        .item(&PredefinedMenuItem::close_window(app, None)?)
        .build()?;
    // Without the standard edit items, copy and paste stop working in text fields.
    let edit = SubmenuBuilder::new(app, "Edit")
        .item(&PredefinedMenuItem::undo(app, None)?)
        .item(&PredefinedMenuItem::redo(app, None)?)
        .separator()
        .item(&PredefinedMenuItem::cut(app, None)?)
        .item(&PredefinedMenuItem::copy(app, None)?)
        .item(&PredefinedMenuItem::paste(app, None)?)
        .item(&PredefinedMenuItem::select_all(app, None)?)
        .build()?;
    let view = SubmenuBuilder::new(app, "View")
        .item(
            &MenuItemBuilder::with_id("popout-events", "Pop out world events")
                .accelerator("CmdOrCtrl+Shift+E")
                .build(app)?,
        )
        .separator()
        .item(
            &MenuItemBuilder::with_id("reload", "Reload")
                .accelerator("CmdOrCtrl+R")
                .build(app)?,
        )
        .separator()
        .item(
            &MenuItemBuilder::with_id("zoom-reset", "Actual size")
                .accelerator("CmdOrCtrl+0")
                .build(app)?,
        )
        .item(
            &MenuItemBuilder::with_id("zoom-in", "Zoom in")
                .accelerator("CmdOrCtrl+=")
                .build(app)?,
        )
        .item(
            &MenuItemBuilder::with_id("zoom-out", "Zoom out")
                .accelerator("CmdOrCtrl+-")
                .build(app)?,
        )
        .separator()
        .item(&PredefinedMenuItem::fullscreen(app, None)?)
        .build()?;
    let window = SubmenuBuilder::new(app, "Window")
        .item(&PredefinedMenuItem::minimize(app, None)?)
        .item(&PredefinedMenuItem::maximize(app, None)?)
        .build()?;
    MenuBuilder::new(app)
        .items(&[&app_menu, &file, &edit, &view, &window])
        .build()
}

static ZOOM_PERCENT: AtomicU64 = AtomicU64::new(100);

/// Menu actions; `mirror_dir` is where "Show backups folder" points.
pub fn on_menu(app: &AppHandle, id: &str, mirror_dir: Option<std::path::PathBuf>) {
    let main = app.get_webview_window("main");
    match id {
        "save-now" => {
            if let Some(w) = &main {
                let _ = w.eval(&crate::mirror_js("manual", true, true));
            }
        }
        "restore-backup" => {
            if let (Some(w), Ok(url)) = (
                &main,
                format!("yairpg://localhost{}?reason=manual", crate::RECOVER_PATH).parse(),
            ) {
                let _ =
                    w.eval("try { window.saveProgress && window.saveProgress(); } catch (e) {}");
                let _ = w.navigate(url);
            }
        }
        "show-backups" => {
            if let Some(dir) = mirror_dir {
                let _ = std::fs::create_dir_all(&dir);
                let _ = std::process::Command::new("open").arg(dir).status();
            }
        }
        "popout-events" => {
            let _ = open_popout(app, "events", false);
        }
        "reload" => {
            if let Some(w) = &main {
                let _ = w.eval("try { window.saveProgress && window.saveProgress(); } catch (e) {} location.reload()");
            }
        }
        "zoom-reset" | "zoom-in" | "zoom-out" => {
            let now = ZOOM_PERCENT.load(Ordering::SeqCst);
            let next = match id {
                "zoom-in" => (now + 10).min(200),
                "zoom-out" => now.saturating_sub(10).max(50),
                _ => 100,
            };
            ZOOM_PERCENT.store(next, Ordering::SeqCst);
            if let Some(w) = &main {
                let _ = w.set_zoom(next as f64 / 100.0);
            }
        }
        _ => {}
    }
}

// ---- presence (A4) ----

static ATTENTION_COUNT: AtomicI64 = AtomicI64::new(0);
static LAST_NOTE_MS: AtomicU64 = AtomicU64::new(0);

/// The page reports how many leads wait. The Dock badge follows the count; a
/// notification appears only when the count rises, the window is not focused,
/// and at most once a minute. Background runs show nothing.
pub fn attention(app: &AppHandle, count: i64, label: &str, background: bool) -> serde_json::Value {
    let before = ATTENTION_COUNT.swap(count, Ordering::SeqCst);
    let rose = count > before;
    let mut notified = false;
    if !background {
        if let Some(w) = app.get_webview_window("main") {
            let _ = w.set_badge_count((count > 0).then_some(count));
            let focused = w.is_focused().unwrap_or(true);
            let now = crate::mirror::now_ms() as u64;
            if rose && !focused && now.saturating_sub(LAST_NOTE_MS.load(Ordering::SeqCst)) >= 60_000
            {
                LAST_NOTE_MS.store(now, Ordering::SeqCst);
                notified = notify(if label.is_empty() {
                    "Something is waiting."
                } else {
                    label
                });
            }
        }
    }
    serde_json::json!({"count": count, "rose": rose, "notified": notified})
}

/// macOS notification through UNUserNotificationCenter (asks permission once).
/// Clicking it brings the app forward, which is the only thing that does.
#[cfg(target_os = "macos")]
fn notify(body: &str) -> bool {
    use objc2_foundation::NSString;
    use objc2_user_notifications::{
        UNAuthorizationOptions, UNMutableNotificationContent, UNNotificationRequest,
        UNUserNotificationCenter,
    };
    // Only a bundled app (with an identifier) may use the notification center.
    if !std::env::current_exe()
        .map(|p| p.to_string_lossy().contains(".app/Contents/MacOS/"))
        .unwrap_or(false)
    {
        return false;
    }
    let center = UNUserNotificationCenter::currentNotificationCenter();
    let done = block2::RcBlock::new(
        |_granted: objc2::runtime::Bool, _error: *mut objc2_foundation::NSError| {},
    );
    center.requestAuthorizationWithOptions_completionHandler(UNAuthorizationOptions::Alert, &done);
    let content = UNMutableNotificationContent::new();
    content.setTitle(&NSString::from_str("YAIRPG"));
    content.setBody(&NSString::from_str(body));
    let id = NSString::from_str(&format!("yairpg-{}", crate::mirror::now_ms()));
    let request = UNNotificationRequest::requestWithIdentifier_content_trigger(&id, &content, None);
    center.addNotificationRequest_withCompletionHandler(&request, None);
    true
}

#[cfg(not(target_os = "macos"))]
fn notify(_body: &str) -> bool {
    false
}

// ---- pop-outs (A3) ----

static PROJECTIONS: Mutex<Option<HashMap<String, serde_json::Value>>> = Mutex::new(None);

/// Same trimming as popout_page.cjs cleanProjection: a bad payload cannot flood a window.
pub fn clean_projection(name: &str, data: &serde_json::Value) -> Option<serde_json::Value> {
    if name != "events" || !data.is_object() {
        return None;
    }
    let text = |v: &serde_json::Value, n: usize| -> String {
        let s = match v {
            serde_json::Value::String(s) => s.clone(),
            serde_json::Value::Null => String::new(),
            other => other.to_string(),
        };
        s.chars().take(n).collect()
    };
    let leads: Vec<_> = data["leads"].as_array().map(|a| a.iter().take(30).map(|l| serde_json::json!({
        "label": text(&l["label"], 160), "detail": text(&l["detail"], 240), "available": l["available"] == true,
    })).collect()).unwrap_or_default();
    let news: Vec<_> = data["news"]
        .as_array()
        .map(|a| {
            a.iter()
                .take(40)
                .map(|t| serde_json::Value::String(text(t, 300)))
                .collect()
        })
        .unwrap_or_default();
    Some(serde_json::json!({"leads": leads, "news": news}))
}

/// Stores the latest projection and pushes it to an open pop-out.
pub fn projection(app: &AppHandle, name: &str, data: &serde_json::Value) {
    let Some(clean) = clean_projection(name, data) else {
        return;
    };
    PROJECTIONS
        .lock()
        .unwrap()
        .get_or_insert_with(HashMap::new)
        .insert(name.to_string(), clean.clone());
    if let Some(w) = app.get_webview_window(&format!("popout-{name}")) {
        let _ = w.eval(&format!(
            "window.__yairpgProjection && window.__yairpgProjection({}, {})",
            serde_json::Value::String(name.into()),
            clean
        ));
    }
}

pub fn projection_latest(name: &str) -> serde_json::Value {
    PROJECTIONS
        .lock()
        .unwrap()
        .as_ref()
        .and_then(|m| m.get(name).cloned())
        .unwrap_or(serde_json::Value::Null)
}

/// Opened from the View menu (or a test), never by the host on its own.
pub fn open_popout(app: &AppHandle, panel: &str, hidden: bool) -> tauri::Result<()> {
    let label = format!("popout-{panel}");
    if let Some(w) = app.get_webview_window(&label) {
        if !hidden {
            let _ = w.unminimize();
            let _ = w.show();
            let _ = w.set_focus();
        }
        return Ok(());
    }
    let url = format!("yairpg://localhost{POPOUT_PATH}?panel={panel}");
    WebviewWindowBuilder::new(
        app,
        &label,
        WebviewUrl::External(
            url.parse()
                .map_err(|_| tauri::Error::InvalidWebviewUrl("popout"))?,
        ),
    )
    .title("YAIRPG: world events")
    .inner_size(480.0, 720.0)
    .min_inner_size(320.0, 320.0)
    .visible(!hidden)
    .focused(!hidden)
    .initialization_script(crate::host_script(hidden, false, "popout"))
    .build()?;
    Ok(())
}

pub fn popout_page(panel: &str) -> String {
    let title = if panel == "events" {
        "World events"
    } else {
        "Panel"
    };
    let panel_json = serde_json::Value::String(panel.into());
    format!(
        r#"<!doctype html><meta charset="utf-8"><title>YAIRPG: {title}</title>
<style>
:root{{color-scheme:dark}}
body{{margin:0;background:#1b1b1b;color:#e8e8e8;font:14px/1.45 system-ui,sans-serif}}
main{{padding:12px 16px;max-width:640px}}
h1{{font-size:16px;margin:0 0 4px}}
h2{{font-size:13px;margin:16px 0 6px;color:#b9b9b9;font-weight:600}}
p.note{{margin:0;color:#9a9a9a;font-size:12px}}
ul,ol{{margin:0;padding:0;list-style:none}}
li{{padding:6px 8px;border:1px solid #444;background:#222;margin-bottom:6px;overflow-wrap:anywhere}}
li strong{{display:block}}
li span{{color:#b9b9b9;font-size:13px}}
ol li{{border-color:#333;background:transparent;padding:3px 0;border-width:0 0 1px}}
.empty{{color:#8a8a8a}}
</style>
<main>
<h1 id="popout_title">{title}</h1>
<p class="note" id="popout_status">Waiting for the game window...</p>
<div aria-live="polite">
<h2>Waiting for you</h2><ul id="popout_leads"></ul>
<h2>Recent news</h2><ol id="popout_news"></ol>
</div>
</main>
<script>
const leads = document.getElementById('popout_leads'), news = document.getElementById('popout_news'), status = document.getElementById('popout_status');
function li(tag, text) {{ const n = document.createElement(tag); n.textContent = text; return n; }}
function show(data) {{
    if (!data) return;
    status.textContent = 'Read-only. Act on these in the game window.';
    leads.replaceChildren(...(data.leads.length ? data.leads.map(l => {{ const row = li('li', ''); const s = li('strong', l.label + (l.available ? '' : ' (not yet)')); row.append(s, li('span', l.detail || '')); return row; }}) : [Object.assign(li('li', 'Nothing is waiting.'), {{ className: 'empty' }})]));
    news.replaceChildren(...data.news.map(t => li('li', t)));
    document.body.dataset.shown = String(data.leads.length + data.news.length);
    // Test runs only: the harness route exists only with a report file.
    fetch('/__harness/report', {{method: 'POST', body: JSON.stringify({{type: 'popout-shown', leads: data.leads.length, news: data.news.length}})}}).catch(() => {{}});
}}
window.__yairpgProjection = (name, data) => {{ if (name === {panel_json}) show(data); }};
fetch('/__host/projection-latest?name=' + encodeURIComponent({panel_json})).then(r => r.json()).then(show).catch(() => {{}});
</script>"#
    )
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn projections_are_trimmed_like_the_electron_host() {
        let long = "x".repeat(500);
        let data = serde_json::json!({"leads": (0..40).map(|i| serde_json::json!({"label": long, "detail": i, "available": i % 2 == 0})).collect::<Vec<_>>(),
            "news": (0..50).map(|_| long.clone()).collect::<Vec<_>>()});
        let clean = clean_projection("events", &data).unwrap();
        assert_eq!(clean["leads"].as_array().unwrap().len(), 30);
        assert_eq!(clean["leads"][0]["label"].as_str().unwrap().len(), 160);
        assert_eq!(clean["leads"][3]["detail"], "3");
        assert_eq!(clean["leads"][1]["available"], false);
        assert_eq!(clean["news"].as_array().unwrap().len(), 40);
        assert_eq!(clean["news"][0].as_str().unwrap().len(), 300);
        assert!(clean_projection("other", &data).is_none());
        assert!(clean_projection("events", &serde_json::json!(3)).is_none());
    }
}
