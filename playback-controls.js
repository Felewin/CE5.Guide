document.addEventListener('DOMContentLoaded', function() {
    const playPauseBtn = document.querySelector('.play-pause-btn');
    const progressContainer = document.querySelector('.progress-container');

    playPauseBtn.addEventListener('click', () => {
        isPlaying = !isPlaying;
        playPauseBtn.querySelector('i').className = isPlaying ? 'fas fa-pause' : 'fas fa-play';
        
        const anomaly = document.querySelector('.powerup, .mover');
        if (anomaly) {
            // Simply pause/play the animation
            anomaly.style.animationPlayState = isPlaying ? 'running' : 'paused';
        }
        
        if (isPlaying) {
            // When resuming, maintain current progress
            const progressFill = document.querySelector('.progress-fill');
            const currentProgress = parseFloat(progressFill.style.width || '0') / 100;
            const currentTime = currentProgress * ANIMATION_DURATION;
            animationStartTime = Date.now() - currentTime;
            updateProgressBar();
        }
    });

    progressContainer.addEventListener('click', (e) => {
        const rect = progressContainer.getBoundingClientRect();
        const progress = (e.clientX - rect.left) / rect.width;
        const newTime = progress * ANIMATION_DURATION;
        
        console.log({
            progress: progress.toFixed(2),
            newTime: newTime.toFixed(2),
            'seconds into animation': (newTime / 1000).toFixed(2)
        });
        
        // Update animation start time
        animationStartTime = Date.now() - newTime;
        
        // Update animation
        const anomaly = document.querySelector('.powerup, .mover');
        if (anomaly) {
            // Force animation to start at the clicked percentage
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
    });

    // Start progress bar
    updateProgressBar();
}); 