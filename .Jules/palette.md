## 2024-05-24 - Accessibility labels for icon-only admin buttons
**Learning:** Icon-only buttons (like `✎` for edit and `🗑` for delete) in admin panels or lists are not accessible to screen readers and lack visual context for some users. They need `aria-label` for screen readers and `title` attributes for visual tooltips to maintain accessibility.
**Action:** Always add `aria-label` and `title` attributes (using the app's native language, in this case, Turkish) to any icon-only buttons introduced or modified in the UI.
