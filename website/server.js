const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, '/')));

app.listen(port, () => {
  console.log(`서버가 http://localhost:${port}/start_sofi.html 에서 실행 중입니다.`);
});