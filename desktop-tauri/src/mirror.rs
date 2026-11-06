// Disk mirror of the page's localStorage (A1, N1). Same layout and rules as
// desktop/save_mirror.cjs, so either host's backups read the same way:
//   latest.json                       newest snapshot, written atomically
//   history/<stamp>-<hash8>.json.gz   rolling snapshots, bounded by prune()
// A snapshot is {schema: 1, savedAt, reason, entries: {key: string}}. The page
// stays the only save writer; the mirror only copies what it wrote.
use flate2::{read::GzDecoder, write::GzEncoder, Compression};
use serde_json::{json, Map, Value};
use sha2::{Digest, Sha256};
use std::{
    collections::BTreeSet,
    fs,
    io::{Read, Write},
    path::{Path, PathBuf},
    time::{SystemTime, UNIX_EPOCH},
};

pub const SAVE_KEY: &str = "save data";
const SCHEMA: u64 = 1;
const KEEP_RECENT: usize = 24;
const DAYS: usize = 14;
const MIN_GAP_MS: u128 = 5 * 60 * 1000;

pub struct Mirror {
    pub dir: PathBuf,
    last_hash: Option<String>,
    last_history_ms: u128,
}

pub fn now_ms() -> u128 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|d| d.as_millis())
        .unwrap_or(0)
}

/// Same hash as save_mirror.cjs: sorted keys, length-prefixed key and value.
pub fn hash_entries(entries: &Map<String, Value>) -> String {
    let mut hash = Sha256::new();
    let keys: BTreeSet<&String> = entries.keys().collect();
    for key in keys {
        let value = entries[key].as_str().unwrap_or("");
        hash.update(format!(
            "{}:{}{}:{}",
            key.encode_utf16().count(),
            key,
            value.encode_utf16().count(),
            value
        ));
    }
    format!("{:x}", hash.finalize())
}

/// Only a real save is worth keeping; an empty or wiped origin never replaces a good mirror.
pub fn has_save(entries: &Map<String, Value>) -> bool {
    match entries.get(SAVE_KEY).and_then(Value::as_str) {
        Some(raw) if raw.len() >= 2 => serde_json::from_str::<Value>(raw)
            .map(|v| !v.is_null())
            .unwrap_or(false),
        _ => false,
    }
}

fn write_atomic(file: &Path, data: &[u8]) -> std::io::Result<()> {
    let temp = file.with_extension(format!("{}.tmp", std::process::id()));
    {
        let mut f = fs::File::create(&temp)?;
        f.write_all(data)?;
        f.sync_all()?;
    }
    fs::rename(&temp, file)
}

/// Local-time stamp like 20261106-153012, matching the Electron file names.
fn stamp(ms: u128) -> String {
    use std::process::Command;
    // Local time without a date crate: ask the OS once per history write.
    let secs = (ms / 1000).to_string();
    Command::new("/bin/date")
        .args(["-r", &secs, "+%Y%m%d-%H%M%S"])
        .output()
        .ok()
        .and_then(|o| String::from_utf8(o.stdout).ok())
        .map(|s| s.trim().to_string())
        .filter(|s| s.len() == 15)
        .unwrap_or_else(|| format!("{:08}-{:06}", 0, (ms / 1000) % 1_000_000))
}

fn iso(ms: u128) -> String {
    let secs = (ms / 1000).to_string();
    std::process::Command::new("/bin/date")
        .args(["-u", "-r", &secs, "+%Y-%m-%dT%H:%M:%S"])
        .output()
        .ok()
        .and_then(|o| String::from_utf8(o.stdout).ok())
        .map(|s| format!("{}.{:03}Z", s.trim(), ms % 1000))
        .unwrap_or_default()
}

fn valid_id(id: &str) -> bool {
    let b = id.as_bytes();
    b.len() == 24
        && b[..8].iter().all(u8::is_ascii_digit)
        && b[8] == b'-'
        && b[9..15].iter().all(u8::is_ascii_digit)
        && b[15] == b'-'
        && b[16..]
            .iter()
            .all(|c| c.is_ascii_digit() || (b'a'..=b'f').contains(c))
}

impl Mirror {
    pub fn open(dir: PathBuf) -> Mirror {
        let mut m = Mirror {
            dir,
            last_hash: None,
            last_history_ms: 0,
        };
        if let Ok(latest) = m.read("latest") {
            if let Some(entries) = latest.get("entries").and_then(Value::as_object) {
                m.last_hash = Some(hash_entries(entries));
            }
            m.last_history_ms = m.history().iter().map(|h| h.1).max().unwrap_or(0);
        }
        m
    }

    fn history_dir(&self) -> PathBuf {
        self.dir.join("history")
    }

    /// (id, modified ms, bytes), newest id first.
    fn history(&self) -> Vec<(String, u128, u64)> {
        let mut out: Vec<_> = fs::read_dir(self.history_dir())
            .into_iter()
            .flatten()
            .flatten()
            .filter_map(|e| {
                let name = e.file_name().into_string().ok()?;
                let id = name.strip_suffix(".json.gz")?.to_string();
                if !valid_id(&id) {
                    return None;
                }
                let meta = e.metadata().ok()?;
                let at = meta
                    .modified()
                    .ok()?
                    .duration_since(UNIX_EPOCH)
                    .ok()?
                    .as_millis();
                Some((id, at, meta.len()))
            })
            .collect();
        out.sort_by(|a, b| b.0.cmp(&a.0));
        out
    }

    fn prune(&self) {
        let all = self.history();
        let mut keep: BTreeSet<String> =
            all.iter().take(KEEP_RECENT).map(|h| h.0.clone()).collect();
        let mut days = BTreeSet::new();
        for h in &all {
            let day = h.0[..8].to_string();
            if days.len() < DAYS && !days.contains(&day) {
                days.insert(day);
                keep.insert(h.0.clone());
            }
        }
        for h in &all {
            if !keep.contains(&h.0) {
                let _ = fs::remove_file(self.history_dir().join(format!("{}.json.gz", h.0)));
            }
        }
    }

    /// Returns "wrote", "wrote+history", or a skip reason. `force` bypasses the
    /// history gap (quit, restore); it never bypasses the empty-save guard.
    pub fn record(
        &mut self,
        entries: &Map<String, Value>,
        reason: &str,
        force: bool,
    ) -> std::io::Result<&'static str> {
        if !has_save(entries) {
            return Ok("no-save");
        }
        let hash = hash_entries(entries);
        if self.last_hash.as_deref() == Some(hash.as_str()) && !force {
            return Ok("unchanged");
        }
        let at = now_ms();
        let snapshot =
            json!({"schema": SCHEMA, "savedAt": iso(at), "reason": reason, "entries": entries});
        let text = serde_json::to_vec(&snapshot)?;
        fs::create_dir_all(self.history_dir())?;
        if self.last_hash.as_deref() != Some(hash.as_str()) {
            write_atomic(&self.dir.join("latest.json"), &text)?;
            self.last_hash = Some(hash.clone());
        }
        if force || at.saturating_sub(self.last_history_ms) >= MIN_GAP_MS {
            let id = format!("{}-{}", stamp(at), &hash[..8]);
            let file = self.history_dir().join(format!("{id}.json.gz"));
            if !file.exists() {
                let mut gz = GzEncoder::new(Vec::new(), Compression::default());
                gz.write_all(&text)?;
                write_atomic(&file, &gz.finish()?)?;
            }
            self.last_history_ms = at;
            self.prune();
            return Ok("wrote+history");
        }
        Ok("wrote")
    }

    pub fn read(&self, id: &str) -> Result<Value, String> {
        let raw = if id == "latest" {
            fs::read_to_string(self.dir.join("latest.json")).map_err(|e| e.to_string())?
        } else {
            if !valid_id(id) {
                return Err("bad snapshot id".into());
            }
            let bytes = fs::read(self.history_dir().join(format!("{id}.json.gz")))
                .map_err(|e| e.to_string())?;
            let mut s = String::new();
            GzDecoder::new(&bytes[..])
                .read_to_string(&mut s)
                .map_err(|e| e.to_string())?;
            s
        };
        let snapshot: Value = serde_json::from_str(&raw).map_err(|e| e.to_string())?;
        let ok = snapshot.get("schema").and_then(Value::as_u64) == Some(SCHEMA)
            && snapshot
                .get("entries")
                .and_then(Value::as_object)
                .map(has_save)
                .unwrap_or(false);
        if ok {
            Ok(snapshot)
        } else {
            Err("snapshot has no save".into())
        }
    }

    /// Newest first; latest.json is listed as id "latest".
    pub fn list(&self) -> Value {
        let mut out = vec![];
        if let Ok(latest) = self.read("latest") {
            let bytes = fs::metadata(self.dir.join("latest.json"))
                .map(|m| m.len())
                .unwrap_or(0);
            out.push(json!({"id": "latest", "bytes": bytes, "savedAt": latest["savedAt"], "reason": latest["reason"]}));
        }
        for (id, _, bytes) in self.history() {
            let head = self.read(&id).ok();
            out.push(json!({"id": id, "bytes": bytes,
                "savedAt": head.as_ref().map(|h| h["savedAt"].clone()).unwrap_or(Value::Null),
                "reason": head.as_ref().map(|h| h["reason"].clone()).unwrap_or(Value::Null)}));
        }
        Value::Array(out)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn entries(save: &str) -> Map<String, Value> {
        let mut m = Map::new();
        m.insert(SAVE_KEY.into(), Value::String(save.into()));
        m.insert("other".into(), Value::String("x".into()));
        m
    }
    fn temp(name: &str) -> PathBuf {
        let dir =
            std::env::temp_dir().join(format!("yairpg-mirror-test-{name}-{}", std::process::id()));
        let _ = fs::remove_dir_all(&dir);
        dir
    }

    #[test]
    fn hash_matches_the_electron_mirror() {
        // node -e "require('./desktop/save_mirror.cjs').hashEntries({'save data':'{\"a\":1}',other:'x'})"
        assert_eq!(
            hash_entries(&entries("{\"a\":1}")),
            "be62a7cb6517b9db063d0ee30c1d5c1032e268d83d9cba6faaec75fcde7108ea"
        );
    }

    #[test]
    fn empty_or_wiped_storage_never_replaces_a_save() {
        let dir = temp("empty");
        let mut m = Mirror::open(dir.clone());
        assert_eq!(m.record(&Map::new(), "poll", true).unwrap(), "no-save");
        assert_eq!(m.record(&entries("null"), "poll", true).unwrap(), "no-save");
        assert!(!dir.join("latest.json").exists());
        let _ = fs::remove_dir_all(dir);
    }

    #[test]
    fn records_latest_and_history_then_reads_them_back() {
        let dir = temp("record");
        let mut m = Mirror::open(dir.clone());
        assert_eq!(
            m.record(&entries("{\"a\":1}"), "poll", false).unwrap(),
            "wrote+history"
        );
        assert_eq!(
            m.record(&entries("{\"a\":1}"), "poll", false).unwrap(),
            "unchanged"
        );
        assert_eq!(
            m.record(&entries("{\"a\":2}"), "poll", false).unwrap(),
            "wrote"
        );
        let list = m.list();
        let items = list.as_array().unwrap();
        assert_eq!(items[0]["id"], "latest");
        assert_eq!(items.len(), 2);
        let latest = m.read("latest").unwrap();
        assert_eq!(latest["entries"][SAVE_KEY], "{\"a\":2}");
        let old = m.read(items[1]["id"].as_str().unwrap()).unwrap();
        assert_eq!(old["entries"][SAVE_KEY], "{\"a\":1}");
        assert!(m.read("../latest").is_err());
        // Reopening keeps the last hash, so an unchanged save is not rewritten.
        let mut again = Mirror::open(dir.clone());
        assert_eq!(
            again.record(&entries("{\"a\":2}"), "poll", false).unwrap(),
            "unchanged"
        );
        let _ = fs::remove_dir_all(dir);
    }
}
