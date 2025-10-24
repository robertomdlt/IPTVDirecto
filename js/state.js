/* ========================================
   IPTV Directo - State Management
   ======================================== */

class AppState {
    constructor() {
        this.currentLanguage = this.loadSettings().language || 'es';
        this.disclaimerAccepted = localStorage.getItem('iptv_disclaimer') === 'true';
        this.playlists = this.loadPlaylists();
        this.favorites = this.loadFavorites();
        this.currentPlaylist = null;
        this.currentGroup = null;
        this.channels = [];
        this.groups = [];
        this.focusedPanel = 'left'; // 'left' or 'right'
        this.focusedIndex = 0;
        this.isPlaying = false;
        this.currentChannel = null;
        this.showOverlay = false;
        this.overlayTimeout = null;
    }

    // Settings Management
    loadSettings() {
        const settings = localStorage.getItem('iptv_settings');
        return settings ? JSON.parse(settings) : { language: 'es' };
    }

    saveSettings(settings) {
        localStorage.setItem('iptv_settings', JSON.stringify(settings));
    }

    // Playlist Management
    loadPlaylists() {
        const playlists = localStorage.getItem('iptv_playlists');
        return playlists ? JSON.parse(playlists) : [];
    }

    savePlaylists() {
        localStorage.setItem('iptv_playlists', JSON.stringify(this.playlists));
    }

    addPlaylist(url, name) {
        const playlist = {
            id: this.generateId(),
            name: name || 'Mi Lista',
            url: url,
            createdAt: new Date().toISOString(),
            channels: []
        };
        this.playlists.push(playlist);
        this.savePlaylists();
        return playlist;
    }

    setCurrentPlaylist(playlist) {
        this.currentPlaylist = playlist;
        if (playlist && playlist.channels) {
            this.channels = playlist.channels;
            this.groups = this.extractGroups(playlist.channels);
        }
    }

    extractGroups(channels) {
        const groupSet = new Set();
        channels.forEach(channel => {
            if (channel.groupTitle) {
                groupSet.add(channel.groupTitle);
            }
        });
        return Array.from(groupSet);
    }

    // Favorites Management
    loadFavorites() {
        const favorites = localStorage.getItem('iptv_favorites');
        return favorites ? JSON.parse(favorites) : [];
    }

    saveFavorites() {
        localStorage.setItem('iptv_favorites', JSON.stringify(this.favorites));
    }

    toggleFavorite(channelId) {
        const index = this.favorites.indexOf(channelId);
        if (index === -1) {
            this.favorites.push(channelId);
            this.saveFavorites();
            return true; // added
        } else {
            this.favorites.splice(index, 1);
            this.saveFavorites();
            return false; // removed
        }
    }

    isFavorite(channelId) {
        return this.favorites.includes(channelId);
    }

    // Disclaimer Management
    acceptDisclaimer() {
        localStorage.setItem('iptv_disclaimer', 'true');
        this.disclaimerAccepted = true;
    }

    // Utility Methods
    generateId() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AppState };
}
