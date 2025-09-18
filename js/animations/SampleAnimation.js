import { BaseAnimation } from './BaseAnimation.js';

/**
 * SampleAnimation - A simple demo animation with a rotating square and orbiting circle
 * 
 * This demonstrates the basic structure of an animation class and serves as a starting
 * point for creating new animations.
 */
export class SampleAnimation extends BaseAnimation {
    constructor() {
        super('Sample Animation - Square & Circle');
        
        // Animation parameters with default values
        this.setParameter('squareSize', 60);
        this.setParameter('squareColor', '#333333');
        this.setParameter('circleRadius', 15);
        this.setParameter('circleColor', '#666666');
        this.setParameter('orbitRadius', 80);
        this.setParameter('rotationSpeed', 1.0);
        this.setParameter('orbitSpeed', 2.0);
    }

    /**
     * Main render method called every frame
     */
    renderFrame(ctx, width, height, time) {
        const centerX = width / 2;
        const centerY = height / 2;
        
        // Get current parameter values
        const squareSize = this.getParameter('squareSize', 60);
        const squareColor = this.getParameter('squareColor', '#333333');
        const circleRadius = this.getParameter('circleRadius', 15);
        const circleColor = this.getParameter('circleColor', '#666666');
        const orbitRadius = this.getParameter('orbitRadius', 80);
        const rotationSpeed = this.getParameter('rotationSpeed', 1.0);
        const orbitSpeed = this.getParameter('orbitSpeed', 2.0);
        
        // Draw rotating square in the center
        this.drawRotatingSquare(ctx, centerX, centerY, squareSize, squareColor, time * rotationSpeed);
        
        // Draw orbiting circle
        this.drawOrbitingCircle(ctx, centerX, centerY, circleRadius, circleColor, orbitRadius, time * orbitSpeed);
    }

    /**
     * Draw a rotating square
     */
    drawRotatingSquare(ctx, x, y, size, color, time) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(time);
        
        ctx.fillStyle = color;
        ctx.fillRect(-size/2, -size/2, size, size);
        
        ctx.restore();
    }

    /**
     * Draw an orbiting circle
     */
    drawOrbitingCircle(ctx, centerX, centerY, radius, color, orbitRadius, time) {
        const x = centerX + Math.cos(time) * orbitRadius;
        const y = centerY + Math.sin(time) * orbitRadius;
        
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
    }

    /**
     * Get custom controls for this animation
     */
    getControls() {
        return [
            ...super.getControls(), // Include base controls (speed)
            {
                type: 'divider',
                label: 'Square Properties'
            },
            {
                type: 'range',
                key: 'squareSize',
                label: 'Square Size',
                min: 10,
                max: 150,
                step: 5,
                value: this.getParameter('squareSize', 60),
                callback: (value) => this.setParameter('squareSize', parseInt(value))
            },
            {
                type: 'color',
                key: 'squareColor',
                label: 'Square Color',
                value: this.getParameter('squareColor', '#333333'),
                callback: (value) => this.setParameter('squareColor', value)
            },
            {
                type: 'range',
                key: 'rotationSpeed',
                label: 'Rotation Speed',
                min: 0.1,
                max: 5.0,
                step: 0.1,
                value: this.getParameter('rotationSpeed', 1.0),
                callback: (value) => this.setParameter('rotationSpeed', parseFloat(value))
            },
            {
                type: 'divider',
                label: 'Circle Properties'
            },
            {
                type: 'range',
                key: 'circleRadius',
                label: 'Circle Radius',
                min: 5,
                max: 50,
                step: 1,
                value: this.getParameter('circleRadius', 15),
                callback: (value) => this.setParameter('circleRadius', parseInt(value))
            },
            {
                type: 'color',
                key: 'circleColor',
                label: 'Circle Color',
                value: this.getParameter('circleColor', '#666666'),
                callback: (value) => this.setParameter('circleColor', value)
            },
            {
                type: 'range',
                key: 'orbitRadius',
                label: 'Orbit Radius',
                min: 20,
                max: 200,
                step: 5,
                value: this.getParameter('orbitRadius', 80),
                callback: (value) => this.setParameter('orbitRadius', parseInt(value))
            },
            {
                type: 'range',
                key: 'orbitSpeed',
                label: 'Orbit Speed',
                min: 0.1,
                max: 5.0,
                step: 0.1,
                value: this.getParameter('orbitSpeed', 2.0),
                callback: (value) => this.setParameter('orbitSpeed', parseFloat(value))
            }
        ];
    }
}