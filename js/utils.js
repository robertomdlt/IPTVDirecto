/* ========================================
   IPTV Directo - Utilities & Translations
   ======================================== */

// Translation strings for multi-language support
const translations = {
    es: {
        // Disclaimer
        disclaimerTitle: 'Aviso Legal',
        disclaimerText: 'Esta aplicación no proporciona ni respalda ninguna lista IPTV. Los usuarios son responsables de la legalidad de sus fuentes de contenido. Los desarrolladores no asumen ninguna responsabilidad por el contenido proporcionado por el usuario.\n\nAl continuar, acepta estos términos.',
        accept: 'Aceptar',
        exit: 'Salir',

        // Setup
        setupTitle: 'Agregar tu Lista IPTV',
        labelUrl: 'URL de la Lista M3U',
        labelName: 'Nombre de la Lista (opcional)',
        urlPlaceholder: 'http://ejemplo.com/playlist.m3u',
        namePlaceholder: 'Mi Lista',
        save: 'Guardar',
        cancel: 'Cancelar',

        // Loading
        loading: 'Cargando...',
        loadingChannels: 'Cargando canales...',

        // Footer
        favorites: 'Favoritos',
        settings: 'Ajustes',
        back: 'Volver',

        // Settings
        settingsTitle: 'Ajustes',
        language: 'Idioma / Language',
        listManagement: 'Gestión de Listas',
        about: 'Acerca de',
        legalDisclaimer: 'Aviso Legal',

        // Favorites
        myFavorites: '⭐ MIS FAVORITOS',
        addedToFavorites: 'Agregado a Favoritos',
        removedFromFavorites: 'Eliminado de Favoritos',
        addToFavorites: '🟡 Agregar a Favoritos',
        removeFromFavorites: '🟡 Quitar de Favoritos',

        // Errors
        errorLoadingPlaylist: 'Error al cargar la lista',
        invalidUrl: 'URL inválida',
        channelNotAvailable: 'Canal no disponible',

        // Empty states
        noChannels: 'No hay canales',
        noFavorites: 'No hay favoritos',
        selectGroup: 'Selecciona un grupo'
    },
    en: {
        // Disclaimer
        disclaimerTitle: 'Legal Disclaimer',
        disclaimerText: 'This application does not provide or endorse any IPTV lists. Users are responsible for the legality of their content sources. The developers assume no liability for user-provided content.\n\nBy continuing, you accept these terms.',
        accept: 'Accept',
        exit: 'Exit',

        // Setup
        setupTitle: 'Add Your IPTV List',
        labelUrl: 'M3U Playlist URL',
        labelName: 'List Name (optional)',
        urlPlaceholder: 'http://example.com/playlist.m3u',
        namePlaceholder: 'My List',
        save: 'Save',
        cancel: 'Cancel',

        // Loading
        loading: 'Loading...',
        loadingChannels: 'Loading channels...',

        // Footer
        favorites: 'Favorites',
        settings: 'Settings',
        back: 'Back',

        // Settings
        settingsTitle: 'Settings',
        language: 'Language / Idioma',
        listManagement: 'List Management',
        about: 'About',
        legalDisclaimer: 'Legal Disclaimer',

        // Favorites
        myFavorites: '⭐ MY FAVORITES',
        addedToFavorites: 'Added to Favorites',
        removedFromFavorites: 'Removed from Favorites',
        addToFavorites: '🟡 Add to Favorites',
        removeFromFavorites: '🟡 Remove from Favorites',

        // Errors
        errorLoadingPlaylist: 'Error loading playlist',
        invalidUrl: 'Invalid URL',
        channelNotAvailable: 'Channel not available',

        // Empty states
        noChannels: 'No channels',
        noFavorites: 'No favorites',
        selectGroup: 'Select a group'
    }
};

// Export translations for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { translations };
}
