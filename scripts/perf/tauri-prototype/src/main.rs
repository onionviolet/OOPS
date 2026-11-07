use tauri::{utils::config::BackgroundThrottlingPolicy, WebviewUrl, WebviewWindowBuilder};
fn main() {
    // Deliberately background-only. No player profile, menu or system integration.
    let url = std::env::var("OOPS_BENCH_URL").expect("OOPS_BENCH_URL required");
    assert!(
        url.starts_with("http://127.0.0.1:"),
        "loopback benchmark only"
    );
    tauri::Builder::default()
        .setup(move |app| {
            #[cfg(target_os = "macos")]
            {
                app.set_activation_policy(tauri::ActivationPolicy::Accessory);
                app.set_dock_visibility(false);
            }
            WebviewWindowBuilder::new(app, "bench", WebviewUrl::External(url.parse()?))
                .title("OOPS benchmark (hidden)")
                .inner_size(1920.0, 1080.0)
                .decorations(false)
                .visible(false)
                .focused(false)
                .incognito(true)
                .background_throttling(BackgroundThrottlingPolicy::Disabled)
                .build()?;
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("Tauri benchmark failed");
}
