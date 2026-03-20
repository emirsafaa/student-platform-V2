## 2026-03-20 - Icon-Only Buttons Accessibility
**Learning:** The application heavily relies on emojis for action buttons without semantic text, particularly in dynamic lists (like course editing/deleting). This creates a significant barrier for screen reader users and those seeking tooltip clarification.
**Action:** Add `aria-label` and `title` attributes to all icon-only buttons, ensuring localizations remain in Turkish to match the app's default language.
