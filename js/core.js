// 核心功能模块 - 应用初始化和基础功能

// 全局变量
let currentSearchEngine = localStorage.getItem('searchEngine') || 'google';
let showSeconds = localStorage.getItem('showSeconds') !== 'false';

// 搜索引擎配置
const searchEngines = {
    google: 'https://www.google.com/search?q=',
    baidu: 'https://www.baidu.com/s?wd=',
    bing: 'https://www.bing.com/search?q='
};

// DOM 加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// 初始化应用
function initializeApp() {
    initializeTime();
    initializeNavigation();
    initializeSearch();
    initializeSettings();
    initializeInteractiveEffects();
    startTimeUpdate();
    
    // 添加键盘快捷键支持
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    console.log('新标签页已加载完成！');
}

// 初始化交互效果
function initializeInteractiveEffects() {
    // 为所有可交互元素添加波纹效果
    const interactiveElements = document.querySelectorAll(`
        .nav-btn, .engine-btn, .link-card, .bookmark-item, 
        .tool-card, button, [role="button"]
    `);
    
    interactiveElements.forEach(element => {
        element.classList.add('interactive-element');
        element.addEventListener('click', addRippleEffect);
        element.addEventListener('mousedown', addActiveEffect);
        element.addEventListener('mouseup', removeActiveEffect);
        element.addEventListener('mouseleave', removeActiveEffect);
    });
    
    // 为卡片元素添加悬停效果和玻璃态效果
    const cardElements = document.querySelectorAll(`
        .time-display, .search-box, .quick-links, .bookmark-category,
        .tool-card, .setting-group, .section h2, .navbar
    `);
    
    cardElements.forEach(element => {
        element.classList.add('hover-lift');
        element.classList.add('glass-morphism');
        element.classList.add('glass-wave');
    });
    
    // 初始化玻璃态增强效果
    initializeGlassMorphismEffects();
}

// 初始化玻璃态增强效果
function initializeGlassMorphismEffects() {
    // 为主要容器添加玻璃态效果
    const glassElements = document.querySelectorAll(`
        .navbar, .time-display, .search-box, .quick-links,
        .bookmark-category, .tool-card, .setting-group
    `);
    
    glassElements.forEach(element => {
        // 添加动态模糊强度
        element.addEventListener('mouseenter', () => {
            element.style.backdropFilter = 'blur(25px)';
            element.style.webkitBackdropFilter = 'blur(25px)';
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.backdropFilter = 'blur(20px)';
            element.style.webkitBackdropFilter = 'blur(20px)';
        });
    });
    
    // 添加液态玻璃动态效果
    addLiquidGlassEffects();
}

// 添加液态玻璃动态效果
function addLiquidGlassEffects() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('glass-visible');
                // 添加延迟动画效果
                setTimeout(() => {
                    entry.target.style.animation = 'glassWave 4s ease-in-out infinite';
                }, Math.random() * 1000);
            }
        });
    }, {
        threshold: 0.1
    });
    
    document.querySelectorAll('.glass-wave').forEach(el => {
        observer.observe(el);
    });
}

// 添加波纹效果
function addRippleEffect(e) {
    const element = e.currentTarget;
    element.classList.add('ripple-effect');
    
    // 清除之前的波纹效果
    setTimeout(() => {
        element.classList.remove('ripple-effect');
    }, 600);
}

// 添加按下效果
function addActiveEffect(e) {
    const element = e.currentTarget;
    element.classList.add('active-scale');
}

// 移除按下效果
function removeActiveEffect(e) {
    const element = e.currentTarget;
    element.classList.remove('active-scale');
}





// 改变背景样式
function changeBackgroundStyle(style) {
    const root = document.documentElement;
    
    switch (style) {
        case 'gradient':
            root.style.setProperty('--bg-primary', 'linear-gradient(135deg, #dbeafe 0%, #e0e7ff 25%, #f3e8ff 50%, #fce7f3 75%, #fef7f7 100%)');
            break;
        case 'solid':
            root.style.setProperty('--bg-primary', '#f8fafc');
            break;
    }
    
    showMessage('背景样式已更改', 'success');
}



// 键盘快捷键处理
function handleKeyboardShortcuts(e) {
    // Ctrl/Cmd + K：聚焦搜索框
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('search-input').focus();
    }
    
    // Escape：清空搜索框
    if (e.key === 'Escape') {
        const searchInput = document.getElementById('search-input');
        if (document.activeElement === searchInput) {
            searchInput.value = '';
            searchInput.blur();
        }
    }
    
    // 数字键1-4：切换页面
    if (e.key >= '1' && e.key <= '4' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const sections = ['home', 'bookmarks', 'tools', 'settings'];
        const targetSection = sections[parseInt(e.key) - 1];
        const targetButton = document.querySelector(`[data-section="${targetSection}"]`);
        if (targetButton) {
            targetButton.click();
        }
    }
}

// 页面可见性变化处理
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        // 页面变为可见时更新时间
        updateTime();
    }
});

// 窗口大小变化处理
window.addEventListener('resize', () => {
    // 可以在这里添加响应式布局调整
    console.log('窗口大小已改变');
});

// 错误处理
window.addEventListener('error', (e) => {
    console.error('页面错误：', e.error);
});

// 确保页面完全加载
window.addEventListener('load', () => {
    console.log('页面资源加载完成');
    
    // 添加加载完成的视觉反馈
    document.body.classList.add('loaded');
    
    // 重新初始化交互效果以确保动态加载的元素也有效果
    setTimeout(() => {
        initializeInteractiveEffects();
    }, 100);
});

// 导出核心功能到全局作用域
if (typeof window !== 'undefined') {
    window.newTabCore = {
        currentSearchEngine,
        showSeconds,
        searchEngines,
        initializeApp,
        changeBackgroundStyle,
        addRippleEffect,
        addActiveEffect,
        removeActiveEffect
    };
}
