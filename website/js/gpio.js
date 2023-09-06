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
}

function aiVoiceStart()
    {
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

    function msgCallback(msg) {
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
    };
    
