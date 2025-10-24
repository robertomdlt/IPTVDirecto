/* ========================================
   IPTV Directo - Debug Logger
   ======================================== */

class DebugLogger {
    constructor() {
        this.logs = [];
        this.maxLogs = AppConfig.debug.maxLogs || 100;
        this.panel = null;
        this.content = null;
        this.isMinimized = false;
        this.startTime = Date.now();
    }

    /**
     * Initialize debug panel and event listeners
     */
    init() {
        // Wait for components to be loaded
        document.addEventListener('componentsLoaded', () => {
            this.panel = document.getElementById('debugPanel');
            this.content = document.getElementById('debugContent');

            if (!this.panel || !this.content) {
                console.warn('Debug panel not found in DOM');
                return;
            }

            this.setupEventListeners();
            this.log('Debug system initialized', 'info');
        });
    }

    /**
     * Setup all event listeners for debugging
     */
    setupEventListeners() {
        // Clear button
        const clearBtn = document.getElementById('debugClearBtn');
        if (clearBtn) {
            clearBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.clearLogs();
            });
        }

        // Toggle minimize button
        const toggleBtn = document.getElementById('debugToggleBtn');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleMinimize();
            });
        }

        // Capture all clicks
        if (AppConfig.debug.logClicks) {
            document.addEventListener('click', (e) => {
                this.logClick(e);
            }, true); // Use capture phase to get all clicks
        }

        // Capture keyboard events
        if (AppConfig.debug.logKeyboard) {
            document.addEventListener('keydown', (e) => {
                this.logKeyboard(e);
            }, true);
        }
    }

    /**
     * Log a click event
     */
    logClick(event) {
        const target = event.target;
        const tagName = target.tagName.toLowerCase();
        const id = target.id ? `#${target.id}` : '';
        const className = target.className ? `.${target.className.split(' ')[0]}` : '';
        const text = target.textContent ? target.textContent.substring(0, 30) : '';

        const message = `Click: <${tagName}${id}${className}> "${text}"`;
        this.log(message, 'click');
    }

    /**
     * Log a keyboard event
     */
    logKeyboard(event) {
        const key = event.key;
        const code = event.keyCode;
        const message = `Key: ${key} (${code})`;
        this.log(message, 'key');
    }

    /**
     * Log navigation event
     */
    logNavigation(message) {
        if (AppConfig.debug.logNavigation) {
            this.log(message, 'nav');
        }
    }

    /**
     * Log general message
     */
    log(message, type = 'info') {
        const timestamp = this.getTimestamp();
        const logEntry = {
            timestamp,
            message,
            type
        };

        // Add to logs array
        this.logs.push(logEntry);

        // Trim logs if exceeds max
        if (this.logs.length > this.maxLogs) {
            this.logs.shift();
        }

        // Update UI
        this.addLogToUI(logEntry);

        // Also log to console
        console.log(`[${timestamp}] ${message}`);
    }

    /**
     * Add log entry to UI
     */
    addLogToUI(logEntry) {
        if (!this.content) return;

        const logItem = document.createElement('div');
        logItem.className = `debug-log-item debug-${logEntry.type}`;

        const timestampSpan = document.createElement('span');
        timestampSpan.className = 'debug-timestamp';
        timestampSpan.textContent = logEntry.timestamp;

        const messageSpan = document.createElement('span');
        messageSpan.className = 'debug-message';
        messageSpan.textContent = logEntry.message;

        logItem.appendChild(timestampSpan);
        logItem.appendChild(messageSpan);

        this.content.appendChild(logItem);

        // Auto-scroll to bottom
        this.content.scrollTop = this.content.scrollHeight;
    }

    /**
     * Get formatted timestamp
     */
    getTimestamp() {
        const elapsed = Date.now() - this.startTime;
        const seconds = Math.floor(elapsed / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);

        const s = (seconds % 60).toString().padStart(2, '0');
        const m = (minutes % 60).toString().padStart(2, '0');
        const h = hours.toString().padStart(2, '0');

        return `${h}:${m}:${s}`;
    }

    /**
     * Clear all logs
     */
    clearLogs() {
        this.logs = [];
        if (this.content) {
            this.content.innerHTML = '';
        }
        this.log('Logs cleared', 'info');
    }

    /**
     * Toggle minimize/maximize panel
     */
    toggleMinimize() {
        this.isMinimized = !this.isMinimized;
        const toggleBtn = document.getElementById('debugToggleBtn');

        if (this.isMinimized) {
            this.panel.classList.add('minimized');
            if (toggleBtn) toggleBtn.textContent = '+';
        } else {
            this.panel.classList.remove('minimized');
            if (toggleBtn) toggleBtn.textContent = '−';
        }
    }

    /**
     * Export logs as JSON
     */
    exportLogs() {
        return JSON.stringify(this.logs, null, 2);
    }
}

// Initialize debug logger if enabled
let debugLogger = null;

if (AppConfig.debug.enabled && AppConfig.debug.showPanel) {
    debugLogger = new DebugLogger();
    debugLogger.init();
}

// Export for global access
window.debugLogger = debugLogger;
