# IPTV Directo - LG webOS IPTV Player

A complete IPTV player application for LG webOS Smart TVs that allows users to manage and view their own IPTV channel lists in M3U format.

## Features

### Core Functionality
- **M3U Playlist Support**: Load and parse M3U/M3U8 format playlists
- **Dual-Panel Interface**: Browse channels with groups on the left (30%) and channel list on the right (70%)
- **Channel Organization**: Automatic grouping by categories (Sports, Movies, News, etc.)
- **Favorites System**: Mark and access your favorite channels quickly
- **Video Playback**: Full-screen video streaming with overlay controls
- **Multi-Language**: Spanish and English interface support
- **Persistent Storage**: All settings, playlists, and favorites saved locally

### User Interface
- **Dark Theme**: Optimized for TV viewing with high contrast
- **Remote Control Navigation**: Full D-pad support with color button shortcuts
- **TV-Optimized**: Large fonts (28-48px) for 10-foot viewing distance
- **Responsive**: Works on Full HD (1920x1080) and 4K (3840x2160) displays

### Navigation
- **Arrow Keys**: Navigate through groups and channels
- **OK/Enter**: Select group or play channel
- **Yellow Button**: Toggle favorite status
- **Green Button**: Open settings
- **Back/Escape**: Return to channel list from playback

## Getting Started

### First Launch

1. **Legal Disclaimer**: On first launch, you'll see a legal disclaimer. Accept it to continue.
2. **Add IPTV List**: Enter your M3U playlist URL (e.g., `http://example.com/playlist.m3u`)
3. **Name Your List** (optional): Give your playlist a custom name
4. **Save**: The app will load and parse your channels

### Testing with Sample Playlist

A sample M3U file is included: `sample-playlist.m3u`

To test locally:
1. Start a local HTTP server in the project directory:
   ```bash
   # Python 3
   python -m http.server 8000

   # Node.js
   npx http-server -p 8000
   ```

2. On first launch, enter the URL:
   ```
   http://localhost:8000/sample-playlist.m3u
   ```

3. Or use the full file path (if supported by your browser):
   ```
   file:///C:/workspaceAnd/PruebaLg4/IptvDirecto/sample-playlist.m3u
   ```

## Remote Control Mapping

### Standard Controls
| Button | Action |
|--------|--------|
| ↑ ↓ | Navigate up/down within current panel |
| ← → | Switch between left (groups) and right (channels) panels |
| OK/Enter | Select group or play channel |
| Back | Exit playback and return to channel list |

### Color Buttons
| Button | Action | Code |
|--------|--------|------|
| 🟡 Yellow | Toggle favorite for selected/playing channel | 406 |
| 🟢 Green | Open settings menu | 405 |
| 🔴 Red | Reserved for future use | 403 |
| 🔵 Blue | Reserved for future use | 404 |

## Architecture

### Technology Stack
- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3
- **Video**: HTML5 Video element (supports HLS, MPEG-DASH with browser support)
- **Storage**: localStorage API for data persistence
- **Platform**: LG webOS SDK 6.0+

### Project Structure
```
IptvDirecto/
├── index.html              # Main application (single-file app)
├── appinfo.json           # webOS app configuration
├── icon.png               # App icon (80x80)
├── largeIcon.png          # Large app icon (130x130)
├── sample-playlist.m3u    # Sample M3U for testing
├── Documentation/         # Design and specification documents
│   ├── PRD-IPTV-LG-WebOS.md
│   ├── IPTV-Directo-UI-Design-Document.md
│   └── Software-Requirements-Specification.md
└── webOSTVjs-1.2.10/     # webOS TV SDK
    ├── webOSTV.js
    └── webOSTV-dev.js
```

### State Management
The app uses a class-based state management system:
- **AppState**: Manages playlists, channels, favorites, and settings
- **UIController**: Handles all UI rendering and updates
- **NavigationController**: Manages focus and remote control input
- **M3UParser**: Parses M3U/M3U8 playlists

### Local Storage Keys
- `iptv_disclaimer`: Boolean - disclaimer acceptance status
- `iptv_playlists`: Array - all saved playlists with channels
- `iptv_favorites`: Array - favorite channel IDs
- `iptv_settings`: Object - language and app preferences

## Development

### Testing in Browser
1. Open `index.html` in a modern web browser
2. Use keyboard for navigation (arrow keys, Enter, Backspace)
3. Note: Color buttons (Yellow/Green) use keyCodes 406/405 - may not work in standard browsers

### Testing on LG TV Emulator
1. Install LG webOS TV SDK
2. Package the app:
   ```bash
   ares-package ./IptvDirecto
   ```
3. Install on emulator:
   ```bash
   ares-install --device emulator com.iptv.directo_1.0.0_all.ipk
   ```
4. Launch:
   ```bash
   ares-launch --device emulator iptv.directo.app
   ```

### Debugging
- Use Chrome DevTools for browser testing
- Use webOS CLI debugging for TV/emulator:
  ```bash
  ares-inspect --device emulator --app iptv.directo.app
  ```

## M3U Format Reference

### Basic Structure
```m3u
#EXTM3U
#EXTINF:-1 tvg-id="channel-id" tvg-name="Channel Name" tvg-logo="http://logo.url" group-title="Category",Channel Display Name
http://stream.url/channel.m3u8
```

### Supported Attributes
- `tvg-id`: Unique channel identifier (for EPG, optional)
- `tvg-name`: Internal channel name (optional)
- `tvg-logo`: URL to channel logo image (optional)
- `group-title`: Category/group name (required for grouping)

### Stream Formats
- HLS (`.m3u8`) - Recommended
- MPEG-DASH (`.mpd`)
- Direct HTTP streams (`.ts`)

## Features Roadmap

### Implemented ✅
- M3U playlist loading and parsing
- Dual-panel navigation UI
- Channel grouping by categories
- Favorites system
- Video playback
- Multi-language support (ES/EN)
- Local storage persistence
- Remote control navigation
- First-launch disclaimer and setup

### Future Enhancements 🚀
- EPG (Electronic Program Guide) integration
- Multiple playlist management
- Channel search/filter
- Parental controls
- Server-based MAC address activation
- Cloud sync for favorites
- Channel logos display
- Recent channels list

## Compliance & Legal

### Disclaimer
This application:
- Does NOT provide or host any IPTV content
- Does NOT endorse any specific IPTV services
- Users are solely responsible for the legality of their content sources
- Developers assume NO liability for user-provided content

### LG Content Store Compliance
The app is designed to meet LG Content Store requirements:
- Prominent legal disclaimer on first launch
- No bundled content or links to illegal sources
- User brings their own IPTV lists
- Compliant with webOS app guidelines

## Troubleshooting

### Playlist Won't Load
- Verify the M3U URL is accessible
- Check for CORS issues (playlist must allow cross-origin requests)
- Ensure the URL returns plain text M3U format

### Channel Won't Play
- Check if the stream URL is valid and accessible
- Verify stream format is supported (HLS recommended)
- Check network connectivity
- Some streams may require specific codecs

### Settings Not Saving
- Check browser localStorage is enabled
- Verify sufficient storage quota
- Check browser console for errors

### Remote Control Not Working
- Verify you're testing on actual webOS TV or emulator
- Browser testing won't support color button keyCodes
- Check console log for key press events

## Credits

**Developed for**: LG webOS Smart TV Platform
**Design**: Following LG webOS UI/UX guidelines
**Version**: 1.0.0
**License**: Apache 2.0

## Support

For issues, feature requests, or contributions:
- Check the documentation in the `Documentation/` folder
- Review the PRD for feature specifications
- Consult the UI Design Document for interface details
- Check the Software Requirements Specification for technical details

---

**Made with** ❤️ **for LG webOS**
