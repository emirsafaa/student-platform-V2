## 2023-11-06 - Icon-Only Buttons Missing Accessibility Context
**Learning:** Found several instances of icon-only buttons (like Edit ✎, Delete 🗑, and the Hamburger menu ☰) lacking `aria-label` attributes and screen reader support. These are completely inaccessible to screen reader users and confusing for standard users without hover tooltips.
**Action:** Always add `aria-label` and `title` attributes to buttons whose primary content is a symbol or icon, ensuring both screen readers and visual users have context.
