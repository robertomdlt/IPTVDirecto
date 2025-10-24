# Debug System Guide - IPTV Directo

## Overview

El sistema de debug de IPTV Directo proporciona un panel flotante que registra todos los eventos de la aplicación en tiempo real, facilitando el desarrollo y las pruebas.

## Activación del Panel de Debug

### Configuración

El panel de debug se controla mediante el archivo `config.js` en la raíz del proyecto:

```javascript
const AppConfig = {
    debug: {
        enabled: true,          // Activar/desactivar sistema de debug
        showPanel: true,        // Mostrar panel flotante en la UI
        logClicks: true,        // Registrar eventos de click
        logKeyboard: true,      // Registrar eventos de teclado
        logNavigation: true,    // Registrar eventos de navegación
        maxLogs: 100           // Máximo número de logs a mantener
    }
};
```

### Activar/Desactivar

**Para activar el debug:**
```javascript
// config.js
debug: {
    enabled: true,
    showPanel: true
}
```

**Para desactivar el debug:**
```javascript
// config.js
debug: {
    enabled: false,
    showPanel: false
}
```

## Interfaz del Panel

### Ubicación
- **Posición**: Esquina superior derecha
- **Tamaño**: 400px ancho × hasta 600px alto
- **Z-index**: 99999 (siempre visible encima de otros elementos)

### Controles

**Botón "Clear"**: Limpia todos los logs del panel
**Botón "−" / "+"**: Minimiza/maximiza el panel
- Minimizado: Solo muestra el header
- Maximizado: Muestra todos los logs

### Tipos de Logs

El panel muestra diferentes tipos de eventos con códigos de color:

| Tipo | Color | Descripción |
|------|-------|-------------|
| 🔵 Click | Azul | Eventos de click en elementos |
| 🟡 Key | Amarillo | Eventos de teclado |
| 🟣 Nav | Púrpura | Eventos de navegación |
| 🟢 Info | Verde | Información general |
| 🔴 Error | Rojo | Errores |

## Logs Capturados

### 1. Eventos de Click

Registra todos los clicks en la aplicación:

```
[00:01:23] Click: <button#btnAcceptDisclaimer.btn> "Aceptar"
[00:01:45] Click: <div.group-item> "⭐ MIS FAVORITOS"
```

**Información capturada:**
- Elemento HTML (`<button>`, `<div>`, etc.)
- ID del elemento (`#btnAcceptDisclaimer`)
- Clase CSS (`.btn`)
- Texto visible (primeros 30 caracteres)

### 2. Eventos de Teclado

Registra todas las teclas presionadas:

```
[00:02:10] Key: ArrowDown (40)
[00:02:11] Key: Enter (13)
[00:02:15] Key: Backspace (8)
```

**Información capturada:**
- Nombre de la tecla (`ArrowDown`, `Enter`, etc.)
- Código de tecla (keyCode: 40, 13, etc.)

### 3. Eventos de Navegación

Registra los movimientos de navegación:

```
[00:03:05] Navigation: Move Focus Down
[00:03:08] Navigation: Move Focus Right (Left → Right Panel)
[00:03:12] Navigation: Move Focus Up
```

**Eventos capturados:**
- Movimiento arriba/abajo dentro de paneles
- Cambio entre paneles (izquierda ↔ derecha)
- Selección de elementos
- Toggle de favoritos

## Uso Avanzado

### Acceso Programático

El logger está disponible globalmente como `window.debugLogger`:

```javascript
// Agregar log personalizado desde console
window.debugLogger.log('Mi mensaje custom', 'info');

// Tipos disponibles: 'click', 'key', 'nav', 'info', 'error'
window.debugLogger.log('Error encontrado', 'error');

// Exportar logs como JSON
const logsJSON = window.debugLogger.exportLogs();
console.log(logsJSON);
```

### Logs Personalizados en el Código

Puedes agregar logs personalizados en cualquier módulo:

```javascript
// En cualquier archivo .js
if (window.debugLogger) {
    window.debugLogger.log('Canal cargado: ' + channel.name, 'info');
}
```

### Ejemplo: Loggear Playlist Loading

```javascript
// En parser.js
async fetchPlaylist(url) {
    if (window.debugLogger) {
        window.debugLogger.log(`Fetching playlist: ${url}`, 'info');
    }

    try {
        const response = await fetch(url);

        if (window.debugLogger) {
            window.debugLogger.log(`Playlist loaded successfully`, 'info');
        }

        return await response.text();
    } catch (error) {
        if (window.debugLogger) {
            window.debugLogger.log(`Error loading playlist: ${error.message}`, 'error');
        }
        throw error;
    }
}
```

## Formato de Timestamp

Los timestamps muestran el tiempo transcurrido desde que se cargó la aplicación:

```
Format: HH:MM:SS
Example: 00:15:42 = 15 minutos y 42 segundos desde el inicio
```

## Limitación de Logs

Para evitar problemas de memoria, el panel mantiene solo los últimos N logs (configurado en `maxLogs`):

```javascript
maxLogs: 100  // Mantiene solo los últimos 100 logs
```

Cuando se alcanza el límite, los logs más antiguos se eliminan automáticamente.

## Rendimiento

### Impacto Mínimo

El sistema de debug está optimizado para tener mínimo impacto:

- **Event listeners**: Usa `capture: true` para capturar eventos eficientemente
- **Auto-scroll**: Solo cuando se agregan nuevos logs
- **Limitación**: Máximo de logs configurable

### Desactivar en Producción

**Importante**: Siempre desactiva el debug en producción:

```javascript
// config.js - Para producción
const AppConfig = {
    debug: {
        enabled: false,
        showPanel: false
    },
    app: {
        environment: 'production'
    }
};
```

## Estilos Personalizados

El panel usa las siguientes variables CSS que puedes personalizar:

```css
/* css/components.css */
.debug-panel {
    width: 400px;           /* Ancho del panel */
    max-height: 600px;      /* Altura máxima */
    top: 20px;              /* Posición vertical */
    right: 20px;            /* Posición horizontal */
}
```

## Solución de Problemas

### Panel no aparece

**Verificar:**
1. `config.js` tiene `enabled: true` y `showPanel: true`
2. `config.js` se carga ANTES de `loader.js` en `index.html`
3. El componente `debug-panel.html` existe en `components/`
4. No hay errores en la consola del navegador

### Los logs no se muestran

**Verificar:**
1. Los tipos de logs están habilitados en config:
   - `logClicks: true`
   - `logKeyboard: true`
   - `logNavigation: true`
2. El panel no está minimizado (botón muestra "−")
3. `window.debugLogger` existe (verificar en console)

### Panel interfiere con la UI

**Soluciones:**
1. Minimizar el panel con el botón "−"
2. Mover el panel modificando `top` y `right` en CSS
3. Reducir `width` y `max-height` en CSS
4. Desactivar temporalmente con `showPanel: false`

## Exportar Logs para Reportes

```javascript
// En la consola del navegador
const logs = window.debugLogger.exportLogs();

// Copiar al portapapeles
copy(logs);

// O descargar como archivo
const blob = new Blob([logs], { type: 'application/json' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'debug-logs.json';
a.click();
```

## Integración con Herramientas Externas

### Chrome DevTools

Los logs también se imprimen en la consola:

```javascript
console.log(`[00:01:23] Click: <button#btnAcceptDisclaimer> "Aceptar"`);
```

Puedes filtrar en Chrome DevTools usando:
- Filtro por texto: "Navigation", "Click", "Key"
- Nivel de log: Info, Error

### Debugging Remoto en webOS

Para debugging en TV LG real:

```bash
# Habilitar debugging
ares-inspect --device tv --app iptv.directo.app

# El panel de debug será visible en la TV
# Los logs también aparecen en Chrome DevTools conectado
```

## Mejores Prácticas

### 1. Usar para Desarrollo Solamente

```javascript
if (AppConfig.debug.enabled) {
    // Código de debug aquí
}
```

### 2. Logs Descriptivos

✅ **Bueno**: `"Navigation: Move Focus Right (Left → Right Panel)"`
❌ **Malo**: `"Move"`

### 3. No Loggear Datos Sensibles

```javascript
// ❌ Malo - No loggear URLs completas con tokens
window.debugLogger.log(`Fetching: ${urlWithToken}`, 'info');

// ✅ Bueno - Loggear solo información necesaria
window.debugLogger.log('Fetching playlist', 'info');
```

### 4. Limpiar Logs Regularmente

Durante desarrollo largo, limpia los logs con el botón "Clear" para mantener el panel legible.

---

**Version**: 1.0
**Last Updated**: 2025-10-24
**Maintained By**: Roberto M.
