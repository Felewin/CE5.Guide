document.addEventListener('DOMContentLoaded', function() {
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
}); 