# Phoenix 项目

## 1. 项目简介
Phoenix是一个现代化的前端导航页面网站，使用纯HTML、CSS和JavaScript开发，无需后端支持。该项目提供了一个高度可定制化的个性化导航页面，可作为浏览器主页使用。


## 2. 核心功能
- **个性化导航**：允许用户创建和管理自己的网站书签，按分类组织
- **搜索功能**：整合了多个搜索引擎（百度、Google、必应、神马搜索），用户可以快速切换
- **极简模式**：提供一个带有数字时钟和日期显示的简约模式界面

## 3. 个性化设置
- **主题切换**：支持明亮/暗黑/自动主题模式
- **强调色**：可自定义界面主色调
- **卡片样式**：提供多种卡片样式选择（默认、圆角、扁平、边框）
- **动画效果**：可开启/关闭界面动画
- **布局选择**：支持网格和列表两种布局方式
- **磁贴数量**：可自定义每行显示的书签磁贴数量（2-5个）
- **背景设置**：支持默认背景、纯色背景和必应壁纸

## 4. 用户体验优化
- **点击动画**：页面元素点击时有水波纹动画效果
- **模态框**：使用模态框进行设置和添加新内容
- **键盘快捷键**：支持多种快捷键操作
  - Alt+S：添加新分类
  - Alt+P：打开个性化设置
  - Alt+/：聚焦搜索框
  - Alt+D：切换深色模式
  - Alt+M：切换简约模式
  - Esc：关闭当前模态框

## 5. 数据存储
- 使用浏览器的localStorage存储用户设置和书签数据
- 支持设置的导入/导出功能

## 6. 大福将至


## 7. 项目架构
项目采用模块化设计，主要模块包括：
- **app.js**：主应用入口，负责初始化和协调各个模块
- **themeManager.js**：管理主题切换和相关样式
- **search.js**：实现多搜索引擎切换和搜索功能
- **ui.js**：处理界面交互和动态元素生成
- **preferences.js**：处理个性化设置功能
- **simple-mode.js**：实现简约模式功能
- **storage.js**：处理本地数据存储
- **bing-wallpaper.js**：提供必应每日壁纸功能

## 8. 目录结构
```
Phoenix/
├── css/            # 样式文件
│   ├── animations.css     # 动画样式
│   ├── click-animation.css # 点击动画效果
│   ├── darkmode.css       # 深色主题
│   ├── lightmode.css      # 浅色主题
│   ├── preferences.css    # 偏好设置样式
│   ├── simple-mode.css    # 简约模式样式
│   ├── style.css          # 基础样式
│   └── bing-wallpaper.css # 必应壁纸样式
├── js/             # JavaScript文件
│   ├── animations.js       # 动画逻辑
│   ├── app.js             # 主应用入口
│   ├── bing-wallpaper.js  # 必应壁纸功能
│   ├── preferences.js     # 偏好设置功能
│   ├── preferences-utils.js # 偏好设置工具函数
│   ├── ripple-effect.js   # 水波纹效果
│   ├── search.js          # 搜索功能
│   ├── simple-mode.js     # 简约模式功能
│   ├── storage.js         # 本地存储功能
│   ├── themeManager.js    # 主题管理
│   └── ui.js              # 界面交互
├── pic/            # 图片资源
└── index.html      # 主页面
```

## 9. 自定义指南
### 修改主题
1. 在个性化设置中选择明亮/暗黑/自动主题
2. 使用颜色选择器修改强调色

### 添加自定义分类和书签
1. 点击设置按钮添加新分类
2. 在分类中添加网站书签


## 11. 项目特点
- 完全前端实现，无需服务器部署
- 高度可定制化的用户界面
- 现代化的响应式设计
- 深浅色主题自适应系统设置
- 美观易用的界面

## 触摸设备优化

Phoenix导航现已添加针对不同触摸设备的优化支持：

### 触摸优化特性

- **Android设备优化**：针对Android设备的触摸延迟和滚动性能优化
- **iOS设备优化**：修复iOS特有的双击缩放和橡皮筋效果问题
- **iPad设备优化**：支持分屏模式和Apple Pencil交互
- **通用触摸优化**：提升所有触摸设备的交互体验

### 触摸优化文件

- `js/android-touch.js` - Android设备触摸优化
- `js/ios-touch.js` - iPhone设备触摸优化
- `js/ipad-touch.js` - iPad设备触摸优化
- `js/touch-manager.js` - 触摸优化管理器

### iOS设备UI适配

新增了专门针对iOS设备的UI适配：

- `css/ios-devices.css` - iPhone和iPad专用样式表
- 自动检测设备类型和方向，应用相应样式
- 针对不同尺寸的iPhone和iPad进行优化
- 支持横屏/竖屏自适应布局
- 针对iPad分屏模式进行优化
- 支持Apple Pencil交互的特殊样式

这些优化可以显著提升移动设备上的用户体验，包括更快的响应速度、更好的滚动性能和更精确的触摸目标。
