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

    // 修复磁贴点击问题
    const fixIPadTouchInteractions = () => {
        // 监听DOM变化，确保新添加的元素也能正确响应触控
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.addedNodes.length) {
                    // 为新添加的可点击元素增强触控响应
                    enhanceTouchTargets();
                }
            }
        });

        // 开始观察DOM变化
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // 增强触控响应
        function enhanceTouchTargets() {
            const bookmarkCards = document.querySelectorAll('.bookmark-card');
            bookmarkCards.forEach(card => {
                // 去除原有的点击事件监听器，防止重复绑定
                const newCard = card.cloneNode(true);
                card.parentNode.replaceChild(newCard, card);
                
                // 添加触控专用事件处理
                newCard.addEventListener('touchstart', function(e) {
                    // 添加视觉反馈
                    this.classList.add('touch-active');
                    // 阻止默认行为防止iOS特殊处理导致的点击问题
                    e.preventDefault();
                }, {passive: false});
                
                newCard.addEventListener('touchend', function(e) {
                    // 移除视觉反馈
                    this.classList.remove('touch-active');
                    
                    // 获取原始点击目标的href
                    const linkElement = this.querySelector('a');
                    if (linkElement && linkElement.href) {
                        // 直接触发跳转
                        window.location.href = linkElement.href;
                    }
                    
                    e.preventDefault();
                }, {passive: false});
            });
        }

        // 初始化触控增强
        enhanceTouchTargets();
    };
    
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
        document.addEventListener('DOMContentLoaded', () => {
            optimizeIPadTouchTargets();
            fixIPadTouchInteractions(); // 添加修复磁贴点击函数
        });
    } else {
        optimizeIPadTouchTargets();
        fixIPadTouchInteractions(); // 添加修复磁贴点击函数
    }
};

// Export functions
export { isIPad, initIPadTouchOptimization }; 