## 2024-05-24 - Accessible Icon Buttons and Inputs in Courses

**Learning:** Icon-only buttons (like "✎" and "🗑") and placeholder-only inputs are completely opaque to screen readers, causing accessibility issues.
**Action:** Always pair icon-only interactive elements with `aria-label`s and `title`s. Ensure inputs always have either an associated `<label>` or an `aria-label` when an explicit visual label breaks the design.
