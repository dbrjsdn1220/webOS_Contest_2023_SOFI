const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, '/')));
app.use(express.json());

let data = []; // 데이터를 저장할 배열

//website/user.json의 파일을 읽어 data 배열에 저장. 해당 파일이 없다면 catch로 오류 구문 출력.
try {
    data = JSON.parse(fs.readFileSync('website/user.json'));
} catch (error) {
    console.error('기존 데이터를 가져오는 도중 오류 발생:', error);
}

//post는 데이터를 생성하는 명령어.
app.post('/saveUser', (req, res) => {
    const inputData = req.body; //html에서 body: JSON.stringify였음. 해당 값을 저장.
  
    data.push(inputData); // data 배열에 inputData push
  
    fs.writeFile('website/user.json', JSON.stringify(data, null, 2), (err) => {
        if (err) {
            console.error('데이터 저장 중 오류 발생:', err);
            res.status(500).send('데이터를 저장하는 중 오류가 발생했습니다.');
        }   else {
            console.log('데이터가 성공적으로 저장되었습니다.');
            res.status(200).send('데이터가 성공적으로 저장되었습니다.');
        }
    });
});

app.get('/getData', (req, res) => {
  res.json(data); // 저장된 데이터를 JSON 형태로 응답
});

//
app.delete('/delete-data/:id', (req, res) => {
  const idToDelete = req.params.id;

  const index = data.findIndex(item => item.id === idToDelete);
  if (index !== -1) {
    data.splice(index, 1);
    fs.writeFile('data.json', JSON.stringify(data, null, 2), (err) => {
      if (err) {
        console.error('데이터 삭제 중 오류 발생:', err);
        res.status(500).send('데이터를 삭제하는 중 오류가 발생했습니다.');
      } else {
        console.log('데이터가 성공적으로 삭제되었습니다.');
        res.status(200).send('데이터가 성공적으로 삭제되었습니다.');
      }
    });
  } else {
    res.status(404).send('해당 ID를 가진 데이터를 찾을 수 없습니다.');
  }
});

app.listen(port, () => {
  console.log(`서버가 http://localhost:${port}/start_sofi.html 에서 실행 중입니다.`);
});