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
            const infoElements = document.querySelectorAll('.anomaly-specific-info');
            infoElements.forEach(element => {
                const anomalyType = element.dataset.anomaly;
                if (anomalyType === this.dataset.value) {
                    element.classList.remove('hidden');
                    // Get the info object for this anomaly type
                    const infoObject = window.anomalyInfos[anomalyType];
                    if (infoObject) {
                        element.innerHTML = infoObject.description + (infoObject.media || '');
                    }
                } else {
                    element.classList.add('hidden');
                }
            });
            
            // use updateAnomaly
            updateAnomaly(this.dataset.value);
        });
    });

    // Initialize with powerup info
    const initialInfoElement = document.querySelector('.anomaly-specific-info[data-anomaly="powerup"]');
    if (initialInfoElement) {
        initialInfoElement.innerHTML = window.anomalyInfos.powerup.description + (window.anomalyInfos.powerup.media || '');
    }
}); 