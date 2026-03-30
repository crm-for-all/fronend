# Mandatory React Project Rules

1. Never add user-facing text without translations for `en`, `he`, and `ru`.
2. Never hardcode visible text in JSX.
3. Hebrew must always use RTL.
4. English and Russian must always use LTR.
5. Never build layouts that assume left-to-right only.
6. Always use direction-aware layout behavior.
7. Every screen and component must work on mobile, tablet, and laptop.
8. Every screen and component must support light and dark mode.
9. Never ship a feature that works in only one theme.
10. Never ship a feature that was checked only on desktop layout.
11. Use theme tokens and shared styling primitives instead of hardcoded colors.
12. Use logical spacing/alignment properties instead of left/right-specific CSS whenever possible.
13. Consider a task incomplete if translations, RTL/LTR support, responsiveness, or theming are missing.