# Phoenix 项目

## 1. 项目简介
Phoenix 是一个现代化的前端静态网站，主要功能是[请描述你的网站主要功能]。该项目采用纯前端技术实现，包含丰富的动画效果和主题切换功能。

## 2. 安装步骤
1. 克隆仓库：
```bash
git clone [仓库地址]
```
2. 进入项目目录：
```bash
cd Phoenix
```
3. 使用浏览器打开index.html文件即可运行。

## 3. 功能说明
- **动画效果**：包含点击动画、页面过渡动画等
- **主题切换**：支持深色/浅色模式切换
- **简洁模式**：可切换至简化版界面

## 4. 目录结构
```
Phoenix/
├── css/            # 样式文件
│   ├── animations.css  # 动画样式
│   ├── darkmode.css    # 深色主题
│   ├── lightmode.css   # 浅色主题
│   └── style.css       # 基础样式
├── js/             # JavaScript文件
│   ├── animations.js   # 动画逻辑
│   ├── themeManager.js # 主题管理
│   └── ui.js           # 界面交互
├── images/         # 图片资源
└── index.html      # 主页面
```

## 5. 自定义指南
### 修改主题
1. 编辑`css/lightmode.css`或`css/darkmode.css`文件
2. 修改颜色变量：
```css
:root {
  --primary-color: #yourcolor;
}
```

### 添加动画
1. 在`css/animations.css`中添加新动画样式
2. 在`js/animations.js`中注册新动画

## 6. 许可证
[请选择并添加许可证信息]