# Quick Start Guide - IPTV Directo

## Testing the Application

### Option 1: Browser Testing (Quick)

1. **Start a local server** in the project directory:
   ```bash
   # Using Python 3
   python -m http.server 8000

   # Or using Node.js
   npx http-server -p 8000
   ```

2. **Open in browser**:
   ```
   http://localhost:8000/index.html
   ```

3. **Navigate with keyboard**:
   - Arrow keys: Navigate
   - Enter: Select
   - Backspace: Go back

4. **Accept disclaimer** and add the sample playlist:
   ```
   http://localhost:8000/sample-playlist.m3u
   ```

5. **Browse channels**:
   - Use Left/Right arrows to switch between groups and channels
   - Use Up/Down to navigate within panels
   - Press Enter to play a channel

### Option 2: Direct File (Firefox Only)

1. Open `index.html` directly in Firefox
2. Use the file path for the sample playlist:
   ```
   file:///C:/workspaceAnd/PruebaLg4/IptvDirecto/sample-playlist.m3u
   ```

### Option 3: LG webOS Emulator

1. **Install LG webOS TV SDK** from: https://webostv.developer.lge.com/sdk/download/download-sdk/

2. **Setup emulator**:
   ```bash
   ares-setup-device
   ```

3. **Package the app**:
   ```bash
   ares-package C:\workspaceAnd\PruebaLg4\IptvDirecto
   ```

4. **Install on emulator**:
   ```bash
   ares-install --device emulator iptv.directo.app_1.0.0_all.ipk
   ```

5. **Launch**:
   ```bash
   ares-launch --device emulator iptv.directo.app
   ```

## Using Your Own IPTV Playlist

1. **Prepare your M3U file**: Ensure it follows standard M3U format:
   ```m3u
   #EXTM3U
   #EXTINF:-1 group-title="Category",Channel Name
   http://stream-url
   ```

2. **Host it online**: Upload to a public URL (or use local server)

3. **Add to app**:
   - On first launch, enter the URL
   - Or use Settings → List Management → Add New List

## Key Features to Test

### 1. Navigation
- ✅ Switch between Groups (left panel) and Channels (right panel) with Left/Right arrows
- ✅ Navigate within panels with Up/Down arrows
- ✅ Select groups and play channels with Enter

### 2. Favorites
- ✅ Add channel to favorites (Yellow button or keyCode 406)
- ✅ View favorites by selecting "⭐ MIS FAVORITOS" in the groups panel
- ✅ Remove from favorites by pressing Yellow again

### 3. Video Playback
- ✅ Play a channel by selecting it and pressing Enter
- ✅ View overlay info by pressing any key during playback
- ✅ Overlay auto-hides after 5 seconds
- ✅ Press Back/Escape to return to channel list

### 4. Settings
- ✅ Open settings with Green button (keyCode 405)
- ✅ Change language (Spanish ↔ English)
- ✅ Access list management
- ✅ View legal disclaimer

### 5. Persistence
- ✅ Close and reopen the app - settings and favorites are saved
- ✅ Clear browser localStorage to reset the app

## Troubleshooting

### Playlist won't load
**Problem**: "Error al cargar la lista"
**Solutions**:
- Check the URL is accessible
- Verify CORS is allowed (for cross-origin requests)
- Test the URL in a browser first
- Check browser console for detailed errors

### Video won't play
**Problem**: Black screen or loading forever
**Solutions**:
- Verify stream URL is valid
- Use HLS (.m3u8) streams when possible
- Check network connectivity
- Try a different channel

### Navigation not working
**Problem**: Can't move between panels
**Solutions**:
- Make sure you're using arrow keys (not Tab)
- Check that focus is visible (orange border)
- Try refreshing the page
- Check browser console for JavaScript errors

## Next Steps

1. **Test all features** using the sample playlist
2. **Add your own IPTV list** with real channels
3. **Mark favorites** and verify they persist
4. **Test language switching** (Settings → Language)
5. **Test on actual LG TV** or emulator for full experience

## Sample Playlist Contents

The included `sample-playlist.m3u` has 12 channels across 5 groups:
- **Deportes** (Sports): ESPN HD, FOX Sports
- **Documentales** (Documentaries): Discovery, National Geographic
- **Noticias** (News): CNN, BBC News
- **Películas** (Movies): HBO, Netflix Original
- **Infantil** (Kids): Cartoon Network, Disney Channel
- **Entretenimiento** (Entertainment): MTV, Comedy Central

**Note**: The sample uses public test streams and demo videos. Replace with your own IPTV URLs for actual content.

---

**Ready to deploy?** Check the README.md for deployment instructions to LG Content Store.
