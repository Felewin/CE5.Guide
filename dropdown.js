// Make handleAnomalySelection available globally
window.handleAnomalySelection = null; // Declare first to avoid reference errors

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

    // Define the function and assign it to the global scope
    window.handleAnomalySelection = function(selectedItem) {
        // If clicking the already selected item, do nothing
        if (selectedItem.classList.contains('selected')) {
            closeDropdown();
            return;
        }

        // Update selected status
        selectContainer.querySelectorAll('.select-item').forEach(i => i.classList.remove('selected'));
        selectedItem.classList.add('selected');
        
        // Update text and close dropdown
        selected.textContent = selectedItem.textContent;
        closeDropdown();
        
        // Update anomaly-specific info
        const infoElements = document.querySelectorAll('.anomaly-specific-info');
        infoElements.forEach(element => {
            const anomalyType = element.dataset.anomaly;
            if (anomalyType === selectedItem.dataset.value) {
                element.classList.remove('hidden');
            } else {
                element.classList.add('hidden');
                window.pauseYouTubeVideos(element);
            }
        });
        
        // Update anomaly
        updateAnomaly(selectedItem.dataset.value);
    };

    // Use the function in click handler
    selectItems.forEach(item => {
        item.addEventListener('click', function() {
            window.handleAnomalySelection(this);
        });
    });

    // Initialize content on page load
    document.querySelectorAll('.anomaly-specific-info').forEach(element => {
        const anomalyType = element.dataset.anomaly;
        const infoObject = window.anomalyInfos[anomalyType];
        if (infoObject) {
            element.innerHTML = infoObject.content;
        }
    });
}); 