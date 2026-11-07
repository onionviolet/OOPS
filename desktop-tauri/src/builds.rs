// What yairpg://localhost serves, and frozen builds (EL18, N4). Same folders
// and pointers as scripts/tauri/snapshot.cjs; both can make the snapshots:
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

// Snapshot rules, the same as scripts/tauri/snapshot.cjs (which agent tools
// still use), so both name a given tree with the same id. The app itself no
// longer needs Node.
const SNAPSHOT_FILES: &[&str] = &[
    "index.html",
    "style.css",
    "favicon.ico",
    "help.html",
    "changelog.html",
    "dist/bundle.js",
    "dist/bundle.js.map",
    "dist/INKJS_NOTICE.txt",
    "dist/INKJS_AUTHORS.txt",
    "src/game_version.js",
];
const SNAPSHOT_DIRS: &[&str] = &["styles", "resources", "assets", "locales", "stories"];
const REQUIRED: &[&str] = &["index.html", "dist/bundle.js"];
const KEEP: usize = 3;

fn walk(
    root: &Path,
    rel: &str,
    ancestors: &[PathBuf],
    files: &mut Vec<String>,
) -> Result<(), String> {
    let real = std::fs::canonicalize(root.join(rel)).map_err(|e| e.to_string())?;
    if ancestors.contains(&real) {
        return Err(format!("snapshot directory link cycle: {rel}"));
    }
    let mut next = ancestors.to_vec();
    next.push(real);
    for entry in std::fs::read_dir(root.join(rel)).map_err(|e| e.to_string())? {
        let entry = entry.map_err(|e| e.to_string())?;
        let name = entry.file_name().to_string_lossy().into_owned();
        let child = format!("{rel}/{name}");
        let Ok(meta) = std::fs::metadata(root.join(&child)) else {
            continue;
        };
        if meta.is_dir() {
            walk(root, &child, &next, files)?;
        } else if meta.is_file() && name != ".DS_Store" {
            files.push(child);
        }
    }
    Ok(())
}

fn list_files(root: &Path) -> Result<Vec<String>, String> {
    let mut files = vec![];
    for rel in SNAPSHOT_FILES {
        if root.join(rel).exists() {
            files.push(rel.to_string());
        } else if REQUIRED.contains(rel) {
            return Err(format!(
                "snapshot source is missing {rel}; run npm run build first"
            ));
        }
    }
    for dir in SNAPSHOT_DIRS {
        if root.join(dir).exists() {
            walk(root, dir, &[], &mut files)?;
        }
    }
    let manifest = "private_packs/manifest.json";
    if root.join(manifest).exists() {
        files.push(manifest.into());
        let parsed: serde_json::Value = std::fs::read(root.join(manifest))
            .ok()
            .and_then(|b| serde_json::from_slice(&b).ok())
            .unwrap_or_default();
        let strings = |key: &str| -> Vec<String> {
            parsed[key]
                .as_array()
                .map(|a| {
                    a.iter()
                        .filter_map(|v| v.as_str().map(String::from))
                        .collect()
                })
                .unwrap_or_default()
        };
        let safe = |s: &str, extra: &str| {
            !s.is_empty()
                && s.chars()
                    .all(|c| c.is_ascii_alphanumeric() || c == '_' || c == '-' || extra.contains(c))
        };
        let mut packs: Vec<String> = strings("packs")
            .into_iter()
            .filter_map(|p| {
                let (pack, file) = p.split_once('/')?;
                (file.eq_ignore_ascii_case("pack.json") && safe(pack, "")).then(|| pack.to_string())
            })
            .collect();
        packs.dedup();
        for pack in packs {
            let rel = format!("private_packs/{pack}");
            if root.join(&rel).exists() {
                walk(root, &rel, &[], &mut files)?;
            }
        }
        for file in strings("supplements") {
            let ok = file.split_once('/').is_some_and(|(dir, name)| {
                safe(dir, "") && safe(name, "._") && name.to_ascii_lowercase().ends_with(".json")
            });
            if ok && root.join("private_packs").join(&file).exists() {
                files.push(format!("private_packs/{file}"));
            }
        }
    }
    files.sort();
    files.dedup();
    Ok(files)
}

fn game_version(root: &Path) -> String {
    let text = std::fs::read_to_string(root.join("src/game_version.js")).unwrap_or_default();
    text.split("game_version")
        .nth(1)
        .and_then(|rest| rest.trim_start().strip_prefix('='))
        .and_then(|rest| rest.trim_start().strip_prefix('"'))
        .and_then(|rest| rest.split('"').next())
        .filter(|v| !v.is_empty())
        .unwrap_or("dev")
        .to_string()
}

fn fingerprint(root: &Path, files: &[String]) -> Result<String, String> {
    use sha2::{Digest, Sha256};
    let mut hash = Sha256::new();
    for rel in files {
        hash.update(rel.as_bytes());
        hash.update([0]);
        hash.update(std::fs::read(root.join(rel)).map_err(|e| format!("{rel}: {e}"))?);
        hash.update([0]);
    }
    let hex: String = hash.finalize().iter().map(|b| format!("{b:02x}")).collect();
    Ok(hex[..12].to_string())
}

fn prune(user_data: &Path) {
    let dir = builds_dir(user_data);
    let keep: Vec<String> = ["latest.json", "current.json"]
        .iter()
        .filter_map(|n| read_pointer(user_data, n))
        .collect();
    let Ok(entries) = std::fs::read_dir(&dir) else {
        return;
    };
    let mut old: Vec<(std::time::SystemTime, PathBuf)> = entries
        .flatten()
        .filter(|e| e.path().is_dir())
        .filter(|e| {
            let name = e.file_name().to_string_lossy().into_owned();
            !name.starts_with('.') && !keep.contains(&name)
        })
        .filter_map(|e| Some((e.metadata().ok()?.modified().ok()?, e.path())))
        .collect();
    old.sort_by(|a, b| b.0.cmp(&a.0));
    let mut unique = keep.clone();
    unique.dedup();
    for (_, path) in old.into_iter().skip(KEEP.saturating_sub(unique.len())) {
        let _ = std::fs::remove_dir_all(path);
    }
}

/// Copies the page files from `from` into a new snapshot and points latest at
/// it. The folder appears whole (temp copy, then rename) before the pointer.
pub fn make_snapshot_from(from: &Path, user_data: &Path) -> Result<String, String> {
    let files = list_files(from)?;
    let id = format!("{}-{}", game_version(from), fingerprint(from, &files)?);
    let dir = builds_dir(user_data);
    let target = dir.join(&id);
    std::fs::create_dir_all(&dir).map_err(|e| e.to_string())?;
    if !target.join("index.html").exists() {
        let temp = dir.join(format!(".tmp-{id}-{}", std::process::id()));
        let _ = std::fs::remove_dir_all(&temp);
        for rel in &files {
            let to = temp.join(rel);
            if let Some(parent) = to.parent() {
                std::fs::create_dir_all(parent).map_err(|e| e.to_string())?;
            }
            std::fs::copy(from.join(rel), &to).map_err(|e| format!("{rel}: {e}"))?;
        }
        let _ = std::fs::remove_dir_all(&target);
        std::fs::rename(&temp, &target).map_err(|e| e.to_string())?;
    }
    write_pointer(user_data, "latest.json", &id);
    prune(user_data);
    Ok(id)
}

/// First run of a frozen host: snapshot the working tree.
fn make_snapshot(user_data: &Path) -> Option<String> {
    match make_snapshot_from(&repo_root(), user_data) {
        Ok(id) => Some(id),
        Err(e) => {
            eprintln!("snapshot failed: {e}");
            None
        }
    }
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
                .ok_or("no frozen build and the snapshot failed (run npm run build first)")?;
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

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn snapshot_id_matches_the_node_script() {
        let repo = repo_root();
        if !repo.join("dist/bundle.js").exists() {
            return;
        }
        let files = list_files(&repo).unwrap();
        let ours = format!(
            "{}-{}",
            game_version(&repo),
            fingerprint(&repo, &files).unwrap()
        );
        let out = std::process::Command::new("node")
            .arg("-e")
            .arg("const s=require('./scripts/tauri/snapshot.cjs');const f=s.listFiles('.');const c=require('node:crypto').createHash('sha256');for(const r of f){c.update(r+'\\0');c.update(require('node:fs').readFileSync(r));c.update('\\0');}console.log(f.length+' '+c.digest('hex').slice(0,12))")
            .current_dir(&repo)
            .output();
        let Ok(out) = out else { return };
        let text = String::from_utf8_lossy(&out.stdout);
        let (count, hash) = text.trim().split_once(' ').unwrap();
        assert_eq!(count.parse::<usize>().unwrap(), files.len());
        assert!(ours.ends_with(hash), "{ours} vs {hash}");
    }
}
