var bridge = new WebOSServiceBridge();

function gpio_test()
{
  var url = 'luna://com.webos.service.peripheralmanager/gpio/open';
  bridge.onservicecallback = msgCallback;
  var params={
    "pin":"gpio21"
  }
  bridge.call(url, JSON.stringify(params));

   
  var url = 'luna://com.webos.service.peripheralmanager/gpio/setDirection';
  bridge.onservicecallback = msgCallback;
  var params={
    "pin":"gpio21", 
    "direction":"outHigh"
  }
  bridge.call(url, JSON.stringify(params));
  delay(10);
  var url = 'luna://com.webos.service.peripheralmanager/gpio/setDirection';
  bridge.onservicecallback = msgCallback;
  var params={
    "pin":"gpio21", 
    "direction":"outLow"
  }
  bridge.call(url, JSON.stringify(params));
}


function cam_test()
{
  var url ='luna-send -n 1 -f luna://com.webos.service.camera2/getCameraList';
  bridge.onservicecallback = msgCallback;
  var params=
  {
    
  }
  bridge.call(url, JSON.stringify(params));
}

function aiVoiceStart()
{
  //테스트
  var url = 'luna://com.webos.notification/createToast';
  bridge.onservicecallback = msgCallback;
  var params = {
    "message": "음성안내 서비스 시작"
  };
  bridge.call(url, JSON.stringify(params));

  //음성인식 시작
  var url = 'luna://com.webos.service.ai.voice/start';
  bridge.onservicecallback = msgCallback;
  var params = {
    "mode": "continuous",
    "keywordDetect": true
  };
  bridge.call(url, JSON.stringify(params));

  //음성인식 응답
  url = 'luna://com.webos.service.ai.voice/getResponse';
  bridge.onservicecallback = msgCallback;
  params = {
    "subscribe": true
  };
  bridge.call(url, JSON.stringify(params));
}

function msgCallback(msg)
{
  var response = JSON.parse(msg);
  console.log(response);
}

function delay(n){
  return new Promise(function(resolve){
      setTimeout(resolve,n*1000);
  });
}