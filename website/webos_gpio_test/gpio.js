var bridge = new WebOSServiceBridge();

function checkMic()
{
    //음성인식 시작
    var url = 'luna://com.webos.service.ai.voice/start';
    bridge.onservicecallback = AiVoiceStartCallback();
    var params = {
        "mode": "continuous",
        "keywordDetect": true
    };
    bridge.call(url, JSON.stringify(params));

    //음성인식 응답
    url = 'luna://com.webos.service.ai.voice/getResponse';
    bridge.onservicecallback = AiVoiceGetResponseCallback();
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

function AiVoiceGetResponseCallback(msg)
{
    var response = JSON.parse(msg);
    console.log(response);
}