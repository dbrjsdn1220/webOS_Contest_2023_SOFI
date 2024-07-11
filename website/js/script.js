server_ip = "http://203.253.176.254:10500"
var bridge = new WebOSServiceBridge();
const popupConfirm = document.getElementById("confirm");
const popupScanning = document.getElementById("scanning");
const popupSpecific = document.getElementById("specific");
const scanLoading = document.getElementById("scanLoading");
const dataDetail = document.getElementById("dataDetail");
var foodData;
var dataLength = 0;
var number = 0;

/*
navigator.mediaDevices
  .getUserMedia({ video: true })
  .then(function (stream) {
    var video = document.getElementById("video");
    video.srcObject = stream;
  })
  .catch(function (err) {
    console.error("Error accessing webcam: ", err);
  });
*/

//지연
function sleep(n) {
  return new Promise(function (resolve) {
    setTimeout(resolve, n * 1000);
  });
}

//LS2 API 사용한 소리 조절
function setVolume(volume) {
  var url = "luna://com.webos.service.audio/master/setVolume";
  var params = {
    soundOutput: "pcm_output",
    volume: volume,
  };
  bridge.call(url, JSON.stringify(params));
}

//소리 조절하는 함수
function volumeControl() {
  var volumeImage = document.getElementById("volumeImage");

  if (
    volumeImage.src ==
    "file://app.sofi-webos/media/developer/apps/usr/palm/applications/app.sofi/website/img/nonMute.png"
  ) {
    volumeImage.src = "img/mute.png";
    setVolume(0);
  } else {
    volumeImage.src = "img/nonMute.png";
    setVolume(100);
  }
}

//메뉴 선택 시 웹사이트 이동
function iframeSelect(selector) {
  var iframe = document.getElementById("iframe");
  var imageChange = document.getElementById("menu" + selector);
  var max = 4; // 현재 누를 수 있는 메뉴의 개수

  //해당하는 웹페이지로 이동 및 색 변경
  if (selector == 1) {
    // 대시보드
    iframe.src = "html/dashboard.html";
    imageChange.style =
      "background: url('img/menuDashboard_white.png') 5% 50% no-repeat cornflowerBlue; color: white";
  } else if (selector == 2) {
    // 사용자
    iframe.src = "html/allergy.html";
    imageChange.style =
      "background: url('img/menuUser_white.png') 5% 50% no-repeat cornflowerBlue; color: white";
  } else if (selector == 3) {
    // 요리법
    iframe.src = "https://www.10000recipe.com";
    imageChange.style =
      "background: url('img/menuHowtocook_white.png') 5% 50% no-repeat cornflowerBlue; color: white";
  } else if (selector == 4) {
    // 도움말
    iframe.src = "html/guide.html";
    imageChange.style =
      "background: url('img/menuGuide_white.png') 5% 50% no-repeat cornflowerBlue; color: white";
  }

  for (i = 1; i <= max; i++) {
    //선택되지 않은 메뉴 색 초기화
    var colorChange = document.getElementById("menu" + i);
    if (i != selector) {
      colorChange.style = "color: none";
    }
  }
}

/*스캔 기록에 대한 함수들*/
//스캔 데이터 화면에 출력
function dataLoad() {
  let num = document.getElementById("num");
  num.textContent = `${number + 1} Page`;

  fetch(server_ip + "/getFood")
    .then((response) => response.json())
    .then((data) => {
      dataLength = Object.keys(data).length;
      const scanList = document.getElementById("scanList");
      scanList.innerHTML = ""; // 기존 목록 초기화
        for (
            let i = dataLength - number * 10;
            i != dataLength - number * 10 - 10;
            i--
      ) {
        if (i > 0) {
          const listItem = document.createElement("li");
          listItem.innerHTML = `
                    <button onclick="specificData(${data[i - 1].id})">${
            data[i - 1].id + 1
          }</button>
                    &#160&#160${data[i - 1].name} &#160/&#160 ${
            data[i - 1].date
          }`;
          scanList.appendChild(listItem); //변수 각각의 값을 dataList에 추가
        } else {
          break;
        }
      }
    })
    .catch((error) => {
      console.error("오류 발생:", error);
    });
}
//다음 페이지 이동
function nextPage() {
  if (number + 1 < dataLength / 10) number++;
  dataLoad();
}
//이전 페이지 이동
function prevPage() {
  if (number > 0) number--;
  dataLoad();
}
//상세 정보 보기
function specificData(num) {
  popupSpecific.style.display = "flex";
  fetch(server_ip + "/getFood")
    .then((response) => response.json())
    .then((data) => {
      dataDetail.innerHTML = `<br>
        식품명: ${data[num].name}<br><br>유통기한: ${data[num].date}<br><br>
        알레르기 유발 식품: <br>${data[num].allergy}<br><br>스캔 날짜: ${data[num].time}
        <br><br><button onclick="hideDetail()">닫기</button>`;
    });
}
//팝업창 닫기(dashboard.html)
function hideDetail() {
  popupSpecific.style.display = "none";
}

//카메라 눌렀을 때 스캔 확인 창(오클릭 방지)
function showConfirm() {
  popupConfirm.style.display = "flex";
}
//팝업창 닫기(index.html)
function hidePopup() {
  popupConfirm.style.display = "none";
  popupScanning.style.display = "none";
}
//AI가 사진을 처리하는 중에 보이는 ux추가
async function waitResult() {
  foodData = "";
  while (1) {
    await sleep(1);
    if (scanLoading.textContent != "스캔 중...") scanLoading.textContent += ".";
    else {
      scanLoading.textContent = "스캔 중";
      getImageData();
      if (foodData != "") {
        break;
      }
    }
  }
}
//스캔 확인 창에서 선택한 값에 따른 작동 (네 / 아니오)
async function confirmScan(bool) {
  if (bool) {
    hidePopup();
    popupScanning.style.display = "flex";
    await gpio_mains();
    await waitResult();
    hidePopup();
    compareAllergy();
  } else {
    hidePopup();
  }
}

//카메라 사진 촬영 후 서버로 전송
function uploadPic() {
  var video = document.getElementById("video");
  var canvas = document.getElementById("canvas");
  var context = canvas.getContext("2d");
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  var imageData = canvas
    .toDataURL("image/jpeg")
    .replace(/^data:image\/jpeg;base64,/, "");
  console.log(imageData);

  fetch(server_ip + "/ImgSend", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data: imageData }),
  })
    .then((response) => response.json())
    .then((data) => console.log("Server response:", data))
    .catch((error) =>
      console.error("Error capturing and uploading photo:", error)
    );
}

//AI 사진 처리 후 저장된 데이터 받기
function getImageData() {
  foodData = "";
  fetch(server_ip + "/ImgReceive")
    .then((response) => response.json())
    .then((data) => {
      foodData = JSON.parse(data);
        console.log(foodData);
        console.log(foodData.name);
        ttsSpeak(
            `"식품명은" ${foodData.name}, 유통기한은 ${foodData.date}까지 입니다.`
      );
    })
    .catch((error) => {
      console.error(error);
    });
}

// 스캔한 음식의 알레르기 식품과 사용자의 알레르기를 비교하기 위해 서버에서 사용자 알레르기 정보 호출
function compareAllergy() {
  fetch(server_ip + "/getUser") 
    .then((response) => response.json())
    .then((data) => {
        data.forEach((user) => {
            foodData.allergy.forEach((allergy) => {
                console.log(user);
          if (user.allergy == allergy) {
            ttsSpeak(`해당 식품 ${foodData.name}에 ${user.name}님의 알레르기 유발식품인 
                    ${allergy}, 함유되어 있습니다. 섭취에 주의 바랍니다.`);
          }
        });
      });
    })
    .catch((error) => {
      console.error("오류 발생:", error);
    });
}
