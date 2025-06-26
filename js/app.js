/**
 * 云际导航主应用程序
 */
/**
 * 云际导航主应用入口
 * 负责协调各模块初始化和应用生命周期管理
 */
(function() {
    // 当DOM加载完成后初始化应用
    document.addEventListener('DOMContentLoaded', async () => {
        // 设置默认启用简约模式（如果用户之前没有设置过）
        if (localStorage.getItem('simple_mode') === null) {
            localStorage.setItem('simple_mode', 'true');
        }
        
        // 初始化主题管理器
        // 负责应用的深色/浅色主题切换和颜色管理
        // 提供主题切换和主题状态查询功能
        if (typeof ThemeManager !== 'undefined') {
            try {
                ThemeManager.initialize();
                console.log('主题管理器初始化成功');
            } catch (error) {
                console.error('初始化主题管理器失败:', error);
            }
        } else {
            console.error('找不到ThemeManager模块');
        }
        
        // 初始化UI
        if (typeof UI !== 'undefined') {
            UI.initialize();
        } else {
            console.error('找不到UI模块');
        }
        
        // 初始化简约模式（优先于其他功能）
        // 负责切换应用的简约视图和标准视图
        // 根据用户设置决定是否启用简约界面
        if (typeof SimpleMode !== 'undefined') {
            try {
                SimpleMode.initialize();
                console.log('简约模式初始化成功');
            } catch (error) {
                console.error('初始化简约模式失败:', error);
            }
        } else {
            console.error('找不到SimpleMode模块');
        }
        
        // 初始化屏保
        if (typeof Screensaver !== 'undefined') {
            try {
                Screensaver.initialize();
            } catch (error) {
                console.error('初始化屏保失败:', error);
            }
        }
        
        // 初始化个性化设置
        if (typeof Preferences !== 'undefined') {
            try {
                Preferences.initialize();
                console.log('个性化设置初始化成功');
            } catch (error) {
                console.error('初始化个性化设置失败:', error);
            }
        } else {
            console.error('找不到Preferences模块');
        }
        


        /**
 * 设置应用程序键盘快捷键
 * 支持以下快捷键组合:
 * - Alt+S: 打开设置面板
 * - Alt+P: 打开个性化设置
 * - Alt+/ : 聚焦搜索框
 * - Alt+D: 切换深色模式
 * - Alt+M: 切换简约模式
 * - Esc: 关闭当前模态框
 */
        setupKeyboardShortcuts();
        
        // 初始化图标处理
        setTimeout(() => {
            if (typeof IconHandler !== 'undefined') {
                IconHandler.refreshAllIcons();
            }
        }, 300); // 延迟一点时间确保书签已加载
        
        // 设置拖放功能（如果需要后期实现）
        // setupDragAndDrop();
        
        // 自动聚焦到搜索框
        setTimeout(() => {
            const searchInput = document.getElementById('search-input');
            if (searchInput) {
                searchInput.focus();
                // 可选：选中搜索框中的所有文本（如果有的话）
                searchInput.select();
            }
        }, 100); // 短暂延迟确保页面已完全加载
    });
    
    // 设置键盘快捷键
    const setupKeyboardShortcuts = () => {
        document.addEventListener('keydown', (e) => {
            // Alt + S: 使用设置按钮添加新分类
            if (e.altKey && e.key === 's') {
                document.getElementById('settings-btn').click();
            }
            
            // Alt + P: 打开个性化设置
            if (e.altKey && e.key === 'p') {
                const preferencesBtn = document.getElementById('preferences-btn');
                if (preferencesBtn) {
                    preferencesBtn.click();
                }
            }
            
            // Esc: 关闭当前打开的模态框
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal.active').forEach(modal => {
                    modal.classList.remove('active');
                });
            }
            
            // Alt + /: 聚焦到搜索框
            if (e.altKey && e.key === '/') {
                document.getElementById('search-input').focus();
            }
            
            // Alt + D: 切换深色模式
            if (e.altKey && e.key === 'd') {
                if (typeof ThemeManager !== 'undefined') {
                    ThemeManager.toggleTheme();
                } else {
                    document.getElementById('dark-mode-toggle').click();
                }
            }
            
            // Alt + M: 切换简约模式
            if (e.altKey && e.key === 'm') {
                if (typeof SimpleMode !== 'undefined') {
                    SimpleMode.toggleSimpleMode();
                } else {
                    document.getElementById('simple-mode-toggle').click();
                }
            }
        });
    };
})();