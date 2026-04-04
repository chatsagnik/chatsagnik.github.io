# Personal Academic Website

A static personal website built with vanilla HTML, CSS, and JavaScript. No build step, no framework — just files you can open with a local server or deploy anywhere.

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
  },
  {
    "file": "posts/flat-post.md",
    "excerpt": "Optional. If omitted, one is generated from the post body."
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

### Blog Index Features (`blog.html`)

- **Fuzzy search** — powered by [Fuse.js](https://fusejs.io/). Searches across title, tags, and excerpt simultaneously, tolerates typos and partial matches.
- **Tag filtering** — tag pills generated automatically from all posts' frontmatter, sorted by frequency. Composes with search: filter first, then search within the filtered set.
- **Year-grouped archive** — posts grouped and sorted by year descending. Year label is `position: sticky`, cleared from the nav using `--scroll-padding`.
- **Auto-excerpt** — if `excerpt` is absent from `index.json`, the first ~160 characters of the post body are used (markdown syntax stripped).
- **Live result count** — updates as you search or filter.
- **Draft suppression** — `draft: true` posts are excluded silently.

### Blog Index Responsiveness (`css/blog.css`)

Four breakpoints mirroring `main.css`:

| Breakpoint | Target               | Key changes                                                                      |
| ---------- | -------------------- | -------------------------------------------------------------------------------- |
| `> 850px`  | Desktop              | Full year-rail grid, sticky year labels, hover effects on cards                  |
| `≤ 850px`  | Tablet / large phone | Narrower year column, tighter padding, smaller labels                            |
| `≤ 480px`  | Small phone          | Minimum year column, touch-safe interactions, excerpt clamped to 4 lines         |
| `≤ 360px`  | Very small / compact | Year label collapses above entries (single column), tag bar scrolls horizontally |

Touch-specific fixes: iOS zoom prevention on search input, `hover`-gated card interactions, horizontal scroll on tag bar at very small sizes.

### `post.html` — Relative Path Resolution

When a post lives in a subfolder (`posts/reductions/index.md`), any relative image or link paths in the markdown (e.g. `![fig](reductions.png)`) would otherwise resolve against `post.html`'s location at the site root and 404.

`post.html` fixes this automatically: after rendering, it walks all `img[src]` and `a[href]` elements, detects relative paths, and prepends the post's folder (`posts/reductions/`). Absolute paths, protocol URLs, anchors (`#`), and data URIs are left untouched.

Tables are also automatically wrapped in a scroll container (`<div class="table-scroll">`) so they scroll horizontally on narrow screens rather than breaking the layout.

### Supported Markdown Features

- GitHub-flavoured Markdown (tables, fenced code blocks, strikethrough)
- Inline and display LaTeX via MathJax (`$...$` and `$$...$$`)
- Footnotes (`[^label]` refs + `[^label]: definition` — processed by a custom preprocessor since marked.js doesn't support them natively)
- Images with relative paths (resolved to post folder automatically)
- Blockquotes, inline HTML, links

### Migrating from Hugo

Posts exported from Hugo work as-is:

- Full ISO 8601 timestamps with timezone offsets are parsed correctly
- Quoted/unquoted string values handled
- Inline array syntax: `tags: [tag1, tag2, tag3]`
- `draft: false/true` respected
- Hugo-specific fields ignored harmlessly

> **Image paths from Hugo:** Hugo uses absolute paths like `/posts/image.png`. These work fine on GitHub Pages. If you switch to the folder structure (`posts/slug/index.md`), update image references to relative paths (`image.png`) so they benefit from automatic path resolution.

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

The site is fully static and hosted on GitHub Pages via the `chatsagnik.github.io` repository. Push to main and changes are live within a minute or two.

```bash
git add posts/my-post/ posts/index.json
git commit -m "Add post: My Post Title"
git push
```

No build step. No CI pipeline. No configuration needed.

---

## Dependencies (all via CDN, no install)

| Library                                                  | Used in                  | Purpose         |
| -------------------------------------------------------- | ------------------------ | --------------- |
| [Inter](https://rsms.me/inter/)                          | all pages                | Body font       |
| [Fira Sans](https://fonts.google.com/specimen/Fira+Sans) | all pages                | Heading font    |
| [Unicons](https://iconscout.com/unicons)                 | all pages                | Icons           |
| [MathJax 3](https://www.mathjax.org/)                    | `post.html`, `misc.html` | LaTeX rendering |
| [marked.js](https://marked.js.org/)                      | `post.html`              | Markdown → HTML |
| [Fuse.js](https://fusejs.io/)                            | `blog.html`              | Fuzzy search    |
