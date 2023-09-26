var bridge = new WebOSServiceBridge();
var bridge2 = new WebOSServiceBridge();

var url, params, sentence, temp;

function voiceStart() //음성인식 시작
{ 
  url = 'luna://com.webos.service.ai.voice/start';
  params = {
    "mode": "continuous",
    "keywordDetect": true
  };
  bridge.call(url, JSON.stringify(params));
}

function voiceStartOne() //음성인식 시작
{ 
  url = 'luna://com.webos.service.ai.voice/start';
  params = {
    "mode": "single",
    "keywordDetect": false
  };
  bridge2.call(url, JSON.stringify(params));
}

function voiceStop() //음성인식 종료
{
  url = 'luna://com.webos.service.ai.voice/stop';
  params = {};
  bridge.call(url, JSON.stringify(params));
}

function voiceGetResponse() //음성인식 응답
{
  url = 'luna://com.webos.service.ai.voice/getState';
  bridge.onservicecallback = getResponse;
  params = {
    "subscribe": true
  };
  bridge.call(url, JSON.stringify(params));

  url = 'luna://com.webos.service.ai.voice/getResponse';
  bridge.onservicecallback = getResponse;
  params = {
    "subscribe": true
  };
  bridge.call(url, JSON.stringify(params));
}

function setVolume(volume)
{
  var url = 'luna://com.webos.service.audio/master/setVolume';
  var params = {
    "soundOutput": "pcm_output",
    "volume": volume*10
  };
  bridge.call(url, JSON.stringify(params));
}
function ttsSpeak()
{
  url = 'luna://com.webos.service.tts/speak';
  params = {
    "text": sentence+"라고 얘기했어요.",
    "language": "ko-KR"
  };
  bridge.call(url, JSON.stringify(params));
}

//음성인식
function aiVoiceStart()
{
  voiceStartOne();
}

//음성인식 응답값
function getResponse(msg) 
{
  console.log("check", msg);

  if(msg == `{"state":"thinking"}`){
    sentence = JSON.parse(temp).response.partial;
    console.log("sentence", sentence);
    ttsSpeak();
  }
  temp = msg;
}
