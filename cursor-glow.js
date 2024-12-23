document.addEventListener('DOMContentLoaded', () => {
    // Create cursor glow element if it doesn't exist
    let cursorGlow = document.querySelector('.cursor-glow');
    if (!cursorGlow) {
        cursorGlow = document.createElement('div');
        cursorGlow.className = 'cursor-glow';
        document.body.appendChild(cursorGlow);
    }
    
    let hasMovedOnce = false;

    document.addEventListener('mousemove', (e) => {
        if (!hasMovedOnce) {
            cursorGlow.classList.add('active');
            hasMovedOnce = true;
        }
        cursorGlow.style.left = e.clientX + 'px';
        cursorGlow.style.top = e.clientY + 'px';
    });
}); 