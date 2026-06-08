#!/usr/bin/env python3
"""Tiny static server for the design-system docs site.

Serves the repo root (so /styles/*, /site/*, /tokens.data.mjs, /icons.data.mjs etc. resolve
with absolute paths) but maps `/` → site/index.html, so `make dev` lands directly on the
docs site (Foundations · Brands · Components) instead of a directory listing. Sends a JS
MIME for .mjs so the site's `import` of the token/icon sources works. No dependencies.

    python3 scripts/serve.py [PORT] [BIND]
"""
import http.server
import os
import socketserver
import sys

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 6006
BIND = sys.argv[2] if len(sys.argv) > 2 else "127.0.0.1"
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


class Handler(http.server.SimpleHTTPRequestHandler):
    extensions_map = {
        **http.server.SimpleHTTPRequestHandler.extensions_map,
        ".mjs": "text/javascript",
        ".js": "text/javascript",
        ".css": "text/css",
        ".svg": "image/svg+xml",
    }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def do_GET(self):
        if self.path in ("/", ""):
            self.path = "/site/index.html"
        return super().do_GET()


socketserver.TCPServer.allow_reuse_address = True
with socketserver.TCPServer((BIND, PORT), Handler) as httpd:
    shown = "127.0.0.1" if BIND == "0.0.0.0" else BIND
    print(f"→ design-system docs: http://{shown}:{PORT}/")
    httpd.serve_forever()
