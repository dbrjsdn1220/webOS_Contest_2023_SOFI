//?°?´?„°ë¥? ?„œë²„ë¡œë¶??„° ë°›ì•„??? ?™”ë©´ì— ì¶œë ¥
server_ip = "http://115.85.182.143:5501"

function fetchData() {
  fetch(server_ip + "/getUser")
    .then((response) => response.json())
    .then((data) => {
      const dataList = document.getElementById("dataList");
      dataList.innerHTML = ""; // ê¸°ì¡´ ëª©ë¡ ì´ˆê¸°?™”
      data.forEach((user) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
        ?´ë¦?: ${user.name} &#160/&#160 ?•Œ? ˆë¥´ê¸°: ${user.allergy} &#160&#160
        <button onclick="deleteUser(${user.id})">?‚­? œ</button>`;
        dataList.appendChild(listItem); //ë³??ˆ˜ ê°ê°?˜ ê°’ì„ dataList?— ì¶”ê??
      });
    })
    .catch((error) => {
      console.error("?˜¤ë¥? ë°œìƒ:", error);
    });
}

//?„œë²? user.json?— ?…? ¥?•œ ê°’ì„ ????¥?•˜?Š” ê¸°ëŠ¥
function save() {
  const name = document.getElementById("name").value;
  const allergy = document.getElementById("allergy").value;
  const user = { name, allergy };

  fetch(server_ip + "/saveUser", {
    method: "POST",
    headers: {
      "Content-Type": "application/json", //json ?˜•?ƒœ?˜ ?ŒŒ?¼?„ ?‹¤ë£?.
    },
    body: JSON.stringify(user),
  })
    .then((response) => response.text())
    .then((message) => {
      console.log(message);
    });
}

//?°?´?„°ë¥? ?‚­? œ?•˜?Š” ê¸°ëŠ¥
function deleteUser(id) {
  fetch(server_ip + "/deleteUser", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id }),
  })
    .then((response) => response.text())
    .then((message) => {
      console.log(message);
      fetchData(); // ?°?´?„° ?‚­? œ ?›„ ?°?´?„° ?‹¤?‹œ ë¶ˆëŸ¬?˜¤ê¸?
    })
    .catch((error) => {
      console.error("?˜¤ë¥? ë°œìƒ:", error);
    });
}
