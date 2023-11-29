//데이터를 서버로부터 받아와 화면에 출력
function fetchData() {
  fetch("http://115.85.182.143:5501/getUser")
    .then((response) => response.json())
    .then((data) => {
      const dataList = document.getElementById("dataList");
      dataList.innerHTML = ""; // 기존 목록 초기화
      data.forEach((user) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
        이름: ${user.name} &#160/&#160 알레르기: ${user.allergy} &#160&#160
        <button onclick="deleteUser(${user.id})">삭제</button>`;
        dataList.appendChild(listItem); //변수 각각의 값을 dataList에 추가
      });
    })
    .catch((error) => {
      console.error("오류 발생:", error);
    });
}

//서버 user.json에 입력한 값을 저장하는 기능
function save() {
  const name = document.getElementById("name").value;
  const allergy = document.getElementById("allergy").value;
  const user = { name, allergy };

  fetch("http://115.85.182.143:5501/saveUser", {
    method: "POST",
    headers: {
      "Content-Type": "application/json", //json 형태의 파일을 다룸.
    },
    body: JSON.stringify(user),
  })
    .then((response) => response.text())
    .then((message) => {
      console.log(message);
    });
}

//데이터를 삭제하는 기능
function deleteUser(id) {
  fetch(`http://115.85.182.143:5501/deleteUser`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id }),
  })
    .then((response) => response.text())
    .then((message) => {
      console.log(message);
      fetchData(); // 데이터 삭제 후 데이터 다시 불러오기
    })
    .catch((error) => {
      console.error("오류 발생:", error);
    });
}
