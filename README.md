# 浏览器新标签页

一个现代化的浏览器新标签页，具备实时时间显示和多搜索引擎支持功能。

## 功能特性

### 🕒 实时时间显示
- 显示当前时间（时:分:秒）
- 显示当前日期和星期
- 每秒自动更新

### 🔍 多搜索引擎支持
- **百度搜索** - 默认搜索引擎
- **谷歌搜索** - 国际搜索引擎
- **必应搜索** - 微软搜索引擎

### 🎨 现代化界面
- 毛玻璃效果（Glassmorphism）设计
- 响应式布局，支持移动设备
- 平滑动画和过渡效果
- 自定义背景图片支持

### ⚡ 快捷操作
- **回车键** - 执行搜索
- **Ctrl/Cmd + K** - 快速聚焦搜索框
- **数字键 1-3** - 快速切换搜索引擎（1=百度，2=谷歌，3=必应）
- **ESC键** - 清空搜索框并失去焦点

### 💾 用户偏好
- 自动记住用户选择的搜索引擎
- 使用本地存储保存设置

## 文件结构

```
phoenix2/
├── index.html          # 主页面文件
├── styles.css          # 样式文件
├── script.js           # JavaScript功能文件
├── background.png      # 背景图片
├── web_icon.png        # 网站图标
└── README.md          # 说明文档
```

## 使用方法

### 本地运行
1. 在项目目录下启动HTTP服务器：
   ```bash
   python -m http.server 8000
   ```

2. 在浏览器中访问：
   ```
   http://localhost:8000
   ```

### 设置为浏览器新标签页
1. 将项目文件部署到Web服务器
2. 在浏览器设置中将新标签页URL设置为部署地址
3. 或者使用浏览器扩展来自定义新标签页

## 自定义配置

### 更换背景图片
替换根目录下的 `background.png` 文件即可。

### 更换网站图标
替换根目录下的 `web_icon.png` 文件即可。

### 添加新的搜索引擎
在 `script.js` 文件中的 `searchEngines` 对象中添加新的搜索引擎配置：

```javascript
const searchEngines = {
    // 现有搜索引擎...
    newEngine: {
        name: '新搜索引擎',
        url: 'https://example.com/search?q='
    }
};
```

### 修改快捷链接
在 `index.html` 文件中的 `.shortcuts-section` 部分修改快捷链接。

## 浏览器兼容性

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 技术栈

- **HTML5** - 页面结构
- **CSS3** - 样式和动画（使用现代CSS特性如backdrop-filter）
- **Vanilla JavaScript** - 功能实现
- **本地存储** - 用户偏好保存

## 许可证

MIT License
