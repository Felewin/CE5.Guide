document.addEventListener('DOMContentLoaded', function() {
    // Move isPlaying to top with other global variables
    let animationStartTime = Date.now();
    const ANIMATION_DURATION = 30000; // 30 seconds in milliseconds
    let isPlaying = true;

    // Create cursor glow element
    const cursorGlow = document.createElement('div');
    cursorGlow.className = 'cursor-glow';
    document.body.appendChild(cursorGlow);

    // Track mouse movement
    const holoviewer = document.querySelector('.holoviewer');
    
    holoviewer.addEventListener('mousemove', (e) => {
        const rect = holoviewer.getBoundingClientRect();
        if (e.clientX >= rect.left && 
            e.clientX <= rect.right && 
            e.clientY >= rect.top && 
            e.clientY <= rect.bottom) {
            cursorGlow.style.opacity = '1';
            cursorGlow.style.left = `${e.clientX}px`;
            cursorGlow.style.top = `${e.clientY}px`;
        } else {
            cursorGlow.style.opacity = '0';
        }
    });

    holoviewer.addEventListener('mouseleave', () => {
        cursorGlow.style.opacity = '0';
    });

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
        // Clear existing anomaly
        const existingAnomaly = viewscreen.querySelector('.anomaly-container');
        const existingDelay = existingAnomaly?.querySelector('.powerup, .mover')?.style.animationDelay;
        if (existingAnomaly) {
            existingAnomaly.remove();
        }

        // Create new anomaly container
        const container = document.createElement('div');
        container.className = 'anomaly-container';
        
        // Create anomaly element
        const anomaly = document.createElement('div');
        
        if (type === 'powerup') {
            anomaly.className = 'powerup';
        } else if (type === 'mover') {
            anomaly.className = 'mover';
        }

        // If paused, maintain current delay, otherwise calculate new one
        if (!isPlaying && existingDelay) {
            anomaly.style.animationDelay = existingDelay;
        } else {
            const currentTime = Date.now();
            const elapsedTime = (currentTime - animationStartTime) % ANIMATION_DURATION;
            const delay = -elapsedTime / 1000;
            anomaly.style.animationDelay = `${delay}s`;
        }
        
        // Set initial animation state
        anomaly.style.animationPlayState = isPlaying ? 'running' : 'paused';
        
        container.appendChild(anomaly);
        viewscreen.appendChild(container);
    }

    selectItems.forEach(item => {
        item.addEventListener('click', function() {
            // First, update selected status
            selectItems.forEach(i => i.classList.remove('selected'));
            this.classList.add('selected');
            
            // Wait for the indicator to slide
            setTimeout(() => {
                selected.textContent = this.textContent;
                closeDropdown();
                
                // Update the anomaly display
                const selectedValue = this.dataset.value;
                updateAnomaly(selectedValue);
            }, 200);
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
            anomaly.style.animationPlayState = isPlaying ? 'running' : 'paused';
        }
        
        if (isPlaying) {
            animationStartTime = Date.now() - (parseFloat(progressFill.style.width || '0') / 100 * ANIMATION_DURATION);
            updateProgressBar();
        }
    });

    progressContainer.addEventListener('click', (e) => {
        const rect = progressContainer.getBoundingClientRect();
        const progress = (e.clientX - rect.left) / rect.width;
        const newTime = progress * ANIMATION_DURATION;
        
        // Update animation start time to match the clicked position
        animationStartTime = Date.now() - newTime;
        
        const anomaly = document.querySelector('.powerup, .mover');
        if (anomaly) {
            // Reset the animation and set the new delay
            anomaly.style.animation = 'none';
            anomaly.offsetHeight; // Force reflow
            anomaly.style.animation = '';
            anomaly.style.animationDelay = `-${newTime / 1000}s`;
            
            // Maintain play/pause state
            anomaly.style.animationPlayState = isPlaying ? 'running' : 'paused';
        }

        // Update progress bar visuals even when paused
        const progressFill = document.querySelector('.progress-fill');
        const progressHandle = document.querySelector('.progress-handle');
        progressFill.style.width = `${progress * 100}%`;
        progressHandle.style.left = `${progress * 100}%`;
    });

    // Initialize with powerup and start progress bar
    updateAnomaly('powerup');
    updateProgressBar();
}); 