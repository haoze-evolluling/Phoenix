/**
 * 主题管理模块
 * 统一管理浅色/深色模式切换功能
 */
const ThemeManager = (function() {
    // DOM元素
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const body = document.body;
    
    // 主题状态
    let isDarkMode = false; // 默认为白天模式
    
    // 初始化主题
    const initialize = () => {
        // 检查本地存储中的主题设置
        checkThemePreference();
        
        // 设置切换按钮事件
        if (darkModeToggle) {
            darkModeToggle.addEventListener('click', toggleTheme);
        }
        
        // 检查系统主题偏好变化
        if (window.matchMedia) {
            const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
            prefersDarkScheme.addEventListener('change', (e) => {
                // 仅当用户没有手动设置过主题时响应系统变化
                if (!localStorage.getItem('theme')) {
                    if (e.matches) {
                        enableDarkMode(false); // 不保存设置，跟随系统
                    } else {
                        enableLightMode(false); // 不保存设置，跟随系统
                    }
                }
            });
        }
        
        // 将主题状态发布给其他模块
        publishThemeState();
    };
    
    // 切换主题
    const toggleTheme = () => {
        if (isDarkMode) {
            enableLightMode(true);
        } else {
            enableDarkMode(true);
        }
        
        // 添加切换动画效果
        if (darkModeToggle) {
            darkModeToggle.classList.add('icon-spin');
            setTimeout(() => {
                darkModeToggle.classList.remove('icon-spin');
            }, 500);
        }
    };
    
    // 启用深色模式
    const enableDarkMode = (savePreference = true) => {
        body.classList.add('dark-mode');
        body.classList.remove('light-mode');
        
        if (darkModeToggle) {
            darkModeToggle.innerHTML = '<i class="bi bi-sun-fill"></i>';
        }
        
        isDarkMode = true;
        
        if (savePreference) {
            localStorage.setItem('theme', 'dark');
        }
        
        // 发布主题变化事件
        publishThemeState();
    };
    
    // 启用浅色模式
    const enableLightMode = (savePreference = true) => {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
        
        if (darkModeToggle) {
            darkModeToggle.innerHTML = '<i class="bi bi-moon-stars-fill"></i>';
        }
        
        isDarkMode = false;
        
        if (savePreference) {
            localStorage.setItem('theme', 'light');
        }
        
        // 发布主题变化事件
        publishThemeState();
    };
    
    // 检查本地存储中的主题设置
    const checkThemePreference = () => {
        const savedTheme = localStorage.getItem('theme');
        
        if (savedTheme === 'light') {
            enableLightMode(false); // 不重复保存设置
        } else if (savedTheme === 'dark') {
            enableDarkMode(false); // 不重复保存设置
        } else {
            // 默认启用白天模式
        enableLightMode(false);
        }
    };
    
    // 发布主题状态给其他模块
    const publishThemeState = () => {
        // 更新偏好设置中的主题状态
        if (typeof Preferences !== 'undefined' && Preferences.updateThemeState) {
            Preferences.updateThemeState(isDarkMode ? 'dark' : 'light');
        }
        
        // 创建自定义事件通知其他模块
        const themeEvent = new CustomEvent('themeChange', {
            detail: { theme: isDarkMode ? 'dark' : 'light' }
        });
        document.dispatchEvent(themeEvent);
        
        // 更新简约模式的主题（如果简约模式处于激活状态）
        const simpleMode = document.getElementById('simple-mode');
        if (simpleMode) {
            if (isDarkMode) {
                simpleMode.classList.add('dark-mode');
                simpleMode.classList.remove('light-mode');
            } else {
                simpleMode.classList.add('light-mode');
                simpleMode.classList.remove('dark-mode');
            }
        }
    };
    
    // 获取当前主题状态
    const getCurrentTheme = () => {
        return isDarkMode ? 'dark' : 'light';
    };
    
    // 公开API
    return {
        initialize,
        enableDarkMode,
        enableLightMode,
        getCurrentTheme,
        toggleTheme
    };
})();