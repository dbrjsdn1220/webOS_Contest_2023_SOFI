var bridge = new WebOSServiceBridge();

function cam_check()
{
    var ur1 = 'luna://com.webos.service.camera2/close';
}

function checkMic()
{
    //음성인식 시작
    var url = 'luna://com.webos.service.ai.voice/start';
    bridge.onservicecallback = AiVoiceStartCallback
    var params = {
        "mode": "continuous",
        "keywordDetect": true
    };
    bridge.call(url, JSON.stringify(params));

    //음성인식 진행 상태 받아옴
    url = 'luna://com.webos.service.ai.voice/getState';
    bridge.onservicecallback = AiVoiceGetStateCallback
    params = {
        "subscribe": true
    };
    bridge.call(url, JSON.stringify(params));
}

function AiVoiceStartCallback(msg)
{
    var response = JSON.parse(msg);
    console.log(response);
}

function AiVoiceGetStateCallback(msg)
{
    var response = JSON.parse(msg);
    console.log(response);
}