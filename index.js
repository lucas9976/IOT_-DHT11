const SerialPort = require('serialport');
const ReadlineParser = require('@serialport/parser-readline');
const mqtt = require('mqtt');

const port = new SerialPort({
  path: 'COM3',
  baudRate: 9600
});

const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

const client = mqtt.connect('mqtt://localhost:1883');
const topic = 'sensor/mqtt';

client.on('connect', () => {
  console.log('Conectado ao broker MQTT!');
});

parser.on('data', (line) => {
  try {
    const data = JSON.parse(line.trim());
    console.log('Recebido:', data);
    client.publish(topic, JSON.stringify(data));
    console.log('Publicado no MQTT:', data);
  } catch (err) {
    console.error('Erro ao parsear:', line);
  }
});
   