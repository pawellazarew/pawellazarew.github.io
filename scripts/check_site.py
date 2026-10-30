"""Check local resources, anchors, language coverage and basic document semantics."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1]


class SiteParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.ids = set()
        self.links = []
        self.headings = 0

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if "id" in attrs:
            assert attrs["id"] not in self.ids, f'Duplicate id: {attrs["id"]}'
            self.ids.add(attrs["id"])
        if "data-en" in attrs or "data-ru" in attrs:
            assert attrs.get("data-en") and attrs.get("data-ru"), "Missing translation"
        if tag == "h1":
            self.headings += 1
        if tag == "img":
            assert "alt" in attrs, "Image without alt"
        for key in ("href", "src"):
            if key in attrs:
                self.links.append(attrs[key])


parser = SiteParser()
parser.feed((ROOT / "index.html").read_text())
assert parser.headings == 1, "Expected one h1"
for link in parser.links:
    parts = urlsplit(link)
    if parts.scheme or parts.netloc:
        continue
    if parts.path:
        assert (ROOT / parts.path).is_file(), f"Missing resource: {link}"
    elif parts.fragment:
        assert parts.fragment in parser.ids, f"Missing anchor: {link}"
assert {"main", "work", "about", "contact"} <= parser.ids
print("OK: resources, anchors, translation coverage and document semantics")
