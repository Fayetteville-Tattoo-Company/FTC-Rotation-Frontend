const express = require('express');
const path = require('path');
const server = express();
const cors = require('cors');
const {display, log} = require('./src/tools');
const port = process.env.PORT || 3000;

server.use(cors());
server.use(express.static(path.join(__dirname, 'build')));

server.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

server.listen(port, (err) => !err ? display(`RUNNING PRODUCTION ENVIORNMENT`) : display('ERROR CONNECTING'));
