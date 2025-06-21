/**
 * Touch Manager
 * Main module to integrate all device-specific touch optimizations
 */

import { isAndroid, initAndroidTouchOptimization } from './android-touch.js';
import { isIOS, initIOSTouchOptimization } from './ios-touch.js';
import { isIPad, initIPadTouchOptimization } from './ipad-touch.js';

// Initialize all touch optimizations
const initTouchOptimizations = () => {
    // Apply general touch optimizations for all devices
    applyGeneralTouchOptimizations();
    
    // Apply device-specific optimizations
    initAndroidTouchOptimization();
    initIOSTouchOptimization();
    initIPadTouchOptimization();
    
    console.log('Touch optimizations initialized');
};

// General touch optimizations that apply to all touch devices
const applyGeneralTouchOptimizations = () => {
    // Check if device has touch capability
    if (!('ontouchstart' in window)) {
        return;
    }
    
    console.log('General touch optimizations enabled');
    
    // Prevent 300ms tap delay on all browsers
    document.addEventListener('touchstart', function() {}, {passive: true});
    
    // Improve scrolling performance
    document.addEventListener('touchmove', function(e) {
        // Allow default scrolling behavior but with improved performance
    }, {passive: true});
    
    // Add touch-device class to body for CSS targeting
    document.body.classList.add('touch-device');
    
    // Handle orientation changes
    window.addEventListener('orientationchange', function() {
        // Small delay to ensure the orientation has fully changed
        setTimeout(() => {
            // Dispatch custom event that other components can listen for
            window.dispatchEvent(new CustomEvent('touch-orientation-change', {
                detail: {
                    orientation: window.orientation
                }
            }));
        }, 100);
    });
    
    // Fix for input focus issues on touch devices
    document.addEventListener('touchend', function(e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
            // Don't zoom on input focus for iOS
            const viewportMeta = document.querySelector('meta[name="viewport"]');
            if (viewportMeta) {
                const originalContent = viewportMeta.getAttribute('content');
                viewportMeta.setAttribute('content', originalContent + ', maximum-scale=1.0');
                setTimeout(function() {
                    viewportMeta.setAttribute('content', originalContent);
                }, 300);
            }
        }
    });
};

// Detect device type
const detectDeviceType = () => {
    if (isIPad()) {
        return 'ipad';
    } else if (isIOS()) {
        return 'ios';
    } else if (isAndroid()) {
        return 'android';
    } else if ('ontouchstart' in window) {
        return 'touch';
    } else {
        return 'desktop';
    }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', initTouchOptimizations);

// Export functions
export { initTouchOptimizations, detectDeviceType }; 