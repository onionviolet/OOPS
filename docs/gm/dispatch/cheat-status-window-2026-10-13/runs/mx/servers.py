import http.server, threading, os
os.chdir('/tmp/yairpg-mx')
servers=[http.server.ThreadingHTTPServer(('127.0.0.1',p),http.server.SimpleHTTPRequestHandler) for p in range(18462,18470)]
for s in servers: threading.Thread(target=s.serve_forever,daemon=True).start()
threading.Event().wait()
