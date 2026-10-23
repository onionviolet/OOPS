import Foundation
import PDFKit
import AppKit
// pdfpages info <pdf>                         -> {"pages":N}
// pdfpages text <pdf> <first> <last>          -> one JSON line per page: {"page","chars","w","h","text"} (1-based, PDF text layer)
// pdfpages render <pdf> <page> <out.png> <longside>   -> renders one page to PNG with its longest side = longside pixels
let a = CommandLine.arguments
guard a.count >= 3, let doc = PDFDocument(url: URL(fileURLWithPath: a[2])) else { print("{\"error\":\"cannot open\"}"); exit(1) }
func out(_ d: [String: Any]) { print(String(data: try! JSONSerialization.data(withJSONObject: d), encoding: .utf8)!) }
if a[1] == "info" {
    out(["pages": doc.pageCount, "locked": doc.isLocked, "encrypted": doc.isEncrypted])
} else if a[1] == "text", a.count >= 5, let f = Int(a[3]), let l = Int(a[4]) {
    for i in max(1, f)...min(doc.pageCount, l) {
        guard let p = doc.page(at: i - 1) else { continue }
        let r = p.bounds(for: .mediaBox)
        let t = p.string ?? ""
        out(["page": i, "chars": t.count, "w": r.width, "h": r.height, "text": t])
    }
} else if a[1] == "render", a.count >= 6, let n = Int(a[3]), let p = doc.page(at: n - 1), let longSide = Double(a[5]) {
    let r = p.bounds(for: .mediaBox)
    let scale = CGFloat(longSide) / max(r.width, r.height)
    let w = Int(r.width * scale), h = Int(r.height * scale)
    let ctx = CGContext(data: nil, width: w, height: h, bitsPerComponent: 8, bytesPerRow: 0, space: CGColorSpaceCreateDeviceRGB(),
                        bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)!
    ctx.setFillColor(NSColor.white.cgColor); ctx.fill(CGRect(x: 0, y: 0, width: w, height: h))
    ctx.scaleBy(x: scale, y: scale)
    p.draw(with: .mediaBox, to: ctx)
    let rep = NSBitmapImageRep(cgImage: ctx.makeImage()!)
    try! rep.representation(using: .png, properties: [:])!.write(to: URL(fileURLWithPath: a[4]))
    out(["page": n, "w": w, "h": h])
}
