import { ExportManager } from './ExportManager.js';

export class CanvasManager {
    constructor() {
        this.canvas = document.getElementById('main-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.wrapper = document.getElementById('canvas-wrapper');
        this.canvasInfo = document.getElementById('canvas-info');
        
        this.width = 800;
        this.height = 600;
        this.backgroundColor = '#ffffff';
        this.isTransparent = false;
        this.backgroundImage = null;
        this.foregroundImage = null;
        
        this.animationId = null;
        this.currentAnimation = null;
        
        // Initialize export manager
        this.exportManager = new ExportManager(this);
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateCanvasSize();
        this.startAnimation();
    }

    setupEventListeners() {
        // Canvas size controls
        document.getElementById('canvas-width').addEventListener('input', (e) => {
            this.width = parseInt(e.target.value);
            this.updateCanvasSize();
        });

        document.getElementById('canvas-height').addEventListener('input', (e) => {
            this.height = parseInt(e.target.value);
            this.updateCanvasSize();
        });

        // Preset buttons
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const [width, height] = e.target.dataset.size.split(',').map(Number);
                this.width = width;
                this.height = height;
                document.getElementById('canvas-width').value = width;
                document.getElementById('canvas-height').value = height;
                this.updateCanvasSize();
                
                // Update active preset
                document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
            });
        });

        // Background controls
        document.getElementById('bg-color').addEventListener('input', (e) => {
            this.backgroundColor = e.target.value;
        });

        document.getElementById('bg-transparency').addEventListener('change', (e) => {
            this.isTransparent = e.target.value === 'transparent';
        });

        // Background image upload
        document.getElementById('bg-upload-btn').addEventListener('click', (e) => {
            if (!e.target.classList.contains('remove-image')) {
                document.getElementById('bg-image-input').click();
            }
        });

        document.getElementById('bg-image-input').addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const img = new Image();
                    img.onload = () => {
                        this.backgroundImage = img;
                        this.updateImageButtonState('bg', true);
                    };
                    img.src = event.target.result;
                };
                reader.readAsDataURL(file);
            }
        });

        // Background image removal
        document.getElementById('bg-remove-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.backgroundImage = null;
            this.updateImageButtonState('bg', false);
            document.getElementById('bg-image-input').value = '';
        });

        // Foreground image upload
        document.getElementById('fg-upload-btn').addEventListener('click', (e) => {
            if (!e.target.classList.contains('remove-image')) {
                document.getElementById('fg-image-input').click();
            }
        });

        document.getElementById('fg-image-input').addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const img = new Image();
                    img.onload = () => {
                        this.foregroundImage = img;
                        this.updateImageButtonState('fg', true);
                    };
                    img.src = event.target.result;
                };
                reader.readAsDataURL(file);
            }
        });

        // Foreground image removal
        document.getElementById('fg-remove-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.foregroundImage = null;
            this.updateImageButtonState('fg', false);
            document.getElementById('fg-image-input').value = '';
        });

        // Export controls
        document.getElementById('export-btn').addEventListener('click', () => {
            this.exportManager.showExportModal();
        });

        // Window resize
        window.addEventListener('resize', () => this.updateCanvasDisplay());
    }

    updateCanvasSize() {
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.canvasInfo.textContent = `${this.width} × ${this.height} px`;
        this.updateCanvasDisplay();
    }

    updateCanvasDisplay() {
        const containerWidth = this.wrapper.parentElement.clientWidth - 40; // padding
        const containerHeight = this.wrapper.parentElement.clientHeight - 40;
        
        const canvasAspect = this.width / this.height;
        const containerAspect = containerWidth / containerHeight;
        
        let displayWidth, displayHeight;
        
        if (canvasAspect > containerAspect) {
            // Canvas is wider - fit to width
            displayWidth = Math.min(containerWidth, this.width);
            displayHeight = displayWidth / canvasAspect;
        } else {
            // Canvas is taller - fit to height
            displayHeight = Math.min(containerHeight, this.height);
            displayWidth = displayHeight * canvasAspect;
        }
        
        this.wrapper.style.width = displayWidth + 'px';
        this.wrapper.style.height = displayHeight + 'px';
    }

    startAnimation() {
        const animate = () => {
            this.render();
            this.animationId = requestAnimationFrame(animate);
        };
        animate();
    }

    stopAnimation() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

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
        
        // Render current animation if one is loaded
        if (this.currentAnimation) {
            this.currentAnimation.render(this.ctx, this.width, this.height);
        }
        
        // Draw foreground image if exists
        if (this.foregroundImage) {
            this.ctx.drawImage(this.foregroundImage, 0, 0, this.width, this.height);
        }
    }

    drawTransparencyCheckers() {
        const checkerSize = 20;
        const lightGray = '#C0C0C0';
        const darkGray = '#808080';
        
        for (let x = 0; x < this.width; x += checkerSize) {
            for (let y = 0; y < this.height; y += checkerSize) {
                const isEven = (Math.floor(x / checkerSize) + Math.floor(y / checkerSize)) % 2 === 0;
                this.ctx.fillStyle = isEven ? lightGray : darkGray;
                this.ctx.fillRect(x, y, checkerSize, checkerSize);
            }
        }
    }

    updateImageButtonState(type, hasImage) {
        const button = document.getElementById(`${type}-upload-btn`);
        const removeBtn = document.getElementById(`${type}-remove-btn`);
        const uploadText = button.querySelector('.upload-text');
        
        if (hasImage) {
            button.classList.add('has-image');
            removeBtn.style.display = 'flex';
            uploadText.textContent = type === 'bg' ? 'BG Loaded' : 'FG Loaded';
        } else {
            button.classList.remove('has-image');
            removeBtn.style.display = 'none';
            uploadText.textContent = type === 'bg' ? 'Upload BG' : 'Upload FG';
        }
    }

    // Set the current animation
    setAnimation(animation) {
        this.currentAnimation = animation;
        if (animation) {
            animation.init();
        }
    }

    // Get canvas context for animations to use
    getContext() {
        return this.ctx;
    }

    // Get canvas dimensions
    getDimensions() {
        return { width: this.width, height: this.height };
    }
}