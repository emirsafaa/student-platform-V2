## 2026-03-11 - ARIA labels on emoji-only and toggle controls

**Learning:** Emoji-only and icon-only controls (like 🔐 or ☰) require explicit `aria-label`s to be accessible to screen readers, as the visual meaning is not inherently clear. Additionally, toggle buttons (like a hamburger menu) benefit from `:aria-expanded` to convey their current state.
**Action:** Always add `aria-label` to any button or link whose content is purely visual (icons, emojis). For buttons that toggle state (like menus or accordions), ensure `aria-expanded` is properly bound to the state variable.
