// 搜索引擎功能模块

// 搜索引擎配置
const searchEngines = {
    google: {
        name: 'Google',
        url: 'https://www.google.com/search?q=',
        icon: 'fab fa-google'
    },
    baidu: {
        name: '百度',
        url: 'https://www.baidu.com/s?wd=',
        icon: '百度'
    },
    bing: {
        name: '必应',
        url: 'https://www.bing.com/search?q=',
        icon: 'fab fa-microsoft'
    }
};

// 当前搜索引擎
let currentSearchEngine = localStorage.getItem('searchEngine') || 'google';

// 初始化搜索功能
function initializeSearch() {
    const searchInput = document.getElementById('search-input');
    const engineButtons = document.querySelectorAll('.engine-btn');
    
    // 更新搜索引擎按钮状态
    updateSearchEngineButtons();
    
    // 搜索引擎切换事件
    engineButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            switchSearchEngine(button.dataset.engine);
        });
    });
    
    // 搜索输入事件
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = searchInput.value.trim();
                if (query) {
                    performSearch(query);
                }
            }
        });
        
        // 自动聚焦搜索框
        searchInput.focus();
        
        // 搜索框焦点效果已禁用
    }
}

// 切换搜索引擎
function switchSearchEngine(engine) {
    if (searchEngines[engine]) {
        currentSearchEngine = engine;
        localStorage.setItem('searchEngine', currentSearchEngine);
        updateSearchEngineButtons();
        showMessage(`已切换到${searchEngines[engine].name}搜索`, 'info');
    }
}

// 更新搜索引擎按钮状态
function updateSearchEngineButtons() {
    const engineButtons = document.querySelectorAll('.engine-btn');
    engineButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.engine === currentSearchEngine);
    });
}

// 执行搜索
function performSearch(query) {
    if (!query) return;
    
    // 检查是否是URL
    if (isValidURL(query)) {
        // 直接打开URL
        const url = query.startsWith('http') ? query : 'https://' + query;
        window.open(url, '_blank');
        showMessage(`正在打开：${url}`, 'info');
    } else {
        // 使用搜索引擎搜索
        const engine = searchEngines[currentSearchEngine];
        const searchURL = engine.url + encodeURIComponent(query);
        window.open(searchURL, '_blank');
        showMessage(`使用${engine.name}搜索：${query}`, 'info');
    }
    
    // 清空搜索框
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.value = '';
    }
}

// URL验证函数
function isValidURL(string) {
    try {
        // 检查是否包含协议
        if (string.startsWith('http://') || string.startsWith('https://')) {
            new URL(string);
            return true;
        }
        
        // 检查是否像域名（包含点号且不包含空格）
        if (string.includes('.') && !string.includes(' ') && !string.includes('.')) {
            // 简单的域名格式检查
            const domainPattern = /^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.[a-zA-Z]{2,}$/;
            return domainPattern.test(string);
        }
        
        return false;
    } catch (_) {
        return false;
    }
}

// showMessage 函数已在 utils.js 中定义

// 导出搜索功能
if (typeof window !== 'undefined') {
    window.newTabSearch = {
        initializeSearch,
        performSearch,
        switchSearchEngine,
        updateSearchEngineButtons,
        searchEngines,
        currentSearchEngine
    };
}
