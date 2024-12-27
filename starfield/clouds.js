function createClouds(count) {
    const container = document.querySelector('.viewscreen');
    if (!container) {
        console.error('Could not find viewscreen container for clouds');
        return;
    }
    
    const clouds = [];
    
    function updateCloudMovement(cloud, driftDuration) {
        const anomaly = document.querySelector('#current-anomaly');
        const isUncontrolled = uncontrollableTypes.has(anomaly.className);
        
        // Set or remove transition based on play state
        if (window.isPlaying || isUncontrolled) {
            cloud.style.transition = `left ${driftDuration}s linear`;
        } else {
            cloud.style.transition = 'none';
            // Capture current position when pausing
            const currentLeft = getComputedStyle(cloud).left;
            cloud.style.left = currentLeft;
        }
    }
    
    function startDriftCycle(cloud, driftDuration) {
        const anomaly = document.querySelector('#current-anomaly');
        const isUncontrolled = uncontrollableTypes.has(anomaly.className);
        
        if (window.isPlaying || isUncontrolled) {
            // Reset position and start new drift
            cloud.style.transition = 'none';
            cloud.style.left = '110%';
            
            requestAnimationFrame(() => {
                updateCloudMovement(cloud, driftDuration);
                cloud.style.left = '-10%';
            });
        }
    }
    
    for (let i = 0; i < count; i++) {
        const cloud = document.createElement('div');
        cloud.className = 'cloud';
        
        // Random size (50-150px)
        const width = Math.random() * 100 + 50;
        const height = width * (Math.random() * 0.4 + 0.3);
        
        // Random opacity for variety
        const opacity = 0.3 + Math.random() * 0.3;
        cloud.style.setProperty('--cloud-opacity', opacity);
        
        cloud.style.width = `${width}px`;
        cloud.style.height = `${height}px`;
        
        // Initial position
        cloud.style.left = `${Math.random() * 120 - 10}%`;
        cloud.style.top = `${Math.random() * 60 + 10}%`;
        
        // Slower drift speed (60-120s)
        const driftDuration = Math.random() * 60 + 60;
        
        container.appendChild(cloud);
        clouds.push({
            element: cloud,
            driftDuration
        });
        
        // Start initial drift
        if (window.isPlaying) {
            updateCloudMovement(cloud, driftDuration);
            cloud.style.left = '-10%';
        }
        
        // Set up repeating drift
        setInterval(() => {
            startDriftCycle(cloud, driftDuration);
        }, driftDuration * 1000);
    }
    
    // Update cloud movement when play state changes
    document.addEventListener('playStateChanged', () => {
        clouds.forEach(({element: cloud, driftDuration}) => {
            updateCloudMovement(cloud, driftDuration);
        });
    });
    
    function updateCloudIllumination() {
        const anomaly = document.querySelector('#current-anomaly');
        if (!anomaly.classList.contains('powerup')) return;

        // Calculate current animation progress
        const currentTime = Date.now();
        const elapsedTime = (currentTime - animationStartTime) % ANIMATION_DURATION;
        const progress = elapsedTime / ANIMATION_DURATION;
        
        // Get glow intensity from powerup constants with smoother transition
        const glowIntensity = window.POWERUP_CONSTANTS.getGlowIntensity(progress);
        
        const viewscreen = document.querySelector('.viewscreen');
        const viewscreenRect = viewscreen.getBoundingClientRect();
        
        const anomalyRect = anomaly.getBoundingClientRect();
        const powerupX = anomalyRect.left - viewscreenRect.left + anomalyRect.width / 2;
        const powerupY = anomalyRect.top - viewscreenRect.top + anomalyRect.height / 2;
        
        const maxDistance = viewscreenRect.width * 0.3;
        
        clouds.forEach(({element: cloud}) => {
            const cloudRect = cloud.getBoundingClientRect();
            
            // Calculate light position relative to cloud
            const cloudCenterX = cloudRect.left - viewscreenRect.left + cloudRect.width / 2;
            const cloudCenterY = cloudRect.top - viewscreenRect.top + cloudRect.height / 2;
            
            // Convert powerup position to percentage within cloud
            const lightX = ((powerupX - (cloudRect.left - viewscreenRect.left)) / cloudRect.width) * 100;
            const lightY = ((powerupY - (cloudRect.top - viewscreenRect.top)) / cloudRect.height) * 100;
            
            // Calculate distance for overall intensity
            const distance = Math.hypot(
                cloudCenterX - powerupX,
                cloudCenterY - powerupY
            );
            
            const normalizedDistance = distance / maxDistance;
            // Smoother falloff curve
            const falloff = Math.pow(Math.max(0, 1 - normalizedDistance), 1.5);
            
            // Ensure smooth transition at glow boundaries
            const smoothGlowIntensity = glowIntensity * glowIntensity; // Square for smoother falloff
            
            // Set both the light position and intensity with increased brightness
            cloud.style.setProperty('--light-x', `${lightX}%`);
            cloud.style.setProperty('--light-y', `${lightY}%`);
            cloud.style.setProperty('--illumination', Math.min(1, falloff * smoothGlowIntensity * 3));
        });
        
        requestAnimationFrame(updateCloudIllumination);
    }
    
    updateCloudIllumination();
}

// Create clouds when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    createClouds(8);
}); 