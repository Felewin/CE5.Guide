// Helper function to create a video element with standard attributes
function createVideoLink(videoSrc, youtubeUrl) {
    return `<a href="${youtubeUrl}" target="_blank">
        <video autoplay loop muted playsinline class="fullwidth" loading="lazy">
            <source src="${videoSrc}" type="video/mp4">
        </video>
    </a>`;
} 