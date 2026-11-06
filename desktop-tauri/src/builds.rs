// What yairpg://localhost serves, and frozen builds (EL18, N4). Same folders
// and pointers as desktop/snapshot.cjs, which makes the snapshots:
//   <userData>/builds/<version>-<fingerprint>/   page files
//   <userData>/builds/latest.json                 newest snapshot made
//   <userData>/builds/current.json                snapshot the player adopted
// The player's window serves a snapshot, so an agent's `npm run build` never
// changes what an open game loads. A newer snapshot is offered, never forced.
use std::{
    path::{Path, PathBuf},
    sync::Mutex,
};

pub struct Serving {
    pub id: String,
    pub root: PathBuf,
    pub announced: Option<String>,
    user_data: Option<PathBuf>,
}

static SERVING: Mutex<Option<Serving>> = Mutex::new(None);

pub fn repo_root() -> PathBuf {
    Path::new(env!("CARGO_MANIFEST_DIR")).join("..")
}

fn builds_dir(user_data: &Path) -> PathBuf {
    user_data.join("builds")
}

fn valid_id(id: &str) -> bool {
    !id.is_empty()
        && id
            .chars()
            .all(|c| c.is_ascii_alphanumeric() || matches!(c, '.' | '_' | '-'))
}

pub fn read_pointer(user_data: &Path, name: &str) -> Option<String> {
    let text = std::fs::read_to_string(builds_dir(user_data).join(name)).ok()?;
    let value: serde_json::Value = serde_json::from_str(&text).ok()?;
    let id = value.get("id")?.as_str()?.to_string();
    (valid_id(&id) && builds_dir(user_data).join(&id).join("index.html").exists()).then_some(id)
}

fn write_pointer(user_data: &Path, name: &str, id: &str) {
    let file = builds_dir(user_data).join(name);
    let temp = file.with_extension(format!("{}.tmp", std::process::id()));
    let body =
        serde_json::json!({"id": id, "at": crate::mirror::now_ms().to_string(), "host": "tauri"});
    if std::fs::write(&temp, body.to_string()).is_ok() {
        let _ = std::fs::rename(&temp, &file);
    }
}

/// First run of a frozen host: snapshot the working tree with the shared script.
fn make_snapshot(user_data: &Path) -> Option<String> {
    let repo = repo_root();
    // Apps opened from Finder lack the shell PATH; try the usual node homes too.
    let home = std::env::var("HOME").unwrap_or_default();
    let node = [
        format!("{home}/.local/bin/node"),
        "/opt/homebrew/bin/node".into(),
        "/usr/local/bin/node".into(),
    ]
    .into_iter()
    .find(|p| Path::new(p).exists())
    .unwrap_or_else(|| "node".into());
    let status = std::process::Command::new(node)
        .arg(repo.join("desktop/snapshot.cjs"))
        .args(["--from", &repo.to_string_lossy()])
        .env("YAIRPG_USER_DATA", user_data)
        .status()
        .ok()?;
    status
        .success()
        .then(|| read_pointer(user_data, "latest.json"))
        .flatten()
}

/// Live: YAIRPG_ROOT, or the working tree for hidden runs without YAIRPG_FROZEN=1.
/// Frozen: the newest snapshot under user_data (made on first run).
pub fn init(user_data: Option<&Path>, live: Option<PathBuf>) -> Result<(), String> {
    let serving = match (live, user_data) {
        (Some(root), _) => Serving {
            id: "live".into(),
            root,
            announced: None,
            user_data: None,
        },
        (None, Some(user_data)) => {
            let id = read_pointer(user_data, "latest.json")
                .or_else(|| make_snapshot(user_data))
                .ok_or("no frozen build and the snapshot script failed (is node on PATH?)")?;
            write_pointer(user_data, "current.json", &id);
            Serving {
                root: builds_dir(user_data).join(&id),
                id,
                announced: None,
                user_data: Some(user_data.to_path_buf()),
            }
        }
        (None, None) => return Err("frozen builds need a data folder".into()),
    };
    *SERVING.lock().unwrap() = Some(serving);
    Ok(())
}

pub fn root() -> PathBuf {
    SERVING
        .lock()
        .ok()
        .and_then(|s| s.as_ref().map(|s| s.root.clone()))
        .unwrap_or_else(repo_root)
}

pub fn state() -> serde_json::Value {
    let guard = SERVING.lock().unwrap();
    match guard.as_ref() {
        Some(s) => {
            serde_json::json!({"serving": s.id, "announced": s.announced, "frozen": s.user_data.is_some()})
        }
        None => serde_json::json!({"serving": "live", "announced": null, "frozen": false}),
    }
}

/// Returns a newly announced build id when latest.json moved past what is served.
pub fn poll() -> Option<String> {
    let mut guard = SERVING.lock().ok()?;
    let s = guard.as_mut()?;
    let latest = read_pointer(s.user_data.as_ref()?, "latest.json")?;
    if latest == s.id || s.announced.as_deref() == Some(latest.as_str()) {
        return None;
    }
    s.announced = Some(latest.clone());
    Some(latest)
}

/// The player's click: switch to the announced build if it is still the newest.
pub fn adopt() -> bool {
    let mut guard = SERVING.lock().unwrap();
    let Some(s) = guard.as_mut() else {
        return false;
    };
    let (Some(next), Some(user_data)) = (s.announced.clone(), s.user_data.clone()) else {
        return false;
    };
    if read_pointer(&user_data, "latest.json").as_deref() != Some(next.as_str()) {
        return false;
    }
    s.root = builds_dir(&user_data).join(&next);
    s.id = next.clone();
    s.announced = None;
    write_pointer(&user_data, "current.json", &next);
    true
}
