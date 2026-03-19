## 2024-05-15 - Missing ARIA Labels on Text-Symbol Emoji Buttons
**Learning:** The application extensively uses raw text symbols (like '✏️', '🗑️', '☰') instead of SVG/font icons for compact buttons. Screen readers often struggle to interpret these correctly or fail to announce their context/purpose, leading to poor accessibility.
**Action:** When adding or auditing icon-only buttons using text symbols, always apply explicit `aria-label` and `title` attributes to ensure full screen reader support and visual tooltips.
