var BridgeVoice = new WebOSServiceBridge();
var url, params, sentence, temp;

navigator.mediaDevices.getUserMedia({ video: true })
.then(function (stream) {
    var video = document.getElementById('video');
    video.srcObject = stream;
})
.catch(function (err) {
    console.error('Error accessing webcam: ', err);
});

//음성인식 시작
function voiceStart() { 
  url = 'luna://com.webos.service.ai.voice/start';
  params = {
    "mode": "continuous",
    "keywordDetect": true
  };
  BridgeVoice.call(url, JSON.stringify(params));
}

/*음성인식 종료
function voiceStop() {
  url = 'luna://com.webos.service.ai.voice/stop';
  params = {};
  BridgeVoice.call(url, JSON.stringify(params));
}*/

//음성인식 응답 값 확인
function voiceGetResponse() {
  url = 'luna://com.webos.service.ai.voice/getState';
  BridgeVoice.onservicecallback = getResponse;
  params = {
    "subscribe": true
  };
  BridgeVoice.call(url, JSON.stringify(params));

  url = 'luna://com.webos.service.ai.voice/getResponse';
  BridgeVoice.onservicecallback = getResponse;
  params = {
    "subscribe": true
  };
  BridgeVoice.call(url, JSON.stringify(params));
}

//tts 사용
function ttsSpeak(tts) {
  url = 'luna://com.webos.service.tts/speak';
  params = {
    "text": tts,
    "language": "ko-KR"
  };
  BridgeVoice.call(url, JSON.stringify(params));
}

//음성인식 응답값
function getResponse(msg) 
{
  console.log(msg);
  if(msg == `{"state":"thinking"}`){
    sentence = JSON.parse(temp).response.partial;
    console.log("sentence", sentence);
    selectAction();
  }
  temp = msg;
}

//카메라 사진 촬영 후 서버로 전송
function uploadPic() {
  var video = document.getElementById('video');
  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  var imageData = canvas.toDataURL('image/jpeg').replace(/^data:image\/jpeg;base64,/, '');
  console.log(imageData);

  fetch('http://115.85.182.143:5501/ImgSend', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ data:imageData }),
  })
  .then(response => response.json())
  .then(data => console.log('Server response:', data))
  .catch(error => console.error('Error capturing and uploading photo:', error))
}

//음성인식 사용자 작동 설계
function selectAction(){
  let Array = sentence.split(' ');
  
  //도움말 관련 명령어!
  if(Array[0] == "도움말") {
    if (Array[1] == "스캔") {
      ttsSpeak("물건을 스캔하여 식품명과 유통기한을 확인합니다. 명령어는 '스캔 해 줘' 입니다.");
    }
    else if (Array[1] == "알러지" || Array[1] == "알레르기") {
      ttsSpeak("알러지를 등록하여 스캔한 식품에 해당 알러지 유발 물질이 들었을 경우 경고합니다. 명령어는 '알러지 등록 ', '알러지 정보', '알러지 삭제' 3가지 입니다. '알러지 등록' ");
    }
    else
      ttsSpeak("'스캔' 또는 '알러지'와 관련된 명령어를 사용하실 수 있습니다. 자세한 설명은 '도움말 스캔' 또는 '도움말 알러지'를 이용해 들을 수 있습니다");
  }

  //스캔 관련 명령어!
  else if(sentence == "스캔 해 줘") {
    ttsSpeak("물건을 스캔합니다. 안전을 위해 기계를 건들이지 말아주세요.");
    uploadPic();
    gpio_start();
  }

  //알러지 관련 명령어!
  else if(Array[0] == "알러지" || Array[0] == "알레르기")
  {
    if(Array[1] == "등록" || Array[1] == "설정") {
      const name = Array[2];
      const allergy = Array[3];
      const user = { name, allergy };

      fetch('http://101.101.219.171:5556/saveUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json' //json 형태의 파일을 다룸.
        },
        body: JSON.stringify(user)
      })
      .then(response => response.text()) //텍스트의 형태로
      .then(message => {
        ttsSpeak(message);
        console.log(message);
      });
    }
    else if(Array[1] == "정보") {
      fetch('http://101.101.219.171:5556/getUser')
      .then(response => response.json())
      .then(data => {
        data.forEach(user => {
          ttsSpeak(`${user.id}번에 저장된 정보는 "이름" ${user.name} "알레르기" ${user.allergy}입니다.`);
        });
      });
    }
    else if(Array[1] == "삭제") {
      const id = Array[2].substring(0, 1);
      fetch(`http://101.101.219.171:5556/deleteUser`, {
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({id})
      })
      .then(response => response.text())
      .then(message => {
        ttsSpeak(message);
        console.log(message);
      });
    }
    else
      ttsSpeak("잘못된 명령어입니다. '도움말 알러지'로 사용법을 확인해보세요.");
  }

  else {
    ttsSpeak("잘못된 명령어 입니다. '도움말'로 사용법을 확인해보세요.");
  }
}

function gpio_start()//모터 실행 및 카메라(?) open 
{
  var url = 'luna://com.webos.service.peripheralmanager/gpio/open';//gpio open
  var params={
    "pin":"gpio21"
  }
  BridgeGpio.call(url, JSON.stringify(params));

  var url = 'luna://com.webos.service.peripheralmanager/gpio/setDirection';//outHigh
  var params={
    "pin":"gpio21", 
    "direction":"outHigh"
  }
  BridgeGpio.call(url, JSON.stringify(params));
  delay(1000);
  var url = 'luna://com.webos.service.peripheralmanager/gpio/setDirection';//outLow
  var params={
    "pin":"gpio21", 
    "direction":"outLow"
  }
  BridgeGpio.call(url, JSON.stringify(params));
}