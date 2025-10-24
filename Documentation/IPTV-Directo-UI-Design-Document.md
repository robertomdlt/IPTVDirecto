# UI Design Document: IPTV Directo
## LG webOS IPTV Player Application

---

## Layout Structure

### Main Application Layout (Dual-Panel Design)

The application uses a persistent dual-panel layout that remains consistent throughout the browsing experience:

**Left Panel (30% screen width)**
- Navigation sidebar containing group categories
- Fixed position, always visible
- "⭐ MIS FAVORITOS" positioned at the very top (first selectable item)
- Below favorites: scrollable list of channel groups (Sports, Movies, News, Entertainment, etc.)
- Vertical scrolling only

**Right Panel (70% screen width)**
- Content display area showing channel list for currently selected group
- Displays 8-10 channels simultaneously
- Each channel entry shows: channel number, channel name, current program title, program time
- Vertical scrolling through channels

**Footer Help Bar (5% screen height)**
- Persistent thin bar at bottom of screen
- Displays button mappings: `🟡 Favoritos  🟢 Ajustes  🔙 Volver`
- Always visible during dual-panel browsing
- Hidden during fullscreen playback

**Panel Interaction**
- Left/Right arrow keys switch focus between left and right panels
- Currently focused panel displays prominent visual indicator
- Only one panel can have focus at a time

### Fullscreen Playback Layout

When a channel is selected and playing:

**Default State**
- Pure fullscreen video playback
- No overlays or UI elements visible
- Footer help bar hidden

**Overlay State (triggered by any button press)**
- Semi-transparent dark overlay appears at bottom 25% of screen
- Displays: Channel name, channel number, current program info, program time
- Simple playback controls (if applicable)
- "🟡 Agregar a Favoritos" / "🟡 Quitar de Favoritos" toggle indicator
- Overlay auto-dismisses after 5 seconds of inactivity
- Press Back button to return to dual-panel view

### Settings Screen Layout

Accessed via Green button from anywhere:

**Modal Overlay Design**
- Centered modal (50% screen width, 60% height)
- Dark background with semi-transparent backdrop
- Simple vertical list of options:
  - Idioma / Language
  - Gestión de Listas (access to list management)
  - Acerca de / About
  - Aviso Legal / Legal Disclaimer
- Press Back or Green button again to close

### First Launch Screens

**Screen 1: Legal Disclaimer**
- Centered text box (60% screen width)
- Clear, readable disclaimer text
- "Aceptar" button to continue
- "Salir" button to exit app

**Screen 2: Add First IPTV List**
- Centered form (50% screen width)
- Title: "Agregar tu Lista IPTV"
- Text input field: "URL de la Lista M3U"
- Text input field: "Nombre de la Lista" (optional, defaults to "Mi Lista")
- On-screen keyboard appears for text input
- "Guardar" and "Cancelar" buttons

**Screen 3: Loading**
- Centered spinner
- Text: "Cargando canales..."
- Progress indicator if available

---

## Core Components

### Channel List Item (Right Panel)

Each channel entry is a horizontal row containing:

**Left Section (10%)**
- Channel number in large, bold font
- Light gray color

**Middle Section (60%)**
- Channel name (first line, bold, white)
- Current program title (second line, regular weight, light gray)
- Truncated with ellipsis if too long

**Right Section (20%)**
- Program time (e.g., "20:30 - 22:00")
- Light gray color

**Far Right (10%)**
- Favorite star icon (⭐) if channel is favorited
- Yellow color when present
- Empty space if not favorited

**Focus State**
- Entire row background changes to accent color
- All text becomes high contrast
- Subtle border or shadow for depth

### Group Item (Left Panel)

Each group entry is a simple text row:

**Default State**
- Group name in large font (36px)
- White or light gray text
- Adequate padding (20px top/bottom)

**Selected State**
- Background changes to accent color
- Text becomes bold
- Left border indicator (5px thick accent color bar)

**Favorites Entry (Always First)**
- "⭐ MIS FAVORITOS" text
- Star emoji prefix for visual recognition
- Slightly larger or bolder than other groups

### Button Component

Used in Settings, First Launch, and overlays:

**Visual Design**
- Rounded rectangle (border-radius: 8px)
- Solid background color (accent color for primary, dark gray for secondary)
- White text, centered
- Minimum size: 200px width × 60px height

**States**
- Default: Solid color background
- Focused: Brighter background, subtle glow or border
- Pressed: Slightly darker, subtle scale animation

### Text Input Component

Used for URL and list name entry:

**Visual Design**
- Rectangular box with thin border
- Dark background, lighter border (2px)
- White text inside
- Placeholder text in gray
- Minimum height: 60px

**States**
- Default: Gray border
- Focused: Accent color border, subtle glow
- Active (keyboard visible): Brighter accent border
- Error: Red border with error message below

### Modal/Overlay Component

Used for Settings and confirmations:

**Structure**
- Semi-transparent black backdrop (70% opacity) covering entire screen
- Centered white or dark gray content box
- Rounded corners (12px border-radius)
- Drop shadow for depth
- Close button or "Press Back to close" instruction

---

## Interaction Patterns

### Primary Navigation Flow

**Starting Point: Dual-Panel View**

1. User sees Left Panel (groups) and Right Panel (channels) simultaneously
2. Focus starts on Left Panel, "MIS FAVORITOS" item
3. Up/Down arrows navigate within focused panel
4. Left/Right arrows switch panel focus
5. OK button on channel = Start playback (fullscreen)
6. Yellow button anywhere = Toggle favorite on selected channel
7. Green button anywhere = Open Settings modal
8. Back button = Exit app (with confirmation prompt)

### Favorites Management

**Adding to Favorites**
1. Navigate to any channel (in any group)
2. Press Yellow button
3. Star icon (⭐) appears next to channel instantly
4. Brief toast notification: "Agregado a Favoritos"
5. Channel now appears in "MIS FAVORITOS" group

**Removing from Favorites**
1. Navigate to favorited channel (star visible)
2. Press Yellow button again
3. Star icon disappears instantly
4. Brief toast notification: "Eliminado de Favoritos"
5. If viewing from Favorites group, channel remains visible but star removed

**Accessing Favorites**
1. From anywhere in dual-panel view, press Left arrow to focus Left Panel
2. Press Up arrow until "⭐ MIS FAVORITOS" is selected
3. Press Right arrow or OK to view favorites in Right Panel
4. All favorited channels displayed regardless of original group

### Playback Interaction

**Starting Playback**
1. Navigate to desired channel
2. Press OK button
3. Brief loading indicator (1-2 seconds)
4. Video plays fullscreen immediately
5. All UI elements hidden

**During Playback**
1. Press any button → Info overlay appears at bottom
2. Overlay shows channel info and controls
3. Press Yellow button → Toggle favorite (confirmation shown in overlay)
4. Press Green button → Settings modal appears over video
5. Press Back button → Return to dual-panel view (video stops)
6. No interaction for 5 seconds → Overlay auto-hides

**Channel Switching**
1. While in playback with overlay visible
2. Up/Down arrows → Preview next/previous channel info in overlay
3. Press OK → Switch to new channel immediately
4. Alternative: Press Back → Return to dual-panel, select new channel

### Settings Access

**Opening Settings**
1. From anywhere (dual-panel or playback), press Green button
2. Settings modal appears as overlay
3. Focus automatically on first menu item
4. Up/Down arrows navigate settings options
5. OK button selects option

**Closing Settings**
1. Press Back button → Modal closes, returns to previous screen
2. Press Green button again → Same result
3. Navigate to last option and press Down → Cycles to first option (circular navigation)

### List Management (within Settings)

**Accessing List Management**
1. Open Settings (Green button)
2. Navigate to "Gestión de Listas"
3. Press OK → New screen showing current lists

**List Management Screen**
- Shows all configured IPTV lists (usually just one for this audience)
- Each list displays: Name, date added, channel count
- Options per list: Rename, Delete, Set as Default
- "Agregar Nueva Lista" button at bottom

**Adding New List**
1. Select "Agregar Nueva Lista"
2. Same form as first launch: URL input, name input
3. Save → Returns to list management, new list appears
4. App asks: "¿Cambiar a esta lista ahora?" (Yes/No)

### Error Handling Patterns

**Failed to Load List**
- Error modal appears: "No se pudo cargar la lista"
- Options: "Reintentar" or "Volver"
- If retry fails 3 times → Option to edit URL or delete list

**Failed to Play Channel**
- Toast notification: "Canal no disponible"
- Automatically skips to next channel in list
- If multiple failures → Returns to dual-panel view

**Network Loss During Playback**
- Buffering indicator appears after 3 seconds
- After 10 seconds → Error overlay: "Conexión perdida"
- Options: "Reintentar" or "Volver a la lista"

---

## Visual Design Elements & Color Scheme

### Color Palette

**Primary Colors**
- Background: `#0A0A0A` (near black)
- Surface: `#1A1A1A` (dark gray for panels and modals)
- Accent: `#FF6B35` (vibrant orange for focus states and primary actions)
- Secondary Accent: `#FFD700` (gold for favorites/yellow button functions)

**Text Colors**
- Primary Text: `#FFFFFF` (white for main content)
- Secondary Text: `#B0B0B0` (light gray for metadata, times, descriptions)
- Disabled Text: `#666666` (dark gray)

**Semantic Colors**
- Success: `#4CAF50` (green for confirmations)
- Error: `#F44336` (red for errors and warnings)
- Warning: `#FFA726` (amber for cautions)
- Info: `#2196F3` (blue for informational messages)

**UI Element Colors**
- Borders: `#333333` (subtle dark gray)
- Dividers: `#2A2A2A` (very dark gray)
- Overlays/Backdrops: `rgba(0, 0, 0, 0.7)` (semi-transparent black)
- Focus Indicator: `#FF6B35` (accent orange, 3px solid border)

### Visual Hierarchy

**Left Panel (Navigation)**
- High contrast against background
- Selected item: Bright accent background
- Unselected items: Subtle text, no background
- Clear visual separation from Right Panel (1px divider line)

**Right Panel (Content)**
- Channels displayed in clear rows
- Alternating row backgrounds (subtle): `#0A0A0A` and `#121212`
- Focused row: Strong accent color background
- Information density: balanced spacing for readability from TV distance

**Depth & Elevation**
- Modals and overlays: Elevated appearance with drop shadows
- Shadow specification: `0 8px 32px rgba(0, 0, 0, 0.6)`
- Panels: Flat, no shadows (coplanar design)
- Buttons: Slight shadow on focus for tactile feel

### Iconography

**Icon Style**
- Simple, solid fills (no outlines)
- Minimum size: 32px × 32px for clarity
- High contrast against backgrounds
- Limited icon use (only where universally understood)

**Used Icons**
- ⭐ Star (favorites indicator)
- ⚙️ Gear (settings)
- ◀️ ▶️ Arrows (navigation hints)
- 🟡 🟢 🔴 🔵 Colored circles (button indicators in footer)
- ⏸️ ▶️ Play/Pause (in playback overlay if needed)
- ↻ Refresh (for retry actions)

**Icon Placement**
- Always aligned with text baseline
- Consistent spacing from text (12px margin)
- Yellow star appears at far right of channel rows when favorited

### Spacing & Layout Grid

**Base Unit: 8px**
- All spacing uses multiples of 8px for consistency
- Minimum touch target: 64px height (for remote navigation clarity)

**Panel Spacing**
- Left Panel internal padding: 24px (top/bottom), 32px (left/right)
- Right Panel internal padding: 24px (top/bottom), 40px (left/right)
- Gap between panels: 1px divider line

**Component Spacing**
- Channel row height: 96px
- Group item height: 72px
- Padding between rows: 8px
- Modal content padding: 40px all sides

**Screen Margins**
- Safe area inset: 48px from all screen edges
- Accounts for TV overscan and bezel areas

### Animation & Transitions

**General Principles**
- Subtle, purposeful animations only
- Duration: 200-300ms for most transitions
- Easing: ease-in-out for smooth, natural feel
- No animations that could cause motion sickness

**Specific Animations**
- Focus change: 200ms ease-in-out (position and color)
- Panel switch: 250ms ease-in-out (subtle slide and highlight)
- Modal appear: 300ms ease-out (fade in + slight scale up from 0.95 to 1.0)
- Modal dismiss: 200ms ease-in (fade out + slight scale down to 0.95)
- Toast notifications: Slide up from bottom (300ms), auto-dismiss after 3 seconds
- Channel row hover/focus: 150ms ease-out (immediate response)
- Playback overlay: 200ms fade in/out

**Loading States**
- Spinner animation: smooth rotation, 1 second per revolution
- Skeleton screens for channel lists (subtle pulse animation)
- Progress bars: smooth linear progression

---

## LG webOS TV Considerations

### Platform-Specific Adaptations

**Screen Resolution Support**
- Primary target: 1920×1080 (Full HD)
- Secondary target: 3840×2160 (4K)
- Responsive scaling: UI elements scale proportionally
- Text remains crisp at both resolutions
- Test on both resolutions during development

**Remote Control Mapping**
- D-pad (Up/Down/Left/Right): Primary navigation
- OK/Enter button: Select/Confirm
- Back button: Return/Cancel
- Yellow button: Toggle favorites
- Green button: Open settings
- Red button: Reserved (potential future use)
- Blue button: Reserved (potential future use)
- Number keys: Direct channel access (optional enhancement)

**webOS-Specific UI Elements**
- Respect webOS system UI overlays (volume, info banner)
- Handle webOS app lifecycle (pause/resume during playback)
- Integrate with webOS notification system for toasts
- Use webOS native keyboard for text input
- Follow webOS focus management APIs

**Performance Optimization**
- Lazy load channel list (virtualized scrolling for 4000+ channels)
- Only render visible channels + buffer (10 above, 10 below viewport)
- Optimize image loading for channel logos (lazy load, low resolution placeholders)
- Hardware-accelerated video playback using webOS media APIs
- Minimize DOM elements for smooth 60fps navigation

**Memory Management**
- Release video player resources when returning to channel list
- Clear unused channel logo images from memory
- Limit favorites list rendering (pagination if > 500 favorites)
- Monitor memory usage, especially on older webOS versions

**Storage Considerations**
- Use webOS localStorage for preferences and favorites
- Store channel list cache locally to reduce reload times
- Implement storage quota management (alert if storage full)
- Automatic cleanup of old cached data after 30 days

### TV Viewing Distance Optimization

**Text Sizing for 10-foot Experience**
- Minimum text size: 32px (for metadata, times)
- Channel names: 40px
- Group names: 36px
- Headings: 48px
- Body text in modals: 36px
- Footer help text: 28px (smallest acceptable)

**Visual Target Sizes**
- Minimum interactive element height: 72px
- Recommended: 96px for primary navigation items
- Ensures visibility and clear focus indication from 3 meters distance

**Contrast Ratios**
- Text to background: Minimum 7:1 (WCAG AAA compliance)
- Focus indicators: 3:1 contrast with surrounding elements
- Test on various TV models (OLED, LCD, different brightness settings)

---

## Typography

### Font Family

**Primary Font: Roboto**
- Reason: Excellent legibility on screens, widely supported, webOS compatible
- Fallback stack: `'Roboto', 'Helvetica Neue', Arial, sans-serif`
- Weights used: 400 (Regular), 500 (Medium), 700 (Bold)

**Alternative (if Roboto unavailable): Open Sans**
- Similar characteristics, good TV readability
- Fallback: system sans-serif

### Font Sizes

**Large Text (48px+)**
- Modal headings
- First-time setup titles
- Alert/confirmation dialog titles
- Font weight: 700 (Bold)

**Medium-Large Text (40-44px)**
- Channel names in list
- Group names in left panel
- Font weight: 500 (Medium) for channel names, 400 (Regular) for groups

**Medium Text (32-36px)**
- Settings menu items
- Button labels
- Program titles (metadata)
- Body text in modals
- Font weight: 400 (Regular), 500 (Medium) for emphasis

**Small Text (28-30px)**
- Program times
- Channel numbers
- Footer help bar text
- Metadata and descriptions
- Font weight: 400 (Regular)

**Minimum Text (24-26px)**
- Timestamps
- Tiny labels (use sparingly)
- Font weight: 400 (Regular)

### Font Styling

**Channel Names**
- Size: 40px
- Weight: 500 (Medium)
- Color: `#FFFFFF`
- Line height: 1.2
- Letter spacing: 0.5px

**Program Titles (EPG Info)**
- Size: 32px
- Weight: 400 (Regular)
- Color: `#B0B0B0`
- Line height: 1.3
- Letter spacing: 0.3px

**Group Names**
- Size: 36px
- Weight: 400 (Regular), 700 (Bold when selected)
- Color: `#FFFFFF` (selected), `#B0B0B0` (unselected)
- Line height: 1.2
- Letter spacing: 0.5px
- Text transform: Uppercase optional for group categories

**Times and Metadata**
- Size: 28px
- Weight: 400 (Regular)
- Color: `#B0B0B0`
- Line height: 1.4
- Letter spacing: 0.2px

**Button Text**
- Size: 36px
- Weight: 500 (Medium)
- Color: `#FFFFFF`
- Line height: 1.0
- Letter spacing: 0.5px
- Text transform: None (sentence case)

**Footer Help Bar**
- Size: 28px
- Weight: 400 (Regular)
- Color: `#B0B0B0`
- Line height: 1.0
- Letter spacing: 0.3px

### Text Truncation

**Single Line Truncation**
- Channel names: Ellipsis (...) after 30 characters
- Program titles: Ellipsis after 50 characters
- Group names: Ellipsis after 20 characters (rare, most fit)

**Multi-Line Support**
- Modal body text: Max 3 lines, line clamp with ellipsis
- Descriptions: Max 2 lines in channel list view
- Legal disclaimer: Scrollable, no truncation

### Localization Considerations

**Spanish (Primary Language)**
- Longer words than English (average 20-30% longer)
- Ensure text containers accommodate expanded text
- Test all UI elements with Spanish content first
- Common terms: "Favoritos" (9 chars) vs "Favorites" (9 chars) - similar length

**English (Secondary Language)**
- Generally more compact
- Test character limits with Spanish as baseline
- Ensure translations maintain meaning and tone
- Dynamic text sizing if needed for extreme cases

**Text Direction**
- Left-to-right (LTR) for both Spanish and English
- Alignment: Left-aligned for most text
- Centered for buttons, modals, titles
- Right-aligned for times and metadata in channel rows

---

## Accessibility

### Visual Accessibility

**High Contrast Mode**
- Default theme already meets WCAG AAA standards (7:1 text contrast)
- Focus indicators: 3px solid border, high contrast accent color
- Clear visual distinction between interactive and non-interactive elements

**Focus Indication**
- Always visible, never hidden or subtle
- Accent color border (3px) around focused element
- Background color change for focused rows/buttons
- Focus indicator persists during animations

**Color Independence**
- Never rely solely on color to convey information
- Favorites indicated by star icon + color
- Error states show icon + color + text message
- Button states use shape, text, and color together

**Text Readability**
- Large font sizes (minimum 28px) for TV viewing distance
- Clear font (Roboto) with excellent legibility
- Adequate line spacing (1.2-1.4 line height)
- No pure white text (uses `#FFFFFF` which appears slightly dimmed on most TVs)

### Cognitive Accessibility

**Consistent Navigation**
- Same navigation pattern throughout app
- Predictable behavior for all remote buttons
- Visual cues always in the same location (footer help bar)
- Mental model: Left panel = categories, Right panel = content

**Clear Hierarchy**
- Visual importance matches functional importance
- Favorites always at top (most important)
- Logical grouping of related items
- Clear headings and section divisions

**Reduced Cognitive Load**
- Minimal text on screen at once
- Simple, focused task flows
- No hidden features requiring discovery
- Clear labels and descriptions

**Error Prevention**
- Confirmation dialogs for destructive actions (delete list)
- Clear "Cancel" options always available
- Undo not required due to confirmations

### Motor Accessibility

**Large Touch Targets**
- Minimum 72px height for all interactive elements
- Recommended 96px for primary navigation
- Adequate spacing between targets (8px minimum)
- No precise positioning required

**Remote Control Optimization**
- All functionality accessible via D-pad
- No complex gestures required
- Linear navigation paths (up/down, left/right)
- Circular list navigation (top wraps to bottom)

**Forgiving Interactions**
- OK button confirms, Back button cancels (universal pattern)
- No accidental selections (requires deliberate OK press)
- Cancel/undo always available
- Timeout-free interactions (no rushed decisions)

### Language Accessibility

**Multi-Language Support**
- Spanish and English fully supported
- Language toggle in Settings (easy to find)
- All UI elements translated (no mixed languages)
- Date/time formats respect locale

**Clear Language**
- Simple, conversational tone
- Avoid technical jargon
- Short sentences and labels
- Action-oriented button text ("Agregar", "Eliminar", "Guardar")

**Consistent Terminology**
- Same terms used throughout app
- "Lista" always means IPTV list
- "Canal" always means channel
- "Favoritos" always means favorites

### Auditory Accessibility

**Visual Feedback for All Actions**
- No sound-only feedback
- All confirmations shown visually (toast, modal, or icon change)
- Loading states displayed visually
- Error messages as text, not beeps

**Optional Audio Cues**
- Sound effects for actions can be added but not required
- All audio feedback paired with visual equivalent
- User can disable sounds in Settings if implemented

### Age-Related Considerations (50-60 Years)

**Vision Accommodations**
- Large text (minimum 28px, most 32-40px)
- High contrast (7:1 minimum)
- No rapid movements or animations
- Clear focus indicators (easy to track location)

**Cognitive Simplicity**
- Reduced complexity (dual-panel, not multi-screen)
- Familiar patterns (similar to traditional TV)
- Persistent navigation (always visible)
- Minimal memory requirements (favorites at top)

**Reduced Fine Motor Requirements**
- Large targets, forgiving navigation
- No rapid reactions needed
- No complex button combinations
- Standard remote control only

---

## Summary

IPTV Directo uses a **Dual-Panel Classic Layout** optimized for 50-60 year-old users watching from 3 meters distance. The interface prioritizes **simplicity, discoverability, and familiarity** with a persistent split-screen design, large text, and clear focus indicators. 

**Key Features:**
- Left Panel (30%): Navigation with favorites always first
- Right Panel (70%): Channel list with program info
- Footer Help Bar: Button mapping always visible
- Yellow Button: Quick favorite toggle
- Green Button: Instant settings access
- Dark theme with high contrast for comfortable TV viewing
- Minimal navigation depth, maximum clarity

The design respects the target audience's need for simplicity while providing powerful functionality for managing 4000+ channels with ease.