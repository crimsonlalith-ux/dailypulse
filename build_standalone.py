import os

base_dir = r"C:\Users\Lalith sanjay\.gemini\antigravity\scratch\dailypulse"

with open(os.path.join(base_dir, "index.html"), "r", encoding="utf-8") as f:
    index_html = f.read()

with open(os.path.join(base_dir, "styles.css"), "r", encoding="utf-8") as f:
    styles_css = f.read()

with open(os.path.join(base_dir, "app.js"), "r", encoding="utf-8") as f:
    app_js = f.read()

# Replace links with inline contents
standalone = index_html.replace(
    '<link rel="stylesheet" href="styles.css">',
    f"<style>\n{styles_css}\n</style>"
)
standalone = standalone.replace(
    '<script src="app.js"></script>',
    f"<script>\n{app_js}\n</script>"
)

output_path = os.path.join(base_dir, "DailyPulse.html")
# Write with UTF-8 BOM so mobile HTML viewers and browsers 100% force UTF-8 decoding
with open(output_path, "w", encoding="utf-8-sig") as f:
    f.write(standalone)

print("SUCCESS: DailyPulse.html built cleanly with UTF-8 BOM. Bytes:", os.path.getsize(output_path))
