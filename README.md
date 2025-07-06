# Phoenix 浏览器主页

一个简约、现代的浏览器主页，以搜索功能为核心。

## 功能特点

- 简洁美观的界面设计
- 实时数字时钟显示
- 支持多搜索引擎（谷歌、必应、百度）切换
- 响应式设计，适配各种设备
- 高斯模糊背景效果（动态切换）
- 增强的点击动效反馈
- 搜索引擎偏好保存（本地存储）

## 使用方法

1. 克隆或下载本项目到本地
2. 在浏览器中打开`index.html`文件
3. 可以设置为浏览器的主页或新标签页

## 用户交互特性

- 点击搜索框时，背景自动模糊，增强视觉焦点
- 点击页面其他区域时，背景取消模糊
- 搜索引擎选择会被保存，下次打开页面时自动应用

## 技术说明

- 使用传统的JavaScript脚本引入方式，确保兼容性
- 代码组织良好，便于维护和扩展
- 使用CSS模块化结构

## 项目结构

```
phoenix/
  - index.html             // 主页面HTML结构
  - css/                   // 样式文件目录
    - main.css             // 主样式文件（导入其他CSS）
    - base.css             // 基础样式
    - components.css       // 组件样式
  - js/                    // JavaScript文件目录
    - main.js              // 主脚本文件
    - clock.js             // 时钟功能
    - search.js            // 搜索功能
    - ui.js                // UI交互效果
  - pic_background/        // 背景图片目录
    - background.png
  - search_engine_icon/    // 搜索引擎图标目录
    - baidu_icon_130983.png
    - bing_icon-icons.com_62711.png
    - google_icon-icons.com_62736.png
  - 项目描述.md            // 项目需求说明
  - README.md              // 项目说明
``` 