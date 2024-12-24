registerAnomalySpecificInfo('powerup', {
    content: `Check out some of the best footage of powerups!
    <div class="holo-collapsible">
        <div class="holo-collapsible-header">
            <span>View Footage Examples</span>
            <i class="fas fa-chevron-down"></i>
        </div>
        <div class="holo-collapsible-content" data-gifs='[
            {
                "src": "anomalies/powerup/Examples of CE-5 Footage.gif",
                "href": "https://youtu.be/M0sY6FdlNeQ?t=188"
            },
            {
                "src": "anomalies/powerup/The CE-5 Protocol - Port Austin, Michigan USA.gif",
                "href": "https://youtu.be/cbYj_IrX_vA?t=399"
            },
            {
                "src": "anomalies/powerup/UFO Best Power UP July 29 Wow!.gif"
            }
        ]'>
        </div>
    </div>`
});

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.holo-collapsible-header').forEach(header => {
        header.addEventListener('click', () => {
            const collapsible = header.closest('.holo-collapsible');
            const content = collapsible.querySelector('.holo-collapsible-content');
            
            if (!collapsible.classList.contains('open') && !content.hasAttribute('loaded')) {
                // Load GIFs on first open
                const gifs = JSON.parse(content.dataset.gifs);
                content.innerHTML = gifs.map(gif => 
                    gif.href 
                        ? `<a href="${gif.href}" target="_blank">
                             <img src="${gif.src}" class="fullwidth">
                           </a>`
                        : `<img src="${gif.src}" class="fullwidth">`
                ).join('\n');
                content.setAttribute('loaded', 'true');
            }
            
            collapsible.classList.toggle('open');
        });
    });
}); 