var bridge = new WebOSServiceBridge();
var sentence = "";

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
  delay(1000);
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

function aiVoiceStart()
{
  //음성인식 시작
  var url = 'luna://com.webos.service.ai.voice/start';
  var params = {
    "mode": "single",
    "keywordDetect": false
  };
  bridge.call(url, JSON.stringify(params));

  //음성인식 응답
  url = 'luna://com.webos.service.ai.voice/getState';
  bridge.onservicecallback = getState;
  params = {
    "subscribe": true
  };
  bridge.call(url, JSON.stringify(params));
}

function getState(msg) //추후에 가능하면 state없이 response 바로 받아오도록 시도
{
  //서버로 로그 보내는 부분
  fetch('http://101.101.219.171:5556/logCheck', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json' //json 형태의 파일을 다룸.
    },
    body: msg
  })
  .then(response => response.text()) //텍스트의 형태로
  .then(message => {
    console.log(message);

    if(JSON.parse(msg.state) == "answering") {
      url = 'luna://com.webos.service.ai.voice/getResponse';
      bridge.onservicecallback = getResponse;
      params = {
         "subscribe": true
      };
      bridge.call(url, JSON.stringify(params));
    }
  })
  .catch(error => {
    console.error('GetState:', error);
  });  
}

function getResponse(msg) 
{
  //서버로 로그 보내는 부분
  fetch('http://101.101.219.171:5556/logCheck', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json' //json 형태의 파일을 다룸.
    },
    body: msg
  })
  .then(response => response.text()) //텍스트의 형태로
  .then(message => {
    console.log(message);
  })
  .catch(error => {
    console.error('오류 발생:', error);
  });
}