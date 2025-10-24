/* ========================================
   IPTV Directo - M3U Playlist Parser
   ======================================== */

class M3UParser {
    /**
     * Fetch M3U playlist from URL
     * @param {string} url - URL of the M3U playlist
     * @returns {Promise<string>} - Plain text M3U content
     */
    async fetchPlaylist(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch playlist');
            }
            const text = await response.text();
            return text;
        } catch (error) {
            console.error('Error fetching playlist:', error);
            throw error;
        }
    }

    /**
     * Parse M3U format text into channel objects
     * @param {string} m3uText - M3U playlist content
     * @returns {Array} - Array of channel objects
     */
    parseM3U(m3uText) {
        const lines = m3uText.split('\n');
        const channels = [];
        let currentChannel = null;
        let channelNumber = 1;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();

            if (line.startsWith('#EXTINF:')) {
                // Parse channel info line
                currentChannel = this.parseExtInf(line, channelNumber);
                channelNumber++;
            } else if (line && !line.startsWith('#')) {
                // This is the stream URL
                if (currentChannel) {
                    currentChannel.streamUrl = line;
                    currentChannel.id = this.generateId();
                    channels.push(currentChannel);
                    currentChannel = null;
                }
            }
        }

        return channels;
    }

    /**
     * Parse EXTINF line to extract channel metadata
     * @param {string} line - EXTINF line from M3U
     * @param {number} number - Channel number
     * @returns {Object} - Channel object with metadata
     */
    parseExtInf(line, number) {
        const channel = {
            number: number,
            name: '',
            groupTitle: 'Sin Categoría',
            logo: '',
            streamUrl: ''
        };

        // Extract group-title attribute
        const groupMatch = line.match(/group-title="([^"]*)"/);
        if (groupMatch) {
            channel.groupTitle = groupMatch[1];
        }

        // Extract tvg-logo attribute
        const logoMatch = line.match(/tvg-logo="([^"]*)"/);
        if (logoMatch) {
            channel.logo = logoMatch[1];
        }

        // Extract tvg-id attribute (for EPG)
        const idMatch = line.match(/tvg-id="([^"]*)"/);
        if (idMatch) {
            channel.tvgId = idMatch[1];
        }

        // Extract channel name (text after last comma)
        const nameMatch = line.split(',');
        if (nameMatch.length > 1) {
            channel.name = nameMatch[nameMatch.length - 1].trim();
        }

        return channel;
    }

    /**
     * Generate unique ID for channels
     * @returns {string} - UUID v4 format string
     */
    generateId() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { M3UParser };
}
