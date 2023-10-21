var BridgeVoice = new WebOSServiceBridge();
var BridgeGpio = new WebOSServiceBridge();
const allergies = ["계란", "우유", "메밀", "땅콩", "대두", "밀", "고등어", "게", "새우", "돼지고기", "복숭아", "토마토", "아황산류", "호두", "닭고기", "쇠고기", "오징어", "조개류", "잣"];
var url, params, sentence, temp, foodData;

//음성인식 시작
function voiceStart() { 
    url = 'luna://com.webos.service.ai.voice/start';
    params = {
        "mode": "continuous",
        "keywordDetect": true
    };
    BridgeVoice.call(url, JSON.stringify(params));
}

//음성인식 응답 값 확인하기 위한 LS2 API 호출
function voiceGetResponse() {
    url = 'luna://com.webos.service.ai.voice/getState';
    BridgeVoice.onservicecallback = getResponse;
    params = {
        "subscribe": true
    };
    BridgeVoice.call(url, JSON.stringify(params));

    url = 'luna://com.webos.service.ai.voice/getResponse';
    BridgeVoice.onservicecallback = getResponse;
    params = {
        "subscribe": true
    };
    BridgeVoice.call(url, JSON.stringify(params));
}

//음성인식 응답값 출력
function getResponse(msg) 
{
    console.log(msg);
    if(msg == `{"state":"recording"}`) {
        ttsSpeak("말씀하세요");
    }
    else if(msg == `{"state":"thinking"}`) {
        sentence = JSON.parse(temp).response.partial;
        console.log("sentence", sentence);
        selectAction();
    }
    temp = msg;
}

//tts 사용
function ttsSpeak(tts) {
    url = 'luna://com.webos.service.tts/speak';
    params = {
        "text": tts,
        "language": "ko-KR"
    };
    BridgeVoice.call(url, JSON.stringify(params));
}

//음성인식 사용자 작동 설계
function selectAction(){
    let Array = sentence.split(' ');
    
    //도움말 관련 명령어!
    if(Array[0] == "도움말") {
        if (Array[1] == "스캔") {
        ttsSpeak(
            `물건을 스캔하여 식품명과 유통기한을 확인합니다. 명령어는 '스캔 해 줘' 입니다.
            '스캔 정보' 명령어를 사용하면 가장 최근에 스캔한 3개의 음식 정보를 음성으로 안내합니다.`);
        }
        else if (Array[1] == "알러지" || Array[1] == "알레르기") {
        ttsSpeak(
            `알레르기를 등록하여 스캔한 식품에 해당 알레르기 유발 물질이 들었을 경우 경고합니다. 
            명령어는 '알레르기 등록 ', '알레르기 정보', '알레르기 삭제' 3가지 입니다. 
            '알레르기 등록' 명령은 '알레르기 등록, 이름, 식품'의 방식으로 사용할 수 있습니다. 
            예를 들어 '알레르기 등록, 홍길동, 돼지고기'라고 얘기하시면 됩니다.
            등록 가능한 알레르기 유발 식품에는 ${allergies}이 있습니다.
            다음 명령어로 '알레르기 정보'라고 얘기하시면 지금까지 등록된 정보를 알려줍니다. 
            '알레르기 삭제' 명령의 경우, '알레르기 정보' 명령어를 통해 알아낸 고유번호를 사용하여 저장된 정보를 삭제합니다. 
            예를 들어 '알레르기 삭제 1번'이라고 얘기하시면 1번에 저장된 정보가 삭제됩니다.`
        );
        }
        else if (Array[1] == "음량") {
        ttsSpeak("음량을 조절합니다. 명령어는 '음량 조절, 숫자'입니다. 숫자의 범위는 0부터 100까지입니다.");
        }
        else
        ttsSpeak(
            `'스캔', '알레르기', '음량'과 관련된 명령어를 사용하실 수 있습니다. 자세한 설명은 '도움말 스캔',
            '도움말 알레르기', '도움말 음량'을 이용해 들을 수 있습니다"`
        );
    }

    //스캔 관련 명령어!
    else if(sentence == "스캔 해 줘") {
        ttsSpeak("물건을 스캔합니다. 안전을 위해 기계를 건들이지 말아주세요.");
        uploadPic();
        getImageData();
        compareAllergy();
        //gpio_mains();
    }
    else if(sentence == "스캔 정보") {
        fetch('http://115.85.182.143:5501/getFood')
        .then(response => response.json())
        .then(data => {
            let dataLength = Object.keys(data).length;
            for(let i=dataLength-1; i!=dataLength-4; i--) {
                if (dataLength-i>=0) {
                    ttsSpeak(
                        `'식품명': ${data[i].name}, '유통기한': ${data[i].date},
                        '알레르기 유발 식품': ${data[i].allergy}, '스캔 날짜': ${data[i].time}`
                    );
                }
                else { break; }
            }
        });
    }

    //음량 조절 명령어!
    else if(Array[0] == "음량" && Array[1] == "조절") {
        if(parseInt(Array[2]) >= 0 && parseInt(Array[2]) <= 100) {
        setVolume(parseInt(Array[2]));
        ttsSpeak(`음량이 ${Array[2]}으로 설정되었습니다.`);
        }
        else {
        ttsSpeak("잘못된 숫자 범위입니다. 0부터 100까지 설정 가능합니다.");
        }
    }

    //알러지 관련 명령어!
    else if(Array[0] == "알러지" || Array[0] == "알레르기")
    {
        if(Array[1] == "등록") {
        const name = Array[2];
        const allergy = Array[3];
        const user = { name, allergy };
        
        //등록 가능한 알레르기 식품인지 확인
        for(let i in allergies) {
            if(Array[3] == allergies[i]){
            fetch('http://115.85.182.143:5501/saveUser', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            })
            .then(response => response.text())
            .then(message => {
                ttsSpeak(message);
                console.log(message);
            });
            break;
            }
            else if(i==18){
            ttsSpeak("등록 불가능한 알레르기 식품입니다. '도움말 알레르기' 명령어로 사용법을 확인해 보세요.");
            } 
        }
        }

        else if(Array[1] == "정보") {
        fetch('http://115.85.182.143:5501/getUser')
        .then(response => response.json())
        .then(data => {
            data.forEach(user => {
            ttsSpeak(`${user.id}번에 저장된 정보는 "이름" ${user.name} "알레르기" ${user.allergy}입니다.`);
            });
        });
        }
        else if(Array[1] == "삭제") {
        const id = Array[2].substring(0, 1);
        fetch(`http://115.85.182.143:5501/deleteUser`, {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({id})
        })
        .then(response => response.text())
        .then(message => {
            ttsSpeak(message);
            console.log(message);
        });
        }
        else
        ttsSpeak("잘못된 명령어입니다. '도움말 알레르기'로 사용법을 확인해보세요.");
    }

    else {
        ttsSpeak("잘못된 명령어 입니다. '도움말'로 사용법을 확인해보세요.");
    }
}