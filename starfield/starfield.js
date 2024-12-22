function createStars(count) {
    const container = document.querySelector('.viewscreen');
    for (let i = 0; i < count; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        // Random position (using % instead of vw/vh)
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        
        // Random size (1-3px)
        const size = Math.random() * 2 + 1;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        
        // Random twinkle duration (3-8s)
        star.style.setProperty('--twinkle-duration', `${Math.random() * 5 + 3}s`);
        
        container.appendChild(star);
    }
}

// Create 200 stars
createStars(200); 