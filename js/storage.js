/**
 * 数据存储模块
 */
const Storage = (function() {
    // 存储键名
    const BOOKMARKS_KEY = 'yunji_bookmarks';
    const CATEGORIES_KEY = 'yunji_categories';
    const PREFERENCES_KEY = 'yunji_preferences';
    
    // 默认偏好设置
    const DEFAULT_PREFERENCES = {
        theme: 'light',                // 主题模式: 'light' 或 'dark'
        background: {
            type: 'image',           // 背景类型: 'default', 'color', 'image'
            value: 'pic/sky01.png'                // 背景值: 颜色代码, 图片URL
        },
        accentColor: '#4a6cf7',        // 强调色
        cardStyle: 'default',          // 卡片样式: 'default', 'rounded', 'flat', 'bordered'
        animation: true,               // 是否启用动画
        layout: 'grid',                // 布局方式: 'grid' 或 'list'
        tileLayout: '4',               // 每行磁贴数量 (由TileManager自动根据设备类型设置)
        blur: 0                        // 背景模糊值(px)
    };
    
    // 初始化默认分类和书签
    const initializeDefaults = () => {
        // 默认分类
        const defaultCategories = [
            { id: '1', name: '资讯社交' },
            { id: '2', name: '网课教育' },
            { id: '3', name: '视频娱乐' },
            { id: '4', name: '工具助手' },
        ];
        
        // 默认书签
        const defaultBookmarks = [
            
            // 资讯社交
            { id: '6', name: '微信读书', url: 'https://weread.qq.com/', categoryId: '1' },
            { id: '7', name: 'QQ邮箱', url: 'https://mail.qq.com/', categoryId: '1' },
            { id: '8', name: '知乎', url: 'https://www.zhihu.com', categoryId: '1' },
            { id: '21', name: '新浪微博', url: 'https://weibo.com', categoryId: '1' },
            { id: '22', name: '百度贴吧', url: 'https://tieba.baidu.com/', categoryId: '1' },
            
            // 网课教育
            { id: '28', name: '中国大学MOOC', url: 'https://www.icourse163.org', categoryId: '2' },
            { id: '29', name: '学堂在线', url: 'https://www.xuetangx.com', categoryId: '2' },
            { id: '30', name: '智慧树', url: 'https://www.zhihuishu.com', categoryId: '2' },
            { id: '31', name: '超星学习通', url: 'https://www.chaoxing.com', categoryId: '2' },
            { id: '32', name: '网易云课堂', url: 'https://study.163.com', categoryId: '2' },
            
            // 视频娱乐
            { id: '28', name: '哔哩哔哩', url: 'https://www.bilibili.com', categoryId: '3' },
            { id: '29', name: '起点中文网', url: 'https://www.qidian.com', categoryId: '3' },
            { id: '30', name: '腾讯视频', url: 'https://v.qq.com', categoryId: '3' },
            { id: '31', name: '优酷', url: 'https://www.youku.com', categoryId: '3' },
            { id: '32', name: '抖音', url: 'https://www.douyin.com', categoryId: '3' },
            
            // 工具助手
            { id: '33', name: '百度', url: 'https://www.baidu.com', categoryId: '4' },
            { id: '34', name: '高德地图', url: 'https://www.amap.com', categoryId: '4' },
            { id: '35', name: 'WPS', url: 'https://www.wps.cn', categoryId: '4' },
            { id: '36', name: '豆包', url: 'https://www.doubao.com', categoryId: '4' },
            { id: '37', name: '12306', url: 'https://www.12306.cn', categoryId: '4' },
        ];
        
        // 存入本地存储
        localStorage.setItem(CATEGORIES_KEY, JSON.stringify(defaultCategories));
        localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(defaultBookmarks));
        
        return {
            categories: defaultCategories,
            bookmarks: defaultBookmarks
        };
    };
    
    // 获取所有分类
    const getCategories = () => {
        const categoriesJSON = localStorage.getItem(CATEGORIES_KEY);
        if (!categoriesJSON) {
            const defaults = initializeDefaults();
            return defaults.categories;
        }
        return JSON.parse(categoriesJSON);
    };
    
    // 获取所有书签
    const getBookmarks = () => {
        const bookmarksJSON = localStorage.getItem(BOOKMARKS_KEY);
        if (!bookmarksJSON) {
            const defaults = initializeDefaults();
            return defaults.bookmarks;
        }
        return JSON.parse(bookmarksJSON);
    };
    
    // 添加新分类
    const addCategory = (name) => {
        const categories = getCategories();
        const newCategory = {
            id: Date.now().toString(),
            name: name
        };
        
        categories.push(newCategory);
        localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
        return newCategory;
    };
    
    // 更新分类
    const updateCategory = (id, name) => {
        const categories = getCategories();
        const index = categories.findIndex(cat => cat.id === id);
        
        if (index !== -1) {
            categories[index].name = name;
            localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
            return categories[index];
        }
        
        return null;
    };
    
    // 删除分类
    const deleteCategory = (id) => {
        const categories = getCategories();
        const filteredCategories = categories.filter(cat => cat.id !== id);
        
        // 同时删除该分类下的所有书签
        const bookmarks = getBookmarks();
        const filteredBookmarks = bookmarks.filter(bookmark => bookmark.categoryId !== id);
        
        localStorage.setItem(CATEGORIES_KEY, JSON.stringify(filteredCategories));
        localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(filteredBookmarks));
        
        return {
            removedCategoryId: id,
            remainingCategories: filteredCategories,
            remainingBookmarks: filteredBookmarks
        };
    };
    
    // 添加新书签
    const addBookmark = (name, url, icon, categoryId) => {
        const bookmarks = getBookmarks();
        const newBookmark = {
            id: Date.now().toString(),
            name: name,
            url: url,
            icon: icon || null, // 不再在这里设置图标，而是在UI渲染时动态获取
            categoryId: categoryId
        };
        
        bookmarks.push(newBookmark);
        localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
        return newBookmark;
    };
    
    // 获取网站图标的函数
    const getFaviconUrl = (url) => {
        try {
            // 提取域名
            const urlObj = new URL(url);
            const domain = urlObj.hostname;
            
            // 多级回退机制
            return {
                // 1. 首先尝试从网站本身获取
                primary: `https://${domain}/favicon.ico`,
                
                // 2. 如果失败，尝试从百度获取
                fallback1: `https://favicon.cccyun.cc/${domain}`,
                
                // 3. 如果仍然失败，尝试从Google获取
                fallback2: `https://www.google.com/s2/favicons?domain=${domain}`,
                
                // 4. 最后的默认图标
                default: "pic/internet.png"
            };
        } catch (error) {
            // 如果URL解析失败，返回默认图标
            console.error("图标获取失败:", error);
            return {
                primary: "pic/internet.png",
                fallback1: null,
                fallback2: null,
                default: "pic/internet.png"
            };
        }
    };
    
    // 更新书签
    const updateBookmark = (id, data) => {
        const bookmarks = getBookmarks();
        const index = bookmarks.findIndex(bookmark => bookmark.id === id);
        
        if (index !== -1) {
            bookmarks[index] = {
                ...bookmarks[index],
                ...data
            };
            localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
            return bookmarks[index];
        }
        
        return null;
    };
    
    // 删除书签
    const deleteBookmark = (id) => {
        const bookmarks = getBookmarks();
        const filteredBookmarks = bookmarks.filter(bookmark => bookmark.id !== id);
        
        localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(filteredBookmarks));
        
        return {
            removedBookmarkId: id,
            remainingBookmarks: filteredBookmarks
        };
    };
    
    // 导出所有数据
    const exportData = () => {
        const data = {
            categories: getCategories(),
            bookmarks: getBookmarks(),
            exportDate: new Date().toISOString()
        };
        
        return JSON.stringify(data);
    };
    
    // 导入数据
    const importData = (jsonData) => {
        try {
            const data = JSON.parse(jsonData);
            
            if (!data.categories || !data.bookmarks) {
                throw new Error('数据格式无效');
            }
            
            localStorage.setItem(CATEGORIES_KEY, JSON.stringify(data.categories));
            localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(data.bookmarks));
            
            return {
                success: true,
                categories: data.categories,
                bookmarks: data.bookmarks
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    };
    
    // 获取用户偏好设置
    const getPreferences = () => {
        const preferencesJSON = localStorage.getItem(PREFERENCES_KEY);
        if (!preferencesJSON) {
            return DEFAULT_PREFERENCES;
        }
        
        // 合并用户设置和默认设置，确保有所有必要的属性
        return {...DEFAULT_PREFERENCES, ...JSON.parse(preferencesJSON)};
    };
    
    // 更新用户偏好设置
    const updatePreferences = (newPreferences) => {
        const currentPreferences = getPreferences();
        const updatedPreferences = {...currentPreferences, ...newPreferences};
        
        localStorage.setItem(PREFERENCES_KEY, JSON.stringify(updatedPreferences));
        return updatedPreferences;
    };
    
    // 重置用户偏好设置
    const resetPreferences = () => {
        try {
            localStorage.setItem(PREFERENCES_KEY, JSON.stringify(DEFAULT_PREFERENCES));
            return {...DEFAULT_PREFERENCES}; // 返回深拷贝以避免引用问题
        } catch (error) {
            console.error('重置偏好设置失败:', error);
            return {...DEFAULT_PREFERENCES}; // 即使失败也返回默认值
        }
    };
    
    // 公开API
    return {
        getCategories,
        getBookmarks,
        addCategory,
        updateCategory,
        deleteCategory,
        addBookmark,
        updateBookmark,
        deleteBookmark,
        getFaviconUrl,
        exportData,
        importData,
        getPreferences,
        updatePreferences,
        resetPreferences
    };
})();
 