import paho.mqtt.client as mqtt
import json


BROKER = "broker.hivemq.com"
PORT = 8884
TOPIC = "SM103"  # unique for each switch
CLIENT_ID = "SMART_SWITCH_SIM"
USERNAME = "stephen"
PASSWORD = "stephenmqtt"

# Simulated switch state
current_state = False
wifi_config = {"ssid": "", "password": ""}

def on_connect(client, userdata, flags, rc):
    print(f"Connected to broker with result code {rc}")
    client.subscribe(TOPIC)
    print(f"Subscribed to topic: {TOPIC}")
    print("Waiting for commands...")

def on_message(client, userdata, msg):
    global current_state, wifi_config
    payload = msg.payload.decode()
    
    try:
        # JSON parsing, wifi config
        config = json.loads(payload)
        if "ssid" in config and "password" in config:
            wifi_config = config
            print(f"\nNew WiFi Configuration Received:")
            print(f"SSID: {wifi_config['ssid']}")
            print(f"Password: {wifi_config['password']}")
            print("Simulating WiFi connection...")
            return
            
    except json.JSONDecodeError:
        # toggle
        if payload.upper() in ["ON", "OFF"]:
            current_state = (payload.upper() == "ON")
            update_hardware_state()
        else:
            print(f"Unknown command received: {payload}")

def update_hardware_state():
    state = "ON" if current_state else "OFF"
    print(f"\nSwitch state changed: {state}")
    # GPIO.output(RELAY_PIN, current_state)

# MQTT Client
client = mqtt.Client(
    client_id=CLIENT_ID,
    transport="websockets"
)

client.username_pw_set(USERNAME, PASSWORD)
client.tls_set()

client.on_connect = on_connect
client.on_message = on_message

client.connect(BROKER, PORT, 60)

print("Smart Switch Simulation Started")
client.loop_forever()