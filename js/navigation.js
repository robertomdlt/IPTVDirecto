/* ========================================
   IPTV Directo - Navigation Controller
   ======================================== */

class NavigationController {
    constructor(appState, ui) {
        this.appState = appState;
        this.ui = ui;
    }

    /**
     * Move focus up within current panel
     */
    moveFocusUp() {
        if (!this.appState.isPlaying) {
            const panel = this.appState.focusedPanel === 'left'
                ? document.getElementById('leftPanel')
                : document.getElementById('rightPanel');

            const items = Array.from(panel.children).filter(el =>
                el.classList.contains('group-item') || el.classList.contains('channel-item')
            );

            if (items.length > 0) {
                items[this.appState.focusedIndex].classList.remove('focused');
                this.appState.focusedIndex = (this.appState.focusedIndex - 1 + items.length) % items.length;
                items[this.appState.focusedIndex].classList.add('focused');
                items[this.appState.focusedIndex].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            }
        }
    }

    /**
     * Move focus down within current panel
     */
    moveFocusDown() {
        if (!this.appState.isPlaying) {
            const panel = this.appState.focusedPanel === 'left'
                ? document.getElementById('leftPanel')
                : document.getElementById('rightPanel');

            const items = Array.from(panel.children).filter(el =>
                el.classList.contains('group-item') || el.classList.contains('channel-item')
            );

            if (items.length > 0) {
                items[this.appState.focusedIndex].classList.remove('focused');
                this.appState.focusedIndex = (this.appState.focusedIndex + 1) % items.length;
                items[this.appState.focusedIndex].classList.add('focused');
                items[this.appState.focusedIndex].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            }
        }
    }

    /**
     * Move focus from right panel to left panel
     */
    moveFocusLeft() {
        if (!this.appState.isPlaying && this.appState.focusedPanel === 'right') {
            const rightPanel = document.getElementById('rightPanel');
            const leftPanel = document.getElementById('leftPanel');

            const rightItems = Array.from(rightPanel.children);
            if (rightItems[this.appState.focusedIndex]) {
                rightItems[this.appState.focusedIndex].classList.remove('focused');
            }

            this.appState.focusedPanel = 'left';
            this.appState.focusedIndex = 0;

            const leftItems = Array.from(leftPanel.children);
            if (leftItems[0]) {
                leftItems[0].classList.add('focused');
            }
        }
    }

    /**
     * Move focus from left panel to right panel
     */
    moveFocusRight() {
        if (!this.appState.isPlaying && this.appState.focusedPanel === 'left') {
            const leftPanel = document.getElementById('leftPanel');
            const rightPanel = document.getElementById('rightPanel');

            const leftItems = Array.from(leftPanel.children);
            if (leftItems[this.appState.focusedIndex]) {
                leftItems[this.appState.focusedIndex].classList.remove('focused');
            }

            this.appState.focusedPanel = 'right';
            this.appState.focusedIndex = 0;

            const rightItems = Array.from(rightPanel.children);
            if (rightItems[0]) {
                rightItems[0].classList.add('focused');
            }
        }
    }

    /**
     * Select currently focused item (group or channel)
     */
    selectCurrent() {
        if (this.appState.isPlaying) {
            return; // In playback mode, OK doesn't do anything
        }

        if (this.appState.focusedPanel === 'left') {
            // Select group
            const leftPanel = document.getElementById('leftPanel');
            const items = Array.from(leftPanel.children);
            const selectedGroup = items[this.appState.focusedIndex];

            if (selectedGroup) {
                // Remove selected class from all groups
                items.forEach(item => item.classList.remove('selected'));
                selectedGroup.classList.add('selected');

                this.appState.currentGroup = selectedGroup.dataset.group;
                this.ui.renderChannels();
            }
        } else if (this.appState.focusedPanel === 'right') {
            // Play channel
            const rightPanel = document.getElementById('rightPanel');
            const items = Array.from(rightPanel.children);
            const selectedChannel = items[this.appState.focusedIndex];

            if (selectedChannel && selectedChannel.dataset.channelId) {
                const channel = this.appState.channels.find(ch => ch.id === selectedChannel.dataset.channelId);
                if (channel) {
                    this.ui.playChannel(channel);
                }
            }
        }
    }

    /**
     * Toggle favorite status for current channel
     */
    toggleFavorite() {
        if (this.appState.isPlaying && this.appState.currentChannel) {
            // Toggle favorite for current playing channel
            const added = this.appState.toggleFavorite(this.appState.currentChannel.id);
            const message = added ? this.ui.t('addedToFavorites') : this.ui.t('removedFromFavorites');
            this.ui.showToast(message);

            // Update overlay text
            const favoriteText = this.appState.isFavorite(this.appState.currentChannel.id)
                ? this.ui.t('removeFromFavorites')
                : this.ui.t('addToFavorites');
            document.getElementById('videoFavoriteHint').textContent = favoriteText;
        } else if (!this.appState.isPlaying && this.appState.focusedPanel === 'right') {
            // Toggle favorite for focused channel
            const rightPanel = document.getElementById('rightPanel');
            const items = Array.from(rightPanel.children);
            const selectedChannel = items[this.appState.focusedIndex];

            if (selectedChannel && selectedChannel.dataset.channelId) {
                const channel = this.appState.channels.find(ch => ch.id === selectedChannel.dataset.channelId);
                if (channel) {
                    const added = this.appState.toggleFavorite(channel.id);
                    const message = added ? this.ui.t('addedToFavorites') : this.ui.t('removedFromFavorites');
                    this.ui.showToast(message);

                    // Update UI
                    this.ui.renderChannels();
                }
            }
        }
    }

    /**
     * Handle back button press
     */
    handleBack() {
        if (this.appState.isPlaying) {
            this.ui.stopPlayback();
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { NavigationController };
}
