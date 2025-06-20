/**
 * animations.js - 网页交互动画效果
 * 为FY-Next导航网站提供现代化的交互动画效果
 */

// 等待DOM完全加载后执行
document.addEventListener('DOMContentLoaded', () => {
    // 初始化所有动画效果
    initializeAnimations();
    
    // 监听主题变化事件，更新动画效果
    document.addEventListener('themeChange', (e) => {
        adjustAnimationsForTheme(e.detail.theme);
    });
});

/**
 * 初始化所有动画效果
 */
function initializeAnimations() {
    // 检查用户是否开启了动画效果
    const animationEnabled = localStorage.getItem('animation-toggle') !== 'false';
    
    if (animationEnabled) {
        initializeHoverEffects();
        initializeScrollAnimations();
        initializePageTransitions();
        initializeFloatingElements();
        
        // 仅在非全屏模式下初始化波浪背景
        if (!isFullscreenMode()) {
            initializeWavyBackground();
        }
        
        // 根据当前主题调整动画
        if (typeof ThemeManager !== 'undefined') {
            adjustAnimationsForTheme(ThemeManager.getCurrentTheme());
        }
    }
    
    // 设置动画开关的事件监听器
    const animationToggle = document.getElementById('animation-toggle');
    if (animationToggle) {
        animationToggle.addEventListener('change', (e) => {
            localStorage.setItem('animation-toggle', e.target.checked);
            if (e.target.checked) {
                enableAnimations();
            } else {
                disableAnimations();
            }
        });
    }
    
    // 监听全屏变化
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);
}

/**
 * 检测是否处于全屏模式
 */
function isFullscreenMode() {
    return (
        document.fullscreenElement || 
        document.webkitFullscreenElement || 
        document.mozFullScreenElement || 
        document.msFullscreenElement
    );
}

/**
 * 处理全屏模式变化
 */
function handleFullscreenChange() {
    if (isFullscreenMode()) {
        // 全屏模式下移除波浪背景
        const wavyBg = document.querySelector('.wavy-background');
        if (wavyBg) {
            wavyBg.remove();
        }
        
        // 全屏模式下确保类别和书签可见
        showAllBookmarks();
    } else {
        // 非全屏模式下，如果动画已启用，则重新添加波浪背景
        const animationEnabled = localStorage.getItem('animation-toggle') !== 'false';
        if (animationEnabled) {
            initializeWavyBackground();
        }
    }
}

/**
 * 确保所有书签都可见
 */
function showAllBookmarks() {
    // 移除可能导致不可见的类并重置透明度
    const categories = document.querySelectorAll('.category');
    categories.forEach(category => {
        category.style.opacity = '1';
        category.classList.add('fade-in-animation');
    });
    
    const bookmarks = document.querySelectorAll('.bookmark-item');
    bookmarks.forEach(bookmark => {
        bookmark.style.opacity = '1';
    });
}

/**
 * 初始化悬停效果
 */
function initializeHoverEffects() {
    // 为书签卡片添加悬停效果
    const bookmarks = document.querySelectorAll('.bookmark-item');
    bookmarks.forEach(bookmark => {
        bookmark.addEventListener('mouseenter', (e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.15)';
        });
        
        bookmark.addEventListener('mouseleave', (e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
        });
    });
    
    // 为按钮添加脉冲效果
    const buttons = document.querySelectorAll('.icon-btn, .btn-primary, .btn-secondary');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', (e) => {
            e.currentTarget.classList.add('pulse-animation');
        });
        
        button.addEventListener('mouseleave', (e) => {
            e.currentTarget.classList.remove('pulse-animation');
        });
    });
}

/**
 * 初始化滚动动画
 */
function initializeScrollAnimations() {
    // 为类别容器添加渐入效果
    const categories = document.querySelectorAll('.category');
    
    // 先确保所有分类都是可见的（防止初始不显示）
    categories.forEach(category => {
        category.style.opacity = '1';
    });
    
    // 创建Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-animation');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    // 观察所有类别元素
    if (!isFullscreenMode()) {
        categories.forEach(category => {
            observer.observe(category);
        });
    }
}

/**
 * 初始化页面过渡动画
 */
function initializePageTransitions() {
    // 为模态框添加过渡动画
    const modals = document.querySelectorAll('.modal');
    
    modals.forEach(modal => {
        // 获取打开此模态框的按钮
        const modalId = modal.id;
        const openBtn = document.querySelector(`[data-target="${modalId}"]`) || 
                        document.getElementById(`${modalId.replace('-modal', '')}-btn`);
        
        // 移除打开时添加的动画类，直接使用style.css中的缩放动画
        if (openBtn) {
            openBtn.addEventListener('click', () => {
                // 不添加modal-animation-in类，因为style.css中已有缩放动画
            });
        }
        
        // 关闭按钮动画
        const closeBtn = modal.querySelector('.close-modal');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.classList.add('modal-animation-out');
                setTimeout(() => {
                    modal.classList.remove('modal-animation-out');
                }, 500);
            });
        }
    });
}

/**
 * 初始化浮动元素动画
 */
function initializeFloatingElements() {
    // 为Logo添加轻微浮动动画
    const logo = document.querySelector('.logo');
    if (logo) {
        setInterval(() => {
            logo.classList.toggle('float-animation');
        }, 3000);
    }
    
    // 为搜索框添加轻微浮动动画
    const searchContainer = document.querySelector('.search-container');
    if (searchContainer) {
        searchContainer.classList.add('subtle-float-animation');
    }
}

/**
 * 初始化波浪背景效果
 */
function initializeWavyBackground() {
    // 检查是否已存在波浪背景，如果存在则先移除
    const existingWavy = document.querySelector('.wavy-background');
    if (existingWavy) {
        existingWavy.remove();
    }
    
    // 检查是否使用默认背景
    const bgType = localStorage.getItem('background-type') || 'default';
    
    if (bgType === 'default' && !isFullscreenMode()) {
        // 创建波浪背景元素
        const wavyBg = document.createElement('div');
        wavyBg.classList.add('wavy-background');
        
        // 创建3个波浪
        for (let i = 1; i <= 3; i++) {
            const wave = document.createElement('div');
            wave.classList.add('wave', `wave-${i}`);
            wavyBg.appendChild(wave);
        }
        
        // 添加到container的最前面，而不是body
        const container = document.querySelector('.container');
        if (container) {
            container.insertBefore(wavyBg, container.firstChild);
        }
        
        // 随机改变波浪的位置和速度
        animateWaves();
    }
}

/**
 * 动画波浪背景
 */
function animateWaves() {
    const waves = document.querySelectorAll('.wave');
    
    waves.forEach((wave, index) => {
        // 较低的动画强度
        const duration = 15 + Math.random() * 10;
        const delay = index * 1.5;
        
        wave.style.animation = `wave ${duration}s ease-in-out ${delay}s infinite alternate`;
    });
}

/**
 * 启用所有动画
 */
function enableAnimations() {
    document.body.classList.remove('no-animations');
    initializeAnimations();
}

/**
 * 禁用所有动画
 */
function disableAnimations() {
    document.body.classList.add('no-animations');
    
    // 移除波浪背景
    const wavyBg = document.querySelector('.wavy-background');
    if (wavyBg) {
        wavyBg.remove();
    }
    
    // 重置所有动画状态
    resetAnimationStates();
    
    // 确保所有书签可见
    showAllBookmarks();
}

/**
 * 重置所有动画状态
 */
function resetAnimationStates() {
    // 重置书签卡片样式
    const bookmarks = document.querySelectorAll('.bookmark-item');
    bookmarks.forEach(bookmark => {
        bookmark.style.transform = '';
        bookmark.style.boxShadow = '';
    });
    
    // 移除脉冲效果
    const pulseElements = document.querySelectorAll('.pulse-animation');
    pulseElements.forEach(el => {
        el.classList.remove('pulse-animation');
    });
    
    // 移除浮动效果
    const floatElements = document.querySelectorAll('.float-animation, .subtle-float-animation');
    floatElements.forEach(el => {
        el.classList.remove('float-animation');
        el.classList.remove('subtle-float-animation');
    });
}

// 添加窗口调整大小事件处理器
window.addEventListener('resize', () => {
    // 重新初始化部分需要响应布局变化的动画
    const animationEnabled = localStorage.getItem('animation-toggle') !== 'false';
    if (animationEnabled) {
        // 重置并重新初始化基于布局的动画
        resetAnimationStates();
        initializeHoverEffects();
        
        if (!isFullscreenMode()) {
            initializeScrollAnimations();
        } else {
            showAllBookmarks();
        }
    }
});

/**
 * 根据主题调整动画效果
 */
function adjustAnimationsForTheme(theme) {
    const wavyBg = document.querySelector('.wavy-background');
    if (!wavyBg) return;
    
    if (theme === 'dark') {
        // 暗色主题波浪效果
        wavyBg.style.opacity = '0.15';
        wavyBg.querySelectorAll('path').forEach(path => {
            path.setAttribute('fill', '#ffffff');
        });
    } else {
        // 亮色主题波浪效果
        wavyBg.style.opacity = '0.1';
        wavyBg.querySelectorAll('path').forEach(path => {
            path.setAttribute('fill', '#000000');
        });
    }
} 