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
        const existingAnomaly = viewscreen.querySelector('.powerup-container');
        if (existingAnomaly) {
            existingAnomaly.remove();
        }

        // Create new anomaly container
        const container = document.createElement('div');
        container.className = 'powerup-container';
        
        // Create anomaly element
        const anomaly = document.createElement('div');
        
        if (type === 'powerup') {
            anomaly.className = 'powerup';
        } else if (type === 'mover') {
            anomaly.className = 'mover';
        }
        
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

    // Initialize with powerup
    updateAnomaly('powerup');
}); 