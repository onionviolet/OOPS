// Offscreen WebKit capture for the combat pack mock (adapted from the fix-pass lane's capture).
// Args: <base dir> <out prefix> <width> <height> <port>
import WebKit
import Cocoa

let a = CommandLine.arguments
let base = URL(fileURLWithPath: a[1], isDirectory: true)
let out = a[2]
let W = Double(a[3])!, H = Double(a[4])!, port = Int(a[5])!
let repo = URL(fileURLWithPath: "/Users/weiwei/code/yet-another-idle-rpg", isDirectory: true)
let seed = URL(fileURLWithPath: "/private/tmp/claude-501/-Users-weiwei-code-yet-another-idle-rpg/bc972783-3389-42d0-b39d-e4e7922a3db1/scratchpad/pack.json")

class Local: URLProtocol {
    static let mimes = ["html":"text/html; charset=UTF-8", "js":"text/javascript", "css":"text/css", "json":"application/json", "woff2":"font/woff2", "ttc":"font/collection", "png":"image/png", "jpg":"image/jpeg", "svg":"image/svg+xml", "ico":"image/x-icon"]
    override class func canInit(with request: URLRequest) -> Bool { request.url?.host == "localhost" }
    override class func canonicalRequest(for request: URLRequest) -> URLRequest { request }
    override func startLoading() {
        let url = request.url!, path = url.path == "/" || url.path.isEmpty ? "index.html" : String(url.path.dropFirst())
        let file = (path.hasPrefix("private_packs/") || path.hasPrefix("resources/fonts/private/") ? repo : base).appendingPathComponent(path)
        var data = try? Data(contentsOf: file)
        if path == "index.html", let raw = data, var html = String(data: raw, encoding: .utf8) {
            let payload = (try! Data(contentsOf: seed)).base64EncodedString()
            let initJS = """
            <script>
            window.pageErrors = [];
            Object.defineProperty(document,'hidden',{get:()=>false});
            if (!navigator.locks) Object.defineProperty(navigator, 'locks', {value: {request: async (name, options, callback) => callback({name})}});
            window.addEventListener('error', e => { if(e.message) pageErrors.push(e.message + ' at ' + e.lineno); });
            const realDate = Date, wall = realDate.UTC(2026,10,20);
            window.Date = class extends realDate { constructor(...args) { if(args.length) super(...args); else super(wall); } static now() { return wall; } };
            localStorage.clear();
            localStorage.setItem('save data', new TextDecoder().decode(Uint8Array.from(atob('\(payload)'), c => c.charCodeAt(0))));
            </script>
            """
            html = html.replacingOccurrences(of: "<head>", with: "<head>" + initJS)
            data = Data(html.utf8)
        }
        let response = HTTPURLResponse(url: url, statusCode: data == nil ? 404 : 200, httpVersion: "HTTP/1.1", headerFields: ["Content-Type": Self.mimes[file.pathExtension] ?? "application/octet-stream", "Cache-Control": "no-store"])!
        client?.urlProtocol(self, didReceive: response, cacheStoragePolicy: .notAllowed)
        if let bytes = data { client?.urlProtocol(self, didLoad: bytes) }
        client?.urlProtocolDidFinishLoading(self)
    }
    override func stopLoading() {}
}

class Capture: NSObject, WebFrameLoadDelegate {
    let rect = CGRect(x: 0, y: 0, width: W, height: H)
    let view: WebView
    let window: NSWindow
    override init() {
        view = WebView(frame: rect, frameName: nil, groupName: nil)!
        window = NSWindow(contentRect: rect, styleMask: [.borderless], backing: .buffered, defer: true)
        super.init(); window.contentView = view; view.frameLoadDelegate = self
        view.setValue(true, forKey: "shouldUpdateWhileOffscreen")
        view.preferences.setValue(false, forKey: "DOMTimersThrottlingEnabled")
        let update = NSSelectorFromString("_updateRendering")
        typealias Render = @convention(c) (AnyObject, Selector) -> Void
        let render = unsafeBitCast(view.method(for: update), to: Render.self)
        Timer.scheduledTimer(withTimeInterval: 1.0/60.0, repeats: true) { [weak self] _ in if let web = self?.view { render(web, update) } }
    }
    func js(_ s: String) -> String { view.stringByEvaluatingJavaScript(from: s) ?? "(none)" }
    func eval(_ label: String, _ code: String) {
        let r = js("(() => { try { " + code + "; return 'ok'; } catch(e) { return String(e); } })()")
        guard r == "ok" else { print("FAIL", label, r, js("JSON.stringify(pageErrors)")); shot("fail"); exit(1) }
        print(label)
    }
    func wait(_ label: String, _ cond: String, tries: Int = 200, _ then: @escaping () -> Void) {
        if js("String(!!(" + cond + "))") == "true" { then(); return }
        if tries <= 0 { print("FAIL timeout", label, js("document.body.innerText.slice(0,1500)")); shot("fail"); exit(1) }
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.12) { self.wait(label, cond, tries: tries - 1, then) }
    }
    func shot(_ name: String) {
        view.needsDisplay = true; view.displayIfNeeded()
        let bmp = NSBitmapImageRep(bitmapDataPlanes: nil, pixelsWide: Int(W), pixelsHigh: Int(H), bitsPerSample: 8, samplesPerPixel: 4, hasAlpha: true, isPlanar: false, colorSpaceName: .deviceRGB, bytesPerRow: 0, bitsPerPixel: 0)!
        bmp.size = rect.size; view.cacheDisplay(in: rect, to: bmp)
        try! bmp.representation(using: .png, properties: [:])!.write(to: URL(fileURLWithPath: out + "-" + name + ".png"))
        print("shot", out + "-" + name + ".png")
    }
    func webView(_ sender: WebView!, didFinishLoadFor frame: WebFrame!) {
        guard frame == view.mainFrame else { return }
        let sel = NSSelectorFromString("_setVisibilityState:isInitialState:")
        typealias Vis = @convention(c) (AnyObject, Selector, Int32, Bool) -> Void
        unsafeBitCast(view.method(for: sel), to: Vis.self)(view, sel, 0, false)
        wait("engine", "window.simulationTestHooks?.saveStatus().ownsSave && (document.getElementById('loading_screen_play_button').checkVisibility() || document.getElementById('loading_screen').style.visibility === 'hidden')", tries: 300) { self.boot() }
    }
    func boot() {
        eval("started", """
            window.$ = q => document.querySelector(q);
            window.check = (v, m) => { if(!v) throw Error(m); };
            window.click = q => { const n = $(q); check(n && !n.disabled, 'Unavailable ' + q); n.click(); };
            window.move = id => click(`[data-fight-option="${id}"]`);
            simulationTestHooks.pause();
            const play = $('#loading_screen_play_button'); if (play.checkVisibility()) play.click();
            const c = $('#hero_creation_panel_confirmation'); if (c?.checkVisibility()) c.click();
        """)
        wait("pack", "$('.fight-page-roster')?.children.length >= 1 && $('[data-fight-option=jab]') && !$('[data-fight-option=jab]').disabled") {
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.8) { self.play() }
        }
    }
    func roster() -> String { js("[...document.querySelectorAll('.fight-page-roster > *')].map(n=>n.innerText.replace(/\\s+/g,' ').trim()).join(' | ')") }
    func play() {
        print("open:", roster()); shot("1-open")
        eval("Quick strike on the default target", "move('jab')")
        wait("turn back", "$('[data-fight-option=jab]') && !$('[data-fight-option=jab]').disabled") {
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.6) {
                print("after strike:", self.roster()); self.shot("2-strike")
                // Target the untouched foe that acts next: the fold's own button, or the same rat chosen from the timing bars.
                self.eval("Target the next untouched foe", """
                    const fold = $('[data-fight-fold]');
                    if (fold) { window.nextId = fold.dataset.fightInspect; fold.click(); }
                    else {
                        const rows = [...document.querySelectorAll('.fight-page-fighter')].filter(r => r.dataset.target !== 'true' && r.dataset.down !== 'true' && /Fresh/.test(r.innerText));
                        const fill = r => parseFloat(r.querySelector('[data-track=timing]').style.getPropertyValue('--fight-fill')) || 0;
                        const next = rows.reduce((a, b) => fill(b) > fill(a) ? b : a);
                        window.nextId = next.dataset.combatSubject; click(`[data-fight-inspect="${nextId}"]`);
                    }
                """)
                print("targeted", self.js("nextId"))
                self.eval("Quick strike on it", "move('jab')")
                self.wait("turn back 2", "$('[data-fight-option=jab]') && !$('[data-fight-option=jab]').disabled") {
                    DispatchQueue.main.asyncAfter(deadline: .now() + 0.6) {
                        print("after second:", self.roster()); self.shot("3-second")
                        self.more(3)
                    }
                }
            }
        }
    }
    func more(_ left: Int) {
        if left == 0 {
            print("after more:", self.roster()); self.shot("4-more")
            print("errors", self.js("JSON.stringify(pageErrors)"))
            print("roster px", self.js("JSON.stringify($('.fight-page-roster').getBoundingClientRect())"))
            exit(0)
        }
        eval("Strike the target again", "move('jab')")
        wait("turn back more", "$('[data-fight-option=jab]') && !$('[data-fight-option=jab]').disabled") {
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.4) { self.more(left - 1) }
        }
    }
    func unused() {
        if true {
            if true {
                if true {
                    if true {
                        print("errors", self.js("JSON.stringify(pageErrors)"))
                        print("segs", self.js("JSON.stringify([...document.querySelectorAll('.fight-page-segment')].map(g=>[g.title,g.style.getPropertyValue('--seg')]))"))
                        print("probe", self.js("(()=>{const t=document.querySelector('[data-stack]'); if(!t) return 'none'; const cs=getComputedStyle(t); const g=t.querySelector('.fight-page-segment'); const gs=g&&getComputedStyle(g); return JSON.stringify({display:cs.display,h:t.getBoundingClientRect().height,w:t.getBoundingClientRect().width,seg:g&&g.getBoundingClientRect().toJSON(),segBg:gs&&gs.backgroundImage,segDisp:gs&&gs.display,n:t.children.length})})()"))
                        print("roster px", self.js("JSON.stringify($('.fight-page-roster').getBoundingClientRect())"))
                        exit(0)
                    }
                }
            }
        }
    }
}

URLProtocol.registerClass(Local.self)
setvbuf(stdout,nil,_IOLBF,0)
let app = NSApplication.shared
app.setActivationPolicy(.prohibited)
let cap = Capture()
cap.view.mainFrame.load(URLRequest(url: URL(string: "http://localhost:\(port)/?test_hooks=1")!))
app.run()
