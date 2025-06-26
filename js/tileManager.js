/**
 * 磁贴管理模块
 * 根据设备类型自动设置每行磁贴数量
 */
const TileManager = (function() {
    // 设备类型常量
    const DEVICE_TYPE = {
        ANDROID_PHONE: 'android_phone',
        IPHONE: 'iphone',
        IPAD_PORTRAIT: 'ipad_portrait',
        IPAD_LANDSCAPE: 'ipad_landscape',
        DESKTOP: 'desktop',
        WINDOWS_EDGE: 'windows_edge'  // 添加Windows Edge类型
    };
    
    // 每种设备类型对应的每行磁贴数量
    const TILES_PER_ROW = {
        [DEVICE_TYPE.ANDROID_PHONE]: 1,  // Android phone 一行一个磁贴
        [DEVICE_TYPE.IPHONE]: 1,         // iPhone 一行一个磁贴
        [DEVICE_TYPE.IPAD_PORTRAIT]: 2,  // iPad 竖屏 一行两个磁贴
        [DEVICE_TYPE.IPAD_LANDSCAPE]: 4, // iPad 横屏 一行四个磁贴
        [DEVICE_TYPE.DESKTOP]: 4,        // Desktop 一行四个磁贴
        [DEVICE_TYPE.WINDOWS_EDGE]: 4    // Windows Edge 一行四个磁贴(修正为4个)
    };
    
    // 有效的磁贴布局选项
    const VALID_TILE_LAYOUTS = ['1', '2', '4'];
    
    // 检测当前设备类型
    const detectDeviceType = function() {
        const userAgent = navigator.userAgent.toLowerCase();
        const isIpad = /ipad/.test(userAgent) || 
                      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
        const isIphone = /iphone/.test(userAgent);
        const isAndroid = /android/.test(userAgent);
        const isPhone = /mobile/.test(userAgent);
        const isEdge = /edg/.test(userAgent) || /edge/.test(userAgent);
        const isWindows = /windows/.test(userAgent) || /win32/.test(navigator.platform.toLowerCase());
        
        // 检测是否为Windows上的Edge浏览器
        if (isWindows && isEdge) {
            console.log('检测到Windows Edge浏览器');
            return DEVICE_TYPE.WINDOWS_EDGE;
        } else if (isIpad) {
            // 检测iPad是否处于横屏模式
            return window.innerWidth > window.innerHeight ? 
                DEVICE_TYPE.IPAD_LANDSCAPE : DEVICE_TYPE.IPAD_PORTRAIT;
        } else if (isIphone) {
            return DEVICE_TYPE.IPHONE;
        } else if (isAndroid && isPhone) {
            return DEVICE_TYPE.ANDROID_PHONE;
        } else {
            return DEVICE_TYPE.DESKTOP;
        }
    };
    
    // 获取当前设备的每行磁贴数量
    const getTilesPerRow = function() {
        const deviceType = detectDeviceType();
        console.log('当前设备类型:', deviceType);
        // 确保Windows Edge始终返回4个磁贴
        if (deviceType === DEVICE_TYPE.WINDOWS_EDGE) {
            return 4;
        }
        return TILES_PER_ROW[deviceType] || 4; // 默认为4个
    };
    
    // 验证磁贴布局是否有效
    const isValidTileLayout = function(layout) {
        return VALID_TILE_LAYOUTS.includes(layout);
    };
    
    // 应用磁贴布局
    const applyTileLayout = function(customLayout) {
        // 如果提供了自定义布局并且有效，则使用自定义布局
        let tilesPerRow;
        if (customLayout && isValidTileLayout(customLayout)) {
            tilesPerRow = customLayout;
        } else {
            // 否则使用设备默认布局
            tilesPerRow = getTilesPerRow();
            // 如果默认布局不在有效布局中，则使用最接近的有效布局
            if (!isValidTileLayout(String(tilesPerRow))) {
                // 找到最接近的有效布局
                const numericLayout = Number(tilesPerRow);
                if (numericLayout <= 1) {
                    tilesPerRow = '1';
                } else if (numericLayout <= 2) {
                    tilesPerRow = '2';
                } else {
                    tilesPerRow = '4';
                }
            }
        }
        
        console.log('应用每行磁贴数量:', tilesPerRow);
        document.documentElement.style.setProperty('--tiles-per-row', tilesPerRow);
        
        // 更新书签容器的网格布局
        const bookmarksContainer = document.getElementById('bookmarks-container');
        if (bookmarksContainer && document.body.classList.contains('layout-grid')) {
            bookmarksContainer.style.gridTemplateColumns = `repeat(${tilesPerRow}, 1fr)`;
        }
        
        // 如果存在偏好设置，更新当前偏好设置
        if (window.Preferences && window.Preferences.getCurrentPreferences) {
            const currentPreferences = window.Preferences.getCurrentPreferences();
            if (currentPreferences) {
                currentPreferences.tileLayout = String(tilesPerRow);
                window.Preferences.savePreferences(currentPreferences);
            }
        }
    };
    
    // 监听屏幕方向变化（主要针对iPad）
    const setupOrientationListener = function() {
        window.addEventListener('resize', function() {
            // 检测是否为iPad并且方向发生了变化
            const deviceType = detectDeviceType();
            if (deviceType === DEVICE_TYPE.IPAD_LANDSCAPE || 
                deviceType === DEVICE_TYPE.IPAD_PORTRAIT) {
                applyTileLayout();
            }
        });
    };
    
    // 初始化
    const initialize = function() {
        console.log('TileManager初始化...');
        applyTileLayout();
        setupOrientationListener();
    };
    
    // 公开接口
    return {
        initialize: initialize,
        getTilesPerRow: getTilesPerRow,
        applyTileLayout: applyTileLayout,
        detectDeviceType: detectDeviceType,  // 导出设备检测函数，便于调试
        isValidTileLayout: isValidTileLayout // 导出布局验证函数
    };
})();

// 当DOM加载完成后初始化磁贴管理器
document.addEventListener('DOMContentLoaded', function() {
    TileManager.initialize();
}); 