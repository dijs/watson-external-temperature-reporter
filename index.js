require('dotenv').config();

const http = require('http');
const sensor = require('ds18b20-raspi');

const receiverHost = process.env.RECEIVER_HOST;
const receiverPort = process.env.RECEIVER_PORT;
const measurementId = process.env.MEASUREMENT_ID;
const reportingIntervalTime = process.env.REPORTING_TIME || (1000 * 10);

if (!receiverHost || !receiverPort || !measurementId) {
  console.log('You must create and configure a .env file');
  process.exit();
}

const sensorList = sensor.list();

if (sensorList.length === 0) {
  console.log('No sensors found');
  process.exit();
}

function createRequestOptions(value) {
  return {
    hostname: receiverHost,
    port: receiverPort,
    path: `/measurement/${measurementId}/${value}`,
    agent: false,
  };
}

function handleResponse(res) {
  const statusCode = res.statusCode;
  if (statusCode !== 200) {
    console.log(`Report Failed with Status Code: ${statusCode}`);
  }
}

const report = value => {
  try {
    http.get(createRequestOptions(value), handleResponse);
  } catch (e) {
    console.log('Could not report data', e);
  }
}

function takeReading() {
  const sensorReadings = sensor.readAllC();
  if (sensorReadings.length === 0) {
    console.log('No sensors readings');
    return;
  }
  const value = sensorReadings[0].t;
  report(value);
  console.log(`Reported: ${value}`);
}

setInterval(takeReading, reportingIntervalTime);

console.log('Started External Temperature Reporter');
