/* ========================================
   IPTV Directo - Main Application
   ======================================== */

// Global instances
let appState, ui, navigation, parser;

/**
 * Initialize the application
 */
async function initializeApp() {
    // Initialize instances
    appState = new AppState();
    ui = new UIController(appState);
    navigation = new NavigationController(appState, ui);
    parser = new M3UParser();

    // Check disclaimer
    if (!appState.disclaimerAccepted) {
        ui.showDisclaimer();
        return;
    }

    // Check if we have playlists
    if (appState.playlists.length === 0) {
        ui.showSetup();
        return;
    }

    // Load first playlist and show main app
    await loadPlaylist(appState.playlists[0]);
}

/**
 * Load and parse M3U playlist
 * @param {Object} playlist - Playlist object with URL
 */
async function loadPlaylist(playlist) {
    try {
        ui.showLoading(ui.t('loadingChannels'));

        const m3uText = await parser.fetchPlaylist(playlist.url);
        const channels = parser.parseM3U(m3uText);

        playlist.channels = channels;
        appState.setCurrentPlaylist(playlist);

        ui.hideLoading();
        ui.showMainApp();
        ui.renderGroups();
    } catch (error) {
        ui.hideLoading();
        ui.showToast(ui.t('errorLoadingPlaylist'));
        console.error('Error loading playlist:', error);
    }
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    // Disclaimer buttons
    document.getElementById('btnAcceptDisclaimer').addEventListener('click', function() {
        appState.acceptDisclaimer();
        ui.hideDisclaimer();

        if (appState.playlists.length === 0) {
            ui.showSetup();
        } else {
            loadPlaylist(appState.playlists[0]);
        }
    });

    document.getElementById('btnExitApp').addEventListener('click', function() {
        window.close();
    });

    // Setup form
    document.getElementById('btnSavePlaylist').addEventListener('click', async function() {
        const url = document.getElementById('inputPlaylistUrl').value;
        const name = document.getElementById('inputPlaylistName').value || 'Mi Lista';

        if (!url) {
            ui.showToast(ui.t('invalidUrl'));
            return;
        }

        const playlist = appState.addPlaylist(url, name);
        ui.hideSetup();
        await loadPlaylist(playlist);
    });

    document.getElementById('btnCancelSetup').addEventListener('click', function() {
        if (appState.playlists.length > 0) {
            ui.hideSetup();
            loadPlaylist(appState.playlists[0]);
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(event) {
        console.log('Key pressed:', event.key, event.keyCode);

        // Different behavior when video is playing
        if (appState.isPlaying) {
            switch(event.key) {
                case 'ArrowUp':
                    navigation.previousChannel();
                    break;
                case 'ArrowDown':
                    navigation.nextChannel();
                    break;
                case 'Enter':
                    navigation.returnToList();
                    break;
                case 'Backspace': // Back button
                case 'Escape':
                    navigation.handleBack();
                    break;
                case 'ArrowLeft':
                case 'ArrowRight':
                    // Show overlay on left/right during playback
                    if (appState.showOverlay) {
                        ui.autoHideOverlay();
                    }
                    break;
            }
        } else {
            // Normal navigation when not playing
            switch(event.key) {
                case 'ArrowUp':
                    navigation.moveFocusUp();
                    break;
                case 'ArrowDown':
                    navigation.moveFocusDown();
                    break;
                case 'ArrowLeft':
                    navigation.moveFocusLeft();
                    break;
                case 'ArrowRight':
                    navigation.moveFocusRight();
                    break;
                case 'Enter':
                    navigation.selectCurrent();
                    break;
                case 'Backspace': // Back button
                case 'Escape':
                    navigation.handleBack();
                    break;
            }
        }

        // Handle colored buttons (webOS remote)
        // Red button (403)
        if (event.keyCode === 403) {
            // Reserved for future use
        }

        // Green button (404)
        if (event.keyCode === 404) {
            ui.showSettings();
        }

        // Yellow button (405)
        if (event.keyCode === 405) {
            navigation.toggleFavorite();
            if (appState.isPlaying) {
                ui.showVideoOverlay();
                ui.autoHideOverlay();
            }
        }

        // Blue button (406)
        if (event.keyCode === 406) {
            // Reserved for future use
        }

        // Show overlay on button press during playback (except navigation keys)
        if (appState.isPlaying && !appState.showOverlay) {
            const navigationKeys = ['ArrowUp', 'ArrowDown', 'Enter', 'Backspace', 'Escape'];
            if (!navigationKeys.includes(event.key)) {
                ui.showVideoOverlay();
                ui.autoHideOverlay();
            }
        }

        event.preventDefault();
    });
}

/**
 * Application entry point
 * Wait for components to load before initializing
 */
document.addEventListener('componentsLoaded', function() {
    initializeApp();
    setupEventListeners();
});
