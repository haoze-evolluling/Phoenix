/**
 * 必应壁纸选择功能模块
 * 提供必应每日壁纸的获取、展示和应用功能
 */
const BingWallpaper = (function() {
    // 必应壁纸API和基础配置
    const BING_API_URL = 'https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=8';
    const BING_BASE_URL = 'https://www.bing.com';
    
    // 壁纸缓存和状态管理
    let wallpapers = [];
    let selectedWallpaper = null;
    let isLoading = false;
    let hasError = false;
    let isInitialized = false;
    
    // DOM元素引用
    let container, previewElement, refreshBtn, applyBtn;
    
    /**
     * 获取必应壁纸
     * @returns {Promise} 返回获取壁纸的Promise对象
     */
    const fetchBingWallpapers = () => {
        return new Promise((resolve) => {
            try {
                isLoading = true;
                hasError = false;
                updateButtonsState();
                
                console.log('开始获取必应壁纸...');
                
                // 创建代理URL，解决跨域问题
                const proxyUrl = 'https://api.allorigins.win/get?url=';
                const encodedUrl = encodeURIComponent(BING_API_URL);
                
                // 显示加载中状态
                container = document.querySelector('.bing-wallpapers-grid');
                if (container) {
                    container.innerHTML = `
                        <div class="bing-wallpaper-loading">
                            <div class="bing-wallpaper-spinner"></div>
                        </div>
                    `;
                }
                
                fetch(proxyUrl + encodedUrl)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`网络响应错误: ${response.status}`);
                        }
                        return response.json();
                    })
                    .then(data => {
                        // 解析返回的JSON字符串
                        const bingData = JSON.parse(data.contents);
                        
                        if (bingData && bingData.images && bingData.images.length > 0) {
                            console.log(`成功获取${bingData.images.length}张必应壁纸`);
                            
                            // 转换图片数据
                            wallpapers = bingData.images.map(image => ({
                                url: BING_BASE_URL + image.url,
                                title: image.title || '必应壁纸',
                                copyright: image.copyright || '',
                                date: image.startdate || ''
                            }));
                            
                            isLoading = false;
                            hasError = false;
                            
                            // 渲染壁纸列表
                            renderWallpapers();
                            updateButtonsState();
                            resolve(wallpapers);
                        } else {
                            throw new Error('获取必应壁纸失败，未找到图片数据');
                        }
                    })
                    .catch(error => {
                        console.error('获取必应壁纸失败:', error);
                        
                        // 显示错误状态
                        if (container) {
                            container.innerHTML = `
                                <div style="grid-column: span 2; text-align: center; padding: 20px;">
                                    <p>获取壁纸失败，请稍后重试</p>
                                    <button class="bing-wallpaper-btn" id="retry-wallpapers">
                                        <i class="bi bi-arrow-repeat"></i> 重试
                                    </button>
                                </div>
                            `;
                            
                            // 添加重试按钮事件
                            const retryBtn = document.getElementById('retry-wallpapers');
                            if (retryBtn) {
                                retryBtn.addEventListener('click', () => {
                                    fetchBingWallpapers().catch(() => {});
                                });
                            }
                        }
                        
                        isLoading = false;
                        hasError = true;
                        updateButtonsState();
                        wallpapers = [];
                        selectedWallpaper = null;
                        resolve([]);  // 即使失败也返回已解决的Promise
                    });
            } catch (error) {
                console.error('获取必应壁纸过程中出现异常:', error);
                isLoading = false;
                hasError = true;
                updateButtonsState();
                wallpapers = [];
                selectedWallpaper = null;
                resolve([]);  // 即使异常也返回已解决的Promise
            }
        });
    };
    
    /**
     * 更新按钮状态
     */
    const updateButtonsState = () => {
        if (refreshBtn) {
            refreshBtn.disabled = isLoading;
            refreshBtn.classList.toggle('disabled', isLoading);
            refreshBtn.innerHTML = isLoading ? 
                '<i class="bi bi-hourglass-split"></i> 加载中...' : 
                '<i class="bi bi-arrow-repeat"></i> 刷新';
        }
        
        if (applyBtn) {
            const canApply = selectedWallpaper !== null && !isLoading;
            applyBtn.disabled = !canApply;
            applyBtn.classList.toggle('disabled', !canApply);
        }
    };
    
    /**
     * 渲染壁纸列表
     */
    const renderWallpapers = () => {
        container = document.querySelector('.bing-wallpapers-grid');
        if (!container) return;
        
        // 清空容器
        container.innerHTML = '';
        
        // 检查是否有壁纸数据
        if (!wallpapers || wallpapers.length === 0) {
            container.innerHTML = `
                <div style="grid-column: span 2; text-align: center; padding: 20px;">
                    <p>暂无可用壁纸</p>
                    <button class="bing-wallpaper-btn" id="refresh-empty">
                        <i class="bi bi-arrow-repeat"></i> 刷新
                    </button>
                </div>
            `;
            
            const refreshEmptyBtn = document.getElementById('refresh-empty');
            if (refreshEmptyBtn) {
                refreshEmptyBtn.addEventListener('click', () => {
                    fetchBingWallpapers().catch(() => {});
                });
            }
            return;
        }
        
        // 添加壁纸项
        wallpapers.forEach((wallpaper, index) => {
            const item = document.createElement('div');
            item.className = 'bing-wallpaper-item';
            item.dataset.index = index;
            
            const img = document.createElement('img');
            img.className = 'bing-wallpaper-image';
            img.src = wallpaper.url;
            img.alt = wallpaper.title;
            img.loading = 'lazy';
            
            // 添加标题提示
            const titleTooltip = document.createElement('div');
            titleTooltip.className = 'wallpaper-tooltip';
            titleTooltip.textContent = wallpaper.title;
            
            // 添加点击事件
            item.addEventListener('click', () => {
                selectWallpaper(index);
            });
            
            item.appendChild(img);
            item.appendChild(titleTooltip);
            container.appendChild(item);
        });
        
        // 自动选择第一张壁纸
        if (wallpapers.length > 0) {
            selectWallpaper(0);
        }
    };
    
    /**
     * 选择壁纸
     * @param {number} index - 壁纸索引
     */
    const selectWallpaper = (index) => {
        try {
            const wallpaper = wallpapers[index];
            if (!wallpaper) {
                console.warn(`选择壁纸失败: 索引 ${index} 无效`);
                return;
            }
            
            console.log(`选择壁纸: ${wallpaper.title}`);
            selectedWallpaper = wallpaper;
            
            // 更新选中状态
            document.querySelectorAll('.bing-wallpaper-item').forEach((item, i) => {
                item.classList.toggle('selected', i === parseInt(index));
            });
            
            // 更新预览
            previewElement = document.querySelector('.bing-wallpaper-preview');
            if (previewElement) {
                previewElement.style.backgroundImage = `url(${wallpaper.url})`;
                
                // 添加加载状态
                previewElement.classList.add('loading');
                
                // 预加载图片
                const preloadImg = new Image();
                preloadImg.onload = () => {
                    previewElement.classList.remove('loading');
                };
                preloadImg.onerror = () => {
                    previewElement.classList.remove('loading');
                    previewElement.classList.add('error');
                    console.error(`预览图片加载失败: ${wallpaper.url}`);
                };
                preloadImg.src = wallpaper.url;
            }
            
            // 更新按钮状态
            updateButtonsState();
        } catch (error) {
            console.error('选择壁纸时出错:', error);
        }
    };
    
    /**
     * 应用选中的壁纸
     */
    const applySelectedWallpaper = () => {
        if (!selectedWallpaper) {
            showToast('请先选择一张壁纸', 'warning');
            return;
        }
        
        try {
            console.log(`应用壁纸: ${selectedWallpaper.title}`);
            
            // 方法1: 使用Preferences模块和Storage模块
            if (typeof Storage !== 'undefined' && typeof Preferences !== 'undefined') {
                try {
                    const currentPreferences = Storage.getPreferences();
                    if (!currentPreferences.background) {
                        currentPreferences.background = {};
                    }
                    
                    currentPreferences.background.type = 'image';
                    currentPreferences.background.value = selectedWallpaper.url;
                    
                    // 保存到Storage并应用
                    Storage.updatePreferences(currentPreferences);
                    Preferences.applyPreferencesToPage();
                    
                    showToast('壁纸已应用', 'success');
                    return;
                } catch (moduleError) {
                    console.error('使用偏好设置模块应用壁纸失败:', moduleError);
                    // 继续尝试备选方案
                }
            }
            
            // 方法2: 直接使用DOM操作设置背景
            document.body.style.backgroundColor = 'rgb(57, 197, 187)'; // 设置基础背景色
            
            // 创建一个新的图片对象来预加载
            const img = new Image();
            img.onload = function() {
                // 图片加载完成后再设置背景图
                document.body.style.backgroundImage = `url(${selectedWallpaper.url})`;
                document.body.style.backgroundSize = 'cover';
                document.body.style.backgroundPosition = 'center';
                document.body.style.backgroundRepeat = 'no-repeat';
                document.body.style.backgroundAttachment = 'fixed';
                
                // 移除其他背景类型，添加图片背景类
                document.body.classList.remove('bg-default', 'bg-color');
                document.body.classList.add('bg-image');
                
                showToast('壁纸已应用', 'success');
            };
            img.onerror = function() {
                // 图片加载失败
                document.body.style.backgroundImage = 'none';
                console.error('背景图片加载失败:', selectedWallpaper.url);
                showToast('壁纸应用失败', 'error');
            };
            // 开始加载图片
            img.src = selectedWallpaper.url;
            
        } catch (error) {
            console.error('应用壁纸失败:', error);
            showToast('壁纸应用失败', 'error');
        }
    };
    
    /**
     * 显示提示信息
     * @param {string} message - 消息内容
     * @param {string} type - 消息类型 (success, warning, error)
     */
    const showToast = (message, type = 'info') => {
        try {
            // 方法1: 使用偏好设置工具模块的toast函数
            if (typeof PreferencesUtils !== 'undefined' && PreferencesUtils.createToast) {
                PreferencesUtils.createToast(message, type);
                return;
            }
            
            // 方法2: 自创建toast元素
            const toast = document.createElement('div');
            toast.className = `toast toast-${type}`;
            toast.textContent = message;
            document.body.appendChild(toast);
            
            // 自动移除toast
            setTimeout(() => {
                toast.classList.add('toast-hide');
                setTimeout(() => {
                    document.body.removeChild(toast);
                }, 300);
            }, 3000);
        } catch (error) {
            console.error('创建提示消息失败:', error);
            // 回退到最基础的提示方式
            alert(message);
        }
    };
    
    /**
     * 初始化必应壁纸功能
     */
    const initialize = () => {
        try {
            if (isInitialized) {
                console.log('必应壁纸功能已初始化，跳过');
                return;
            }
            
            console.log('正在初始化必应壁纸功能...');
            
            // 检查依赖模块
            if (typeof Storage === 'undefined') {
                console.warn('警告: Storage模块不可用，某些功能可能无法正常工作');
            }
            
            if (typeof Preferences === 'undefined') {
                console.warn('警告: Preferences模块不可用，某些功能可能无法正常工作');
            }
            
            // 检查图片背景设置区域是否存在
            const imageBgSettings = document.getElementById('image-bg-settings');
            if (!imageBgSettings) {
                console.error('初始化失败: 未找到图片背景设置区域');
                return;
            }
            
            // 创建必应壁纸容器
            const bingContainer = document.createElement('div');
            bingContainer.className = 'form-group';
            bingContainer.innerHTML = `
                <label><i class="bi bi-cloud-download"></i> 必应壁纸</label>
                <div class="bing-wallpapers-container">
                    <div class="bing-wallpaper-nav">
                        <span class="bing-wallpaper-title">每日精选壁纸</span>
                        <div class="bing-wallpaper-actions">
                            <button class="bing-wallpaper-btn" id="refresh-wallpapers">
                                <i class="bi bi-arrow-repeat"></i> 刷新
                            </button>
                            <button class="bing-wallpaper-btn primary" id="apply-wallpaper" disabled>
                                <i class="bi bi-check2"></i> 应用
                            </button>
                        </div>
                    </div>
                    <div class="bing-wallpapers-grid"></div>
                    <div class="bing-wallpaper-preview"></div>
                </div>
            `;
            
            // 直接添加到图片背景设置区域中
            imageBgSettings.appendChild(bingContainer);
            
            // 获取DOM元素引用
            container = document.querySelector('.bing-wallpapers-grid');
            previewElement = document.querySelector('.bing-wallpaper-preview');
            refreshBtn = document.getElementById('refresh-wallpapers');
            applyBtn = document.getElementById('apply-wallpaper');
            
            // 初始加载壁纸
            fetchBingWallpapers().then(() => {
                // 壁纸加载完成后再绑定按钮事件
                setupEventListeners();
                isInitialized = true;
                console.log('必应壁纸功能初始化成功');
            }).catch(error => {
                console.error('初始加载壁纸失败:', error);
                setupEventListeners(); // 即使失败也绑定事件，以便用户可以点击刷新
            });
        } catch (error) {
            console.error('必应壁纸功能初始化失败:', error);
        }
    };
    
    /**
     * 设置事件监听器
     */
    const setupEventListeners = () => {
        // 刷新按钮事件
        refreshBtn = document.getElementById('refresh-wallpapers');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                fetchBingWallpapers().catch(() => {});
            });
        }
        
        // 应用按钮事件
        applyBtn = document.getElementById('apply-wallpaper');
        if (applyBtn) {
            applyBtn.addEventListener('click', applySelectedWallpaper);
        }
        
        // 更新按钮状态
        updateButtonsState();
    };
    
    /**
     * 重新加载壁纸
     */
    const reload = () => {
        return fetchBingWallpapers();
    };
    
    // 自动初始化代码
    document.addEventListener('DOMContentLoaded', () => {
        console.log('注册必应壁纸自动初始化');
        // 使用延迟初始化确保其他模块已加载完成
        setTimeout(() => {
            if (document.getElementById('image-bg-settings') && !isInitialized) {
                console.log('执行必应壁纸自动初始化');
                initialize();
            }
        }, 1000);
    });
    
    // 导出公共API
    return {
        initialize,
        reload,
        fetchBingWallpapers,
        selectWallpaper,
        applySelectedWallpaper
    };
})(); 