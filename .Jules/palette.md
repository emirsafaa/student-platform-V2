## 2026-03-24 - Icon-Only Button Accessibility
**Learning:** This application heavily utilizes emojis and text symbols ('✎', '🗑', '☰', '🔐', '📝') for icon-only buttons and links without providing screen-reader accessible names. Relying solely on visual cues makes the interface inaccessible.
**Action:** When adding or modifying interactive elements that use only icons or emojis, ensure to add `aria-label` attributes to describe the action for screen readers, and consider adding `title` attributes for visual tooltips where appropriate.
