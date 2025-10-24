# Component System Guide - IPTV Directo

## Overview

IPTV Directo uses a dynamic component loading system that separates HTML markup into individual, reusable component files. This guide explains how the system works and how to work with components.

## Component Structure

### File Organization

```
components/
├── loading-screen.html       # Loading spinner
├── disclaimer-screen.html    # Legal disclaimer
├── setup-screen.html        # First-time setup
├── main-app.html            # Main dual-panel interface
├── video-player.html        # Video playback screen
├── settings-modal.html      # Settings dialog
└── toast.html               # Toast notifications
```

### Component Format

Each component is a standalone HTML file containing a complete, self-contained UI element:

```html
<!-- Component File: components/example.html -->
<div id="exampleComponent" class="example-class">
    <h1>Example Component</h1>
    <p>Content goes here...</p>
</div>
```

**Key Principles:**
- Each component has a unique root ID
- Components contain only HTML markup
- No inline styles (use CSS files)
- No inline scripts (use JS modules)

## How Component Loading Works

### 1. Load Sequence

```
Browser loads index.html
  ↓
loader.js executes immediately
  ↓
ComponentLoader.loadAllComponents() runs
  ↓
fetch() requests each component file
  ↓
Components inserted into document.body
  ↓
'componentsLoaded' event dispatched
  ↓
main.js initializes application
```

### 2. The ComponentLoader Class

**Location**: `js/loader.js`

```javascript
class ComponentLoader {
    async loadComponent(path) {
        // Fetches a single component
        const response = await fetch(path);
        return await response.text();
    }

    async loadComponents(components) {
        // Loads multiple components in parallel
        const promises = components.map(async ({ path }) => {
            const html = await this.loadComponent(path);
            document.body.insertAdjacentHTML('beforeend', html);
        });
        await Promise.all(promises);
    }

    async loadAllComponents() {
        // Loads all registered components
        await this.loadComponents([
            { path: 'components/loading-screen.html' },
            { path: 'components/disclaimer-screen.html' },
            // ... etc
        ]);
    }
}
```

### 3. Event System

The component system uses a custom event to signal when loading is complete:

```javascript
// loader.js dispatches this event
document.dispatchEvent(new CustomEvent('componentsLoaded'));

// main.js listens for this event
document.addEventListener('componentsLoaded', function() {
    initializeApp(); // Start the application
});
```

## Working with Components

### Adding a New Component

**Step 1**: Create the HTML file

```bash
# Create file: components/my-new-component.html
```

```html
<!-- components/my-new-component.html -->
<div id="myNewComponent" class="my-component hidden">
    <h2>My New Component</h2>
    <p>Component content here</p>
    <button id="myComponentButton">Click Me</button>
</div>
```

**Step 2**: Add styles to CSS

```css
/* css/components.css or css/layout.css */
.my-component {
    background: var(--bg-surface);
    padding: 40px;
    border-radius: 12px;
}
```

**Step 3**: Register in loader.js

```javascript
// js/loader.js - Add to loadAllComponents()
async loadAllComponents() {
    const components = [
        { path: 'components/loading-screen.html' },
        { path: 'components/my-new-component.html' }, // Add here
        // ... rest of components
    ];
}
```

**Step 4**: Add logic in JavaScript

```javascript
// js/ui.js or create new module
showMyComponent() {
    document.getElementById('myNewComponent').classList.remove('hidden');
}

hideMyComponent() {
    document.getElementById('myNewComponent').classList.add('hidden');
}
```

**Step 5**: Wire up events

```javascript
// js/main.js - In setupEventListeners()
document.getElementById('myComponentButton').addEventListener('click', function() {
    // Handle button click
});
```

### Modifying Existing Components

**To modify a component:**

1. Locate the component file in `components/`
2. Edit the HTML markup
3. Refresh browser - changes are immediate
4. No need to touch `index.html`

**Example**: Changing button text in disclaimer

```html
<!-- components/disclaimer-screen.html -->
<!-- Before -->
<button class="btn btn-primary focused" id="btnAcceptDisclaimer">Aceptar</button>

<!-- After -->
<button class="btn btn-primary focused" id="btnAcceptDisclaimer">I Agree</button>
```

### Removing a Component

1. Delete the component file from `components/`
2. Remove from `loader.js` component list
3. Remove any related CSS
4. Remove any related JavaScript logic

## Component Best Practices

### 1. Keep Components Self-Contained

✅ **Good**: Component has all its markup
```html
<div id="userProfile" class="profile-card">
    <img class="profile-avatar" src="" id="profileAvatar">
    <h3 class="profile-name" id="profileName"></h3>
    <p class="profile-bio" id="profileBio"></p>
</div>
```

❌ **Bad**: Component relies on external structure
```html
<!-- Assumes parent div exists elsewhere -->
<img class="profile-avatar" src="">
<h3 class="profile-name"></h3>
```

### 2. Use Unique IDs

Each component should have unique IDs for JavaScript access:

✅ **Good**: Descriptive, unique IDs
```html
<div id="videoPlayer">
    <video id="videoElement"></video>
    <div id="videoOverlay"></div>
</div>
```

❌ **Bad**: Generic IDs that might conflict
```html
<div id="player">
    <video id="video"></video>
    <div id="overlay"></div>
</div>
```

### 3. Include All Required Elements

Make sure components include everything they need:

✅ **Good**: Complete component
```html
<div id="loginForm" class="form-container hidden">
    <h2 class="form-title">Login</h2>
    <input type="text" id="username" class="form-input">
    <input type="password" id="password" class="form-input">
    <button id="loginButton" class="btn btn-primary">Login</button>
    <p class="error-message hidden" id="loginError"></p>
</div>
```

❌ **Bad**: Missing error handling elements
```html
<div id="loginForm" class="form-container hidden">
    <input type="text" id="username">
    <button id="loginButton">Login</button>
    <!-- Where does error message go? -->
</div>
```

### 4. Use CSS Classes for Styling

Don't use inline styles - use CSS classes:

✅ **Good**: CSS classes
```html
<div class="modal-backdrop hidden">
    <div class="modal-content">
        <!-- content -->
    </div>
</div>
```

❌ **Bad**: Inline styles
```html
<div style="position: fixed; background: rgba(0,0,0,0.7)">
    <div style="width: 50%; padding: 40px;">
        <!-- content -->
    </div>
</div>
```

### 5. Initialize as Hidden

Most components should start hidden:

```html
<div id="settingsModal" class="modal-backdrop hidden">
    <!-- content -->
</div>
```

Then show/hide via JavaScript:
```javascript
// Show
document.getElementById('settingsModal').classList.remove('hidden');

// Hide
document.getElementById('settingsModal').classList.add('hidden');
```

## Debugging Components

### Check if Components Loaded

```javascript
// In browser console
document.querySelectorAll('[id]').forEach(el => {
    console.log('Found:', el.id);
});
```

### Monitor Load Events

```javascript
// In main.js or browser console
document.addEventListener('componentsLoaded', () => {
    console.log('✅ All components loaded');
});
```

### Verify Component Exists

```javascript
// Check if component was loaded
const component = document.getElementById('myComponent');
if (component) {
    console.log('✅ Component loaded');
} else {
    console.error('❌ Component not found - check loader.js');
}
```

## Advanced Usage

### Loading Components Conditionally

You can modify `loader.js` to load components conditionally:

```javascript
async loadAllComponents() {
    const components = [
        { path: 'components/loading-screen.html' },
        { path: 'components/main-app.html' }
    ];

    // Conditionally load based on settings
    if (appRequiresSetup) {
        components.push({ path: 'components/setup-screen.html' });
    }

    await this.loadComponents(components);
}
```

### Loading Components into Specific Containers

```javascript
async loadComponents(components) {
    const promises = components.map(async ({ path, target }) => {
        const html = await this.loadComponent(path);

        if (target) {
            // Load into specific container
            const container = document.querySelector(target);
            container.innerHTML = html;
        } else {
            // Load into body
            document.body.insertAdjacentHTML('beforeend', html);
        }
    });
}
```

### Component Templates

For repeated elements, consider using `<template>` tags:

```html
<!-- components/channel-template.html -->
<template id="channelItemTemplate">
    <div class="channel-item">
        <div class="channel-number"></div>
        <div class="channel-name"></div>
        <div class="channel-favorite"></div>
    </div>
</template>
```

Then clone in JavaScript:
```javascript
const template = document.getElementById('channelItemTemplate');
const clone = template.content.cloneNode(true);
// Modify clone and append to DOM
```

## Migration from Inline HTML

If you need to migrate existing inline HTML to components:

1. **Identify the section** in current HTML
2. **Copy the HTML block**
3. **Create new component file**
4. **Paste into component file**
5. **Remove from original file**
6. **Register in loader.js**
7. **Test functionality**

## Performance Considerations

### Parallel Loading

Components load in parallel using `Promise.all()`:

```javascript
await Promise.all(promises); // All fetch requests run simultaneously
```

### Caching

Browsers automatically cache component files:
- First visit: Fetches all components
- Subsequent visits: Uses cached versions
- Update component: Cache invalidated automatically

### Bundle Size

Current setup:
- 7 component files
- Average size: ~200-500 bytes each
- Total component HTML: ~2KB
- Negligible network impact

## Troubleshooting

### Components Not Showing

**Problem**: Component HTML exists but not visible

**Solutions**:
1. Check if component has `.hidden` class
2. Verify component is in `loader.js` list
3. Check browser console for fetch errors
4. Confirm `componentsLoaded` event fired

### JavaScript Errors

**Problem**: "Cannot read property of null"

**Solutions**:
1. Ensure components loaded before accessing DOM
2. Use `componentsLoaded` event listener
3. Check element IDs match between HTML and JS

### Styling Not Applied

**Problem**: Component shows but styling missing

**Solutions**:
1. Verify CSS file is linked in `index.html`
2. Check CSS class names match HTML
3. Inspect element to see if styles apply
4. Clear browser cache

---

**Version**: 2.0 (Component-Based)
**Last Updated**: 2025-10-24
**Maintained By**: Roberto M.
