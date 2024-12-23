// Helper function to create a YouTube embed with proper settings
function createYouTubeEmbed(videoId, options = {}) {
    const {
        listId = null,
        title = "YouTube video player",
        allowFullscreen = true,
    } = options;

    let src = `https://www.youtube.com/embed/${videoId}?enablejsapi=1`;
    if (listId) {
        src += `&list=${listId}`;
    }

    return `<div class="video-container">
        <iframe 
            src="${src}"
            title="${title}"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerpolicy="strict-origin-when-cross-origin"
            ${allowFullscreen ? 'allowfullscreen' : ''}>
        </iframe>
    </div>`;
}

// Initialize YouTube API functionality for all embeds
document.addEventListener('DOMContentLoaded', function() {
    // Function to pause all YouTube videos in an element
    window.pauseYouTubeVideos = function(element) {
        const iframes = element.querySelectorAll('iframe[src*="youtube.com"]');
        iframes.forEach(iframe => {
            iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
        });
    };

    // Ensure all YouTube iframes have API enabled
    document.querySelectorAll('iframe[src*="youtube.com"]').forEach(iframe => {
        let src = iframe.src;
        if (src.indexOf('enablejsapi=1') === -1) {
            src = (src.indexOf('?') === -1) ? src + '?enablejsapi=1' : src + '&enablejsapi=1';
            iframe.src = src;
        }
    });
}); 