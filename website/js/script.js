var bridge = new WebOSServiceBridge();
const popupConfirm = document.getElementById('confirm');
const popupScanning = document.getElementById('scanning');
const scanLoading = document.getElementById('scanLoading');
var data = "";

navigator.mediaDevices.getUserMedia({ video: true })
.then(function (stream) {
    var video = document.getElementById('video');
    video.srcObject = stream;
})
.catch(function (err) {
    console.error('Error accessing webcam: ', err);
});

function sleep(n) {
  return new Promise(function(resolve){
      setTimeout(resolve,n*1000);
  });
}

//LS2 API 사용한 소리 조절
function setVolume(volume)
{
  var url = 'luna://com.webos.service.audio/master/setVolume';
  var params = {
    "soundOutput": "pcm_output",
    "volume": volume
  };
  bridge.call(url, JSON.stringify(params));
}

//소리 조절하는 함수
function volumeControl()
{
  var volumeImage = document.getElementById("volumeImage");

  if(volumeImage.src == "file://app.sofi-webos/media/developer/apps/usr/palm/applications/app.sofi/website/img/nonMute.png") {
    volumeImage.src = "img/mute.png";
    setVolume(0);
  }
  else {
    volumeImage.src = "img/nonMute.png";
    setVolume(100);
  }
}

//메뉴 선택 시 웹사이트 이동
function iframeSelect(selector)
{
  var iframe = document.getElementById("iframe");
  var imageChange = document.getElementById("menu"+selector);
  var max = 4; // 현재 누를 수 있는 메뉴의 개수

  //해당하는 웹페이지로 이동 및 색 변경
  if(selector==1){ // 대시보드
    iframe.src = "html/dashboard.html";
    imageChange.style = 
    "background: url('img/menuDashboard_white.png') 5% 50% no-repeat cornflowerBlue; color: white";
  }
  else if(selector==2){ // 사용자
    iframe.src = "html/allergy.html";
    imageChange.style = 
    "background: url('img/menuUser_white.png') 5% 50% no-repeat cornflowerBlue; color: white";
  }
  else if(selector==3){ // 요리법
    iframe.src = "https://www.10000recipe.com";
    imageChange.style = 
    "background: url('img/menuHowtocook_white.png') 5% 50% no-repeat cornflowerBlue; color: white";
  }
  else if(selector==4){ // 도움말
    iframe.src = "html/guide.html";
    imageChange.style = 
    "background: url('img/menuGuide_white.png') 5% 50% no-repeat cornflowerBlue; color: white";
  }

  for(i=1; i<=max; i++){ //선택되지 않은 메뉴 색 초기화
    var colorChange = document.getElementById("menu"+i);
    if(i!=selector){
      colorChange.style = "color: none";
    }
  }
}

//카메라 사진 촬영 후 서버로 전송
function uploadPic_button() {
  var video = document.getElementById('video');
  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  var imageData = canvas.toDataURL('image/jpeg').replace(/^data:image\/jpeg;base64,/, '');

  fetch('http://115.85.182.143:5501/ImgSend', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ data:imageData }),
  })
  .then(response => response.json())
  .then(data => console.log('Server response:', data))
  .catch(error => console.error('Error capturing and uploading photo:', error))
}

function showConfirm() {
  popupConfirm.style.display = 'flex';
}
function hidePopup() {
  popupConfirm.style.display = 'none';
  popupScanning.style.display = 'none';
}
//로딩 중에 ux추가
async function waitResult(){
  while(1){
    await sleep(1);
    if(scanLoading.textContent != "스캔 중...")
      scanLoading.textContent += ".";
    else {
      scanLoading.textContent = "스캔 중"

      /*추후 여기에 서버로부터 데이터 받아서 data에 저장하는 fetch API 써야 함*/
      
      if(data != "")
        break;
    }
  }
}

async function confirmScan(bool) {
  if (bool) {
    hidePopup();
    popupScanning.style.display = 'flex';
    uploadPic_button();
    await waitResult();
    hidePopup();
  } 
  else {
    hidePopup();
  }
}