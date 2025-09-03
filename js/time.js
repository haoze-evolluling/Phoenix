// 时间显示功能模块

// 初始化时间显示
function initializeTime() {
    updateTime();
    updateShowSecondsCheckbox();
    updateTimeFormatSelector();
    
    // 添加时间点击交互
    addTimeInteraction();
}

// 更新时间显示
function updateTime() {
    const now = new Date();
    const timeElement = document.getElementById('current-time');
    const dateElement = document.getElementById('current-date');
    
    // 格式化时间
    const timeOptions = {
        hour: '2-digit',
        minute: '2-digit',
        ...(showSeconds && { second: '2-digit' }),
        hour12: use12HourFormat
    };
    
    const timeString = now.toLocaleTimeString('zh-CN', timeOptions);
    
    // 格式化日期
    const dateOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
    };
    
    const dateString = now.toLocaleDateString('zh-CN', dateOptions);
    
    if (timeElement) {
        timeElement.textContent = timeString;
    }
    
    if (dateElement) {
        dateElement.textContent = dateString;
    }
    
    // 更新页面标题显示时间
    updatePageTitle(timeString);
}

// 开始时间更新循环
let timeUpdateInterval = null;

function startTimeUpdate() {
    // 清除现有的定时器
    if (timeUpdateInterval) {
        clearInterval(timeUpdateInterval);
    }
    
    updateTime();
    
    // 使用更精确的定时器
    timeUpdateInterval = setInterval(() => {
        updateTime();
    }, 1000);
    
    // 页面不可见时暂停更新以节省资源
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
            if (timeUpdateInterval) {
                clearInterval(timeUpdateInterval);
                timeUpdateInterval = null;
            }
        } else {
            updateTime();
            if (!timeUpdateInterval) {
                startTimeUpdate();
            }
        }
    });
}

// 更新显示秒数复选框状态
function updateShowSecondsCheckbox() {
    const showSecondsCheckbox = document.querySelector('.show-seconds');
    if (showSecondsCheckbox) {
        showSecondsCheckbox.checked = showSeconds;
    }
}

// 添加时间交互效果
function addTimeInteraction() {
    const timeDisplay = document.querySelector('.time-display');
    const timeElement = document.getElementById('current-time');
    const dateElement = document.getElementById('current-date');
    
    if (timeDisplay) {
        // 点击切换时间格式
        timeDisplay.addEventListener('click', () => {
            toggleTimeFormat();
        });
        
        // 悬停显示详细信息
        timeDisplay.addEventListener('mouseenter', () => {
            showDetailedTimeInfo();
        });
        
        timeDisplay.addEventListener('mouseleave', () => {
            hideDetailedTimeInfo();
        });
    }
    
    if (timeElement) {
        // 双击复制时间
        timeElement.addEventListener('dblclick', () => {
            copyTimeToClipboard(timeElement.textContent);
        });
    }
    
    if (dateElement) {
        // 双击复制日期
        dateElement.addEventListener('dblclick', () => {
            copyTimeToClipboard(dateElement.textContent);
        });
    }
}

// 切换时间格式
function toggleTimeFormat() {
    use12HourFormat = !use12HourFormat;
    localStorage.setItem('use12HourFormat', use12HourFormat);
    updateTime();
    updateTimeFormatSelector();
    
    showMessage(`已切换到${use12HourFormat ? '12' : '24'}小时制`, 'info');
}

// 更新时间格式选择器状态
function updateTimeFormatSelector() {
    const timeFormatSelector = document.querySelector('.time-format-selector');
    if (timeFormatSelector) {
        timeFormatSelector.value = use12HourFormat ? '12' : '24';
    }
}

// 显示详细时间信息
function showDetailedTimeInfo() {
    // 移除现有的详细信息
    hideDetailedTimeInfo();
    
    const now = new Date();
    const detailInfo = document.createElement('div');
    detailInfo.className = 'time-detail-info';
    detailInfo.style.cssText = `
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        background: var(--bg-card);
        backdrop-filter: var(--glass-backdrop);
        border-radius: 12px;
        padding: 15px;
        margin-top: 10px;
        box-shadow: var(--shadow-glass);
        border: var(--glass-border);
        font-size: 14px;
        color: var(--text-secondary);
        z-index: 1000;

        min-width: 200px;
        text-align: center;
    `;
    
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const weekOfYear = getWeekOfYear(now);
    const dayOfYear = getDayOfYear(now);
    
    detailInfo.innerHTML = `
        <div>时区: ${timeZone}</div>
        <div>第${weekOfYear}周 / 第${dayOfYear}天</div>
        <div>Unix时间戳: ${Math.floor(now.getTime() / 1000)}</div>
        <div style="margin-top: 8px; font-size: 12px; color: var(--text-secondary);">
            双击复制时间
        </div>
    `;
    
    const timeDisplay = document.querySelector('.time-display');
    timeDisplay.style.position = 'relative';
    timeDisplay.appendChild(detailInfo);
}

// 隐藏详细时间信息
function hideDetailedTimeInfo() {
    const detailInfo = document.querySelector('.time-detail-info');
    if (detailInfo) {
        detailInfo.remove();
    }
}

// 复制时间到剪贴板
function copyTimeToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showMessage(`已复制: ${text}`, 'success');
    }).catch(() => {
        showMessage('复制失败', 'error');
    });
}

// 获取年内第几周
function getWeekOfYear(date) {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

// 获取年内第几天
function getDayOfYear(date) {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    return Math.ceil((date - firstDayOfYear) / 86400000) + 1;
}

// 更新页面标题
function updatePageTitle(timeString) {
    if (document.visibilityState === 'hidden') {
        document.title = `${timeString} - 新标签页`;
    } else {
        document.title = '新标签页';
    }
}

// 添加时间主题功能
function addTimeTheme() {
    const now = new Date();
    const hour = now.getHours();
    const timeDisplay = document.querySelector('.time-display');
    
    if (timeDisplay) {
        // 移除之前的时间主题类
        timeDisplay.classList.remove('morning', 'afternoon', 'evening', 'night');
        
        // 根据时间添加主题
        if (hour >= 6 && hour < 12) {
            timeDisplay.classList.add('morning');
        } else if (hour >= 12 && hour < 18) {
            timeDisplay.classList.add('afternoon');
        } else if (hour >= 18 && hour < 22) {
            timeDisplay.classList.add('evening');
        } else {
            timeDisplay.classList.add('night');
        }
    }
}

// 倒计时功能
function startCountdown(targetDate, message = '目标时间到达！') {
    const target = new Date(targetDate);
    
    const countdownInterval = setInterval(() => {
        const now = new Date();
        const difference = target - now;
        
        if (difference <= 0) {
            clearInterval(countdownInterval);
            showMessage(message, 'success');
            return;
        }
        
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        console.log(`倒计时: ${days}天 ${hours}小时 ${minutes}分钟 ${seconds}秒`);
    }, 1000);
    
    return countdownInterval;
}

// 导出时间相关功能
if (typeof window !== 'undefined') {
    window.newTabTime = {
        initializeTime,
        updateTime,
        startTimeUpdate,
        updateShowSecondsCheckbox,
        updateTimeFormatSelector,
        toggleTimeFormat,
        addTimeInteraction,
        copyTimeToClipboard,
        addTimeTheme,
        startCountdown
    };
}
