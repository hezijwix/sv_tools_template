import { CanvasManager } from './core/CanvasManager.js';
import { SampleAnimation } from './animations/SampleAnimation.js';

/**
 * Animation Registry
 * 
 * This registry manages all available animations and provides a centralized
 * way to register, create, and switch between different animations.
 */
class AnimationRegistry {
    constructor() {
        this.animations = new Map();
        this.registerBuiltInAnimations();
    }

    /**
     * Register built-in animations
     */
    registerBuiltInAnimations() {
        this.register('sample', SampleAnimation, 'Sample Animation - Square & Circle');
        // Add more built-in animations here as you create them
        // this.register('spiral', SpiralAnimation, 'Spiral Animation');
        // this.register('particles', ParticleSystem, 'Particle System');
    }

    /**
     * Register a new animation
     * @param {string} id - Unique identifier for the animation
     * @param {class} AnimationClass - The animation class
     * @param {string} displayName - Human-readable name for the animation
     */
    register(id, AnimationClass, displayName) {
        this.animations.set(id, {
            id,
            class: AnimationClass,
            displayName: displayName || AnimationClass.name
        });
    }

    /**
     * Get all registered animations
     * @returns {Array} Array of animation info objects
     */
    getAll() {
        return Array.from(this.animations.values());
    }

    /**
     * Create an instance of an animation
     * @param {string} id - Animation ID
     * @returns {BaseAnimation|null} Animation instance or null if not found
     */
    create(id) {
        const animationInfo = this.animations.get(id);
        if (animationInfo) {
            return new animationInfo.class();
        }
        console.error(`Animation '${id}' not found in registry`);
        return null;
    }

    /**
     * Check if an animation is registered
     * @param {string} id - Animation ID
     * @returns {boolean} True if animation exists
     */
    has(id) {
        return this.animations.has(id);
    }
}

/**
 * Animation Control UI Manager
 * 
 * Manages the animation controls in the side panel, including animation
 * selection and parameter controls.
 */
class AnimationControlUI {
    constructor(canvasManager, animationRegistry) {
        this.canvasManager = canvasManager;
        this.animationRegistry = animationRegistry;
        this.currentAnimation = null;
        this.controlsContainer = null;
        
        this.createUI();
    }

    /**
     * Create the animation controls UI
     */
    createUI() {
        // Find the controls section container
        const sidePanel = document.querySelector('.side-panel');
        
        // Create animation section
        const animationSection = document.createElement('div');
        animationSection.className = 'controls-section section-with-divider';
        animationSection.innerHTML = `
            <h4>Animation</h4>
            <div class="frame-control-row">
                <label for="animation-select">Animation:</label>
                <select id="animation-select">
                    <option value="">Select Animation...</option>
                </select>
            </div>
            <div class="animation-controls">
                <button id="play-pause-btn" class="control-btn">Play</button>
                <button id="reset-btn" class="control-btn">Reset</button>
            </div>
            <div id="animation-parameters"></div>
        `;
        
        // Insert after the background section
        const backgroundSection = sidePanel.querySelector('.controls-section:last-child');
        backgroundSection.parentNode.insertBefore(animationSection, backgroundSection.nextSibling);
        
        this.controlsContainer = document.getElementById('animation-parameters');
        
        this.populateAnimationSelect();
        this.setupEventListeners();
    }

    /**
     * Populate the animation selection dropdown
     */
    populateAnimationSelect() {
        const select = document.getElementById('animation-select');
        const animations = this.animationRegistry.getAll();
        
        animations.forEach(animationInfo => {
            const option = document.createElement('option');
            option.value = animationInfo.id;
            option.textContent = animationInfo.displayName;
            select.appendChild(option);
        });
    }

    /**
     * Setup event listeners for animation controls
     */
    setupEventListeners() {
        // Animation selection
        document.getElementById('animation-select').addEventListener('change', (e) => {
            const animationId = e.target.value;
            if (animationId) {
                this.loadAnimation(animationId);
            } else {
                this.clearAnimation();
            }
        });

        // Play/Pause button
        document.getElementById('play-pause-btn').addEventListener('click', () => {
            this.togglePlayPause();
        });

        // Reset button
        document.getElementById('reset-btn').addEventListener('click', () => {
            this.resetAnimation();
        });
    }

    /**
     * Load and activate an animation
     * @param {string} animationId - ID of the animation to load
     */
    loadAnimation(animationId) {
        const animation = this.animationRegistry.create(animationId);
        if (animation) {
            this.currentAnimation = animation;
            this.canvasManager.setAnimation(animation);
            this.createParameterControls();
            this.updatePlayPauseButton();
        }
    }

    /**
     * Clear the current animation
     */
    clearAnimation() {
        this.currentAnimation = null;
        this.canvasManager.setAnimation(null);
        this.clearParameterControls();
        this.updatePlayPauseButton();
    }

    /**
     * Create parameter controls for the current animation
     */
    createParameterControls() {
        this.clearParameterControls();
        
        if (!this.currentAnimation) return;
        
        const controls = this.currentAnimation.getControls();
        
        controls.forEach(control => {
            if (control.type === 'divider') {
                this.createDivider(control.label);
            } else if (control.type === 'range') {
                this.createRangeControl(control);
            } else if (control.type === 'color') {
                this.createColorControl(control);
            }
        });
    }

    /**
     * Create a divider with label
     */
    createDivider(label) {
        const divider = document.createElement('div');
        divider.className = 'controls-section';
        divider.style.marginBottom = '16px';
        divider.style.marginTop = '16px';
        divider.innerHTML = `<h4>${label}</h4>`;
        this.controlsContainer.appendChild(divider);
    }

    /**
     * Create a range slider control
     */
    createRangeControl(control) {
        const container = document.createElement('div');
        container.className = 'frame-control-row';
        
        const label = document.createElement('label');
        label.textContent = control.label + ':';
        
        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = control.min;
        slider.max = control.max;
        slider.step = control.step;
        slider.value = control.value;
        slider.style.flex = '1';
        
        const valueDisplay = document.createElement('span');
        valueDisplay.textContent = control.value;
        
        slider.addEventListener('input', (e) => {
            const value = e.target.value;
            valueDisplay.textContent = value;
            control.callback(value);
        });
        
        container.appendChild(label);
        container.appendChild(slider);
        container.appendChild(valueDisplay);
        this.controlsContainer.appendChild(container);
    }

    /**
     * Create a color picker control
     */
    createColorControl(control) {
        const container = document.createElement('div');
        container.className = 'frame-control-row';
        
        const label = document.createElement('label');
        label.textContent = control.label + ':';
        
        const colorPicker = document.createElement('input');
        colorPicker.type = 'color';
        colorPicker.value = control.value;
        colorPicker.className = 'color-picker';
        
        colorPicker.addEventListener('input', (e) => {
            control.callback(e.target.value);
        });
        
        container.appendChild(label);
        container.appendChild(colorPicker);
        this.controlsContainer.appendChild(container);
    }

    /**
     * Clear all parameter controls
     */
    clearParameterControls() {
        if (this.controlsContainer) {
            this.controlsContainer.innerHTML = '';
        }
    }

    /**
     * Toggle play/pause state
     */
    togglePlayPause() {
        if (this.currentAnimation) {
            if (this.currentAnimation.isPlaying) {
                this.currentAnimation.pause();
            } else {
                this.currentAnimation.play();
            }
            this.updatePlayPauseButton();
        }
    }

    /**
     * Reset the current animation
     */
    resetAnimation() {
        if (this.currentAnimation) {
            this.currentAnimation.reset();
            this.updatePlayPauseButton();
        }
    }

    /**
     * Update the play/pause button text and state
     */
    updatePlayPauseButton() {
        const button = document.getElementById('play-pause-btn');
        if (this.currentAnimation && this.currentAnimation.isPlaying) {
            button.textContent = 'Pause';
            button.classList.add('playing');
            button.classList.remove('paused');
        } else {
            button.textContent = 'Play';
            button.classList.remove('playing');
            button.classList.add('paused');
        }
    }
}

/**
 * Application initialization
 */
class App {
    constructor() {
        this.canvasManager = null;
        this.animationRegistry = null;
        this.animationControlUI = null;
    }

    /**
     * Initialize the application
     */
    init() {
        // Create core components
        this.canvasManager = new CanvasManager();
        this.animationRegistry = new AnimationRegistry();
        this.animationControlUI = new AnimationControlUI(this.canvasManager, this.animationRegistry);
        
        // Load default animation
        this.loadDefaultAnimation();
        
        console.log('SV Tools Animation Framework initialized');
        console.log('Available animations:', this.animationRegistry.getAll().map(a => a.displayName));
    }

    /**
     * Load the default animation
     */
    loadDefaultAnimation() {
        // Auto-load the sample animation as default
        const select = document.getElementById('animation-select');
        select.value = 'sample';
        this.animationControlUI.loadAnimation('sample');
    }
}

// Global app instance
let app;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    app = new App();
    app.init();
});

// Export for potential external use
export { App, AnimationRegistry };