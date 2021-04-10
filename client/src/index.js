import React from 'react'; //view를 만들기 위한 라이브러리
import ReactDOM from 'react-dom'; // UI를 브라우저에서 렌더링하는데 사용하는 라이브러리

//렌더링 : 그려준다.
import App from './App';
import loadUser from './components/auth/loadUser';

// 브라우저에 렌더링하는 도구에서 render를 가져와
// React라는 규격에 맞춰서 App을 그려주라는 것
// 그때 문서에 id가 root인 곳을 가지고 와 거기에 App을 그리라는 것
loadUser()

ReactDOM.render(<App />, document.getElementById('root'));

