var bridge = new WebOSServiceBridge();
var url, params, sentence;

function voiceStart() //음성인식 시작
{ 
  url = 'luna://com.webos.service.ai.voice/start';
  params = {
    "mode": "single",
    "keywordDetect": false
  };
  bridge.call(url, JSON.stringify(params));
}
function voiceGetState() //음성인식 상태
{
  url = 'luna://com.webos.service.ai.voice/getState';
  bridge.onservicecallback = getState;
  params = {
    "subscribe": true
  };
  bridge.call(url, JSON.stringify(params));
}
function voiceGetResponse() //음성인식 응답
{
  url = 'luna://com.webos.service.ai.voice/getResponse';
  bridge.onservicecallback = getResponse;
  params = {
    "subscribe": true
  };
  bridge.call(url, JSON.stringify(params));
}
function voiceStop() //음성인식 종료
{
  url = 'luna://com.webos.service.ai.voice/stop';
  params = {};
  bridge.call(url, JSON.stringify(params));
}


function gpio_test()
{
  var url = 'luna://com.webos.service.peripheralmanager/gpio/open';
  var params={
    "pin":"gpio21"
  }
  bridge.call(url, JSON.stringify(params));

   
  var url = 'luna://com.webos.service.peripheralmanager/gpio/setDirection';
  var params={
    "pin":"gpio21", 
    "direction":"outHigh"
  }
  bridge.call(url, JSON.stringify(params));
  delay(10);
  var url = 'luna://com.webos.service.peripheralmanager/gpio/setDirection';
  var params={
    "pin":"gpio21", 
    "direction":"outLow"
  }
  bridge.call(url, JSON.stringify(params));
}

function delay(n){
  return new Promise(function(resolve){
      setTimeout(resolve,n*1000);
  });
}

//음성인식
function aiVoiceStart()
{
  voiceStart();
  voiceGetState();
}

//음성인식 상태값
function getState(msg) //추후에 가능하면 state없이 response 바로 받아오도록 시도
{
  //서버로 로그 보내는 부분
  fetch('http://101.101.219.171:5556/logCheckState', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json' //json 형태의 파일을 다룸.
    },
    body: msg
  })
  .then(response => response.text())
  .then(message => {
    console.log("getState", message);
    if(message == "thinking"){
      voiceGetResponse();
    }
  })
  .catch(error => {
    console.error('오류 발생:', error);
  });
}

//음성인식 응답값
function getResponse(msg) 
{
  //서버로 로그 보내는 부분
  fetch('http://101.101.219.171:5556/logCheckResponse', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json' //json 형태의 파일을 다룸.
    },
    body: msg
  })
  .then(response => response.text())
  .then(message => {
    console.log("getResponse", message);
    getSentence();
  })
  .catch(error => {
    console.error('오류 발생:', error);
  });
}

//음성인식 값 받아오기
function getSentence() {
  fetch('http://101.101.219.171:5556/getWords')
  .then(response => response.text())
  .then(words => {
    console.log("words", words)
    voiceStop();
  })
  .catch(error => {
    console.error('오류 발생:', error);
  });
}

