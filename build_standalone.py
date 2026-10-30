import os
import re

base_dir = r"C:\Users\Lalith sanjay\.gemini\antigravity\scratch\dailypulse"

with open(os.path.join(base_dir, "index.html"), "r", encoding="utf-8") as f:
    index_html = f.read()

with open(os.path.join(base_dir, "styles.css"), "r", encoding="utf-8") as f:
    styles_css = f.read()

with open(os.path.join(base_dir, "app.js"), "r", encoding="utf-8") as f:
    app_js = f.read()

# Remove preload tags
standalone = re.sub(r'<link rel="preload" href="styles\.css.*?" as="style">\s*', '', index_html)
standalone = re.sub(r'<link rel="preload" href="app\.js.*?" as="script">\s*', '', standalone)

# Replace styles.css link with inline style
standalone = re.sub(
    r'<link rel="stylesheet" href="styles\.css.*?">',
    lambda m: f"<style>\n{styles_css}\n</style>",
    standalone
)

# Replace app.js script link with inline script
standalone = re.sub(
    r'<script src="app\.js.*?"></script>',
    lambda m: f"<script>\n{app_js}\n</script>",
    standalone
)

output_path = os.path.join(base_dir, "DailyPulse.html")
# Write with UTF-8 BOM so mobile HTML viewers and browsers 100% force UTF-8 decoding
with open(output_path, "w", encoding="utf-8-sig") as f:
    f.write(standalone)

print("SUCCESS: DailyPulse.html built cleanly with UTF-8 BOM. Bytes:", os.path.getsize(output_path))
