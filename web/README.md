# Hello Games

这是 Hello Games 的静态演示站点模板，包含响应式布局、浅色/深色主题切换与简单的交互逻辑。

文件结构

- `index.html` - 主页面
- `styles.css` - 样式
- `script.js` - 简单交互（导航/主题切换）
- `server.py` - 本地开发用的 Python 静态服务器（默认 8000 端口）

快速开始

1. 在浏览器中直接打开 `index.html`：

```bash
open website/index.html
```

2. 使用 Python 本地服务器（推荐，避免跨域问题并可用作简单静态托管测试）：

```bash
cd website
python3 server.py
```

然后浏览器会自动打开 `http://localhost:8000/`（如未自动打开，请手动访问）。

后续改进建议

- 替换示例文本与邮箱为你的真实信息
- 添加部署脚本（GitHub Pages、Netlify、Vercel 等）
- 如需表单持久化，可接入后端（Express / Flask /云函数）或第三方表单服务
- 添加 SEO 元信息、favicon、图片与社交分享卡片

游戏资讯功能

- 我在页面中加入了一个“游戏资讯”区块（`#news`），客户端会从 `website/data/news.json` 加载示例文章并在页面中渲染。
- 支持客户端关键字搜索（标题/摘要/标签），并可点击“阅读全文”在模态窗口中查看文章内容。
- 这是一个静态实现，适合先做原型；如需可扩展为后台（保存文章、管理员发布）或接入 CMS（如 Netlify CMS、Ghost、Strapi 等）。

如何添加文章

1. 编辑 `website/data/news.json`，以数组形式添加或修改文章对象（示例已包含 3 篇文章）。
2. 每个文章对象建议包含字段：`id`、`title`、`date`、`source`、`tags`（数组）、`excerpt`、`content`（HTML 字符串）。

如果你想，我可以：
- 把新闻数据改为从远程 API 获取并实现分页；
- 添加一个简单的后台（Flask / Express）用于发布与编辑文章；
- 帮你部署到 Vercel/Netlify 并配置自动从 GitHub 获取文章更新。

已加入的游戏专题示例

- 我已为网站添加了关于《GTA6》的示例文章（预告与配置指南）到 `website/data/news.json`，你可以在新闻列表中看到对应条目并点击查看详情。
- 此外我又补充了多篇热门游戏示例文章（共新增 5 篇），包括：
	- GTA6 公测报名指南（如何参与 Beta / 提高被选中概率）
	- Elden Ring 首个大型 DLC 公告（“时代之裂”）
	- Fortnite 新赛季联动与玩法介绍
	- Valorant 本周补丁（地图与英雄平衡）
	- Cyberpunk 2077 性能优化与剧情扩展补丁说明
 
这些示例都已写入 `website/data/news.json`，页面会自动加载并在“游戏资讯”区块显示；你可以通过搜索框按标题或标签过滤查看。

下一步示例

- 若希望专门为 GTA6 建立专题页（集合攻略、视频、补丁资讯），我可以新增一个独立子页 `gta6.html` 并把相关文章聚合在页面顶部，同时支持按标签筛选与视频嵌入。


已创建的专题页示例

- 我已为以下游戏创建了专题页（示例，包含图片占位与视频嵌入）：
	- `gta6.html`（GTA6 专题）
	- `eldenring.html`（Elden Ring 专题）
	- `cyberpunk.html`（Cyberpunk 2077 专题）

这些页面会自动从 `website/data/news.json` 加载相关文章并显示「阅读全文」模态窗口；你可以替换 `assets/` 目录下的占位图片与 iframe 链接为实际视频或截图。

多页结构说明

- 我已将站点改为多页面结构：`index.html`（首页）、`news.html`（资讯列表）、`gta6.html` / `eldenring.html` / `cyberpunk.html`（专题页）、`about.html`、`projects.html`、`contact.html`。这样每个主要区域都有独立页面，利于 SEO 与单独分享。
- 页面间导航已更新为指向独立页面（导航栏的链接已更改）。

如何本地调试

1. 启动本地服务器并打开首页：

```bash
cd website
python3 server.py
```

2. 在浏览器打开：

```
http://localhost:8000/
```

备注：专题页与新闻页会自动加载 `data/news.json` 中的数据。
