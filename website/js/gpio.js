var bridge = new WebOSServiceBridge();

function cam_check()
{
    var ur1 = 'luna://com.webos.service.peripheralmanager/gpio/list';
    bridge.onservicecallback = msgCallback;
    params={
      "subscribed":false,
      "returnValue":true,
      "gpioList":[
         {
            "pin":"gpio12",
            "status":"available"
         },
         {
            "pin":"gpio13",
            "status":"available"
         },
         {
            "pin":"gpio16",
            "status":"available"
         },
         {
            "pin":"gpio17",
            "status":"available"
         },
         {
            "pin":"gpio18",
            "status":"available"
         },
         {
            "pin":"gpio19",
            "status":"available"
         },
         {
            "pin":"gpio20",
            "status":"available"
         },
         {
            "pin":"gpio21",
            "status":"available"
         },
         {
            "pin":"gpio22",
            "status":"available"
         },
         {
            "pin":"gpio23",
            "status":"available"
         },
         {
            "pin":"gpio24",
            "status":"available"
         },
         {
            "pin":"gpio25",
            "status":"available"
         },
         {
            "pin":"gpio4",
            "status":"available"
         },
         {
            "pin":"gpio5",
            "status":"available"
         },
         {
            "pin":"gpio6",
            "status":"available"
         }
      ]
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
