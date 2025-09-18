# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SV Tools is a modular animation framework built with HTML5 Canvas, featuring a clean separation of concerns for maximum scalability and ease of development. The framework supports multiple animation types, export functionality, and can integrate with various animation libraries.

## Quick Start

### Development Workflow
```bash
# Open the main file for development
open index.html

# Or serve with a local server for ES6 modules
python -m http.server 8000
# Then navigate to http://localhost:8000
```

### Creating a New Animation
1. Create a new file in `js/animations/YourAnimation.js`
2. Extend the `BaseAnimation` class
3. Implement the required methods
4. Register it in `main.js`

Example:
```javascript
import { BaseAnimation } from './BaseAnimation.js';

export class MyAnimation extends BaseAnimation {
    constructor() {
        super('My Custom Animation');
    }
    
    renderFrame(ctx, width, height, time) {
        // Your animation logic here
    }
}
```

## Project Structure

### New Modular Architecture
```
sv_tools/
├── index.html                    # Main HTML file (modular structure)
├── css/
│   ├── main.css                  # Core UI styles and design system
│   └── animations.css            # Animation-specific styles
├── js/
│   ├── core/
│   │   ├── CanvasManager.js      # Canvas management and rendering
│   │   └── ExportManager.js      # Export functionality (PNG, MP4, sequences)
│   ├── animations/
│   │   ├── BaseAnimation.js      # Base class for all animations
│   │   └── SampleAnimation.js    # Example animation (rotating square & circle)
│   └── main.js                   # App initialization and animation registry
├── functionality/
│   └── CLAUDE.md                 # This guidance file
└── start_template.html           # Legacy template (for reference)
```

### Key Components

#### Core System
- **CanvasManager**: Handles canvas operations, background/foreground images, and animation coordination
- **ExportManager**: Manages all export functionality (PNG, MP4, PNG sequences)
- **BaseAnimation**: Abstract base class providing the animation interface
- **AnimationRegistry**: Manages available animations and provides switching capability

#### Animation System
- **Modular Design**: Each animation lives in its own file
- **Plugin Architecture**: Easy to add new animations without modifying core code
- **Parameter System**: Animations can expose custom controls
- **Export Compatible**: Animations work seamlessly with all export formats

## Development Guide

### Creating Animations

#### 1. Basic Animation Structure
```javascript
import { BaseAnimation } from './BaseAnimation.js';

export class YourAnimation extends BaseAnimation {
    constructor() {
        super('Your Animation Name');
        
        // Set default parameters
        this.setParameter('speed', 1.0);
        this.setParameter('color', '#ff0000');
    }

    renderFrame(ctx, width, height, time) {
        // Main animation logic
        // time: current time in seconds
        // Use this.getParameter() to access parameter values
        
        const speed = this.getParameter('speed', 1.0);
        const color = this.getParameter('color', '#ff0000');
        
        // Your drawing code here
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, 100, 100);
    }

    getControls() {
        return [
            ...super.getControls(), // Include base controls
            {
                type: 'range',
                key: 'speed',
                label: 'Speed',
                min: 0.1,
                max: 5.0,
                step: 0.1,
                value: this.getParameter('speed', 1.0),
                callback: (value) => this.setParameter('speed', parseFloat(value))
            }
        ];
    }
}
```

#### 2. Register Your Animation
In `js/main.js`, add your animation to the registry:
```javascript
import { YourAnimation } from './animations/YourAnimation.js';

// In the registerBuiltInAnimations() method:
this.register('your-anim', YourAnimation, 'Your Animation Display Name');
```

#### 3. Animation Control Types
Available control types for `getControls()`:
- **range**: Slider control
- **color**: Color picker
- **divider**: Section separator with label

### Framework Integration

#### Using External Libraries
The modular structure makes it easy to integrate animation libraries:

**Three.js Integration:**
```javascript
import * as THREE from 'https://unpkg.com/three@0.155.0/build/three.module.js';

export class ThreeJSAnimation extends BaseAnimation {
    constructor() {
        super('Three.js Animation');
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ canvas: null });
    }
    
    init() {
        // Initialize Three.js scene
    }
    
    renderFrame(ctx, width, height, time) {
        // Render Three.js scene to canvas
        this.renderer.render(this.scene, this.camera);
        // Copy WebGL canvas to 2D context if needed
    }
}
```

**GSAP Integration:**
```javascript
import { gsap } from 'https://unpkg.com/gsap@3.12.2/index.js';

export class GSAPAnimation extends BaseAnimation {
    constructor() {
        super('GSAP Timeline Animation');
        this.timeline = gsap.timeline({ repeat: -1 });
    }
    
    renderFrame(ctx, width, height, time) {
        // Use GSAP timeline with time-based seeking
        this.timeline.seek(time % this.timeline.duration());
        // Render based on animated values
    }
}
```

## Export System

### Export Formats
- **PNG**: Single frame image export
- **MP4**: Video export with browser-supported codecs
- **PNG Sequence**: Frame-by-frame export in ZIP archive

### Export Features
- **Alpha Channel Support**: PNG sequences preserve transparency
- **Custom Duration**: Set video/sequence length
- **Progress Indicators**: Real-time export progress
- **Cross-browser Compatibility**: Automatic codec detection

### Export Implementation
Export functionality is automatically handled by `ExportManager`. Animations only need to implement:
- `renderFrame(ctx, width, height, time)` for frame-specific rendering
- The export system handles timing, file creation, and downloads

## CSS Architecture

### Design System (main.css)
- **CSS Custom Properties**: Centralized theming system
- **Component-based**: Modular CSS structure
- **Dark Theme**: Professional dark UI
- **Responsive**: Adapts to different screen sizes

### Animation Styles (animations.css)
- **Performance Optimizations**: GPU acceleration settings
- **Loading States**: Animation loading indicators
- **Control Styling**: Animation-specific control styles
- **Framework Support**: Styles for different animation frameworks

## Best Practices

### Animation Development
1. **Extend BaseAnimation**: Always inherit from the base class
2. **Use Parameters**: Make animations configurable through parameters
3. **Time-based Animation**: Use the time parameter for smooth animations
4. **Export Compatibility**: Ensure `renderFrame()` works without side effects
5. **Performance**: Consider canvas size and complexity for 60fps performance

### Code Organization
1. **One Animation Per File**: Keep animations in separate files
2. **Descriptive Names**: Use clear, descriptive class and file names
3. **Documentation**: Add comments explaining complex animation logic
4. **Error Handling**: Handle edge cases gracefully

### Framework Integration
1. **Module Imports**: Use ES6 imports for external libraries
2. **CDN Links**: Use CDN links in HTML for large libraries
3. **Fallback Handling**: Provide fallbacks if libraries fail to load
4. **Performance**: Consider impact of large libraries on load time

## Common Patterns

### Parameter-driven Animation
```javascript
renderFrame(ctx, width, height, time) {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = this.getParameter('radius', 50);
    const speed = this.getParameter('speed', 1.0);
    
    const x = centerX + Math.cos(time * speed) * radius;
    const y = centerY + Math.sin(time * speed) * radius;
    
    ctx.fillStyle = this.getParameter('color', '#ff0000');
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2);
    ctx.fill();
}
```

### Multi-element Animation
```javascript
renderFrame(ctx, width, height, time) {
    const elements = this.getParameter('elementCount', 5);
    
    for (let i = 0; i < elements; i++) {
        const offset = (i / elements) * Math.PI * 2;
        const x = width/2 + Math.cos(time + offset) * 100;
        const y = height/2 + Math.sin(time + offset) * 100;
        
        ctx.fillStyle = `hsl(${(time * 50 + i * 60) % 360}, 70%, 50%)`;
        ctx.beginPath();
        ctx.arc(x, y, 15, 0, Math.PI * 2);
        ctx.fill();
    }
}
```

### Interactive Controls
```javascript
getControls() {
    return [
        {
            type: 'divider',
            label: 'Circle Properties'
        },
        {
            type: 'range',
            key: 'count',
            label: 'Circle Count',
            min: 1,
            max: 20,
            step: 1,
            value: this.getParameter('count', 5),
            callback: (value) => this.setParameter('count', parseInt(value))
        },
        {
            type: 'color',
            key: 'baseColor',
            label: 'Base Color',
            value: this.getParameter('baseColor', '#ff0000'),
            callback: (value) => this.setParameter('baseColor', value)
        }
    ];
}
```

## Migration from start_template.html

### Key Changes
1. **Modular Structure**: Code split into logical modules
2. **Animation System**: Pluggable animation architecture
3. **Clean Separation**: CSS, HTML, and JS in separate files
4. **ES6 Modules**: Modern JavaScript module system
5. **Extensible**: Easy to add new animations and features

### Breaking Changes
- No longer a single-file solution
- Requires module-compatible browser or local server
- Animation logic must be implemented as classes

### Benefits
- **Scalability**: Easy to add complex animations and frameworks
- **Maintainability**: Clear separation of concerns
- **Reusability**: Animation classes can be reused across projects
- **Collaboration**: Multiple developers can work on different animations
- **Testing**: Individual components can be tested in isolation

This modular architecture provides a solid foundation for creating professional animation tools with Canvas2D and any animation framework or library.