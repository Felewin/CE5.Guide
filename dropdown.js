document.addEventListener('DOMContentLoaded', function() {
    // Move isPlaying to top with other global variables
    let animationStartTime = Date.now();
    const ANIMATION_DURATION = 30000; // 30 seconds in milliseconds
    let isPlaying = true;

    const selectContainer = document.getElementById('anomalySelect');
    const selected = selectContainer.querySelector('.select-selected');
    const items = selectContainer.querySelector('.select-items');
    const arrow = selectContainer.querySelector('.holo-select-arrow');

    function closeDropdown() {
        items.classList.add('select-hide');
        arrow.style.transform = 'translateY(-50%)';
        items.style.pointerEvents = 'none';
    }

    function toggleDropdown() {
        if (items.classList.contains('select-hide')) {
            items.style.visibility = 'visible';
            items.style.pointerEvents = 'auto';
            items.classList.remove('select-hide');
            arrow.style.transform = 'translateY(-50%) rotate(180deg)';
        } else {
            closeDropdown();
        }
    }

    selected.addEventListener('click', toggleDropdown);

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!selectContainer.contains(e.target)) {
            closeDropdown();
        }
    });

    // Close dropdown on ESC key
    window.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' || e.key === 'Esc') {
            if (!items.classList.contains('select-hide')) {
                closeDropdown();
                e.preventDefault();
            }
        }
    });

    // Handle item selection
    const selectItems = selectContainer.querySelectorAll('.select-item');
    const viewscreen = document.querySelector('.viewscreen');

    function updateAnomaly(type) {
        // Get existing state before removing
        const existingAnomaly = viewscreen.querySelector('.anomaly-container');
        const existingElement = existingAnomaly?.querySelector('.powerup, .mover');
        const currentDelay = existingElement?.style.animationDelay;
        
        if (existingAnomaly) {
            existingAnomaly.remove();
        }

        // Create new anomaly container
        const container = document.createElement('div');
        container.className = 'anomaly-container';
        
        // Create anomaly element
        const anomaly = document.createElement('div');
        anomaly.className = type;

        // Set animation state
        if (!isPlaying && currentDelay) {
            // When paused, maintain exact delay
            anomaly.style.animationDelay = currentDelay;
        } else {
            // When playing or no previous delay, calculate new position
            const currentTime = Date.now();
            const elapsedTime = (currentTime - animationStartTime) % ANIMATION_DURATION;
            const delay = -elapsedTime / 1000;
            anomaly.style.animationDelay = `${delay}s`;
        }
        
        anomaly.style.animationPlayState = isPlaying ? 'running' : 'paused';
        
        container.appendChild(anomaly);
        viewscreen.appendChild(container);
    }

    selectItems.forEach(item => {
        item.addEventListener('click', function() {
            // First, update selected status
            selectItems.forEach(i => i.classList.remove('selected'));
            this.classList.add('selected');
            
            // Update text and close dropdown immediately
            selected.textContent = this.textContent;
            closeDropdown();
            
            // Always use updateAnomaly
            updateAnomaly(this.dataset.value);
        });
    });

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

    // Add playback controls
    const playPauseBtn = document.querySelector('.play-pause-btn');
    const progressContainer = document.querySelector('.progress-container');
    const progressFill = document.querySelector('.progress-fill');

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

    // Initialize with powerup and start progress bar
    updateAnomaly('powerup');
    updateProgressBar();
}); 