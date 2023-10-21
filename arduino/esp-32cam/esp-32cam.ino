#include "esp_camera.h"
#include "Arduino.h"
#include "FS.h"                // SD Card ESP32
#include "SD_MMC.h"            // SD Card ESP32
#include "soc/soc.h"           // Disable brownour problems
#include "soc/rtc_cntl_reg.h"  // Disable brownour problems
#include "driver/rtc_io.h"
#include <EEPROM.h>            // 플래시 메모리에서 읽고 쓰기
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include "base64.h"

//data시트 https://loboris.eu/ESP32/ESP32-CAM%20Product%20Specification.pdf
// Wi-Fi 정보
const char* ssid = "rtes-tplink";
const char* password = "1q2w3e4r";

const char* serverName = "http://115.85.182.143:5501/ImgSend";

// 액세스하려는 바이트 수를 정의하십시오
#define EEPROM_SIZE 1024

// 정의
#define PWDN_GPIO_NUM     32
#define RESET_GPIO_NUM    -1
#define XCLK_GPIO_NUM      0
#define SIOD_GPIO_NUM     26
#define SIOC_GPIO_NUM     27

#define Y9_GPIO_NUM       35
#define Y8_GPIO_NUM       34
#define Y7_GPIO_NUM       39
#define Y6_GPIO_NUM       36
#define Y5_GPIO_NUM       21
#define Y4_GPIO_NUM       19
#define Y3_GPIO_NUM       18
#define Y2_GPIO_NUM        5
#define VSYNC_GPIO_NUM    25
#define HREF_GPIO_NUM     23
#define PCLK_GPIO_NUM     22

int pictureNumber = 0;

void setup() {
  Serial.begin(115200);
  Serial.println("start");
  WRITE_PERI_REG(RTC_CNTL_BROWN_OUT_REG, 0); //브라운아웃 감지기 비활성화
 
  //Serial.setDebugOutput(true);
  //Serial.println();

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi..");
  }
  Serial.println("Connected to the WiFi network");

  camera_config_t config;
  config.ledc_channel = LEDC_CHANNEL_0;
  config.ledc_timer = LEDC_TIMER_0;
  config.pin_d0 = Y2_GPIO_NUM;
  config.pin_d1 = Y3_GPIO_NUM;
  config.pin_d2 = Y4_GPIO_NUM;
  config.pin_d3 = Y5_GPIO_NUM;
  config.pin_d4 = Y6_GPIO_NUM;
  config.pin_d5 = Y7_GPIO_NUM;
  config.pin_d6 = Y8_GPIO_NUM;
  config.pin_d7 = Y9_GPIO_NUM;
  config.pin_xclk = XCLK_GPIO_NUM;
  config.pin_pclk = PCLK_GPIO_NUM;
  config.pin_vsync = VSYNC_GPIO_NUM;
  config.pin_href = HREF_GPIO_NUM;
  config.pin_sscb_sda = SIOD_GPIO_NUM;
  config.pin_sscb_scl = SIOC_GPIO_NUM;
  config.pin_pwdn = PWDN_GPIO_NUM;
  config.pin_reset = RESET_GPIO_NUM;
  config.xclk_freq_hz = 20000000;
  config.pixel_format = PIXFORMAT_JPEG; 
  if(psramFound()){
    config.frame_size = FRAMESIZE_SVGA; // FRAMESIZE_ + QVGA|CIF|VGA|SVGA|XGA|SXGA|UXGA
    config.jpeg_quality = 10;
    config.fb_count = 2;
  } else {
    config.frame_size = FRAMESIZE_SVGA;
    config.jpeg_quality = 12;
    config.fb_count = 1;
  }
  Serial.printf("여기까지 진행");
  // 카메라 초기화
  esp_err_t err = esp_camera_init(&config);
  if (err != ESP_OK) {
    Serial.printf("Camera init failed with error 0x%x", err);
    return;
  }
  Serial.printf("통과");
 
}

void loop() {
  //Serial.println(digitalRead(1));
  if(digitalRead(4)==1)
  {
    cam_s();
  }
}

void cam_s()
{
  delay(100);
  pinMode(4, OUTPUT);  
 /*sd 카드에 저장
   //Serial.println("SD 카드 시작 중");
  if(!SD_MMC.begin()){
    Serial.println("SD Card Mount Failed");
    return;
  }
  
  uint8_t cardType = SD_MMC.cardType();
  if(cardType == CARD_NONE){
    Serial.println("No SD Card attached");
    return;
  }
*/
  camera_fb_t * fb = NULL;
  
  // 카메라로 사진 찍기
  fb = esp_camera_fb_get();  
  if(!fb) {
    Serial.println("Camera capture failed");
    return;
  }
  Serial.printf("사진찍음");
  
  //pictureNumber = EEPROM.read(0) + 1;

/*
  // SD 카드에 새 사진이 저장될 경로
  String path = "/picture" + String(pictureNumber) +".jpg";

  fs::FS &fs = SD_MMC; 
  Serial.printf("Picture file name: %s\n", path.c_str());
  
  File file = fs.open(path.c_str(), FILE_WRITE);
  if(!file){
    Serial.println("Failed to open file in writing mode");
  } 
  else {
    file.write(fb->buf, fb->len); //페이로드(이미지), 페이로드 길이
    Serial.printf("Saved file to path: %s\n", path.c_str());
    EEPROM.write(0, pictureNumber);
    EEPROM.commit();
  }
  file.close();
  */
  
  if (WiFi.status() == WL_CONNECTED) 
  {
    HTTPClient http;
    http.begin(serverName);
    http.addHeader("Content-Type", "application/json");

    if (!fb) {
      Serial.println("Camera capture failed");
      return;
    }

    String base64Image = base64::encode(fb->buf, fb->len);


    DynamicJsonDocument jsonDoc(1000000); // JSON 문서 크기 조정

    // JSON 객체를 문자열로 변환
    String jsonString;

    jsonDoc["data"] = base64Image;
    serializeJson(jsonDoc, jsonString);
    //Serial.println(jsonString); perint
    int httpResponseCode = http.POST(jsonString); // POST 


   if (httpResponseCode > 0) {
     Serial.print("HTTP Response code: ");
     Serial.println(httpResponseCode);

     String response = http.getString(); // 서버로부터 응답 내용을 문자열로 읽음
     Serial.print("Response: ");
     Serial.println(response);
    } 
     else {
      Serial.print("Error on sending GET: ");
      Serial.println(httpResponseCode);
    }

    http.end();
  } 
  else 
  {
    Serial.println("Error in WiFi conneㅁction");
  }

  esp_camera_fb_return(fb); 
  
  //GPIO 4에 연결된 ESP32-CAM 흰색 온보드 LED(플래시)를 끕니다
  /*
  digitalWrite(4, LOW);
  rtc_gpio_hold_en(GPIO_NUM_4);
  */
  
  Serial.println("Going to sleep now");
  delay(1000); 
  digitalWrite(4, LOW); 
  pinMode(4, INPUT);
  ESP.restart();
  delay(2100); 
}


