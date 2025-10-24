/* ========================================
   IPTV Directo - UI Controller
   ======================================== */

class UIController {
    constructor(appState) {
        this.appState = appState;
        this.t = (key) => translations[appState.currentLanguage][key] || key;
    }

    // Loading Screen
    showLoading(text) {
        const loadingScreen = document.getElementById('loadingScreen');
        const loadingText = document.getElementById('loadingText');
        loadingText.textContent = text || this.t('loading');
        loadingScreen.classList.remove('hidden');
    }

    hideLoading() {
        document.getElementById('loadingScreen').classList.add('hidden');
    }

    // Disclaimer Screen
    showDisclaimer() {
        const screen = document.getElementById('disclaimerScreen');
        document.getElementById('disclaimerTitle').textContent = this.t('disclaimerTitle');
        document.getElementById('disclaimerText').textContent = this.t('disclaimerText');
        document.getElementById('btnAcceptDisclaimer').textContent = this.t('accept');
        document.getElementById('btnExitApp').textContent = this.t('exit');
        screen.classList.remove('hidden');
    }

    hideDisclaimer() {
        document.getElementById('disclaimerScreen').classList.add('hidden');
    }

    // Setup Screen
    showSetup() {
        const screen = document.getElementById('setupScreen');
        document.getElementById('setupTitle').textContent = this.t('setupTitle');
        document.getElementById('labelUrl').textContent = this.t('labelUrl');
        document.getElementById('labelName').textContent = this.t('labelName');
        document.getElementById('inputPlaylistUrl').placeholder = this.t('urlPlaceholder');
        document.getElementById('inputPlaylistName').placeholder = this.t('namePlaceholder');
        document.getElementById('btnSavePlaylist').textContent = this.t('save');
        document.getElementById('btnCancelSetup').textContent = this.t('cancel');
        screen.classList.remove('hidden');
    }

    hideSetup() {
        document.getElementById('setupScreen').classList.add('hidden');
    }

    // Playlist Selector Screen
    showPlaylistSelector() {
        const screen = document.getElementById('playlistSelector');
        document.getElementById('selectorTitle').textContent = this.t('selectPlaylist');
        document.getElementById('selectorAddNewHint').textContent = this.t('addNewList');
        this.renderPlaylists();
        screen.classList.remove('hidden');
    }

    hidePlaylistSelector() {
        document.getElementById('playlistSelector').classList.add('hidden');
    }

    renderPlaylists() {
        const selectorList = document.getElementById('selectorList');
        selectorList.innerHTML = '';

        if (this.appState.playlists.length === 0) {
            const emptyDiv = document.createElement('div');
            emptyDiv.className = 'empty-state';
            emptyDiv.innerHTML = `
                <div class="empty-icon">📺</div>
                <div>${this.t('noPlaylists')}</div>
            `;
            selectorList.appendChild(emptyDiv);
            return;
        }

        this.appState.playlists.forEach((playlist, index) => {
            const div = document.createElement('div');
            div.className = 'playlist-item';
            div.dataset.playlistId = playlist.id;

            if (index === 0) {
                div.classList.add('focused');
            }

            div.innerHTML = `
                <div class="playlist-icon">📋</div>
                <div class="playlist-info">
                    <div class="playlist-name">${playlist.name}</div>
                    <div class="playlist-url">${this.truncateUrl(playlist.url)}</div>
                </div>
            `;

            selectorList.appendChild(div);
        });
    }

    truncateUrl(url, maxLength = 60) {
        if (url.length <= maxLength) return url;
        return url.substring(0, maxLength - 3) + '...';
    }

    // Main App
    showMainApp() {
        this.updateFooter();
        document.getElementById('mainApp').classList.remove('hidden');
    }

    hideMainApp() {
        document.getElementById('mainApp').classList.add('hidden');
    }

    updateFooter() {
        document.getElementById('footerFavorites').textContent = this.t('favorites');
        document.getElementById('footerSettings').textContent = this.t('settings');
        document.getElementById('footerBack').textContent = this.t('back');
    }

    // Groups Rendering
    renderGroups() {
        const leftPanel = document.getElementById('leftPanel');
        leftPanel.innerHTML = '';

        // Add Favorites group first
        const favDiv = document.createElement('div');
        favDiv.className = 'group-item favorites';
        favDiv.textContent = this.t('myFavorites');
        favDiv.dataset.group = 'FAVORITES';
        leftPanel.appendChild(favDiv);

        // Add other groups
        this.appState.groups.forEach(group => {
            const div = document.createElement('div');
            div.className = 'group-item';
            div.textContent = group;
            div.dataset.group = group;
            leftPanel.appendChild(div);
        });

        // Select first group (Favorites)
        if (leftPanel.children.length > 0) {
            this.appState.currentGroup = 'FAVORITES';
            leftPanel.children[0].classList.add('selected', 'focused');
            this.renderChannels();
        }
    }

    // Channels Rendering
    renderChannels() {
        const rightPanel = document.getElementById('rightPanel');
        rightPanel.innerHTML = '';

        let channelsToDisplay = [];

        if (this.appState.currentGroup === 'FAVORITES') {
            channelsToDisplay = this.appState.channels.filter(ch =>
                this.appState.isFavorite(ch.id)
            );

            if (channelsToDisplay.length === 0) {
                const emptyDiv = document.createElement('div');
                emptyDiv.className = 'empty-state';
                emptyDiv.innerHTML = `
                    <div class="empty-icon">⭐</div>
                    <div>${this.t('noFavorites')}</div>
                `;
                rightPanel.appendChild(emptyDiv);
                return;
            }
        } else {
            channelsToDisplay = this.appState.channels.filter(ch =>
                ch.groupTitle === this.appState.currentGroup
            );
        }

        channelsToDisplay.forEach(channel => {
            const div = document.createElement('div');
            div.className = 'channel-item';
            div.dataset.channelId = channel.id;

            const favoriteIcon = this.appState.isFavorite(channel.id) ? '⭐' : '';

            div.innerHTML = `
                <div class="channel-number">${channel.number}</div>
                <div class="channel-info">
                    <div class="channel-name">${channel.name}</div>
                    <div class="channel-program">-</div>
                </div>
                <div class="channel-time">-</div>
                <div class="channel-favorite">${favoriteIcon}</div>
            `;

            rightPanel.appendChild(div);
        });

        // Focus first channel if switching panels
        if (this.appState.focusedPanel === 'right' && rightPanel.children.length > 0) {
            this.appState.focusedIndex = 0;
            rightPanel.children[0].classList.add('focused');
        }
    }

    // Toast Notifications
    showToast(message, duration = 3000) {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.classList.add('visible');

        setTimeout(() => {
            toast.classList.remove('visible');
        }, duration);
    }

    // Settings Modal
    showSettings() {
        const modal = document.getElementById('settingsModal');
        const settingsItems = document.getElementById('settingsItems');
        document.getElementById('settingsTitle').textContent = this.t('settingsTitle');

        settingsItems.innerHTML = `
            <div class="settings-item focused" data-action="language">${this.t('language')}</div>
            <div class="settings-item" data-action="list-management">${this.t('listManagement')}</div>
            <div class="settings-item" data-action="about">${this.t('about')}</div>
            <div class="settings-item" data-action="disclaimer">${this.t('legalDisclaimer')}</div>
        `;

        modal.classList.remove('hidden');
    }

    hideSettings() {
        document.getElementById('settingsModal').classList.add('hidden');
    }

    // Video Playback
    playChannel(channel) {
        this.appState.currentChannel = channel;
        this.appState.isPlaying = true;

        const videoPlayer = document.getElementById('videoPlayer');
        const videoElement = document.getElementById('videoElement');

        // Update overlay info
        document.getElementById('videoChannelName').textContent = channel.name;
        document.getElementById('videoProgramInfo').textContent = channel.groupTitle;

        const favoriteText = this.appState.isFavorite(channel.id)
            ? this.t('removeFromFavorites')
            : this.t('addToFavorites');
        document.getElementById('videoFavoriteHint').textContent = favoriteText;

        // Set video source
        videoElement.src = channel.streamUrl;

        // Show player
        this.hideMainApp();
        videoPlayer.classList.remove('hidden');

        // Show overlay briefly
        this.showVideoOverlay();

        // Auto-hide overlay after 5 seconds
        this.autoHideOverlay();
    }

    stopPlayback() {
        const videoPlayer = document.getElementById('videoPlayer');
        const videoElement = document.getElementById('videoElement');

        videoElement.pause();
        videoElement.src = '';

        videoPlayer.classList.add('hidden');
        this.appState.isPlaying = false;
        this.appState.currentChannel = null;

        this.showMainApp();
    }

    showVideoOverlay() {
        const overlay = document.getElementById('videoOverlay');
        overlay.classList.add('visible');
        this.appState.showOverlay = true;
    }

    hideVideoOverlay() {
        const overlay = document.getElementById('videoOverlay');
        overlay.classList.remove('visible');
        this.appState.showOverlay = false;
    }

    autoHideOverlay() {
        if (this.appState.overlayTimeout) {
            clearTimeout(this.appState.overlayTimeout);
        }

        this.appState.overlayTimeout = setTimeout(() => {
            if (this.appState.isPlaying) {
                this.hideVideoOverlay();
            }
        }, 5000);
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { UIController };
}
