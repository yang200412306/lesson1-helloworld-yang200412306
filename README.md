# 练习一：HelloWorld 网站（Node.js）

零依赖项目：不需要 `npm install`，装好 Node.js 就能跑。本地跑通 + 推 GitHub + 放到服务器公网可访问，全程约 15 分钟。

![界面预览](界面预览.png)

## 一、项目结构

```
helloworld/
├── server.js        启动入口（node server.js）
├── handler.js       页面与所有请求处理逻辑（改名就在这里改）
├── package.json     项目信息与启动命令
├── 界面预览.png      页面效果图
└── README.md        本说明
```

整个项目只有两个源文件，任何能装 Node.js 的机器都能跑：自己的电脑、云服务器、树莓派、甚至同学的电脑。

## 二、本地跑起来

在项目文件夹里打开终端（PowerShell 或 CMD 均可）：

```bash
node -v           # 先确认有 Node.js，没有输出版本就先去 nodejs.org 装 LTS
node server.js    # 启动服务
```

看到 `✅ HelloWorld 已启动` 后，浏览器打开 <http://localhost:3000>。
页面应显示：`Hello World！` + `我是【你的名字】，我的第一个 AI 开发的网站` + 服务器当前时间。

- 健康检查：<http://localhost:3000/health> 返回一行 `OK ...时间`
- 停止服务：终端里按 `Ctrl + C`
- 换端口（3000 被占用时）：`$env:PORT=3001; node server.js`（PowerShell）

## 三、改名字（验收要求写自己的名字）

打开 `handler.js`，第 7 行：

```js
const SITE_OWNER = process.env.SITE_OWNER || '【你的名字】';
```

把 `【你的名字】` 换成真实姓名，保存后重启服务，刷新页面即可。
也可以不改文件，用环境变量传：`$env:SITE_OWNER="张三"; node server.js`。

## 四、推送到 GitHub

1. 登录 GitHub → 右上角 `+` → **New repository** → 仓库名 `helloworld-你的拼音` → 选 **Public** → **不要**勾选 Add a README（本地已有 README，勾了会冲突）→ Create repository。
2. 在项目文件夹里依次执行（把地址换成你自己的仓库地址）：

```bash
git init
git add .
git commit -m "练习一：HelloWorld 网站首次提交"
git branch -M main
git remote add origin https://github.com/你的用户名/helloworld-你的拼音.git
git push -u origin main
```

首次 push 会弹出 GitHub 登录授权，浏览器登录同意即可。若提示 `remote origin already exists`，先执行 `git remote set-url origin 新地址`。

✅ **检查**：刷新 GitHub 仓库页面，能看到 `server.js`、`handler.js`、`README.md`。

## 五、让别处也能打开（三条路，任选一条）

| 方式 | 适合场景 | 成本 | 公网地址长什么样 |
| --- | --- | --- | --- |
| **A. 云服务器 + pm2**（推荐） | 课程要交公网网址、追求稳定 | 轻量服务器约 24–60 元/月 | `http://服务器IP:3000` 或 `http://你的域名` |
| B. 免费 Node 托管平台（Render / Railway / Zeabur） | 不想买服务器，接受平台限制 | 免费额度 | `https://xxx.onrender.com` |
| C. 内网穿透（cpolar / ngrok / 花生壳） | 临时演示，本机开机就能给老师看 | 免费版够用 | `https://随机子域名.xxx.com` |

### A. 云服务器（以 Ubuntu 为例）

1. 买一台轻量应用服务器（1 核 1G 就够），系统选 **Ubuntu 22.04/24.04**；在控制台**安全组/防火墙**里放行 `3000` 端口（后面用 80 端口就不必放行 3000）。
2. SSH 登录服务器，装 Node.js：

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
node -v        # 出现 v22.x 即成功
```

3. 把代码传上去（二选一）：

```bash
# 方式一：从 GitHub 拉（先在服务器装 git：sudo apt install -y git）
git clone https://github.com/你的用户名/helloworld-你的拼音.git
cd helloworld-你的拼音

# 方式二：在自己电脑上直接传（PowerShell 执行）
# scp -r .\helloworld root@服务器IP:/root/
```

4. 先手动试跑，确认能起来：

```bash
node server.js
# 另开一个 SSH 窗口：curl http://localhost:3000
```

5. 用 pm2 让它后台常驻（关掉 SSH 也不会停）：

```bash
sudo npm install -g pm2
pm2 start server.js --name helloworld
pm2 save
pm2 startup        # 按提示复制它给出的那行 sudo 命令执行一次，实现开机自启
```

6. 浏览器访问 `http://服务器公网IP:3000`，能看到你的名字和时间就成功了。

> 想用域名（比如练习三申请的域名）：在域名控制台加一条 **A 记录**指向服务器 IP，等 10 分钟左右生效，就能用 `http://你的域名:3000` 打开。
> 想甩掉 `:3000` 端口号，装 nginx 反代 80 端口：`sudo apt install -y nginx`，把 `/etc/nginx/sites-available/default` 的 `location /` 改成
> `proxy_pass http://127.0.0.1:3000;` 然后 `sudo nginx -t && sudo systemctl reload nginx`。

### B. 免费托管平台

1. 注册 Render（render.com）或 Railway、Zeabur，用 GitHub 登录。
2. 新建 Web Service → 选你的 `helloworld-xxx` 仓库。
3. 启动命令填 `node server.js`（Build Command 留空），端口平台会自动注入 `PORT`。
4. 部署完给出 `https://xxx.onrender.com` 网址。免费实例长时间没人访问会休眠，第一次打开要等十几秒。

### C. 内网穿透（最快出效果）

```powershell
# 以 cpolar 为例：官网下载 Windows 版并注册，然后
cpolar http 3000
```

终端会打印一个 `https://xxxx.cpolar.top` 的地址，发给老师/同学即可访问你本机的服务。缺点是你电脑必须开着、这个地址每次重启会变（免费版）。

## 六、常见问题（可直接把报错贴回 AI）

| 现象 | 原因 | 处理 |
| --- | --- | --- |
| `node` 不是内部或外部命令 | 没装 Node.js 或没进 PATH | 装 Node.js LTS 后重开终端 |
| `Error: listen EADDRINUSE` | 3000 端口被占用 | 换端口：`$env:PORT=3001; node server.js` |
| 服务器上 `curl localhost:3000` 通，外面打不开 | 安全组/防火墙没放行端口 | 云控制台放行 3000（或改用 nginx 走 80） |
| 关掉 SSH 后网站打不开 | 进程跟着会话退出了 | 用 pm2 启动并 `pm2 save` |
| 上传后启动报 `Cannot find module` | 只传了部分文件，或在错的目录执行 | 确认目录里有 `server.js` 和 `handler.js`，再执行 `node server.js` |
| push 提示认证失败 | 本地 Git 凭据过期 | 用 GitHub Desktop 登录一次，或把报错贴给 AI 要 PAT 方案 |

## 七、提交清单（练习一验收）

- [ ] GitHub 仓库地址：`https://github.com/你的用户名/helloworld-xxx`
- [ ] 公网访问地址：`http://服务器IP:3000`、`https://xxx.onrender.com` 或 `https://xxx.cpolar.top`
- [ ] 页面上显示的是你自己的名字
