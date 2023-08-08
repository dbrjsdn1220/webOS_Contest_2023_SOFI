const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, '/')));
app.use(express.json());

let data = []; // 데이터를 저장할 배열

app.post('/save-data', (req, res) => {
    const inputData = req.body;
  
    data.push(inputData);
  
    fs.writeFile('data.json', JSON.stringify(data, null, 2), (err) => {
        if (err) {
            console.error('데이터 저장 중 오류 발생:', err);
            res.status(500).send('데이터를 저장하는 중 오류가 발생했습니다.');
        }   else {
            console.log('데이터가 성공적으로 저장되었습니다.');
            res.status(200).send('데이터가 성공적으로 저장되었습니다.');
        }
    });
});

app.listen(port, () => {
  console.log(`서버가 http://localhost:${port}/start_sofi.html 에서 실행 중입니다.`);