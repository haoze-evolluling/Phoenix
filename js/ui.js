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

    // 初始时，如果搜索框有焦点，添加模糊效果
    if (document.activeElement === searchInput) {
        body.classList.add('blur');
    }

    // 页面加载动画效果
    body.style.opacity = '0';
    setTimeout(() => {
        body.style.opacity = '1';
        body.style.transition = 'opacity 0.8s ease';
    }, 100);
} 