const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

const https = require("https");
const fs = require("fs");
const options = {
  key: fs.readFileSync("./privkey.pem"),
  cert: fs.readFileSync("./cert.pem"),
};

let rankings = [{ gameName: "test", data: [] }];

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(bodyParser.json());

app.get("/", (req, res) => {
  console.log("응답있음");
  res.send("test");
});

app.post("/", (req, res) => {
  console.log(req.body);
  if (req.body.gameName && req.body.userName && req.body.score) {
    //res.send("하위");
    const index = rankings.findIndex((i) => i.gameName == req.body.gameName);
    if (index != -1) {
      const userIndex = rankings[index].data.findIndex(
        (i) => i.userName == req.body.userName
      );
      if (userIndex == -1) {
        rankings[index].data.push({
          userName: req.body.userName,
          score: req.body.score,
        });
      } else {
        rankings[index].data[userIndex].score = req.body.score;
      }
      //res.status(200).json(rankings[index]);
      res.json(rankings[index]);
    } else {
      res.send("Invalid Game");
    }
  } else {
    res.send("Invalid Data Type");
  }
});

https.createServer(options, app).listen(8600);
// app.listen(8600);
