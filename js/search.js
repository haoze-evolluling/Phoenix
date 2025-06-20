/**
 * 搜索功能模块
 */
(function() {
    // 搜索引擎配置
    const searchEngines = {
        baidu: {
            name: '百度',
            url: 'https://www.baidu.com/s?wd='
        },
        google: {
            name: 'Google',
            url: 'https://www.google.com/search?q='
        },
        bing: {
            name: '必应',
            url: 'https://www.bing.com/search?q='
        },
        sogou: {
            name: '神马搜索',
            url: 'https://m.sm.cn/s?q='
        }
    };
    
    // 默认搜索引擎
    let currentSearchEngine = localStorage.getItem('preferred_search_engine') || 'bing';
    
    // DOM元素
    const searchInput = document.getElementById('search-input');
    const searchButtons = document.querySelectorAll('.search-engines button');
    
    // 设置事件监听器
    const initialize = () => {
        // 选中默认搜索引擎按钮
        updateActiveSearchEngine();
        
        // 搜索引擎按钮点击事件
        searchButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const engine = btn.getAttribute('data-engine');
                setSearchEngine(engine);
                
                // 如果已有搜索内容，立即执行搜索
                if (searchInput.value.trim()) {
                    performSearch();
                }
            });
        });
        
        // 输入框回车搜索
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch();
            }
        });
    };
    
    // 设置当前搜索引擎
    const setSearchEngine = (engine) => {
        if (searchEngines[engine]) {
            currentSearchEngine = engine;
            localStorage.setItem('preferred_search_engine', engine);
            updateActiveSearchEngine();
        }
    };
    
    // 更新活动的搜索引擎按钮样式
    const updateActiveSearchEngine = () => {
        searchButtons.forEach(btn => {
            const engine = btn.getAttribute('data-engine');
            
            if (engine === currentSearchEngine) {
                btn.classList.add('active');
                btn.style.backgroundColor = 'var(--primary-color)';
                btn.style.color = 'white';
            } else {
                btn.classList.remove('active');
                btn.style.backgroundColor = '';
                btn.style.color = '';
            }
        });
    };
    
    // 执行搜索
    const performSearch = () => {
        const query = searchInput.value.trim();
        
        if (!query) return;
        
        const engine = searchEngines[currentSearchEngine];
        const searchUrl = engine.url + encodeURIComponent(query);
        
        // 在新标签页打开搜索结果
        window.open(searchUrl, '_blank');
    };
    
    // 初始化
    initialize();
})();