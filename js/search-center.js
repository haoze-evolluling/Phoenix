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
        this.setupSearchEngineSelector();
        this.setupSearchBox();
        this.setupKeyboardShortcuts();
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

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Tab键切换搜索引擎
            if (e.key === 'Tab' && !e.shiftKey) {
                e.preventDefault();
                this.switchEngine('next');
            } else if (e.key === 'Tab' && e.shiftKey) {
                e.preventDefault();
                this.switchEngine('prev');
            }
            
            // Esc键隐藏搜索建议
            if (e.key === 'Escape') {
                this.hideSuggestions();
            }
        });
    }

    switchEngine(direction) {
        const engines = Object.keys(this.searchEngines);
        const currentIndex = engines.indexOf(this.currentEngine);
        let newIndex;
        
        if (direction === 'next') {
            newIndex = (currentIndex + 1) % engines.length;
        } else {
            newIndex = (currentIndex - 1 + engines.length) % engines.length;
        }
        
        const newEngine = engines[newIndex];
        const engineButton = document.querySelector(`[data-engine="${newEngine}"]`);
        if (engineButton) {
            engineButton.click();
        }
    }

    focusSearchInput() {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.focus();
            searchInput.select();
        }
    }

    clearSearchInput() {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = '';
            searchInput.blur();
            this.hideSuggestions();
        }
    }
}