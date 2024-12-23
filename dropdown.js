document.addEventListener('DOMContentLoaded', function() {
    const selectContainer = document.getElementById('anomalySelect');
    const selected = selectContainer.querySelector('.select-selected');
    const items = selectContainer.querySelector('.select-items');
    const arrow = selectContainer.querySelector('.holo-select-arrow');

    function closeDropdown() {
        items.classList.add('select-hide');
        arrow.style.transform = 'translateY(-50%)';
    }

    function toggleDropdown() {
        if (items.classList.contains('select-hide')) {
            items.classList.remove('select-hide');
            arrow.style.transform = 'translateY(-50%) rotate(180deg)';
        } else {
            closeDropdown();
        }
    }

    // Set initial state
    closeDropdown();

    selected.addEventListener('click', toggleDropdown);

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!selectContainer.contains(e.target)) {
            closeDropdown();
        }
    });

    // Close dropdown on ESC or Enter key
    window.addEventListener('keydown', function(e) {
        if ((e.key === 'Escape' || e.key === 'Esc' || e.key === 'Enter') && 
            !items.classList.contains('select-hide')) {
            closeDropdown();
            e.preventDefault();
        }
    });

    // Handle item selection
    const selectItems = selectContainer.querySelectorAll('.select-item');

    selectItems.forEach(item => {
        item.addEventListener('click', function() {
            // First, update selected status
            selectItems.forEach(i => i.classList.remove('selected'));
            this.classList.add('selected');
            
            // Update text and close dropdown immediately
            selected.textContent = this.textContent;
            closeDropdown();
            
            // Update anomaly-specific info
            const infoElement = document.querySelector('.anomaly-specific-info');
            if (this.dataset.value === 'powerup') {
                infoElement.innerHTML = 'Check out some of the best real footage of powerups!' +
                    '<div class="video-container">' +
                    '<iframe src="https://www.youtube.com/embed/cbYj_IrX_vA?list=PLCXiD1JyNd6XhegrLOYWwGvXj5B5KG0HD" ' +
                    'title="The CE-5 Protocol - Port Austin, Michigan USA" frameborder="0" ' +
                    'allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" ' +
                    'referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>' +
                    '</div>';
            } else if (this.dataset.value === 'mover') {
                infoElement.textContent = 'Movers are known for their predictable paths but unpredictable effects.';
            }
            
            // use updateAnomaly
            updateAnomaly(this.dataset.value);
        });
    });

    // Initialize with powerup
    updateAnomaly('powerup');
}); 