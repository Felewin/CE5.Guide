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
        
        // Only move clouds if playing or viewing uncontrolled anomaly
        if (window.isPlaying || isUncontrolled) {
            cloud.style.transition = `left ${driftDuration}s linear`;
        } else {
            // Pause by removing transition
            cloud.style.transition = 'none';
        }
    }
    
    function startDriftCycle(cloud, driftDuration, immediate = false) {
        const anomaly = document.querySelector('#current-anomaly');
        const isUncontrolled = uncontrollableTypes.has(anomaly.className);
        
        if (window.isPlaying || isUncontrolled) {
            if (immediate) {
                // Start drifting from current position
                updateCloudMovement(cloud, driftDuration);
                cloud.style.left = '-10%';
            } else {
                // Reset and start new drift cycle
                cloud.style.transition = 'none';
                cloud.style.left = '110%';
                
                setTimeout(() => {
                    updateCloudMovement(cloud, driftDuration);
                    cloud.style.left = '-10%';
                }, 50);
            }
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
        
        // Random initial position that will stay until first reset
        cloud.style.left = `${Math.random() * 100}%`;
        cloud.style.top = `${Math.random() * 60 + 10}%`;
        
        // Random drift speed (30-60s)
        const driftDuration = Math.random() * 30 + 30;
        
        container.appendChild(cloud);
        clouds.push({
            element: cloud,
            driftDuration
        });
        
        // Start initial drift immediately
        startDriftCycle(cloud, driftDuration, true);
        
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

        const computedStyle = getComputedStyle(anomaly);
        const boxShadow = computedStyle.boxShadow;
        const opacity = parseFloat(computedStyle.opacity);
        
        const isGlowing = boxShadow !== 'none' && boxShadow.includes('255');
        const glowIntensity = isGlowing ? opacity : 0;
        
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
            const falloff = Math.pow(Math.max(0, 1 - normalizedDistance), 2);
            
            // Set both the light position and intensity
            cloud.style.setProperty('--light-x', `${lightX}%`);
            cloud.style.setProperty('--light-y', `${lightY}%`);
            cloud.style.setProperty('--illumination', Math.min(1, falloff * glowIntensity));
        });
        
        requestAnimationFrame(updateCloudIllumination);
    }
    
    updateCloudIllumination();
}

// Create clouds when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    createClouds(8);
}); 