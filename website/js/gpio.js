
var bridge = new WebOSServiceBridge();
var url, params;
const saveDate = "/home/root/c_t/";// 사진 저장 위치

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
  var url ='luna-send -n 1 -f luna://com.webos.service.camera2/open';
  var params={
    "id":"camera1"
  }
  bridge.call(url, JSON.stringify(params));

  var url='luna-send -n 1 -f luna://com.webos.service.camera2/startPreview';
  var url ={
    "handle":2793,
    "type":"posixshm",
    "source":"0"
  }
  bridge.call(url, JSON.stringify(params));

  var url = 'luna-send -n 1 -f luna://com.webos.service.camera2/startCapture';
  var params={
    "handle": 2793,
    "width": 640,
    "height": 480,
    "format": "JPEG",
    "mode":"MODE_BURST",
    "nimage":2,
    "path":savedate
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

function ESP_CAM_TEST() {
  const http = require('http');
  const fs = require('fs');
  const imageUrl = 'http://192.168.0.196/capture';
  const destinationPath = '/home/root/c_t/downloaded_image.jpg'; // 이미지를 저장할 경로 및 파일 이름

  // HTTP GET 요청으로 이미지 다운로드
  http.get(imageUrl, (response) => {
  if (response.statusCode === 200) {
    const fileStream = fs.createWriteStream(destinationPath);
    response.pipe(fileStream);

    fileStream.on('finish', () => {
      fileStream.close();
      console.log('이미지 다운로드 완료.');
    });
  } else {
    console.error('이미지를 가져올 수 없습니다.');
  }
}).on('error', (error) => {
  console.error('에러 발생:', error);
});
  /*
  const cameraStream = 'http://192.168.0.196/capture'; // 카메라 웹 서버 주소
  
  fetch(cameraStream)
    .then((response) => {
      if (!response.ok) {
        console.error('카메라 스트림을 가져올 수 없음');
        throw new Error('카메라 스트림을 가져올 수 없음');
      }
      return response.blob();
    })
    .then((blob) => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'image.png'; // 다운로드할 파일 이름 설정
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      console.log( a.click());
      document.body.removeChild(a);
    })
    .catch((error) => {
      console.error('에러 발생:', error);
    });
    */
}

function delay(n){
  return new Promise(function(resolve){
      setTimeout(resolve,n*1000);
  });
}