// Global animation state
let animationStartTime = Date.now();
const ANIMATION_DURATION = 30000; // 30 seconds in milliseconds
let isPlaying = true;

function updateAnomaly(type) {
    const currentAnomaly = document.querySelector('#current-anomaly');
    const wasPlaying = isPlaying;
    const currentTime = Date.now();
    const elapsedTime = (currentTime - animationStartTime) % ANIMATION_DURATION;

    if (type === 'streaker') {
        window.streaker.hideControls(wasPlaying, elapsedTime);
    } else if (currentAnomaly.classList.contains('streaker')) {
        // Coming back from streaker
        const lastState = window.streaker.showControls();
        if (lastState) {
            isPlaying = lastState.wasPlaying;
            animationStartTime = Date.now() - lastState.currentTime;
        }
    }

    currentAnomaly.className = type;
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