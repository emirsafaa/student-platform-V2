# Palette's UX Journal

## 2024-05-24 - Dynamic ARIA Labels for Icon-Only Toggles
**Learning:** Using a static `aria-label` like "Menu" on a toggle button (like a hamburger menu) doesn't inform screen reader users of the current state or the action that will occur upon activation. Adding `aria-expanded` helps, but dynamically updating the `aria-label` based on state provides even clearer context.
**Action:** When implementing icon-only toggle buttons in Vue (like the hamburger menu), bind both `:aria-expanded="isOpen"` and `:aria-label="isOpen ? 'Close Menu' : 'Open Menu'"` to provide complete context to assistive technologies.