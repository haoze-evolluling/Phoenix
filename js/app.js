// 页面加载完成后初始化
let searchCenter;
const famousQuotes = [
    "岁月不居，时节如流",
    "桑榆非晚，柠月如风",
    "古人惜寸阴，念此使人惧",
    "年之暮奈何，时过时来微",
    "愚者爱惜费，但为后世嗤",
    "白日何短短，百年苦易满",
    "三春花事好，为学须及早",
    "志士惜日短，愁人知夜长"
];

document.addEventListener('DOMContentLoaded', () => {
    searchCenter = new SearchCenter();
    searchCenter.loadSettings();
    
    // 初始化名句模态框功能
    initQuoteModal();
    
    // 添加时间显示区域的点击动画和名句功能
    const timeDisplay = document.getElementById('timeDisplay');
    if (timeDisplay) {
        timeDisplay.addEventListener('click', function() {
            this.classList.add('clicked');
            setTimeout(() => {
                this.classList.remove('clicked');
            }, 600);
            showRandomQuote();
        });
    }
});

// 初始化名句小彩蛋
function initQuoteModal() {
    // 初始化完成，无需额外设置
}

// 显示随机名句
function showRandomQuote() {
    const quoteModal = document.getElementById('quoteModal');
    const quoteText = document.getElementById('quoteText');
    
    if (!quoteModal || !quoteText) return;
    
    // 如果已经在显示，先清除之前的定时器
    if (quoteModal.style.display === 'flex') {
        clearTimeout(window.quoteAutoCloseTimer);
    }
    
    // 随机选择名句
    const randomIndex = Math.floor(Math.random() * famousQuotes.length);
    const selectedQuote = famousQuotes[randomIndex];
    
    quoteText.textContent = selectedQuote;
    quoteModal.style.display = 'flex';
    
    // 3秒后自动关闭
    window.quoteAutoCloseTimer = setTimeout(() => {
        closeQuoteModal();
    }, 3000);
}

// 关闭名句小彩蛋
function closeQuoteModal() {
    const quoteModal = document.getElementById('quoteModal');
    if (!quoteModal) return;
    
    quoteModal.style.display = 'none';
    if (window.quoteAutoCloseTimer) {
        clearTimeout(window.quoteAutoCloseTimer);
    }
}

// 全局工具函数
window.SearchUtils = {
    // 获取当前搜索引擎实例
    getSearchCenter: () => searchCenter,
    
    // 快速切换搜索引擎
    switchEngine: (engine) => {
        if (searchCenter && searchCenter.searchEngines[engine]) {
            const engineButton = document.querySelector(`[data-engine="${engine}"]`);
            if (engineButton) engineButton.click();
        }
    },
    
    // 快速搜索
    quickSearch: (query) => {
        if (searchCenter && query) {
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.value = query;
                const event = new KeyboardEvent('keypress', { key: 'Enter' });
                searchInput.dispatchEvent(event);
            }
        }
    }
};