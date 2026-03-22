# 🥇 EquiFlow AI: Smart Water Pressure Management

# 💧 Intelligent Water Management System

## 🚀 Overview
A real-time IoT-based system that monitors water flow and pressure, detects anomalies, and automatically controls the pipeline while providing live dashboard updates and instant alerts.

---

## 🎯 Problem
Traditional water systems are manual, reactive, and lack real-time monitoring, leading to water wastage, leaks, and delayed response.

---

## 💡 Solution
A closed-loop intelligent system that:
- Monitors flow and pressure  
- Detects abnormal conditions  
- Automatically controls water flow  
- Sends alerts and updates dashboard  

---

## ⚙️ Architecture

 <img width="979" height="794" alt="image" src="https://github.com/user-attachments/assets/d5f8b62b-8e37-4c35-bee4-bf9d6ae220e5" />

---

## 🔧 Components
- ESP32  
- YF-S401 Flow Sensor  
- Potentiometer (pressure simulation)  
- Relay Module  
- DC Pump  
- Buzzer & LEDs  
- Power Supply + Buck Converter  

---

## 💻 Tech Stack
- Arduino IDE (Embedded C++)  
- Firebase Realtime Database  
- HTML, CSS, JavaScript (Dashboard)  
- Chart.js  
- Telegram Bot API  

---

## 🔄 Working
1. Sensors collect data  
2. ESP32 processes and detects anomalies  
3. System triggers:
   - 🟢 Normal  
   - 🟡 Warning  
   - 🔴 Critical  
4. In critical:
   - Valve closes  
   - Buzzer alerts  
   - Telegram notification sent  
5. Data updates to Firebase  
6. Dashboard shows live data  
7. User can control system remotely  

---

## 🤖 AI/ML
Rule-based anomaly detection with future scope for ML-based prediction and forecasting.

---

## ⚠️ Limitations
- Potentiometer used for pressure simulation  
- Single-node prototype  
- Requires Wi-Fi  

---

## 🚀 Future Scope
- Replace with industrial pressure sensor (G1/4)  
- AI-based predictive analytics  
- Smart city deployment  
- Mobile app integration  

---

## ▶️ Setup
1. Upload code to ESP32  
2. Connect hardware  
3. Power ON  
4. Connect WiFi  
5. Open dashboard  
6. Monitor & control system  

---

## 🌍 Impact
- Reduces water wastage  
- Prevents pipeline damage  
- Enables smart water infrastructure  

---

## 🏁 Conclusion
A scalable, low-cost, intelligent system for real-time water monitoring and automated control.

---

## 📌 One Line
> Detects, decides, and acts — making water systems intelligent.

---

## 👩‍💻 Team
- Shreya B Yadav
