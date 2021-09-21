const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

let rankings = [{ gameName: "test", data: [] }];

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(bodyParser.json());

app.post("/", (req, res) => {
  if (req.body.gameName && req.body.nickName && req.body.score) {
    //res.send("하위");
    const index = rankings.findIndex((i) => i.gameName == req.body.gameName);
    if (index != -1) {
      const userIndex = rankings[index].data.findIndex(
        (i) => i.nickName == req.body.nickName
      );
      if (userIndex == -1) {
        rankings[index].data.push({
          nickName: req.body.nickName,
          score: req.body.score,
        });
      } else {
        rankings[index].data[userIndex].score = req.body.score;
      }
      //res.status(200).json(rankings[index]);
      res.send(rankings[index]);
    } else {
      res.send("Invalid Game");
    }
  } else {
    res.send("Invalid Data Type");
  }
  console.log(rankings[0].data);
});

app.listen(8000);
