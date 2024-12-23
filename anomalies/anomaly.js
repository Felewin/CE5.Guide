// Global animation state
let animationStartTime = Date.now();
const ANIMATION_DURATION = 30000; // 30 seconds in milliseconds
let isPlaying = true;

function updateAnomaly(type) {
    const viewscreen = document.querySelector('.viewscreen');
    
    // Get existing state before removing
    const existingAnomaly = viewscreen.querySelector('.anomaly-container');
    const existingElement = existingAnomaly?.querySelector('.powerup, .mover');
    
    // Check if we're trying to set the same type that's already displayed
    if (existingElement && existingElement.classList.contains(type)) {
        return; // Exit early if same type
    }

    if (existingAnomaly) {
        existingAnomaly.remove();
    }

    // Create new anomaly container
    const container = document.createElement('div');
    container.className = 'anomaly-container';
    
    // Create anomaly element
    const anomaly = document.createElement('div');
    anomaly.className = type;

    if (!isPlaying) {
        // When paused, use progress bar position
        const progressFill = document.querySelector('.progress-fill');
        const currentProgress = parseFloat(progressFill.style.width || '0') / 100;
        const currentTime = currentProgress * ANIMATION_DURATION;
        anomaly.style.animationDelay = `-${currentTime / 1000}s`;
    } else {
        // When playing, calculate from current time
        const currentTime = Date.now();
        const elapsedTime = (currentTime - animationStartTime) % ANIMATION_DURATION;
        const delay = -elapsedTime / 1000;
        anomaly.style.animationDelay = `${delay}s`;
    }
    
    anomaly.style.animationPlayState = isPlaying ? 'running' : 'paused';
    
    container.appendChild(anomaly);
    viewscreen.appendChild(container);
}

function updateProgressBar() {
    const currentTime = Date.now();
    const elapsedTime = (currentTime - animationStartTime) % ANIMATION_DURATION;
    const progress = (elapsedTime / ANIMATION_DURATION) * 100;
    
    const progressFill = document.querySelector('.progress-fill');
    const progressHandle = document.querySelector('.progress-handle');
    
    progressFill.style.width = `${progress}%`;
    progressHandle.style.left = `${progress}%`;
    
    if (isPlaying) {
        requestAnimationFrame(updateProgressBar);
    }
}