require('dotenv').config();

const http = require('http');

const receiverHost = process.env.RECEIVER_HOST;
const receiverPort = process.env.RECEIVER_PORT;
const measurementId = process.env.MEASUREMENT_ID;

const reportingIntervalTime = 1000 * 10;

if (!receiverHost || !receiverPort || !measurementId) {
  console.log('You must create and configure a .env file');
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

const report = value => http.get(createRequestOptions(value), handleResponse);

setInterval(() => {
  const value = Math.random() * 50;
  report(value);
  console.log(`Reported: ${value}`);
}, reportingIntervalTime);

console.log('Started External Temperature Reporter');
