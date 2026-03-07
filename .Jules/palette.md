## 2025-03-03 - Hamburger Menu Accessibility Attributes

**Learning:** Icon-only toggle buttons like hamburger menus need `aria-expanded` in addition to `aria-label` to communicate not only their purpose but also their current state (open/closed) to screen reader users.
**Action:** Always bind `:aria-expanded` to the state variable controlling the menu visibility alongside `aria-label` for mobile navigation toggles.
