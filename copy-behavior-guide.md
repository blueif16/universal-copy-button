# Universal Copy Standard - Behavior Guide

## Core Principle: Explicit Opt-In

**DEFAULT = NO COPY** - Nothing is copied unless explicitly marked with the `copy` attribute.

## How It Works

### 1. Basic Copying
```html
<!-- ❌ NOT COPIED - No copy attribute -->
<div>
  <h1>This heading is NOT copied</h1>
  <p>This paragraph is NOT copied</p>
</div>

<!-- ✅ COPIED - Has copy attribute -->
<div copy>
  <h1>This entire section is copied</h1>
  <p>Including all child elements</p>
</div>
```

### 2. Excluding Parts Within Copied Content
The `no-copy` attribute ONLY works INSIDE elements marked with `copy`:

```html
<!-- Example: Article with interactive elements -->
<article copy>
  <h1>Article Title</h1>
  <p>This paragraph will be copied.</p>
  
  <!-- These interactive elements won't be copied -->
  <button no-copy>Edit</button>
  <input no-copy type="text" placeholder="Add comment...">
  
  <p>This paragraph will also be copied.</p>
  
  <!-- This note won't be copied -->
  <div no-copy class="internal-note">
    Editor note: Review before publishing
  </div>
</article>
```

### 3. `no-copy` Has No Effect Outside `copy`
```html
<!-- no-copy is ignored here (already not being copied) -->
<div no-copy>
  <p>This wasn't going to be copied anyway</p>
</div>

<!-- Only the div with copy attribute is copied -->
<section>
  <div copy>This is copied</div>
  <div no-copy>This is already not copied (no-copy unnecessary)</div>
  <div>This is also not copied (default behavior)</div>
</section>
```

## Real-World Examples

### Dashboard Widget
```html
<div class="dashboard-widget" copy="1">
  <h2>Revenue Overview</h2>
  <p>Total: $125,430</p>
  <p>Growth: +12.5%</p>
  
  <!-- Don't copy the refresh button -->
  <button no-copy onclick="refresh()">🔄 Refresh</button>
</div>
```

### Task List
```html
<div class="task-list" copy>
  <h3>Today's Tasks</h3>
  
  <div class="task">
    <span>Review Q4 Report</span>
    <!-- Don't copy action buttons -->
    <div no-copy>
      <button>Edit</button>
      <button>Delete</button>
    </div>
  </div>
  
  <div class="task">
    <span>Client Meeting at 2 PM</span>
    <div no-copy>
      <button>Edit</button>
      <button>Delete</button>
    </div>
  </div>
  
  <!-- Don't copy the add form -->
  <form no-copy>
    <input type="text" placeholder="Add task...">
    <button>Add</button>
  </form>
</div>
```

### Report with Mixed Content
```html
<div class="report" copy>
  <h1>Monthly Sales Report</h1>
  <p>Generated on: July 25, 2025</p>
  
  <section>
    <h2>Summary</h2>
    <p>Total sales increased by 15% this month...</p>
  </section>
  
  <!-- Internal comments not for external sharing -->
  <aside no-copy class="internal-only">
    <h3>Internal Notes</h3>
    <p>Discuss with CFO before sending to board</p>
  </aside>
  
  <section>
    <h2>Recommendations</h2>
    <p>Focus on enterprise customers...</p>
  </section>
  
  <!-- Don't copy action buttons -->
  <div no-copy class="actions">
    <button>Export PDF</button>
    <button>Email Report</button>
    <button>Schedule Meeting</button>
  </div>
</div>
```

## Benefits of This Approach

1. **Safe by Default**: Nothing is accidentally copied
2. **Explicit Intent**: Clear what content is meant to be shared
3. **Clean Output**: Interactive elements automatically excluded
4. **Simple Mental Model**: "Mark what you want to copy, exclude interactive bits"
5. **Future-Proof**: New content is not copied unless explicitly marked

## Common Patterns

### Do Copy
- Article content
- Report data
- Static information
- Titles and descriptions
- Generated summaries

### Don't Copy (use no-copy)
- Buttons and controls
- Form inputs
- Edit/Delete actions
- Internal notes
- UI state indicators
- Navigation elements
- Timestamps that change

## Implementation Notes

The CopyButton component:
- Automatically finds all elements with `copy` attribute
- Processes them in DOM order (or by `copy="number"` if specified)
- Excludes any child elements marked with `no-copy`
- Handles dynamic content via MutationObserver
- Works with any React app without configuration