// 页面加载完成后初始化
let searchCenter;

document.addEventListener('DOMContentLoaded', () => {
    searchCenter = new SearchCenter();
    searchCenter.loadSettings();
});

// 全局工具函数
window.SearchUtils = {
    // 获取当前搜索引擎实例
    getSearchCenter: () => searchCenter,
    
    // 快速切换搜索引擎
    switchEngine: (engine) => {
        if (searchCenter && searchCenter.searchEngines[engine]) {
            const engineButton = document.querySelector(`[data-engine="${engine}"]`);
            if (engineButton) engineButton.click();
        }
    },
    
    // 快速搜索
    quickSearch: (query) => {
        if (searchCenter && query) {
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.value = query;
                const event = new KeyboardEvent('keypress', { key: 'Enter' });
                searchInput.dispatchEvent(event);
            }
        }
    }
};