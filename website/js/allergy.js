//?°?΄?°λ₯? ?λ²λ‘λΆ??° λ°μ??? ?λ©΄μ μΆλ ₯
server_ip = "http://115.85.182.143:5501"

function fetchData() {
  fetch(server_ip + "/getUser")
    .then((response) => response.json())
    .then((data) => {
      const dataList = document.getElementById("dataList");
      dataList.innerHTML = ""; // κΈ°μ‘΄ λͺ©λ‘ μ΄κΈ°?
      data.forEach((user) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
        ?΄λ¦?: ${user.name} &#160/&#160 ?? λ₯΄κΈ°: ${user.allergy} &#160&#160
        <button onclick="deleteUser(${user.id})">?­? </button>`;
        dataList.appendChild(listItem); //λ³?? κ°κ°? κ°μ dataList? μΆκ??
      });
    })
    .catch((error) => {
      console.error("?€λ₯? λ°μ:", error);
    });
}

//?λ²? user.json? ?? ₯? κ°μ ????₯?? κΈ°λ₯
function save() {
  const name = document.getElementById("name").value;
  const allergy = document.getElementById("allergy").value;
  const user = { name, allergy };

  fetch(server_ip + "/saveUser", {
    method: "POST",
    headers: {
      "Content-Type": "application/json", //json ??? ??Ό? ?€λ£?.
    },
    body: JSON.stringify(user),
  })
    .then((response) => response.text())
    .then((message) => {
      console.log(message);
    });
}

//?°?΄?°λ₯? ?­? ?? κΈ°λ₯
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
      fetchData(); // ?°?΄?° ?­?  ? ?°?΄?° ?€? λΆλ¬?€κΈ?
    })
    .catch((error) => {
      console.error("?€λ₯? λ°μ:", error);
    });
}
