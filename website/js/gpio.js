var bridge = new WebOSServiceBridge();
var url, params;

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