const express = require("express")();
const httpServer = require("http").createServer();

const https = require("https"),
  fs = require("fs");

let options = {};
if (process.env.NODE_ENV === "production") {
  options = {
    key: fs.readFileSync("/etc/letsencrypt/live/leameen.com/privkey.pem"),
    cert: fs.readFileSync("/etc/letsencrypt/live/leameen.com/cert.pem"),
    ca: fs.readFileSync("/etc/letsencrypt/live/leameen.com/chain.pem"),
  };
}

const httpsServer = https.createServer(options, express);

module.exports = {
  httpsServer,
  httpServer,
};
