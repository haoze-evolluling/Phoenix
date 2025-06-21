/**
 * 云际导航主应用程序
 */
(function() {
    // 动态导入touch-manager模块
    let touchManager = null;
    
    // 尝试导入touch-manager模块
    const loadTouchManager = async () => {
        try {
            touchManager = await import('./touch-manager.js');
            console.log('Touch manager loaded successfully');
            return true;
        } catch (error) {
            console.error('Failed to load touch manager:', error);
            return false;
        }
    };
    
    // 当DOM加载完成后初始化应用
    document.addEventListener('DOMContentLoaded', async () => {
        // 设置默认启用简约模式（如果用户之前没有设置过）
        if (localStorage.getItem('simple_mode') === null) {
            localStorage.setItem('simple_mode', 'true');
        }
        
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
        
        // 初始化简约模式（优先于其他功能）
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

        // 初始化触摸优化
        const touchManagerLoaded = await loadTouchManager();
        if (touchManagerLoaded && touchManager) {
            // 初始化触摸优化
            touchManager.initTouchOptimizations();
            
            // 添加设备特定类到body
            const deviceType = touchManager.detectDeviceType();
            document.body.classList.add(`device-${deviceType}`);
            console.log(`设备类型: ${deviceType}, 触摸优化已启用`);
        }
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