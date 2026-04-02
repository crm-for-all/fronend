# CRM Optimization Ideas

## 1. Global Metadata Context (`SettingsContext`)
**Goal**: Stop fetching `tags` and `statuses` on every page click.
- Fetch them **once** when the app boots or when the user logs in.
- Store them in a React Context so `CustomersDashboard`, `CustomerModal`, and `SettingsManager` pull from the same memory.
- Update this global state automatically whenever a specific item is edited or deleted.

## 2. Server-State Management (React Query)
**Goal**: Automate API lifecycles and background caching.
- Let a specialized library handle the `loading`, `error`, and `data` states.
- Background revalidation: Refresh data silently when the user refocuses the window.
- Out-of-the-box support for "Stale-While-Revalidate", making the UI feel incredibly fast.

## 3. Bulk Operations & Checkboxes
**Goal**: Speed up workflows for large customer lists.
- Add checkboxes to each row in the customer table.
- Implement a **Bulk Action Bar** that appears when rows are selected.
- Actions: "Delete Selected", "Change Status to...", or "Export to Excel".
