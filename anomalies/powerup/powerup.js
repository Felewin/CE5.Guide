registerAnomalySpecificInfo('powerup', {
    content: `Check out some of the best footage of powerups!
    ${createVideoLink(
        'anomalies/powerup/The CE-5 Protocol - Port Austin, Michigan USA.mp4',
        'https://youtu.be/cbYj_IrX_vA?t=399'
    )}
    ${createVideoLink(
        'anomalies/powerup/Best UFO Footage- They Are Star People,  We Know Who They Are  Unci Keya.mp4',
        'https://youtu.be/IjsNS6MePxs?t=257'
    )}
    ${createVideoLink(
        'anomalies/powerup/UFO Best Power UP July 29 Wow!.mp4',
        'https://youtu.be/C7DwVXQw6NM?t=94'
    )}
    ${createVideoLink(
        'anomalies/powerup/Examples of CE-5 Footage.mp4',
        'https://youtu.be/M0sY6FdlNeQ?t=188'
    )}`
}); 

// Define powerup glow animation timing constants
window.POWERUP_CONSTANTS = {
    GLOW_START: 0.34,  // 34% - start of glow phase
    GLOW_PEAK: 0.505,  // 50.5% - maximum brightness
    GLOW_END: 0.59,    // 59% - end of glow phase
    getGlowIntensity: function(progress) {
        if (progress < this.GLOW_START || progress > this.GLOW_END) return 0;
        
        // Calculate how close we are to the peak
        const distFromPeak = Math.abs(progress - this.GLOW_PEAK);
        const peakRange = (this.GLOW_END - this.GLOW_START) / 2;
        return Math.max(0, 1 - (distFromPeak / peakRange));
    }
}; 