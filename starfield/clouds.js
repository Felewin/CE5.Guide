function createClouds(count) {
    const container = document.querySelector('.viewscreen');
    const clouds = [];
    
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
        
        // Start outside viewport
        cloud.style.left = `${Math.random() * 120 - 10}%`;
        cloud.style.top = `${Math.random() * 60 + 10}%`;
        
        // Random drift speed (30-60s)
        const driftDuration = Math.random() * 30 + 30;
        cloud.style.transition = `left ${driftDuration}s linear`;
        
        container.appendChild(cloud);
        clouds.push(cloud);
        
        // Start drift animation
        setTimeout(() => {
            cloud.style.left = `${parseInt(cloud.style.left) - 120}%`;
        }, 100);
        
        // Reset cloud position when it drifts off screen
        setInterval(() => {
            cloud.style.transition = 'none';
            cloud.style.left = '110%';
            
            setTimeout(() => {
                cloud.style.transition = `left ${driftDuration}s linear`;
                cloud.style.left = '-10%';
            }, 100);
        }, driftDuration * 1000);
    }
    
    function updateCloudIllumination() {
        const anomaly = document.querySelector('#current-anomaly');
        const viewscreen = document.querySelector('.viewscreen');
        const viewscreenRect = viewscreen.getBoundingClientRect();
        
        // Get powerup's position relative to viewscreen
        const anomalyRect = anomaly.getBoundingClientRect();
        const relativeX = anomalyRect.left - viewscreenRect.left + anomalyRect.width / 2;
        const relativeY = anomalyRect.top - viewscreenRect.top + anomalyRect.height / 2;
        
        const maxDistance = viewscreenRect.width * 0.2; // 20% of viewscreen width
        
        clouds.forEach(cloud => {
            const cloudRect = cloud.getBoundingClientRect();
            const cloudX = cloudRect.left - viewscreenRect.left + cloudRect.width / 2;
            const cloudY = cloudRect.top - viewscreenRect.top + cloudRect.height / 2;
            
            const distance = Math.hypot(
                cloudX - relativeX,
                cloudY - relativeY
            );
            
            const opacity = parseFloat(getComputedStyle(anomaly).opacity);
            const boxShadow = getComputedStyle(anomaly).boxShadow;
            const isGlowing = boxShadow !== 'none' && boxShadow.includes('255');
            
            // Stronger illumination effect
            const illumination = Math.pow(Math.max(0, 1 - (distance / maxDistance)), 2) * opacity * (isGlowing ? 1 : 0);
            
            cloud.style.setProperty('--illumination', illumination);
        });
        
        requestAnimationFrame(updateCloudIllumination);
    }
    
    updateCloudIllumination();
}

// Create 8 clouds
createClouds(8); 