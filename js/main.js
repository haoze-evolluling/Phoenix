/**
 * Phoenix 主页 - 主JavaScript文件
 */

// 确保页面完全加载后再执行所有初始化
window.addEventListener('load', function() {
    // 先初始化UI效果
    initUI();
    
    // 再初始化时钟
    initClock();
    
    // 最后初始化搜索功能（这会自动聚焦搜索框）
    initSearch();
}); 