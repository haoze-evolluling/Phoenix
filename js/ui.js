/**
 * UI相关功能
 */

// 初始化UI效果
function initUI() {
    const body = document.body;
    const searchContainer = document.querySelector('.search-container');
    const searchInput = document.getElementById('search-input');

    // 点击搜索框或搜索容器时添加模糊效果
    searchContainer.addEventListener('click', function() {
        body.classList.add('blur');
    });

    // 搜索框获得焦点时添加模糊效果
    searchInput.addEventListener('focus', function() {
        body.classList.add('blur');
    });

    // 点击页面其他区域时移除模糊效果
    document.addEventListener('click', function(event) {
        // 检查点击的元素是否是搜索容器或其子元素
        if (!searchContainer.contains(event.target)) {
            body.classList.remove('blur');
        }
    });

    // 初始时，页面加载完成后平滑显示
    setTimeout(() => {
        // 先显示页面内容
        body.style.opacity = '1';
        body.style.transition = 'opacity 0.8s ease';
        
        // 短暂延迟后，如果搜索框有焦点，添加模糊效果（确保有过渡动画）
        setTimeout(() => {
            if (document.activeElement === searchInput) {
                body.classList.add('blur');
            }
        }, 200); // 200ms的延迟确保页面先显示再应用模糊效果
    }, 100);
} 