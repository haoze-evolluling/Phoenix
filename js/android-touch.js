/**
 * Android Touch Optimization
 * Optimizes touch interactions for Android devices
 */

// Detect if the device is Android
const isAndroid = () => {
    return /Android/i.test(navigator.userAgent);
};

// Initialize Android touch optimizations
const initAndroidTouchOptimization = () => {
    if (!isAndroid()) return;
    
    console.log('Android touch optimizations enabled');
    
    // Fix for 300ms tap delay on Android
    document.addEventListener('touchstart', function() {}, {passive: true});
    
    // Improve scrolling performance
    document.addEventListener('touchmove', function(e) {
        // Allow default scrolling behavior but with improved performance
    }, {passive: true});
    
    // Optimize touch target sizes for Android
    const optimizeTouchTargets = () => {
        const touchTargets = document.querySelectorAll('a, button, input, select, textarea, [role="button"]');
        touchTargets.forEach(target => {
            // Android recommended touch target size is at least 48dp x 48dp
            const style = window.getComputedStyle(target);
            const width = parseInt(style.width);
            const height = parseInt(style.height);
            
            if (width < 48 || height < 48) {
                // Add padding to small elements to increase touch target size
                target.style.padding = target.style.padding || '0';
                if (width < 48) {
                    const extraPadding = Math.floor((48 - width) / 2);
                    target.style.paddingLeft = extraPadding + 'px';
                    target.style.paddingRight = extraPadding + 'px';
                }
                if (height < 48) {
                    const extraPadding = Math.floor((48 - height) / 2);
                    target.style.paddingTop = extraPadding + 'px';
                    target.style.paddingBottom = extraPadding + 'px';
                }
            }
        });
    };
    
    // Run optimizations after DOM is fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', optimizeTouchTargets);
    } else {
        optimizeTouchTargets();
    }
    
    // Handle Android-specific back button
    window.addEventListener('popstate', function(e) {
        // Custom back button behavior if needed
    });
};

// Export functions
export { isAndroid, initAndroidTouchOptimization }; 