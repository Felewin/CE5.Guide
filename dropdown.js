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
            items.style.visibility = 'visible';
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
    selectItems.forEach(item => {
        item.addEventListener('click', function() {
            // First, update selected status
            selectItems.forEach(i => i.classList.remove('selected'));
            this.classList.add('selected');
            
            // Wait for the indicator to slide
            setTimeout(() => {
                selected.textContent = this.textContent;
                closeDropdown();
                
                // Handle the selection change
                const selectedValue = this.dataset.value;
                console.log('Selected:', selectedValue);
                // Add your logic for handling the selection
            }, 200); // Match the timing with the CSS transition
        });
    });
}); 