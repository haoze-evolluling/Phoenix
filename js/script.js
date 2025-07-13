// 搜索引擎配置
const searchEngines = {
    baidu: {
        name: '百度',
        url: 'https://www.baidu.com/s?wd='
    },
    google: {
        name: '谷歌',
        url: 'https://www.google.com/search?q='
    },
    bing: {
        name: '必应',
        url: 'https://www.bing.com/search?q='
    }
};

// 当前选中的搜索引擎
let currentEngine = 'baidu';

// DOM 元素
const timeDisplay = document.getElementById('currentTime');
const dateDisplay = document.getElementById('currentDate');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const engineBtns = document.querySelectorAll('.engine-btn');

// 时间更新函数
function updateTime() {
    const now = new Date();
    
    // 格式化时间
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const timeString = `${hours}:${minutes}:${seconds}`;
    
    // 格式化日期
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const date = now.getDate();
    const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    const weekday = weekdays[now.getDay()];
    const dateString = `${year}年${month}月${date}日 ${weekday}`;
    
    // 更新显示
    timeDisplay.textContent = timeString;
    dateDisplay.textContent = dateString;
}

// 搜索引擎切换函数
function switchEngine(engine) {
    currentEngine = engine;
    
    // 更新按钮状态
    engineBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.engine === engine) {
            btn.classList.add('active');
        }
    });
    
    // 更新搜索框占位符
    const engineName = searchEngines[engine].name;
    searchInput.placeholder = `在${engineName}中搜索...`;
}

// 执行搜索函数（增强版本，包含反馈）
function performSearch() {
    const query = searchInput.value.trim();
    if (query === '') {
        // 空搜索时的错误反馈
        ClickFeedback.addErrorFeedback(searchInput);
        ClickFeedback.vibrate([100, 50, 100]);
        searchInput.focus();
        return;
    }

    // 添加搜索按钮点击反馈
    ClickFeedback.addSearchButtonClick(searchBtn);
    ClickFeedback.addLoading(searchBtn);
    ClickFeedback.vibrate([50]);
    ClickFeedback.playSound('click');

    // 模拟短暂延迟以显示加载状态
    setTimeout(() => {
        const searchUrl = searchEngines[currentEngine].url + encodeURIComponent(query);
        window.open(searchUrl, '_blank');

        // 移除加载状态并添加成功反馈
        ClickFeedback.removeLoading(searchBtn);
        ClickFeedback.addSuccessFeedback(searchInput.parentElement);
        ClickFeedback.playSound('success');

        // 清空搜索框（可选）
        // searchInput.value = '';
    }, 200);
}

// 初始化函数（增强版本，包含点击反馈）
function init() {
    // 立即更新时间
    updateTime();

    // 每秒更新时间
    setInterval(updateTime, 1000);

    // 初始化搜索引擎
    switchEngine(currentEngine);

    // 为所有按钮添加点击缩放效果
    const allButtons = document.querySelectorAll('button, .shortcut-item');
    allButtons.forEach(btn => {
        ClickFeedback.addClickScale(btn);
    });

    // 绑定搜索引擎切换事件（增强版本）
    engineBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            switchEngine(btn.dataset.engine);
        });

        // 添加鼠标按下效果
        btn.addEventListener('mousedown', () => {
            ClickFeedback.vibrate([20]);
        });
    });

    // 绑定搜索按钮点击事件（增强版本）
    searchBtn.addEventListener('click', (e) => {
        performSearch();
    });

    // 绑定搜索框回车事件
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    // 搜索框获得焦点（增强版本）
    searchInput.addEventListener('focus', () => {
        searchInput.parentElement.style.transform = 'scale(1.02)';
        ClickFeedback.vibrate([10]);
    });

    // 搜索框失去焦点
    searchInput.addEventListener('blur', () => {
        searchInput.parentElement.style.transform = 'scale(1)';
    });

    // 快捷链接的点击反馈现在由ShortcutManager处理

    // 为时间显示添加点击反馈
    const timeDisplay = document.querySelector('.time-display');
    if (timeDisplay) {
        timeDisplay.addEventListener('click', (e) => {
            timeDisplay.classList.add('clicked');
            ClickFeedback.vibrate([50, 30, 50]);
            ClickFeedback.playSound('click');

            // 显示详细时间信息（可选功能）
            const greeting = utils.getGreeting();
            console.log(`${greeting}！当前时间：${new Date().toLocaleString()}`);

            setTimeout(() => {
                timeDisplay.classList.remove('clicked');
            }, 500);
        });
    }

    // 键盘快捷键支持（增强版本）
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + K 聚焦搜索框
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            searchInput.focus();
            searchInput.select();
            ClickFeedback.addSuccessFeedback(searchInput.parentElement);
            ClickFeedback.vibrate([30]);
        }

        // 数字键快速切换搜索引擎
        if (e.key >= '1' && e.key <= '3' && !searchInput.matches(':focus')) {
            const engines = ['baidu', 'google', 'bing'];
            const engineIndex = parseInt(e.key) - 1;
            if (engines[engineIndex]) {
                switchEngine(engines[engineIndex]);
                ClickFeedback.playSound('click');
            }
        }

        // ESC 键清空搜索框
        if (e.key === 'Escape' && searchInput.matches(':focus')) {
            searchInput.value = '';
            searchInput.blur();
            ClickFeedback.addSuccessFeedback(searchInput.parentElement);
            ClickFeedback.vibrate([20]);
        }
    });

    // 添加全局点击音效（可选）
    document.addEventListener('click', (e) => {
        // 只对特定元素播放音效
        if (e.target.matches('button, .shortcut-item, .time-display, .engine-btn')) {
            // 音效已在各自的事件处理器中处理
        }
    });

    // 页面加载完成后自动聚焦搜索框
    setTimeout(() => {
        searchInput.focus();
        ClickFeedback.addSuccessFeedback(searchInput.parentElement);
    }, 500);

    // 添加页面可见性变化时的反馈
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            // 页面重新可见时的欢迎反馈
            setTimeout(() => {
                ClickFeedback.addSuccessFeedback(timeDisplay);
            }, 200);
        }
    });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init);

// 添加一些实用的工具函数
const utils = {
    // 获取问候语
    getGreeting() {
        const hour = new Date().getHours();
        if (hour < 6) return '夜深了';
        if (hour < 9) return '早上好';
        if (hour < 12) return '上午好';
        if (hour < 14) return '中午好';
        if (hour < 18) return '下午好';
        if (hour < 22) return '晚上好';
        return '夜深了';
    },
    
    // 检测是否为移动设备
    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },
    
    // 保存用户偏好到本地存储
    savePreference(key, value) {
        try {
            localStorage.setItem(`newTab_${key}`, JSON.stringify(value));
        } catch (e) {
            console.warn('无法保存偏好设置:', e);
        }
    },
    
    // 从本地存储读取用户偏好
    loadPreference(key, defaultValue) {
        try {
            const saved = localStorage.getItem(`newTab_${key}`);
            return saved ? JSON.parse(saved) : defaultValue;
        } catch (e) {
            console.warn('无法读取偏好设置:', e);
            return defaultValue;
        }
    }
};

// 点击反馈工具类
const ClickFeedback = {

    // 添加点击缩放效果
    addClickScale(element) {
        element.classList.add('click-scale');
    },

    // 添加按钮点击动画
    addButtonClick(element) {
        element.classList.remove('btn-clicked');
        element.offsetHeight; // 强制重绘
        element.classList.add('btn-clicked');

        setTimeout(() => {
            element.classList.remove('btn-clicked');
        }, 300);
    },

    // 添加搜索按钮点击效果
    addSearchButtonClick(element) {
        element.classList.remove('clicked');
        element.offsetHeight;
        element.classList.add('clicked');

        setTimeout(() => {
            element.classList.remove('clicked');
        }, 400);
    },

    // 添加成功反馈
    addSuccessFeedback(element) {
        element.classList.remove('success-feedback');
        element.offsetHeight;
        element.classList.add('success-feedback');

        setTimeout(() => {
            element.classList.remove('success-feedback');
        }, 600);
    },

    // 添加错误反馈
    addErrorFeedback(element) {
        element.classList.remove('error-feedback');
        element.offsetHeight;
        element.classList.add('error-feedback');

        setTimeout(() => {
            element.classList.remove('error-feedback');
        }, 500);
    },

    // 添加加载状态
    addLoading(element) {
        element.classList.add('loading');
    },

    // 移除加载状态
    removeLoading(element) {
        element.classList.remove('loading');
    },

    // 触觉反馈（如果支持）
    vibrate(pattern = [50]) {
        if ('vibrate' in navigator) {
            navigator.vibrate(pattern);
        }
    },

    // 音效反馈（可选）
    playSound(type = 'click') {
        // 创建音频上下文（如果需要音效）
        if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
            try {
                const audioContext = new (AudioContext || webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);

                // 不同类型的音效
                switch(type) {
                    case 'click':
                        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
                        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
                        break;
                    case 'success':
                        oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
                        oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.1);
                        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
                        break;
                    case 'error':
                        oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
                        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
                        break;
                }

                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.3);
            } catch (e) {
                // 音效播放失败，静默处理
            }
        }
    }
};

// 快捷链接管理
const ShortcutManager = {
    // 默认快捷链接数据
    defaultShortcuts: [
        { icon: '📚', text: 'GitHub', url: 'https://github.com' },
        { icon: '💡', text: 'copilot', url: 'https://copilot.microsoft.com/' },
        { icon: '📖', text: '快科技', url: 'https://www.kkj.cn/' },
        { icon: '🎥', text: 'YouTube', url: 'https://www.youtube.com' }
    ],

    // 当前编辑的快捷链接元素
    currentEditingElement: null,

    // 初始化快捷链接管理
    init() {
        console.log('ShortcutManager 初始化开始');
        this.loadShortcuts();
        this.bindContextMenu();
        this.bindModalEvents();
        console.log('ShortcutManager 初始化完成');
    },

    // 加载快捷链接
    loadShortcuts() {
        const shortcuts = utils.loadPreference('shortcuts', this.defaultShortcuts);
        this.renderShortcuts(shortcuts);
    },

    // 渲染快捷链接
    renderShortcuts(shortcuts) {
        const container = document.querySelector('.shortcuts-container');
        container.innerHTML = '';

        shortcuts.forEach((shortcut, index) => {
            const shortcutElement = document.createElement('a');
            shortcutElement.href = shortcut.url;
            shortcutElement.target = '_blank';
            shortcutElement.className = 'shortcut-item';
            shortcutElement.dataset.index = index;

            shortcutElement.innerHTML = `
                <span class="shortcut-icon">${shortcut.icon}</span>
                <span class="shortcut-text">${shortcut.text}</span>
            `;

            // 添加点击事件
            shortcutElement.addEventListener('click', (e) => {
                shortcutElement.classList.add('clicked');
                ClickFeedback.vibrate([30]);
                ClickFeedback.playSound('click');

                setTimeout(() => {
                    shortcutElement.classList.remove('clicked');
                }, 300);
            });

            // 鼠标悬停效果
            shortcutElement.addEventListener('mouseenter', () => {
                ClickFeedback.vibrate([5]);
            });

            container.appendChild(shortcutElement);
        });

        // 重新绑定右键菜单
        this.bindContextMenu();
    },

    // 绑定右键菜单
    bindContextMenu() {
        const shortcutItems = document.querySelectorAll('.shortcut-item');
        const contextMenu = document.getElementById('contextMenu');

        shortcutItems.forEach(item => {
            item.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                console.log('右键点击快捷链接:', item);
                this.currentEditingElement = item;
                this.showContextMenu(e.clientX, e.clientY);
            });
        });

        // 点击其他地方隐藏菜单
        document.addEventListener('click', () => {
            this.hideContextMenu();
        });

        // 编辑按钮点击事件
        document.getElementById('editShortcut').addEventListener('click', () => {
            this.showEditModal();
            this.hideContextMenu();
        });
    },

    // 显示右键菜单
    showContextMenu(x, y) {
        const contextMenu = document.getElementById('contextMenu');
        contextMenu.style.display = 'block';
        contextMenu.style.left = x + 'px';
        contextMenu.style.top = y + 'px';

        // 确保菜单不会超出屏幕
        const rect = contextMenu.getBoundingClientRect();
        if (rect.right > window.innerWidth) {
            contextMenu.style.left = (x - rect.width) + 'px';
        }
        if (rect.bottom > window.innerHeight) {
            contextMenu.style.top = (y - rect.height) + 'px';
        }
    },

    // 隐藏右键菜单
    hideContextMenu() {
        document.getElementById('contextMenu').style.display = 'none';
    },

    // 显示编辑弹窗
    showEditModal() {
        if (!this.currentEditingElement) return;

        const modal = document.getElementById('editModal');
        const index = parseInt(this.currentEditingElement.dataset.index);
        const shortcuts = utils.loadPreference('shortcuts', this.defaultShortcuts);
        const shortcut = shortcuts[index];

        // 填充表单
        document.getElementById('editName').value = shortcut.text;
        document.getElementById('editUrl').value = shortcut.url;
        document.getElementById('editIcon').value = shortcut.icon;

        modal.classList.add('show');

        // 聚焦到名称输入框
        setTimeout(() => {
            document.getElementById('editName').focus();
        }, 100);

        // 绑定URL预览
        this.bindUrlPreview();
    },

    // 隐藏编辑弹窗
    hideEditModal() {
        document.getElementById('editModal').classList.remove('show');
        this.currentEditingElement = null;
    },

    // 绑定弹窗事件
    bindModalEvents() {
        const modal = document.getElementById('editModal');
        const closeBtn = document.getElementById('modalClose');
        const cancelBtn = document.getElementById('cancelEdit');
        const saveBtn = document.getElementById('saveEdit');

        // 关闭按钮
        closeBtn.addEventListener('click', () => {
            this.hideEditModal();
        });

        // 取消按钮
        cancelBtn.addEventListener('click', () => {
            this.hideEditModal();
        });

        // 保存按钮
        saveBtn.addEventListener('click', () => {
            this.saveShortcut();
        });

        // 点击背景关闭
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.hideEditModal();
            }
        });

        // ESC键关闭
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('show')) {
                this.hideEditModal();
            }
        });

        // 回车键保存
        const inputs = modal.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    this.saveShortcut();
                }
            });
        });
    },

    // 保存快捷链接
    saveShortcut() {
        const name = document.getElementById('editName').value.trim();
        const url = document.getElementById('editUrl').value.trim();
        const icon = document.getElementById('editIcon').value.trim();

        // 验证输入
        if (!name) {
            ClickFeedback.addErrorFeedback(document.getElementById('editName'));
            ClickFeedback.vibrate([100, 50, 100]);
            document.getElementById('editName').focus();
            return;
        }

        if (!url) {
            ClickFeedback.addErrorFeedback(document.getElementById('editUrl'));
            ClickFeedback.vibrate([100, 50, 100]);
            document.getElementById('editUrl').focus();
            return;
        }

        // 验证URL格式
        let validUrl = url;
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            validUrl = 'https://' + url;
        }

        try {
            new URL(validUrl);
        } catch {
            ClickFeedback.addErrorFeedback(document.getElementById('editUrl'));
            ClickFeedback.vibrate([100, 50, 100]);
            document.getElementById('editUrl').focus();
            return;
        }

        if (!icon) {
            ClickFeedback.addErrorFeedback(document.getElementById('editIcon'));
            ClickFeedback.vibrate([100, 50, 100]);
            document.getElementById('editIcon').focus();
            return;
        }

        // 更新数据
        const shortcuts = utils.loadPreference('shortcuts', this.defaultShortcuts);
        const index = parseInt(this.currentEditingElement.dataset.index);

        shortcuts[index] = {
            text: name,
            url: validUrl,
            icon: icon
        };

        // 保存到本地存储
        utils.savePreference('shortcuts', shortcuts);

        // 重新渲染
        this.renderShortcuts(shortcuts);

        // 成功反馈
        ClickFeedback.addSuccessFeedback(document.querySelector('.shortcuts-container'));
        ClickFeedback.vibrate([50, 30, 50]);
        ClickFeedback.playSound('success');

        // 关闭弹窗
        this.hideEditModal();
    },

    // 绑定URL预览功能
    bindUrlPreview() {
        const urlInput = document.getElementById('editUrl');
        const urlPreview = document.getElementById('urlPreview');

        urlInput.addEventListener('input', () => {
            const url = urlInput.value.trim();
            if (!url) {
                urlPreview.textContent = '';
                urlPreview.className = 'url-preview';
                urlInput.classList.remove('error');
                return;
            }

            let validUrl = url;
            if (!url.startsWith('http://') && !url.startsWith('https://')) {
                validUrl = 'https://' + url;
            }

            try {
                const urlObj = new URL(validUrl);
                urlPreview.textContent = `预览: ${urlObj.href}`;
                urlPreview.className = 'url-preview valid';
                urlInput.classList.remove('error');
            } catch {
                urlPreview.textContent = '无效的URL格式';
                urlPreview.className = 'url-preview invalid';
                urlInput.classList.add('error');
            }
        });
    }
};

// 加载用户偏好的搜索引擎
document.addEventListener('DOMContentLoaded', () => {
    const savedEngine = utils.loadPreference('searchEngine', 'baidu');
    if (searchEngines[savedEngine]) {
        currentEngine = savedEngine;
    }

    // 初始化快捷链接管理
    ShortcutManager.init();
});

// 保存搜索引擎偏好（更新版本，包含点击反馈）
function switchEngine(engine) {
    currentEngine = engine;
    utils.savePreference('searchEngine', engine);

    // 更新按钮状态
    engineBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.engine === engine) {
            btn.classList.add('active');
            // 添加点击反馈
            ClickFeedback.addButtonClick(btn);
            ClickFeedback.vibrate([30]);
        }
    });

    // 更新搜索框占位符
    const engineName = searchEngines[engine].name;
    searchInput.placeholder = `在${engineName}中搜索...`;
}
