# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Starting a New Animation Tool
```bash
# Copy the template as your starting point
cp start_template.html my-new-tool.html

# Open in browser for development
open my-new-tool.html
```

### Development Workflow
- **No build system required** - Pure HTML/JS/CSS that runs directly in browser
- **Live development** - Edit HTML file and refresh browser to see changes
- **Canvas2D based** - Uses native HTML5 Canvas API for animations

### Testing
- Open HTML file in browser
- Use browser dev tools for debugging
- Test export functionality with PNG, MP4, and sequence exports

## Project Structure

### Overview
SV Tools provides a professional animation template with canvas management, export capabilities, and a complete UI framework for creating animation tools.

### Project Files

```
sv_tools/
├── start_template.html          # Main animation template with full functionality
├── design-system.md            # UI design system documentation
└── CLAUDE.md                   # This guidance file
```

### Key Components
- **FlexibleCanvasManager** - Main class handling canvas, animation, and exports
- **Professional UI** - Complete interface with controls, modals, and export functionality
- **Export System** - PNG, MP4, and PNG sequence export capabilities

## Implementation Approach

### Using start_template.html
```javascript
// The template provides a FlexibleCanvasManager class
// Customize the render() method for your specific animation:

render() {
    // Set background
    if (this.isTransparent) {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.drawTransparencyCheckers();
    } else if (this.backgroundImage) {
        this.ctx.drawImage(this.backgroundImage, 0, 0, this.width, this.height);
    } else {
        this.ctx.fillStyle = this.backgroundColor;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }
    
    // YOUR CUSTOM ANIMATION CODE HERE
    // Example: animated elements (replace the existing rotating square and circle)
    const time = Date.now() * 0.001;
    
    // Custom animation code goes here
    
    // Draw foreground image if exists
    if (this.foregroundImage) {
        this.ctx.drawImage(this.foregroundImage, 0, 0, this.width, this.height);
    }
}
```

### Adding Custom Controls
Extend the side panel HTML and add corresponding event listeners:

```html
<!-- Add to side panel after existing controls -->
<div class="controls-section section-with-divider">
    <h4>Animation</h4>
    <div class="frame-control-row">
        <label for="speedSlider">Speed:</label>
        <input type="range" id="speedSlider" min="0.1" max="3.0" step="0.1" value="1.0">
        <span id="speedValue">1.0x</span>
    </div>
</div>
```

```javascript
// Add to setupEventListeners() method in FlexibleCanvasManager
document.getElementById('speedSlider').addEventListener('input', (e) => {
    this.animationSpeed = parseFloat(e.target.value);
    document.getElementById('speedValue').textContent = this.animationSpeed + 'x';
});
```

### Export Functionality

#### Built-in Export Types
- **PNG** - Single frame image export (fully implemented)
- **MP4** - Video export for animations (fully implemented with MediaRecorder)
- **PNG Sequence** - Frame sequence in ZIP (fully implemented)

#### Export Features
The template includes a complete export system:
- Modal dialog for export settings
- Duration control for video/sequence exports
- Automatic format detection for video (MP4/WebM)
- Progress indicators during export
- Transparency support for PNG sequences

## Best Practices

### Development Guidelines
1. **Start with start_template.html** for new tools
2. **Preserve the professional UI structure** - don't recreate the design system
3. **Customize the render() method** for your specific animation logic
4. **Add controls incrementally** - extend side panel and event handlers
5. **Test export functionality** early in development

### Code Organization
- Keep animation logic in the render() method
- Use event listeners for real-time parameter updates
- Follow the established CSS class naming conventions
- Utilize the existing FlexibleCanvasManager architecture

### Performance Considerations
- The template uses requestAnimationFrame for smooth 60fps animation
- Implement object pooling for frequently created objects
- Monitor frame rate using browser dev tools
- Consider canvas size vs performance trade-offs

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
// Pattern: Layer background and foreground images (already implemented)
render() {
    // Background handling
    if (this.isTransparent) {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.drawTransparencyCheckers();
    } else if (this.backgroundImage) {
        this.ctx.drawImage(this.backgroundImage, 0, 0, this.width, this.height);
    } else {
        this.ctx.fillStyle = this.backgroundColor;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }
    
    // Your animation content here
    
    // Foreground overlay
    if (this.foregroundImage) {
        this.ctx.drawImage(this.foregroundImage, 0, 0, this.width, this.height);
    }
}
```

### Canvas Display Sizing
```javascript
// Pattern: Independent export size and preview display (already implemented)
updateCanvasDisplay() {
    // Automatically scales canvas for display while preserving export resolution
    // Export always uses this.width/this.height, not display size
}
```

This template provides a solid foundation for creating professional animation tools with Canvas2D.