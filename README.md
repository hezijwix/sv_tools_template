# SV Tools - Canvas Animation Framework

A modular HTML5 Canvas animation framework designed for creating, customizing, and exporting professional animations. Features a clean architecture with support for multiple animation libraries and comprehensive export functionality.

## 🚀 Quick Start

### Option 1: Direct File Access
```bash
# Open the main application
open index.html
```

### Option 2: Local Server (Recommended)
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx http-server

# Using PHP
php -S localhost:8000
```

Then navigate to `http://localhost:8000`

## ✨ Features

- **🎨 Modular Animation System**: Plugin-based architecture for easy animation development
- **📤 Multiple Export Formats**: PNG, MP4 video, and PNG sequences with alpha support
- **🎛️ Interactive Controls**: Dynamic UI controls for real-time animation customization
- **🖼️ Background/Foreground Support**: Upload and layer images in your animations
- **📱 Responsive Design**: Professional dark UI that adapts to different screen sizes
- **🔧 Framework Integration**: Easy integration with Three.js, GSAP, P5.js, and other libraries
- **⚡ Performance Optimized**: 60fps animations with efficient rendering

## 📁 Project Structure

```
sv_tools/
├── README.md                     # This file
├── index.html                    # Main application (modular structure)
├── start_template.html           # Legacy single-file template
├── css/
│   ├── main.css                  # Core UI styles and design system
│   └── animations.css            # Animation-specific styles
├── styles/                       # New modular CSS architecture
│   ├── variables.css             # CSS custom properties
│   ├── base.css                  # Reset and base styles
│   ├── layout.css                # Layout components
│   ├── controls.css              # Form controls
│   ├── buttons.css               # Button styles
│   ├── modal.css                 # Modal dialogs
│   └── utils.css                 # Utility classes
├── js/
│   ├── core/
│   │   ├── CanvasManager.js      # Canvas management and rendering
│   │   └── ExportManager.js      # Export functionality
│   ├── animations/
│   │   ├── BaseAnimation.js      # Base class for all animations
│   │   └── SampleAnimation.js    # Example animation
│   └── main.js                   # App initialization
└── functionality/
    ├── CLAUDE.md                 # Development guidance
    └── design-system.md          # Design system documentation
```

## 🎯 Creating Your First Animation

### 1. Create Animation File
Create a new file in `js/animations/MyAnimation.js`:

```javascript
import { BaseAnimation } from './BaseAnimation.js';

export class MyAnimation extends BaseAnimation {
    constructor() {
        super('My Custom Animation');

        // Set default parameters
        this.setParameter('speed', 1.0);
        this.setParameter('color', '#ff6b6b');
        this.setParameter('size', 50);
    }

    renderFrame(ctx, width, height, time) {
        const centerX = width / 2;
        const centerY = height / 2;
        const speed = this.getParameter('speed', 1.0);
        const color = this.getParameter('color', '#ff6b6b');
        const size = this.getParameter('size', 50);

        // Animated circle
        const x = centerX + Math.cos(time * speed) * 100;
        const y = centerY + Math.sin(time * speed) * 100;

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
    }

    getControls() {
        return [
            {
                type: 'divider',
                label: 'Animation Settings'
            },
            {
                type: 'range',
                key: 'speed',
                label: 'Speed',
                min: 0.1,
                max: 5.0,
                step: 0.1,
                value: this.getParameter('speed', 1.0),
                callback: (value) => this.setParameter('speed', parseFloat(value))
            },
            {
                type: 'color',
                key: 'color',
                label: 'Color',
                value: this.getParameter('color', '#ff6b6b'),
                callback: (value) => this.setParameter('color', value)
            }
        ];
    }
}
```

### 2. Register Animation
In `js/main.js`, add your animation:

```javascript
import { MyAnimation } from './animations/MyAnimation.js';

// In the registerBuiltInAnimations() method:
this.register('my-anim', MyAnimation, 'My Custom Animation');
```

### 3. Run and Test
Open `index.html` and select your animation from the dropdown!

## 🔧 Framework Integration

### Three.js Integration
```javascript
import * as THREE from 'https://unpkg.com/three@0.155.0/build/three.module.js';

export class ThreeJSAnimation extends BaseAnimation {
    constructor() {
        super('Three.js Animation');
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({
            canvas: document.createElement('canvas'),
            preserveDrawingBuffer: true
        });
    }

    renderFrame(ctx, width, height, time) {
        this.renderer.setSize(width, height);
        this.renderer.render(this.scene, this.camera);

        // Copy WebGL canvas to 2D context
        ctx.drawImage(this.renderer.domElement, 0, 0);
    }
}
```

### GSAP Integration
```javascript
import { gsap } from 'https://unpkg.com/gsap@3.12.2/index.js';

export class GSAPAnimation extends BaseAnimation {
    constructor() {
        super('GSAP Timeline');
        this.timeline = gsap.timeline({ repeat: -1 });
        this.setupTimeline();
    }

    setupTimeline() {
        // Create GSAP timeline animations
        this.timeline.to({}, { duration: 2 });
    }

    renderFrame(ctx, width, height, time) {
        this.timeline.seek(time % this.timeline.duration());
        // Render based on animated values
    }
}
```

## 📤 Export Features

### Available Formats
- **PNG Image**: Single frame export
- **MP4 Video**: Browser-compatible video export
- **PNG Sequence**: Frame-by-frame ZIP archive with alpha transparency

### Export Settings
- **Duration**: 1-60 seconds for video/sequence exports
- **Frame Rate**: 60fps for smooth animation
- **Alpha Channel**: Preserved in PNG sequence exports
- **Progress Tracking**: Real-time export progress indicators

## 🎨 Design System

### CSS Architecture
The project uses a modular CSS architecture:

- **`variables.css`**: CSS custom properties and design tokens
- **`base.css`**: Reset styles and typography
- **`layout.css`**: Main layout components
- **`controls.css`**: Form elements and inputs
- **`buttons.css`**: Button styles and variants
- **`modal.css`**: Dialog and modal styles
- **`utils.css`**: Utility classes

### Dark Theme
Professional dark UI with:
- Consistent color palette
- Accessible contrast ratios
- Smooth hover and focus states
- Modern typography system

## 🛠️ Development Guide

### Control Types
Available control types for animation parameters:

```javascript
getControls() {
    return [
        {
            type: 'divider',
            label: 'Section Name'
        },
        {
            type: 'range',
            key: 'parameter',
            label: 'Parameter Name',
            min: 0,
            max: 100,
            step: 1,
            value: this.getParameter('parameter'),
            callback: (value) => this.setParameter('parameter', value)
        },
        {
            type: 'color',
            key: 'color',
            label: 'Color Picker',
            value: this.getParameter('color'),
            callback: (value) => this.setParameter('color', value)
        }
    ];
}
```

### Best Practices

1. **Extend BaseAnimation**: Always inherit from the base class
2. **Use Parameters**: Make animations configurable
3. **Time-based Animation**: Use the time parameter for consistency
4. **Export Compatibility**: Ensure renderFrame() works without side effects
5. **Performance**: Consider 60fps performance requirements

## 📚 File Overview

### Core Files
- **`index.html`**: Main application with modular architecture
- **`start_template.html`**: Legacy single-file template for reference

### JavaScript Modules
- **`CanvasManager.js`**: Canvas operations and image handling
- **`ExportManager.js`**: All export functionality
- **`BaseAnimation.js`**: Animation base class
- **`main.js`**: Application initialization

### Stylesheets
- **Modern**: Modular CSS in `styles/` directory
- **Legacy**: Consolidated styles in `css/` directory

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add your animation or improvement
4. Test with all export formats
5. Submit a pull request

## 📄 License

Open source - feel free to use and modify for your projects.

## 🎬 Examples

The framework includes sample animations demonstrating:
- Basic shapes and movement
- Color and parameter controls
- Time-based animation principles
- Export compatibility

Start with `SampleAnimation.js` to understand the basic structure, then create your own animations using the modular system.

---

**Made by STUDIO-VIDEO** - Professional animation tools for web development.