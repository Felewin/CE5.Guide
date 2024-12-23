registerAnomalySpecificInfo('streaker', {
    content: "Streakers are extremely fast anomalies that briefly flash across the sky. They're often only visible for a fraction of a second, appearing to fade in and out as they streak by. Unlike meteors or satellites, they can move in any direction and their glow doesn't match known atmospheric phenomena."
});

// Store playback state when switching to/from streaker
window.streaker = {
    hideControls: (wasPlaying, currentTime) => {
        const controls = document.querySelector('.playback-controls');
        controls.style.display = 'none';
        // Store state for when we switch back
        window.streaker.lastState = {
            wasPlaying,
            currentTime
        };
    },
    showControls: () => {
        const controls = document.querySelector('.playback-controls');
        controls.style.display = '';
        return window.streaker.lastState;
    }
};