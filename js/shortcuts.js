// 快捷网站管理功能模块

// 默认快捷网站配置
const defaultShortcuts = [
    {
        id: 'google',
        name: 'Google',
        url: 'https://www.google.com',
        icon: 'fab fa-google',
        iconType: 'fontawesome'
    },
    {
        id: 'baidu',
        name: '百度',
        url: 'https://www.baidu.com',
        icon: '百度',
        iconType: 'text'
    },
    {
        id: 'github',
        name: 'GitHub',
        url: 'https://github.com',
        icon: 'fab fa-github',
        iconType: 'fontawesome'
    },
    {
        id: 'youtube',
        name: 'YouTube',
        url: 'https://www.youtube.com',
        icon: 'fab fa-youtube',
        iconType: 'fontawesome'
    },
    {
        id: 'bilibili',
        name: '哔哩哔哩',
        url: 'https://www.bilibili.com',
        icon: 'fas fa-tv',
        iconType: 'fontawesome'
    },
    {
        id: 'zhihu',
        name: '知乎',
        url: 'https://www.zhihu.com',
        icon: '知',
        iconType: 'text'
    },
    {
        id: 'taobao',
        name: '淘宝',
        url: 'https://www.taobao.com',
        icon: 'fas fa-shopping-cart',
        iconType: 'fontawesome'
    },
    {
        id: 'jd',
        name: '京东',
        url: 'https://www.jd.com',
        icon: 'fas fa-store',
        iconType: 'fontawesome'
    }
];

// 获取用户自定义的快捷网站
function getUserShortcuts() {
    const saved = localStorage.getItem('userShortcuts');
    return saved ? JSON.parse(saved) : defaultShortcuts;
}

// 保存用户自定义的快捷网站
function saveUserShortcuts(shortcuts) {
    localStorage.setItem('userShortcuts', JSON.stringify(shortcuts));
}

// 初始化快捷网站管理功能
function initializeShortcuts() {
    renderShortcuts();
    // addShortcutsManagementButtons(); // 已移除设置中的快捷网站管理
}

// 渲染快捷网站
function renderShortcuts() {
    const shortcuts = getUserShortcuts();
    const linksGrid = document.querySelector('.links-grid');
    
    if (!linksGrid) return;
    
    linksGrid.innerHTML = '';
    
    shortcuts.forEach(shortcut => {
        const linkCard = createShortcutElement(shortcut);
        linksGrid.appendChild(linkCard);
    });
    
    // 添加"添加网站"按钮
    const addButton = createAddShortcutButton();
    linksGrid.appendChild(addButton);
}

// 创建快捷网站元素
function createShortcutElement(shortcut) {
    const linkCard = document.createElement('a');
    linkCard.href = shortcut.url;
    linkCard.className = 'link-card';
    linkCard.setAttribute('data-shortcut-id', shortcut.id);
    
    let iconHtml = '';
    if (shortcut.iconType === 'fontawesome') {
        iconHtml = `<i class="${shortcut.icon}"></i>`;
    } else if (shortcut.iconType === 'favicon') {
        iconHtml = `<img src="${shortcut.icon}" alt="${shortcut.name}" style="width: 20px; height: 20px; object-fit: contain;">`;
    } else {
        iconHtml = shortcut.icon;
    }
    
    linkCard.innerHTML = `
        <div class="link-icon" style="background: ${getThemeColor(shortcut.name, 0.7)};">
            ${iconHtml}
        </div>
        <span>${shortcut.name}</span>
        <div class="shortcut-actions">
            <button class="edit-shortcut" title="编辑" onclick="event.preventDefault(); editShortcut('${shortcut.id}')">
                <i class="fas fa-edit"></i>
            </button>
            <button class="delete-shortcut" title="删除" onclick="event.preventDefault(); deleteShortcut('${shortcut.id}')">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    
    return linkCard;
}

// 创建添加快捷网站按钮
function createAddShortcutButton() {
    const addButton = document.createElement('div');
    addButton.className = 'link-card add-shortcut-btn';
    addButton.innerHTML = `
        <div class="link-icon" style="background: var(--accent-color); opacity: 0.7;">
            <i class="fas fa-plus"></i>
        </div>
        <span>添加网站</span>
    `;
    
    addButton.addEventListener('click', () => addNewShortcut());
    
    return addButton;
}

// 获取主题色（降低饱和度和亮度）
function getThemeColor(siteName, opacity = 0.4) {
    const colors = {
        'Google': '#db4437',
        '百度': '#2932e1',
        'GitHub': '#24292e',
        'YouTube': '#ff0000',
        '哔哩哔哩': '#00a1d6',
        '知乎': '#0084ff',
        '淘宝': '#ff6900',
        '京东': '#e1251b'
    };
    
    const baseColor = colors[siteName] || '#6366f1';
    
    // 将颜色转换为更柔和的版本
    const softenedColor = softenColor(baseColor);
    return hexToRgba(softenedColor, opacity);
}

// 柔化颜色（降低饱和度，提高亮度）
function softenColor(hexColor) {
    const rgb = newTabUtils.hexToRgb(hexColor);
    if (!rgb) return hexColor;
    
    // 将RGB转换为HSL（需要定义本地函数，因为utils.js中没有此函数）
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    
    // 降低饱和度（减少50%）
    hsl.s = Math.max(0, hsl.s * 0.5);
    
    // 提高亮度（增加30%，但不超过90%）
    hsl.l = Math.min(90, hsl.l + 30);
    
    // 转换回RGB
    const newRgb = hslToRgb(hsl.h, hsl.s, hsl.l);
    
    // 转换回十六进制
    return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
}

// RGB转HSL
function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    
    if (max === min) {
        h = s = 0; // 无色
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    
    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
    };
}

// HSL转RGB
function hslToRgb(h, s, l) {
    h /= 360;
    s /= 100;
    l /= 100;
    
    let r, g, b;
    
    if (s === 0) {
        r = g = b = l; // 灰色
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };
        
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }
    
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}

// RGB转十六进制
function rgbToHex(r, g, b) {
    const toHex = (n) => {
        const hex = n.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// 使用utils.js中的hexToRgb函数

// 十六进制颜色转RGBA
function hexToRgba(hex, alpha) {
    const rgb = newTabUtils.hexToRgb(hex);
    if (!rgb) return `rgba(99, 102, 241, ${alpha})`; // 备选颜色
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
}

// 尝试获取网站favicon（优先使用ICO图标）
async function getFaviconUrl(url) {
    try {
        const domain = new URL(url).hostname;
        
        // 优先尝试获取ICO图标，然后是其他格式
        const faviconPaths = [
            // 第一优先级：网站根目录的ICO文件
            `https://${domain}/favicon.ico`,
            `https://www.${domain}/favicon.ico`,
            
            // 第二优先级：常见的图标路径
            `https://${domain}/assets/favicon.ico`,
            `https://${domain}/static/favicon.ico`,
            `https://${domain}/public/favicon.ico`,
            `https://${domain}/images/favicon.ico`,
            
            // 第三优先级：其他格式
            `https://${domain}/favicon.png`,
            `https://${domain}/apple-touch-icon.png`,
            
            // 第四优先级：可靠的第三方服务（优先使用必应类似的服务）
            `https://api.faviconkit.com/${domain}/32`,
            `https://icons.duckduckgo.com/ip3/${domain}.ico`,
            `https://www.google.com/s2/favicons?domain=${domain}&sz=32`
        ];
        
        for (const faviconUrl of faviconPaths) {
            if (!faviconUrl) continue;
            
            try {
                const isValid = await validateFavicon(faviconUrl);
                if (isValid) {
                    return faviconUrl;
                }
            } catch (e) {
                continue;
            }
        }
        
        // 尝试从网页抓取图标
        const webpageIcon = await getIconFromWebpage(url);
        if (webpageIcon) {
            try {
                const isValid = await validateFavicon(webpageIcon);
                if (isValid) {
                    return webpageIcon;
                }
            } catch (e) {
                // 继续执行备选方案
            }
        }
        
        // 最后的备选方案：使用DuckDuckGo的图标服务
        return `https://icons.duckduckgo.com/ip3/${domain}.ico`;
    } catch (e) {
        return null;
    }
}

// 验证favicon是否有效
async function validateFavicon(url) {
    return new Promise((resolve) => {
        const img = new Image();
        
        // 设置超时
        const timeout = setTimeout(() => {
            resolve(false);
        }, 3000);
        
        img.onload = () => {
            clearTimeout(timeout);
            // 检查图片尺寸，排除1x1的透明图片
            resolve(img.width > 1 && img.height > 1);
        };
        
        img.onerror = () => {
            clearTimeout(timeout);
            resolve(false);
        };
        
        img.src = url;
    });
}

// 从网页中获取图标链接
async function getIconFromWebpage(url) {
    try {
        // 由于CORS限制，这里使用一个代理服务来获取网页内容
        // 实际项目中可能需要后端支持
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
        const response = await fetch(proxyUrl);
        const data = await response.json();
        
        if (data.contents) {
            // 解析HTML，查找图标链接
            const parser = new DOMParser();
            const doc = parser.parseFromString(data.contents, 'text/html');
            
            // 按优先级查找图标
            const iconSelectors = [
                'link[rel="icon"][href$=".ico"]',
                'link[rel="shortcut icon"][href$=".ico"]',
                'link[rel="icon"]',
                'link[rel="shortcut icon"]',
                'link[rel="apple-touch-icon"]'
            ];
            
            for (const selector of iconSelectors) {
                const iconLink = doc.querySelector(selector);
                if (iconLink) {
                    let href = iconLink.getAttribute('href');
                    if (href) {
                        // 处理相对URL
                        if (href.startsWith('//')) {
                            href = `https:${href}`;
                        } else if (href.startsWith('/')) {
                            const urlObj = new URL(url);
                            href = `${urlObj.origin}${href}`;
                        } else if (!href.startsWith('http')) {
                            const urlObj = new URL(url);
                            href = `${urlObj.origin}/${href}`;
                        }
                        return href;
                    }
                }
            }
        }
    } catch (e) {
        console.log('从网页获取图标失败:', e);
    }
    
    return null;
}

// 添加新的快捷网站
async function addNewShortcut() {
    const name = prompt('请输入网站名称：');
    if (!name) return;
    
    const url = prompt('请输入网站地址：', 'https://');
    if (!url || !newTabUtils.isValidURL(url)) {
        showMessage('请输入有效的网站地址', 'error');
        return;
    }
    
    const shortcuts = getUserShortcuts();
    const id = 'shortcut_' + newTabUtils.generateUniqueId();
    
    // 尝试获取favicon
    const faviconUrl = await getFaviconUrl(url);
    
    const newShortcut = {
        id: id,
        name: name,
        url: url,
        icon: faviconUrl || 'fas fa-globe',
        iconType: faviconUrl ? 'favicon' : 'fontawesome'
    };
    
    shortcuts.push(newShortcut);
    saveUserShortcuts(shortcuts);
    renderShortcuts();
    
    showMessage(`已添加快捷网站：${name}`, 'success');
}

// 编辑快捷网站
async function editShortcut(id) {
    const shortcuts = getUserShortcuts();
    const shortcut = shortcuts.find(s => s.id === id);
    
    if (!shortcut) return;
    
    const newName = prompt('请输入网站名称：', shortcut.name);
    if (!newName) return;
    
    const newUrl = prompt('请输入网站地址：', shortcut.url);
    if (!newUrl || !newTabUtils.isValidURL(newUrl)) {
        showMessage('请输入有效的网站地址', 'error');
        return;
    }
    
    // 如果URL改变了，重新获取favicon
    if (newUrl !== shortcut.url) {
        const faviconUrl = await getFaviconUrl(newUrl);
        shortcut.icon = faviconUrl || 'fas fa-globe';
        shortcut.iconType = faviconUrl ? 'favicon' : 'fontawesome';
    }
    
    shortcut.name = newName;
    shortcut.url = newUrl;
    
    saveUserShortcuts(shortcuts);
    renderShortcuts();
    
    showMessage(`已更新快捷网站：${newName}`, 'success');
}

// 删除快捷网站
function deleteShortcut(id) {
    const shortcuts = getUserShortcuts();
    const shortcut = shortcuts.find(s => s.id === id);
    
    if (!shortcut) return;
    
    if (confirm(`确定要删除快捷网站"${shortcut.name}"吗？`)) {
        const updatedShortcuts = shortcuts.filter(s => s.id !== id);
        saveUserShortcuts(updatedShortcuts);
        renderShortcuts();
        
        showMessage(`已删除快捷网站：${shortcut.name}`, 'success');
    }
}

// 添加快捷网站管理按钮到设置页面 - 已移除
function addShortcutsManagementButtons() {
    // 此功能已被移除
}

// 重置快捷网站为默认 - 已移除
function resetShortcuts() {
    // 此功能已被移除
}

// 导出快捷网站配置 - 已移除
function exportShortcuts() {
    // 此功能已被移除
}

// 导入快捷网站配置 - 已移除
function importShortcuts(e) {
    // 此功能已被移除
}

// 使用utils.js中的URL验证函数和唯一ID生成函数

// 导出快捷网站管理功能
if (typeof window !== 'undefined') {
    window.shortcutsManager = {
        initializeShortcuts,
        renderShortcuts,
        addNewShortcut,
        editShortcut,
        deleteShortcut,
        resetShortcuts,
        exportShortcuts,
        importShortcuts,
        getUserShortcuts,
        saveUserShortcuts
    };
    
    // 将函数暴露到全局作用域以供HTML内联事件使用
    window.editShortcut = editShortcut;
    window.deleteShortcut = deleteShortcut;
}
