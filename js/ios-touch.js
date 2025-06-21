/**
 * iOS Touch Optimization
 * Optimizes touch interactions for iPhone devices
 */

// Detect if the device is an iPhone
const isIOS = () => {
    return /iPhone|iPod/i.test(navigator.userAgent);
};

// Initialize iOS touch optimizations
const initIOSTouchOptimization = () => {
    if (!isIOS()) return;
    
    console.log('iOS touch optimizations enabled');
    
    // Apply iOS-specific meta tags
    applyIOSMetaTags();
    
    // Prevent double-tap to zoom
    document.addEventListener('touchend', function(e) {
        const now = Date.now();
        const lastTouch = this.lastTouch || now + 1;
        const delta = now - lastTouch;
        if (delta < 500 && delta > 0) {
            e.preventDefault();
        }
        this.lastTouch = now;
    }, false);
    
    // Fix for iOS overscroll behavior (rubber-banding)
    document.body.addEventListener('touchmove', function(e) {
        if (e.target.closest('.scrollable')) {
            // Allow scrolling in elements with the 'scrollable' class
            return;
        }
        e.preventDefault();
    }, { passive: false });
    
    // Fix for iOS hover states persisting after touch
    document.addEventListener('touchend', function() {
        // Small timeout to ensure the hover state is removed
        setTimeout(function() {
            const activeElement = document.activeElement;
            if (activeElement && activeElement.blur && activeElement !== document.body) {
                activeElement.blur();
            }
        }, 100);
    });
    
    // Optimize touch targets for iOS
    const optimizeIOSTouchTargets = () => {
        const touchTargets = document.querySelectorAll('a, button, input, select, textarea, [role="button"]');
        touchTargets.forEach(target => {
            // iOS recommended touch target size is at least 44px x 44px
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
    
    // Detect iPhone model for more specific optimizations
    const detectIPhoneModel = () => {
        const width = window.screen.width;
        const height = window.screen.height;
        const maxDimension = Math.max(width, height);
        
        if (maxDimension <= 667) {
            // iPhone 8, SE, etc.
            document.body.classList.add('iphone-small');
        } else if (maxDimension <= 812) {
            // iPhone X, 11 Pro, 12 mini, etc.
            document.body.classList.add('iphone-medium');
        } else {
            // iPhone Plus, Pro Max, etc.
            document.body.classList.add('iphone-large');
        }
    };
    
    // Apply iOS-specific meta tags
    const applyIOSMetaTags = () => {
        // Add meta tags for iOS web app capabilities
        const metaTags = [
            { name: 'apple-mobile-web-app-capable', content: 'yes' },
            { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
            { name: 'format-detection', content: 'telephone=no' }
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
    };
    
    // Handle orientation changes on iOS
    window.addEventListener('orientationchange', function() {
        // Adjust UI for orientation
        setTimeout(() => {
            const isLandscape = window.orientation === 90 || window.orientation === -90;
            document.body.classList.toggle('ios-landscape', isLandscape);
            document.body.classList.toggle('ios-portrait', !isLandscape);
            
            // Dispatch custom event
            window.dispatchEvent(new CustomEvent('ios-orientation-change', {
                detail: { isLandscape }
            }));
        }, 100);
    });
    
    // Run optimizations after DOM is fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            optimizeIOSTouchTargets();
            detectIPhoneModel();
        });
    } else {
        optimizeIOSTouchTargets();
        detectIPhoneModel();
    }
    
    // Trigger initial orientation check
    const isLandscape = window.orientation === 90 || window.orientation === -90;
    document.body.classList.toggle('ios-landscape', isLandscape);
    document.body.classList.toggle('ios-portrait', !isLandscape);
};

// Export functions
export { isIOS, initIOSTouchOptimization }; 