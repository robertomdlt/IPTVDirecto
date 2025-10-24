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

        switch(event.key) {
            case 'ArrowUp':
                navigation.moveFocusUp();
                if (appState.isPlaying && appState.showOverlay) {
                    ui.autoHideOverlay();
                }
                break;
            case 'ArrowDown':
                navigation.moveFocusDown();
                if (appState.isPlaying && appState.showOverlay) {
                    ui.autoHideOverlay();
                }
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

        // Handle colored buttons (webOS remote)
        // Yellow button (406)
        if (event.keyCode === 406) {
            navigation.toggleFavorite();
            if (appState.isPlaying) {
                ui.showVideoOverlay();
                ui.autoHideOverlay();
            }
        }

        // Green button (405)
        if (event.keyCode === 405) {
            ui.showSettings();
        }

        // Show overlay on any button press during playback
        if (appState.isPlaying && !appState.showOverlay) {
            ui.showVideoOverlay();
            ui.autoHideOverlay();
        }

        event.preventDefault();
    });
}

/**
 * Application entry point
 */
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
});
