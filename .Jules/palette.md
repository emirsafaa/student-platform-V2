## 2024-05-18 - Missing ARIA attributes on icon-only buttons

**Learning:** Icon-only action buttons (like edit or delete emojis/icons) are completely invisible to screen readers without an accessible name. They also lack context for sighted users without tooltips.
**Action:** Always add `aria-label` and `title` to icon-only buttons to ensure they have an accessible name and tooltip for all users.
