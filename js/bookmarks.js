// 书签管理功能模块

// 书签数据结构
const BookmarkManager = {
    // 默认书签数据
    defaultBookmarks: {
        categories: [
            {
                id: 'work',
                name: '工作',
                color: '#3b82f6',
                icon: 'fas fa-briefcase'
            },
            {
                id: 'study',
                name: '学习',
                color: '#10b981',
                icon: 'fas fa-book'
            },
            {
                id: 'entertainment',
                name: '娱乐',
                color: '#f59e0b',
                icon: 'fas fa-music'
            },
            {
                id: 'tools',
                name: '工具',
                color: '#8b5cf6',
                icon: 'fas fa-tools'
            }
        ],
        bookmarks: [
            {
                id: 'work-email',
                title: '工作邮箱',
                url: 'https://mail.google.com',
                category: 'work',
                icon: 'fas fa-envelope',
                description: 'Gmail工作邮箱',
                createdAt: new Date().toISOString(),
                lastVisited: null,
                visitCount: 0
            },
            {
                id: 'work-calendar',
                title: '项目管理',
                url: 'https://calendar.google.com',
                category: 'work',
                icon: 'fas fa-calendar',
                description: 'Google日历',
                createdAt: new Date().toISOString(),
                lastVisited: null,
                visitCount: 0
            },
            {
                id: 'study-tutorial',
                title: '在线教程',
                url: 'https://www.w3schools.com',
                category: 'study',
                icon: 'fas fa-graduation-cap',
                description: 'W3Schools在线教程',
                createdAt: new Date().toISOString(),
                lastVisited: null,
                visitCount: 0
            },
            {
                id: 'study-github',
                title: '编程资源',
                url: 'https://github.com',
                category: 'study',
                icon: 'fab fa-github',
                description: 'GitHub代码仓库',
                createdAt: new Date().toISOString(),
                lastVisited: null,
                visitCount: 0
            },
            {
                id: 'entertainment-music',
                title: '音乐平台',
                url: 'https://music.163.com',
                category: 'entertainment',
                icon: 'fas fa-music',
                description: '网易云音乐',
                createdAt: new Date().toISOString(),
                lastVisited: null,
                visitCount: 0
            },
            {
                id: 'entertainment-games',
                title: '游戏网站',
                url: 'https://www.steam.com',
                category: 'entertainment',
                icon: 'fas fa-gamepad',
                description: 'Steam游戏平台',
                createdAt: new Date().toISOString(),
                lastVisited: null,
                visitCount: 0
            }
        ]
    },

    // 获取所有书签数据
    getAllBookmarks() {
        const saved = localStorage.getItem('newtabBookmarks');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.warn('书签数据解析失败，使用默认数据:', e);
                return this.defaultBookmarks;
            }
        }
        return this.defaultBookmarks;
    },

    // 保存书签数据
    saveBookmarks(bookmarkData) {
        localStorage.setItem('newtabBookmarks', JSON.stringify(bookmarkData));
    },

    // 添加书签
    addBookmark(bookmark) {
        const data = this.getAllBookmarks();
        const newBookmark = {
            id: this.generateId(),
            title: bookmark.title,
            url: bookmark.url,
            category: bookmark.category || 'work',
            icon: bookmark.icon || this.getDefaultIcon(bookmark.url),
            iconType: bookmark.iconType || 'fontawesome',
            description: bookmark.description || '',
            createdAt: new Date().toISOString(),
            lastVisited: null,
            visitCount: 0
        };
        data.bookmarks.push(newBookmark);
        this.saveBookmarks(data);
        
        // 尝试自动获取网站图标
        this.fetchFavicon(newBookmark.url, newBookmark.id);
        
        return newBookmark;
    },

    // 更新书签
    updateBookmark(id, updates) {
        const data = this.getAllBookmarks();
        const index = data.bookmarks.findIndex(bookmark => bookmark.id === id);
        if (index !== -1) {
            data.bookmarks[index] = { ...data.bookmarks[index], ...updates };
            this.saveBookmarks(data);
            return data.bookmarks[index];
        }
        return null;
    },

    // 删除书签
    deleteBookmark(id) {
        const data = this.getAllBookmarks();
        data.bookmarks = data.bookmarks.filter(bookmark => bookmark.id !== id);
        this.saveBookmarks(data);
    },

    // 添加分类
    addCategory(category) {
        const data = this.getAllBookmarks();
        const newCategory = {
            id: this.generateId(),
            name: category.name,
            color: category.color || '#6b7280',
            icon: category.icon || 'fas fa-folder'
        };
        data.categories.push(newCategory);
        this.saveBookmarks(data);
        return newCategory;
    },

    // 更新分类
    updateCategory(id, updates) {
        const data = this.getAllBookmarks();
        const index = data.categories.findIndex(category => category.id === id);
        if (index !== -1) {
            data.categories[index] = { ...data.categories[index], ...updates };
            this.saveBookmarks(data);
            return data.categories[index];
        }
        return null;
    },

    // 删除分类
    deleteCategory(id) {
        const data = this.getAllBookmarks();
        // 将属于该分类的书签移动到默认分类
        data.bookmarks.forEach(bookmark => {
            if (bookmark.category === id) {
                bookmark.category = 'work';
            }
        });
        data.categories = data.categories.filter(category => category.id !== id);
        this.saveBookmarks(data);
    },

    // 记录书签访问
    recordVisit(id) {
        const data = this.getAllBookmarks();
        const bookmark = data.bookmarks.find(b => b.id === id);
        if (bookmark) {
            bookmark.lastVisited = new Date().toISOString();
            bookmark.visitCount = (bookmark.visitCount || 0) + 1;
            this.saveBookmarks(data);
        }
    },

    // 搜索书签
    searchBookmarks(query) {
        const data = this.getAllBookmarks();
        const lowerQuery = query.toLowerCase();
        return data.bookmarks.filter(bookmark => 
            bookmark.title.toLowerCase().includes(lowerQuery) ||
            bookmark.url.toLowerCase().includes(lowerQuery) ||
            bookmark.description.toLowerCase().includes(lowerQuery)
        );
    },

    // 按分类获取书签
    getBookmarksByCategory(categoryId) {
        const data = this.getAllBookmarks();
        return data.bookmarks.filter(bookmark => bookmark.category === categoryId);
    },

    // 获取最近访问的书签
    getRecentBookmarks(limit = 10) {
        const data = this.getAllBookmarks();
        return data.bookmarks
            .filter(bookmark => bookmark.lastVisited)
            .sort((a, b) => new Date(b.lastVisited) - new Date(a.lastVisited))
            .slice(0, limit);
    },

    // 获取最常访问的书签
    getPopularBookmarks(limit = 10) {
        const data = this.getAllBookmarks();
        return data.bookmarks
            .filter(bookmark => bookmark.visitCount > 0)
            .sort((a, b) => b.visitCount - a.visitCount)
            .slice(0, limit);
    },

    // 生成唯一ID
    generateId() {
        return 'bookmark_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    },

    // 导出书签数据
    exportBookmarks() {
        const data = this.getAllBookmarks();
        data.exportDate = new Date().toISOString();
        data.version = '1.0';
        return data;
    },

    // 导入书签数据
    importBookmarks(importData) {
        try {
            if (importData.version && importData.bookmarks && importData.categories) {
                this.saveBookmarks(importData);
                return true;
            }
            return false;
        } catch (e) {
            console.error('导入书签数据失败:', e);
            return false;
        }
    },

    // 重置为默认数据
    resetToDefault() {
        this.saveBookmarks(this.defaultBookmarks);
    },

    // 获取网站图标
    fetchFavicon(url, bookmarkId) {
        try {
            const domain = new URL(url).hostname;
            
            // 尝试多种图标获取方式
            const iconUrls = [
                `https://www.google.com/s2/favicons?domain=${domain}&sz=32`,
                `https://favicons.githubusercontent.com/${domain}`,
                `https://icons.duckduckgo.com/ip3/${domain}.ico`,
                `https://${domain}/favicon.ico`
            ];

            // 使用第一个可用的图标源
            this.tryLoadIcon(iconUrls, 0, bookmarkId);
        } catch (error) {
            console.log('无法解析URL:', url);
        }
    },

    // 尝试加载图标
    tryLoadIcon(iconUrls, index, bookmarkId) {
        if (index >= iconUrls.length) return;

        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        img.onload = () => {
            // 图标加载成功，转换为base64并保存
            this.convertIconToBase64(img, bookmarkId);
        };
        
        img.onerror = () => {
            // 尝试下一个图标源
            this.tryLoadIcon(iconUrls, index + 1, bookmarkId);
        };
        
        img.src = iconUrls[index];
    },

    // 将图标转换为base64
    convertIconToBase64(img, bookmarkId) {
        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = 32;
            canvas.height = 32;
            
            ctx.drawImage(img, 0, 0, 32, 32);
            const dataURL = canvas.toDataURL('image/png');
            
            // 更新书签图标
            this.updateBookmark(bookmarkId, { 
                icon: dataURL,
                iconType: 'image'
            });
            
            // 重新渲染书签页面
            if (typeof renderBookmarksPage === 'function') {
                renderBookmarksPage();
            }
        } catch (error) {
            console.log('图标转换失败:', error);
        }
    },

    // 获取常用网站的默认图标
    getDefaultIcon(url) {
        const domain = new URL(url).hostname.toLowerCase();
        
        const iconMap = {
            'google.com': 'fab fa-google',
            'github.com': 'fab fa-github',
            'youtube.com': 'fab fa-youtube',
            'facebook.com': 'fab fa-facebook',
            'twitter.com': 'fab fa-twitter',
            'instagram.com': 'fab fa-instagram',
            'linkedin.com': 'fab fa-linkedin',
            'stackoverflow.com': 'fab fa-stack-overflow',
            'reddit.com': 'fab fa-reddit',
            'amazon.com': 'fab fa-amazon',
            'netflix.com': 'fas fa-tv',
            'spotify.com': 'fab fa-spotify',
            'discord.com': 'fab fa-discord',
            'twitch.tv': 'fab fa-twitch',
            'wikipedia.org': 'fab fa-wikipedia-w',
            'baidu.com': 'fas fa-search',
            'zhihu.com': 'fas fa-question-circle',
            'bilibili.com': 'fas fa-play-circle',
            'taobao.com': 'fas fa-shopping-cart',
            'jd.com': 'fas fa-store',
            'qq.com': 'fab fa-qq',
            'weibo.com': 'fab fa-weibo'
        };

        for (const [key, icon] of Object.entries(iconMap)) {
            if (domain.includes(key)) {
                return icon;
            }
        }

        return 'fas fa-link';
    }
};

// 初始化书签功能
function initializeBookmarks() {
    // 渲染书签页面
    renderBookmarksPage();
    
    // 添加书签管理功能
    addBookmarkManagement();
    
    // 添加书签搜索功能
    addBookmarkSearch();
    
    // 添加书签拖拽排序功能
    addBookmarkDragDrop();
    
    console.log('书签功能已初始化');
}

// 渲染书签页面
function renderBookmarksPage() {
    const bookmarksSection = document.getElementById('bookmarks');
    if (!bookmarksSection) return;

    const data = BookmarkManager.getAllBookmarks();
    
    let html = `
        <div class="bookmarks-header">
            <h2>我的书签</h2>
            <div class="bookmarks-controls">
                <div class="bookmark-search-container">
                    <i class="fas fa-search search-icon"></i>
                    <input type="text" id="bookmark-search" placeholder="搜索书签..." class="bookmark-search-input">
                </div>
                <button class="add-bookmark-btn" id="add-bookmark-btn">
                    <i class="fas fa-plus"></i>
                    <span>添加书签</span>
                </button>
                <button class="manage-categories-btn" id="manage-categories-btn">
                    <i class="fas fa-folder"></i>
                    <span>管理分类</span>
                </button>
            </div>
        </div>
        <div class="bookmark-categories" id="bookmark-categories">
    `;

    // 渲染分类和书签
    data.categories.forEach(category => {
        const categoryBookmarks = data.bookmarks.filter(bookmark => bookmark.category === category.id);
        
        html += `
            <div class="bookmark-category" data-category-id="${category.id}">
                <div class="category-header">
                    <h3 style="color: ${category.color}">
                        <i class="${category.icon}"></i>
                        <span>${category.name}</span>
                        <span class="bookmark-count">(${categoryBookmarks.length})</span>
                    </h3>
                    <div class="category-actions">
                        <button class="category-edit-btn" data-category-id="${category.id}" title="编辑分类">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="category-delete-btn" data-category-id="${category.id}" title="删除分类">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="bookmark-list" data-category-id="${category.id}">
        `;

        categoryBookmarks.forEach(bookmark => {
            const iconHtml = bookmark.iconType === 'image' 
                ? `<img src="${bookmark.icon}" alt="${bookmark.title}" class="bookmark-icon-img">`
                : `<i class="${bookmark.icon}"></i>`;
                
            html += `
                <div class="bookmark-item" data-bookmark-id="${bookmark.id}" draggable="true">
                    <div class="bookmark-icon">
                        ${iconHtml}
                    </div>
                    <div class="bookmark-content">
                        <div class="bookmark-title">${bookmark.title}</div>
                        <div class="bookmark-url">${bookmark.url}</div>
                        ${bookmark.description ? `<div class="bookmark-description">${bookmark.description}</div>` : ''}
                    </div>
                    <div class="bookmark-actions">
                        <button class="bookmark-edit-btn" data-bookmark-id="${bookmark.id}" title="编辑书签">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="bookmark-delete-btn" data-bookmark-id="${bookmark.id}" title="删除书签">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                    <a href="${bookmark.url}" target="_blank" class="bookmark-link" data-bookmark-id="${bookmark.id}"></a>
                </div>
            `;
        });

        html += `
                </div>
            </div>
        `;
    });

    html += `</div>`;

    bookmarksSection.innerHTML = html;
}

// 添加书签管理功能
function addBookmarkManagement() {
    // 添加书签按钮
    const addBookmarkBtn = document.getElementById('add-bookmark-btn');
    if (addBookmarkBtn) {
        addBookmarkBtn.addEventListener('click', showAddBookmarkModal);
    }

    // 管理分类按钮
    const manageCategoriesBtn = document.getElementById('manage-categories-btn');
    if (manageCategoriesBtn) {
        manageCategoriesBtn.addEventListener('click', showManageCategoriesModal);
    }

    // 书签编辑和删除按钮
    document.addEventListener('click', (e) => {
        if (e.target.closest('.bookmark-edit-btn')) {
            const bookmarkId = e.target.closest('.bookmark-edit-btn').dataset.bookmarkId;
            showEditBookmarkModal(bookmarkId);
        } else if (e.target.closest('.bookmark-delete-btn')) {
            const bookmarkId = e.target.closest('.bookmark-delete-btn').dataset.bookmarkId;
            deleteBookmark(bookmarkId);
        } else if (e.target.closest('.category-edit-btn')) {
            const categoryId = e.target.closest('.category-edit-btn').dataset.categoryId;
            showEditCategoryModal(categoryId);
        } else if (e.target.closest('.category-delete-btn')) {
            const categoryId = e.target.closest('.category-delete-btn').dataset.categoryId;
            deleteCategory(categoryId);
        }
    });

    // 书签链接点击
    document.addEventListener('click', (e) => {
        if (e.target.closest('.bookmark-link')) {
            const bookmarkId = e.target.closest('.bookmark-link').dataset.bookmarkId;
            BookmarkManager.recordVisit(bookmarkId);
        }
    });
}

// 添加书签搜索功能
function addBookmarkSearch() {
    const searchInput = document.getElementById('bookmark-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            if (query) {
                filterBookmarks(query);
            } else {
                renderBookmarksPage();
            }
        });
    }
}

// 过滤书签
function filterBookmarks(query) {
    const results = BookmarkManager.searchBookmarks(query);
    const categories = document.querySelectorAll('.bookmark-category');
    
    categories.forEach(category => {
        const categoryId = category.dataset.categoryId;
        const categoryBookmarks = results.filter(bookmark => bookmark.category === categoryId);
        
        if (categoryBookmarks.length > 0) {
            category.style.display = 'block';
            const bookmarkList = category.querySelector('.bookmark-list');
            bookmarkList.innerHTML = '';
            
            categoryBookmarks.forEach(bookmark => {
                const bookmarkElement = createBookmarkElement(bookmark);
                bookmarkList.appendChild(bookmarkElement);
            });
        } else {
            category.style.display = 'none';
        }
    });
}

// 创建书签元素
function createBookmarkElement(bookmark) {
    const div = document.createElement('div');
    div.className = 'bookmark-item';
    div.dataset.bookmarkId = bookmark.id;
    div.draggable = true;
    
    const iconHtml = bookmark.iconType === 'image' 
        ? `<img src="${bookmark.icon}" alt="${bookmark.title}" class="bookmark-icon-img">`
        : `<i class="${bookmark.icon}"></i>`;
    
    div.innerHTML = `
        <div class="bookmark-icon">
            ${iconHtml}
        </div>
        <div class="bookmark-content">
            <div class="bookmark-title">${bookmark.title}</div>
            <div class="bookmark-url">${bookmark.url}</div>
            ${bookmark.description ? `<div class="bookmark-description">${bookmark.description}</div>` : ''}
        </div>
        <div class="bookmark-actions">
            <button class="bookmark-edit-btn" data-bookmark-id="${bookmark.id}" title="编辑书签">
                <i class="fas fa-edit"></i>
            </button>
            <button class="bookmark-delete-btn" data-bookmark-id="${bookmark.id}" title="删除书签">
                <i class="fas fa-trash"></i>
            </button>
        </div>
        <a href="${bookmark.url}" target="_blank" class="bookmark-link" data-bookmark-id="${bookmark.id}"></a>
    `;
    
    return div;
}

// 添加书签拖拽排序功能
function addBookmarkDragDrop() {
    const bookmarkCategories = document.getElementById('bookmark-categories');
    if (!bookmarkCategories) return;

    bookmarkCategories.addEventListener('dragstart', (e) => {
        if (e.target.closest('.bookmark-item')) {
            e.dataTransfer.setData('text/plain', e.target.closest('.bookmark-item').dataset.bookmarkId);
            e.target.closest('.bookmark-item').classList.add('dragging');
        }
    });

    bookmarkCategories.addEventListener('dragend', (e) => {
        if (e.target.closest('.bookmark-item')) {
            e.target.closest('.bookmark-item').classList.remove('dragging');
        }
    });

    bookmarkCategories.addEventListener('dragover', (e) => {
        e.preventDefault();
        const category = e.target.closest('.bookmark-category');
        if (category) {
            category.classList.add('drag-over');
        }
    });

    bookmarkCategories.addEventListener('dragleave', (e) => {
        const category = e.target.closest('.bookmark-category');
        if (category) {
            category.classList.remove('drag-over');
        }
    });

    bookmarkCategories.addEventListener('drop', (e) => {
        e.preventDefault();
        const category = e.target.closest('.bookmark-category');
        if (category) {
            category.classList.remove('drag-over');
            const bookmarkId = e.dataTransfer.getData('text/plain');
            const newCategoryId = category.dataset.categoryId;
            
            BookmarkManager.updateBookmark(bookmarkId, { category: newCategoryId });
            renderBookmarksPage();
            showMessage('书签已移动到新分类', 'success');
        }
    });
}

// 显示添加书签模态框
function showAddBookmarkModal() {
    const data = BookmarkManager.getAllBookmarks();
    const categoryOptions = data.categories.map(category => 
        `<option value="${category.id}">${category.name}</option>`
    ).join('');

    const modal = createModal('添加书签', `
        <form id="add-bookmark-form">
            <div class="form-group">
                <label for="bookmark-title">标题 *</label>
                <input type="text" id="bookmark-title" required>
            </div>
            <div class="form-group">
                <label for="bookmark-url">网址 *</label>
                <input type="url" id="bookmark-url" required placeholder="https://example.com">
            </div>
            <div class="form-group">
                <label for="bookmark-category">分类</label>
                <select id="bookmark-category">
                    ${categoryOptions}
                </select>
            </div>
            <div class="form-group">
                <label for="bookmark-icon">图标</label>
                <input type="text" id="bookmark-icon" placeholder="fas fa-link">
            </div>
            <div class="form-group">
                <label for="bookmark-description">描述</label>
                <textarea id="bookmark-description" rows="3"></textarea>
            </div>
        </form>
    `, [
        { text: '取消', class: 'btn-secondary', action: 'close' },
        { text: '添加', class: 'btn-primary', action: 'submit' }
    ]);

    modal.querySelector('#add-bookmark-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const bookmark = {
            title: document.getElementById('bookmark-title').value,
            url: document.getElementById('bookmark-url').value,
            category: document.getElementById('bookmark-category').value,
            icon: document.getElementById('bookmark-icon').value || 'fas fa-link',
            description: document.getElementById('bookmark-description').value
        };
        
        BookmarkManager.addBookmark(bookmark);
        renderBookmarksPage();
        modal.remove();
        showMessage('书签添加成功', 'success');
    });
}

// 显示编辑书签模态框
function showEditBookmarkModal(bookmarkId) {
    const data = BookmarkManager.getAllBookmarks();
    const bookmark = data.bookmarks.find(b => b.id === bookmarkId);
    if (!bookmark) return;

    const categoryOptions = data.categories.map(category => 
        `<option value="${category.id}" ${category.id === bookmark.category ? 'selected' : ''}>${category.name}</option>`
    ).join('');

    const modal = createModal('编辑书签', `
        <form id="edit-bookmark-form">
            <div class="form-group">
                <label for="edit-bookmark-title">标题 *</label>
                <input type="text" id="edit-bookmark-title" value="${bookmark.title}" required>
            </div>
            <div class="form-group">
                <label for="edit-bookmark-url">网址 *</label>
                <input type="url" id="edit-bookmark-url" value="${bookmark.url}" required>
            </div>
            <div class="form-group">
                <label for="edit-bookmark-category">分类</label>
                <select id="edit-bookmark-category">
                    ${categoryOptions}
                </select>
            </div>
            <div class="form-group">
                <label for="edit-bookmark-icon">图标</label>
                <input type="text" id="edit-bookmark-icon" value="${bookmark.icon}">
            </div>
            <div class="form-group">
                <label for="edit-bookmark-description">描述</label>
                <textarea id="edit-bookmark-description" rows="3">${bookmark.description || ''}</textarea>
            </div>
        </form>
    `, [
        { text: '取消', class: 'btn-secondary', action: 'close' },
        { text: '保存', class: 'btn-primary', action: 'submit' }
    ]);

    modal.querySelector('#edit-bookmark-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const updates = {
            title: document.getElementById('edit-bookmark-title').value,
            url: document.getElementById('edit-bookmark-url').value,
            category: document.getElementById('edit-bookmark-category').value,
            icon: document.getElementById('edit-bookmark-icon').value,
            description: document.getElementById('edit-bookmark-description').value
        };
        
        BookmarkManager.updateBookmark(bookmarkId, updates);
        renderBookmarksPage();
        modal.remove();
        showMessage('书签更新成功', 'success');
    });
}

// 删除书签
function deleteBookmark(bookmarkId) {
    const data = BookmarkManager.getAllBookmarks();
    const bookmark = data.bookmarks.find(b => b.id === bookmarkId);
    if (!bookmark) return;

    if (confirm(`确定要删除书签"${bookmark.title}"吗？`)) {
        BookmarkManager.deleteBookmark(bookmarkId);
        renderBookmarksPage();
        showMessage('书签已删除', 'success');
    }
}

// 显示管理分类模态框
function showManageCategoriesModal() {
    const data = BookmarkManager.getAllBookmarks();
    const categoriesHtml = data.categories.map(category => `
        <div class="category-item" data-category-id="${category.id}">
            <div class="category-info">
                <div class="category-color" style="background-color: ${category.color}"></div>
                <div class="category-details">
                    <div class="category-name">${category.name}</div>
                    <div class="category-count">${data.bookmarks.filter(b => b.category === category.id).length} 个书签</div>
                </div>
            </div>
            <div class="category-actions">
                <button class="edit-category-btn" data-category-id="${category.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="delete-category-btn" data-category-id="${category.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');

    const modal = createModal('管理分类', `
        <div class="categories-list">
            ${categoriesHtml}
        </div>
        <button class="add-category-btn" id="add-category-btn">
            <i class="fas fa-plus"></i>
            添加新分类
        </button>
    `, [
        { text: '关闭', class: 'btn-secondary', action: 'close' }
    ]);

    // 绑定事件
    modal.querySelector('#add-category-btn').addEventListener('click', showAddCategoryModal);
    
    modal.addEventListener('click', (e) => {
        if (e.target.closest('.edit-category-btn')) {
            const categoryId = e.target.closest('.edit-category-btn').dataset.categoryId;
            modal.remove();
            showEditCategoryModal(categoryId);
        } else if (e.target.closest('.delete-category-btn')) {
            const categoryId = e.target.closest('.delete-category-btn').dataset.categoryId;
            deleteCategory(categoryId);
            modal.remove();
            showManageCategoriesModal();
        }
    });
}

// 显示添加分类模态框
function showAddCategoryModal() {
    const modal = createModal('添加分类', `
        <form id="add-category-form">
            <div class="form-group">
                <label for="category-name">分类名称 *</label>
                <input type="text" id="category-name" required>
            </div>
            <div class="form-group">
                <label for="category-color">颜色</label>
                <input type="color" id="category-color" value="#6b7280">
            </div>
            <div class="form-group">
                <label for="category-icon">图标</label>
                <input type="text" id="category-icon" placeholder="fas fa-folder">
            </div>
        </form>
    `, [
        { text: '取消', class: 'btn-secondary', action: 'close' },
        { text: '添加', class: 'btn-primary', action: 'submit' }
    ]);

    modal.querySelector('#add-category-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const category = {
            name: document.getElementById('category-name').value,
            color: document.getElementById('category-color').value,
            icon: document.getElementById('category-icon').value || 'fas fa-folder'
        };
        
        BookmarkManager.addCategory(category);
        renderBookmarksPage();
        modal.remove();
        showMessage('分类添加成功', 'success');
    });
}

// 显示编辑分类模态框
function showEditCategoryModal(categoryId) {
    const data = BookmarkManager.getAllBookmarks();
    const category = data.categories.find(c => c.id === categoryId);
    if (!category) return;

    const modal = createModal('编辑分类', `
        <form id="edit-category-form">
            <div class="form-group">
                <label for="edit-category-name">分类名称 *</label>
                <input type="text" id="edit-category-name" value="${category.name}" required>
            </div>
            <div class="form-group">
                <label for="edit-category-color">颜色</label>
                <input type="color" id="edit-category-color" value="${category.color}">
            </div>
            <div class="form-group">
                <label for="edit-category-icon">图标</label>
                <input type="text" id="edit-category-icon" value="${category.icon}">
            </div>
        </form>
    `, [
        { text: '取消', class: 'btn-secondary', action: 'close' },
        { text: '保存', class: 'btn-primary', action: 'submit' }
    ]);

    modal.querySelector('#edit-category-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const updates = {
            name: document.getElementById('edit-category-name').value,
            color: document.getElementById('edit-category-color').value,
            icon: document.getElementById('edit-category-icon').value
        };
        
        BookmarkManager.updateCategory(categoryId, updates);
        renderBookmarksPage();
        modal.remove();
        showMessage('分类更新成功', 'success');
    });
}

// 删除分类
function deleteCategory(categoryId) {
    const data = BookmarkManager.getAllBookmarks();
    const category = data.categories.find(c => c.id === categoryId);
    if (!category) return;

    const bookmarkCount = data.bookmarks.filter(b => b.category === categoryId).length;
    if (bookmarkCount > 0) {
        if (confirm(`分类"${category.name}"中有${bookmarkCount}个书签，删除后这些书签将移动到"工作"分类。确定要删除吗？`)) {
            BookmarkManager.deleteCategory(categoryId);
            renderBookmarksPage();
            showMessage('分类已删除', 'success');
        }
    } else {
        if (confirm(`确定要删除分类"${category.name}"吗？`)) {
            BookmarkManager.deleteCategory(categoryId);
            renderBookmarksPage();
            showMessage('分类已删除', 'success');
        }
    }
}

// 创建模态框
function createModal(title, content, buttons = []) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal">
            <div class="modal-header">
                <h3>${title}</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                ${content}
            </div>
            <div class="modal-footer">
                ${buttons.map(btn => `
                    <button class="btn ${btn.class}" data-action="${btn.action}">${btn.text}</button>
                `).join('')}
            </div>
        </div>
    `;

    // 绑定事件
    modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });

    // 按钮事件
    buttons.forEach(btn => {
        if (btn.action === 'submit') {
            // 提交按钮在各自的表单中处理
        } else if (btn.action === 'close') {
            modal.querySelector(`[data-action="${btn.action}"]`).addEventListener('click', () => modal.remove());
        }
    });

    document.body.appendChild(modal);
    return modal;
}

// 导出到全局作用域
if (typeof window !== 'undefined') {
    window.BookmarkManager = BookmarkManager;
    window.initializeBookmarks = initializeBookmarks;
}
