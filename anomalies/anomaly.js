// Global animation state
let animationStartTime = Date.now();
const ANIMATION_DURATION = 30000; // 30 seconds in milliseconds
let isPlaying = true;

// Set of uncontrollable anomaly types
const uncontrollableTypes = new Set();

// Registration function for uncontrollable types
function registerUncontrollableType(type) {
    uncontrollableTypes.add(type);
}

function updateAnomaly(type) {
    const currentAnomaly = document.querySelector('#current-anomaly');
    const wasPlaying = isPlaying;
    const currentTime = Date.now();
    const elapsedTime = (currentTime - animationStartTime) % ANIMATION_DURATION;

    if (uncontrollableTypes.has(type)) {
        window.playbackControls.hideControls(wasPlaying, elapsedTime);
    } else if (currentAnomaly && uncontrollableTypes.has(currentAnomaly.className)) {
        const lastState = window.playbackControls.showControls();
        if (lastState) {
            // Always resume playing when returning to controllable type
            isPlaying = true;
            animationStartTime = Date.now() - lastState.currentTime;
            // Update play/pause button to show pause icon
            const playPauseBtn = document.querySelector('.play-pause-btn i');
            if (playPauseBtn) {
                playPauseBtn.className = 'fas fa-pause';
            }
            // Restart progress bar animation
            updateProgressBar();
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