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

//let rankings = [{ gameName: "test", data: [] }];

//const dbJson = fs.readFileSync("db.json");
//const rankings = JSON.parse(dbJson);

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(bodyParser.json());

app.get("/:id", (req, res) => {
  const dbJson = fs.readFileSync("db.json");
  const rankings = JSON.parse(dbJson);
  const index = rankings.AllInfo.findIndex(
    (i) => i.gameName == req.query.gameName
  );
  if (index != -1) {
    res.json(rankings.AllInfo[index]);
  } else {
    res.send("Invalid Game");
  }
});

app.post("/", async (req, res) => {
  const dbJson = fs.readFileSync("db.json");
  const rankings = JSON.parse(dbJson);
  if (req.body.gameName && req.body.userName && req.body.score) {
    const index = rankings.AllInfo.findIndex(
      (i) => i.gameName == req.body.gameName
    );
    if (index != -1) {
      const userIndex = rankings.AllInfo[index].data.findIndex(
        (i) => i.userName == req.body.userName
      );
      if (userIndex == -1) {
        await rankings.AllInfo[index].data.push({
          userName: req.body.userName,
          score: req.body.score,
          rank: 0,
        });
      } else {
        rankings.AllInfo[index].data[userIndex].score = req.body.score;
      }
      await rankings.AllInfo[index].data.sort((a, b) => {
        return a.score > b.score ? -1 : a.score < b.score ? 1 : 0;
      });

      await rankings.AllInfo[index].data.forEach((i, index) => {
        i.rank = index + 1;
      });
      await res.json(rankings.AllInfo[index]);
    } else {
      res.send("Invalid Game");
    }
  } else {
    res.send("Invalid Data Type");
  }
  const dbToJson = JSON.stringify(rankings);
  fs.writeFileSync("db.json", dbToJson);
});

https.createServer(options, app).listen(8600);
//app.listen(8600);
