# Software Requirements Specification
## IPTV Directo - LG webOS Application

---

## System Design

### Overview
- **Platform**: LG webOS 6.0+ Smart TV application
- **Application Type**: Single-page application with multiple view states
- **Target Display**: 1920x1080 (Full HD) minimum, 3840x2160 (4K) optimized
- **Viewing Distance**: Optimized for 3-meter viewing distance
- **Input Method**: LG Magic Remote (D-pad navigation primary, pointer secondary)

### System Components
- **Presentation Layer**: React-based UI components optimized for TV
- **Business Logic Layer**: Channel management, playlist parsing, favorites handling
- **Data Layer**: Local storage persistence using webOS localStorage API
- **Media Layer**: HTML5 Video API with HLS/MPEG-DASH support
- **Parser Module**: M3U/M3U8 playlist parser

### Key Subsystems
- **Playlist Management System**: Add, edit, delete, and persist IPTV lists
- **Channel Browser System**: Parse and display channels with EPG metadata
- **Playback System**: Stream IPTV channels with overlay controls
- **Favorites System**: Mark, store, and retrieve favorite channels
- **Navigation System**: D-pad focused navigation with focus management
- **Settings System**: Language selection, list management, legal information
- **Storage System**: Persistent local data storage

---

## Architecture Pattern

### Primary Pattern: **Model-View-Controller (MVC)**
- **Model**: Data structures for playlists, channels, favorites, and settings
- **View**: React components for UI rendering
- **Controller**: Business logic for user interactions and state updates

### Secondary Pattern: **Component-Based Architecture**
- Reusable UI components (Button, Modal, ChannelList, GroupNav)
- Separation of concerns between presentational and container components
- Props-based data flow between parent and child components

### Design Principles
- **Single Responsibility**: Each component handles one specific UI concern
- **Separation of Concerns**: UI, business logic, and data access separated
- **Modularity**: Independent, testable modules for parsing, storage, playback
- **TV-First Design**: All interactions optimized for remote control navigation

### Folder Structure
```
/src
  /components
    /common (Button, Modal, Input, LoadingSpinner)
    /navigation (GroupNav, ChannelList, Footer)
    /playback (VideoPlayer, PlaybackOverlay)
    /settings (SettingsModal, ListManagement)
  /models
    /Playlist.js
    /Channel.js
    /Favorites.js
  /controllers
    /PlaylistController.js
    /ChannelController.js
    /FavoritesController.js
    /NavigationController.js
  /services
    /StorageService.js
    /M3UParser.js
    /PlaybackService.js
  /utils
    /FocusManager.js
    /KeyHandler.js
  /locales
    /es.json
    /en.json
```

---

## State Management

### State Management Strategy: **React Context API + useReducer**

### Global State Structure
```javascript
{
  // Playlist state
  playlists: [
    {
      id: "uuid",
      name: "My IPTV List",
      url: "http://example.com/playlist.m3u",
      channels: [],
      groups: [],
      lastUpdated: "timestamp"
    }
  ],
  currentPlaylist: "uuid",
  
  // Channel state
  channels: [],
  currentGroup: "MIS FAVORITOS",
  selectedChannel: null,
  
  // Favorites state
  favorites: ["channel-id-1", "channel-id-2"],
  
  // Navigation state
  focusedPanel: "left", // "left" | "right"
  focusedIndex: 0,
  
  // Playback state
  isPlaying: false,
  showOverlay: false,
  currentStream: null,
  
  // UI state
  showSettings: false,
  showListManagement: false,
  isLoading: false,
  error: null,
  
  // App state
  firstLaunch: true,
  disclaimerAccepted: false,
  language: "es", // "es" | "en"
  
  // EPG state (if available)
  currentProgram: {
    title: "",
    startTime: "",
    endTime: ""
  }
}
```

### State Contexts
- **AppContext**: Global app state (language, first launch, disclaimer)
- **PlaylistContext**: Playlist and channel data
- **FavoritesContext**: Favorite channels management
- **NavigationContext**: Focus and navigation state
- **PlaybackContext**: Video playback state

### State Actions
```javascript
// Playlist actions
ADD_PLAYLIST, REMOVE_PLAYLIST, UPDATE_PLAYLIST, SELECT_PLAYLIST

// Channel actions
LOAD_CHANNELS, SELECT_CHANNEL, UPDATE_CHANNEL_EPG

// Favorites actions
ADD_FAVORITE, REMOVE_FAVORITE, LOAD_FAVORITES

// Navigation actions
SET_FOCUS_PANEL, SET_FOCUS_INDEX, SET_CURRENT_GROUP

// Playback actions
START_PLAYBACK, STOP_PLAYBACK, TOGGLE_OVERLAY

// UI actions
SHOW_SETTINGS, HIDE_SETTINGS, SET_LOADING, SET_ERROR

// App actions
ACCEPT_DISCLAIMER, SET_LANGUAGE, SET_FIRST_LAUNCH
```

### Persistence Strategy
- **Local Storage Keys**:
  - `iptv_playlists`: Serialized playlist data
  - `iptv_favorites`: Array of favorite channel IDs
  - `iptv_settings`: Language and preferences
  - `iptv_disclaimer`: Boolean for disclaimer acceptance
- **Persistence Timing**: 
  - Immediate on favorites add/remove
  - Debounced (500ms) on playlist updates
  - On app close/suspend

---

## Data Flow

### User Action → State Update Flow
```
User Input (Remote) → KeyHandler → NavigationController 
  → Dispatch Action → Reducer → State Update → Component Re-render
```

### Playlist Loading Flow
```
User adds M3U URL → Validation → HTTP Fetch → M3U Parser 
  → Channel Objects → State Update → StorageService → LocalStorage
```

### Favorites Toggle Flow
```
Yellow Button Press → FavoritesController → Check current state
  → Add/Remove from favorites array → State Update 
  → LocalStorage persist → UI Update (star icon)
```

### Channel Playback Flow
```
User selects channel → PlaybackController → Extract stream URL
  → VideoPlayer component → Initialize HTML5 video 
  → Start stream → Fullscreen mode → Monitor playback events
```

### EPG Update Flow (Optional)
```
Channel load → Check EPG data in M3U → Extract tvg-id/epg-url
  → Fetch EPG XML (if available) → Parse program data
  → Match with current time → Update currentProgram state
```

### Navigation Flow
```
D-pad Input → KeyHandler → NavigationController
  → Check focused panel → Update focusedIndex
  → FocusManager → Update DOM focus → Visual indicator update
```

### Settings Flow
```
Green Button → Show settings modal → User selection
  → Controller action (language change, list management, etc.)
  → State update → LocalStorage persist → UI update/reload
```

---

## Technical Stack

### Core Framework
- **Framework**: React 18.x
- **Build Tool**: Webpack 5 with webOS optimization
- **Package Manager**: npm or yarn

### webOS SDK
- **SDK Version**: webOS TV SDK 6.0+
- **Development Tools**: 
  - webOS TV CLI tools
  - webOS TV IDE (Eclipse-based) or VS Code with webOS extension
- **Emulator**: webOS TV Emulator for testing

### Media Handling
- **Video Player**: HTML5 `<video>` element
- **HLS Support**: hls.js (for Apple HLS streams)
- **DASH Support**: dash.js (for MPEG-DASH streams)
- **Codecs**: H.264, H.265 (HEVC), AAC audio

### Data Parsing
- **M3U Parser**: Custom parser or `m3u8-parser` library
- **XML Parser**: DOMParser (for EPG XML if implemented)

### Storage
- **Primary**: webOS localStorage API
- **Fallback**: IndexedDB (if localStorage insufficient)
- **Size Limit**: Plan for ~10MB data storage

### Internationalization
- **Library**: react-i18next or custom solution
- **Languages**: Spanish (es), English (en)
- **Locale Data**: Separate JSON files per language

### UI Components
- **Base Components**: Custom React components (no UI framework)
- **Styling**: CSS Modules or Styled Components
- **Animations**: CSS transitions/animations (GPU accelerated)
- **Icons**: SVG icons or icon font (Roboto icons)

### Development Tools
- **Linter**: ESLint with React hooks rules
- **Formatter**: Prettier
- **Testing**: Jest + React Testing Library
- **Remote Debugging**: Chrome DevTools via webOS CLI

### webOS-Specific APIs
- **Storage**: `webOS.service.request('luna://com.webos.service.settings')`
- **Deep Linking**: `webOS.platform.identify()` for app info
- **TV Info**: `webOS.service.tv` for TV-specific data
- **Lifecycle**: `webOSLaunch`, `webOSRelaunch` events

---

## Authentication Process

### Disclaimer Flow (First Launch)
1. **App Launch**: Check `localStorage.getItem('iptv_disclaimer')`
2. **If null/false**: 
   - Show legal disclaimer screen (fullscreen modal)
   - Display disclaimer text in current language
   - Options: "Aceptar" (Accept) / "Salir" (Exit)
3. **User accepts**: 
   - Set `localStorage.setItem('iptv_disclaimer', 'true')`
   - Proceed to first-time setup
4. **User exits**: Close application using `window.close()`

### First-Time Setup Flow
1. **Check Playlists**: `localStorage.getItem('iptv_playlists')`
2. **If empty**: 
   - Show "Add First IPTV List" screen
   - Text input: M3U URL (required)
   - Text input: List name (optional, default "Mi Lista")
   - On-screen keyboard for text entry
3. **Validation**: 
   - Check URL format (http/https)
   - Validate M3U structure
4. **Success**: 
   - Save to localStorage
   - Proceed to main app view
5. **Error**: 
   - Show error message
   - Allow retry or cancel

### Session Management
- **No User Authentication**: This app does NOT use login/password
- **No Server Connection**: All data stored locally on TV
- **No MAC Validation**: MAC-based activation is out of scope for MVP
- **Session Persistence**: App state persists across TV power cycles

### Future Authentication (Out of Scope)
- MAC address registration on server
- Server-side validation before app activation
- Automatic playlist sync based on MAC address

---

## Route Design

### Navigation Structure: **Single-Page Application with View States**

webOS apps typically do not use traditional routing. Instead, use view state management:

### View States
```javascript
const VIEW_STATES = {
  DISCLAIMER: 'disclaimer',           // First launch only
  FIRST_SETUP: 'first_setup',         // First launch only
  MAIN: 'main',                       // Dual-panel browser
  PLAYBACK: 'playback',               // Fullscreen video
  SETTINGS: 'settings',               // Modal overlay
  LIST_MANAGEMENT: 'list_management'  // Modal overlay
}
```

### View State Transitions
```
App Launch → DISCLAIMER (if first launch)
  → FIRST_SETUP (if no playlists)
  → MAIN (default view)

MAIN → PLAYBACK (OK on channel)
PLAYBACK → MAIN (Back button)

MAIN → SETTINGS (Green button)
SETTINGS → MAIN (Back button)

SETTINGS → LIST_MANAGEMENT (select option)
LIST_MANAGEMENT → SETTINGS (Back button)
```

### View State Implementation
```javascript
// AppController.js
const [currentView, setCurrentView] = useState(VIEW_STATES.MAIN);

// View state checks
useEffect(() => {
  const disclaimerAccepted = localStorage.getItem('iptv_disclaimer');
  const playlists = JSON.parse(localStorage.getItem('iptv_playlists') || '[]');
  
  if (!disclaimerAccepted) {
    setCurrentView(VIEW_STATES.DISCLAIMER);
  } else if (playlists.length === 0) {
    setCurrentView(VIEW_STATES.FIRST_SETUP);
  } else {
    setCurrentView(VIEW_STATES.MAIN);
  }
}, []);
```

### Deep Linking (Optional)
- webOS supports custom URI schemes: `iptv-directo://channel/123`
- Not required for MVP
- Can be added later for external integrations

---

## API Design

### Internal API Structure (Services)

Since this is a client-only application with no backend, all "APIs" are internal JavaScript services:

### StorageService
```javascript
class StorageService {
  // Playlists
  async savePlaylists(playlists)
  async loadPlaylists()
  async deletePlaylist(playlistId)
  
  // Favorites
  async saveFavorites(favorites)
  async loadFavorites()
  
  // Settings
  async saveSettings(settings)
  async loadSettings()
  
  // Disclaimer
  async setDisclaimerAccepted()
  async isDisclaimerAccepted()
}
```

### M3UParserService
```javascript
class M3UParserService {
  async fetchPlaylist(url)
  parseM3U(m3uText)
  extractChannels(parsedData)
  extractGroups(channels)
  parseEPGInfo(channel)
}
```

**Return Structure**:
```javascript
{
  channels: [
    {
      id: "unique-id",
      number: 1,
      name: "Channel Name",
      groupTitle: "Sports",
      streamUrl: "http://stream.url",
      logo: "http://logo.url",
      epg: {
        tvgId: "channel-id",
        epgUrl: "http://epg.url"
      }
    }
  ],
  groups: ["Sports", "Movies", "News", ...]
}
```

### PlaybackService
```javascript
class PlaybackService {
  initializePlayer(videoElement, streamUrl)
  startPlayback()
  stopPlayback()
  getPlaybackState()
  handleStreamError()
}
```

### NavigationService
```javascript
class NavigationService {
  setFocus(elementId)
  moveFocusUp()
  moveFocusDown()
  moveFocusLeft()
  moveFocusRight()
  getFocusedElement()
}
```

### External API Calls

#### M3U Playlist Fetch
- **Method**: GET
- **URL**: User-provided M3U URL
- **Response**: Plain text M3U file
- **Error Handling**: Network timeout, invalid format, CORS issues

#### EPG Data Fetch (Optional, Future)
- **Method**: GET
- **URL**: Extracted from M3U tvg-url attribute
- **Format**: XML (XMLTV format)
- **Response**: Program schedule data

### Future Server API (Out of Scope)
When server integration is added, implement:
```javascript
// Future API endpoints
POST   /api/v1/register        // Register TV MAC address
GET    /api/v1/validate/:mac   // Check activation status
GET    /api/v1/playlists/:mac  // Get playlists for MAC
POST   /api/v1/favorites       // Sync favorites to server
```

---

## Database Design (ERD)

### Storage: LocalStorage (Key-Value Pairs)

Since webOS uses localStorage (not a relational database), here's the data structure:

### Data Models

#### Playlists Collection
```javascript
// Key: 'iptv_playlists'
// Value: JSON array
[
  {
    id: "uuid-v4",              // Primary key
    name: "My IPTV List",
    url: "http://example.com/playlist.m3u",
    createdAt: "2025-10-23T12:00:00Z",
    lastUpdated: "2025-10-23T12:00:00Z",
    channelCount: 4000,
    groupCount: 25
  }
]
```

#### Channels Collection (Nested in Playlists)
```javascript
// Stored within each playlist object
{
  id: "playlist-uuid",
  channels: [
    {
      id: "channel-uuid",       // Primary key
      playlistId: "playlist-uuid", // Foreign key
      number: 1,
      name: "ESPN HD",
      groupTitle: "Sports",
      streamUrl: "http://stream.example.com/espn",
      logo: "http://logo.example.com/espn.png",
      epg: {
        tvgId: "espn.us",
        tvgName: "ESPN",
        epgUrl: "http://epg.example.com/guide.xml"
      },
      metadata: {
        resolution: "1080p",
        codec: "h264"
      }
    }
  ]
}
```

#### Favorites Collection
```javascript
// Key: 'iptv_favorites'
// Value: JSON array of channel IDs
[
  "channel-uuid-1",
  "channel-uuid-2",
  "channel-uuid-3"
]

// Alternative: Full channel data for offline access
[
  {
    channelId: "channel-uuid-1",
    playlistId: "playlist-uuid",
    addedAt: "2025-10-23T14:00:00Z",
    // Cached channel data
    name: "ESPN HD",
    streamUrl: "...",
    groupTitle: "Sports"
  }
]
```

#### Settings Object
```javascript
// Key: 'iptv_settings'
// Value: JSON object
{
  language: "es",              // "es" | "en"
  theme: "dark",               // Always dark (future: light option)
  lastPlayedChannel: "channel-uuid",
  lastPlayedPlaylist: "playlist-uuid",
  autoPlayLastChannel: false,
  overlayTimeout: 5000,        // milliseconds
  version: "1.0.0"
}
```

#### App State Object
```javascript
// Key: 'iptv_app_state'
// Value: JSON object
{
  disclaimerAccepted: true,
  firstLaunchComplete: true,
  lastOpenedAt: "2025-10-23T16:00:00Z",
  totalWatchTime: 12000        // seconds
}
```

### Entity Relationship Diagram

```
┌─────────────────┐
│   PLAYLISTS     │
├─────────────────┤
│ PK id           │
│    name         │──┐
│    url          │  │
│    createdAt    │  │
│    lastUpdated  │  │ One-to-Many
└─────────────────┘  │
                     │
                     ├──> ┌─────────────────┐
                     │    │    CHANNELS     │
                     │    ├─────────────────┤
                     │    │ PK id           │
                     └───<│ FK playlistId   │
                          │    number       │──┐
                          │    name         │  │
                          │    groupTitle   │  │
                          │    streamUrl    │  │
                          │    logo         │  │
                          │    epg          │  │
                          └─────────────────┘  │
                                               │
                                               │ Many-to-Many
                                               │ (via favorites)
                                               │
                          ┌─────────────────┐  │
                          │   FAVORITES     │  │
                          ├─────────────────┤  │
                          │ channelId[]     │<─┘
                          │ (array of IDs)  │
                          └─────────────────┘

┌─────────────────┐
│    SETTINGS     │
├─────────────────┤
│    language     │
│    theme        │
│    preferences  │
└─────────────────┘

┌─────────────────┐
│   APP_STATE     │
├─────────────────┤
│ disclaimerAcc.  │
│ firstLaunch     │
│ lastOpenedAt    │
└─────────────────┘
```

### Data Relationships

1. **Playlist → Channels**: One-to-Many
   - One playlist contains many channels
   - Channels belong to one playlist
   - Cascading delete: Removing playlist removes all its channels

2. **Channels ← Favorites**: Many-to-Many
   - Multiple channels can be favorited
   - Favorites reference channels by ID
   - Channel can be in multiple playlists but favorited once

3. **Settings**: Standalone singleton
   - Global app preferences
   - No relationships

4. **App State**: Standalone singleton
   - App lifecycle data
   - No relationships

### Storage Constraints

- **localStorage Limit**: 5-10MB per origin (browser-dependent)
- **Estimated Data Size**:
  - 1 playlist metadata: ~1KB
  - 1 channel: ~500 bytes
  - 4000 channels: ~2MB
  - Maximum safe: 3 playlists with 4000 channels each (~6MB)

### Data Migration Strategy

```javascript
// Version 1.0.0 → 1.1.0 migration example
function migrateData() {
  const version = localStorage.getItem('iptv_data_version');
  
  if (!version || version === '1.0.0') {
    // Add new fields, transform structures
    const playlists = JSON.parse(localStorage.getItem('iptv_playlists'));
    playlists.forEach(playlist => {
      playlist.groupCount = calculateGroups(playlist.channels);
    });
    localStorage.setItem('iptv_playlists', JSON.stringify(playlists));
    localStorage.setItem('iptv_data_version', '1.1.0');
  }
}
```

### Data Backup Strategy

- **Export**: Provide "Export Data" button to download JSON backup
- **Import**: Allow users to restore from JSON file
- **Format**: Single JSON file containing all playlists, favorites, settings

---

## Additional Technical Considerations

### Performance Optimization
- **Lazy Loading**: Load channel data on demand, not all at once
- **Virtual Scrolling**: For large channel lists (1000+ items)
- **Debouncing**: Search/filter operations debounced to 300ms
- **Memoization**: React.memo for channel list items

### Memory Management
- **Cleanup**: Remove event listeners on component unmount
- **Video Element**: Properly dispose video element on playback stop
- **HLS.js**: Destroy instance when switching channels

### Error Handling
- **Network Errors**: Retry logic with exponential backoff
- **Parse Errors**: Clear error messages, suggest URL verification
- **Playback Errors**: Fallback to different stream quality/format
- **Storage Errors**: Handle quota exceeded, offer to delete old data

### Security Considerations
- **URL Validation**: Sanitize user-provided URLs (XSS prevention)
- **Content Security Policy**: Restrict external resource loading
- **HTTPS Only**: Prefer HTTPS streams (HTTP with user warning)
- **No Sensitive Data**: Never store passwords or payment info

### Testing Strategy
- **Unit Tests**: Service layer (parsers, storage)
- **Component Tests**: React components in isolation
- **Integration Tests**: User flows (add playlist, play channel)
- **TV Testing**: Physical LG TV testing before release

### Deployment
- **Build**: Webpack production build with minification
- **Package**: webOS IPK package format
- **Signing**: Code signing required for LG Content Store
- **Submission**: Through LG Seller Lounge portal

---

## Version History

- **Version 1.0.0**: Initial MVP specification
  - Core functionality: playlist management, channel browsing, playback
  - Local-only, no server integration
  - Spanish and English support

---

## Appendix

### M3U Format Example
```
#EXTM3U
#EXTINF:-1 tvg-id="espn.us" tvg-name="ESPN HD" tvg-logo="http://logo.url" group-title="Sports",ESPN HD
http://stream.url/espn.m3u8
```

### webOS Package Structure
```
/app
  /index.html
  /appinfo.json
  /icon.png
  /largeIcon.png
  /dist
    /bundle.js
    /styles.css
```

### Key webOS Lifecycle Events
- `webOSLaunch`: App launched
- `webOSRelaunch`: App brought to foreground
- `unload`: App closing/backgrounding

---

*Document Version: 1.0*  
*Last Updated: October 23, 2025*  
*Target Platform: LG webOS 6.0+*
