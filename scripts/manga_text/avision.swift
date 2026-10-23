import Foundation
import Vision
import AppKit
// usage: avision <image>...      one JSON object per image on stdout, then exit
//        avision --serve         persistent mode: read one image path per stdin line, print one JSON line per path (flush)
// {"file","sec","revision","obs":[{"text","conf","bbox":[x,y,w,h]}]}  bbox is normalized, origin bottom-left.
func recognize(_ path: String) -> String {
    let url = URL(fileURLWithPath: path)
    guard let img = NSImage(contentsOf: url), let cg = img.cgImage(forProposedRect: nil, context: nil, hints: nil) else {
        return "{\"file\":\"\(url.lastPathComponent)\",\"error\":\"unreadable\"}"
    }
    let t0 = Date()
    let req = VNRecognizeTextRequest()
    req.recognitionLevel = .accurate
    req.usesLanguageCorrection = true
    req.recognitionLanguages = ["en-US"]
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
let args = Array(CommandLine.arguments.dropFirst())
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
