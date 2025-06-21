// 动画和工具函数模块
(function(global) {
    // 应用磁贴过渡效果
    function applyTileTransitions(container) {
        if (!container) return;
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (!prefersReducedMotion) {
            container.style.transition = 'grid-template-columns 0.5s ease-in-out';
        }
        const bookmarkItems = container.querySelectorAll('.bookmark-item');
        bookmarkItems.forEach((item, index) => {
            const newItem = item.cloneNode(true);
            item.parentNode.replaceChild(newItem, item);
            if (!prefersReducedMotion) {
                newItem.style.transition = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), ' +
                                         'box-shadow 0.3s ease, ' +
                                         'opacity 0.3s ease';
            }
            newItem.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.97)';
            }, { passive: true });
            newItem.addEventListener('touchend', function() {
                this.style.transform = 'scale(1)';
            }, { passive: true });
        });
    }

    // 应用磁贴布局变化动画
    function applyTileLayoutChange(container, newLayout) {
        if (!container) return;
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        container.classList.add('changing-layout');
        const bookmarkItems = container.querySelectorAll('.bookmark-item');
        const itemPositions = [];
        bookmarkItems.forEach(item => {
            const rect = item.getBoundingClientRect();
            itemPositions.push({
                left: rect.left,
                top: rect.top,
                width: rect.width,
                height: rect.height
            });
            item.style.transformOrigin = 'center center';
            item.style.willChange = 'transform, opacity';
        });
        if (prefersReducedMotion) {
            container.style.gridTemplateColumns = `repeat(${newLayout}, 1fr)`;
            container.classList.remove('changing-layout');
        } else {
            container.style.transition = 'none';
            container.style.gridTemplateColumns = `repeat(${newLayout}, 1fr)`;
            void container.offsetWidth;
            const newPositions = [];
            bookmarkItems.forEach(item => {
                const rect = item.getBoundingClientRect();
                newPositions.push({
                    left: rect.left,
                    top: rect.top,
                    width: rect.width,
                    height: rect.height
                });
            });
            bookmarkItems.forEach((item, index) => {
                if (index >= itemPositions.length) return;
                const oldPos = itemPositions[index];
                const newPos = newPositions[index];
                const deltaX = oldPos.left - newPos.left;
                const deltaY = oldPos.top - newPos.top;
                const scaleX = oldPos.width / newPos.width;
                const scaleY = oldPos.height / newPos.height;
                item.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${scaleX}, ${scaleY})`;
                item.style.transition = 'none';
                item.style.opacity = '0.9';
            });
            void container.offsetWidth;
            container.style.transition = 'grid-template-columns 0.75s cubic-bezier(0.2, 0.8, 0.2, 1)';
            bookmarkItems.forEach((item, index) => {
                setTimeout(() => {
                    item.style.transition = 'transform 0.75s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.75s cubic-bezier(0.2, 0.8, 0.2, 1)';
                    item.style.transform = '';
                    item.style.opacity = '1';
                    item.classList.add('layout-change-animation');
                    setTimeout(() => {
                        item.classList.remove('layout-change-animation');
                        if (index === bookmarkItems.length - 1) {
                            container.classList.remove('changing-layout');
                            bookmarkItems.forEach(cleanItem => {
                                setTimeout(() => {
                                    cleanItem.style.transform = '';
                                    cleanItem.style.transition = '';
                                    cleanItem.style.opacity = '';
                                    cleanItem.style.willChange = '';
                                }, 50);
                            });
                        }
                    }, 800);
                }, index * 50);
            });
        }
    }

    // 注入动画相关样式
    function injectPreferencesStyles() {
        if (document.getElementById('preferences-utils-style')) return;
        const styleElement = document.createElement('style');
        styleElement.id = 'preferences-utils-style';
        styleElement.textContent = `
            .changing-layout { pointer-events: none; }
            .tile-transition { animation: tileScale 0.3s ease-in-out forwards; }
            @keyframes tileScale {
                0% { transform: scale(0.95); opacity: 0.7; }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); opacity: 1; }
            }
            .bookmark-item {
                transition: transform 0.3s ease, box-shadow 0.3s ease, opacity 0.3s ease;
                will-change: transform, opacity;
                backface-visibility: hidden;
                perspective: 1000px;
            }
            .layout-change-animation {
                animation: layoutChange 0.75s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
                will-change: transform, opacity;
            }
            @keyframes layoutChange {
                0% { transform: scale(0.9); opacity: 0.7; }
                50% { transform: scale(1.05); opacity: 0.9; }
                100% { transform: scale(1); opacity: 1; }
            }
            #bookmarks-container {
                transition: grid-template-columns 0.75s cubic-bezier(0.2, 0.8, 0.2, 1);
            }
            .bookmark-item:hover { z-index: 10; }
            @media (hover: hover) {
                .bookmark-item:nth-child(3n+1):hover {
                    transform: translateY(-5px) rotate(-1deg);
                    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
                }
                .bookmark-item:nth-child(3n+2):hover {
                    transform: translateY(-7px);
                    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
                }
                .bookmark-item:nth-child(3n+3):hover {
                    transform: translateY(-5px) rotate(1deg);
                    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
                }
            }
            @media (hover: none) {
                .bookmark-item:active {
                    transform: scale(0.95);
                    opacity: 0.9;
                }
            }
            
            /* Toast提示样式 */
            .toast {
                position: fixed;
                bottom: 30px;
                left: 50%;
                transform: translateX(-50%);
                padding: 12px 24px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                z-index: 10000;
                font-size: 14px;
                opacity: 1;
                transition: opacity 0.3s ease;
                color: #fff;
            }
            
            .toast-success {
                background-color: #4CAF50;
            }
            
            .toast-info {
                background-color: var(--accent-color, #4a6cf7);
            }
            
            .toast-error {
                background-color: #F44336;
            }
            
            .toast-hide {
                opacity: 0;
            }
        `;
        document.head.appendChild(styleElement);
    }

    // 创建Toast提示
    function createToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        // 自动移除提示
        setTimeout(() => {
            toast.classList.add('toast-hide');
            setTimeout(() => {
                if (toast.parentNode) {
                    document.body.removeChild(toast);
                }
            }, 300);
        }, 3000);
        
        return toast;
    }

    // 为选项添加点击效果
    function addClickEffectToOptions(selector) {
        const items = document.querySelectorAll(selector);
        items.forEach(item => {
            // 移除可能已存在的事件监听器
            const newItem = item.cloneNode(true);
            item.parentNode.replaceChild(newItem, item);
            
            // 添加鼠标按下效果
            newItem.addEventListener('mousedown', function() {
                this.classList.add('option-active');
            });
            
            // 添加鼠标抬起效果
            newItem.addEventListener('mouseup', function() {
                this.classList.remove('option-active');
            });
            
            // 鼠标离开时也移除效果
            newItem.addEventListener('mouseleave', function() {
                this.classList.remove('option-active');
            });
        });
    }
    
    // 导出到全局
    global.PreferencesUtils = {
        applyTileTransitions,
        applyTileLayoutChange,
        injectPreferencesStyles,
        createToast,
        addClickEffectToOptions
    };
})(window);