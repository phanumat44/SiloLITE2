// mqttClient.js
const e = require('cors');
const mqtt = require('mqtt');

require('dotenv').config();


// Replace with your broker URL and credentials
const brokerUrl = process.env.MQTT_BROKER;
const options = {
    clientId: process.env.MQTT_CLIENT_ID,
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD,
    qos: parseInt(process.env.MQTT_QOS)
};

let client;

try{
 client = mqtt.connect(brokerUrl, options);
} catch (err) {
    console.error(err);
}

if (!client) {
    console.error("Failed to connect to MQTT broker");
    throw new Error("Failed to connect to MQTT broker");
} else {
    console.log("Connected to MQTT broker");
}
    

module.exports = client;