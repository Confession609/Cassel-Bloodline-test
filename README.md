# 龙族血统与言灵测试平台

一个以卡塞尔档案风格呈现的单页测试网站，包含个人感受、龙文共鸣、隐藏分支、言灵档案与管理员专用云端档案库。

## 当前功能

- 首页档案信息校验与测试入口
- 个人感受题、07 符文记忆、08 声音符号、09 灵视补全、10 绩效复核
- 隐藏分支检测过渡与五道附加题
- 基于血统评级限制的言灵匹配
- Cloudflare D1 云端档案保存、同名同生日更新与管理员删除
- 言灵库及黑天鹅港动画补充条目

## 本地运行

```bash
npm run dev
```

生产构建：

```bash
npm run build
```

## 项目结构

- `app/assessment.tsx`：测试流程、评分、隐藏分支、档案库
- `app/globals.css`：页面视觉与交互动效
- `lib/spells.ts`：言灵库和匹配规则
- `public/`：符文、音频选项、徽记与记忆题图片
- `测试题.docx`：与网页规则同步的管理员核验题库

## 云端档案库

档案由答题完成后匿名提交到 `/api/archive`，答题人不需要登录，也不能读取档案列表。管理员从页面右上角进入档案库，密码由服务端验证后通过短期 HttpOnly 会话读取和删除档案。

首次部署到 Cloudflare 时需要完成以下配置：

1. 创建一个 Cloudflare D1 数据库，并把绑定名设置为 `DB`。
2. 将 `migrations/0001_create_archive_records.sql` 应用到该数据库。
3. 在 Worker/Pages 的服务端密钥中配置 `ARCHIVE_ADMIN_PASSWORD` 和随机的 `ARCHIVE_SESSION_SECRET`。
4. 本地预览可复制 `.dev.vars.example` 为 `.dev.vars` 并填写密钥；`.dev.vars` 已被 Git 忽略。

当前项目已经包含 D1 绑定、迁移、匿名写入、管理员会话、管理员读取和删除接口；真正连接到哪个 Cloudflare 账户及远程数据库，需要在部署平台中完成账号授权和数据库绑定。
