/**
 * 搜索相关功能
 */

// 搜索引擎配置
const searchEngines = {
    google: {
        url: 'https://www.google.com/search?q=',
        name: 'Google'
    },
    bing: {
        url: 'https://www.bing.com/search?q=',
        name: 'Bing'
    },
    baidu: {
        url: 'https://www.baidu.com/s?wd=',
        name: 'Baidu'
    }
};

// 当前选中的搜索引擎
let currentEngine = localStorage.getItem('preferredSearchEngine') || 'google';

// 更新搜索框提示文字
function updateSearchPlaceholder() {
    const searchInput = document.getElementById('search-input');
    const engineName = searchEngines[currentEngine].name;
    searchInput.placeholder = `${engineName} 搜索`;
}

// 添加点击缩放效果
function addClickScaleEffect(element) {
    element.addEventListener('mousedown', function() {
        this.classList.add('click-scale');
    });
    
    element.addEventListener('mouseup', function() {
        this.classList.remove('click-scale');
    });
    
    element.addEventListener('mouseleave', function() {
        this.classList.remove('click-scale');
    });
}

// 初始化搜索引擎选择器
function initSearchEngines() {
    const engines = document.querySelectorAll('.engine');
    
    // 初始化默认引擎
    document.querySelector(`[data-engine="${currentEngine}"]`).classList.add('active');
    
    // 更新搜索框提示文字
    updateSearchPlaceholder();
    
    // 为每个搜索引擎图标添加点击事件
    engines.forEach(engine => {
        // 添加点击缩放效果
        addClickScaleEffect(engine);
        
        engine.addEventListener('click', function() {
            // 移除所有active类
            engines.forEach(e => e.classList.remove('active'));
            
            // 添加active类到当前选中的引擎
            this.classList.add('active');
            
            // 更新当前引擎并保存到本地存储
            currentEngine = this.getAttribute('data-engine');
            localStorage.setItem('preferredSearchEngine', currentEngine);
            
            // 更新搜索框提示文字
            updateSearchPlaceholder();
        });
    });
}

// 执行搜索
function performSearch() {
    const searchInput = document.getElementById('search-input');
    const query = searchInput.value.trim();
    
    if (query) {
        const searchUrl = searchEngines[currentEngine].url + encodeURIComponent(query);
        window.open(searchUrl, '_self');
    }
}

// 延迟聚焦搜索框
function delayedFocusSearchInput(delay) {
    setTimeout(() => {
        const searchInput = document.getElementById('search-input');
        searchInput.focus();
    }, delay);
}

// 初始化搜索功能
function initSearch() {
    // 绑定搜索按钮点击事件
    document.getElementById('search-button').addEventListener('click', performSearch);
    
    // 绑定回车键搜索
    document.getElementById('search-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    // 初始化搜索引擎选择
    initSearchEngines();
    
    // 不再自动聚焦搜索框，将由main.js控制延迟聚焦
} 