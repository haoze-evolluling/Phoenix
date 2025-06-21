/**
 * 模式切换器 - 在简约模式和普通模式之间切换
 */
const ModeSwitcher = (function() {
    // 模式常量
    const SIMPLE_MODE = 'simple';
    const NORMAL_MODE = 'normal';
    
    // 当前模式
    let currentMode = window.location.pathname.includes('normal.html') ? NORMAL_MODE : SIMPLE_MODE;
    
    // 初始化函数
    const initialize = function() {
        // 获取模式切换按钮
        const modeButton = document.querySelector('#normal-mode-btn, #simple-mode-btn');
        
        if (modeButton) {
            modeButton.addEventListener('click', switchMode);
        }
        
        // 检查URL参数中是否有保留的状态
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('preserve_state') && urlParams.get('preserve_state') === 'true') {
            console.log('保留状态参数已检测到，将保留当前状态');
        }
        
        // 更新当前页面的模式状态
        updateModeState();
    };
    
    // 更新模式状态
    const updateModeState = function() {
        // 保存当前模式到本地存储
        localStorage.setItem('current_mode', currentMode);
        
        // 根据当前页面更新UI
        if (window.location.pathname.includes('normal.html')) {
            document.body.classList.remove('simple-mode');
            const modeButton = document.getElementById('simple-mode-btn');
            if (modeButton) {
                modeButton.setAttribute('title', '切换到简约模式');
                modeButton.querySelector('i').className = 'bi bi-grid';
            }
        } else {
            document.body.classList.add('simple-mode');
            const modeButton = document.getElementById('normal-mode-btn');
            if (modeButton) {
                modeButton.setAttribute('title', '切换到普通模式');
                modeButton.querySelector('i').className = 'bi bi-app';
            }
            
            // 创建时钟元素（如果不存在）
            createClockElements();
            
            // 开始时钟更新
            startClock();
        }
    };
    
    // 切换模式
    const switchMode = function() {
        // 保存当前的用户状态（如搜索引擎选择、主题等）
        saveCurrentState();
        
        // 根据当前模式决定跳转目标
        const targetPage = currentMode === SIMPLE_MODE ? 'normal.html' : 'index.html';
        
        // 添加保留状态的参数
        window.location.href = targetPage + '?preserve_state=true';
    };
    
    // 保存当前状态
    const saveCurrentState = function() {
        // 保存搜索引擎选择
        const activeEngine = document.querySelector('.search-engine-btn.active');
        if (activeEngine) {
            localStorage.setItem('selected_search_engine', activeEngine.dataset.engine);
        }
        
        // 保存搜索框内容
        const searchInput = document.getElementById('search-input');
        if (searchInput && searchInput.value) {
            localStorage.setItem('search_input_value', searchInput.value);
        }
        
        // 其他可能需要保存的状态...
    };
    
    // 创建时钟元素（简约模式专用）
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
    
    // 开始时钟更新（简约模式专用）
    const startClock = function() {
        updateClock(); // 立即更新一次
        setInterval(updateClock, 1000); // 每秒更新
    };
    
    // 更新时钟（简约模式专用）
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
        switchMode: switchMode
    };
})();

// 当DOM加载完成后初始化模式切换器
document.addEventListener('DOMContentLoaded', function() {
    ModeSwitcher.initialize();
}); 