// 简约模式功能实现
const SimpleMode = (function() {
    // 状态变量
    let isSimpleMode = true;
    localStorage.setItem('simple_mode', 'true');
    
    // 检测设备类型
    const isDesktopDevice = function() {
        // 获取用户代理字符串
        const userAgent = navigator.userAgent.toLowerCase();
        
        // 明确检测移动设备和平板设备
        const isIPhone = /iphone/i.test(userAgent);
        const isIPad = /ipad/i.test(userAgent) || 
                      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1); // 支持iPad OS 13+检测
        const isAndroidPhone = /android.*mobile/i.test(userAgent);
        const isAndroidTablet = /android/i.test(userAgent) && !/mobile/i.test(userAgent);
        const isWindowsTablet = /windows/i.test(userAgent) && /touch/i.test(userAgent);
        
        // 如果是上述任何移动设备，返回false表示不是桌面设备
        if (isIPhone || isIPad || isAndroidPhone || isAndroidTablet || isWindowsTablet) {
            return false;
        }
        
        // 其他常见移动设备检测
        if (/webos|ipod|blackberry|iemobile|opera mini|mobi/i.test(userAgent)) {
            return false;
        }
        
        // 如果通过了上述所有检测，认为是桌面设备
        return true;
    };
    
    // 初始化函数
    const initialize = function() {
        // 获取简约模式按钮元素
        const simpleModeBtn = document.getElementById('simple-mode-toggle');
        
        // 如果存在按钮，则添加点击事件监听器
        if (simpleModeBtn) {
            simpleModeBtn.addEventListener('click', toggleSimpleMode);
            // 更新按钮图标和提示
            updateButtonState(simpleModeBtn);
            
            // 非桌面端设备隐藏退出简约模式按钮
            if (!isDesktopDevice()) {
                simpleModeBtn.style.display = 'none';
            }
        }
        
        // 检查是否应该默认启用简约模式
        if (isSimpleMode) {
            enableSimpleMode();
        }
    };
    
    // 更新按钮状态
    const updateButtonState = function(button) {
        if (isSimpleMode) {
            button.querySelector('i').className = 'bi bi-grid';
            button.setAttribute('title', '退出简约模式');
        } else {
            button.querySelector('i').className = 'bi bi-app';
            button.setAttribute('title', '切换到简约模式');
        }
    };
    
    // 切换简约模式
    const toggleSimpleMode = function() {
        // 如果是简约模式并且不是桌面设备，则不允许退出
        if (isSimpleMode && !isDesktopDevice()) {
            console.log('非桌面端不允许退出简约模式');
            return;
        }
        
        if (isSimpleMode) {
            disableSimpleMode();
        } else {
            enableSimpleMode();
        }
    };
    
    // 启用简约模式
    const enableSimpleMode = function() {
        // 添加简约模式类
        document.body.classList.add('simple-mode');
        
        // 创建时钟元素（如果不存在）
        createClockElements();
        
        // 开始时钟更新
        startClock();
        
        // 添加退出按钮（仅桌面端显示）
        if (isDesktopDevice()) {
            createExitButton();
        }
        
        // 更新状态
        isSimpleMode = true;
        localStorage.setItem('simple_mode', 'true');
        
        // 更新按钮状态
        const simpleModeBtn = document.getElementById('simple-mode-toggle');
        if (simpleModeBtn) {
            updateButtonState(simpleModeBtn);
        }
    };
    
    // 禁用简约模式
    const disableSimpleMode = function() {
        // 非桌面端不允许退出简约模式
        if (!isDesktopDevice()) {
            console.log('非桌面端不允许退出简约模式');
            return;
        }
        
        // 移除简约模式类
        document.body.classList.remove('simple-mode');
        
        // 移除时钟元素
        removeClockElements();
        
        // 移除退出按钮
        removeExitButton();
        
        // 更新状态
        isSimpleMode = false;
        localStorage.setItem('simple_mode', 'false');
        
        // 更新按钮状态
        const simpleModeBtn = document.getElementById('simple-mode-toggle');
        if (simpleModeBtn) {
            updateButtonState(simpleModeBtn);
        }
    };
    
    // 创建时钟元素
    const createClockElements = function() {
        // 如果已存在，则不重复创建
        if (document.querySelector('.simple-mode-clock')) {
            return;
        }
        
        const header = document.querySelector('.modern-header');
        if (!header) return;
        
        // 创建日期元素
        const dateElement = document.createElement('div');
        dateElement.className = 'simple-mode-date';
        
        // 创建时钟元素
        const clockElement = document.createElement('div');
        clockElement.className = 'simple-mode-clock';
        
        // 插入到header前面
        header.parentNode.insertBefore(dateElement, header);
        header.parentNode.insertBefore(clockElement, header);
    };
    
    // 移除时钟元素
    const removeClockElements = function() {
        const clockElement = document.querySelector('.simple-mode-clock');
        const dateElement = document.querySelector('.simple-mode-date');
        
        if (clockElement) clockElement.remove();
        if (dateElement) dateElement.remove();
    };
    
    // 创建退出按钮
    const createExitButton = function() {
        // 如果已存在，则不重复创建
        if (document.querySelector('.simple-mode-exit')) {
            return;
        }
        
        const exitButton = document.createElement('button');
        exitButton.className = 'simple-mode-exit';
        exitButton.innerHTML = '<i class="bi bi-x-lg"></i>';
        exitButton.setAttribute('title', '退出简约模式');
        exitButton.addEventListener('click', toggleSimpleMode);
        
        document.body.appendChild(exitButton);
    };
    
    // 移除退出按钮
    const removeExitButton = function() {
        const exitButton = document.querySelector('.simple-mode-exit');
        if (exitButton) exitButton.remove();
    };
    
    // 开始时钟更新
    const startClock = function() {
        updateClock(); // 立即更新一次
        setInterval(updateClock, 1000); // 每秒更新
    };
    
    // 更新时钟
    const updateClock = function() {
        const now = new Date();
        const clockElement = document.querySelector('.simple-mode-clock');
        const dateElement = document.querySelector('.simple-mode-date');
        
        if (clockElement && dateElement) {
            // 格式化时间
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            
            // 格式化日期
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
            const weekday = weekdays[now.getDay()];
            
            // 更新显示
            clockElement.textContent = `${hours}:${minutes}:${seconds}`;
            dateElement.textContent = `${year}年${month}月${day}日 ${weekday}`;
        }
    };
    
    // 公开接口
    return {
        initialize: initialize,
        toggleSimpleMode: toggleSimpleMode,
        isSimpleMode: function() { return isSimpleMode; }
    };
})();

// 当DOM加载完成后初始化简约模式
document.addEventListener('DOMContentLoaded', function() {
    SimpleMode.initialize();
});