#!/usr/bin/env python3
"""Export presenter notes from a Slidev slides.md to a printable HTML file.

Usage:
    python3 export-notes.py <deck-directory>

Example:
    python3 export-notes.py ../examples/demo

Output:
    /tmp/presenter-notes.html
"""

import os
import re
import sys
import html


def parse_slides(md_text):
    """Split markdown into slides on '---' boundaries, respecting frontmatter."""
    lines = md_text.split('\n')
    slides = []
    current_lines = []
    in_frontmatter = False
    frontmatter_count = 0

    for line in lines:
        stripped = line.strip()
        if stripped == '---':
            if not current_lines and frontmatter_count == 0:
                # Opening frontmatter fence
                in_frontmatter = True
                frontmatter_count += 1
                current_lines.append(line)
                continue
            elif in_frontmatter:
                # Closing frontmatter fence
                in_frontmatter = False
                frontmatter_count += 1
                current_lines.append(line)
                continue
            else:
                # Slide separator
                slides.append('\n'.join(current_lines))
                current_lines = []
                frontmatter_count = 0
                continue
        current_lines.append(line)

    # Last slide
    if current_lines:
        slides.append('\n'.join(current_lines))

    return slides


def extract_title(slide_text):
    """Extract the first heading from the slide."""
    match = re.search(r'^#+\s+(.+)$', slide_text, re.MULTILINE)
    if match:
        return match.group(1).strip()
    return None


def extract_notes(slide_text):
    """Extract presenter notes from HTML comments <!-- ... -->."""
    notes = []
    # Match HTML comments (possibly multi-line)
    for match in re.finditer(r'<!--\s*(.*?)\s*-->', slide_text, re.DOTALL):
        content = match.group(1).strip()
        if content:
            notes.append(content)
    return '\n\n'.join(notes)


def generate_html(deck_name, slide_data):
    """Generate a printable HTML document with all presenter notes."""
    rows = []
    for item in slide_data:
        title_html = html.escape(item['title']) if item['title'] else '<em>Untitled</em>'
        notes_html = html.escape(item['notes']).replace('\n\n', '</p><p>').replace('\n', '<br>')
        if not item['notes']:
            notes_html = '<span style="color:#999;">No notes</span>'

        rows.append(f'''    <tr>
      <td class="slide-num">{item['number']}</td>
      <td class="slide-title">{title_html}</td>
      <td class="slide-notes"><p>{notes_html}</p></td>
    </tr>''')

    table_rows = '\n'.join(rows)

    return f'''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Presenter Notes — {html.escape(deck_name)}</title>
  <style>
    * {{ margin: 0; padding: 0; box-sizing: border-box; }}
    body {{
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-size: 14px;
      line-height: 1.6;
      color: #1a1a1a;
      padding: 2rem;
      max-width: 900px;
      margin: 0 auto;
    }}
    h1 {{
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
    }}
    .subtitle {{
      color: #666;
      margin-bottom: 2rem;
      font-size: 0.9rem;
    }}
    table {{
      width: 100%;
      border-collapse: collapse;
    }}
    th {{
      text-align: left;
      padding: 0.5rem 0.75rem;
      border-bottom: 2px solid #333;
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #555;
    }}
    td {{
      padding: 0.75rem;
      border-bottom: 1px solid #e0e0e0;
      vertical-align: top;
    }}
    .slide-num {{
      width: 3rem;
      font-weight: 700;
      color: #888;
      text-align: center;
    }}
    .slide-title {{
      width: 25%;
      font-weight: 600;
    }}
    .slide-notes {{
      width: auto;
    }}
    .slide-notes p {{
      margin-bottom: 0.5em;
    }}
    @media print {{
      body {{ padding: 1rem; font-size: 12px; }}
      tr {{ page-break-inside: avoid; }}
    }}
  </style>
</head>
<body>
  <h1>Presenter Notes</h1>
  <p class="subtitle">{html.escape(deck_name)}</p>
  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>Slide</th>
        <th>Notes</th>
      </tr>
    </thead>
    <tbody>
{table_rows}
    </tbody>
  </table>
</body>
</html>'''


def main():
    if len(sys.argv) < 2:
        print(f"Usage: {sys.argv[0]} <deck-directory>", file=sys.stderr)
        sys.exit(1)

    deck_dir = sys.argv[1]
    slides_path = os.path.join(deck_dir, 'slides.md')

    if not os.path.isfile(slides_path):
        print(f"Error: {slides_path} not found", file=sys.stderr)
        sys.exit(1)

    deck_name = os.path.basename(os.path.abspath(deck_dir))

    with open(slides_path, 'r', encoding='utf-8') as f:
        md_text = f.read()

    slides = parse_slides(md_text)
    slide_data = []

    for i, slide_text in enumerate(slides, start=1):
        title = extract_title(slide_text)
        notes = extract_notes(slide_text)
        slide_data.append({
            'number': i,
            'title': title,
            'notes': notes,
        })

    output_html = generate_html(deck_name, slide_data)
    output_path = '/tmp/presenter-notes.html'

    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(output_html)

    print(output_path)


if __name__ == '__main__':
    main()
