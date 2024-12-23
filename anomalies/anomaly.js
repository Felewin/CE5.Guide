// Global animation state
let animationStartTime = Date.now();
const ANIMATION_DURATION = 30000; // 30 seconds in milliseconds
let isPlaying = true;

function updateAnomaly(type) {
    const currentAnomaly = document.querySelector('#current-anomaly');
    currentAnomaly.className = type;
    const currentTime = Date.now();
    const elapsedTime = (currentTime - animationStartTime) % ANIMATION_DURATION;
    const delay = -elapsedTime / 1000;
    currentAnomaly.style.animationDelay = `${delay}s`;
    currentAnomaly.style.animationPlayState = isPlaying ? 'running' : 'paused';
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

// Just start the progress bar
window.onload = updateProgressBar;