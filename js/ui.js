/**
 * UI相关功能
 */

// 初始化UI效果
function initUI() {
    const body = document.body;
    const searchContainer = document.querySelector('.search-container');
    const searchInput = document.getElementById('search-input');
    
    // 应用模糊效果的统一函数
    function applyBlurEffect() {
        // 确保已添加过渡准备类
        if (!body.classList.contains('transition-ready')) {
            body.classList.add('transition-ready');
            // 强制浏览器重排，确保过渡效果已准备好
            document.body.offsetHeight;
        }
        
        // 使用 requestAnimationFrame 确保在下一帧应用效果
        requestAnimationFrame(() => {
            // 先应用轻微模糊
            body.classList.add('initial-blur');
            
            // 使用 requestAnimationFrame 确保在下一帧应用完全模糊
            requestAnimationFrame(() => {
                setTimeout(() => {
                    body.classList.remove('initial-blur');
                    body.classList.add('blur');
                }, 30);
            });
        });
    }
    
    // 移除模糊效果的统一函数
    function removeBlurEffect() {
        // 平滑移除模糊效果
        if (body.classList.contains('blur')) {
            // 先从完全模糊过渡到轻微模糊
            body.classList.add('initial-blur');
            body.classList.remove('blur');
            
            // 使用 requestAnimationFrame 确保在下一帧完全移除模糊
            requestAnimationFrame(() => {
                setTimeout(() => {
                    body.classList.remove('initial-blur');
                }, 80);
            });
        } else {
            // 如果只有轻微模糊，直接移除
            body.classList.remove('initial-blur');
        }
    }

    // 点击搜索框或搜索容器时添加模糊效果
    searchContainer.addEventListener('click', function(event) {
        // 阻止事件冒泡，防止触发文档点击事件
        event.stopPropagation();
        applyBlurEffect();
    });

    // 搜索框获得焦点时添加模糊效果
    searchInput.addEventListener('focus', applyBlurEffect);

    // 点击页面其他区域时移除模糊效果
    document.addEventListener('click', function(event) {
        // 检查点击的元素是否是搜索容器或其子元素
        if (!searchContainer.contains(event.target)) {
            removeBlurEffect();
        }
    });

    // 初始化页面加载效果
    function initPageLoad() {
        // 先添加过渡准备类
        body.classList.add('transition-ready');
        
        // 强制浏览器重排，确保过渡效果已准备好
        document.body.offsetHeight;
        
        // 使用 requestAnimationFrame 确保在下一帧应用效果
        requestAnimationFrame(() => {
            // 页面显示
            body.style.opacity = '1';
            
            // 如果搜索框已经获得焦点，应用模糊效果
            if (document.activeElement === searchInput) {
                // 延迟应用模糊效果，确保页面先完全显示
                setTimeout(() => {
                    applyBlurEffect();
                }, 500);
            }
        });
    }
    
    // 执行页面加载初始化
    initPageLoad();
} 