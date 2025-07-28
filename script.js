class SearchCenter {
    constructor() {
        this.currentEngine = 'google';
        this.searchEngines = {
            google: {
                name: 'Google',
                url: 'https://www.google.com/search?q='
            },
            baidu: {
                name: '百度',
                url: 'https://www.baidu.com/s?wd='
            },
            bing: {
                name: 'Bing',
                url: 'https://www.bing.com/search?q='
            },
            duckduckgo: {
                name: 'DuckDuckGo',
                url: 'https://duckduckgo.com/?q='
            }
        };
        
        this.init();
    }

    init() {
        this.setupTime();
        this.setupSearchEngineSelector();
        this.setupSearchBox();
        this.setupQuickActions();
        this.setupKeyboardShortcuts();
        this.setupSettings();
    }

    setupTime() {
        const updateTime = () => {
            const now = new Date();
            
            // 更新时间
            const timeString = now.toLocaleTimeString('zh-CN', {
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            
            // 更新日期
            const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
            const dateString = now.toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            const timeElement = document.querySelector('.time');
            const dateElement = document.querySelector('.date');
            
            if (timeElement) timeElement.textContent = timeString;
            if (dateElement) dateElement.textContent = `${weekdays[now.getDay()]}, ${dateString}`;
        };

        updateTime();
        setInterval(updateTime, 1000);
    }

    setupSearchEngineSelector() {
        const engineButtons = document.querySelectorAll('.engine-btn');
        
        engineButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                // 移除所有活跃状态
                engineButtons.forEach(btn => btn.classList.remove('active'));
                
                // 添加当前活跃状态
                button.classList.add('active');
                
                // 更新当前搜索引擎
                this.currentEngine = button.dataset.engine;
                
                // 更新搜索框占位符
                const searchInput = document.getElementById('searchInput');
                if (searchInput) {
                    searchInput.placeholder = `在 ${this.searchEngines[this.currentEngine].name} 中搜索...`;
                }
                
                // 聚焦到搜索框
                searchInput.focus();
            });
        });
    }

    setupSearchBox() {
        const searchInput = document.getElementById('searchInput');
        const searchButton = document.getElementById('searchButton');
        const suggestionsContainer = document.getElementById('searchSuggestions');
        
        if (searchInput) {
            // 搜索功能
            const performSearch = () => {
                const query = searchInput.value.trim();
                if (query) {
                    const searchUrl = this.searchEngines[this.currentEngine].url + encodeURIComponent(query);
                    window.open(searchUrl, '_blank');
                    searchInput.value = '';
                    this.hideSuggestions();
                }
            };

            // 搜索按钮点击事件
            if (searchButton) {
                searchButton.addEventListener('click', performSearch);
            }

            // 回车键搜索
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    performSearch();
                }
            });

            // 输入建议功能
            searchInput.addEventListener('input', (e) => {
                const query = e.target.value.trim();
                if (query.length > 0) {
                    this.showSuggestions(query);
                } else {
                    this.hideSuggestions();
                }
            });

            // 点击外部隐藏建议
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.search-box')) {
                    this.hideSuggestions();
                }
            });
        }
    }

    showSuggestions(query) {
        const suggestionsContainer = document.getElementById('searchSuggestions');
        if (!suggestionsContainer) return;

        // 模拟搜索建议
        const commonSuggestions = [
            `${query} 是什么意思`,
            `${query} 最新`,
            `${query} 教程`,
            `${query} 下载`,
            `${query} 官网`
        ];

        const filteredSuggestions = commonSuggestions.filter(s => 
            s.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 5);

        if (filteredSuggestions.length > 0) {
            suggestionsContainer.innerHTML = filteredSuggestions.map(suggestion => `
                <div class="suggestion-item" data-suggestion="${suggestion}">
                    <i class="fas fa-search"></i>
                    <span>${suggestion}</span>
                </div>
            `).join('');

            suggestionsContainer.style.display = 'block';

            // 添加建议项点击事件
            suggestionsContainer.querySelectorAll('.suggestion-item').forEach(item => {
                item.addEventListener('click', (e) => {
                    const suggestion = e.currentTarget.dataset.suggestion;
                    document.getElementById('searchInput').value = suggestion;
                    this.hideSuggestions();
                });
            });
        } else {
            this.hideSuggestions();
        }
    }

    hideSuggestions() {
        const suggestionsContainer = document.getElementById('searchSuggestions');
        if (suggestionsContainer) {
            suggestionsContainer.style.display = 'none';
        }
    }

    setupQuickActions() {
        const quickButtons = document.querySelectorAll('.quick-btn');
        
        quickButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const suggestion = button.dataset.suggestion;
                const searchInput = document.getElementById('searchInput');
                
                if (searchInput) {
                    searchInput.value = suggestion;
                    searchInput.focus();
                    
                    // 触发搜索
                    const searchUrl = this.searchEngines[this.currentEngine].url + encodeURIComponent(suggestion);
                    setTimeout(() => {
                        window.open(searchUrl, '_blank');
                        searchInput.value = '';
                    }, 300);
                }
            });
        });
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + K 聚焦搜索框
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                const searchInput = document.getElementById('searchInput');
                if (searchInput) {
                    searchInput.focus();
                    searchInput.select();
                }
            }

            // Ctrl/Cmd + 数字键切换搜索引擎
            if ((e.ctrlKey || e.metaKey) && e.key >= '1' && e.key <= '4') {
                e.preventDefault();
                const engines = Object.keys(this.searchEngines);
                const index = parseInt(e.key) - 1;
                if (index < engines.length) {
                    const engineButton = document.querySelector(`[data-engine="${engines[index]}"]`);
                    if (engineButton) engineButton.click();
                }
            }

            // Esc 键清除搜索框
            if (e.key === 'Escape') {
                const searchInput = document.getElementById('searchInput');
                if (searchInput) {
                    searchInput.value = '';
                    searchInput.blur();
                    this.hideSuggestions();
                }
            }
        });
    }

    setupSettings() {
        const settingsBtn = document.getElementById('settingsBtn');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => {
                this.showSettingsModal();
            });
        }
    }

    showSettingsModal() {
        // 创建设置模态框
        const modal = document.createElement('div');
        modal.className = 'settings-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>设置</h3>
                    <button class="close-btn">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="setting-group">
                        <label>默认搜索引擎</label>
                        <select id="defaultEngine">
                            ${Object.entries(this.searchEngines).map(([key, engine]) => 
                                `<option value="${key}" ${key === this.currentEngine ? 'selected' : ''}>${engine.name}</option>`
                            ).join('')}
                        </select>
                    </div>
                    <div class="setting-group">
                        <label>
                            <input type="checkbox" id="autoFocus" checked> 页面加载时自动聚焦搜索框
                        </label>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="save-btn">保存设置</button>
                </div>
            </div>
        `;

        // 添加样式
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
            animation: fadeIn 0.3s ease-out;
        `;

        const content = modal.querySelector('.modal-content');
        content.style.cssText = `
            background: white;
            border-radius: 12px;
            padding: 2rem;
            max-width: 400px;
            width: 90%;
            box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1);
        `;

        // 添加事件监听
        modal.querySelector('.close-btn').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        modal.querySelector('.save-btn').addEventListener('click', () => {
            const defaultEngine = document.getElementById('defaultEngine').value;
            const autoFocus = document.getElementById('autoFocus').checked;
            
            // 保存设置到本地存储
            localStorage.setItem('defaultEngine', defaultEngine);
            localStorage.setItem('autoFocus', autoFocus);
            
            // 应用设置
            if (defaultEngine !== this.currentEngine) {
                const engineButton = document.querySelector(`[data-engine="${defaultEngine}"]`);
                if (engineButton) engineButton.click();
            }
            
            document.body.removeChild(modal);
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });

        document.body.appendChild(modal);
    }

    loadSettings() {
        // 从本地存储加载设置
        const defaultEngine = localStorage.getItem('defaultEngine');
        const autoFocus = localStorage.getItem('autoFocus') !== 'false';

        if (defaultEngine && this.searchEngines[defaultEngine]) {
            this.currentEngine = defaultEngine;
            const engineButton = document.querySelector(`[data-engine="${defaultEngine}"]`);
            if (engineButton) {
                document.querySelectorAll('.engine-btn').forEach(btn => btn.classList.remove('active'));
                engineButton.classList.add('active');
            }
        }

        if (autoFocus) {
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.focus();
            }
        }
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    const searchCenter = new SearchCenter();
    searchCenter.loadSettings();
});

// 添加额外的样式增强
document.addEventListener('DOMContentLoaded', () => {
    // 添加动态背景效果
    const createFloatingElements = () => {
        const container = document.querySelector('.container');
        for (let i = 0; i < 6; i++) {
            const element = document.createElement('div');
            element.className = 'floating-element';
            element.style.cssText = `
                position: fixed;
                width: ${Math.random() * 100 + 50}px;
                height: ${Math.random() * 100 + 50}px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 50%;
                top: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
                animation: float ${Math.random() * 10 + 10}s ease-in-out infinite;
                animation-delay: ${Math.random() * 5}s;
                z-index: -1;
            `;
            document.body.appendChild(element);
        }
    };

    createFloatingElements();
});

// 添加浮动动画
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0%, 100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.7;
        }
        50% {
            transform: translateY(-20px) rotate(180deg);
            opacity: 0.3;
        }
    }
    
    .settings-modal .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid var(--border-color);
    }
    
    .settings-modal .close-btn {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: var(--text-secondary);
    }
    
    .settings-modal .setting-group {
        margin-bottom: 1.5rem;
    }
    
    .settings-modal label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
        color: var(--text-primary);
    }
    
    .settings-modal select {
        width: 100%;
        padding: 0.5rem;
        border: 1px solid var(--border-color);
        border-radius: var(--border-radius-sm);
        background: white;
    }
    
    .settings-modal .save-btn {
        background: var(--primary-color);
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: var(--border-radius-sm);
        cursor: pointer;
        transition: var(--transition);
    }
    
    .settings-modal .save-btn:hover {
        background: var(--secondary-color);
    }
`;
document.head.appendChild(style);