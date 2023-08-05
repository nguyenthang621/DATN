#include <Arduino.h>
#include <WiFi.h>
#include <WiFiMulti.h>
#include <WiFiClientSecure.h>
#include <math.h>

#include <ArduinoJson.h>
#include <HTTPClient.h>
#include <HardwareSerial.h>

#include "SocketIOclientMod.hpp"

#include "esp_camera.h"
#include "soc/soc.h"
#include "soc/rtc_cntl_reg.h"
#include "base64.h"

WiFiMulti WiFiMulti;
SocketIOclientMod socketIO;


// configuration for AI Thinker Camera board
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

#define TX_PIN 1    // Chân TX của ESP32 A
#define RX_PIN 3    // Chân RX của ESP32 A

#define USE_SERIAL Serial
// Wifi and socket config
const char* ssid     = "00000000"; 
const char* password = "khongcomatkhau"; 
const char* idCam    = "idCam";
boolean isConnectedRoom = true;

const char* server_host = "192.168.1.6"; 
const uint16_t server_port = 8000;
//const char* mqttTopic = "image_topic";
uint64_t fps = 15;

camera_config_t config;

void changeConfig(){
    //   Lưu trữ giá trị ban đầu của config.jpeg_quality
    int originalJpegQuality = config.jpeg_quality;
    // Thay đổi giá trị config.jpeg_quality lên mức chất lượng cao hơn
    config.jpeg_quality = 30;
    config.frame_size = FRAMESIZE_VGA; // FRAMESIZE_ + QVGA|CIF|VGA|SVGA|XGA|SXGA|UXGA 

      // Khởi tạo lại camera để áp dụng các thay đổi cấu hình
      esp_camera_deinit();
      delay(100);
      esp_camera_init(&config);
}

void resetConfig(){
      //   Lưu trữ giá trị ban đầu của config.jpeg_quality
    int originalJpegQuality = config.jpeg_quality;
    // Thay đổi giá trị config.jpeg_quality lên mức chất lượng cao hơn
    config.jpeg_quality = 4;
    config.frame_size = FRAMESIZE_VGA; // FRAMESIZE_ + QVGA|CIF|VGA|SVGA|XGA|SXGA|UXGA 

      // Khởi tạo lại camera để áp dụng các thay đổi cấu hình
      esp_camera_deinit();
      delay(100);
      esp_camera_init(&config);
}

void socketIOEvent(socketIOmessageType_t type, uint8_t * payload, size_t length) {
    switch(type) {
        case sIOtype_DISCONNECT:
             USE_SERIAL.printf("[IOc] Disconnected!\n");
             Serial1.println("server disconnected");
            break;
        case sIOtype_CONNECT:
            USE_SERIAL.printf("[IOc] Connected to url: %s\n", payload);
            Serial1.println("2");
            // join default namespace (no auto join in Socket.IO V3)
            socketIO.send(sIOtype_CONNECT, "/");
            if(isConnectedRoom){
               // creat JSON message for Socket.IO (event)
                DynamicJsonDocument doc(1024);
                JsonArray array = doc.to<JsonArray>();
        
                // add evnet name
                // Hint: socket.on('event_name', ....
                array.add("join_room_esp32");
        
                // add payload (parameters) for the event
                JsonObject param1 = array.createNestedObject();
                param1["room"] = idCam;
                // JSON to String (serializion)
                String output;
                serializeJson(doc, output);
        
                // Send event
                socketIO.sendEVENT(output);
            }
            break;
        case sIOtype_EVENT:
        {   
       
            char * sptr = NULL;
            int id = strtol((char *)payload, &sptr, 10);
//            USE_SERIAL.printf("[IOc] get event: %s id: %d\n", payload, id);
            if(id) {
                payload = (uint8_t *)sptr;
            }
            DynamicJsonDocument doc(1024);
            DeserializationError error = deserializeJson(doc, payload, length);
            if(error) {
                USE_SERIAL.print(F("deserializeJson() failed: "));
                USE_SERIAL.println(error.c_str());
                return;
            }
     
            String eventName = doc[0];
            String eventPayload = doc[1];
//            USE_SERIAL.printf("[IOc] event name: %s\n", eventName.c_str());

            // Message Includes a ID for a ACK (callback)
            if(eventName == idCam) {
                 Serial.println("Joined room");
                // creat JSON message for Socket.IO (event)
                DynamicJsonDocument doc(1024);
                JsonArray array = doc.to<JsonArray>();
        
                // add evnet name
                // Hint: socket.on('event_name', ....
                array.add("join_room_esp32");
        
                // add payload (parameters) for the event
                JsonObject param1 = array.createNestedObject();
                param1["room"] = idCam;
                // JSON to String (serializion)
                String output;
                serializeJson(doc, output);
        
                // Send event
                socketIO.sendEVENT(output);

//                changeConfig();

                // start send data
                isConnectedRoom = true;
                return;
            }
            // Client leave room
                if(eventName == "stop_video") { 
                 Serial.println("request stop cammera");
//                isConnectedRoom = false;               
                // creat JSON message for Socket.IO (event)
                DynamicJsonDocument doc(1024);
                JsonArray array = doc.to<JsonArray>();
        
                // add evnet name
                // Hint: socket.on('event_name', ....
                array.add("leave_room_esp32");
        
                // add payload (parameters) for the event
                JsonObject param1 = array.createNestedObject();
                param1["room"] = idCam;
                // JSON to String (serializion)
                String output;
                serializeJson(doc, output);
        
                // Send event
                socketIO.sendEVENT(output);

                resetConfig();

                // start send data
                return;
            }
              // request from client control 
                if(eventName == "response_direction_esp32") {                
                Serial.print("nhan dc direction......");
                Serial.println(eventPayload);
                changeConfigAndSendImage();
                return;
            }
                  // request from client change fps
                if(eventName == "set_fps_esp32") { 
                fps = eventPayload.toInt();
                return;
            }
                     // nhận dữ liệu đám cháy
                if(eventName == "response_data_image") { 
                  if(eventPayload != "null"){
                     Serial1.println(eventPayload);     
                  }               
                return;
            }
            
        }
            break;
        case sIOtype_ACK:
            USE_SERIAL.printf("[IOc] get ack: %u\n", length);
            break;
        case sIOtype_ERROR:
            USE_SERIAL.printf("[IOc] get error: %u\n", length);
            break;
        case sIOtype_BINARY_EVENT:
            USE_SERIAL.printf("[IOc] get binary: %u\n", length);
            break;
        case sIOtype_BINARY_ACK:
            USE_SERIAL.printf("[IOc] get binary ack: %u\n", length);
            break;
    }
}





// initial cam
esp_err_t init_camera() {
  
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

  // parameters for image quality and size
  config.frame_size = FRAMESIZE_VGA; // FRAMESIZE_ + QVGA|CIF|VGA|SVGA|XGA|SXGA|UXGA 
  config.jpeg_quality = 4; // Chất lượng nén JPEG (0-63), càng thấp càng nén mạnh
  config.fb_count = 2; // Chỉ sử dụng 2 framebuffer
  
  
  // Camera init
  esp_err_t err = esp_camera_init(&config);
  if (err != ESP_OK) {
    Serial.printf("camera init FAIL: 0x%x", err);
    return err;
  }
  sensor_t * s = esp_camera_sensor_get();
  
    s->set_brightness(s, 1);
    s->set_saturation(s, -2);

  s->set_framesize(s, FRAMESIZE_VGA);
  Serial.println("camera init OK");
  return ESP_OK;
};

void setup() {
    USE_SERIAL.begin(115200);
    Serial1.begin(115200, SERIAL_8N1, RX_PIN, TX_PIN);   // Khởi tạo giao tiếp UART
    USE_SERIAL.setDebugOutput(true);
    
      for(uint8_t t = 4; t > 0; t--) {
          USE_SERIAL.printf("[SETUP] BOOT WAIT %d...\n", t);
          USE_SERIAL.flush();
          delay(200);
      }

    WiFiMulti.addAP(ssid, password);

    //WiFi.disconnect();
    while(WiFiMulti.run() != WL_CONNECTED) {
        USE_SERIAL.printf(".");
        Serial.println(".");
        delay(200);
    }

    String ip = WiFi.localIP().toString();
    Serial1.println("1");
    USE_SERIAL.printf("[SETUP] WiFi Connected %s\n", ip.c_str());

    // server address, port and URL
    socketIO.begin(server_host, server_port, "/socket.io/?EIO=4");

    // event handler
    socketIO.onEvent(socketIOEvent);

    // init camera
    init_camera();

}

// Hàm gửi data sensor lên server
void senDataCam(){
      // creat JSON message for Socket.IO (event)
      DynamicJsonDocument doc(1024);
      JsonArray array = doc.to<JsonArray>();
      uint64_t now = millis();
      // add evnet name
      array.add("esp32_cam_send_data_sensor");
  
      // add payload (parameters) for the event
      JsonObject param1 = array.createNestedObject();
      param1["fps"] = "30";
      param1["distance"] = (uint32_t) now; // Khoảng cách (cảm biến âm)
  
      // JSON to String (serializion)
      String output;
      serializeJson(doc, output);
  
      // Send event
      socketIO.sendEVENT(output);
}

// Handle send image lên server
void sendImage(){
    // Camera configuration
    camera_fb_t *fb = NULL;
    // Take Picture with Camera
    fb = esp_camera_fb_get();  
    if(!fb) {
      Serial.println("Camera capture failed");
      return;
    }  
    socketIO.sendBIN(fb->buf,fb->len); 
//    senDataCam();   
    esp_camera_fb_return(fb); 
}

//--------------------

// Capture and send the image to the server
void captureAndSendImage() {
  // Take picture with the camera
  camera_fb_t* fb = esp_camera_fb_get();
  if (!fb) {
    Serial.println("Camera capture failed");
    return;
  }

  // Create an HTTP client instance
  HTTPClient http;
  
  // Connect to the server
  String url = "http://"+String(server_host)+":5000/api/v1/detect";
//   String url = "http://"+String(server_host)+":5000/detect";
  http.begin(url);

  // Set the headers (optional)
  http.addHeader("Content-Type", "image/jpeg");

  // Send the image data to the server
  http.addHeader("Content-Disposition", "attachment; filename=captured_image.jpg");
  http.addHeader("Content-Length", String(fb->len));
  int httpResponseCode = http.sendRequest("POST", (uint8_t*)fb->buf, fb->len);

  // Check the HTTP response code
  if (httpResponseCode == HTTP_CODE_OK) {
    Serial.println("Image sent successfully");
    // Đọc phản hồi từ API
  String response = http.getString();
  Serial.println("API response: " + response);
  } else {
    Serial.print("Image send failed, error code: ");
    Serial.println(httpResponseCode);
  }

  // End the HTTP connection and free the resources
  http.end();
  esp_camera_fb_return(fb);
}


//=======================================
void changeConfigAndSendImage(){
    
    //   Lưu trữ giá trị ban đầu của config.jpeg_quality
    int originalJpegQuality = config.jpeg_quality;
    isConnectedRoom = false;
    // Thay đổi giá trị config.jpeg_quality lên mức chất lượng cao hơn
    config.jpeg_quality = 4;
    config.frame_size = FRAMESIZE_VGA; // FRAMESIZE_ + QVGA|CIF|VGA|SVGA|XGA|SXGA|UXGA 

      // Khởi tạo lại camera để áp dụng các thay đổi cấu hình
      esp_camera_deinit();
      delay(100);
      esp_camera_init(&config);
      captureAndSendImage();
      captureAndSendImage();
      captureAndSendImage();
      captureAndSendImage();
      captureAndSendImage();
      // Khôi phục giá trị ban đầu của config.jpeg_quality
      config.jpeg_quality = originalJpegQuality;
      config.frame_size = FRAMESIZE_VGA; // FRAMESIZE_ + QVGA|CIF|VGA|SVGA|XGA|SXGA|UXGA 
      
        esp_camera_deinit();
      delay(100);
      isConnectedRoom = true;
      esp_camera_init(&config);

}



unsigned long messageTimestamp = 0;
void loop() {
    socketIO.loop();
    uint64_t now = millis();
 
    if(isConnectedRoom){
      if(now - messageTimestamp > round(1000/fps)) {
         messageTimestamp = now;
          sendImage();  
      }
    }
}
