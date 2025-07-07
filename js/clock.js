/**
 * 时钟相关功能
 */

// 更新时钟
function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    document.getElementById('clock').textContent = `${hours}:${minutes}:${seconds}`;
}

// 添加时钟点击缩放效果
function addClockClickEffect() {
    const clock = document.getElementById('clock');
    
    clock.addEventListener('mousedown', function() {
        this.classList.add('click-scale');
    });
    
    clock.addEventListener('mouseup', function() {
        this.classList.remove('click-scale');
    });
    
    clock.addEventListener('mouseleave', function() {
        this.classList.remove('click-scale');
    });
    
    // 添加鼠标指针样式，提示可点击
    clock.style.cursor = 'pointer';
}

// 初始化时钟
function initClock() {
    updateClock();
    setInterval(updateClock, 1000);
    addClockClickEffect();
} 