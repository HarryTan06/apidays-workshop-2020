const express = require("express");
const { join } = require("path");
const morgan = require("morgan");
const helmet = require("helmet");
const https = require('https');
const fs = require('fs');

const app = express();
const key = fs.readFileSync('./my-website-key.pem');
const cert = fs.readFileSync('./my-website.pem');

app.use(morgan("dev"));
app.use(helmet());
app.use(express.static(join(__dirname, "public")));

app.get("/auth_config.json", (req, res) => {
  res.sendFile(join(__dirname, "auth_config.json"));
});

app.get("/*", (_, res) => {
  res.sendFile(join(__dirname, "index.html"));
});

process.on("SIGINT", function() {
  process.exit();
});


const myWebsite = (() => {
  https.createServer({key, cert}, app).listen('3000', () => {
    console.log('Listening on https://my-website:3000');
  });
})();

module.exports = myWebsite;
