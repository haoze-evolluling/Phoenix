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
        // 确保已添加过渡准备类
        if (!body.classList.contains('transition-ready')) {
            body.classList.add('transition-ready');
            document.body.offsetHeight; // 触发重排
        }
        
        // 先应用轻微模糊，然后再应用完全模糊
        body.classList.add('initial-blur');
        
        setTimeout(() => {
            body.classList.remove('initial-blur');
            body.classList.add('blur');
        }, 50);
    });

    // 搜索框获得焦点时添加模糊效果
    searchInput.addEventListener('focus', function() {
        // 确保已添加过渡准备类
        if (!body.classList.contains('transition-ready')) {
            body.classList.add('transition-ready');
            document.body.offsetHeight; // 触发重排
        }
        
        // 先应用轻微模糊，然后再应用完全模糊
        body.classList.add('initial-blur');
        
        setTimeout(() => {
            body.classList.remove('initial-blur');
            body.classList.add('blur');
        }, 50);
    });

    // 点击页面其他区域时移除模糊效果
    document.addEventListener('click', function(event) {
        // 检查点击的元素是否是搜索容器或其子元素
        if (!searchContainer.contains(event.target)) {
            // 平滑移除模糊效果
            if (body.classList.contains('blur')) {
                // 先从完全模糊过渡到轻微模糊
                body.classList.add('initial-blur');
                body.classList.remove('blur');
                
                // 短暂延迟后，完全移除模糊
                setTimeout(() => {
                    body.classList.remove('initial-blur');
                }, 100);
            } else {
                // 如果只有轻微模糊，直接移除
                body.classList.remove('initial-blur');
            }
        }
    });

    // 初始时，页面加载完成后平滑显示
    // 先添加过渡准备类，但不立即应用模糊
    body.classList.add('transition-ready');
    
    // 强制浏览器重排，确保过渡效果已准备好
    document.body.offsetHeight;
    
    // 使页面可见，但保持不模糊状态
    setTimeout(() => {
        // 页面显示
        body.style.opacity = '1';
        body.style.transition = 'opacity 0.8s ease';
        
        // 允许用户看到未模糊的页面一段时间，使其有足够的心理准备
        setTimeout(() => {
            // 如果需要，超级平滑地应用非常轻微的初始模糊
            body.classList.add('initial-blur');
            
            // 再次延迟后，如果搜索框有焦点，再应用完全模糊
            setTimeout(() => {
                if (document.activeElement === searchInput) {
                    // 平滑过渡到完全模糊
                    body.classList.remove('initial-blur');
                    body.classList.add('blur');
                }
            }, 300);
        }, 800); // 增加延迟，让用户先看到未模糊的页面
    }, 100);
} 