/**
 * 点击波纹效果
 * 支持鼠标点击和触摸屏幕
 */
document.addEventListener('DOMContentLoaded', function() {
    // 需要添加波纹效果的元素选择器
    const rippleSelectors = [
        '.search-engine-btn', 
        '.icon-btn', 
        '.category-actions button', 
        '.bookmark-actions button'
    ];

    // 排除不需要波纹效果的元素
    const excludedSelectors = [
        'a[href="#"]',
        'a:not([href])',
        '.close-modal',
        '.bookmark-name',
        'a' // 排除所有超链接文本
    ];

    // 特别关注的元素选择器 - 仅保留缩放效果，无波纹效果
    const specialSelectors = [];

    // 为现有元素添加波纹效果
    addRippleEffect();

    // MutationObserver监听DOM变化，为新添加的元素添加波纹效果
    const observer = new MutationObserver(function(mutations) {
        let needsUpdate = false;
        
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                needsUpdate = true;
            }
        });
        
        if (needsUpdate) {
            // 使用requestAnimationFrame优化性能
            requestAnimationFrame(addRippleEffect);
        }
    });

    // 开始观察文档变化
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 首先处理特别关注的元素
    function forceRippleEffectOnSpecialElements() {
        specialSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                // 确保特别关注的元素始终有data-ripple属性
                element.removeAttribute('data-ripple');
                
                // 清除现有的事件监听器
                element.removeEventListener('mousedown', createRippleEffect);
                element.removeEventListener('touchstart', handleTouchStart);
                
                // 重新添加事件监听器
                element.addEventListener('mousedown', createRippleEffect);
                element.addEventListener('touchstart', handleTouchStart, { passive: true });
                
                // 标记为已添加波纹效果
                element.setAttribute('data-ripple', 'special');
            });
        });
    }

    // 添加波纹效果函数
    function addRippleEffect() {
        // 首先处理特别关注的元素
        forceRippleEffectOnSpecialElements();
        
        // 获取所有需要添加效果的元素
        let elements = [];
        rippleSelectors.forEach(selector => {
            elements = [...elements, ...document.querySelectorAll(selector)];
        });
        
        // 排除不需要波纹效果的元素
        const excludedElements = document.querySelectorAll(excludedSelectors.join(', '));
        const filteredElements = Array.from(elements).filter(el => {
            return !Array.from(excludedElements).some(excluded => excluded === el) && 
                   el.getAttribute('data-ripple') !== 'special'; // 排除已特别处理的元素
        });
        
        filteredElements.forEach(element => {
            // 避免重复添加事件监听器
            if (element.getAttribute('data-ripple') === 'added') {
                return;
            }
            
            // 标记为已添加波纹效果
            element.setAttribute('data-ripple', 'added');
            
            // 鼠标按下事件
            element.addEventListener('mousedown', createRippleEffect);
            
            // 触摸开始事件
            element.addEventListener('touchstart', handleTouchStart, { passive: true });
        });
    }
    
    // 处理触摸事件
    function handleTouchStart(e) {
        const touch = e.touches[0];
        e.clientX = touch.clientX;
        e.clientY = touch.clientY;
        createRippleEffect.call(this, e);
    }
    
    // 创建波纹效果的函数
    function createRippleEffect(e) {
        // 清除可能存在的旧波纹元素
        const oldRipples = this.querySelectorAll('.ripple');
        oldRipples.forEach(ripple => {
            if (ripple.parentNode === this) {
                this.removeChild(ripple);
            }
        });
        
        // 计算相对于元素的点击坐标
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // 创建波纹元素
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        
        // 获取元素的最大尺寸
        const elementSize = Math.max(rect.width, rect.height);
        
        // 设置波纹尺寸，取元素对角线长度确保可以覆盖整个元素
        const diameter = Math.max(elementSize, Math.sqrt(Math.pow(rect.width, 2) + Math.pow(rect.height, 2)));
        
        // 设置波纹大小
        ripple.style.width = ripple.style.height = `${diameter}px`;
        
        // 定位波纹元素，使其中心在点击位置
        ripple.style.left = `${x - (diameter / 2)}px`;
        ripple.style.top = `${y - (diameter / 2)}px`;
        
        // 将波纹元素添加到被点击的元素中
        this.appendChild(ripple);
        
        // 动画结束后移除波纹元素
        setTimeout(() => {
            if (ripple && ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 750); // 与CSS动画时长一致
    }
}); 