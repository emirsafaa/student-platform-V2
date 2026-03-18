## 2026-03-18 - Missing ARIA labels on emoji icon-buttons
**Learning:** The application frequently uses emojis (☰, 🔐, 📝, ✎, 🗑) as text contents for icon-only buttons and links instead of SVG or font icons. Screen readers often announce emojis inconsistently or not at all depending on user settings, making these controls completely inaccessible.
**Action:** Always add `aria-label` and `title` attributes (localized to Turkish) to any button or link that uses emojis as its primary visual representation.
