# 袁磊个人作品集网站

React + TypeScript + Vite 实现的个人作品集网站，适合发布到 GitHub Pages。

## 本地运行

```bash
pnpm install
pnpm dev
```

打开浏览器访问：

```text
http://localhost:5173/
```

## 构建

```bash
pnpm build
```

构建后的静态文件在 `dist/`。

## 发布到 GitHub Pages

1. 在 GitHub 新建一个仓库，例如 `yuanlei-portfolio`。
2. 把本项目所有文件上传到仓库根目录。
3. 在仓库页面进入 `Settings -> Pages`。
4. `Source` 选择 `GitHub Actions`。
5. 推送代码后，GitHub 会自动执行 `.github/workflows/deploy.yml` 并发布网站。

## 技术栈

- React
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Three.js
- Lucide React
