var muteCheck = 0; //음소거 상태인지 확인하는 변수
var volumeImage = document.getElementById("volumeImage"); 

function mute() //소리 음소거하는 함수
{
  if(muteCheck == 0){
    muteCheck = 1;
    volumeImage.src = "icons/mute.png";
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
    volumeImage.src = "icons/nonMute.png";
  }
  for(i=10; i>0; i--){
    var volumeSet = document.getElementById("volume"+i);
    if(i>=number){
      volumeSet.style="background-color: cornflowerBlue";
    }
    else if(i<number){
      volumeSet.style="background-color: white";
    }
  }
  /* LS2 API 사용해서 소리 조절하는 명령어 넣어야 함 */
}

function iframeSelect(selector) // 메뉴 선택 시 웹사이트 이동
{
  var iframe = document.getElementById("iframe");
  var max = 4; // 현재 누를 수 있는 메뉴의 개수

  for(i=1; i<=4; i++){ //선택된 메뉴 색깔 변경
    var colorChange = document.getElementById("menu"+i);
    if(i==selector){
      colorChange.style = "background-color: cornflowerBlue";
    }
    else{
      colorChange.style = "background-color: none";
    }
  }
  //해당하는 웹페이지로 이동
  if(selector==1){ // 대시보드
    iframe.src = "html/main_test.html";
  }
  else if(selector==2){ // 사용자
    iframe.src = "html/user.html";
  }
  else if(selector==3){ // 알레르기
    iframe.src = "https://www.allergy.or.kr/";
  }
  else if(selector==4){ // 요리법
    iframe.src = "https://www.10000recipe.com/";
  }
}

window.onload = volumeControl(6); //초기 음량 설정
window.onload = iframeSelect(1); //초기 페이지 접속