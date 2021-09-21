const data = {
  gameName: "test",
  nickName: "Edea",
  score: 80,
};

axios.post("http://localhost:8000", data).then((res) => {
  console.log(res);
});
