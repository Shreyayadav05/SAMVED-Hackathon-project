#include <WiFi.h>
#include <HTTPClient.h>
#include <Firebase_ESP_Client.h>

// ===== WiFi Credentials =====
const char* ssid = "YOUR_WIFI";
const char* password = "YOUR_PASSWORD";

// ===== Firebase =====
#define API_KEY "YOUR_FIREBASE_API_KEY"
#define DATABASE_URL "https://your-project-id.firebaseio.com/"

FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

// ===== Telegram =====
String BOT_TOKEN = "8763840438:AAGFWoQXq4eFkLEr-uZTK0LeWoBHyFGoUfU";
String CHAT_ID = "6948428956";

// ===== Pins =====
const int FLOW_SENSOR_PIN = 4;   
const int PRESSURE_PIN    = 32;  
const int VALVE_RELAY_PIN = 26;  
const int BUZZER_PIN      = 33;  
const int RED_LED_PIN     = 21;  
const int YELLOW_LED_PIN  = 22;  
const int GREEN_LED_PIN   = 23;  

// ===== Flow =====
volatile int pulseCount = 0;     
float flowRate = 0.0;
unsigned long oldTime = 0;

// ===== Thresholds =====
const int WARNING_PRESSURE_LIMIT = 2000; 
const int HIGH_PRESSURE_LIMIT    = 3000; 
bool alertSent = false;

// ===== Interrupt =====
void IRAM_ATTR pulseCounter() {
  pulseCount++;
}

void setup() {
  Serial.begin(115200);

  pinMode(FLOW_SENSOR_PIN, INPUT_PULLUP);
  pinMode(PRESSURE_PIN, INPUT);
  pinMode(VALVE_RELAY_PIN, OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(RED_LED_PIN, OUTPUT);
  pinMode(YELLOW_LED_PIN, OUTPUT);
  pinMode(GREEN_LED_PIN, OUTPUT);

  attachInterrupt(digitalPinToInterrupt(FLOW_SENSOR_PIN), pulseCounter, FALLING);

  // ===== WiFi =====
  Serial.println("Connecting to WiFi...");
  WiFi.begin(ssid, password);

  unsigned long startAttemptTime = millis();

  while (WiFi.status() != WL_CONNECTED && millis() - startAttemptTime < 10000) {
    digitalWrite(YELLOW_LED_PIN, HIGH); delay(250);
    digitalWrite(YELLOW_LED_PIN, LOW); delay(250);
    Serial.print(".");
  }

  if (WiFi.status() == WL_CONNECTED) {
    digitalWrite(GREEN_LED_PIN, HIGH);
    Serial.println("\nWiFi Connected!");
  } else {
    Serial.println("\nWiFi Failed!");
  }

  // ===== Firebase Init =====
  config.api_key = API_KEY;
  config.database_url = DATABASE_URL;

  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);

  Serial.println("Firebase Connected");

  digitalWrite(VALVE_RELAY_PIN, HIGH);
  digitalWrite(BUZZER_PIN, LOW);
  delay(1000);
}

void loop() {
  int pressureValue = analogRead(PRESSURE_PIN);

  if ((millis() - oldTime) > 1000) {

    detachInterrupt(digitalPinToInterrupt(FLOW_SENSOR_PIN));
    flowRate = ((1000.0 / (millis() - oldTime)) * pulseCount) / 7.5; 
    oldTime = millis();
    pulseCount = 0;
    attachInterrupt(digitalPinToInterrupt(FLOW_SENSOR_PIN), pulseCounter, FALLING);

    Serial.print("Dial: ");
    Serial.print(pressureValue);
    Serial.print(" | Flow: ");
    Serial.print(flowRate);
    Serial.print(" L/min");

    String status = "NORMAL";

    if (pressureValue >= HIGH_PRESSURE_LIMIT) {
      Serial.println(" | 🔴 CRITICAL");

      digitalWrite(RED_LED_PIN, HIGH);
      digitalWrite(YELLOW_LED_PIN, LOW);
      digitalWrite(GREEN_LED_PIN, LOW);
      digitalWrite(VALVE_RELAY_PIN, LOW);
      digitalWrite(BUZZER_PIN, HIGH);

      status = "CRITICAL";

      if (!alertSent) {
        sendTelegramAlert("🚨 CRITICAL ALARM! Pressure Spike Detected.");
        alertSent = true;
      }

    } else if (pressureValue >= WARNING_PRESSURE_LIMIT) {
      Serial.println(" | 🟡 WARNING");

      digitalWrite(RED_LED_PIN, LOW);
      digitalWrite(YELLOW_LED_PIN, HIGH);
      digitalWrite(GREEN_LED_PIN, LOW);
      digitalWrite(VALVE_RELAY_PIN, HIGH);
      digitalWrite(BUZZER_PIN, LOW);

      status = "WARNING";
      alertSent = false;

    } else {
      Serial.println(" | 🟢 NORMAL");

      digitalWrite(RED_LED_PIN, LOW);
      digitalWrite(YELLOW_LED_PIN, LOW);
      digitalWrite(GREEN_LED_PIN, HIGH);
      digitalWrite(VALVE_RELAY_PIN, HIGH);
      digitalWrite(BUZZER_PIN, LOW);

      status = "NORMAL";
      alertSent = false;
    }

    // ===== FIREBASE SEND =====
    if (WiFi.status() == WL_CONNECTED) {
      Firebase.RTDB.setInt(&fbdo, "/sensor/pressure", pressureValue);
      Firebase.RTDB.setFloat(&fbdo, "/sensor/flow", flowRate);
      Firebase.RTDB.setString(&fbdo, "/system/status", status);
    }

    // ===== REMOTE CONTROL =====
    int remotePump;
    if (Firebase.RTDB.getInt(&fbdo, "/control/pump")) {
      remotePump = fbdo.intData();

      if (remotePump == 1) {
        digitalWrite(VALVE_RELAY_PIN, HIGH);
      } else {
        digitalWrite(VALVE_RELAY_PIN, LOW);
      }
    }
  }
}

// ===== TELEGRAM =====
void sendTelegramAlert(String customMessage) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;

    String url = "https://api.telegram.org/bot" + BOT_TOKEN +
                 "/sendMessage?chat_id=" + CHAT_ID +
                 "&text=" + urlencode(customMessage);

    http.begin(url);
    http.GET();
    http.end();
  }
}

// ===== URL ENCODE =====
String urlencode(String str) {
  String encoded = "";
  char c, code0, code1;
  for (int i = 0; i < str.length(); i++) {
    c = str.charAt(i);
    if (isalnum(c)) encoded += c;
    else {
      code1 = (c & 0xf) + '0';
      if ((c & 0xf) > 9) code1 = (c & 0xf) - 10 + 'A';
      c = (c >> 4) & 0xf;
      code0 = c + '0';
      if (c > 9) code0 = c - 10 + 'A';
      encoded += '%'; encoded += code0; encoded += code1;
    }
  }
  return encoded;
}
