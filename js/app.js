// 页面加载完成后初始化
let searchCenter;

document.addEventListener('DOMContentLoaded', () => {
    searchCenter = new SearchCenter();
    searchCenter.loadSettings();
    
    // 添加额外的样式增强
    addDynamicBackground();
    addFloatingAnimation();
});

// 添加动态背景效果
function addDynamicBackground() {
    const createFloatingElements = () => {
        const container = document.querySelector('.container');
        for (let i = 0; i < 6; i++) {
            const element = document.createElement('div');
            element.className = 'floating-element';
            const size = Math.random() * 100 + 50;
            element.style.cssText = `
                position: fixed;
                width: ${size}px;
                height: ${size}px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 50%;
                top: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
                animation: float ${Math.random() * 10 + 10}s ease-in-out infinite;
                animation-delay: ${Math.random() * 5}s;
                z-index: -1;
            `;
            document.body.appendChild(element);
        }
    };

    createFloatingElements();
}

// 添加浮动动画
function addFloatingAnimation() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float {
            0%, 100% {
                transform: translateY(0px) rotate(0deg);
                opacity: 0.1;
            }
            50% {
                transform: translateY(-20px) rotate(180deg);
                opacity: 0.3;
            }
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
        }

        .floating-element {
            pointer-events: none;
        }

        /* 响应式设计增强 */
        @media (max-width: 768px) {
            .floating-element {
                display: none;
            }
        }
    `;
    document.head.appendChild(style);
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