# IPTV Directo - Architecture Documentation

## Overview

This document describes the modular architecture of IPTV Directo after refactoring from a monolithic HTML file to a structured, maintainable codebase.

## Project Structure

```
IptvDirecto/
├── index.html                 # Main HTML file (ultra-clean, 31 lines)
├── index.html.backup          # Original monolithic version (backup)
├── appinfo.json              # webOS app configuration
├── sample-playlist.m3u       # Sample M3U for testing
│
├── components/               # HTML Component Templates
│   ├── loading-screen.html  # Loading spinner screen
│   ├── disclaimer-screen.html # Legal disclaimer screen
│   ├── setup-screen.html    # First-time setup form
│   ├── main-app.html        # Dual-panel main interface
│   ├── video-player.html    # Video player with overlay
│   ├── settings-modal.html  # Settings modal dialog
│   └── toast.html           # Toast notification
│
├── css/                      # Stylesheets
│   ├── styles.css           # Global styles, variables, utilities
│   ├── layout.css           # Layout structures and screens
│   └── components.css       # UI component styles
│
├── js/                       # JavaScript modules
│   ├── loader.js            # ComponentLoader - dynamic HTML loading
│   ├── utils.js             # Translations and utility functions
│   ├── state.js             # AppState class - state management
│   ├── parser.js            # M3UParser class - M3U parsing
│   ├── ui.js                # UIController class - UI rendering
│   ├── navigation.js        # NavigationController - remote control
│   └── main.js              # Application initialization and events
│
├── webOSTVjs-1.2.10/        # LG webOS SDK
│   ├── webOSTV.js
│   └── webOSTV-dev.js
│
└── Documentation/            # Design documents
    ├── PRD-IPTV-LG-WebOS.md
    ├── IPTV-Directo-UI-Design-Document.md
    └── Software-Requirements-Specification.md
```

## File Responsibilities

### HTML

**index.html** (31 lines)
- Ultra-clean HTML structure
- Imports CSS stylesheets
- Imports JavaScript modules (including loader.js)
- Contains NO markup - all components loaded dynamically
- Only structure: `<head>` with resources and empty `<body>`

**HTML Components** (components/ folder)
- `loading-screen.html` - Loading spinner with animated icon
- `disclaimer-screen.html` - Legal disclaimer with accept/exit buttons
- `setup-screen.html` - Form to add first M3U playlist
- `main-app.html` - Dual-panel layout with groups, channels, and footer
- `video-player.html` - Video element with overlay controls
- `settings-modal.html` - Settings menu modal
- `toast.html` - Toast notification element

### CSS Files

**css/styles.css**
- CSS variables (color palette)
- Reset and base styles
- Global typography
- Utility classes (.hidden)
- Scrollbar styling
- Animations (@keyframes)

**css/layout.css**
- Main app container
- Dual-panel layout
- Screen layouts (loading, disclaimer, setup, video player)
- Footer help bar
- Empty states

**css/components.css**
- Button styles
- Form components (inputs, labels)
- Group items
- Channel items
- Modal components
- Settings items
- Toast notifications

### JavaScript Modules

**js/loader.js**
- `ComponentLoader` class
- Methods:
  - `loadComponent(path)` - Fetch single HTML component
  - `loadComponents(array)` - Load multiple components
  - `loadAllComponents()` - Load all app components
- Dispatches `componentsLoaded` event when complete
- Must load BEFORE other application scripts

**js/utils.js**
- Translation strings (Spanish and English)
- `translations` object exported for use in other modules

**js/state.js**
- `AppState` class
- Methods:
  - `loadSettings()` / `saveSettings()`
  - `loadPlaylists()` / `savePlaylists()` / `addPlaylist()`
  - `loadFavorites()` / `saveFavorites()` / `toggleFavorite()`
  - `setCurrentPlaylist()` / `extractGroups()`
  - `acceptDisclaimer()`
  - `generateId()` - UUID generator

**js/parser.js**
- `M3UParser` class
- Methods:
  - `fetchPlaylist(url)` - Fetch M3U from URL
  - `parseM3U(m3uText)` - Parse M3U text into channel objects
  - `parseExtInf(line, number)` - Extract metadata from EXTINF line
  - `generateId()` - UUID generator

**js/ui.js**
- `UIController` class
- Constructor: `(appState)` - Receives AppState instance
- Methods:
  - `showLoading()` / `hideLoading()`
  - `showDisclaimer()` / `hideDisclaimer()`
  - `showSetup()` / `hideSetup()`
  - `showMainApp()` / `hideMainApp()` / `updateFooter()`
  - `renderGroups()` / `renderChannels()`
  - `showToast(message, duration)`
  - `showSettings()` / `hideSettings()`
  - `playChannel(channel)` / `stopPlayback()`
  - `showVideoOverlay()` / `hideVideoOverlay()` / `autoHideOverlay()`

**js/navigation.js**
- `NavigationController` class
- Constructor: `(appState, ui)` - Receives both AppState and UIController
- Methods:
  - `moveFocusUp()` / `moveFocusDown()`
  - `moveFocusLeft()` / `moveFocusRight()`
  - `selectCurrent()` - Select group or play channel
  - `toggleFavorite()` - Add/remove from favorites
  - `handleBack()` - Back button handler

**js/main.js**
- Application initialization
- Global instances: `appState`, `ui`, `navigation`, `parser`
- Functions:
  - `initializeApp()` - Initialize app and check first launch
  - `loadPlaylist(playlist)` - Load and parse M3U playlist
  - `setupEventListeners()` - Attach all event listeners
- Entry point: `DOMContentLoaded` event

## Data Flow

### Initialization Flow
```
DOMContentLoaded (loader.js)
  → ComponentLoader.loadAllComponents()
    → Fetch all HTML components from components/ folder
    → Insert components into DOM
    → Dispatch 'componentsLoaded' event

componentsLoaded event (main.js)
  → initializeApp()
    → new AppState()
    → new UIController(appState)
    → new NavigationController(appState, ui)
    → new M3UParser()
    → Check disclaimer
    → Check playlists
    → loadPlaylist() if available
  → setupEventListeners()
```

### Playlist Loading Flow
```
User enters M3U URL
  → appState.addPlaylist(url, name)
  → loadPlaylist(playlist)
    → parser.fetchPlaylist(url)
    → parser.parseM3U(m3uText)
    → playlist.channels = channels
    → appState.setCurrentPlaylist(playlist)
    → ui.renderGroups()
    → ui.renderChannels()
```

### Navigation Flow
```
User presses arrow key
  → keydown event in main.js
  → navigation.moveFocusUp/Down/Left/Right()
    → Update appState.focusedPanel
    → Update appState.focusedIndex
    → Update DOM focus classes
```

### Playback Flow
```
User selects channel
  → navigation.selectCurrent()
  → ui.playChannel(channel)
    → appState.isPlaying = true
    → videoElement.src = channel.streamUrl
    → ui.showVideoOverlay()
    → ui.autoHideOverlay()
```

## Class Dependencies

```
ComponentLoader (loads HTML)
  ↓
AppState (independent)
  ↓
UIController(appState)
  ↓
NavigationController(appState, ui)
  ↓
main.js (uses all classes)
```

## Component Loading System

The application uses a dynamic component loading system that separates HTML markup into individual files:

**How it works:**
1. `index.html` loads `loader.js` first
2. `loader.js` fetches all HTML components via `fetch()`
3. Components are inserted into the DOM dynamically
4. Once complete, `componentsLoaded` event is dispatched
5. `main.js` waits for this event before initializing the app

**Benefits:**
- **Separation of Concerns**: HTML structure separate from logic
- **Maintainability**: Each screen/component in its own file
- **Modularity**: Easy to add/remove/modify components
- **Clean index.html**: Only 31 lines, pure structure

## LocalStorage Keys

| Key | Type | Description |
|-----|------|-------------|
| `iptv_disclaimer` | String | "true" if disclaimer accepted |
| `iptv_playlists` | JSON Array | All playlists with channels |
| `iptv_favorites` | JSON Array | Array of favorite channel IDs |
| `iptv_settings` | JSON Object | Language and preferences |

## Benefits of Modular Structure

### Maintainability
- **Easy to locate code**: Each file has a specific responsibility
- **Smaller files**: Easier to read and understand
- **Clear dependencies**: Class constructors show relationships

### Scalability
- **Easy to add features**: Create new modules without affecting existing code
- **Reusable components**: CSS and JS components can be reused
- **Testing**: Individual modules can be tested in isolation

### Collaboration
- **Multiple developers**: Can work on different modules simultaneously
- **Clear ownership**: Each file has a specific purpose
- **Code reviews**: Smaller, focused files are easier to review

### Performance
- **Browser caching**: CSS and JS files cached separately
- **Selective loading**: Could implement lazy loading in future
- **Minification**: Can minify files individually for production

## Migration Notes

### From Monolithic to Modular

**Before**: 1,450 lines in single HTML file
- CSS: ~517 lines inline
- JavaScript: ~825 lines inline
- HTML: ~108 lines

**After (Phase 1)**: Organized structure
- `index.html`: 123 lines (clean HTML only)
- `css/`: 3 files, ~400 lines total
- `js/`: 6 files, ~700 lines total

**After (Phase 2)**: Component-based structure
- `index.html`: 31 lines (ultra-clean, no markup)
- `components/`: 7 HTML component files
- `css/`: 3 files, ~400 lines total
- `js/`: 7 files (added loader.js), ~800 lines total

**Size Reduction**: ~97% reduction in main HTML file size (1,450 → 31 lines)

### Backward Compatibility

The backup file `index.html.backup` contains the original monolithic version for reference.

## Development Workflow

### Adding a New Feature

1. **UI Component**: Add styles to `css/components.css`
2. **Layout**: Add structure to `css/layout.css` if needed
3. **Logic**: Create new method in appropriate class
4. **Events**: Add event listeners in `main.js`
5. **Testing**: Test feature in isolation

### Modifying Existing Feature

1. **Locate file**: Use structure above to find relevant file
2. **Make changes**: Edit specific file
3. **Test**: Verify no regressions
4. **Document**: Update this file if architecture changes

## Best Practices

### CSS
- Use CSS variables for colors and spacing
- Follow BEM naming convention for complex components
- Keep specificity low

### JavaScript
- Keep classes focused and single-responsibility
- Use descriptive method names
- Add JSDoc comments for complex functions
- Handle errors gracefully

### HTML
- Keep markup semantic
- Use data attributes for JavaScript hooks
- Add comments for major sections

## Future Enhancements

### Potential Improvements
- **ES6 Modules**: Convert to ES6 import/export syntax
- **Build System**: Add Webpack or Vite for bundling
- **TypeScript**: Add type safety
- **Unit Tests**: Add Jest or Vitest for testing
- **Component Framework**: Consider React/Vue for complex UI
- **CSS Preprocessor**: Add SASS/LESS for advanced styling

### File Organization
- `/components/`: Reusable UI components
- `/services/`: API and service layer
- `/hooks/`: Custom React hooks (if using React)
- `/types/`: TypeScript type definitions
- `/tests/`: Unit and integration tests

---

**Version**: 1.0.0
**Last Updated**: 2025-10-24
**Maintained By**: Roberto M.
