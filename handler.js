/**
 * 统一请求处理逻辑 —— 本地运行和服务器部署共用同一份代码
 * 想改名字：改下面这一行的 SITE_OWNER，或设置环境变量 SITE_OWNER
 */
const SITE_OWNER = process.env.SITE_OWNER || '【你的名字】';

/** 格式化北京时间：2026-11-18 星期三 20:15:03 */
function formatNow() {
  const now = new Date();
  const datePart = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(now); // 2026-11-18
  const weekday = new Intl.DateTimeFormat('zh-CN', {
    timeZone: 'Asia/Shanghai',
    weekday: 'long'
  }).format(now); // 星期三
  const timePart = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Shanghai',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).format(now); // 22:23:14
  return `${datePart} ${weekday} ${timePart}`;
}

function buildHtml() {
  const serverTime = formatNow();
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Hello World · 我的第一个 AI 开发网站</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: -apple-system, "PingFang SC", "Microsoft YaHei", sans-serif;
      background: radial-gradient(circle at 20% 10%, #24304d 0%, #12172a 45%, #0a0d18 100%);
      color: #eef2ff;
      padding: 24px;
    }
    .card {
      width: 100%;
      max-width: 680px;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.14);
      border-radius: 22px;
      padding: 48px 40px;
      text-align: center;
      backdrop-filter: blur(12px);
      box-shadow: 0 24px 70px rgba(0, 0, 0, 0.45);
    }
    .badge {
      display: inline-block;
      font-size: 13px;
      letter-spacing: 2px;
      color: #8ab4ff;
      border: 1px solid rgba(138, 180, 255, 0.45);
      border-radius: 999px;
      padding: 6px 16px;
      margin-bottom: 28px;
    }
    h1 {
      font-size: clamp(38px, 8vw, 62px);
      line-height: 1.15;
      letter-spacing: 1px;
      background: linear-gradient(92deg, #7ee8ff, #9f9bff 45%, #ffb6e6);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      margin-bottom: 18px;
    }
    .subtitle {
      font-size: 18px;
      line-height: 1.8;
      color: #cfd8f5;
      margin-bottom: 34px;
    }
    .subtitle strong { color: #ffd479; }
    .time-box {
      display: inline-flex;
      flex-direction: column;
      gap: 8px;
      border-top: 1px solid rgba(255, 255, 255, 0.12);
      padding-top: 26px;
      width: 100%;
    }
    .time-label { font-size: 13px; color: #93a1c4; letter-spacing: 1px; }
    .time-value { font-size: 22px; font-weight: 600; font-variant-numeric: tabular-nums; color: #a8ffd4; }
    .clock { font-size: 15px; color: #8ab4ff; font-variant-numeric: tabular-nums; }
    .footer { margin-top: 34px; font-size: 12px; color: #6d7b9e; line-height: 1.9; }
  </style>
</head>
<body>
  <main class="card">
    <div class="badge">NODE.JS · AI 开发实践</div>
    <h1>Hello World！</h1>
    <p class="subtitle">我是 <strong>${SITE_OWNER}</strong>，<br />我的第一个 AI 开发的网站</p>
    <div class="time-box">
      <div class="time-label">服务器当前时间（Asia/Shanghai）</div>
      <div class="time-value">${serverTime}</div>
      <div class="clock">浏览器本地时间：<span id="clock">--:--:--</span></div>
    </div>
    <p class="footer">每次刷新页面，服务器时间都会重新计算 —— 说明页面是服务器动态生成的。</p>
  </main>
  <script>
    const pad = (n) => String(n).padStart(2, '0');
    function tick() {
      const d = new Date();
      document.getElementById('clock').textContent =
        pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
    }
    tick();
    setInterval(tick, 1000);
  </script>
</body>
</html>`;
}

/** Node 的 (req, res) 请求处理函数：本地 http 服务和任意 Node 服务器通用 */
module.exports = function handler(req, res) {
  const url = (req.url || '/').split('?')[0];

  if (url === '/favicon.ico') {
    res.statusCode = 204;
    res.end();
    return;
  }

  // 便于课堂验收：/health 返回纯文本，确认服务活着
  if (url === '/health') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end('OK ' + formatNow());
    return;
  }

  if (url === '/' || url === '/index.html') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    res.end(buildHtml());
    return;
  }

  res.statusCode = 404;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.end('<!DOCTYPE html><meta charset="utf-8"><h1>404</h1><p>页面不存在，请访问 <a href="/">首页</a></p>');
};
