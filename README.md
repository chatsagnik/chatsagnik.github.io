# Personal Academic Website

A static personal website built with vanilla HTML, CSS, and JavaScript.

---

## Project Structure

```
/
├── index.html              # Homepage (about, papers, news)
├── misc.html               # Talks & miscellaneous resources
├── quantum-demos.html      # Interactive quantum demos
├── timeline.html           # News/timeline data (consumed by index.html)
├── blog.html               # Blog post index (search, tag filter, archive)
├── post.html               # Single post template (shared by all posts)
├── 404.html                # Custom 404 page
├── .nojekyll               # Disables Jekyll — required for GitHub Pages to serve .md files
│
├── posts/
│   ├── index.json          # Blog manifest — one entry per post
│   ├── reductions/         # Folder-based post (recommended for posts with images)
│   │   ├── index.md
│   │   └── reductions.png
│   └── flat-post.md        # Flat file post (fine for text-only posts)
│
├── assets/
│   ├── SagnikCV.pdf
│   └── ...
│
├── css/
│   ├── main.css            # Global styles — Nord palette, reset, layout, dark mode
│   └── blog.css            # Blog-specific styles — search, tags, archive, responsive
│
└── js/
    ├── layout.js           # Header, footer, nav — single source of truth
    ├── theme.js            # Dark/light mode manager
    └── resources.js        # Miscellaneous utilities
```

---

## Key Conventions

### Header & Footer — `layout.js`

Every page uses `initLayout()` to render the shared header and footer. Call it at the bottom of each page with the nav items you want:

```html
<div id="site-header"></div>
<!-- ... page content ... -->
<div id="site-footer"></div>

<script src="js/layout.js"></script>
<script>
  initLayout([
    {
      href: "./index.html",
      label: "main",
      delay: "delay2",
      icon: "uil-estate",
    },
    { href: "./blog.html", label: "blog", delay: "delay3", icon: "uil-pen" },
    {
      href: "./assets/SagnikCV.pdf",
      label: "CV",
      delay: "delay5",
      icon: "uil-download-alt",
      download: true,
    },
  ]);
</script>
```

**Nav item shape:**

| Field      | Type    | Description                                            |
| ---------- | ------- | ------------------------------------------------------ |
| `href`     | string  | Link destination                                       |
| `label`    | string  | Display text                                           |
| `delay`    | string  | CSS animation delay class (`delay2`–`delay6`)          |
| `icon`     | string  | Unicons class name (e.g. `uil-pen`)                    |
| `external` | boolean | Opens in new tab                                       |
| `download` | boolean | Download link; also appends a cache-busting CV version |

### Dark Mode — `theme.js`

Load `theme.js` in `<head>` (before any content renders) to avoid a flash of the wrong theme. It reads `localStorage` and `prefers-color-scheme` automatically. No manual calls needed — `initLayout()` wires up the toggle button.

```html
<head>
  ...
  <script src="js/theme.js"></script>
</head>
```

### CSS Architecture

| File           | Loaded by        | Purpose                                                                                     |
| -------------- | ---------------- | ------------------------------------------------------------------------------------------- |
| `css/main.css` | all pages        | Global reset, Nord palette variables, dark mode, layout primitives, animations              |
| `css/blog.css` | `blog.html` only | Blog index styles — search bar, tag pills, year-grouped archive, all responsive breakpoints |

`blog.css` only uses variables defined in `main.css` (`--clr-*`, `--ff-*`, `--fs-*`, `--fw-*`). Adding a new page-specific stylesheet follows the same pattern: create `css/page-name.css` and load it after `main.css`.

**Key CSS variables (from `main.css`):**

```css
--clr-bg               /* page background */
--clr-txt              /* primary text */
--clr-objects          /* accent colour (links, borders) */
--clr-hover            /* hover colour */
--clr-bg-inverse-trans /* subtle card/section backgrounds */
--ff-heading           /* Fira Sans — headings */
--ff-body              /* Inter — body text */
--scroll-padding       /* nav height set by layout.js — used for sticky offsets */
```

---

## Blog

The blog is powered by `blog.html`, `post.html`, `css/blog.css`, and the `posts/` folder.

### Post Layout Options

Two structures are supported — you can mix them freely:

**Folder-based (recommended when the post has images):**

```
posts/
└── reductions/
    ├── index.md        ← the post
    └── reductions.png  ← image, lives next to the markdown
```

Reference images with a simple relative path inside the markdown:

```markdown
![Diagram](reductions.png)
```

`post.html` automatically resolves these relative to the post's folder, so they work correctly even though `post.html` itself lives at the site root.

**Flat file (fine for text-only posts):**

```
posts/
└── reductions.md
```

### `posts/index.json` — the manifest

This is the only file you edit when adding a post. Each entry needs a `file` path; `excerpt` is optional.

```json
[
  {
    "file": "posts/reductions/index.md",
    "excerpt": "A hand-written teaser shown on the blog index."
  },
  {
    "file": "posts/another-post/index.md"
  }
]
```

**`excerpt` is optional.** If you omit it, `blog.html` generates one automatically by stripping markdown syntax from the first ~160 characters of the post body. You can always override it by adding `excerpt` to `index.json` — useful when the opening paragraph isn't a good teaser (e.g. it starts with a blockquote or a definition).

### Frontmatter Fields

Every post must have a YAML frontmatter block at the top of the `.md` file:

```markdown
---
title: "An Introduction to Reductions"
date: 2025-01-01T11:51:18+05:30
tags: [reductions, complexity, SAT]
draft: false
---

Post content starts here...
```

| Field   | Required | Description                                                                  |
| ------- | -------- | ---------------------------------------------------------------------------- |
| `title` | Yes      | Displayed as the post heading and browser tab title                          |
| `date`  | Yes      | ISO 8601 — full timestamps with timezone offsets are supported               |
| `tags`  | No       | Inline array syntax: `[tag1, tag2]` — shown as pills on index and post pages |
| `draft` | No       | `true` hides the post from the blog index without deleting it                |

Hugo-specific fields (`categories`, `slug`, etc.) are silently ignored.

### Adding a New Post

1. Create the folder and write the markdown:

   ```
   posts/my-post/index.md
   ```

2. Add one entry to `posts/index.json`:

   ```json
   { "file": "posts/my-post/index.md" }
   ```

3. Commit and push. Done.

The post is immediately live at:

```
post.html?file=posts/my-post/index.md
```

---

## Writing Posts

This section is a complete style guide for authoring blog posts for this site. The rendering pipeline is: **YAML frontmatter** stripped → **marked.js** renders markdown → **KaTeX** renders math → **custom preprocessor** renders footnotes.

### Markdown

Standard GitHub-flavoured Markdown (GFM) is supported:

```markdown
**bold**, _italic_, ~~strikethrough~~
`inline code`
[link text](url)
![alt text](image.png)

> blockquote
> --- (horizontal rule)
```

**Headings** — use `##` and below. The post title comes from frontmatter, so `#` inside the body will create a second `h1` and look wrong. Start sections at `##`.

**Lists** — standard ordered and unordered lists work. Nested lists work too but use 2-space indentation, not tabs.

**Tables** — GFM tables are supported and automatically wrapped in a horizontal scroll container on mobile:

```markdown
| Column A | Column B | Column C |
| -------- | -------- | -------- |
| value    | value    | value    |
```

**Code blocks** — fenced with triple backticks and an optional language tag for syntax highlighting (highlighting is handled by the browser's default monospace rendering — no syntax highlighter is loaded):

````markdown
```python
def f(x):
    return x + 1
```
````

**Inline HTML** is supported — useful for coloured text spans that markdown can't express:

```html
<span style="color: red;">This is a warning.</span>
```

---

### Math — KaTeX

Math is rendered by [KaTeX](https://katex.org/) after marked.js processes the markdown. KaTeX is fast, synchronous, and supports the full range of LaTeX needed for complexity theory, linear algebra, and cryptography posts.

#### Delimiters

| Type            | Syntax    | Renders as                   |
| --------------- | --------- | ---------------------------- |
| Inline          | `$...$`   | inline equation              |
| Display (block) | `$$...$$` | centred, full-width equation |
| Inline (alt)    | `\(...\)` | inline equation              |
| Display (alt)   | `\[...\]` | centred, full-width equation |

Prefer `$...$` and `$$...$$` — they are the most readable in raw markdown.

#### Escaping — the most important rule

Because marked.js processes the markdown **before** KaTeX sees it, backslashes get consumed by the markdown renderer. This means you must **double every backslash** that is meant for LaTeX.

| You want                 | Write in markdown |
| ------------------------ | ----------------- |
| `\{` (set brace)         | `\\{`             |
| `\}` (set brace)         | `\\}`             |
| `\[` (display math, alt) | `\\[`             |
| `\mathbb{Z}`             | `\\mathbb{Z}`     |
| `\mathrm{NP}`            | `\\mathrm{NP}`    |
| `\subseteq`              | `\\subseteq`      |
| `\leq`                   | `\\leq`           |
| `\sum_{i=1}^{n}`         | `\\sum_{i=1}^{n}` |

**The single exception:** inside `$$...$$` display blocks, backslash-newline for line breaking (`\\`) becomes `\\\\` since two backslashes are needed and each gets halved. Use `\\\\ ` (four backslashes) if you need a forced line break inside a display equation.

**Practical rule of thumb:** every `\` in LaTeX becomes `\\` in the markdown source. If math is not rendering, the first thing to check is missing double backslashes.

#### Examples

Inline equation:

```markdown
The complexity class $\\mathrm{NP}$ contains all problems verifiable in polynomial time.
```

Display equation:

```markdown
$$\\mathcal{L}(B) = \\left\\{\\sum_{i=1}^{n} x_i \\mathrm{b}_i : x_i \\in \\mathbb{Z}\\right\\}$$
```

Set notation:

```markdown
We define $\\Lambda_q^\\perp(A) = \\{z \\in \\mathbb{Z}^m : Az = 0 \\mod{q}\\}$.
```

Aligned equations — use the `aligned` environment:

```markdown
$$
\\begin{aligned}
p(M_B) &= \\det(M_B - \\lambda I) \\\\
       &= (-1)^n \\left(\\lambda^n - \\mathrm{tr}(M_B)\\,\\lambda^{n-1} + \\cdots\\right)
\\end{aligned}
$$
```

#### KaTeX limitations vs MathJax

KaTeX does not support every LaTeX package. Things that work: standard math mode, `amsmath` environments (`aligned`, `cases`, `pmatrix`, etc.), `\mathbb`, `\mathcal`, `\mathrm`, `\mathbf`, `\text`, `\operatorname`, `\DeclareMathOperator`, colour via `\textcolor`. Things that do not work: `\usepackage`, `tikz`, `pgfplots`, custom theorem environments. For diagrams, use an image instead.

---

### Footnotes

Footnotes are processed by a custom preprocessor (marked.js does not support them natively).

**Definition syntax** — at the end of the document, one per line:

```markdown
[^label]: Footnote text goes here. Can include **markdown** and $\\mathrm{math}$.
```

**Inline reference** — anywhere in the body:

```markdown
This is a claim.[^label]
```

Labels can be any string without spaces: `[^1]`, `[^note]`, `[^ajtai96]`. They render as numbered superscripts in order of first appearance, regardless of the label name. The footnote section is appended automatically at the bottom of the post with back-links.

**Example:**

```markdown
This follows from Ajtai'96.[^ajtai96]

[^ajtai96]: M. Ajtai. Generating hard instances of lattice problems. STOC 1996.
```

---

### Cross-references Between Posts

To link from one post to another, use a relative path from the current post's folder:

```markdown
[notion of reductions](../reductions/index.md)
[completeness](../reductions/index.md#completeness)
```

The `#anchor` syntax links to a specific heading. KaTeX anchors use the heading text lowercased with spaces replaced by hyphens, which is standard GFM behaviour.

Do **not** use absolute URLs like `https://chatsagnik.github.io/posts/reductions` for internal links — these break locally and are harder to maintain.

---

### Images

Place images in the same folder as the post's `index.md` and reference them with a relative path:

```markdown
![Caption text](my-diagram.png)
```

`post.html` automatically prepends the post's folder path so the image resolves correctly from the site root.

Supported formats: PNG, JPG/JPEG, SVG, WebP, GIF. For diagrams and figures, prefer SVG (scales perfectly on all screens) or PNG. Avoid JPG for anything with text or sharp edges.

There is no automatic caption rendering — the alt text is for accessibility only and does not appear visually below the image. If you want a visible caption, use an HTML `<figure>`:

```html
<figure>
  <img src="diagram.png" alt="Reduction diagram" />
  <figcaption>Figure 1: The reduction from A to B.</figcaption>
</figure>
```

---

### Inline HTML

Inline HTML is passed through by marked.js and renders in the post. Useful for things markdown cannot express:

```html
<!-- Coloured text -->
<span style="color: red;">Warning: this loop may not terminate.</span>

<!-- Emoji bullets (used in reductions.md) -->
🔴 This step requires exponential time. 🟣 Hence T halts iff x is satisfiable.

<!-- Centred content -->
<div style="text-align: center;">...</div>
```

Avoid using inline HTML for layout — stick to markdown structure and let `post.html`'s CSS handle the presentation.

---

**Draft workflow** — set `draft: true` in frontmatter while writing. The post won't appear on the blog index but is accessible via direct URL for review. Set to `false` when ready to publish.

---

### Blog Index Features (`blog.html`)

- **Fuzzy search** — powered by [Fuse.js](https://fusejs.io/). Searches across title, tags, and excerpt simultaneously, tolerates typos and partial matches.
- **Tag filtering** — tag pills generated automatically from all posts' frontmatter, sorted by frequency. Composes with search: filter first, then search within the filtered set.
- **Year-grouped archive** — posts grouped and sorted by year descending. Year label is `position: sticky`, cleared from the nav using `--scroll-padding`.
- **Auto-excerpt** — if `excerpt` is absent from `index.json`, the first ~160 characters of the post body are used (markdown syntax stripped).
- **Live result count** — updates as you search or filter.
- **Draft suppression** — `draft: true` posts are excluded silently.

### Blog Index Responsiveness (`css/blog.css`)

Five breakpoints (four shared with `main.css`, plus one desktop-only addition):

| Breakpoint | Target               | Key changes                                                                                          |
| ---------- | -------------------- | ---------------------------------------------------------------------------------------------------- |
| `> 850px`  | Desktop              | `.blog-wrap` expands to `max-width: 860px`; post card titles scale up to `--fs-550` for readability |
| `≤ 850px`  | Tablet / large phone | Narrower year column, tighter padding, smaller labels, card titles revert to `--fs-400`              |
| `≤ 480px`  | Small phone          | Minimum year column, touch-safe interactions, excerpt clamped to 4 lines                             |
| `≤ 360px`  | Very small / compact | Year label collapses above entries (single column), tag bar scrolls horizontally                     |

**Why `.blog-wrap` sets `align-items: stretch`:** The shared `.post` class (from `main.css`) sets `align-items: center` on all flex children, which collapses each child to its intrinsic width — defeating the wider `max-width`. `.blog-wrap` overrides this with `align-items: stretch` so the search bar, tag bar, year groups, and archive all expand to fill the container. `.post-wrap` in `post.html` applies the same override for the same reason.

**Why `.blog-wrap` / `.post-wrap` are wider than the index/misc card grids:** Blog post cards and post body text need more horizontal room than the compact index cards, which serve a different (at-a-glance) purpose. The 860 px cap keeps prose line lengths comfortable while eliminating the squished feel on large screens.

Touch-specific fixes: iOS zoom prevention on search input, `hover`-gated card interactions, horizontal scroll on tag bar at very small sizes.

### `post.html` — Relative Path Resolution

When a post lives in a subfolder (`posts/reductions/index.md`), any relative image or link paths in the markdown (e.g. `![fig](reductions.png)`) would otherwise resolve against `post.html`'s location at the site root and 404.

`post.html` fixes this automatically: after rendering, it walks all `img[src]` and `a[href]` elements, resolves relative paths against the post's folder (correctly collapsing `../` traversals), and rewrites them in one of two ways:

- **Images and non-markdown links** — the resolved path is set directly (e.g. `posts/reductions/diagram.png`).
- **Cross-post `.md` links** — rewritten to `post.html?file=<resolved-path>` so the link opens in the reader rather than downloading raw markdown. `#anchor` fragments are preserved. Example: `../selfreductions/index.md#completeness` in a post at `posts/reductions/` becomes `post.html?file=posts%2Fselfreductions%2Findex.md#completeness`.

Absolute paths, protocol URLs (`https://`), root-relative paths (`/`), anchors (`#`), and data URIs are left untouched.

Tables are also automatically wrapped in a scroll container (`<div class="table-scroll">`) so they scroll horizontally on narrow screens rather than breaking the layout. Display math (`.katex-display`) also scrolls horizontally on mobile.

---

## Running Locally

Because the blog uses `fetch()` to load `.md` files and `index.json`, you need a local HTTP server — opening files directly as `file://` won't work.

```bash
# Python (no install needed)
python3 -m http.server 8080

# Then open:
# http://localhost:8080
```

---

## Deployment

The site is fully static and hosted on GitHub Pages via the `chatsagnik.github.io` repository. The `.nojekyll` file at the repo root is required — without it, GitHub Pages' Jekyll processor intercepts `.md` files and the blog's `fetch()` calls return 404.

Push to main and changes are live within a minute or two.

```bash
git add posts/my-post/ posts/index.json
git commit -m "Add post: My Post Title"
git push
```

No build step. No CI pipeline. No configuration needed.

---

## Dependencies (all via CDN, no install)

| Library                                                  | Used in     | Purpose              |
| -------------------------------------------------------- | ----------- | -------------------- |
| [Inter](https://rsms.me/inter/)                          | all pages   | Body font            |
| [Fira Sans](https://fonts.google.com/specimen/Fira+Sans) | all pages   | Heading font         |
| [Unicons](https://iconscout.com/unicons)                 | all pages   | Icons                |
| [KaTeX 0.16](https://katex.org/)                         | `post.html` | LaTeX math rendering |
| [marked.js](https://marked.js.org/)                      | `post.html` | Markdown → HTML      |
| [Fuse.js](https://fusejs.io/)                            | `blog.html` | Fuzzy search         |