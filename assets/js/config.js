// 站点常量与下载配置
// -----------------------------------------------------------------------------
// IdeaMarkdown 通过 Windows 安装程序（.exe）对外分发；MCP 服务器随安装包附带。
// 拿到安装包下载地址后，只需把下面的 DOWNLOAD_URL 改成 .exe 的直链，
// 全站下载按钮会自动生效（无需改动其它文件）。
// 例如： const DOWNLOAD_URL = "https://dl.example.com/IdeaMarkdown-0.1.4-setup.exe";
const DOWNLOAD_URL = "https://github.com/liuboxx1/IdeaMarkdown.site/releases/download/v0.1.7/IdeaMarkdown_0.1.7_x64-setup.exe";

// 当前发布版本号（与安装包保持一致）。
const APP_VERSION = "0.1.7";

const SITE_CONFIG = {
  version: APP_VERSION,
  downloadUrl: DOWNLOAD_URL,
  hasDownload: Boolean(DOWNLOAD_URL),
};

// 暴露给 site.js 使用。
window.SITE_CONFIG = SITE_CONFIG;
