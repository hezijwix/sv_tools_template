export class ExportManager {
    constructor(canvasManager) {
        this.canvasManager = canvasManager;
        this.isExporting = false;
        this.mediaRecorder = null;
        this.recordedChunks = [];
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('closeExportModal').addEventListener('click', () => {
            this.hideExportModal();
        });

        document.getElementById('cancelExport').addEventListener('click', () => {
            this.hideExportModal();
        });

        document.getElementById('startExport').addEventListener('click', () => {
            this.handleExport();
        });

        // Click outside modal to close
        document.getElementById('exportModal').addEventListener('click', (e) => {
            if (e.target.id === 'exportModal') {
                this.hideExportModal();
            }
        });
    }

    showExportModal() {
        document.getElementById('exportModal').style.display = 'flex';
        document.getElementById('exportSizeDisplay').textContent = 
            `${this.canvasManager.width} × ${this.canvasManager.height}`;
    }

    hideExportModal() {
        document.getElementById('exportModal').style.display = 'none';
    }

    handleExport() {
        const format = document.getElementById('exportFormat').value;
        const duration = parseInt(document.getElementById('exportDuration').value) || 5;
        
        this.hideExportModal();
        
        if (format === 'png') {
            this.exportPNG();
        } else if (format === 'mp4') {
            this.exportMP4(duration);
        } else if (format === 'png-sequence') {
            this.exportPNGSequence(duration);
        }
    }

    exportPNG() {
        const dataURL = this.canvasManager.canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `canvas-export-${Date.now()}.png`;
        link.href = dataURL;
        link.click();
    }

    async exportMP4(duration) {
        if (this.isExporting) return;
        this.isExporting = true;
        
        const exportBtn = document.getElementById('export-btn');
        const originalText = exportBtn.textContent;
        
        try {
            exportBtn.textContent = 'Recording...';
            exportBtn.disabled = true;
            
            const stream = this.canvasManager.canvas.captureStream(30);
            
            // Improved format detection with better MP4 support
            const formats = [
                { mimeType: 'video/mp4; codecs="avc1.42E01E"', extension: 'mp4' },
                { mimeType: 'video/mp4; codecs="avc1.4D4028"', extension: 'mp4' },
                { mimeType: 'video/mp4; codecs="avc1.640028"', extension: 'mp4' },
                { mimeType: 'video/mp4', extension: 'mp4' },
                { mimeType: 'video/webm; codecs="vp9,opus"', extension: 'webm' },
                { mimeType: 'video/webm; codecs="vp8,opus"', extension: 'webm' },
                { mimeType: 'video/webm', extension: 'webm' }
            ];
            
            let selectedFormat = null;
            for (const format of formats) {
                if (MediaRecorder.isTypeSupported(format.mimeType)) {
                    selectedFormat = format;
                    console.log('Using format:', format.mimeType);
                    break;
                }
            }
            
            if (!selectedFormat) {
                throw new Error('No supported video format found');
            }
            
            const options = {
                mimeType: selectedFormat.mimeType
            };
            
            // Add bitrate if supported
            if (selectedFormat.extension === 'mp4') {
                options.videoBitsPerSecond = 2500000; // 2.5 Mbps for good quality MP4
            }
            
            this.mediaRecorder = new MediaRecorder(stream, options);
            this.recordedChunks = [];
            
            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    this.recordedChunks.push(event.data);
                }
            };
            
            this.mediaRecorder.onstop = () => {
                try {
                    const blob = new Blob(this.recordedChunks, { 
                        type: selectedFormat.mimeType 
                    });
                    
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    
                    const timestamp = Date.now();
                    const filename = `canvas-animation-${timestamp}.${selectedFormat.extension}`;
                    
                    link.download = filename;
                    link.href = url;
                    
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    
                    setTimeout(() => URL.revokeObjectURL(url), 1000);
                    
                    if (selectedFormat.extension === 'webm') {
                        setTimeout(() => {
                            alert(`Video saved as WebM format. Your browser doesn't support MP4 recording.\nFile: ${filename}`);
                        }, 100);
                    } else {
                        setTimeout(() => {
                            alert(`Video saved successfully!\nFile: ${filename}`);
                        }, 100);
                    }
                    
                } catch (error) {
                    console.error('Error creating download:', error);
                    alert('Error saving video file. Please try again.');
                }
                
                exportBtn.textContent = originalText;
                exportBtn.disabled = false;
                this.isExporting = false;
            };
            
            this.mediaRecorder.onerror = (event) => {
                console.error('MediaRecorder error:', event.error);
                alert('Recording error occurred. Please try again.');
                exportBtn.textContent = originalText;
                exportBtn.disabled = false;
                this.isExporting = false;
            };
            
            this.mediaRecorder.start(200);
            
            // Progress indicator
            let countdown = duration;
            const progressInterval = setInterval(() => {
                countdown--;
                exportBtn.textContent = `Recording... ${countdown}s`;
                if (countdown <= 0) {
                    clearInterval(progressInterval);
                }
            }, 1000);
            
            setTimeout(() => {
                clearInterval(progressInterval);
                if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
                    this.mediaRecorder.stop();
                    stream.getTracks().forEach(track => track.stop());
                }
            }, duration * 1000);
            
        } catch (error) {
            console.error('Video export failed:', error);
            alert(`Video export failed: ${error.message}\n\nTry using PNG Sequence export instead.`);
            exportBtn.textContent = originalText;
            exportBtn.disabled = false;
            this.isExporting = false;
        }
    }

    async exportPNGSequence(duration) {
        if (this.isExporting) return;
        this.isExporting = true;
        
        const exportBtn = document.getElementById('export-btn');
        const originalText = exportBtn.textContent;
        
        try {
            const frameRate = 60;
            const totalFrames = Math.ceil(duration * frameRate);
            const frames = [];
            
            exportBtn.disabled = true;
            
            // Create a separate canvas for export to preserve alpha channel
            const exportCanvas = document.createElement('canvas');
            const exportCtx = exportCanvas.getContext('2d');
            exportCanvas.width = this.canvasManager.width;
            exportCanvas.height = this.canvasManager.height;
            
            for (let frame = 0; frame < totalFrames; frame++) {
                exportBtn.textContent = `Frame ${frame + 1}/${totalFrames}`;
                
                // Clear the export canvas
                exportCtx.clearRect(0, 0, this.canvasManager.width, this.canvasManager.height);
                
                // If transparent mode, don't draw background
                if (!this.canvasManager.isTransparent) {
                    if (this.canvasManager.backgroundImage) {
                        exportCtx.drawImage(this.canvasManager.backgroundImage, 0, 0, 
                            this.canvasManager.width, this.canvasManager.height);
                    } else {
                        exportCtx.fillStyle = this.canvasManager.backgroundColor;
                        exportCtx.fillRect(0, 0, this.canvasManager.width, this.canvasManager.height);
                    }
                }
                
                // Render animation content to export canvas
                this.renderToCanvas(exportCtx, frame, totalFrames, duration);
                
                // Draw foreground image if exists
                if (this.canvasManager.foregroundImage) {
                    exportCtx.drawImage(this.canvasManager.foregroundImage, 0, 0, 
                        this.canvasManager.width, this.canvasManager.height);
                }
                
                // Capture frame with proper alpha support
                const dataURL = exportCanvas.toDataURL('image/png');
                frames.push(dataURL);
                
                // Small delay to allow processing
                await new Promise(resolve => setTimeout(resolve, 16));
            }
            
            exportBtn.textContent = 'Creating ZIP...';
            
            // Create ZIP
            const zip = new JSZip();
            const timestamp = Date.now();
            const folderName = this.canvasManager.isTransparent ? 
                `canvas-sequence-alpha-${timestamp}` : 
                `canvas-sequence-${timestamp}`;
            const folder = zip.folder(folderName);
            
            frames.forEach((frameData, index) => {
                const frameNumber = String(index + 1).padStart(4, '0');
                const fileName = `frame_${frameNumber}.png`;
                const base64Data = frameData.split(',')[1];
                folder.file(fileName, base64Data, { base64: true });
            });
            
            // Add a readme file explaining the export
            const readmeContent = `PNG Sequence Export
Generated: ${new Date().toISOString()}
Frames: ${totalFrames}
Duration: ${duration}s
Frame Rate: ${frameRate}fps
Alpha Channel: ${this.canvasManager.isTransparent ? 'Preserved' : 'Opaque'}
Canvas Size: ${this.canvasManager.width} × ${this.canvasManager.height}px

${this.canvasManager.isTransparent ? 
'This sequence contains PNG files with alpha transparency.' : 
'This sequence contains opaque PNG files.'}`;
            
            folder.file('README.txt', readmeContent);
            
            const zipBlob = await zip.generateAsync({ type: 'blob' });
            const url = URL.createObjectURL(zipBlob);
            const link = document.createElement('a');
            link.download = `${folderName}.zip`;
            link.href = url;
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            setTimeout(() => URL.revokeObjectURL(url), 1000);
            
            setTimeout(() => {
                const alphaInfo = this.canvasManager.isTransparent ? ' with alpha transparency' : '';
                alert(`PNG sequence exported successfully!\n${totalFrames} frames${alphaInfo}\nFile: ${folderName}.zip`);
            }, 100);
            
        } catch (error) {
            console.error('PNG sequence export failed:', error);
            alert('PNG sequence export failed. Please try again.');
        } finally {
            exportBtn.textContent = originalText;
            exportBtn.disabled = false;
            this.isExporting = false;
        }
    }

    // Render method for export that can handle frame-specific rendering
    renderToCanvas(ctx, frame, totalFrames, duration) {
        // Calculate animation progress for this specific frame
        const progress = frame / totalFrames;
        const time = progress * duration;
        
        // Render current animation if one is loaded
        if (this.canvasManager.currentAnimation) {
            this.canvasManager.currentAnimation.renderFrame(ctx, 
                this.canvasManager.width, this.canvasManager.height, time);
        }
    }
}