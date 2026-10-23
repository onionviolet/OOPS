import Foundation
import Vision
import AppKit
// usage: avision [--lang ja-JP,en-US] <image>...   one JSON object per image on stdout, then exit (default language en-US)
//        avision --serve         persistent mode: read one image path per stdin line, print one JSON line per path (flush)
// {"file","sec","revision","obs":[{"text","conf","bbox":[x,y,w,h]}]}  bbox is normalized, origin bottom-left.
var languages = ["en-US"]
func recognize(_ path: String) -> String {
    let url = URL(fileURLWithPath: path)
    guard let img = NSImage(contentsOf: url), let cg = img.cgImage(forProposedRect: nil, context: nil, hints: nil) else {
        return "{\"file\":\"\(url.lastPathComponent)\",\"error\":\"unreadable\"}"
    }
    let t0 = Date()
    let req = VNRecognizeTextRequest()
    req.recognitionLevel = .accurate
    req.usesLanguageCorrection = true
    req.recognitionLanguages = languages
    if languages.count > 1 || languages.first != "en-US" {
        if #available(macOS 13.0, *) { req.automaticallyDetectsLanguage = true }
    }
    try? VNImageRequestHandler(cgImage: cg, options: [:]).perform([req])
    var obs: [[String: Any]] = []
    for o in (req.results ?? []) {
        guard let c = o.topCandidates(1).first else { continue }
        let b = o.boundingBox
        obs.append(["text": c.string, "conf": c.confidence, "bbox": [b.minX, b.minY, b.width, b.height]])
    }
    let d: [String: Any] = ["file": url.lastPathComponent, "sec": Date().timeIntervalSince(t0), "revision": req.revision, "obs": obs]
    return String(data: try! JSONSerialization.data(withJSONObject: d), encoding: .utf8)!
}
var args = Array(CommandLine.arguments.dropFirst())
if args.first == "--lang", args.count >= 2 {
    languages = args[1].split(separator: ",").map(String.init)
    args = Array(args.dropFirst(2))
}
if args.first == "--serve" {
    while let line = readLine() {
        let p = line.trimmingCharacters(in: .whitespacesAndNewlines)
        if p.isEmpty { continue }
        print(recognize(p))
        fflush(stdout)
    }
} else {
    for p in args { print(recognize(p)) }
}
