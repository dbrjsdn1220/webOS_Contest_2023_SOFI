const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

// 정적 파일을 제공하기 위해 Express의 static middleware를 사용합니다.
// public 폴더 아래에 있는 정적 파일들을 제공합니다.
app.use(express.static(path.join(__dirname, '/')));

app.listen(port, () => {
  console.log(`서버가 http://localhost:${port}/start_sofi.html 에서 실행 중입니다.`);
});