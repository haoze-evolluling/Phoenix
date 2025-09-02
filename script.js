// 全局变量
let currentTheme = localStorage.getItem('theme') || 'light';
let currentSearchEngine = localStorage.getItem('searchEngine') || 'google';
let showSeconds = localStorage.getItem('showSeconds') !== 'false';

// 搜索引擎配置
const searchEngines = {
    google: 'https://www.google.com/search?q=',
    baidu: 'https://www.baidu.com/s?wd=',
    bing: 'https://www.bing.com/search?q='
};

// DOM 加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// 初始化应用
function initializeApp() {
    initializeTheme();
    initializeTime();
    initializeNavigation();
    initializeSearch();
    initializeSettings();
    startTimeUpdate();
    
    // 添加键盘快捷键支持
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    console.log('新标签页已加载完成！');
}

// 初始化主题
function initializeTheme() {
    // 检查系统主题偏好
    if (currentTheme === 'auto') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    } else {
        document.documentElement.setAttribute('data-theme', currentTheme);
    }
    
    // 更新主题按钮状态
    updateThemeButtons();
    
    // 监听系统主题变化
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (currentTheme === 'auto') {
            document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
        }
    });
}

// 更新主题按钮状态
function updateThemeButtons() {
    const themeButtons = document.querySelectorAll('.theme-btn');
    themeButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.theme === currentTheme);
    });
}

// 初始化时间显示
function initializeTime() {
    updateTime();
    updateShowSecondsCheckbox();
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
        hour12: false
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
    
    if (timeElement) timeElement.textContent = timeString;
    if (dateElement) dateElement.textContent = dateString;
}

// 开始时间更新循环
function startTimeUpdate() {
    updateTime();
    setInterval(updateTime, 1000);
}

// 初始化导航功能
function initializeNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.section');
    
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetSection = button.dataset.section;
            
            // 更新按钮状态
            navButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // 切换页面内容
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetSection) {
                    section.classList.add('active');
                }
            });
            
            // 添加页面切换动画
            animatePageTransition();
        });
    });
}

// 页面切换动画
function animatePageTransition() {
    const activeSection = document.querySelector('.section.active');
    if (activeSection) {
        activeSection.style.opacity = '0';
        activeSection.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            activeSection.style.opacity = '1';
            activeSection.style.transform = 'translateY(0)';
        }, 100);
    }
}

// 初始化搜索功能
function initializeSearch() {
    const searchInput = document.getElementById('search-input');
    const engineButtons = document.querySelectorAll('.engine-btn');
    
    // 设置默认搜索引擎
    updateSearchEngineButtons();
    
    // 搜索引擎切换
    engineButtons.forEach(button => {
        button.addEventListener('click', () => {
            currentSearchEngine = button.dataset.engine;
            localStorage.setItem('searchEngine', currentSearchEngine);
            updateSearchEngineButtons();
        });
    });
    
    // 搜索功能
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch(searchInput.value.trim());
        }
    });
    
    // 搜索建议（简单实现）
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        if (query.length > 2) {
            // 这里可以添加搜索建议功能
            // showSearchSuggestions(query);
        }
    });
    
    // 自动聚焦搜索框
    searchInput.focus();
}

// 更新搜索引擎按钮状态
function updateSearchEngineButtons() {
    const engineButtons = document.querySelectorAll('.engine-btn');
    engineButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.engine === currentSearchEngine);
    });
}

// 执行搜索
function performSearch(query) {
    if (!query) return;
    
    // 检查是否是URL
    if (isValidURL(query)) {
        window.open(query.startsWith('http') ? query : 'https://' + query, '_blank');
    } else {
        // 使用搜索引擎搜索
        const searchURL = searchEngines[currentSearchEngine] + encodeURIComponent(query);
        window.open(searchURL, '_blank');
    }
    
    // 清空搜索框
    document.getElementById('search-input').value = '';
}

// 检查是否为有效URL
function isValidURL(string) {
    try {
        new URL(string.startsWith('http') ? string : 'https://' + string);
        return true;
    } catch (_) {
        // 检查是否像域名
        const domainPattern = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
        return domainPattern.test(string) || string.includes('.');
    }
}

// 初始化设置功能
function initializeSettings() {
    // 主题切换
    const themeButtons = document.querySelectorAll('.theme-btn');
    themeButtons.forEach(button => {
        button.addEventListener('click', () => {
            currentTheme = button.dataset.theme;
            localStorage.setItem('theme', currentTheme);
            initializeTheme();
        });
    });
    
    // 搜索引擎设置
    const searchEngineSelector = document.querySelector('.search-engine-selector');
    if (searchEngineSelector) {
        searchEngineSelector.value = currentSearchEngine;
        searchEngineSelector.addEventListener('change', (e) => {
            currentSearchEngine = e.target.value;
            localStorage.setItem('searchEngine', currentSearchEngine);
            updateSearchEngineButtons();
        });
    }
    
    // 显示秒数设置
    const showSecondsCheckbox = document.querySelector('.show-seconds');
    if (showSecondsCheckbox) {
        showSecondsCheckbox.addEventListener('change', (e) => {
            showSeconds = e.target.checked;
            localStorage.setItem('showSeconds', showSeconds);
            updateTime();
        });
    }
    
    // 背景样式设置
    const bgSelector = document.querySelector('.bg-selector');
    if (bgSelector) {
        bgSelector.addEventListener('change', (e) => {
            changeBackgroundStyle(e.target.value);
        });
    }
    
    // 工具卡片点击事件
    initializeToolCards();
}

// 更新显示秒数复选框状态
function updateShowSecondsCheckbox() {
    const showSecondsCheckbox = document.querySelector('.show-seconds');
    if (showSecondsCheckbox) {
        showSecondsCheckbox.checked = showSeconds;
    }
}

// 改变背景样式
function changeBackgroundStyle(style) {
    const root = document.documentElement;
    
    switch (style) {
        case 'gradient':
            if (currentTheme === 'dark') {
                root.style.setProperty('--bg-primary', 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)');
            } else {
                root.style.setProperty('--bg-primary', 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)');
            }
            break;
        case 'solid':
            root.style.setProperty('--bg-primary', currentTheme === 'dark' ? '#1a1a2e' : '#667eea');
            break;
        case 'image':
            // 这里可以添加背景图片功能
            showMessage('背景图片功能待开发', 'info');
            break;
    }
}

// 初始化工具卡片
function initializeToolCards() {
    const toolCards = document.querySelectorAll('.tool-card');
    
    toolCards.forEach(card => {
        card.addEventListener('click', () => {
            const toolName = card.querySelector('h3').textContent;
            handleToolClick(toolName);
        });
    });
}

// 处理工具点击事件
function handleToolClick(toolName) {
    switch (toolName) {
        case '计算器':
            openCalculator();
            break;
        case '番茄钟':
            openPomodoroTimer();
            break;
        case '取色器':
            openColorPicker();
            break;
        case '二维码生成':
            openQRCodeGenerator();
            break;
        default:
            showMessage(`${toolName}功能待开发`, 'info');
    }
}

// 简单计算器
function openCalculator() {
    const result = prompt('请输入计算表达式（如：2+3*4）：');
    if (result) {
        try {
            // 安全的计算表达式求值
            const calcResult = Function('"use strict"; return (' + result + ')')();
            showMessage(`计算结果：${result} = ${calcResult}`, 'success');
        } catch (error) {
            showMessage('无效的计算表达式', 'error');
        }
    }
}

// 番茄钟
function openPomodoroTimer() {
    const minutes = prompt('请输入番茄钟时间（分钟）：', '25');
    if (minutes && !isNaN(minutes)) {
        startPomodoroTimer(parseInt(minutes));
    }
}

// 启动番茄钟
function startPomodoroTimer(minutes) {
    const totalSeconds = minutes * 60;
    let remainingSeconds = totalSeconds;
    
    const timerInterval = setInterval(() => {
        const mins = Math.floor(remainingSeconds / 60);
        const secs = remainingSeconds % 60;
        
        document.title = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')} - 番茄钟`;
        
        remainingSeconds--;
        
        if (remainingSeconds < 0) {
            clearInterval(timerInterval);
            document.title = '新标签页';
            showMessage('番茄钟时间到！', 'success');
            
            // 播放提示音（如果浏览器支持）
            try {
                const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmIcCEJ+w/LVfSsFJnjH9OGOPwcbWrLt3Z1NEAVcq+O30WCPBC9+yPCvigAlOabz5qpYFAlYvuzKhxIJJWzZ5r91jAKPVZjqqXgqYKzz4pBUEQpDnOCwb7sDEOqWU4Sn7Z5/jQKoM5rrv2wYExkOzAFRHpZqpWwwXLHvxJhNIgxEoeDUNV0/bR5WmNTYkVkT/VkzbXJzZVJtJR');
                audio.play();
            } catch (e) {
                console.log('无法播放提示音');
            }
        }
    }, 1000);
    
    showMessage(`番茄钟已启动：${minutes}分钟`, 'success');
}

// 取色器
function openColorPicker() {
    // 创建颜色选择器
    const colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.style.opacity = '0';
    colorInput.style.position = 'absolute';
    colorInput.style.top = '-9999px';
    
    document.body.appendChild(colorInput);
    
    colorInput.addEventListener('change', (e) => {
        const color = e.target.value;
        const rgb = hexToRgb(color);
        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
        
        const colorInfo = `
            颜色值：${color}
            RGB：rgb(${rgb.r}, ${rgb.g}, ${rgb.b})
            HSL：hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)
        `;
        
        navigator.clipboard.writeText(color).then(() => {
            showMessage(`颜色值已复制到剪贴板\n${colorInfo}`, 'success');
        });
        
        document.body.removeChild(colorInput);
    });
    
    colorInput.click();
}

// 二维码生成器
function openQRCodeGenerator() {
    const text = prompt('请输入要生成二维码的内容：');
    if (text) {
        // 使用免费的二维码API
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(text)}`;
        
        // 创建新窗口显示二维码
        const newWindow = window.open('', '_blank', 'width=250,height=250');
        newWindow.document.write(`
            <html>
                <head><title>二维码生成器</title></head>
                <body style="margin:0;padding:20px;text-align:center;font-family:Arial,sans-serif;">
                    <h3>二维码</h3>
                    <img src="${qrUrl}" alt="二维码" style="border:1px solid #ddd;">
                    <p style="word-break:break-all;font-size:12px;">${text}</p>
                </body>
            </html>
        `);
    }
}

// 颜色转换工具函数
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    
    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    
    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
    };
}

// 键盘快捷键处理
function handleKeyboardShortcuts(e) {
    // Ctrl/Cmd + K：聚焦搜索框
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('search-input').focus();
    }
    
    // Escape：清空搜索框
    if (e.key === 'Escape') {
        const searchInput = document.getElementById('search-input');
        if (document.activeElement === searchInput) {
            searchInput.value = '';
            searchInput.blur();
        }
    }
    
    // 数字键1-4：切换页面
    if (e.key >= '1' && e.key <= '4' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const sections = ['home', 'bookmarks', 'tools', 'settings'];
        const targetSection = sections[parseInt(e.key) - 1];
        const targetButton = document.querySelector(`[data-section="${targetSection}"]`);
        if (targetButton) {
            targetButton.click();
        }
    }
}

// 显示消息提示
function showMessage(message, type = 'info') {
    // 创建消息元素
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${type}`;
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        max-width: 300px;
        white-space: pre-line;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        transform: translateX(400px);
        transition: transform 0.3s ease;
    `;
    
    // 设置背景颜色
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };
    messageDiv.style.backgroundColor = colors[type] || colors.info;
    
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);
    
    // 显示动画
    setTimeout(() => {
        messageDiv.style.transform = 'translateX(0)';
    }, 100);
    
    // 自动隐藏
    setTimeout(() => {
        messageDiv.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 300);
    }, 3000);
}

// 添加快捷链接点击跟踪
document.addEventListener('click', (e) => {
    if (e.target.closest('.link-card')) {
        const linkName = e.target.closest('.link-card').querySelector('span').textContent;
        console.log(`访问快捷链接：${linkName}`);
    }
});

// 添加书签点击跟踪
document.addEventListener('click', (e) => {
    if (e.target.closest('.bookmark-item')) {
        const bookmarkName = e.target.closest('.bookmark-item').querySelector('span').textContent;
        console.log(`访问书签：${bookmarkName}`);
    }
});

// 页面可见性变化处理
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        // 页面变为可见时更新时间
        updateTime();
    }
});

// 窗口大小变化处理
window.addEventListener('resize', () => {
    // 可以在这里添加响应式布局调整
    console.log('窗口大小已改变');
});

// 错误处理
window.addEventListener('error', (e) => {
    console.error('页面错误：', e.error);
});

// 确保页面完全加载
window.addEventListener('load', () => {
    console.log('页面资源加载完成');
    
    // 添加加载完成的视觉反馈
    document.body.classList.add('loaded');
});

// 导出一些有用的函数到全局作用域（用于调试）
if (typeof window !== 'undefined') {
    window.newTabPage = {
        showMessage,
        updateTime,
        performSearch,
        changeBackgroundStyle
    };
}
