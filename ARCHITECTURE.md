# IPTV Directo - Architecture Documentation

## Overview

This document describes the modular architecture of IPTV Directo after refactoring from a monolithic HTML file to a structured, maintainable codebase.

## Project Structure

```
IptvDirecto/
├── index.html                 # Main HTML file (clean, modular)
├── index.html.backup          # Original monolithic version (backup)
├── appinfo.json              # webOS app configuration
├── sample-playlist.m3u       # Sample M3U for testing
│
├── css/                      # Stylesheets
│   ├── styles.css           # Global styles, variables, utilities
│   ├── layout.css           # Layout structures and screens
│   └── components.css       # UI component styles
│
├── js/                       # JavaScript modules
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

**index.html** (123 lines)
- Clean HTML structure
- Imports CSS stylesheets
- Imports JavaScript modules
- Contains only markup, no inline styles or scripts

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
DOMContentLoaded
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
AppState (independent)
  ↓
UIController(appState)
  ↓
NavigationController(appState, ui)
  ↓
main.js (uses all classes)
```

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

**After**: Organized structure
- `index.html`: 123 lines (clean HTML only)
- `css/`: 3 files, ~400 lines total
- `js/`: 6 files, ~700 lines total

**Size Reduction**: ~85% reduction in main HTML file size

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
