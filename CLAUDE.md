# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Starting a New Animation Tool
```bash
# Copy the clean template as your starting point
cp clean-template.html my-new-tool.html

# Open in browser for development
open my-new-tool.html
```

### Development Workflow
- **No build system required** - Pure HTML/JS/CSS that runs directly in browser
- **Live development** - Edit HTML file and refresh browser to see changes
- **Framework switching** - Change CDN imports and adapter implementation as needed

### Testing
- Open HTML file in browser
- Use browser dev tools for debugging
- Test export functionality with PNG, MP4, and sequence exports

## Project Architecture

### Overview
SV Tools is a comprehensive template system for creating professional animation and generative art tools. It provides a complete UI framework with canvas management, export capabilities, and support for multiple rendering frameworks.

### Core Design Patterns

#### 1. Template-Based Approach
- **`clean-template.html`** - Primary starting point for new tools (single file)
- **`boilerplate/`** - Modular architecture for complex tools requiring configuration
- **Professional UI** - Complete interface with controls, modals, and export functionality

#### 2. Framework-Agnostic Architecture
- **Adapter Pattern** - Unified interface for P5.js, Three.js, WebGL, Canvas2D
- **Rendering Abstraction** - Framework-specific code isolated in adapters
- **Easy Migration** - Switch frameworks by changing adapters and CDN imports

#### 3. Modular Component System
- **AnimationTool** - Main orchestrator with lifecycle management
- **CanvasManager** - Framework-agnostic canvas handling  
- **UIController** - Control panel state management
- **ExportManager** - Multi-format export functionality

### Directory Structure

```
sv_tools/
├── clean-template.html          # PRIMARY: Single-file starting template
├── boilerplate/                 # Modular architecture for complex tools
│   ├── index.html              # Complete UI structure
│   ├── js/                     # Core framework classes
│   │   ├── AnimationTool.js    # Main tool orchestrator
│   │   ├── CanvasManager.js    # Canvas abstraction layer
│   │   ├── UIController.js     # Control panel management
│   │   ├── ExportManager.js    # Export functionality
│   │   └── adapters/           # Framework adapters
│   ├── css/                    # Complete design system
│   └── config/                 # Configuration files
├── examples/                   # Working demonstrations
│   ├── particle-system/        # P5.js particle physics
│   └── 3d-visualization/       # Three.js 3D scene
├── templates/                  # Additional template variations
└── docs/                      # Architecture documentation
```

### Key Files
- **ARCHITECTURE.md** - Technical architecture and design patterns
- **FRAMEWORK_ADAPTERS.md** - Canvas framework integration guide
- **TEMPLATE_GUIDE.md** - Step-by-step usage instructions
- **START_HERE.md** - Project overview and quick start

## Implementation Approach

### For Most New Tools: Use clean-template.html
```javascript
// The clean template provides a complete CleanCanvasTool class
// Customize the render() method for your specific animation:

render(p5) {
    // Set background
    if (this.alphaBackground) {
        p5.clear();
    } else {
        p5.background(this.backgroundColor);
    }
    
    // YOUR CUSTOM ANIMATION CODE HERE
    // Example: animated circle
    const time = p5.millis() * 0.001;
    p5.fill(255);
    p5.circle(
        this.frameWidth / 2 + Math.cos(time) * 100,
        this.frameHeight / 2 + Math.sin(time) * 100,
        50
    );
}
```

### Adding Custom Controls
Extend the side panel HTML and add corresponding event listeners:

```html
<!-- Add to side panel -->
<div class="slider-control-row">
    <label for="speedSlider">Animation Speed:</label>
    <input type="range" id="speedSlider" min="0.1" max="3.0" step="0.1" value="1.0" class="control-slider">
    <span id="speedValue">1.0x</span>
</div>
```

```javascript
// Add to setupEventListeners()
document.getElementById('speedSlider').addEventListener('input', (e) => {
    this.animationSpeed = parseFloat(e.target.value);
    document.getElementById('speedValue').textContent = this.animationSpeed + 'x';
});
```

### Framework Support

#### Currently Integrated
- **P5.js** - Creative coding, particle systems, typography animation
- **Three.js** - 3D graphics, complex scenes, lighting systems  
- **WebGL** - High-performance custom graphics, shaders
- **Canvas2D** - Simple 2D graphics, lightweight animations

#### Switching Frameworks
```html
<!-- Change CDN import -->
<!-- P5.js -->
<script src="https://cdn.jsdelivr.net/npm/p5@1.11.8/lib/p5.min.js"></script>

<!-- Three.js -->
<script src="https://cdn.jsdelivr.net/npm/three@0.158.0/build/three.min.js"></script>
```

Modify the adapter implementation in your tool class - see FRAMEWORK_ADAPTERS.md for complete examples.

### Export Functionality

#### Built-in Export Types
- **PNG** - Single frame image export (ready to use)
- **MP4** - Video export for animations (implementation needed)
- **PNG Sequence** - Frame sequence in ZIP (implementation needed)

#### Export Integration
The clean template provides export UI and basic PNG functionality. For video export, implement frame capture and video encoding using the provided ExportManager pattern.

## Architecture Options

### Simple Tools (Recommended)
Use `clean-template.html` directly:
- Single HTML file with everything needed
- Complete UI and export functionality  
- Easy to customize and deploy
- Perfect for most animation tools

### Complex Tools
Use `boilerplate/` modular architecture:
- Separate configuration files
- Modular component architecture
- Multiple framework adapters
- Suitable for large, configurable tools

### Learning Examples
Reference `examples/` for working implementations:
- **particle-system/** - P5.js particle physics with controls
- **3d-visualization/** - Three.js 3D scene with lighting

## Best Practices

### Development Guidelines
1. **Start with clean-template.html** for new tools
2. **Preserve the professional UI structure** - don't recreate the design system
3. **Customize the render() method** for your specific animation logic
4. **Add controls incrementally** - extend side panel and event handlers
5. **Test export functionality** early in development

### Code Organization
- Keep animation logic in the render() method
- Use event listeners for real-time parameter updates
- Implement proper cleanup for resources and timers
- Follow the established CSS class naming conventions

### Framework Selection
- **P5.js** - Creative coding, organic animations, rapid prototyping
- **Three.js** - 3D visualizations, complex scenes, lighting effects
- **WebGL** - Maximum performance, custom shaders, mathematical visualizations
- **Canvas2D** - Simple graphics, broad compatibility, lightweight tools

### Performance Considerations
- Use requestAnimationFrame for smooth animation loops
- Implement object pooling for frequently created objects
- Monitor frame rate and adjust quality accordingly
- Consider adaptive quality based on device capabilities

## Common Patterns

### Real-time Parameter Updates
```javascript
// Pattern: Immediate visual feedback from controls
document.getElementById('controlId').addEventListener('input', (e) => {
    this.parameter = parseFloat(e.target.value);
    // Value updates automatically on next render cycle
});
```

### Background/Foreground Image Integration
```javascript
// Pattern: Layer background and foreground images
render(p5) {
    if (this.backgroundImage) {
        p5.image(this.backgroundImage, 0, 0, this.frameWidth, this.frameHeight);
    } else {
        p5.background(this.backgroundColor);
    }
    
    // Your animation content here
    
    if (this.foregroundImage) {
        p5.image(this.foregroundImage, 0, 0, this.frameWidth, this.frameHeight);
    }
}
```

### Zoom and Canvas Sizing
```javascript
// Pattern: Independent export size and preview zoom
updateZoom() {
    const container = document.getElementById('frameContainer');
    container.style.transform = `scale(${this.zoom})`;
    // Export always uses frameWidth/frameHeight, not zoom
}
```

This template system enables rapid development of professional animation tools while maintaining consistency and quality across different tools and frameworks.