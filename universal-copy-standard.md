# Universal Copy Attribute Standard

## Core Attributes (Simple & Memorable)

### Primary Marking
```html
<!-- Mark any element as copyable -->
<h1 copy>This heading will be copied</h1>
<p copy>This paragraph will be copied</p>
```

### Ordering (Optional)
```html
<!-- Simple numeric ordering -->
<h2 copy="1">First Section</h2>
<p copy="2">Introduction paragraph</p>
<h3 copy="3">Subsection</h3>
```

### Exclusion
```html
<!-- Skip specific elements -->
<div copy>
  <p>This will be copied</p>
  <aside no-copy>This will be skipped</aside>
</div>
```

## Why This Standard?

1. **Extremely Simple**: Just `copy`, `copy="number"`, and `no-copy`
2. **Memorable**: No prefixes, no complex naming
3. **Universal**: Could become a web standard like `alt` or `href`
4. **Semantic**: Clearly indicates intent
5. **Short**: Minimal typing, maximum clarity

## Usage Examples

### Basic Article
```html
<article>
  <h1 copy="1">Article Title</h1>
  <p copy="2">First paragraph...</p>
  <nav no-copy>Table of contents (skip this)</nav>
  <p copy="3">Second paragraph...</p>
</article>
```

### Mixed Content
```html
<div>
  <h2 copy>Product Description</h2>
  <p copy>Our product features...</p>
  <div no-copy>Internal notes</div>
  <ul copy>
    <li>Feature 1</li>
    <li>Feature 2</li>
  </ul>
</div>
```

### Auto-detection (No Order Specified)
```html
<!-- Elements are copied in DOM order -->
<section>
  <h1 copy>Title</h1>
  <p copy>Paragraph 1</p>
  <p copy>Paragraph 2</p>
</section>
```

## Implementation in Our Component

The button would ALWAYS look for these universal attributes:
- Selector is hardcoded to `[copy]`
- Order attribute is the value of `copy` itself
- Exclude attribute is `no-copy`

No configuration needed - it just works everywhere!