/* ========================================
   IPTV Directo - Component Loader
   ======================================== */

/**
 * Component Loader
 * Loads HTML components dynamically from the components/ folder
 */
class ComponentLoader {
    /**
     * Load a single component from file
     * @param {string} componentPath - Path to the component HTML file
     * @returns {Promise<string>} - HTML content of the component
     */
    async loadComponent(componentPath) {
        try {
            const response = await fetch(componentPath);
            if (!response.ok) {
                throw new Error(`Failed to load component: ${componentPath}`);
            }
            return await response.text();
        } catch (error) {
            console.error(`Error loading component ${componentPath}:`, error);
            return '';
        }
    }

    /**
     * Load multiple components and insert them into the DOM
     * @param {Array} components - Array of {path, targetId} objects
     */
    async loadComponents(components) {
        const promises = components.map(async ({ path, target }) => {
            const html = await this.loadComponent(path);
            if (html && target) {
                const container = document.querySelector(target);
                if (container) {
                    container.innerHTML += html;
                }
            } else if (html) {
                // If no target specified, append to body
                document.body.insertAdjacentHTML('beforeend', html);
            }
        });

        await Promise.all(promises);
    }

    /**
     * Load all application components
     */
    async loadAllComponents() {
        const components = [
            { path: 'components/loading-screen.html' },
            { path: 'components/disclaimer-screen.html' },
            { path: 'components/setup-screen.html' },
            { path: 'components/main-app.html' },
            { path: 'components/video-player.html' },
            { path: 'components/settings-modal.html' },
            { path: 'components/toast.html' }
        ];

        // Conditionally load debug panel if enabled in config
        if (typeof AppConfig !== 'undefined' && AppConfig.debug && AppConfig.debug.showPanel) {
            components.push({ path: 'components/debug-panel.html' });
        }

        await this.loadComponents(components);
    }
}

// Initialize and load components before app starts
const componentLoader = new ComponentLoader();

// Load components when DOM is ready, but before DOMContentLoaded handlers
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', async () => {
        await componentLoader.loadAllComponents();
        // Dispatch custom event to signal components are loaded
        document.dispatchEvent(new CustomEvent('componentsLoaded'));
    });
} else {
    // DOM already loaded, load components immediately
    componentLoader.loadAllComponents().then(() => {
        document.dispatchEvent(new CustomEvent('componentsLoaded'));
    });
}
