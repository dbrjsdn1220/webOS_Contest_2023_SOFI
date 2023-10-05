var bridge = new WebOSServiceBridge();

//LS2 API 사용한 소리 조절
function setVolume(volume)
{
  var url = 'luna://com.webos.service.audio/master/setVolume';
  var params = {
    "soundOutput": "pcm_output",
    "volume": volume*10
  };
  bridge.call(url, JSON.stringify(params));
}

//소리 조절하는 함수
function volumeControl(number)
{
  var volumeImage = document.getElementById("volumeImage"); 
  if(number > 0){
    volumeImage.src = "img/nonMute.png";
  }
  else if(number == 0){
    volumeImage.src = "img/mute.png";
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

  setVolume(number);
}

//메뉴 선택 시 웹사이트 이동
function iframeSelect(selector)
{
  var iframe = document.getElementById("iframe");
  var imageChange = document.getElementById("menu"+selector);
  var max = 5; // 현재 누를 수 있는 메뉴의 개수

  //해당하는 웹페이지로 이동 및 색 변경
  if(selector==1){ // 대시보드
    iframe.src = "html/dashboard.html";
    imageChange.style = 
    "background: url('img/menuDashboard_white.png') 5% 50% no-repeat cornflowerBlue; color: white";
  }
  else if(selector==2){ // 사용자
    iframe.src = "html/user.html";
    imageChange.style = 
    "background: url('img/menuUser_white.png') 5% 50% no-repeat cornflowerBlue; color: white";
  }
  else if(selector==3){ //GPIO조작 해보려고 만듬
    iframe.src = "html/gpio.html";
    imageChange.style = 
    "background: url('img/menuAllergy_white.png') 5% 50% no-repeat cornflowerBlue; color: white";
  }
  else if(selector==4){ // 요리법
    iframe.src = "https://www.10000recipe.com";
    imageChange.style = 
    "background: url('img/menuHowtocook_white.png') 5% 50% no-repeat cornflowerBlue; color: white";
  }
  else if(selector==5){ // 요리법
    iframe.src = "html/picture.html";
    imageChange.style = 
    "background: url('img/menuHowtocook_white.png') 5% 50% no-repeat cornflowerBlue; color: white";
  }

  for(i=1; i<=max; i++){ //선택되지 않은 메뉴 색 초기화
    var colorChange = document.getElementById("menu"+i);
    if(i!=selector){
      colorChange.style = "color: none";
    }
  }
}

