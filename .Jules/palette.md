## 2024-03-14 - Icon-only Elements Lack Accessibility Labels
**Learning:** The application frequently uses emojis and text symbols (e.g., "✎", "🗑", "☰", "🔐") for icon-only buttons and links without corresponding `aria-label` attributes. This makes them inaccessible to screen readers and, if `title` is missing, lacks tooltips for sighted users.
**Action:** Always ensure interactive elements that rely solely on visual icons/emojis have `aria-label` attributes for screen readers. Add `title` for tooltips on buttons, and `aria-expanded` for toggle buttons like menus.
