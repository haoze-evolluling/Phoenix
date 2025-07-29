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
        this.quickLinks = this.loadQuickLinks();
        this.renderQuickLinks();
        this.setupContextMenu();
    }

    loadQuickLinks() {
        const defaultLinks = [
            { name: 'GitHub', url: 'https://github.com', icon: 'fab fa-github' },
            { name: 'B站', url: 'https://www.bilibili.com', icon: 'fas fa-play-circle' },
            { name: '知乎', url: 'https://www.zhihu.com', icon: 'fas fa-question-circle' },
            { name: 'YouTube', url: 'https://www.youtube.com', icon: 'fab fa-youtube' }
        ];
        
        const saved = localStorage.getItem('quickLinks');
        return saved ? JSON.parse(saved) : defaultLinks;
    }

    saveQuickLinks() {
        localStorage.setItem('quickLinks', JSON.stringify(this.quickLinks));
    }

    renderQuickLinks() {
        const container = document.getElementById('quickLinks');
        if (!container) return;

        const items = container.querySelectorAll('.quick-link-item');
        items.forEach((item, index) => {
            const link = this.quickLinks[index];
            const button = item.querySelector('.quick-link-btn');
            
            if (button && link) {
                button.innerHTML = `
                    <i class="${link.icon}"></i>
                    <span>${link.name}</span>
                `;
                button.title = link.name;
                button.onclick = (e) => {
                    e.preventDefault();
                    window.open(link.url, '_blank');
                };
            }
        });
    }

    setupContextMenu() {
        const container = document.getElementById('quickLinks');
        if (!container) return;

        // 禁用默认右键菜单
        container.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            
            const item = e.target.closest('.quick-link-item');
            if (item) {
                const index = parseInt(item.dataset.index);
                this.showContextMenu(e, index);
            }
        });

        // 点击其他地方关闭右键菜单
        document.addEventListener('click', () => {
            this.hideContextMenu();
        });

        // 关闭模态框
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideEditModal();
                this.hideContextMenu();
            }
        });
    }

    showContextMenu(event, index) {
        this.hideContextMenu();
        
        const menu = document.createElement('div');
        menu.className = 'context-menu';
        menu.innerHTML = `
            <button class="context-menu-item" data-action="edit" data-index="${index}">
                <i class="fas fa-edit"></i> 编辑
            </button>
            <button class="context-menu-item" data-action="reset" data-index="${index}">
                <i class="fas fa-undo"></i> 重置为默认
            </button>
        `;

        menu.style.left = event.pageX + 'px';
        menu.style.top = event.pageY + 'px';

        document.body.appendChild(menu);

        // 添加菜单项事件
        menu.addEventListener('click', (e) => {
            e.stopPropagation();
            const action = e.target.dataset.action;
            const index = parseInt(e.target.dataset.index);
            
            if (action === 'edit') {
                this.showEditModal(index);
            } else if (action === 'reset') {
                this.resetQuickLink(index);
            }
            
            this.hideContextMenu();
        });

        this.currentContextMenu = menu;
    }

    hideContextMenu() {
        if (this.currentContextMenu) {
            this.currentContextMenu.remove();
            this.currentContextMenu = null;
        }
    }

    showEditModal(index) {
        this.hideContextMenu();
        
        const link = this.quickLinks[index];
        const modal = document.createElement('div');
        modal.className = 'edit-modal';
        modal.innerHTML = `
            <div class="edit-modal-content">
                <h3>编辑快捷链接</h3>
                <div class="form-group">
                    <label>名称</label>
                    <input type="text" id="editName" value="${link.name}" placeholder="网站名称">
                </div>
                <div class="form-group">
                    <label>网址</label>
                    <input type="url" id="editUrl" value="${link.url}" placeholder="https://example.com">
                </div>
                <div class="form-group">
                    <label>图标类名</label>
                    <input type="text" id="editIcon" value="${link.icon}" placeholder="例如: fab fa-github">
                    <small style="color: var(--text-muted); font-size: 0.75rem;">
                        使用 Font Awesome 图标类名，如：fab fa-github, fas fa-home
                    </small>
                </div>
                <div class="edit-modal-buttons">
                    <button class="cancel-btn" id="cancelEditBtn">取消</button>
                    <button class="save-btn" id="saveEditBtn">保存</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        this.currentEditModal = modal;

        // 添加事件监听器
        modal.querySelector('#cancelEditBtn').addEventListener('click', () => {
            this.hideEditModal();
        });

        modal.querySelector('#saveEditBtn').addEventListener('click', () => {
            this.saveQuickLinkEdit(index);
        });

        // 点击模态框外部关闭
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.hideEditModal();
            }
        });

        // 聚焦到名称输入框
        setTimeout(() => {
            document.getElementById('editName').focus();
        }, 100);
    }

    hideEditModal() {
        if (this.currentEditModal) {
            this.currentEditModal.remove();
            this.currentEditModal = null;
        }
    }

    saveQuickLinkEdit(index) {
        const name = document.getElementById('editName').value.trim();
        const url = document.getElementById('editUrl').value.trim();
        const icon = document.getElementById('editIcon').value.trim();

        if (!name || !url) {
            alert('名称和网址不能为空');
            return;
        }

        // 验证URL格式
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            alert('请输入正确的网址格式，如 https://example.com');
            return;
        }

        this.quickLinks[index] = { name, url, icon };
        this.saveQuickLinks();
        this.renderQuickLinks();
        this.hideEditModal();
    }

    resetQuickLink(index) {
        const defaultLinks = [
            { name: 'GitHub', url: 'https://github.com', icon: 'fab fa-github' },
            { name: 'B站', url: 'https://www.bilibili.com', icon: 'fas fa-play-circle' },
            { name: '知乎', url: 'https://www.zhihu.com', icon: 'fas fa-question-circle' },
            { name: 'YouTube', url: 'https://www.youtube.com', icon: 'fab fa-youtube' }
        ];

        this.quickLinks[index] = defaultLinks[index];
        this.saveQuickLinks();
        this.renderQuickLinks();
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
            if ((e.ctrlKey || e.metaKey) && e.key >= '1' && e.key <= '3') {
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
                        <label class="checkbox-label">
                            <input type="checkbox" id="autoFocus" checked> 页面加载时自动聚焦搜索框
                        </label>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="save-btn">保存设置</button>
                </div>
            </div>
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