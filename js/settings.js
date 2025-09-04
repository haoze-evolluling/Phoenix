// 设置功能模块

// 初始化设置功能
function initializeSettings() {
    
    // 显示秒数设置
    const showSecondsCheckbox = document.querySelector('.show-seconds');
    if (showSecondsCheckbox) {
        showSecondsCheckbox.addEventListener('change', (e) => {
            const newShowSeconds = e.target.checked;
            changeShowSeconds(newShowSeconds);
        });
    }
    
    // 时间格式设置
    const timeFormatSelector = document.querySelector('.time-format-selector');
    if (timeFormatSelector) {
        timeFormatSelector.value = use12HourFormat ? '12' : '24';
        timeFormatSelector.addEventListener('change', (e) => {
            const newFormat = e.target.value === '12';
            changeTimeFormat(newFormat);
        });
    }
    
    // 背景样式设置
    const bgSelector = document.querySelector('.bg-selector');
    if (bgSelector) {
        // 初始化时检查当前背景样式
        const root = document.documentElement;
        const currentBg = getComputedStyle(root).getPropertyValue('--bg-primary');
        const isSolid = !currentBg.includes('gradient');
        toggleColorPicker(isSolid);
        
        bgSelector.addEventListener('change', (e) => {
            const newStyle = e.target.value;
            changeBackgroundStyle(newStyle);
            toggleColorPicker(newStyle === 'solid');
        });
    }
    
    // 初始化调色盘功能
    initializeColorPicker();
    
    // 工具卡片点击事件
    initializeToolCards();
    
    // 添加设置导入导出功能
    addSettingsImportExport();
    
    // 添加重置设置功能
    addResetSettings();
}


// 改变显示秒数设置
function changeShowSeconds(newShowSeconds) {
    showSeconds = newShowSeconds;
    localStorage.setItem('showSeconds', showSeconds);
    updateTime();
    
    showMessage(`${showSeconds ? '显示' : '隐藏'}秒数`, 'info');
}

// 改变时间格式设置
function changeTimeFormat(newUse12Hour) {
    use12HourFormat = newUse12Hour;
    localStorage.setItem('use12HourFormat', use12HourFormat);
    updateTime();
    
    showMessage(`时间格式已设置为${use12HourFormat ? '12' : '24'}小时制`, 'success');
}

// 初始化工具卡片
function initializeToolCards() {
    const toolCards = document.querySelectorAll('.tool-card');
    
    toolCards.forEach(card => {
        card.addEventListener('click', (e) => {
            e.preventDefault();
            
            const toolName = card.querySelector('h3').textContent;
            handleToolClick(toolName);
        });
        
        // 添加键盘支持
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                card.click();
            }
        });
        
        // 使工具卡片可聚焦
        card.setAttribute('tabindex', '0');
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
            const sanitized = result.replace(/[^0-9+\-*/.() ]/g, '');
            const calcResult = Function('"use strict"; return (' + sanitized + ')')();
            showMessage(`计算结果：${result} = ${calcResult}`, 'success');
            
            // 复制结果到剪贴板
            navigator.clipboard.writeText(calcResult.toString()).then(() => {
                showMessage('结果已复制到剪贴板', 'info');
            });
        } catch (error) {
            showMessage('无效的计算表达式', 'error');
        }
    }
}

// 番茄钟
function openPomodoroTimer() {
    const minutes = prompt('请输入番茄钟时间（分钟）：', '25');
    if (minutes && !isNaN(minutes) && parseInt(minutes) > 0) {
        startPomodoroTimer(parseInt(minutes));
    } else if (minutes !== null) {
        showMessage('请输入有效的分钟数', 'error');
    }
}

// 启动番茄钟
function startPomodoroTimer(minutes) {
    const totalSeconds = minutes * 60;
    let remainingSeconds = totalSeconds;
    
    // 创建番茄钟显示界面
    const timerDisplay = createTimerDisplay(minutes);
    
    const timerInterval = setInterval(() => {
        const mins = Math.floor(remainingSeconds / 60);
        const secs = remainingSeconds % 60;
        
        const timeString = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        
        // 更新页面标题
        document.title = `${timeString} - 番茄钟`;
        
        // 更新显示界面
        updateTimerDisplay(timerDisplay, timeString, remainingSeconds, totalSeconds);
        
        remainingSeconds--;
        
        if (remainingSeconds < 0) {
            clearInterval(timerInterval);
            document.title = '新标签页';
            timerDisplay.remove();
            
            showMessage('番茄钟时间到！🍅', 'success');
            
            // 播放提示音
            playNotificationSound();
            
            // 发送浏览器通知
            sendBrowserNotification('番茄钟', '时间到了！休息一下吧。');
        }
    }, 1000);
    
    showMessage(`番茄钟已启动：${minutes}分钟`, 'success');
    
    return timerInterval;
}

// 创建番茄钟显示界面
function createTimerDisplay(minutes) {
    const timerDisplay = document.createElement('div');
    timerDisplay.className = 'pomodoro-timer';
    timerDisplay.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--bg-card);
        backdrop-filter: var(--glass-backdrop);
        border-radius: 16px;
        padding: 20px;
        box-shadow: var(--shadow-glass);
        border: var(--glass-border);
        z-index: 10000;
        min-width: 200px;
        text-align: center;
        color: var(--text-primary);
    `;
    
    timerDisplay.innerHTML = `
        <div style="font-size: 14px; margin-bottom: 10px;">🍅 番茄钟</div>
        <div class="timer-time" style="font-size: 24px; font-weight: bold; margin-bottom: 10px;">${minutes}:00</div>
        <div class="timer-progress" style="width: 100%; height: 4px; background: var(--bg-secondary); border-radius: 2px; overflow: hidden;">
            <div class="timer-progress-bar" style="height: 100%; background: var(--accent-color); width: 100%;"></div>
        </div>
        <button class="timer-cancel" style="margin-top: 10px; padding: 5px 10px; background: var(--error-color); color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">取消</button>
    `;
    
    // 添加取消功能
    timerDisplay.querySelector('.timer-cancel').addEventListener('click', () => {
        timerDisplay.remove();
        document.title = '新标签页';
        showMessage('番茄钟已取消', 'info');
    });
    
    document.body.appendChild(timerDisplay);
    return timerDisplay;
}

// 更新番茄钟显示
function updateTimerDisplay(display, timeString, remaining, total) {
    const timeElement = display.querySelector('.timer-time');
    const progressBar = display.querySelector('.timer-progress-bar');
    
    if (timeElement) {
        timeElement.textContent = timeString;
    }
    
    if (progressBar) {
        const progress = (remaining / total) * 100;
        progressBar.style.width = `${progress}%`;
    }
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
        const rgb = newTabUtils.hexToRgb(color);
        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
        
        const colorInfo = `
颜色值：${color}
RGB：rgb(${rgb.r}, ${rgb.g}, ${rgb.b})
HSL：hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
        
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
    if (text && text.trim()) {
        generateQRCode(text.trim());
    }
}

// 生成二维码
function generateQRCode(text) {
    // 使用免费的二维码API
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(text)}`;
    
    // 创建模态框显示二维码
    const modal = document.createElement('div');
    modal.className = 'qr-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    `;
    
    modal.innerHTML = `
        <div style="background: var(--bg-card); backdrop-filter: var(--glass-backdrop); border-radius: 16px; padding: 30px; text-align: center; max-width: 300px; border: var(--glass-border);">
            <h3 style="margin-bottom: 20px; color: var(--text-primary);">二维码生成器</h3>
            <img src="${qrUrl}" alt="二维码" style="border: 1px solid var(--border-color); border-radius: 8px; margin-bottom: 15px;" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
            <div style="display: none; color: var(--error-color); margin-bottom: 15px;">生成失败</div>
            <p style="word-break: break-all; font-size: 12px; color: var(--text-secondary); margin-bottom: 20px; max-height: 60px; overflow-y: auto;">${text}</p>
            <button onclick="this.closest('.qr-modal').remove()" style="background: var(--accent-color); color: white; border: none; padding: 8px 16px; border-radius: 8px; cursor: pointer;">关闭</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // 点击背景关闭
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    // ESC键关闭
    const closeOnEsc = (e) => {
        if (e.key === 'Escape') {
            modal.remove();
            document.removeEventListener('keydown', closeOnEsc);
        }
    };
    document.addEventListener('keydown', closeOnEsc);
}

// HSL颜色转换函数
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

// 播放通知音
function playNotificationSound() {
    try {
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmIcCEJ+w/LVfSsFJnjH9OGOPwcbWrLt3Z1NEAVcq+O30WCPBC9+yPCvigAlOabz5qpYFAlYvuzKhxIJJWzZ5r91jAKPVZjqqXgqYKzz4pBUEQpDnOCwb7sDEOqWU4Sn7Z5/jQKoM5rrv2wYExkOzAFRHpZqpWwwXLHvxJhNIgxEoeDUNV0/bR5WmNTYkVkT/VkzbXJzZVJtJR');
        audio.play();
    } catch (e) {
        console.log('无法播放提示音');
    }
}

// 发送浏览器通知
function sendBrowserNotification(title, body) {
    if ('Notification' in window) {
        if (Notification.permission === 'granted') {
            new Notification(title, { body });
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    new Notification(title, { body });
                }
            });
        }
    }
}

// 添加设置导入导出功能
function addSettingsImportExport() {
    // 可以在设置页面添加导入导出按钮
    const settingsContainer = document.querySelector('.settings-container');
    if (settingsContainer) {
        const importExportGroup = document.createElement('div');
        importExportGroup.className = 'setting-group';
        importExportGroup.innerHTML = `
            <h3>数据管理</h3>
            <div class="setting-item">
                <label>导出设置</label>
                <button class="export-settings-btn" style="padding: 8px 16px; background: var(--accent-color); color: white; border: none; border-radius: 8px; cursor: pointer;">导出</button>
            </div>
            <div class="setting-item">
                <label>导入设置</label>
                <input type="file" class="import-settings-input" accept=".json" style="display: none;">
                <button class="import-settings-btn" style="padding: 8px 16px; background: var(--success-color); color: white; border: none; border-radius: 8px; cursor: pointer;">导入</button>
            </div>
        `;
        
        settingsContainer.appendChild(importExportGroup);
        
        // 绑定事件
        importExportGroup.querySelector('.export-settings-btn').addEventListener('click', exportSettings);
        importExportGroup.querySelector('.import-settings-btn').addEventListener('click', () => {
            importExportGroup.querySelector('.import-settings-input').click();
        });
        importExportGroup.querySelector('.import-settings-input').addEventListener('change', importSettings);
    }
}

// 导出设置
function exportSettings() {
    const settings = {
        showSeconds: showSeconds,
        exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `newtab-settings-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    showMessage('设置已导出', 'success');
}

// 导入设置
function importSettings(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const settings = JSON.parse(event.target.result);
                
                // 应用设置
                if (typeof settings.showSeconds === 'boolean') changeShowSeconds(settings.showSeconds);
                
                showMessage('设置已导入', 'success');
                
                // 刷新页面以应用所有设置
                setTimeout(() => location.reload(), 1000);
            } catch (error) {
                showMessage('导入失败：文件格式错误', 'error');
            }
        };
        reader.readAsText(file);
    }
}

// 添加重置设置功能
function addResetSettings() {
    const settingsContainer = document.querySelector('.settings-container');
    if (settingsContainer) {
        const resetGroup = document.createElement('div');
        resetGroup.className = 'setting-group';
        resetGroup.innerHTML = `
            <h3>重置</h3>
            <div class="setting-item">
                <label>恢复默认设置</label>
                <button class="reset-settings-btn" style="padding: 8px 16px; background: var(--error-color); color: white; border: none; border-radius: 8px; cursor: pointer;">重置</button>
            </div>
        `;
        
        settingsContainer.appendChild(resetGroup);
        
        resetGroup.querySelector('.reset-settings-btn').addEventListener('click', resetAllSettings);
    }
}

// 重置所有设置
function resetAllSettings() {
    if (confirm('确定要重置所有设置吗？这将清除所有自定义配置。')) {
        localStorage.clear();
        showMessage('设置已重置，页面将刷新', 'info');
        setTimeout(() => location.reload(), 1000);
    }
}

// 调色盘功能
let currentSolidColor = '#f8fafc'; // 默认纯色背景颜色

// 初始化调色盘功能
function initializeColorPicker() {
    const colorPicker = document.getElementById('color-picker');
    const colorPreview = document.getElementById('color-preview');
    const presetColors = document.querySelectorAll('.preset-color');
    
    // 从本地存储恢复颜色设置
    const savedSettings = localStorage.getItem('newtabSettings');
    if (savedSettings) {
        try {
            const settings = JSON.parse(savedSettings);
            if (settings.currentSolidColor) {
                currentSolidColor = settings.currentSolidColor;
            }
        } catch (e) {
            console.log('恢复颜色设置失败:', e);
        }
    }
    
    // 设置初始颜色
    updateColorPreview(currentSolidColor);
    if (colorPicker) {
        colorPicker.value = currentSolidColor;
    }
    updateActivePresetColor(currentSolidColor);
    
    // 颜色选择器事件
    if (colorPicker) {
        colorPicker.addEventListener('change', (e) => {
            const newColor = e.target.value;
            currentSolidColor = newColor;
            updateColorPreview(newColor);
            updateActivePresetColor(newColor);
            applySolidBackground(newColor);
        });
    }
    
    // 预设颜色点击事件
    presetColors.forEach(presetColor => {
        presetColor.addEventListener('click', (e) => {
            const newColor = e.target.dataset.color;
            currentSolidColor = newColor;
            updateColorPreview(newColor);
            updateActivePresetColor(newColor);
            if (colorPicker) {
                colorPicker.value = newColor;
            }
            applySolidBackground(newColor);
        });
    });
}

// 切换调色盘显示/隐藏
function toggleColorPicker(show) {
    const colorPickerContainer = document.getElementById('color-picker-container');
    if (colorPickerContainer) {
        colorPickerContainer.style.display = show ? 'flex' : 'none';
    }
}

// 更新颜色预览
function updateColorPreview(color) {
    const colorPreview = document.getElementById('color-preview');
    if (colorPreview) {
        colorPreview.style.backgroundColor = color;
    }
}

// 更新激活的预设颜色
function updateActivePresetColor(color) {
    const presetColors = document.querySelectorAll('.preset-color');
    presetColors.forEach(presetColor => {
        if (presetColor.dataset.color === color) {
            presetColor.classList.add('active');
        } else {
            presetColor.classList.remove('active');
        }
    });
}

// 应用纯色背景
function applySolidBackground(color) {
    const root = document.documentElement;
    root.style.setProperty('--bg-primary', color);
    showMessage('背景颜色已更改', 'success');
    saveSettings();
}

// 保存设置到本地存储
function saveSettings() {
    const settings = {
        showSeconds: showSeconds,
        use12HourFormat: use12HourFormat,
        currentSolidColor: currentSolidColor
    };
    localStorage.setItem('newtabSettings', JSON.stringify(settings));
}

// 导出设置相关功能
if (typeof window !== 'undefined') {
    window.newTabSettings = {
        initializeSettings,
        changeShowSeconds,
        changeTimeFormat,
        handleToolClick,
        openCalculator,
        openPomodoroTimer,
        openColorPicker,
        openQRCodeGenerator,
        exportSettings,
        importSettings,
        resetAllSettings,
        initializeColorPicker,
        toggleColorPicker,
        applySolidBackground
    };
}