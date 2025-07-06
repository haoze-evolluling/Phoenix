/**
 * Phoenix 主页 - 主JavaScript文件
 */

// 确保页面完全加载后再执行所有初始化
document.addEventListener('DOMContentLoaded', function() {
    // 先初始化UI效果
    initUI();
    
    // 再初始化时钟
    initClock();
    
    // 最后初始化搜索功能（不再自动聚焦搜索框）
    initSearch();
});

// 确保页面资源完全加载后再执行额外优化
window.addEventListener('load', function() {
    // 强制重新计算布局，确保过渡效果更加平滑
    document.body.offsetHeight;
    
    // 页面加载完成后延迟500ms聚焦搜索框
    setTimeout(() => {
        const searchInput = document.getElementById('search-input');
        searchInput.focus();
        
        // 触发一次焦点事件，确保模糊效果正确应用
        const focusEvent = new Event('focus');
        searchInput.dispatchEvent(focusEvent);
    }, 500);
}); 