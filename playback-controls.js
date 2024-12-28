document.addEventListener('DOMContentLoaded', function() {
    const playPauseBtn = document.querySelector('.play-pause-btn');
    const progressContainer = document.querySelector('.progress-container');
    let isDragging = false;

    function togglePlayback() {
        isPlaying = !isPlaying;
        playPauseBtn.querySelector('i').className = isPlaying ? 'fas fa-pause' : 'fas fa-play';
        
        // Add ripple effect
        playPauseBtn.classList.remove('ripple');  // Reset animation
        void playPauseBtn.offsetWidth;  // Force reflow
        playPauseBtn.classList.add('ripple');
        
        const anomaly = document.querySelector('#current-anomaly');
        if (anomaly) {
            // Simply pause/play the animation
            anomaly.style.animationPlayState = isPlaying ? 'running' : 'paused';
        }
        
        // Dispatch event to update cloud movement when play state changes
        document.dispatchEvent(new Event('playStateChanged'));
        
        if (isPlaying) {
            // When resuming, maintain current progress
            const progressFill = document.querySelector('.progress-fill');
            const currentProgress = parseFloat(progressFill.style.width || '0') / 100;
            const currentTime = currentProgress * ANIMATION_DURATION;
            animationStartTime = Date.now() - currentTime;
            updateProgressBar();
        }
    }

    // Handle button click
    playPauseBtn.addEventListener('click', togglePlayback);

    // Handle space bar
    window.addEventListener('keydown', function(e) {
        if (e.code === 'Space' && e.target === document.body) {
            e.preventDefault(); // Prevent page scroll
            togglePlayback();
        }
    });

    function updateProgress(e) {
        const rect = progressContainer.getBoundingClientRect();
        const progress = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        const newTime = progress * ANIMATION_DURATION;
        
        // Update animation start time
        animationStartTime = Date.now() - newTime;
        
        // Update animation
        const anomaly = document.querySelector('#current-anomaly');
        if (anomaly) {
            anomaly.style.animation = 'none';
            anomaly.offsetHeight; // Force reflow
            anomaly.style.animation = '';
            anomaly.style.animationDelay = '0s';
            anomaly.style.animationPlayState = isPlaying ? 'running' : 'paused';
            anomaly.style.animationTimingFunction = 'linear';
            anomaly.style.animationDuration = '30s';
            requestAnimationFrame(() => {
                anomaly.style.animationDelay = `-${newTime / 1000}s`;
            });
        }
        
        // Update progress bar to match
        updateProgressBar();
    }

    // Handle mouse events for dragging
    progressContainer.addEventListener('mousedown', (e) => {
        isDragging = true;
        updateProgress(e);
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            updateProgress(e);
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // Keep existing click handler for when user just clicks without dragging
    progressContainer.addEventListener('click', updateProgress);

    // Start progress bar
    updateProgressBar();
});

// Playback state management for uncontrollable anomalies
window.playbackControls = {
    hideControls: (wasPlaying, currentTime) => {
        const controls = document.querySelector('.playback-controls');
        controls.style.display = 'none';
        // Store state for when we switch back
        window.playbackControls.lastState = {
            wasPlaying,
            currentTime
        };
    },
    showControls: () => {
        const controls = document.querySelector('.playback-controls');
        controls.style.display = '';
        return window.playbackControls.lastState;
    }
}; 