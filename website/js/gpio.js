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


function hasGetUserMedia() {
  return !!(navigator.GetUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);

}

function c_test(){
  var url = 'luna-send -n 1 -f luna://com.webos.service.camera2/startCapture';
  var params={
    "handle":6696,
    "width": 640,
    "height": 480,
    "format": "JPEG",
    "mode":"MODE_BURST",
    "nimage":2,
    "path":"/media/multimedia"
  }
  bridge.call(url, JSON.stringify(params));
  /*
  if (hasGetUserMedia()){
    console.log("getUserMedia() is supported in your browser");
  }
  else{
    console.log("getUserMedia() is not supported in your browser");
  }
  var video = document.querySelector("#videoElement");

  if(navigator.mediaDevices.getUserMedia){
    navigator.mediaDevices.getUserMedia({video:true, audio:true}).then(function(stream){
      video.srcObject=stream;
    })
    .catch(function(error){
      console.log("Something went wrong! " + error);
    });
  }
  */
}
  

function delay(n){
  return new Promise(function(resolve){
      setTimeout(resolve,n*1000);
  });
}