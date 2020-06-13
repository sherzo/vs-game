const express = require('express')();

const https = require('https'),
  fs = require('fs');

const options = {
  key: fs.readFileSync('/etc/letsencrypt/live/leameen.com/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/leameen.com/cert.pem'),
  ca: fs.readFileSync('/etc/letsencrypt/live/leameen.com/chain.pem')
};

const app = https.createServer(options, express);

exports.default = app;
