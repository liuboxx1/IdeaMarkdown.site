# IdeaMarkdown 官网

IdeaMarkdown 宣传站点 —— 一款 AI 时代的 Markdown 编辑器，随时随地利用 AI 记录你的创意想法。

本仓库是使用原生 HTML / CSS / JavaScript 构建的静态网站，无需构建工具，可直接部署到任意静态托管服务。

## 页面结构

| 页面 | 说明 |
| --- | --- |
| [`index.html`](index.html) | 首页：产品介绍、核心功能、AI 控制（MCP + CLI）示例 |
| [`docs.html`](docs.html) | 文档：安装、编辑器功能、主题导出、MCP/CLI 用法 |
| [`download.html`](download.html) | 下载：Windows 安装程序（`.exe`）获取入口 |

## 目录说明

```
.
├── assets/
│   ├── css/
│   │   └── styles.css      # 全站样式（含明暗双主题）
│   ├── js/
│   │   ├── config.js       # 站点常量：下载地址与版本号
│   │   └── site.js         # 交互脚本：主题切换、导航、动画、复制、Tab 等
│   ├── favicon-32.png
│   └── icon.png
├── index.html
├── docs.html
└── download.html
```

## 本地预览

本项目为纯静态站点，任选一种方式在本地启动：

```powershell
# 方式一：Python 内置服务器
python -m http.server 8080

# 方式二：Node（需安装 serve）
npx serve .
```

启动后在浏览器访问 `http://localhost:8080` 即可预览。也可以直接用浏览器打开 `index.html`。

## 配置

下载地址与版本号集中在 [`assets/js/config.js`](assets/js/config.js) 中维护：

- `DOWNLOAD_URL`：安装包 `.exe` 的直链。留空时，全站下载按钮显示为“敬请期待”并禁用点击；填入后自动生效。
- `APP_VERSION`：当前发布版本号，页面中所有版本号占位符会自动同步。

## 技术特点

- 纯静态，零依赖、零构建，开箱即部署
- 明暗双主题，跟随系统偏好并支持手动切换（本地存储持久化）
- 响应式布局，适配桌面与移动端
- 滚动揭示动画、代码一键复制、文档目录滚动高亮等交互增强

## 许可证

版权所有 © 2026 IdeaMarkdown。
