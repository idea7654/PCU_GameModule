# 끝말잇기 체크 라이브러리

> 1학년 끝말잇기 프로젝트에서 단어를 입력받아 국립국어원에 등록된 단어인지 체크하는 라이브러리입니다.

## Usage

```javascript
1. 해당 프로젝트를 다운받아 checkword.js파일을 자신의 프로젝트의 index.html과 같은 루트에 위치시킵니다.
2. html파일의 헤더 태그에 다음을 넣습니다.
<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
<script src="checkword.js"></script>
3. 연결된 js파일에서
checkWord("마느아리가").then((res) => {
  console.log(res);
});
과 같은 형태로 사용합니다.
checkWord(word).then((res) => {}
의 형태로 사용하며, res는 bool값입니다.
4. 서버에서 응답받는데 시간이 걸리기에, Promise를 사용하지 않으면 undefined가 나오므로, 반드시 3번과 같은 형태로 사용해주시길 바랍니다.               
```

## Example

```javascript
domElement.AddEventListener("onclick", () => {
  const word = "나무";
  checkWord(word).then((res) => {
    if(res){
      //인풋태그에 있는 값 합치기
    }
  });
});
```

