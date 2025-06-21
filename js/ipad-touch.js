/**
 * iPad Touch Optimization
 * Optimizes touch interactions for iPad devices
 */

// Detect if the device is an iPad
const isIPad = () => {
    // iPad detection is tricky since newer iPadOS reports as MacOS
    // Check for iPad in user agent or use screen size + touch capability
    const isIpadOS = /iPad/i.test(navigator.userAgent);
    const isIpadModern = navigator.maxTouchPoints > 0 && 
                        /MacIntel/i.test(navigator.platform) && 
                        window.innerWidth > 600;
    
    return isIpadOS || isIpadModern;
};

// Initialize iPad touch optimizations
const initIPadTouchOptimization = () => {
    if (!isIPad()) return;
    
    console.log('iPad touch optimizations enabled');
    
    // Apply iPad-specific meta tags
    applyIPadMetaTags();
    
    // Detect iPad model for more specific optimizations
    detectIPadModel();
    
    // Optimize for split-screen multitasking
    window.addEventListener('resize', () => {
        // Adjust layout based on current screen dimensions
        const isLandscape = window.innerWidth > window.innerHeight;
        const isSplitView = window.innerWidth < 768 && isIPad();
        
        document.body.classList.toggle('ipad-landscape', isLandscape);
        document.body.classList.toggle('ipad-portrait', !isLandscape);
        document.body.classList.toggle('ipad-split-view', isSplitView);
    });
    
    // Trigger initial resize event to set correct classes
    window.dispatchEvent(new Event('resize'));
    
    // Optimize for Apple Pencil interactions
    document.addEventListener('pointerdown', function(e) {
        if (e.pointerType === 'pen') {
            // Special handling for Apple Pencil
            document.body.classList.add('pencil-active');
        }
    });
    
    document.addEventListener('pointerup', function(e) {
        if (e.pointerType === 'pen') {
            document.body.classList.remove('pencil-active');
        }
    });
    
    // Optimize touch targets for iPad
    const optimizeIPadTouchTargets = () => {
        const touchTargets = document.querySelectorAll('a, button, input, select, textarea, [role="button"]');
        touchTargets.forEach(target => {
            // iPad recommended touch target size is at least 44px x 44px
            const style = window.getComputedStyle(target);
            const width = parseInt(style.width);
            const height = parseInt(style.height);
            
            if (width < 44 || height < 44) {
                // Add padding to small elements to increase touch target size
                target.style.padding = target.style.padding || '0';
                if (width < 44) {
                    const extraPadding = Math.floor((44 - width) / 2);
                    target.style.paddingLeft = extraPadding + 'px';
                    target.style.paddingRight = extraPadding + 'px';
                }
                if (height < 44) {
                    const extraPadding = Math.floor((44 - height) / 2);
                    target.style.paddingTop = extraPadding + 'px';
                    target.style.paddingBottom = extraPadding + 'px';
                }
            }
        });
    };
    
    // Apply iPad-specific meta tags
    function applyIPadMetaTags() {
        // Add meta tags for iPad web app capabilities
        const metaTags = [
            { name: 'apple-mobile-web-app-capable', content: 'yes' },
            { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
            { name: 'apple-mobile-web-app-title', content: 'Phoenix导航' }
        ];
        
        metaTags.forEach(tag => {
            let metaTag = document.querySelector(`meta[name="${tag.name}"]`);
            if (!metaTag) {
                metaTag = document.createElement('meta');
                metaTag.name = tag.name;
                metaTag.content = tag.content;
                document.head.appendChild(metaTag);
            }
        });
    }
    
    // Detect iPad model for specific optimizations
    function detectIPadModel() {
        const width = window.screen.width;
        const height = window.screen.height;
        const maxDimension = Math.max(width, height);
        
        if (maxDimension <= 1024) {
            // Standard iPad, iPad Air
            document.body.classList.add('ipad-standard');
        } else {
            // iPad Pro
            document.body.classList.add('ipad-pro');
        }
    }
    
    // Handle orientation changes on iPad
    window.addEventListener('orientationchange', function() {
        // Adjust UI for orientation
        setTimeout(() => {
            const isLandscape = window.orientation === 90 || window.orientation === -90;
            document.body.classList.toggle('ipad-landscape', isLandscape);
            document.body.classList.toggle('ipad-portrait', !isLandscape);
            
            // Dispatch custom event
            window.dispatchEvent(new CustomEvent('ipad-orientation-change', {
                detail: { isLandscape }
            }));
        }, 100);
    });
    
    // Improve scrolling performance
    document.addEventListener('touchmove', function(e) {
        // Allow default scrolling behavior but with improved performance
    }, {passive: true});
    
    // Run optimizations after DOM is fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', optimizeIPadTouchTargets);
    } else {
        optimizeIPadTouchTargets();
    }
};

// Export functions
export { isIPad, initIPadTouchOptimization }; 