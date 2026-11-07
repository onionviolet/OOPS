// Host-owned save store (O2, 2026-11-06). The page's localStorage is a cache;
// this file is the copy that survives a lost or re-keyed WebKit store:
//   <userData>/storage/local.json   {schema, rev, savedAt, entries: {key: string}}
// The main window's init script (main.rs host_script) sends every localStorage
// change here in order, each batch tagged with a revision that the page also
// keeps in localStorage under REV_KEY. At page start the script compares the
// two: a store ahead of the page (WebKit lost its data) is copied back into
// localStorage before the game reads it; a page ahead of the store (a batch was
// lost) is pushed whole. The game code never knows (AR3, AR4).
use serde_json::{json, Map, Value};
use std::{fs, path::PathBuf};

pub const REV_KEY: &str = "yairpg.host.rev";
const SCHEMA: u64 = 1;

pub struct Store {
    file: PathBuf,
    pub rev: u64,
    pub present: bool,
    pub entries: Map<String, Value>,
    dirty: bool,
}

impl Store {
    pub fn open(dir: PathBuf) -> Store {
        let file = dir.join("local.json");
        let parsed = fs::read(&file)
            .ok()
            .and_then(|b| serde_json::from_slice::<Value>(&b).ok());
        match parsed {
            Some(Value::Object(mut v)) if v.get("schema") == Some(&json!(SCHEMA)) => Store {
                file,
                rev: v.get("rev").and_then(Value::as_u64).unwrap_or(0),
                present: true,
                entries: match v.remove("entries") {
                    Some(Value::Object(e)) => e,
                    _ => Map::new(),
                },
                dirty: false,
            },
            _ => Store {
                file,
                rev: 0,
                present: false,
                entries: Map::new(),
                dirty: false,
            },
        }
    }

    pub fn state(&self) -> Value {
        json!({"rev": self.rev, "present": self.present, "keys": self.entries.len()})
    }

    pub fn snapshot(&self) -> Value {
        json!({"rev": self.rev, "entries": self.entries})
    }

    /// Applies one batch {rev, clear, set: {k: v}, del: [k]} in memory; flush()
    /// writes it. The game saves about once a second, so the host batches disk
    /// writes (main.rs flushes every few seconds and on quit).
    /// A batch older than the store is refused, so a late duplicate never rolls
    /// saves back.
    pub fn apply(&mut self, batch: &Value) -> Result<u64, String> {
        let rev = batch.get("rev").and_then(Value::as_u64).ok_or("no rev")?;
        if self.present && rev <= self.rev && !batch["full"].as_bool().unwrap_or(false) {
            return Err(format!("stale rev {rev} <= {}", self.rev));
        }
        if batch["clear"].as_bool().unwrap_or(false) {
            self.entries.clear();
        }
        if let Some(del) = batch["del"].as_array() {
            for k in del.iter().filter_map(Value::as_str) {
                self.entries.remove(k);
            }
        }
        if let Some(set) = batch["set"].as_object() {
            for (k, v) in set {
                if k != REV_KEY && v.is_string() {
                    self.entries.insert(k.clone(), v.clone());
                }
            }
        }
        self.rev = rev;
        self.present = true;
        self.dirty = true;
        Ok(rev)
    }

    /// Writes the file if anything changed since the last write.
    pub fn flush(&mut self) -> std::io::Result<bool> {
        if !self.dirty {
            return Ok(false);
        }
        self.write()?;
        self.dirty = false;
        Ok(true)
    }

    fn write(&self) -> std::io::Result<()> {
        if let Some(dir) = self.file.parent() {
            fs::create_dir_all(dir)?;
        }
        let body = json!({"schema": SCHEMA, "rev": self.rev, "savedAt": crate::mirror::now_ms().to_string(), "entries": self.entries});
        crate::mirror::write_atomic(&self.file, &serde_json::to_vec(&body)?)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn dir(name: &str) -> PathBuf {
        let d = std::env::temp_dir().join(format!("yairpg-store-{name}-{}", std::process::id()));
        let _ = fs::remove_dir_all(&d);
        d
    }

    #[test]
    fn batches_persist_and_reopen() {
        let d = dir("persist");
        let mut s = Store::open(d.clone());
        assert!(!s.present);
        s.apply(&json!({"rev": 1, "full": true, "clear": true, "set": {"save data": "{\"a\":1}", "x": "1"}}))
            .unwrap();
        s.apply(&json!({"rev": 2, "del": ["x"], "set": {"yairpg.host.rev": "2"}}))
            .unwrap();
        assert!(s.flush().unwrap());
        assert!(!s.flush().unwrap());
        let again = Store::open(d.clone());
        assert_eq!(again.rev, 2);
        assert!(again.present);
        assert_eq!(again.entries.len(), 1);
        assert_eq!(again.entries["save data"], json!("{\"a\":1}"));
        let _ = fs::remove_dir_all(d);
    }

    #[test]
    fn stale_batch_never_rolls_back() {
        let d = dir("stale");
        let mut s = Store::open(d.clone());
        s.apply(&json!({"rev": 5, "full": true, "set": {"save data": "new"}}))
            .unwrap();
        assert!(s
            .apply(&json!({"rev": 4, "set": {"save data": "old"}}))
            .is_err());
        assert_eq!(s.entries["save data"], json!("new"));
        let _ = fs::remove_dir_all(d);
    }
}
