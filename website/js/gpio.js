var bridge = new WebOSServiceBridge();

function cam_check()
{
    var url = 'luna://com.webos.service.peripheralmanager/gpio/open';
    bridge.onservicecallback = msgCallback;
    var params={
      "pin":"gpio21"
   }

   var url = 'luna://com.webos.service.peripheralmanager/gpio/setDirection';
   var params={
      "pin":"gpio21", 
      "direction":"outHigt"
   }
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
