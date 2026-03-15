## 2025-03-15 - Missing ARIA Labels on Icon-only Elements
**Learning:** In this application, many icon-only buttons and links (such as the mobile hamburger menu and login/register action icons) are missing necessary `aria-label`, `title`, and ARIA state attributes (like `aria-expanded`), which impacts keyboard and screen reader accessibility.
**Action:** Consistently add `aria-label` for screen readers and `title` for visual tooltips, along with relevant state attributes, to all icon-only interactive elements across the platform.
