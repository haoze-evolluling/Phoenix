
# Phoenix 导航页

一个简约、高效且富有美感的浏览器起始页。

## ✨ 特性

- **极简设计**：无干扰的界面，让您专注于搜索。
- **实时时间**：在页面顶部清晰展示当前日期和时间。
- **多引擎切换**：支持 Google、百度、必应、神马等多个搜索引擎，并能记住您的选择。
- **流畅动画**：优雅的加载动画和交互反馈，提升用户体验。
- **响应式布局**：完美适配 PC、平板和手机等不同尺寸的设备。
- **快捷键支持**：通过键盘快捷键快速切换搜索引擎和清空输入框。
- **轻量高效**：代码简洁，加载迅速。

## 🚀 如何使用

1.  **下载或克隆项目**：
    ```bash
    git clone https://github.com/your-username/phoenix.git
    ```
2.  **在浏览器中打开**：
    - 直接用浏览器打开 `index.html` 文件。
    - **推荐**：将此页面设置为您的浏览器主页或新标签页。

## ⌨️ 快捷键

- `Alt + 1`：切换到 Google
- `Alt + 2`：切换到 百度
- `Alt + 3`：切换到 必应
- `Alt + 4`：切换到 神马
- `Esc`：清空搜索框

## 🛠️ 技术栈

- **HTML5**
- **CSS3**：
    - Flexbox 布局
    - CSS 动画 (`@keyframes`)
    - CSS 变量 (`--var`)
    - 响应式设计 (`@media`)
- **JavaScript (ES6+)**：
    - DOM 操作
    - `localStorage` 本地存储
    - `Date` 对象

## 📂 文件结构

```
Phoenix/
├── css/                # 样式文件
│   ├── style.css       # 主要样式
│   └── animation.css   # 动画效果
├── js/                 # 脚本文件
│   ├── main.js         # 核心功能逻辑
│   └── animation.js    # 动画与交互效果
├── index.html          # 主页面
├── background.png      # 背景图片
├── icon.png            # 网站图标
└── README.md           # 项目说明
```

## 💡 设计思路

关于此项目的详细设计理念、UI/UX 决策和技术实现，请参考 [design.md](design.md) 文件。
