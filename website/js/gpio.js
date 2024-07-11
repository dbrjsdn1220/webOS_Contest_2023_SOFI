var BridgeGpio = new WebOSServiceBridge();
var Bridge = new WebOSServiceBridge();
var Bridgecam = new WebOSServiceBridge();
var url, params, handle, url2, url3, url4;
var num;

async function gpio_mains() {
  await start_cam();
  console.log("실행완료");
}

async function gpio_test() {
  var url2 = "luna://com.webos.service.peripheralmanager/gpio/open";
  var params = {
    pin: "gpio20",
  };
  await BridgeGpio.call(url2, JSON.stringify(params));
  var url2 = "luna://com.webos.service.peripheralmanager/gpio/setDirection";
  var params = {
    pin: "gpio20",
    direction: "in",
  };
  await BridgeGpio.call(url2, JSON.stringify(params));
  await console.log("체크 됨");
  var url = "luna://com.webos.service.peripheralmanager/gpio/open";
  var params = {
    pin: "gpio21",
  };
  await BridgeGpio.call(url, JSON.stringify(params));
  var url = "luna://com.webos.service.peripheralmanager/gpio/setDirection";
  var params = {
    pin: "gpio21",
    direction: "outHigh",
  };
  await BridgeGpio.call(url, JSON.stringify(params));
  var url = "luna://com.webos.service.peripheralmanager/gpio/setDirection";
  var params = {
    pin: "gpio21",
    direction: "outLow",
  };
  await BridgeGpio.call(url, JSON.stringify(params));
  await delay(50);
  /*
  handle="low";
  while(handle=="low")
  {
    var url2 = 'luna://com.webos.service.peripheralmanager/gpio/getValue';
    var params={
       "pin":"gpio20" 
    }
    await console.log("체크 됨1");
    await delay(5);
    await Bridge.call(url2, JSON.stringify(params));
    Bridge.onservicecallback = getHandle;
  } 
  handle="low";
  */
}

function getHandle(msg) {
  handle = JSON.parse(msg).value;
  console.log(handle);
}

async function delay(n) {
  return new Promise(function (resolve) {
    setTimeout(resolve, n * 100);
  });
}

async function start_cam() {
  console.log("카메라 시작");
  var url3 = "luna://com.webos.service.peripheralmanager/gpio/open";
  var params = {
    pin: "gpio12",
  };
  Bridgecam.call(url4, JSON.stringify(params));
  console.log("카메라 시작 2");
  var url4 = "luna://com.webos.service.peripheralmanager/gpio/open";
  var params = {
    pin: "gpio16",
  };
  Bridgecam.call(url4, JSON.stringify(params));
  var url3 = "luna://com.webos.service.peripheralmanager/gpio/setDirection";
  var params = {
    pin: "gpio12",
    direction: "outHigh",
  };
  Bridgecam.call(url4, JSON.stringify(params));
  var url4 = "luna://com.webos.service.peripheralmanager/gpio/setDirection";
  var params = {
    pin: "gpio16",
    direction: "outHigh",
  };
  Bridgecam.call(url4, JSON.stringify(params));
  await delay(10);
  var url3 = "luna://com.webos.service.peripheralmanager/gpio/setDirection";
  var params = {
    pin: "gpio12",
    direction: "outLow",
  };
  Bridgecam.call(url4, JSON.stringify(params));
  var url4 = "luna://com.webos.service.peripheralmanager/gpio/setDirection";
  var params = {
    pin: "gpio16",
    direction: "outLow",
  };
  Bridgecam.call(url4, JSON.stringify(params));
  await delay(15);
  console.log("완료");
}

/*
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

/*
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
*/
