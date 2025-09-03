// 搜索功能模块

// 初始化搜索功能
function initializeSearch() {
    const searchInput = document.getElementById('search-input');
    const engineButtons = document.querySelectorAll('.engine-btn');
    
    // 设置默认搜索引擎
    updateSearchEngineButtons();
    
    // 搜索引擎切换
    engineButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            currentSearchEngine = button.dataset.engine;
            localStorage.setItem('searchEngine', currentSearchEngine);
            updateSearchEngineButtons();
            
            // 显示切换反馈
            showSearchEngineMessage(button.textContent || getEngineDisplayName(currentSearchEngine));
        });
    });
    
    // 搜索功能
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = searchInput.value.trim();
                if (query) {
                    performSearch(query);
                }
            }
        });
        
        // 搜索建议
        searchInput.addEventListener('input', handleSearchInput);
        
        // 搜索框焦点效果
        searchInput.addEventListener('focus', addSearchFocusEffect);
        searchInput.addEventListener('blur', removeSearchFocusEffect);
        
        // 自动聚焦搜索框
        searchInput.focus();
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
    
    // 添加搜索历史
    addToSearchHistory(query);
    
    // 检查是否是URL
    if (newTabUtils.isValidURL(query)) {
        const url = query.startsWith('http') ? query : 'https://' + query;
        window.open(url, '_blank');
        showMessage(`正在打开：${url}`, 'info');
    } else {
        // 使用搜索引擎搜索
        const searchURL = searchEngines[currentSearchEngine] + encodeURIComponent(query);
        window.open(searchURL, '_blank');
        showMessage(`使用${getEngineDisplayName(currentSearchEngine)}搜索：${query}`, 'info');
    }
    
    // 清空搜索框
    document.getElementById('search-input').value = '';
    
    // 统计搜索次数
    updateSearchStats(currentSearchEngine);
}

// 使用utils.js中的URL验证函数

// 处理搜索输入
function handleSearchInput(e) {
    const query = e.target.value.trim();
    
    if (query.length > 2) {
        // 显示搜索建议（简单实现）
        showSearchSuggestions(query);
    } else {
        hideSearchSuggestions();
    }
    
    // 实时检测URL
    if (newTabUtils.isValidURL(query)) {
        e.target.style.color = 'var(--success-color)';
    } else {
        e.target.style.color = 'var(--text-primary)';
    }
}

// 显示搜索建议
function showSearchSuggestions(query) {
    // 移除现有建议
    hideSearchSuggestions();
    
    // 创建建议容器
    const suggestionsContainer = document.createElement('div');
    suggestionsContainer.className = 'search-suggestions';
    suggestionsContainer.style.cssText = `
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: var(--bg-card);
        backdrop-filter: var(--glass-backdrop);
        border-radius: 12px;
        margin-top: 8px;
        box-shadow: var(--shadow-glass);
        border: var(--glass-border);
        max-height: 200px;
        overflow-y: auto;
        z-index: 1000;
    `;
    
    // 获取搜索历史作为建议
    const history = getSearchHistory();
    const filteredHistory = history.filter(item => 
        item.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);
    
    if (filteredHistory.length > 0) {
        filteredHistory.forEach(suggestion => {
            const suggestionElement = document.createElement('div');
            suggestionElement.className = 'search-suggestion-item';
            suggestionElement.style.cssText = `
                padding: 12px 16px;
                cursor: pointer;

                border-bottom: 1px solid var(--border-color);
                color: var(--text-primary);
            `;
            suggestionElement.textContent = suggestion;
            
            suggestionElement.addEventListener('mouseenter', () => {
                suggestionElement.style.backgroundColor = 'var(--bg-glass)';
            });
            
            suggestionElement.addEventListener('mouseleave', () => {
                suggestionElement.style.backgroundColor = 'transparent';
            });
            
            suggestionElement.addEventListener('click', () => {
                document.getElementById('search-input').value = suggestion;
                performSearch(suggestion);
                hideSearchSuggestions();
            });
            
            suggestionsContainer.appendChild(suggestionElement);
        });
        
        // 添加到搜索框
        const searchBox = document.querySelector('.search-box');
        searchBox.style.position = 'relative';
        searchBox.appendChild(suggestionsContainer);
    }
}

// 隐藏搜索建议
function hideSearchSuggestions() {
    const suggestions = document.querySelector('.search-suggestions');
    if (suggestions) {
        suggestions.remove();
    }
}





// 添加搜索框焦点效果
function addSearchFocusEffect() {
    const searchBox = document.querySelector('.search-box');
    if (searchBox) {
        searchBox.classList.add('search-focused');
    }
}

// 移除搜索框焦点效果
function removeSearchFocusEffect() {
    const searchBox = document.querySelector('.search-box');
    if (searchBox) {
        searchBox.classList.remove('search-focused');
    }
    
    // 延迟隐藏建议，以便点击建议
    setTimeout(hideSearchSuggestions, 150);
}

// 获取搜索引擎显示名称
function getEngineDisplayName(engine) {
    const names = {
        'google': 'Google',
        'baidu': '百度',
        'bing': '必应'
    };
    return names[engine] || engine;
}

// 显示搜索引擎切换消息
function showSearchEngineMessage(engineName) {
    const message = `已切换到${engineName}搜索`;
    showMessage(message, 'info');
}

// 搜索历史管理
function addToSearchHistory(query) {
    let history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    
    // 移除重复项
    history = history.filter(item => item !== query);
    
    // 添加到开头
    history.unshift(query);
    
    // 限制历史记录数量
    if (history.length > 20) {
        history = history.slice(0, 20);
    }
    
    localStorage.setItem('searchHistory', JSON.stringify(history));
}

function getSearchHistory() {
    return JSON.parse(localStorage.getItem('searchHistory') || '[]');
}

function clearSearchHistory() {
    localStorage.removeItem('searchHistory');
    showMessage('搜索历史已清除', 'success');
}

// 搜索统计
function updateSearchStats(engine) {
    const stats = JSON.parse(localStorage.getItem('searchStats') || '{}');
    stats[engine] = (stats[engine] || 0) + 1;
    localStorage.setItem('searchStats', JSON.stringify(stats));
}

function getSearchStats() {
    return JSON.parse(localStorage.getItem('searchStats') || '{}');
}

// 高级搜索功能
function enableAdvancedSearch() {
    const searchInput = document.getElementById('search-input');
    
    if (searchInput) {
        // 添加搜索命令支持
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                const value = searchInput.value;
                
                // 自动补全常用网站
                const shortcuts = {
                    'g ': 'google.com',
                    'gh ': 'github.com',
                    'b ': 'baidu.com',
                    'y ': 'youtube.com',
                    'w ': 'wikipedia.org'
                };
                
                for (const [shortcut, site] of Object.entries(shortcuts)) {
                    if (value.startsWith(shortcut)) {
                        e.preventDefault();
                        searchInput.value = `site:${site} ${value.slice(shortcut.length)}`;
                        break;
                    }
                }
            }
        });
    }
}

// 语音搜索功能（如果浏览器支持）
function enableVoiceSearch() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.lang = 'zh-CN';
        recognition.continuous = false;
        recognition.interimResults = false;
        
        // 创建语音搜索按钮
        const voiceButton = document.createElement('button');
        voiceButton.innerHTML = '<i class="fas fa-microphone"></i>';
        voiceButton.className = 'voice-search-btn';
        voiceButton.style.cssText = `
            background: transparent;
            border: none;
            color: var(--text-secondary);
            font-size: 16px;
            cursor: pointer;
            padding: 8px;
            border-radius: 50%;

        `;
        
        voiceButton.addEventListener('click', () => {
            recognition.start();
            voiceButton.style.color = 'var(--error-color)';
            showMessage('正在聆听...', 'info');
        });
        
        recognition.addEventListener('result', (e) => {
            const transcript = e.results[0][0].transcript;
            document.getElementById('search-input').value = transcript;
            performSearch(transcript);
        });
        
        recognition.addEventListener('end', () => {
            voiceButton.style.color = 'var(--text-secondary)';
        });
        
        // 添加到搜索框
        const searchBox = document.querySelector('.search-box');
        if (searchBox) {
            searchBox.appendChild(voiceButton);
        }
    }
}

// 初始化扩展搜索功能
document.addEventListener('DOMContentLoaded', () => {
    // 可选功能，根据需要启用
    enableAdvancedSearch();
    // enableVoiceSearch();
});

// 导出搜索相关功能
if (typeof window !== 'undefined') {
    window.newTabSearch = {
        initializeSearch,
        performSearch,
        updateSearchEngineButtons,
        addToSearchHistory,
        getSearchHistory,
        clearSearchHistory,
        getSearchStats,
        enableAdvancedSearch,
        enableVoiceSearch
    };
}
