// 导航功能模块

// 初始化导航功能
function initializeNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.section');
    
    navButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const targetSection = button.dataset.section;
            
            // 添加点击反馈效果
            addNavigationClickEffect(button);
            
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
            animatePageTransition(targetSection);
            
            // 记录导航事件
            console.log(`切换到页面：${targetSection}`);
        });
        
        // 添加键盘导航支持
        button.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                button.click();
            }
        });
    });
    
    // 添加触摸支持
    addTouchSupport(navButtons);
}

// 添加导航按钮点击效果
function addNavigationClickEffect(button) {
    // 添加短暂的缩放效果
    button.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
        button.style.transform = '';
    }, 150);
    
    // 添加发光效果
    button.classList.add('nav-glow');
    setTimeout(() => {
        button.classList.remove('nav-glow');
    }, 300);
}

// 页面切换动画
function animatePageTransition(targetSection) {
    const activeSection = document.querySelector('.section.active');
    if (activeSection) {
        // 添加退出动画
        activeSection.style.opacity = '0';
        activeSection.style.transform = 'translateY(20px)';
        
        // 添加进入动画
        setTimeout(() => {
            activeSection.style.opacity = '1';
            activeSection.style.transform = 'translateY(0)';
            
            // 为新激活的页面添加特殊动画
            addSectionEnterAnimation(activeSection, targetSection);
        }, 100);
    }
}

// 为不同页面添加进入动画
function addSectionEnterAnimation(section, sectionName) {
    // 清除之前的动画类
    section.classList.remove('slide-in-left', 'slide-in-right', 'fade-in-up', 'zoom-in');
    
    // 强制重排
    section.offsetHeight;
    
    // 根据页面类型添加不同动画
    switch (sectionName) {
        case 'home':
            section.classList.add('fade-in-up');
            animateHomeElements();
            break;
        case 'bookmarks':
            section.classList.add('slide-in-left');
            animateBookmarkElements();
            break;
        case 'tools':
            section.classList.add('zoom-in');
            animateToolElements();
            break;
        case 'settings':
            section.classList.add('slide-in-right');
            animateSettingElements();
            break;
    }
}

// 主页元素动画
function animateHomeElements() {
    const timeDisplay = document.querySelector('.time-display');
    const searchBox = document.querySelector('.search-box');
    const quickLinks = document.querySelector('.quick-links');
    
    if (timeDisplay) {
        timeDisplay.style.transform = 'translateY(30px)';
        timeDisplay.style.opacity = '0';
        setTimeout(() => {
            timeDisplay.style.transform = 'translateY(0)';
            timeDisplay.style.opacity = '1';
        }, 100);
    }
    
    if (searchBox) {
        searchBox.style.transform = 'scale(0.9)';
        searchBox.style.opacity = '0';
        setTimeout(() => {
            searchBox.style.transform = 'scale(1)';
            searchBox.style.opacity = '1';
        }, 200);
    }
    
    if (quickLinks) {
        quickLinks.style.transform = 'translateY(30px)';
        quickLinks.style.opacity = '0';
        setTimeout(() => {
            quickLinks.style.transform = 'translateY(0)';
            quickLinks.style.opacity = '1';
        }, 300);
    }
}

// 书签页面元素动画
function animateBookmarkElements() {
    const bookmarkCategories = document.querySelectorAll('.bookmark-category');
    
    bookmarkCategories.forEach((category, index) => {
        category.style.transform = 'translateX(-30px)';
        category.style.opacity = '0';
        
        setTimeout(() => {
            category.style.transform = 'translateX(0)';
            category.style.opacity = '1';
        }, index * 100 + 100);
    });
}

// 工具页面元素动画
function animateToolElements() {
    const toolCards = document.querySelectorAll('.tool-card');
    
    toolCards.forEach((card, index) => {
        card.style.transform = 'scale(0.8)';
        card.style.opacity = '0';
        
        setTimeout(() => {
            card.style.transform = 'scale(1)';
            card.style.opacity = '1';
        }, index * 100 + 100);
    });
}

// 设置页面元素动画
function animateSettingElements() {
    const settingGroups = document.querySelectorAll('.setting-group');
    
    settingGroups.forEach((group, index) => {
        group.style.transform = 'translateX(30px)';
        group.style.opacity = '0';
        
        setTimeout(() => {
            group.style.transform = 'translateX(0)';
            group.style.opacity = '1';
        }, index * 100 + 100);
    });
}

// 添加触摸支持
function addTouchSupport(buttons) {
    buttons.forEach(button => {
        let touchStartTime = 0;
        
        button.addEventListener('touchstart', (e) => {
            touchStartTime = Date.now();
            button.classList.add('touch-active');
        }, { passive: true });
        
        button.addEventListener('touchend', (e) => {
            const touchDuration = Date.now() - touchStartTime;
            
            setTimeout(() => {
                button.classList.remove('touch-active');
            }, 150);
            
            // 防止误触
            if (touchDuration < 1000) {
                e.preventDefault();
            }
        }, { passive: false });
        
        button.addEventListener('touchcancel', () => {
            button.classList.remove('touch-active');
        });
    });
}

// 添加面包屑导航（可选功能）
function addBreadcrumbNavigation() {
    const breadcrumb = document.createElement('div');
    breadcrumb.className = 'breadcrumb-nav';
    breadcrumb.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--bg-card);
        backdrop-filter: var(--glass-backdrop);
        border-radius: 20px;
        padding: 10px 20px;
        box-shadow: var(--shadow-glass);
        border: var(--glass-border);
        font-size: 14px;
        color: var(--text-secondary);
        z-index: 1000;
        opacity: 0;
        transition: all 0.3s ease;
        pointer-events: none;
    `;
    
    document.body.appendChild(breadcrumb);
    
    // 监听页面切换，更新面包屑
    document.addEventListener('click', (e) => {
        if (e.target.matches('.nav-btn')) {
            const sectionName = e.target.dataset.section;
            const sectionNames = {
                'home': '主页',
                'bookmarks': '书签',
                'tools': '工具',
                'settings': '设置'
            };
            
            breadcrumb.textContent = `当前页面: ${sectionNames[sectionName]}`;
            breadcrumb.style.opacity = '1';
            
            setTimeout(() => {
                breadcrumb.style.opacity = '0';
            }, 2000);
        }
    });
}

// 添加页面历史记录功能
function addPageHistory() {
    const pageHistory = [];
    const maxHistoryLength = 10;
    
    document.addEventListener('click', (e) => {
        if (e.target.matches('.nav-btn')) {
            const sectionName = e.target.dataset.section;
            
            // 添加到历史记录
            pageHistory.push({
                section: sectionName,
                timestamp: Date.now()
            });
            
            // 限制历史记录长度
            if (pageHistory.length > maxHistoryLength) {
                pageHistory.shift();
            }
            
            console.log('页面历史:', pageHistory);
        }
    });
    
    // 添加返回功能（Alt + Left）
    document.addEventListener('keydown', (e) => {
        if (e.altKey && e.key === 'ArrowLeft' && pageHistory.length > 1) {
            e.preventDefault();
            
            // 移除当前页面
            pageHistory.pop();
            
            // 获取上一页面
            const prevPage = pageHistory[pageHistory.length - 1];
            if (prevPage) {
                const targetButton = document.querySelector(`[data-section="${prevPage.section}"]`);
                if (targetButton) {
                    targetButton.click();
                }
            }
        }
    });
}

// 初始化扩展导航功能
document.addEventListener('DOMContentLoaded', () => {
    // 可选功能，根据需要启用
    // addBreadcrumbNavigation();
    // addPageHistory();
});

// 导出导航相关功能
if (typeof window !== 'undefined') {
    window.newTabNavigation = {
        initializeNavigation,
        animatePageTransition,
        addNavigationClickEffect,
        addSectionEnterAnimation,
        addTouchSupport,
        addBreadcrumbNavigation,
        addPageHistory
    };
}
