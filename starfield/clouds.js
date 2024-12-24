function createClouds(count) {
    const container = document.querySelector('.viewscreen');
    const clouds = [];
    
    for (let i = 0; i < count; i++) {
        const cloud = document.createElement('div');
        cloud.className = 'cloud';
        
        // Random size (50-150px)
        const width = Math.random() * 100 + 50;
        const height = width * (Math.random() * 0.4 + 0.3); // 30-70% of width
        
        cloud.style.width = `${width}px`;
        cloud.style.height = `${height}px`;
        
        // Start outside viewport
        cloud.style.left = `${Math.random() * 120 - 10}%`;
        cloud.style.top = `${Math.random() * 60 + 10}%`;
        
        // Random drift speed (30-60s)
        const driftDuration = Math.random() * 30 + 30;
        cloud.style.transition = `left ${driftDuration}s linear, opacity 2s ease`;
        
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
                cloud.style.transition = `left ${driftDuration}s linear, opacity 2s ease`;
                cloud.style.left = '-10%';
            }, 100);
        }, driftDuration * 1000);
    }
    
    // Check for illumination every frame
    function updateCloudIllumination() {
        const anomaly = document.querySelector('#current-anomaly');
        const anomalyRect = anomaly.getBoundingClientRect();
        const anomalyCenter = {
            x: anomalyRect.left + anomalyRect.width / 2,
            y: anomalyRect.top + anomalyRect.height / 2
        };
        
        const maxDistance = 200; // Maximum distance for illumination effect
        
        clouds.forEach(cloud => {
            const cloudRect = cloud.getBoundingClientRect();
            const cloudCenter = {
                x: cloudRect.left + cloudRect.width / 2,
                y: cloudRect.top + cloudRect.height / 2
            };
            
            // Calculate distance
            const distance = Math.hypot(
                cloudCenter.x - anomalyCenter.x,
                cloudCenter.y - anomalyCenter.y
            );
            
            // Calculate illumination strength (0 to 1)
            const opacity = parseFloat(getComputedStyle(anomaly).opacity);
            const illumination = Math.max(0, 1 - (distance / maxDistance)) * opacity;
            
            // Apply smooth illumination
            cloud.style.setProperty('--illumination', illumination);
        });
        
        requestAnimationFrame(updateCloudIllumination);
    }
    
    updateCloudIllumination();
}

// Create 8 clouds
createClouds(8); 