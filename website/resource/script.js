var muteCheck = 0; //음소거 상태인지 확인하는 변수
var volumeImage = document.getElementById("volumeImage"); 

function mute() //소리 음소거하는 함수
{
  if(muteCheck == 0){
    muteCheck = 1;
    volumeImage.src = "resource/icons/mute.png";
    /* LS2 API 사용해서 소리 끄는 명령어 넣어야 함 */
    for(i=10; i>0; i--){
      var volumeSet = document.getElementById("volume"+i);
      volumeSet.style="background-color: white";
    }
  }
}
    
function volumeControl(number) //소리 조절하는 함수
{
  if(muteCheck == 1){
    muteCheck = 0;
    volumeImage.src = "resource/icons/nonMute.png";
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
  /* LS2 API 사용해서 소리 조절하는 명령어 넣어야 함 */
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
  else if(selector==3){ // 알레르기
    iframe.src = "resource/html/allergy.html";
    imageChange.style = 
    "background: url('resource/icons/menuAllergy_white.png') 5% 50% no-repeat cornflowerBlue; color: white";
  }
  else if(selector==4){ // 요리법
    iframe.src = "https://www.10000recipe.com/";
    imageChange.style = 
    "background: url('resource/icons/menuHowtocook_white.png') 5% 50% no-repeat cornflowerBlue; color: white";
  }
  else if(selector==5){ //GPIO조작 해보려고 만듬
    iframe.src = "../webos_gpio_test/gpio.html";
    imageChange.style = 
    "background: url('resource/icons/menuUser_white.png') 5% 50% no-repeat cornflowerBlue; color: white";
  }

  for(i=1; i<=max; i++){ //선택되지 않은 메뉴 색 초기화
    var colorChange = document.getElementById("menu"+i);
    if(i!=selector){
      colorChange.style = "background-color: none";
    }
  }
}

window.onload = volumeControl(5); //초기 음량 설정
window.onload = iframeSelect(1); //초기 페이지 접속