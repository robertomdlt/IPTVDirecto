/* ========================================
   IPTV Directo - Configuration
   ======================================== */

const AppConfig = {
    // Debug settings
    debug: {
        enabled: true,          // Enable/disable debug panel
        showPanel: true,        // Show debug panel in UI
        logClicks: true,        // Log all click events
        logKeyboard: true,      // Log keyboard events
        logNavigation: true,    // Log navigation changes
        maxLogs: 100           // Maximum number of logs to keep
    },

    // Application settings
    app: {
        version: '1.0.0',
        environment: 'development' // 'development' | 'production'
    }
};

// Freeze config to prevent accidental modifications
Object.freeze(AppConfig);
