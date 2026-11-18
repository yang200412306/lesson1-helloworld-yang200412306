/**
 * 本地开发服务器：node server.js
 * 默认端口 3000，可用环境变量 PORT 覆盖
 */
const http = require('http');
const handler = require('./handler');

const PORT = Number(process.env.PORT) || 3000;

const server = http.createServer(handler);

server.listen(PORT, () => {
  console.log('');
  console.log('  ✅ HelloWorld 已启动');
  console.log('  👉 本机访问： http://localhost:' + PORT);
  console.log('  👉 健康检查： http://localhost:' + PORT + '/health');
  console.log('  按 Ctrl + C 停止服务');
  console.log('');
});
