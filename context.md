# Ceed Civil Dashboard - Project Context & Session Progress

## Project Overview
React dashboard application for Ceed Civil Engineering with integrated Google Apps Script (`apps-script`) deployment.

## Recent Session Progress & Architectural Decisions

### 1. Sidenav State & UI Improvements
- **LocalStorage Persistence**: Configured `SettingsContext.jsx` to load and save `sidenav_mode` ("compact" vs "full") in `localStorage`.
- **Relocated Sidebar Toggle**: Moved the toggle switch from the top `Brand` component to the bottom section of `Layout1Sidenav.jsx` as a sleek Minimize/Maximize button.
- **Disabled Expand-on-Hover**: Removed `:hover` width expansion from `SidebarNavRoot` in `Layout1Sidenav.jsx` so the sidebar stays compact when collapsed.
- **Simple Tooltips**: Added MUI `Tooltip` wrappers around all navigation items in `VerticalNav.jsx` and the bottom minimize/maximize button when in compact mode.

### 2. Clasp & Apps Script Setup
- Added `.claspignore` to filter sync files for Google Apps Script deployment.
- Configured clasp synchronization to prevent directory nesting during `clasp pull` operations.

## Modified / Affected Components
- `src/contexts/SettingsContext.jsx`: `localStorage` synchronization for sidebar mode preference.
- `src/layouts/Layout1Sidenav.jsx`: Bottom minimize/maximize section and removal of hover expansion.
- `src/components/Brand.jsx`: Centered logo layout when compact.
- `src/components/VerticalNav/VerticalNav.jsx`: Wrapped items with `Tooltip` in compact mode.
- `.claspignore`: Added ignore patterns for clasp sync.
- `.clasp.json`: Clasp configuration.
