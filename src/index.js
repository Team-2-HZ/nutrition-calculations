const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const bearer = "Bearer miTQ1NwbocCI?A2uyop1?VN=l3wh?kebR6WuepYJCOFfzWqGImXfiO/Ksed5pAxQBP8km8qU!6RmhehCPlF5D7TZm?R8w4bH8JpQXxrgABVDfAHyC9yBp3M2zxCQN13-oSf-fJhqjY-X9HlyMyq6y3Rm486eOx5VGWt!upDx-Y3CorzLs747otpnGEcfOQozNoSzJqlC!PZGypR22j/2DD1jzuCml!eHjfkX=sT8lQYqabuOnAJ/fhI6HKdo1p0X"

// defining the Express app
const app = express();
// defining an array to work as the database (temporary solution)
const response = [
  {title: 'Hello, world (again)!'}
];

// adding Helmet for API's security
app.use(helmet());

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// enabling CORS for all requests
app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan('combined'));

// test endpoint
app.get('/test', (req, res) => {
  if (req.headers.authorization !== bearer) {
    res.status(401);
    res.send("Unauthorized");
    return;
  }
  // if authorized, send test response
  res.send("Test passed. Bearer working.");
});

// starting the server
app.listen(3042, () => {
  console.log('listening on port 3042');
});
