/**
 * Phoenix导航 - 普通模式应用入口
 */
(function() {
    // 当DOM加载完成后初始化应用
    document.addEventListener('DOMContentLoaded', async () => {
        // 初始化主题管理器(优先初始化)
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
        
        // 初始化模式切换器
        if (typeof ModeSwitcher !== 'undefined') {
            try {
                ModeSwitcher.initialize();
                console.log('模式切换器初始化成功');
            } catch (error) {
                console.error('初始化模式切换器失败:', error);
            }
        } else {
            console.error('找不到ModeSwitcher模块');
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
        
        // 初始化必应壁纸功能
        if (typeof BingWallpaper !== 'undefined') {
            try {
                setTimeout(() => {
                    // 检查相关依赖模块
                    const storageReady = typeof Storage !== 'undefined';
                    const preferencesReady = typeof Preferences !== 'undefined';
                    
                    if (!storageReady || !preferencesReady) {
                        console.warn('必应壁纸依赖模块未就绪，可能影响功能:', 
                            (!storageReady ? 'Storage模块缺失 ' : '') + 
                            (!preferencesReady ? 'Preferences模块缺失' : ''));
                    }
                    
                    // 检查DOM元素是否已准备好
                    if (document.getElementById('image-bg-settings')) {
                        console.log('开始初始化必应壁纸功能');
                        BingWallpaper.initialize();
                    } else {
                        console.warn('必应壁纸初始化延迟：等待DOM元素');
                        // 再次延迟尝试
                        setTimeout(() => {
                            if (document.getElementById('image-bg-settings')) {
                                console.log('再次尝试初始化必应壁纸功能');
                                BingWallpaper.initialize();
                            } else {
                                console.error('必应壁纸初始化失败：无法找到必要DOM元素');
                            }
                        }, 1000);
                    }
                }, 800); // 延长延迟时间，确保其他模块已完全加载
            } catch (error) {
                console.error('初始化必应壁纸功能失败:', error);
            }
        } else {
            console.error('找不到BingWallpaper模块');
        }

        // 设置键盘快捷键
        setupKeyboardShortcuts();
        
        // 初始化图标处理
        setTimeout(() => {
            if (typeof IconHandler !== 'undefined') {
                IconHandler.refreshAllIcons();
            }
        }, 300); // 延迟一点时间确保书签已加载
        
        // 恢复保存的状态
        restoreSavedState();
        
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
                }
            }
            
            // Alt + M: 切换到简约模式
            if (e.altKey && e.key === 'm') {
                if (typeof ModeSwitcher !== 'undefined') {
                    ModeSwitcher.switchMode();
                } else {
                    document.getElementById('simple-mode-btn').click();
                }
            }
        });
    };
    
    // 恢复保存的状态
    const restoreSavedState = () => {
        // 检查URL参数中是否有保留状态标志
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('preserve_state') && urlParams.get('preserve_state') === 'true') {
            // 恢复搜索引擎选择
            const savedEngine = localStorage.getItem('selected_search_engine');
            if (savedEngine) {
                const engineButtons = document.querySelectorAll('.search-engine-btn');
                engineButtons.forEach(btn => {
                    if (btn.dataset.engine === savedEngine) {
                        btn.click();
                    }
                });
            }
            
            // 恢复搜索框内容
            const savedSearchInput = localStorage.getItem('search_input_value');
            if (savedSearchInput) {
                const searchInput = document.getElementById('search-input');
                if (searchInput) {
                    searchInput.value = savedSearchInput;
                }
            }
            
            // 清除URL参数
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    };
})(); 