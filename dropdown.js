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
            
            // use updateAnomaly
            updateAnomaly(this.dataset.value);
        });
    });

    // Initialize with powerup
    updateAnomaly('powerup');
}); 