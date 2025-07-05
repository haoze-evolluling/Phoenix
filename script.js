// 搜索引擎配置
const searchEngines = {
    google: {
        name: 'Google',
        url: 'https://www.google.com/search?q=',
        placeholder: '在 Google 中搜索...'
    },
    baidu: {
        name: '百度',
        url: 'https://www.baidu.com/s?wd=',
        placeholder: '在百度中搜索...'
    },
    bing: {
        name: 'Bing',
        url: 'https://www.bing.com/search?q=',
        placeholder: '在 Bing 中搜索...'
    }
};

// 当前选中的搜索引擎
let currentEngine = 'google';

// DOM 元素
const timeDisplay = {
    hours: document.getElementById('hours'),
    minutes: document.getElementById('minutes'),
    seconds: document.getElementById('seconds'),
    date: document.getElementById('date'),
    weekday: document.getElementById('weekday')
};

const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const engineBtns = document.querySelectorAll('.engine-btn');

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeClock();
    initializeSearch();
    updatePlaceholder();
    
    // 每秒更新时钟
    setInterval(updateClock, 1000);
});

// 时钟功能
function initializeClock() {
    updateClock();
}

function updateClock() {
    const now = new Date();
    
    // 更新时间
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    timeDisplay.hours.textContent = hours;
    timeDisplay.minutes.textContent = minutes;
    timeDisplay.seconds.textContent = seconds;
    
    // 更新日期
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const date = now.getDate();
    const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    const weekday = weekdays[now.getDay()];
    
    timeDisplay.date.textContent = `${year}年${month}月${date}日`;
    timeDisplay.weekday.textContent = weekday;
}

// 搜索功能
function initializeSearch() {
    // 搜索引擎切换
    engineBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const engine = this.dataset.engine;
            switchSearchEngine(engine);
        });
    });
    
    // 搜索按钮点击
    searchBtn.addEventListener('click', performSearch);
    
    // 回车键搜索
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    // 输入框焦点效果
    searchInput.addEventListener('focus', function() {
        this.parentElement.style.transform = 'scale(1.02)';
    });
    
    searchInput.addEventListener('blur', function() {
        this.parentElement.style.transform = 'scale(1)';
    });
}

function switchSearchEngine(engine) {
    if (searchEngines[engine]) {
        currentEngine = engine;
        
        // 更新按钮状态
        engineBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.engine === engine) {
                btn.classList.add('active');
            }
        });
        
        // 更新搜索框占位符
        updatePlaceholder();
        
        // 添加切换动画
        searchInput.style.transform = 'scale(0.98)';
        setTimeout(() => {
            searchInput.style.transform = 'scale(1)';
        }, 150);
    }
}

function updatePlaceholder() {
    const engine = searchEngines[currentEngine];
    if (engine) {
        searchInput.placeholder = engine.placeholder;
    }
}

function performSearch() {
    const query = searchInput.value.trim();
    if (query) {
        const engine = searchEngines[currentEngine];
        const searchUrl = engine.url + encodeURIComponent(query);
        
        // 在新标签页中打开搜索结果
        window.open(searchUrl, '_blank');
        
        // 清空搜索框
        searchInput.value = '';
        searchInput.blur();
        
        // 添加搜索动画效果
        searchBtn.style.transform = 'scale(0.9)';
        setTimeout(() => {
            searchBtn.style.transform = 'scale(1)';
        }, 150);
    }
}

// 键盘快捷键
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + K 聚焦搜索框
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInput.focus();
        searchInput.select();
    }
    
    // ESC 键取消搜索框焦点
    if (e.key === 'Escape') {
        searchInput.blur();
    }
    
    // 数字键 1-3 切换搜索引擎
    if (e.key >= '1' && e.key <= '3' && !searchInput.matches(':focus')) {
        const engines = ['google', 'baidu', 'bing'];
        const engineIndex = parseInt(e.key) - 1;
        if (engines[engineIndex]) {
            switchSearchEngine(engines[engineIndex]);
        }
    }
});

// 页面可见性变化时更新时钟
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        updateClock();
    }
});

// 添加一些视觉效果
function addVisualEffects() {
    // 鼠标移动时的视差效果
    document.addEventListener('mousemove', function(e) {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        const orbs = document.querySelectorAll('.glass-orb');
        orbs.forEach((orb, index) => {
            const speed = (index + 1) * 0.5;
            const x = (mouseX - 0.5) * speed;
            const y = (mouseY - 0.5) * speed;
            
            orb.style.transform = `translate(${x}px, ${y}px)`;
        });
    });
}

// 初始化视觉效果
addVisualEffects();

// 搜索建议功能（可选扩展）
function initializeSearchSuggestions() {
    let suggestionTimeout;
    
    searchInput.addEventListener('input', function() {
        clearTimeout(suggestionTimeout);
        const query = this.value.trim();
        
        if (query.length > 2) {
            suggestionTimeout = setTimeout(() => {
                // 这里可以添加搜索建议的API调用
                // 由于涉及跨域和API密钥，暂时注释
                // fetchSearchSuggestions(query);
            }, 300);
        }
    });
}

// 页面加载完成后的额外初始化
window.addEventListener('load', function() {
    // 添加加载完成的淡入效果
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease-in-out';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
    
    // 初始化搜索建议（如果需要）
    // initializeSearchSuggestions();
});
