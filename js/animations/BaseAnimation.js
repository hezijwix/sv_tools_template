/**
 * BaseAnimation - Abstract base class for all animations
 * 
 * This class provides the common interface and functionality that all animations should implement.
 * When creating a new animation, extend this class and implement the required methods.
 */
export class BaseAnimation {
    constructor(name = 'Untitled Animation') {
        this.name = name;
        this.startTime = Date.now();
        this.isPlaying = true;
        this.speed = 1.0;
        this.parameters = {};
    }

    /**
     * Initialize the animation
     * Override this method to set up any initial state
     */
    init() {
        this.startTime = Date.now();
    }

    /**
     * Main render method called every frame
     * Override this method to implement your animation logic
     * 
     * @param {CanvasRenderingContext2D} ctx - The canvas context
     * @param {number} width - Canvas width
     * @param {number} height - Canvas height
     */
    render(ctx, width, height) {
        // Calculate current time for animations
        const time = this.getCurrentTime();
        this.renderFrame(ctx, width, height, time);
    }

    /**
     * Render a specific frame (used for exports)
     * Override this method to implement frame-specific rendering
     * 
     * @param {CanvasRenderingContext2D} ctx - The canvas context
     * @param {number} width - Canvas width
     * @param {number} height - Canvas height
     * @param {number} time - Time in seconds for this frame
     */
    renderFrame(ctx, width, height, time) {
        // Default implementation - subclasses should override this
        console.warn(`Animation '${this.name}' should implement renderFrame method`);
    }

    /**
     * Get current animation time in seconds
     * @returns {number} Time in seconds since animation started
     */
    getCurrentTime() {
        if (!this.isPlaying) {
            return this.pausedTime || 0;
        }
        return (Date.now() - this.startTime) * 0.001 * this.speed;
    }

    /**
     * Play/resume the animation
     */
    play() {
        if (!this.isPlaying) {
            this.startTime = Date.now() - (this.pausedTime || 0) * 1000 / this.speed;
            this.isPlaying = true;
        }
    }

    /**
     * Pause the animation
     */
    pause() {
        if (this.isPlaying) {
            this.pausedTime = this.getCurrentTime();
            this.isPlaying = false;
        }
    }

    /**
     * Reset the animation to the beginning
     */
    reset() {
        this.startTime = Date.now();
        this.pausedTime = 0;
        this.isPlaying = true;
    }

    /**
     * Set animation speed
     * @param {number} speed - Speed multiplier (1.0 = normal, 2.0 = double speed, etc.)
     */
    setSpeed(speed) {
        const currentTime = this.getCurrentTime();
        this.speed = speed;
        this.startTime = Date.now() - currentTime * 1000 / speed;
    }

    /**
     * Set a parameter value
     * @param {string} key - Parameter name
     * @param {any} value - Parameter value
     */
    setParameter(key, value) {
        this.parameters[key] = value;
    }

    /**
     * Get a parameter value
     * @param {string} key - Parameter name
     * @param {any} defaultValue - Default value if parameter doesn't exist
     * @returns {any} Parameter value
     */
    getParameter(key, defaultValue = null) {
        return this.parameters.hasOwnProperty(key) ? this.parameters[key] : defaultValue;
    }

    /**
     * Get animation controls for the UI
     * Override this method to provide custom controls for your animation
     * 
     * @returns {Array} Array of control objects
     */
    getControls() {
        return [
            {
                type: 'range',
                key: 'speed',
                label: 'Speed',
                min: 0.1,
                max: 3.0,
                step: 0.1,
                value: this.speed,
                callback: (value) => this.setSpeed(parseFloat(value))
            }
        ];
    }

    /**
     * Clean up resources when animation is destroyed
     */
    destroy() {
        // Override in subclasses if cleanup is needed
    }

    /**
     * Get animation metadata
     * @returns {Object} Animation metadata
     */
    getMetadata() {
        return {
            name: this.name,
            isPlaying: this.isPlaying,
            currentTime: this.getCurrentTime(),
            speed: this.speed,
            parameters: { ...this.parameters }
        };
    }
}