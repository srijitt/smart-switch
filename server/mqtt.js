const mqtt = require('mqtt');
const host = 'wss://broker.hivemq.com:8884/mqtt';
// const topic = 'iema/smart/1';
const options = {
    keepalive: 60,
    clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
    protocolId: 'MQTT',
    protocolVersion: 4,
    clean: true,
    username: 'IEMA@2024',
    password: 'Pass@IEMA2024',
    reconnectPeriod: 1000,
    connectTimeout: 30 * 1000,
    will: {
        topic: 'WillMsg',
        payload: 'Connection Closed abnormally..!',
        qos: 0,
        retain: false
    },
    rejectUnauthorized: false
};

const client = mqtt.connect(host, options);

client.on('error', (err) => {
    console.error('MQTT error', err);
});

client.on('reconnect', () => {
    console.log('Reconnecting...');
});

client.on('connect', () => {
    console.log('MQTT connected');
});

module.exports = {client};