const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 5556;
 
/*처음 접속 시, 연결할 사이트
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'start_sofi.html'));
}); 웹서버 안 씀
app.use(express.static(path.join(__dirname, '/'))); //요청 시 모든 파일에 접근 가능. */

app.use(express.json());
let user = []; // 유저 데이터를 저장할 배열
let log = []; // 로그 데이터를 저장할 배열
 
//user.json의 파일을 읽어 user 배열에 저장. 해당 파일이 없다면 catch로 오류 구문 출력.
try {
  user = JSON.parse(fs.readFileSync('user.json'));
} catch (error) {
    console.error('기존 데이터를 가져오는 도중 오류 발생:', error);
}

//클라이언트가 유저 데이터를 읽고 싶을 때
app.get('/getUser', (req, res) => {
  res.json(user); // 저장된 데이터를 JSON 형태로 응답
});
 
//데이터를 생성
app.post('/saveUser', (req, res) => {
    const {name, allergy} = req.body; //html에서 body: JSON.stringify였음. 해당 값을 저장.
    var userID=0;
    
    checkID: //userID 설정을 위해서 값이 있는지 없는지 체크
    for(j=0; user[j]; j++){
      if(user[j].id == userID){
        userID++;
        continue checkID;
      }
    }
    const userData = {id: userID, name, allergy};
    user.push(userData); // user 배열에 userData push
 
    fs.writeFile('user.json', JSON.stringify(user, null, 2), (err) => {
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
  for(i=0; user[i]; i++){
    if(user[i].id==user.id){
      deleteUser = i;
      break;
    }
  }
  user.splice(deleteUser, 1);
  fs.writeFile('user.json', JSON.stringify(user, null, 2), (err) => {
    if (err) {
      console.error('데이터 삭제하는 중 오류 발생:', err);
      res.status(500).send('데이터를 삭제하는 중 오류가 발생했습니다.');
    } else {
      console.log('데이터가 성공적으로 삭제되었습니다.');
      res.status(200).send('데이터가 성공적으로 삭제되었습니다.');
    }
  });
});

//로그 출력
app.post('/logCheck', (req, res) => {
  console.log(req.body);
})
 
app.listen(port, () => {
  console.log(`http://101.101.219.171:${port}/ 작동 중입니다.`);
});