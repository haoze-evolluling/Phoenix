// 点击反馈效果处理模块

// 点击反馈效果配置
const clickFeedbackConfig = {
    // 动画持续时间
    animationDuration: 300,
    // 是否启用触觉反馈（移动设备）
    enableHapticFeedback: true,
    // 是否启用声音反馈
    enableSoundFeedback: false,
    // 点击反馈类型
    feedbackTypes: {
        'nav-btn': 'scale',
        'engine-btn': 'scale',
        'link-card': 'card',
        'tool-card': 'card',
        'bookmark-item': 'item',
        'setting-control': 'control'
    }
};

// 初始化点击反馈系统
function initializeClickFeedback() {
    console.log('初始化点击反馈系统...');
    
    // 为所有可点击元素添加点击反馈
    addClickFeedbackToElements();
    
    // 添加触摸支持
    addTouchFeedbackSupport();
    
    console.log('点击反馈系统初始化完成');
}

// 为元素添加点击反馈
function addClickFeedbackToElements() {
    // 导航按钮
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(button => {
        addClickFeedback(button, 'nav-btn');
    });
    
    // 搜索引擎按钮
    const engineButtons = document.querySelectorAll('.engine-btn');
    engineButtons.forEach(button => {
        addClickFeedback(button, 'engine-btn');
    });
    
    // 快捷链接卡片
    const linkCards = document.querySelectorAll('.link-card');
    linkCards.forEach(card => {
        addClickFeedback(card, 'link-card');
    });
    
    // 工具卡片
    const toolCards = document.querySelectorAll('.tool-card');
    toolCards.forEach(card => {
        addClickFeedback(card, 'tool-card');
    });
    
    // 书签项目
    const bookmarkItems = document.querySelectorAll('.bookmark-item');
    bookmarkItems.forEach(item => {
        addClickFeedback(item, 'bookmark-item');
    });
    
    // 设置控件
    const settingControls = document.querySelectorAll('.bg-selector, .search-engine-selector, .time-format-selector');
    settingControls.forEach(control => {
        addClickFeedback(control, 'setting-control');
    });
    
    // 复选框
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        addClickFeedback(checkbox, 'control');
    });
}

// 为单个元素添加点击反馈
function addClickFeedback(element, feedbackType) {
    if (!element) return;
    
    // 添加基础样式类
    element.classList.add('click-feedback');
    
    // 添加点击事件监听器
    element.addEventListener('click', (e) => {
        handleClickFeedback(e, element, feedbackType);
    });
    
    // 添加鼠标按下事件（用于即时反馈）
    element.addEventListener('mousedown', (e) => {
        handleMouseDownFeedback(e, element, feedbackType);
    });
    
    // 添加鼠标释放事件
    element.addEventListener('mouseup', (e) => {
        handleMouseUpFeedback(e, element, feedbackType);
    });
    
    // 添加鼠标离开事件（防止在元素外释放鼠标时卡住状态）
    element.addEventListener('mouseleave', (e) => {
        handleMouseLeaveFeedback(e, element, feedbackType);
    });
}

// 处理点击反馈
function handleClickFeedback(event, element, feedbackType) {
    // 防止重复触发
    if (element.classList.contains('clicked')) return;
    
    // 添加点击动画类
    element.classList.add('clicked');
    
    // 触觉反馈
    if (clickFeedbackConfig.enableHapticFeedback && 'vibrate' in navigator) {
        navigator.vibrate(10); // 轻微震动
    }
    
    // 声音反馈
    if (clickFeedbackConfig.enableSoundFeedback) {
        playClickSound();
    }
    
    // 根据反馈类型执行特定效果
    switch (feedbackType) {
        case 'nav-btn':
            addRippleEffect(element, event);
            break;
        case 'engine-btn':
            addPulseEffect(element);
            break;
        case 'link-card':
        case 'tool-card':
            addCardClickEffect(element);
            break;
        case 'bookmark-item':
            addItemClickEffect(element);
            break;
        case 'setting-control':
        case 'control':
            addControlClickEffect(element);
            break;
    }
    
    // 移除点击动画类
    setTimeout(() => {
        element.classList.remove('clicked');
    }, clickFeedbackConfig.animationDuration);
    
    // 记录点击事件
    logClickEvent(element, feedbackType);
}

// 处理鼠标按下反馈
function handleMouseDownFeedback(event, element, feedbackType) {
    element.classList.add('pressed');
}

// 处理鼠标释放反馈
function handleMouseUpFeedback(event, element, feedbackType) {
    element.classList.remove('pressed');
}

// 处理鼠标离开反馈
function handleMouseLeaveFeedback(event, element, feedbackType) {
    element.classList.remove('pressed');
}

// 添加波纹效果
function addRippleEffect(element, event) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
        z-index: 10;
    `;
    
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// 添加脉冲效果
function addPulseEffect(element) {
    element.classList.add('pulse-feedback');
    setTimeout(() => {
        element.classList.remove('pulse-feedback');
    }, 300);
}

// 添加卡片点击效果
function addCardClickEffect(element) {
    // 创建点击波纹
    const ripple = document.createElement('div');
    ripple.className = 'card-ripple';
    ripple.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        background: radial-gradient(circle, rgba(30, 64, 175, 0.2) 0%, transparent 70%);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        animation: card-ripple 0.4s ease-out;
        pointer-events: none;
        z-index: 5;
    `;
    
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 400);
}

// 添加项目点击效果
function addItemClickEffect(element) {
    element.style.transform = 'translateY(-1px) scale(0.98)';
    setTimeout(() => {
        element.style.transform = '';
    }, 150);
}

// 添加控件点击效果
function addControlClickEffect(element) {
    element.style.transform = 'scale(0.95)';
    setTimeout(() => {
        element.style.transform = '';
    }, 100);
}

// 播放点击声音
function playClickSound() {
    // 创建音频上下文（如果需要声音反馈）
    if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
        const audioContext = new (AudioContext || webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    }
}

// 记录点击事件
function logClickEvent(element, feedbackType) {
    const elementInfo = {
        tagName: element.tagName,
        className: element.className,
        id: element.id,
        feedbackType: feedbackType,
        timestamp: Date.now()
    };
    
    console.log('点击反馈事件:', elementInfo);
}

// 添加触摸反馈支持
function addTouchFeedbackSupport() {
    // 为触摸设备添加特殊处理
    if ('ontouchstart' in window) {
        document.addEventListener('touchstart', (e) => {
            const target = e.target.closest('.click-feedback');
            if (target) {
                target.classList.add('touch-active');
            }
        }, { passive: true });
        
        document.addEventListener('touchend', (e) => {
            const target = e.target.closest('.click-feedback');
            if (target) {
                setTimeout(() => {
                    target.classList.remove('touch-active');
                }, 150);
            }
        }, { passive: true });
        
        document.addEventListener('touchcancel', (e) => {
            const target = e.target.closest('.click-feedback');
            if (target) {
                target.classList.remove('touch-active');
            }
        }, { passive: true });
    }
}

// 动态添加点击反馈到新元素
function addClickFeedbackToNewElement(element, feedbackType = 'default') {
    if (element && !element.classList.contains('click-feedback')) {
        addClickFeedback(element, feedbackType);
    }
}

// 移除元素的点击反馈
function removeClickFeedback(element) {
    if (element) {
        element.classList.remove('click-feedback', 'clicked', 'pressed', 'touch-active');
        element.removeEventListener('click', handleClickFeedback);
        element.removeEventListener('mousedown', handleMouseDownFeedback);
        element.removeEventListener('mouseup', handleMouseUpFeedback);
        element.removeEventListener('mouseleave', handleMouseLeaveFeedback);
    }
}

// 更新点击反馈配置
function updateClickFeedbackConfig(newConfig) {
    Object.assign(clickFeedbackConfig, newConfig);
    console.log('点击反馈配置已更新:', clickFeedbackConfig);
}

// 导出功能到全局作用域
if (typeof window !== 'undefined') {
    window.clickFeedback = {
        initializeClickFeedback,
        addClickFeedbackToElements,
        addClickFeedbackToNewElement,
        removeClickFeedback,
        updateClickFeedbackConfig,
        config: clickFeedbackConfig
    };
}

// 添加CSS动画关键帧（如果不存在）
function addClickFeedbackStyles() {
    if (!document.getElementById('click-feedback-styles')) {
        const style = document.createElement('style');
        style.id = 'click-feedback-styles';
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(2);
                    opacity: 0;
                }
            }
            
            @keyframes card-ripple {
                to {
                    width: 200px;
                    height: 200px;
                    opacity: 0;
                }
            }
            
            .touch-active {
                opacity: 0.8;
                transform: scale(0.98);
            }
            
            .pressed {
                transform: scale(0.95);
            }
        `;
        document.head.appendChild(style);
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    addClickFeedbackStyles();
    initializeClickFeedback();
});

// 页面完全加载后重新初始化（确保动态内容也被处理）
window.addEventListener('load', () => {
    setTimeout(() => {
        initializeClickFeedback();
    }, 100);
});
