/**
 * 个性化设置模块
 */
const Preferences = (function() {
    // DOM元素
    const preferencesBtn = document.getElementById('preferences-btn');
    const preferencesModal = document.getElementById('preferences-modal');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const closeModalBtn = preferencesModal ? preferencesModal.querySelector('.close-modal') : null;
    
    /**
 * 打开偏好设置模态框
 * @param {HTMLElement} modal - 要打开的模态框元素
 * 显示模态框并添加淡入动画效果
 * 设置body的modal-open类防止背景滚动
 */
    const openModal = (modal) => {
        if (!modal) return;
        modal.style.display = 'flex';
        setTimeout(() => {
            modal.classList.add('active');
            document.body.classList.add('modal-open');
        }, 10);
    };
    
    /**
 * 关闭偏好设置模态框
 * @param {HTMLElement} modal - 要关闭的模态框元素
 * 隐藏模态框并移除body的modal-open类
 * 等待过渡动画完成后完全隐藏模态框
 */
    const closeModal = (modal) => {
        if (!modal) return;
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.classList.remove('modal-open');
        }, 300); // 等待过渡效果完成
    };
    
    // debounce函数 - 用于减少函数执行频率
    const debounce = (func, wait) => {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                func.apply(context, args);
            }, wait);
        };
    };
    
    /**
 * 保存用户偏好设置
 * 将当前设置保存到本地存储
 * 同步更新ThemeManager和页面样式
 * 显示保存成功的Toast提示
 */
    const savePreferences = () => {
        try {
            // 保存当前设置到Storage
            Storage.updatePreferences(currentPreferences);
            
            // 确保ThemeManager与保存的设置同步
            if (typeof ThemeManager !== 'undefined') {
                if (currentPreferences.theme === 'dark') {
                    ThemeManager.enableDarkMode(true);
                } else {
                    ThemeManager.enableLightMode(true);
                }
            }
            
            // 关闭模态框
            closeModal(preferencesModal);
            
            // 显示保存成功提示
            if (window.PreferencesUtils && PreferencesUtils.createToast) {
                PreferencesUtils.createToast('设置已保存', 'success');
            } else {
                const toast = document.createElement('div');
                toast.className = 'toast toast-success';
                toast.textContent = '设置已保存';
                document.body.appendChild(toast);
                
                // 自动移除提示
                setTimeout(() => {
                    toast.classList.add('toast-hide');
                    setTimeout(() => {
                        document.body.removeChild(toast);
                    }, 300);
                }, 3000);
            }
            
            console.log('设置已保存', currentPreferences);
        } catch (error) {
            console.error('保存设置失败:', error);
            alert('保存设置失败');
        }
    };
    
    // 重置设置函数
    const resetPreferences = () => {
        if (confirm('确定要重置所有设置吗？')) {
            try {
                // 获取默认设置
                currentPreferences = Storage.resetPreferences();
                
                // 应用设置到UI
                applyPreferencesToUI();
                
                // 应用设置到页面
                applyPreferencesToPage();
                
                // 显示重置成功提示
                if (window.PreferencesUtils && PreferencesUtils.createToast) {
                    PreferencesUtils.createToast('设置已重置', 'info');
                } else {
                    const toast = document.createElement('div');
                    toast.className = 'toast toast-info';
                    toast.textContent = '设置已重置';
                    document.body.appendChild(toast);
                    
                    // 自动移除提示
                    setTimeout(() => {
                        toast.classList.add('toast-hide');
                        setTimeout(() => {
                            document.body.removeChild(toast);
                        }, 300);
                    }, 3000);
                }
                
                console.log('设置已重置', currentPreferences);
            } catch (error) {
                console.error('重置设置失败:', error);
                alert('重置设置失败');
            }
        }
    };
    
    // 主题选择器
    const themeOptions = document.querySelectorAll('.theme-option');
    const accentColorPicker = document.getElementById('accent-color');
    const accentColorValue = accentColorPicker ? accentColorPicker.nextElementSibling : null;
    
    // 卡片样式选择器
    const cardStyleOptions = document.querySelectorAll('.card-style-option');
    
    // 动画开关
    const animationToggle = document.getElementById('animation-toggle');
    
    // 布局选择器
    const layoutOptions = document.querySelectorAll('.layout-option');
    
    // 磁贴布局设置
    const tileLayoutOptions = document.querySelectorAll('.tile-layout-option');
    
    // 背景设置
    const bgTypeOptions = document.querySelectorAll('.bg-type-option');
    const bgColorPicker = document.getElementById('bg-color');
    const bgColorValue = bgColorPicker ? bgColorPicker.nextElementSibling : null;
    
    // 检查是否所有必要的DOM元素都存在
    const checkDomElements = () => {
        const missingElements = [];
        
        if (!preferencesBtn) missingElements.push('preferences-btn');
        if (!preferencesModal) missingElements.push('preferences-modal');
        if (tabBtns.length === 0) missingElements.push('tab-btn');
        if (tabContents.length === 0) missingElements.push('tab-content');
        if (themeOptions.length === 0) missingElements.push('theme-option');
        if (!accentColorPicker) missingElements.push('accent-color');
        if (cardStyleOptions.length === 0) missingElements.push('card-style-option');
        if (!animationToggle) missingElements.push('animation-toggle');
        if (layoutOptions.length === 0) missingElements.push('layout-option');
        if (tileLayoutOptions.length === 0) missingElements.push('tile-layout-option');
        if (!bgColorPicker) missingElements.push('bg-color');
        
        if (missingElements.length > 0) {
            console.warn('以下元素未找到:', missingElements.join(', '));
            return false;
        }
        
        return true;
    };
    
    // 当前设置
    let currentPreferences = {};
    
    // 检查当前主题状态
    const checkCurrentTheme = () => {
        // 优先使用 ThemeManager 的信息
        if (typeof ThemeManager !== 'undefined') {
            const currentTheme = ThemeManager.getCurrentTheme();
            updateThemeSelection(currentTheme);
        } else {
            // 回退到旧方法
            const isDarkMode = document.body.classList.contains('dark-mode');
            updateThemeSelection(isDarkMode ? 'dark' : 'light');
        }
    };
    
    // 更新主题选择UI
    const updateThemeSelection = (theme) => {
        themeOptions.forEach(option => {
            const optionTheme = option.getAttribute('data-theme');
            if (optionTheme === theme) {
                option.classList.add('active');
            } else {
                option.classList.remove('active');
            }
        });
        
        // 同步更新当前首选项对象
        if (currentPreferences) {
            currentPreferences.theme = theme;
        }
    };
    
    // 提供给ThemeManager调用的方法
    const updateThemeState = (theme) => {
        // 只在偏好设置窗口打开时更新UI
        if (preferencesModal && preferencesModal.classList.contains('active')) {
            updateThemeSelection(theme);
        }
        
        // 更新当前偏好设置
        if (currentPreferences) {
            currentPreferences.theme = theme;
        }
    };
    
    // 初始化
    const initialize = () => {
        try {
            // 加载当前设置
            currentPreferences = Storage.getPreferences();
            
            // 立即应用保存的设置到页面，确保页面初始化时就应用偏好设置
            applyPreferencesToPage();
            
            // 检查DOM元素
            const allElementsExist = checkDomElements();
            if (!allElementsExist) {
                console.warn('部分DOM元素未找到，将在300ms后重试初始化');
                setTimeout(initialize, 300);
                return;
            }
            
            // 与ThemeManager协调
            checkCurrentTheme();
            
            // 设置事件监听器
            setupEventListeners();
            
            // 应用当前设置到界面
            applyPreferencesToUI();
            
            // 添加窗口大小变化监听器，以便在调整窗口大小时重新应用布局
            window.addEventListener('resize', debounce(() => {
                applyPreferencesToPage();
            }, 250));
            
            // 注入动画相关样式
            if (window.PreferencesUtils && PreferencesUtils.injectPreferencesStyles) {
                PreferencesUtils.injectPreferencesStyles();
            }
            
            console.log('偏好设置模块初始化成功');
        } catch (error) {
            console.error('偏好设置模块初始化失败:', error);
        }
    };
    
    // 设置事件监听器
    const setupEventListeners = () => {
        // 打开设置模态框
        if (preferencesBtn) {
            preferencesBtn.addEventListener('click', () => {
                openModal(preferencesModal);
            });
        }
        
        // 关闭模态框按钮
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', () => {
                // 关闭模态框时自动保存设置
                savePreferences();
                closeModal(preferencesModal);
            });
        }
        
        // 点击模态框外部关闭
        if (preferencesModal) {
            preferencesModal.addEventListener('click', (e) => {
                if (e.target === preferencesModal) {
                    // 点击模态框外部时自动保存设置
                    savePreferences();
                    closeModal(preferencesModal);
                }
            });
        }
        
        // 标签页切换
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabId = btn.dataset.tab;
                
                // 更新活动标签按钮
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // 更新活动标签内容
                tabContents.forEach(content => {
                    content.classList.remove('active');
                    if (content.id === `${tabId}-tab`) {
                        content.classList.add('active');
                    }
                });
            });
        });
        
        // 主题选择
        themeOptions.forEach(option => {
            option.addEventListener('click', () => {
                const theme = option.getAttribute('data-theme');
                
                // 移除所有主题选项的活动状态
                themeOptions.forEach(o => o.classList.remove('active'));
                
                // 设置当前选中项
                option.classList.add('active');
                
                // 更新当前配置
                currentPreferences.theme = theme;
                
                // 与ThemeManager协调
                if (typeof ThemeManager !== 'undefined') {
                    if (theme === 'dark') {
                        ThemeManager.enableDarkMode(false); // 不保存，只预览
                    } else {
                        ThemeManager.enableLightMode(false); // 不保存，只预览
                    }
                }
                
                // 应用预览
                previewChanges();
            });
        });
        
        // 强调色选择
        if (accentColorPicker && accentColorValue) {
            accentColorPicker.addEventListener('input', () => {
                const color = accentColorPicker.value;
                accentColorValue.textContent = color;
                currentPreferences.accentColor = color;
                previewChanges();
            });
        }
        
        // 卡片样式选择
        cardStyleOptions.forEach(option => {
            option.addEventListener('click', () => {
                const style = option.dataset.style;
                cardStyleOptions.forEach(o => o.classList.remove('active'));
                option.classList.add('active');
                currentPreferences.cardStyle = style;
                previewChanges();
            });
        });
        
        // 动画开关
        if (animationToggle) {
            animationToggle.addEventListener('change', () => {
                currentPreferences.animation = animationToggle.checked;
                previewChanges();
            });
        }
        
        // 布局选择
        layoutOptions.forEach(option => {
            option.addEventListener('click', () => {
                const layout = option.dataset.layout;
                layoutOptions.forEach(o => o.classList.remove('active'));
                option.classList.add('active');
                currentPreferences.layout = layout;
                
                // 根据布局类型显示或隐藏磁贴布局选择器
                const tileLayoutGroup = document.getElementById('tile-layout-group');
                if (tileLayoutGroup) {
                    tileLayoutGroup.style.display = layout === 'grid' ? 'block' : 'none';
                }
                
                previewChanges();
            });
        });
        
        // 磁贴布局选择
        tileLayoutOptions.forEach(option => {
            option.addEventListener('click', () => {
                const tileLayout = option.dataset.tilelayout;
                // 如果选择的是当前布局，不做任何变化
                if (currentPreferences.tileLayout === tileLayout) {
                    return;
                }
                
                tileLayoutOptions.forEach(o => o.classList.remove('active'));
                option.classList.add('active');
                currentPreferences.tileLayout = tileLayout;
                
                // 立即应用新的磁贴布局并添加过渡效果
                const bookmarksContainer = document.getElementById('bookmarks-container');
                if (bookmarksContainer && document.body.classList.contains('layout-grid')) {
                    let columns;
                    // 根据不同的屏幕尺寸设置不同的列数
                    if (window.innerWidth >= 1025) {
                        columns = tileLayout;
                    } else if (window.innerWidth >= 768 && window.innerWidth <= 1024) {
                        columns = Math.min(2, tileLayout);
                    } else {
                        columns = 1;
                    }
                    
                    // 先让所有磁贴有一个明显的变化
                    const bookmarkItems = bookmarksContainer.querySelectorAll('.bookmark-item');
                    bookmarkItems.forEach(item => {
                        item.style.opacity = '0.8';
                        item.style.transform = 'scale(0.95)';
                    });
                    
                    // 强制重绘
                    void bookmarksContainer.offsetWidth;
                    
                    // 应用布局变化动画
                    setTimeout(() => {
                        applyTileLayoutChange(bookmarksContainer, columns);
                    }, 50);
                }
                
                previewChanges();
            });
        });
        
        // 根据当前布局设置磁贴布局选择器显示状态
        const tileLayoutGroup = document.getElementById('tile-layout-group');
        if (tileLayoutGroup && currentPreferences.layout) {
            tileLayoutGroup.style.display = currentPreferences.layout === 'grid' ? 'block' : 'none';
        }
        
        // 背景类型选择
        bgTypeOptions.forEach(option => {
            option.addEventListener('click', () => {
                const bgType = option.dataset.bgtype;
                
                // 移除所有背景类型选项的活动状态
                bgTypeOptions.forEach(o => o.classList.remove('active'));
                
                // 设置当前选中项
                option.classList.add('active');
                
                // 根据选择的背景类型显示对应的设置
                document.querySelectorAll('.bg-settings').forEach(setting => {
                    setting.style.display = 'none';
                });
                
                const targetSetting = document.getElementById(`${bgType}-bg-settings`);
                if (targetSetting) {
                    targetSetting.style.display = 'block';
                }
                
                // 更新当前配置
                if (!currentPreferences.background) {
                    currentPreferences.background = {};
                }
                
                currentPreferences.background.type = bgType;
                previewChanges();
                
                // 背景颜色选择器
                if (bgColorPicker && bgColorValue) {
                    bgColorPicker.addEventListener('input', () => {
                        const color = bgColorPicker.value;
                        bgColorValue.textContent = color;
                        
                        if (!currentPreferences.background) {
                            currentPreferences.background = {};
                        }
                        currentPreferences.background.type = 'color';
                        currentPreferences.background.value = color;
                        
                        previewChanges();
                    });
                }
                

                
                // 应用预览
                previewChanges();
            });
        });
        
        // 背景颜色选择
        if (bgColorPicker && bgColorValue) {
            bgColorPicker.addEventListener('input', () => {
                const color = bgColorPicker.value;
                bgColorValue.textContent = color;
                if (!currentPreferences.background) {
                    currentPreferences.background = {};
                }
                currentPreferences.background.value = color;
                previewChanges();
            });
        }
    };
    
    // 将当前设置应用到UI
    const applyPreferencesToUI = () => {
        try {
            // 主题选择
            themeOptions.forEach(option => {
                option.classList.toggle('active', option.dataset.theme === currentPreferences.theme);
            });
            
            // 强调色
            if (accentColorPicker && accentColorValue && currentPreferences.accentColor) {
                accentColorPicker.value = currentPreferences.accentColor;
                accentColorValue.textContent = currentPreferences.accentColor;
            }
            
            // 卡片样式
            cardStyleOptions.forEach(option => {
                option.classList.toggle('active', option.dataset.style === currentPreferences.cardStyle);
            });
            
            // 动画开关
            if (animationToggle && currentPreferences.animation !== undefined) {
                animationToggle.checked = currentPreferences.animation;
            }
            
            // 布局选择
            layoutOptions.forEach(option => {
                option.classList.toggle('active', option.dataset.layout === currentPreferences.layout);
            });
            
            // 磁贴布局选择
            tileLayoutOptions.forEach(option => {
                option.classList.toggle('active', option.dataset.tilelayout === currentPreferences.tileLayout);
            });
            
            // 根据当前布局设置磁贴布局选择器显示状态
            const tileLayoutGroup = document.getElementById('tile-layout-group');
            if (tileLayoutGroup && currentPreferences.layout) {
                tileLayoutGroup.style.display = currentPreferences.layout === 'grid' ? 'block' : 'none';
            }
            
            // 背景设置
            if (currentPreferences.background) {
                // 设置背景类型选项
                bgTypeOptions.forEach(option => {
                    option.classList.toggle('active', option.dataset.bgtype === currentPreferences.background.type);
                });
                
                // 显示对应的背景设置
                document.querySelectorAll('.bg-settings').forEach(setting => {
                    setting.style.display = 'none';
                });
                
                const bgType = currentPreferences.background.type || 'default';
                const targetSetting = document.getElementById(`${bgType}-bg-settings`);
                if (targetSetting) {
                    targetSetting.style.display = 'block';
                }
                
                // 根据不同的背景类型应用不同的样式
                switch (bgType) {
                    case 'default':
                        document.body.style.background = '';
                        document.body.style.backgroundColor = 'rgb(57, 197, 187)'; // 初音未来的蓝色
                        document.body.style.backgroundImage = `url(pic/sky01.png)`;
                        document.body.style.backgroundSize = 'cover';
                        document.body.style.backgroundPosition = 'center';
                        document.body.style.backgroundRepeat = 'no-repeat';
                        document.body.style.backgroundAttachment = 'fixed';
                        break;
                        
                    case 'color':
                        if (bgColorPicker && bgColorValue && currentPreferences.background.value) {
                            bgColorPicker.value = currentPreferences.background.value;
                            bgColorValue.textContent = currentPreferences.background.value;
                        }
                        break;
                        
                    case 'image':
                        if (currentPreferences.background.value) {
                            // 先设置背景颜色为初音未来的蓝色，避免闪现默认图片
                            document.body.style.backgroundColor = 'rgb(57, 197, 187)';
                            document.body.style.backgroundImage = 'none';
                        }
                        break;
                }
            }
        } catch (error) {
            console.error('应用设置到UI时出错:', error);
        }
    };
    
    // 预览更改
    const previewChanges = () => {
        applyPreferencesToPage();
    };
    
    // 将当前设置应用到页面
    const applyPreferencesToPage = () => {
        try {
            const root = document.documentElement;
            
            // 应用强调色
            if (currentPreferences.accentColor) {
                root.style.setProperty('--accent-color', currentPreferences.accentColor);
                
                // 将十六进制颜色转换为RGB格式并应用到--accent-rgb变量
                const hexToRgb = (hex) => {
                    // 移除可能的#前缀
                    hex = hex.replace(/^#/, '');
                    
                    // 解析RGB值
                    let r, g, b;
                    if (hex.length === 3) {
                        // 简写形式 #RGB
                        r = parseInt(hex.charAt(0) + hex.charAt(0), 16);
                        g = parseInt(hex.charAt(1) + hex.charAt(1), 16);
                        b = parseInt(hex.charAt(2) + hex.charAt(2), 16);
                    } else {
                        // 完整形式 #RRGGBB
                        r = parseInt(hex.substring(0, 2), 16);
                        g = parseInt(hex.substring(2, 4), 16);
                        b = parseInt(hex.substring(4, 6), 16);
                    }
                    
                    return `${r}, ${g}, ${b}`;
                };
                
                // 应用RGB值到CSS变量
                const rgbValue = hexToRgb(currentPreferences.accentColor);
                root.style.setProperty('--accent-rgb', rgbValue);
            }
            
            // 应用卡片样式
            if (currentPreferences.cardStyle) {
                document.body.classList.remove('card-default', 'card-rounded', 'card-flat', 'card-bordered');
                document.body.classList.add(`card-${currentPreferences.cardStyle}`);
            }
            
            // 应用动画设置
            if (currentPreferences.animation !== undefined) {
                document.body.classList.toggle('no-animations', !currentPreferences.animation);
            }
            
            // 应用布局设置
            if (currentPreferences.layout) {
                document.body.classList.remove('layout-grid', 'layout-list');
                document.body.classList.add(`layout-${currentPreferences.layout}`);
            }
            
            // 应用磁贴布局设置
            if (currentPreferences.tileLayout) {
                document.documentElement.style.setProperty('--tiles-per-row', currentPreferences.tileLayout);
                const bookmarksContainer = document.getElementById('bookmarks-container');
                if (bookmarksContainer && document.body.classList.contains('layout-grid')) {
                    // 使用工具模块的动画函数
                    if (window.PreferencesUtils) {
                        PreferencesUtils.applyTileTransitions(bookmarksContainer);
                        let columns;
                        if (window.innerWidth >= 1025) {
                            columns = currentPreferences.tileLayout;
                        } else if (window.innerWidth >= 768 && window.innerWidth <= 1024) {
                            columns = Math.min(2, currentPreferences.tileLayout);
                        } else {
                            columns = 1;
                        }
                        PreferencesUtils.applyTileLayoutChange(bookmarksContainer, columns);
                    }
                }
            }
            
            // 应用背景设置
            if (currentPreferences.background) {
                const bgType = currentPreferences.background.type || 'default';
                const bgValue = currentPreferences.background.value;
                
                // 移除所有背景相关的类
                document.body.classList.remove('bg-default', 'bg-color', 'bg-image');
                document.body.classList.add(`bg-${bgType}`);
                
                // 根据不同的背景类型应用不同的样式
                switch (bgType) {
                    case 'default':
                        document.body.style.background = '';
                        document.body.style.backgroundColor = 'rgb(57, 197, 187)'; // 初音未来的蓝色
                        document.body.style.backgroundImage = `url(pic/sky01.png)`;
                        document.body.style.backgroundSize = 'cover';
                        document.body.style.backgroundPosition = 'center';
                        document.body.style.backgroundRepeat = 'no-repeat';
                        document.body.style.backgroundAttachment = 'fixed';
                        break;
                        
                    case 'color':
                        if (bgValue) {
                            document.body.style.background = bgValue;
                            document.body.style.backgroundImage = 'none';
                        }
                        break;
                        
                    case 'image':
                        // 图片URL功能已移除，使用默认背景
                        document.body.style.background = '';
                        document.body.style.backgroundColor = 'rgb(57, 197, 187)'; // 初音未来的蓝色
                        document.body.style.backgroundImage = `url(pic/sky01.png)`;
                        document.body.style.backgroundSize = 'cover';
                        document.body.style.backgroundPosition = 'center';
                        document.body.style.backgroundRepeat = 'no-repeat';
                        document.body.style.backgroundAttachment = 'fixed';
                        
                        // 更新当前配置为默认背景
                        if (currentPreferences.background) {
                            currentPreferences.background.type = 'default';
                            delete currentPreferences.background.value;
                        }
                        break;
                }
            }
        } catch (error) {
            console.error('应用设置到页面时出错:', error);
        }
    };
    
    return {
        initialize,
        updateThemeState,
        applyPreferencesToUI: applyPreferencesToUI,
        applyPreferencesToPage: applyPreferencesToPage,
        previewChanges: previewChanges
    };
})();