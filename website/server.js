const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;
const bodyParser = require('body-parser')

//처음 접속 시, 연결할 사이트
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'start_sofi.html'));
});
app.use(express.static(path.join(__dirname, '/'))); //요청 시 모든 파일에 접근 가능하게 함.
app.use(express.json());

let data = []; // 데이터를 저장할 배열

//website/user.json의 파일을 읽어 data 배열에 저장. 해당 파일이 없다면 catch로 오류 구문 출력.
try {
    data = JSON.parse(fs.readFileSync('website/user.json'));
} catch (error) {
    console.error('기존 데이터를 가져오는 도중 오류 발생:', error);
}

app.get('/getData', (req, res) => {
  res.json(data); // 저장된 데이터를 JSON 형태로 응답
});

//데이터를 생성
app.post('/saveUser', (req, res) => {
    const {name, allergy} = req.body; //html에서 body: JSON.stringify였음. 해당 값을 저장.
    var userID=0; 
    checkID: //userID 설정을 위해서 값이 있는지 없는지 체크
    for(i=0; data[i]; i++){
      for(j=0; data[j]; j++){
        if(data[j].id == userID){
          userID++;
          continue checkID;
        }
      }
      break;
    };
    const userData = {id: userID, name, allergy};
    data.push(userData); // data 배열에 userData push
  
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

//데이터 삭제
app.delete('/deleteUser', (req, res) => {
  const user = req.body;
  var deleteUser = 0;
  for(i=0; data[i]; i++){
    if(data[i].id==user.id){
      deleteUser = i;
      break;
    }
  }
  data.splice(deleteUser, 1);
  fs.writeFile('website/user.json', JSON.stringify(data, null, 2), (err) => {
    if (err) {
      console.error('데이터 삭제하는 중 오류 발생:', err);
      res.status(500).send('데이터를 삭제하는 중 오류가 발생했습니다.');
    } else {
      console.log('데이터가 성공적으로 삭제되었습니다.');
      res.status(200).send('데이터가 성공적으로 삭제되었습니다.');
    }
  });
});

app.listen(port, '0.0.0.0');