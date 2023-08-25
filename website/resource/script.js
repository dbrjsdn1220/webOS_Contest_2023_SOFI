var volumeImage = document.getElementById("volumeImage"); 
var bridge = new WebOSServiceBridge();

function volumeControl(number) //소리 조절하는 함수
{
  var volumeImage = document.getElementById("volumeImage"); 
  if(number > 0){
    volumeImage.src = "resource/icons/nonMute.png";
  }
  else if(number == 0){
    volumeImage.src = "resource/icons/mute.png";
  }

  for(i=1; i<=10; i++){
    var volumeSet = document.getElementById("volume"+i);
    if(i<=number){
      volumeSet.style="background-color: cornflowerBlue";
    }
    else if(i>number){
      volumeSet.style="background-color: white";
    }
  }
  //LS2 API 사용한 소리 조절
  var url = 'luna://com.webos.service.audio/master/setVolume';
  bridge.onservicecallback = callback;
  var params = {
    "soundOutput": "pcm_output",
    "volume": number*10
  };
  bridge.call(url, JSON.stringify(params));
}

function iframeSelect(selector) // 메뉴 선택 시 웹사이트 이동
{
  var iframe = document.getElementById("iframe");
  var imageChange = document.getElementById("menu"+selector);
  var max = 5; // 현재 누를 수 있는 메뉴의 개수

  //해당하는 웹페이지로 이동 및 색 변경
  if(selector==1){ // 대시보드
    iframe.src = "resource/html/dashboard.html";
    imageChange.style = 
    "background: url('resource/icons/menuDashboard_white.png') 5% 50% no-repeat cornflowerBlue; color: white";
  }
  else if(selector==2){ // 사용자
    iframe.src = "resource/html/user.html";
    imageChange.style = 
    "background: url('resource/icons/menuUser_white.png') 5% 50% no-repeat cornflowerBlue; color: white";
  }
  else if(selector==3){ //GPIO조작 해보려고 만듬
    iframe.src = "webos_gpio_test/gpio.html";
    imageChange.style = 
    "background: url('resource/icons/menuUser_white.png') 5% 50% no-repeat cornflowerBlue; color: white";
  }
  else if(selector==4){ // 요리법
    iframe.src = "https://www.10000recipe.com";
    imageChange.style = 
    "background: url('resource/icons/menuHowtocook_white.png') 5% 50% no-repeat cornflowerBlue; color: white";
  }

  for(i=1; i<=max; i++){ //선택되지 않은 메뉴 색 초기화
    var colorChange = document.getElementById("menu"+i);
    if(i!=selector){
      colorChange.style = "background-color: none";
    }
  }
}

function aiVoiceStart()
{
  //테스트
  var url = 'luna://com.webos.notification/createToast';
  bridge.onservicecallback = callback;
  var params = {
    "message": "'스노우보이'로 인공지능 음성안내 서비스를 사용해보세요."
  };
  bridge.call(url, JSON.stringify(params));

  //음성인식 시작
  var url = 'luna://com.webos.service.ai.voice/start';
  bridge.onservicecallback = callback;
  var params = {
    "mode": "continuous",
    "keywordDetect": true
  };
  bridge.call(url, JSON.stringify(params));

  //음성인식 응답
  url = 'luna://com.webos.service.ai.voice/getResponse';
  bridge.onservicecallback = callback;
  params = {
    "subscribe": true
  };
  bridge.call(url, JSON.stringify(params));
}
function callback(msg)
{
  var response = JSON.parse(msg);
  console.log(response);
}

window.onload = function() {
  volumeControl(10); //초기 음량 설정
  iframeSelect(1); //초기 페이지 접속
}