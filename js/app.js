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
    setupTime();
    setupQuickLinks();
    
    const timeDisplay = document.getElementById('timeDisplay');
    if (timeDisplay) {
        timeDisplay.addEventListener('click', function() {
            this.classList.add('clicked');
            setTimeout(() => this.classList.remove('clicked'), 600);
            showRandomQuote();
        });
    }
});

function setupTime() {
    const updateTime = () => {
        const now = new Date();
        const timeString = now.toLocaleTimeString('zh-CN', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        
        const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
        const dateString = now.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        const timeElement = document.querySelector('.time');
        const dateElement = document.querySelector('.date');
        
        if (timeElement) timeElement.textContent = timeString;
        if (dateElement) dateElement.textContent = `${weekdays[now.getDay()]}, ${dateString}`;
    };

    updateTime();
    setInterval(updateTime, 1000);
}

function showRandomQuote() {
    const quoteModal = document.getElementById('quoteModal');
    const quoteText = document.getElementById('quoteText');
    
    if (!quoteModal || !quoteText) return;
    
    if (quoteModal.style.display === 'flex') {
        clearTimeout(window.quoteAutoCloseTimer);
    }
    
    const randomIndex = Math.floor(Math.random() * famousQuotes.length);
    quoteText.textContent = famousQuotes[randomIndex];
    quoteModal.style.display = 'flex';
    
    window.quoteAutoCloseTimer = setTimeout(closeQuoteModal, 3000);
}

function closeQuoteModal() {
    const quoteModal = document.getElementById('quoteModal');
    const quoteContent = quoteModal?.querySelector('.quote-modal-content');
    if (!quoteModal || !quoteContent) return;
    
    quoteContent.style.animation = 'scaleOut 0.3s ease-out forwards';
    
    setTimeout(() => {
        quoteModal.style.display = 'none';
        quoteContent.style.animation = '';
    }, 300);
    
    if (window.quoteAutoCloseTimer) {
        clearTimeout(window.quoteAutoCloseTimer);
    }
}

// 设置快捷链接
function setupQuickLinks() {
    const quickLinks = [
        { name: 'GitHub', url: 'https://github.com', icon: 'fab fa-github' },
        { name: 'B站', url: 'https://www.bilibili.com', icon: 'fas fa-play-circle' },
        { name: '知乎', url: 'https://www.zhihu.com', icon: 'fas fa-question-circle' },
        { name: 'YouTube', url: 'https://www.youtube.com', icon: 'fab fa-youtube' },
        { name: '微信', url: 'https://weixin.qq.com', icon: 'fab fa-weixin' },
        { name: '微博', url: 'https://weibo.com', icon: 'fab fa-weibo' },
        { name: '淘宝', url: 'https://www.taobao.com', icon: 'fas fa-shopping-cart' },
        { name: '百度网盘', url: 'https://pan.baidu.com', icon: 'fas fa-cloud' }
    ];

    const quickLinksContainer = document.getElementById('quickLinks');
    if (!quickLinksContainer) return;

    quickLinksContainer.innerHTML = '';

    quickLinks.forEach((link, index) => {
        const linkElement = document.createElement('div');
        linkElement.className = 'quick-link-item';
        linkElement.setAttribute('data-index', index);
        
        linkElement.innerHTML = `
            <button class="quick-link-btn" title="${link.name}">
                <i class="${link.icon}"></i>
                <span>${link.name}</span>
            </button>
        `;

        const button = linkElement.querySelector('.quick-link-btn');
        button.addEventListener('click', () => {
            window.open(link.url, '_blank');
        });

        quickLinksContainer.appendChild(linkElement);
    });
}