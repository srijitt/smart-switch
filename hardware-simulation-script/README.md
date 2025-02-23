# Smart Switch Hardware Simulation

📂 `hardware-simulation-script/`  
**This contains the script to be fed into the hardware component (ESP32-based iot devices). Each switch has a common sim script with unique topic ID. Here, we have provided 2 such example scripts.**

---

## 🧠 Overview
This directory contains the **reference implementation** for smart switch firmware communicating with our IoT control system. While each physical switch has device-specific code (unique client IDs, security credentials, and GPIO mappings), this template demonstrates the core functionality common to all devices in the ecosystem.

---

## 🔧 Key Features
1. **MQTT Protocol Implementation**

2. **Dual Command Support**
   ```json
   {
     // WiFi credentials update
     "ssid": "HomeNet",
     "password": "securepass123"
   }
   ```
   ```plaintext
   ON  // Toggle command
   OFF // Toggle command
   ```

3. **Simulation Modes**
   - AP mode (Access Point)
   - STA mode (Station)

--- 

## 🚀 Quick Start
1. **Install Dependencies**
   ```bash
   pip install paho-mqtt
   ```

2. **Run Simulation**
   ```bash
   python switchXXX.py // XXX = unique topic
   ```


---

## 🔄 System Workflow
```mermaid
graph TD
    A[Control Panel] -->|Publish Commands| B(MQTT Broker)
    B -->|Route to Device Topic| C[Hardware Simulation]
    C -->|Execute Command| D{Physical Hardware}
    C -->|Store Config| E[Device Memory]
    
    style A fill:#4a90e2,stroke:#333
    style B fill:#7ed321,stroke:#333
    style C fill:#f5a623,stroke:#333
    style D fill:#d0011b,stroke:#333
    style E fill:#9013fe,stroke:#333
