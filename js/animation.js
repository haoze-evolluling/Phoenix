document.addEventListener('DOMContentLoaded', () => {
    // 搜索框动画效果
    const searchInput = document.getElementById('search-input');
    const searchBox = document.querySelector('.search-box');
    
    // 搜索框聚焦效果
    searchInput.addEventListener('focus', () => {
        searchBox.classList.add('focused');
    });
    
    searchInput.addEventListener('blur', () => {
        searchBox.classList.remove('focused');
    });
    
    // 搜索引擎按钮点击波纹效果
    const engineBtns = document.querySelectorAll('.engine-btn');
    
    engineBtns.forEach(btn => {
        btn.addEventListener('click', createRippleEffect);
    });
    
    // 创建波纹效果
    function createRippleEffect(event) {
        const btn = event.currentTarget;
        
        // 移除已有波纹，防止叠加
        const oldRipples = btn.querySelectorAll('.ripple');
        oldRipples.forEach(ripple => ripple.remove());
        
        // 创建波纹元素
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        
        // 设置波纹位置
        const rect = btn.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 2;
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        
        // 添加波纹到按钮
        btn.appendChild(ripple);
        
        // 移除波纹
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    // 搜索按钮点击效果
    const searchBtn = document.getElementById('search-btn');
    
    // 为搜索按钮添加缩放点击效果，不使用波纹
    searchBtn.addEventListener('mousedown', () => {
        searchBtn.classList.add('search-btn-active');
    });
    
    // 鼠标抬起或离开时恢复原状
    searchBtn.addEventListener('mouseup', () => {
        searchBtn.classList.remove('search-btn-active');
    });
    
    searchBtn.addEventListener('mouseleave', () => {
        searchBtn.classList.remove('search-btn-active');
    });
    
    // 添加键盘快捷键
    document.addEventListener('keydown', (e) => {
        // Alt + 数字键切换搜索引擎
        if (e.altKey && e.key >= '1' && e.key <= '4') {
            const index = parseInt(e.key) - 1;
            if (index >= 0 && index < engineBtns.length) {
                engineBtns[index].click();
                e.preventDefault();
            }
        }
        
        // Esc键清空搜索框
        if (e.key === 'Escape') {
            searchInput.value = '';
            searchInput.focus();
            e.preventDefault();
        }
    });
    
    // 防抖函数，优化性能
    function debounce(func, delay) {
        let timer;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timer);
            timer = setTimeout(() => func.apply(context, args), delay);
        };
    }
    
    // 优化窗口调整大小时的性能
    window.addEventListener('resize', debounce(() => {
        // 重新调整页面元素
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        
        // 根据屏幕高度调整content-wrapper的位置
        adjustContentPosition();
    }, 100));
    
    // 设置视口高度变量，解决移动端100vh问题
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    
    // 根据屏幕高度调整content-wrapper的位置
    function adjustContentPosition() {
        const contentWrapper = document.querySelector('.content-wrapper');
        const windowHeight = window.innerHeight;
        
        // 如果屏幕高度过小，减少上移距离
        if (windowHeight < 600) {
            contentWrapper.style.transform = 'translateY(-15%)';
        } else if (windowHeight < 800) {
            contentWrapper.style.transform = 'translateY(-20%)';
        } else {
            contentWrapper.style.transform = 'translateY(-30%)';
        }
    }
    
    // 初始调整位置
    adjustContentPosition();
    
    // 添加自定义CSS变量
    const style = document.createElement('style');
    style.textContent = `
        :root {
            --vh: 1vh;
        }
        
        .container {
            height: calc(var(--vh, 1vh) * 100);
        }
    `;
    
    document.head.appendChild(style);
}); 