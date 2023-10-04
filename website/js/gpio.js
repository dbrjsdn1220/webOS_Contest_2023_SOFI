var BridgeGpio = new WebOSServiceBridge();
var url, params, handle;

/*
function gpio_test()
{
  var url = 'luna://com.webos.service.peripheralmanager/gpio/open';
  var params={
    "pin":"gpio21"
  }
  BridgeGpio.call(url, JSON.stringify(params));

   
  var url = 'luna://com.webos.service.peripheralmanager/gpio/setDirection';
  var params={
    "pin":"gpio21", 
    "direction":"outHigh"
  }
  BridgeGpio.call(url, JSON.stringify(params));
  delay(10);
  var url = 'luna://com.webos.service.peripheralmanager/gpio/setDirection';
  var params={
    "pin":"gpio21", 
    "direction":"outLow"
  }
  BridgeGpio.call(url, JSON.stringify(params));
}


function hasGetUserMedia()
{
  return !!(navigator.GetUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
}

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

//딜레이 n은 s단위
function delay(n) {
  return new Promise(function(resolve){
      setTimeout(resolve,n*1000);
  });
}

//camera 사용
function c_open() {
  url = 'luna://com.webos.service.camera2/open';
  BridgeGpio.onservicecallback = getHandle;
  params = {
    "id": "camera1"
  };
  BridgeGpio.call(url, JSON.stringify(params));
}

//카메라 값을 메모리에 받아오는 걸로 추정
function c_preview() {
  url='luna://com.webos.service.camera2/startPreview';
  BridgeGpio.onservicecallback = getLog;
  params = {
    "handle": handle,
    "params": {
      "type":"sharedmemory",
      "source":"0"
    }
  };
  BridgeGpio.call(url, JSON.stringify(params));
}

//메모리에 있는 카메라 값 저장으로 추정
function c_capture() {
  url = 'luna://com.webos.service.camera2/startCapture';
  BridgeGpio.onservicecallback = getLog;
  params = {
    "handle": handle,
    "path": "/home/root/pics/",
    "params": {
      "width": 640,
      "height": 480,
      "format": "JPEG",
      "mode":"MODE_ONESHOT"
    }
  };
  BridgeGpio.call(url, JSON.stringify(params));
}

//카메라 핸들값 저장
function getHandle(msg) {
  handle = JSON.parse(msg).handle;
  console.log("handle 값: ", handle);
}
//LS2 API 리턴값 로그로 출력
function getLog(msg) {
  console.log(msg);
}

//서버로 사진 전송
function sendPic() {
  
}

async function startScan() {
  c_open();
  await delay(0.2);
  c_preview();

  c_capture();
  await delay(0.2);
  c_capture();
}