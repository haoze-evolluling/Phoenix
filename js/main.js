document.addEventListener('DOMContentLoaded', () => {
    // 初始化时间和日期
    updateDateTime();
    // 每秒更新时间
    setInterval(updateDateTime, 1000);
    
    // 初始化搜索功能
    initSearch();
    
    // 延迟自动聚焦到搜索框，等待动画完成
    setTimeout(() => {
        document.getElementById('search-input').focus();
    }, 800); // 等待动画完成后再聚焦
});

// 更新时间和日期
function updateDateTime() {
    const now = new Date();
    
    // 更新时间
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    document.getElementById('time').textContent = `${hours}:${minutes}:${seconds}`;
    
    // 更新日期
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    const weekday = weekdays[now.getDay()];
    document.getElementById('date').textContent = `${year}年${month}月${day}日 ${weekday}`;
}

// 初始化搜索功能
function initSearch() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const engineBtns = document.querySelectorAll('.engine-btn');
    const searchBox = document.querySelector('.search-box');
    const searchEnginesContainer = document.querySelector('.search-engines');
    
    // 当前搜索引擎：从本地存储获取，如果没有则默认使用必应
    let currentEngine = localStorage.getItem('preferredSearchEngine') || 'bing';
    
    // 搜索引擎URL配置
    const searchEngines = {
        google: 'https://www.google.com/search?q=',
        baidu: 'https://www.baidu.com/s?wd=',
        bing: 'https://www.bing.com/search?q=',
        sm: 'https://m.sm.cn/s?q='
    };
    
    // 先移除所有按钮的active类
    engineBtns.forEach(btn => {
        btn.classList.remove('active');
    });
    
    // 设置当前选中的搜索引擎按钮
    engineBtns.forEach(btn => {
        if (btn.getAttribute('data-engine') === currentEngine) {
            btn.classList.add('active');
        }
    });
    
    // 切换搜索引擎
    engineBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // 移除所有按钮的active类
            engineBtns.forEach(b => b.classList.remove('active'));
            // 给当前按钮添加active类
            btn.classList.add('active');
            // 更新当前搜索引擎
            currentEngine = btn.getAttribute('data-engine');
            // 保存用户选择到本地存储
            localStorage.setItem('preferredSearchEngine', currentEngine);
        });
    });
    
    // 搜索功能
    function performSearch() {
        const query = searchInput.value.trim();
        if (query) {
            // 添加搜索框消失动画
            searchBox.classList.add('hide');
            searchEnginesContainer.classList.add('hide');
            
            // 延迟打开搜索结果，让动画有时间执行
            setTimeout(() => {
                const searchUrl = searchEngines[currentEngine] + encodeURIComponent(query);
                window.open(searchUrl, '_blank');
                
                // 搜索完成后重置搜索框
                setTimeout(() => {
                    searchInput.value = '';
                    searchBox.classList.remove('hide');
                    searchEnginesContainer.classList.remove('hide');
                    searchInput.focus();
                }, 300);
            }, 400);
        }
    }
    
    // 点击搜索按钮时执行搜索
    searchBtn.addEventListener('click', performSearch);
    
    // 按下回车键时执行搜索
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
} 