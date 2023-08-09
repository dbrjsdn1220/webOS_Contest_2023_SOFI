const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, '/')));
app.use(express.json());

let data = []; // 데이터를 저장할 배열

try {
    data = JSON.parse(fs.readFileSync('website/data.json'));
} catch (error) {
    console.error('기존 데이터를 가져오는 도중 오류 발생:', error);
}

app.post('/save-data', (req, res) => {
    const inputData = req.body;
  
    data.push(inputData);
  
    fs.writeFile('website/data.json', JSON.stringify(data, null, 2), (err) => {
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
});

//여기서부터 공부
app.get('/get-data', (req, res) => {
    res.json(data); // 저장된 데이터를 JSON 형태로 응답
});

app.put('/update-data', express.json(), (req, res) => {
    const updatedData = req.body;
    const updatedId = updatedData.id;
  
    const index = data.findIndex(item => item.id === updatedId);
    if (index !== -1) {
      data[index] = { ...data[index], ...updatedData };
      fs.writeFile('data.json', JSON.stringify(data, null, 2), (err) => {
        if (err) {
          console.error('데이터 업데이트 중 오류 발생:', err);
          res.status(500).send('데이터를 업데이트하는 중 오류가 발생했습니다.');
        } else {
          console.log('데이터가 성공적으로 업데이트되었습니다.');
          res.status(200).send('데이터가 성공적으로 업데이트되었습니다.');
        }
      });
    } else {
      res.status(404).send('해당 ID를 가진 데이터를 찾을 수 없습니다.');
    }
  });
