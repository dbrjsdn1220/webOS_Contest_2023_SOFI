var BridgeVoice = new WebOSServiceBridge();
var url, params, sentence, temp;

//음성인식 시작
function voiceStart() { 
  url = 'luna://com.webos.service.ai.voice/start';
  params = {
    "mode": "continuous",
    "keywordDetect": true
  };
  BridgeVoice.call(url, JSON.stringify(params));
}

//음성인식 종료
function voiceStop() {
  url = 'luna://com.webos.service.ai.voice/stop';
  params = {};
  BridgeVoice.call(url, JSON.stringify(params));
}

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
function uploadPic()
{
  navigator.mediaDevices.getUserMedia({ video: true })
  .then((stream) => {
    const [videoTrack] = stream.getVideoTracks();
    const imageCapture = new ImageCapture(videoTrack);
    return imageCapture.takePhoto();
  })
  .then((photoBlob) => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(photoBlob);
    });
  })
  .then((imageData) => {
    fetch('http://101.101.219.171:5556/uploadPic', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageData }),
    })
    .then(response => response.json())
    .then(data => console.log('Server response:', data))
    .catch(error => console.error('Error capturing and uploading photo:', error));
  })
  .catch(error => console.error('Error accessing camera:', error));
}

//음성인식 사용자 작동 설계
function selectAction(){
  var Array = sentence.split(' ');
  
  //도움말에 대해 tts 출력
  if(Array[0] == "도움말") {
    if (Array[1] == "스캔") {
      ttsSpeak("물건을 스캔합니다.");
    }
    else if (Array[1] == "알러지" || Array[1] == "알레르기") {
      ttsSpeak("알러지를 등록합니다.");
    }
    else
      ttsSpeak("'스캔' 또는 '알러지' 명령어를 사용하실 수 있습니다. 자세한 설명은 '도움말 스캔' 또는 '도움말 알러지'를 이용해 들을 수 있습니다");
  }

  //스캔 관련
  else if(sentence == "스캔 해 줘") {
    ttsSpeak("물건을 스캔합니다. 안전을 위해 기계를 건들이지 말아주세요.");
    uploadPic();
  }

  //알러지 관련
  else if(Array[0] == "알러지" || Array[0] == "알레르기")
  {
    if(Array[1] == "등록") {
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