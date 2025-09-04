// 核心功能模块 - 应用初始化和基础功能

// 全局变量 - 将在设置模块中初始化
let showSeconds = true;
let use12HourFormat = false;

// DOM 加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// 初始化应用
function initializeApp() {
    // 首先初始化设置，确保其他模块能获取到正确的设置值
    initializeSettings();
    
    // 然后初始化其他功能
    initializeTime();
    initializeNavigation();
    initializeSearch();
    initializeShortcuts();
    initializeBookmarks();
    initializeInteractiveEffects();
    startTimeUpdate();
    
    // 添加键盘快捷键支持
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    // 确保点击反馈系统在最后初始化
    setTimeout(() => {
        if (window.clickFeedback && window.clickFeedback.initializeClickFeedback) {
            window.clickFeedback.initializeClickFeedback();
        }
    }, 100);
    
    console.log('新标签页已加载完成！');
}

// 初始化交互效果
function initializeInteractiveEffects() {
    // 为卡片元素添加基础玻璃态效果
    const cardElements = document.querySelectorAll(`
        .time-display, .search-box, .quick-links, .bookmark-category,
        .tool-card, .setting-group, .section h2, .navbar
    `);
    
    cardElements.forEach(element => {
        element.classList.add('glass-morphism');
    });
}

// 改变背景样式
function changeBackgroundStyle(style) {
    const root = document.documentElement;
    
    switch (style) {
        case 'gradient':
            root.style.setProperty('--bg-primary', 'linear-gradient(135deg, #dbeafe 0%, #e0e7ff 25%, #f3e8ff 50%, #fce7f3 75%, #fef7f7 100%)');
            break;
        case 'solid':
            // 使用当前保存的纯色
            const settings = window.SettingsCache ? window.SettingsCache.getAllSettings() : { currentSolidColor: '#f8fafc' };
            root.style.setProperty('--bg-primary', settings.currentSolidColor);
            break;
    }
    
    // 更新设置缓存
    if (window.SettingsCache) {
        window.SettingsCache.updateSetting('backgroundStyle', style);
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
    
    // 重新初始化交互效果以确保动态加载的元素也有效果
    setTimeout(() => {
        initializeInteractiveEffects();
    }, 100);
});

// 恢复保存的设置
function restoreSettings() {
    // 这个函数现在由设置模块的 loadSettingsFromCache 函数处理
    // 保持函数存在以维持向后兼容性
    if (window.SettingsCache) {
        const settings = window.SettingsCache.getAllSettings();
        console.log('设置已从缓存恢复:', settings);
    }
}

// 页面加载完成后恢复设置
document.addEventListener('DOMContentLoaded', function() {
    restoreSettings();
});

// 监听设置变更事件
document.addEventListener('settingsChanged', function(event) {
    const { settingName, newValue } = event.detail;
    console.log(`设置已变更: ${settingName} = ${newValue}`);
    
    // 根据设置名称执行相应的更新
    switch (settingName) {
        case 'showSeconds':
            updateTime();
            break;
        case 'use12HourFormat':
            updateTime();
            break;
        case 'currentSolidColor':
            // 如果当前是纯色背景，立即应用新颜色
            const bgSelector = document.querySelector('.bg-selector');
            if (bgSelector && bgSelector.value === 'solid') {
                const root = document.documentElement;
                root.style.setProperty('--bg-primary', newValue);
            }
            break;
    }
});

// 导出核心功能到全局作用域
if (typeof window !== 'undefined') {
    window.newTabCore = {
        showSeconds,
        initializeApp,
        changeBackgroundStyle,
        restoreSettings
    };
}