// Tauri desktop host (AD39, amended 2026-11-06). Serves the repository's web
// build over yairpg://localhost/ and exposes the same window.yairpgHost object
// the Electron preload does, minus the features not ported yet (see README).
// src/ never imports this folder.
use sha2::{Digest, Sha256};
use std::{
    borrow::Cow,
    fs::OpenOptions,
    io::Write,
    path::{Path, PathBuf},
};
use tauri::{
    http::{Request, Response},
    utils::config::BackgroundThrottlingPolicy,
    Manager, WebviewUrl, WebviewWindowBuilder,
};

fn flag(name: &str) -> bool {
    matches!(std::env::var(name).as_deref(), Ok("1"))
}

fn root() -> PathBuf {
    std::env::var("YAIRPG_ROOT")
        .map(PathBuf::from)
        .unwrap_or_else(|_| Path::new(env!("CARGO_MANIFEST_DIR")).join(".."))
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

fn respond(status: u16, kind: &str, body: Vec<u8>) -> Response<Cow<'static, [u8]>> {
    Response::builder()
        .status(status)
        .header("Content-Type", kind)
        .header("Access-Control-Allow-Origin", "*")
        .body(Cow::Owned(body))
        .unwrap()
}

fn serve(app: &tauri::AppHandle, request: Request<Vec<u8>>) -> Response<Cow<'static, [u8]>> {
    let raw = request.uri().path().to_string();
    let path = percent_decode(&raw);
    if path.starts_with("/__harness/") {
        if std::env::var("YAIRPG_REPORT").is_err() {
            return respond(404, "text/plain", vec![]);
        }
        if path == "/__harness/report" {
            report(&String::from_utf8_lossy(request.body()));
        } else if path == "/__harness/exit" {
            let app = app.clone();
            std::thread::spawn(move || {
                std::thread::sleep(std::time::Duration::from_millis(100));
                app.exit(0);
            });
        }
        return respond(204, "text/plain", vec![]);
    }
    let rel = path.trim_start_matches('/');
    let rel = if rel.is_empty() { "index.html" } else { rel };
    if rel.split('/').any(|part| part == "..") {
        return respond(403, "text/plain", vec![]);
    }
    match std::fs::read(root().join(rel)) {
        Ok(bytes) => respond(200, mime(rel), bytes),
        Err(_) => {
            report(&serde_json::json!({"type": "miss", "path": rel}).to_string());
            respond(404, "text/plain", vec![])
        }
    }
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

fn host_script(background: bool) -> String {
    format!(
        r#"(() => {{
  const background = {background};
  window.yairpgHost = Object.freeze({{
    desktop: true, shell: 'tauri', background, build: 'tauri-live', capabilities: [],
    prompt: () => null,
    mirrorList: async () => [], mirrorRestore: async () => false,
    attention: () => {{}},
    projectionLatest: async () => null,
  }});
  if (background) {{
    window.alert = m => console.warn('[background alert]', m);
    window.confirm = m => {{ console.warn('[background confirm, cancelled]', m); return false; }};
    window.prompt = () => null;
  }}
}})();"#
    )
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
    let harness = std::env::var("YAIRPG_HARNESS_SCRIPT")
        .ok()
        .map(|p| std::fs::read_to_string(p).expect("harness script unreadable"));

    tauri::Builder::default()
        .register_asynchronous_uri_scheme_protocol("yairpg", |ctx, request, responder| {
            let app = ctx.app_handle().clone();
            std::thread::spawn(move || responder.respond(serve(&app, request)));
        })
        .setup(move |app| {
            #[cfg(target_os = "macos")]
            if hidden {
                app.set_activation_policy(tauri::ActivationPolicy::Accessory);
                app.set_dock_visibility(false);
            }
            let mut builder =
                WebviewWindowBuilder::new(app, "main", WebviewUrl::External(url.parse()?))
                    .title("Yet Another Idle RPG")
                    .inner_size(1920.0, 1080.0)
                    .visible(!hidden)
                    .focused(!hidden)
                    .background_throttling(BackgroundThrottlingPolicy::Disabled)
                    .initialization_script(host_script(hidden));
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
            let _ = app.get_webview_window("main");
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("Tauri host failed");
}
