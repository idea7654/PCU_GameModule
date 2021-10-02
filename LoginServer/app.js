const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const net = require("net");

const https = require("https");
const fs = require("fs");
const options = {
  key: fs.readFileSync("./privkey.pem"),
  cert: fs.readFileSync("./cert.pem"),
};

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(bodyParser.json());

let clients = [];
let tServer = net.createServer(function (client) {
  console.log("connection : " + client.remotePort);

  console.log("Client connection");
  console.log("   local = " + client.localAddress + ":" + client.localPort);
  console.log("   remote =" + client.remoteAddress + ":" + client.remotePort);
  //console.log("   client =" + JSON.stringify(client));

  //클라이언트 정보 저장
  clients.push({
    name: client.remotePort,
    client: client,
  });

  console.log("connection clients list : " + clients);
  client.setEncoding("utf8");

  client.on("data", function (data) {
    //logger.info('클라이언트로부터 받은 remort port  : '+ client.remotePort +' / 데이터 : '+ data.toString());
    //데이터를 발신한 소켓 클라이언트에게 메시지 발신
    //client.write('ok');
    console.log(JSON.parse(data));
    const jsonData = {
      Message: "LoginSuccess",
      nickname: "test",
    };

    client.write(Buffer.from(JSON.stringify(jsonData)));
  });

  client.on("end", function () {
    //클라이언트 소켓이 커넥션을 끊었을때
    console.log("end connection : " + client.remotePort);
    console.log(client.remoteAddress + " Client disconnected");
    let idx = clients.indexOf(clients.name);
    clients.splice(idx, 1);
    console.log(clients);
  });

  client.on("error", function (err) {
    console.log("Socket Error: ", JSON.stringify(err));
  });

  client.on("timeout", function () {
    console.log("Socket Timed out");
  });
});

tServer.listen(8605, function () {
  console.log("TCP Server listening on : " + JSON.stringify(tServer.address()));
  tServer.on("close", function () {
    console.log("Server Terminated");
  });
  tServer.on("error", function (err) {
    console.log("Server Error: ", JSON.stringify(err));
  });
});

https.createServer(options, app).listen(8606);
