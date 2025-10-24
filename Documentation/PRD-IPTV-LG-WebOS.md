# Product Requirements Document: IPTV Player for LG webOS

## 1. Elevator Pitch

An IPTV player application for LG webOS televisions that allows users to configure, manage, and view their own IPTV channel lists in M3U format. The app provides a minimalist, dark-themed interface optimized for TV remote control navigation, enabling users to organize channels by groups, mark favorites, and enjoy seamless playback. Users bring their own IPTV lists, with the app serving as a flexible, user-friendly viewing platform.

## 2. Who is this app for

**Target Audience**: General public who own LG Smart TVs with webOS operating system and have access to IPTV channel lists in M3U format.

**User Characteristics**:
- Owns an LG Smart TV with webOS
- Has IPTV subscription or access to M3U playlist URLs
- Seeks a simple, intuitive way to watch IPTV channels on their TV
- May have multiple IPTV lists from different providers
- Expects traditional TV-like navigation using remote control

## 3. Functional Requirements

### 3.1 IPTV List Management
- Add IPTV lists manually by entering M3U playlist URLs
- Rename existing IPTV lists
- Delete IPTV lists from the application
- Store multiple IPTV lists simultaneously
- Persist all lists and configurations locally using webOS storage

### 3.2 Channel Browsing
- Load and parse M3U format playlists
- Display all channels contained in a selected list
- Show channels organized by their subgroups (as defined in M3U)
- Navigate through channels and groups using TV remote D-pad

### 3.3 Channel Playback
- Select individual channels from the list
- Stream and play selected IPTV channels
- Display basic playback controls

### 3.4 EPG (Electronic Program Guide)
- Display program guide information when available in the stream
- Show current and upcoming program details (if technically feasible without excessive complexity)

### 3.5 Favorites
- Mark channels as favorites
- Access favorites list quickly
- Persist favorite selections locally

### 3.6 User Interface
- Dark, minimalist design optimized for TV viewing
- Navigation fully compatible with LG TV remote control (D-pad)
- Multi-language support (minimum: Spanish and English)

### 3.7 Legal Compliance
- Display prominent disclaimer on first launch stating:
  - The application does not provide or endorse any IPTV lists
  - Users are responsible for the legality of their content sources
  - The developers assume no liability for user-provided content

### 3.8 LG App Store Requirements
- Comply with all LG Content Store submission guidelines
- Meet webOS application standards and quality requirements
- Pass LG certification process

## 4. User Stories

### Initial Setup
- **As a user**, I want to see a disclaimer when I first open the app, so I understand the app doesn't provide content and I'm responsible for my sources.
- **As a user**, I want to add my first IPTV list by entering a URL, so I can start watching channels.

### List Management
- **As a user**, I want to add multiple IPTV lists, so I can organize channels from different providers.
- **As a user**, I want to rename my lists, so I can identify them easily (e.g., "Sports Channels", "Family Package").
- **As a user**, I want to delete lists I no longer use, so I can keep my app organized.

### Browsing Channels
- **As a user**, I want to select an IPTV list and see all its channels, so I know what's available.
- **As a user**, I want channels organized by groups (e.g., Sports, Movies, News), so I can find content quickly.
- **As a user**, I want to navigate using my TV remote's arrow keys, so the experience feels natural on my TV.

### Watching Content
- **As a user**, I want to select a channel and have it start playing, so I can watch my content.
- **As a user**, I want to see what program is currently playing (if available), so I know what I'm watching.

### Favorites
- **As a user**, I want to mark my favorite channels, so I can access them quickly.
- **As a user**, I want a dedicated favorites section, so I don't have to browse through all channels every time.

### Persistence
- **As a user**, I want my lists, settings, and favorites saved automatically, so I don't have to reconfigure the app each time I open it.

## 5. User Interface

### 5.1 Design Principles
- **Dark Theme**: Primarily dark background with light text for comfortable TV viewing
- **Minimalist**: Clean interface with essential elements only
- **TV-Optimized**: Large, readable text and UI elements suitable for viewing from distance
- **Remote-Friendly**: Clear focus indicators and logical navigation flow

### 5.2 Key Screens

#### Home/Main Screen
- List of configured IPTV playlists
- Options to: Add new list, Select list, Manage lists
- Quick access to favorites
- Settings/Language selector

#### List Management Screen
- View all configured lists
- Actions per list: Open, Rename, Delete
- "Add New List" button

#### Add/Edit List Screen
- Text input field for M3U URL
- Text input field for list name
- Save/Cancel buttons
- Clear focus navigation

#### Channel Browser Screen
- Left sidebar: Group navigation (Sports, Movies, News, etc.)
- Main area: Channel list for selected group
- Channel information: Name, logo (if available), current program (if EPG available)
- Top bar: Current list name, Favorites access, Back button

#### Channel Playback Screen
- Full-screen video playback
- Overlay controls (appear on remote interaction):
  - Channel name
  - Current program info (if available)
  - Playback controls
  - Add to favorites option
- Back to channel list option

#### Favorites Screen
- List of all favorited channels across all playlists
- Organized by playlist or as unified list
- Same interaction as channel browser

#### Settings Screen
- Language selection
- About/Version info
- Legal disclaimer access

### 5.3 Navigation Flow
```
Home Screen → List Management → Add List (URL input) → Save
           → Select List → Channel Browser (by groups) → Select Channel → Playback
           → Favorites → Select Channel → Playback
           → Settings
```

### 5.4 UI Components
- **Buttons**: High contrast, large touch targets for D-pad selection
- **Lists**: Vertical scrollable lists with clear focus states
- **Text Input**: On-screen keyboard compatible with webOS
- **Focus Indicator**: Bold outline or highlight color for selected elements
- **Loading States**: Clear feedback when loading playlists or streams

### 5.5 Accessibility
- High contrast text (white/light gray on dark background)
- Clear focus indicators
- Logical tab order for remote navigation
- Text size optimized for TV viewing distance (minimum 24px equivalent)

---

## Future Enhancements (Out of Scope for MVP)

### Server Integration via API
- Register TV MAC address on first use
- Validate MAC address activation status before allowing app use
- Automatically load IPTV lists associated with registered MAC address
- Sync lists from server instead of manual URL entry

**Note**: Server-side API development and backend infrastructure are explicitly out of scope for this project. Focus is solely on the webOS TV application.

---

## Technical Constraints

- **Platform**: LG webOS TV operating system
- **Format Support**: M3U playlist format
- **Storage**: Local storage using webOS-provided APIs (simplest available method)
- **Distribution**: LG Content Store (must meet all store requirements)
- **Navigation**: Standard LG TV remote control (D-pad focused)

## Success Criteria

- App successfully passes LG Content Store certification
- Users can add, manage, and play IPTV lists without technical issues
- Navigation is intuitive using only TV remote
- App stores configurations persistently across sessions
- Disclaimer is prominently displayed and acknowledged
- Multi-language support functions correctly