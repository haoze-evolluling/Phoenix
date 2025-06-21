/**
 * 用户界面模块
 */
const UI = (function() {
    // DOM元素
    const bookmarksContainer = document.getElementById('bookmarks-container');
    const addCategoryModal = document.getElementById('add-category-modal');
    const addBookmarkModal = document.getElementById('add-bookmark-modal');
    const categoryNameInput = document.getElementById('category-name');
    const saveCategoryBtn = document.getElementById('save-category');
    const bookmarkNameInput = document.getElementById('bookmark-name');
    const bookmarkUrlInput = document.getElementById('bookmark-url');
    const bookmarkCategorySelect = document.getElementById('bookmark-category');
    const saveBookmarkBtn = document.getElementById('save-bookmark');
    const settingsBtn = document.getElementById('settings-btn');
    const closeModalBtns = document.querySelectorAll('.close-modal');

    // 当前正在编辑的项
    let currentEditingId = null;
    let currentCategoryForBookmark = null;
    
    // 初始化UI
    const initialize = () => {
        renderBookmarks();
        setupEventListeners();
    };
    
    // 设置事件监听器
    const setupEventListeners = () => {
        // 设置按钮 - 添加新分类功能
        settingsBtn.addEventListener('click', () => {
            currentEditingId = null; // 重置状态为新增
            openModal(addCategoryModal);
            categoryNameInput.value = '';
            categoryNameInput.focus();
        });
        
        // 保存分类按钮
        saveCategoryBtn.addEventListener('click', saveCategory);
        
        // 保存书签按钮
        saveBookmarkBtn.addEventListener('click', saveBookmark);
        
        // 关闭模态框按钮
        closeModalBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                closeModal(btn.closest('.modal'));
            });
        });
        
        // 阻止模态框内部点击事件冒泡
        document.querySelectorAll('.modal-content').forEach(content => {
            content.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        });
        
        // 点击模态框背景关闭
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', () => {
                closeModal(modal);
            });
        });
    };
    
    // 渲染所有书签和分类
    const renderBookmarks = () => {
        // 清空容器
        bookmarksContainer.innerHTML = '';
        
        // 获取数据
        const categories = Storage.getCategories();
        const bookmarks = Storage.getBookmarks();
        
        // 更新分类选择下拉框
        updateCategorySelect(categories);
        
        // 如果没有分类，显示一个欢迎信息
        if (categories.length === 0) {
            bookmarksContainer.innerHTML = `
                <div class="empty-state">
                    <h2>欢迎使用云际导航</h2>
                    <p>点击顶部设置图标添加您的第一个分类</p>
                </div>
            `;
            return;
        }
        
        // 渲染每个分类及其书签
        categories.forEach(category => {
            // 创建分类元素
            const categoryElem = createCategoryElement(category);
            bookmarksContainer.appendChild(categoryElem);
            
            // 过滤出属于该分类的书签
            const categoryBookmarks = bookmarks.filter(bookmark => bookmark.categoryId === category.id);
            
            // 如果该分类没有书签，显示空状态
            if (categoryBookmarks.length === 0) {
                categoryElem.querySelector('.bookmarks-list').innerHTML = `<div class="empty-bookmarks">暂无网站，点击"+"添加</div>`;
            } else {
                // 渲染书签
                const bookmarksList = categoryElem.querySelector('.bookmarks-list');
                categoryBookmarks.forEach(bookmark => {
                    const bookmarkElem = createBookmarkElement(bookmark);
                    bookmarksList.appendChild(bookmarkElem);
                });
            }
            
            // 添加事件监听器
            setupCategoryEvents(categoryElem, category);
        });
    };
    
    // 创建分类元素
    const createCategoryElement = (category) => {
        const categoryEl = document.createElement('div');
        categoryEl.className = 'category';
        categoryEl.dataset.id = category.id;

        const header = document.createElement('div');
        header.className = 'category-header';

        const title = document.createElement('h2');
        title.className = 'category-title';
        title.textContent = category.name;

        const actions = document.createElement('div');
        actions.className = 'category-actions';

        const addBtn = document.createElement('button');
        addBtn.innerHTML = '<i class="bi bi-plus-lg"></i>';
        addBtn.title = '添加网站';
        addBtn.addEventListener('click', () => showAddBookmarkModal(category.id));

        const editBtn = document.createElement('button');
        editBtn.innerHTML = '<i class="bi bi-pencil-fill"></i>';
        editBtn.title = '编辑分类';
        editBtn.className = 'edit-btn';
        editBtn.addEventListener('click', () => editCategory(category));

        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = '<i class="bi bi-trash-fill"></i>';
        deleteBtn.title = '删除分类';
        deleteBtn.className = 'delete-btn';
        deleteBtn.addEventListener('click', () => deleteCategory(category));

        actions.appendChild(addBtn);
        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);

        header.appendChild(title);
        header.appendChild(actions);

        const bookmarksList = document.createElement('div');
        bookmarksList.className = 'bookmarks-list';

        categoryEl.appendChild(header);
        categoryEl.appendChild(bookmarksList);

        return categoryEl;
    };
    
    // 创建书签元素
    const createBookmarkElement = (bookmark) => {
        const bookmarkElem = document.createElement('div');
        bookmarkElem.className = 'bookmark';
        bookmarkElem.dataset.id = bookmark.id;
        
        // 处理URL格式，如果不是以http或https开头，自动添加https://
        let url = bookmark.url;
        if (url && !url.match(/^(https?:\/\/|file:\/\/)/i)) {
            url = 'https://' + url;
        }
        
        // 创建书签链接部分
        const bookmarkLink = document.createElement('a');
        bookmarkLink.href = url;
        bookmarkLink.target = "_blank";
        bookmarkLink.title = bookmark.name;
        bookmarkLink.className = 'bookmark-name';
        
        // 创建图标元素
        const iconElement = document.createElement('img');
        iconElement.className = 'bookmark-icon';
        
        try {
            // 获取域名，用于图标获取
            const domain = new URL(url).hostname;
            
            // 设置初始图标 - 直接从网站获取
            iconElement.src = `https://${domain}/favicon.ico`;
            
            // 设置多级回退机制
            iconElement.onerror = function() {
                // 1. 如果直接从网站获取失败，尝试从百度获取
                this.src = `https://favicon.cccyun.cc/${domain}`;
                
                // 2. 如果百度获取失败，尝试从Google获取
                this.onerror = function() {
                    this.src = `https://www.google.com/s2/favicons?domain=${domain}`;
                    
                    // 3. 如果仍然失败，使用本地默认图标
                    this.onerror = function() {
                        this.src = 'pic/internet.png';
                        // 防止继续触发onerror事件
                        this.onerror = null;
                    };
                };
            };
        } catch (error) {
            // 如果URL解析失败，使用默认图标
            console.error("图标URL解析失败:", error);
            iconElement.src = 'pic/internet.png';
        }
        
        // 添加图标和文本到链接
        bookmarkLink.appendChild(iconElement);
        bookmarkLink.appendChild(document.createTextNode(bookmark.name));
        
        // 创建操作按钮部分
        const bookmarkActions = document.createElement('div');
        bookmarkActions.className = 'bookmark-actions';
        bookmarkActions.innerHTML = `
            <button class="edit-bookmark-btn" title="编辑"><i class="bi bi-pencil-fill"></i></button>
            <button class="delete-bookmark-btn" title="删除"><i class="bi bi-trash-fill"></i></button>
        `;
        
        // 将各部分添加到书签元素中
        bookmarkElem.appendChild(bookmarkLink);
        bookmarkElem.appendChild(bookmarkActions);
        
        // 添加事件监听器
        setupBookmarkEvents(bookmarkElem, bookmark);
        
        return bookmarkElem;
    };
    
    // 为分类添加事件监听器
    const setupCategoryEvents = (categoryElem, category) => {
        // 添加网站按钮
        const addBtn = categoryElem.querySelector('button[title="添加网站"]');
        addBtn.addEventListener('click', () => {
            showAddBookmarkModal(category.id);
        });
        
        // 编辑分类按钮
        categoryElem.querySelector('.edit-btn').addEventListener('click', () => {
            editCategory(category);
        });
        
        // 删除分类按钮
        categoryElem.querySelector('.delete-btn').addEventListener('click', () => {
            deleteCategory(category);
        });
    };
    
    // 为书签添加事件监听器
    const setupBookmarkEvents = (bookmarkElem, bookmark) => {
        // 编辑按钮
        const editBtn = bookmarkElem.querySelector('.edit-bookmark-btn');
        if (editBtn) {
            editBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                editBookmark(bookmark);
            });
        }
        
        // 删除按钮
        const deleteBtn = bookmarkElem.querySelector('.delete-bookmark-btn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                deleteBookmark(bookmark);
            });
        }
    };
    
    // 编辑分类
    const editCategory = (category) => {
        currentEditingId = category.id;
        categoryNameInput.value = category.name;
        openModal(addCategoryModal);
        categoryNameInput.focus();
    };
    
    // 删除分类
    const deleteCategory = (category) => {
        // 暂时禁用屏保触发
        clearTimeout(window.idleTimer);
        
        if (confirm(`确定要删除分类"${category.name}"吗？此操作将同时删除该分类下的所有网站。`)) {
            Storage.deleteCategory(category.id);
            renderBookmarks();
        }
        
        // 重置屏保计时器
        if (typeof Screensaver !== 'undefined' && Screensaver.resetIdleTimer) {
            Screensaver.resetIdleTimer();
        }
    };
    
    // 编辑书签
    const editBookmark = (bookmark) => {
        currentEditingId = bookmark.id;
        bookmarkNameInput.value = bookmark.name;
        bookmarkUrlInput.value = bookmark.url;
        bookmarkCategorySelect.value = bookmark.categoryId;
        openModal(addBookmarkModal);
        bookmarkNameInput.focus();
    };
    
    // 删除书签
    const deleteBookmark = (bookmark) => {
        // 暂时禁用屏保触发
        clearTimeout(window.idleTimer);
        
        if (confirm(`确定要删除"${bookmark.name}"吗？`)) {
            Storage.deleteBookmark(bookmark.id);
            renderBookmarks();
        }
        
        // 重置屏保计时器
        if (typeof Screensaver !== 'undefined' && Screensaver.resetIdleTimer) {
            Screensaver.resetIdleTimer();
        }
    };
    
    // 显示添加书签模态框
    const showAddBookmarkModal = (categoryId) => {
        currentEditingId = null; // 重置状态为新增
        currentCategoryForBookmark = categoryId;
        
        // 重置表单
        bookmarkNameInput.value = '';
        bookmarkUrlInput.value = '';
        
        // 设置默认分类
        if (bookmarkCategorySelect.options.length > 0) {
            for (let i = 0; i < bookmarkCategorySelect.options.length; i++) {
                if (bookmarkCategorySelect.options[i].value === categoryId) {
                    bookmarkCategorySelect.selectedIndex = i;
                    break;
                }
            }
        }
        
        openModal(addBookmarkModal);
        bookmarkNameInput.focus();
    };
    
    // 更新分类选择下拉框
    const updateCategorySelect = (categories) => {
        bookmarkCategorySelect.innerHTML = '';
        
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            bookmarkCategorySelect.appendChild(option);
        });
    };
    
    // 保存分类
    const saveCategory = () => {
        const name = categoryNameInput.value.trim();
        
        if (!name) {
            alert('请输入分类名称');
            return;
        }
        
        if (currentEditingId) {
            // 编辑现有分类
            Storage.updateCategory(currentEditingId, name);
        } else {
            // 添加新分类
            Storage.addCategory(name);
        }
        
        closeModal(addCategoryModal);
        renderBookmarks();
    };
    
    // 保存书签
    const saveBookmark = () => {
        const name = bookmarkNameInput.value.trim();
        const url = bookmarkUrlInput.value.trim();
        const categoryId = bookmarkCategorySelect.value;
        
        if (!name || !url) {
            alert('请输入网站名称和地址');
            return;
        }
        
        if (currentEditingId) {
            // 编辑现有书签
            Storage.updateBookmark(currentEditingId, { name, url, categoryId });
        } else {
            // 添加新书签
            Storage.addBookmark(name, url, null, categoryId);
        }
        
        closeModal(addBookmarkModal);
        renderBookmarks();
    };
    
    // 打开模态框
    const openModal = (modal) => {
        modal.classList.add('active');
    };
    
    // 关闭模态框
    const closeModal = (modal) => {
        modal.classList.remove('active');
    };
    
    // HTML转义
    const escapeHtml = (unsafe) => {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    };
    
    // 公开API
    return {
        initialize,
        renderBookmarks
    };
})();