(function (window) {
  var checkWord = function (word) {
    return axios
      .post("https://endtalk.herokuapp.com", {
        word: word,
      })
      .then((res) => res.data.result);
  };

  window.checkWord = checkWord;
})(window);
