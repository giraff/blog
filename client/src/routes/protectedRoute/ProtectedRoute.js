import React from 'react'
import { useSelector } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

// post edit의 경우, url에 경로 작성을 하여 접속이 가능한 것을 방지하기 위해 
// protected 된 라우터를 등록한다.

// Component 기존의 것들과 나머지 구성요소를 받아와서
// 기본적으로는 나머지것들을 가져오지만 userId와 creatorId가 같다고 하면
// 받은 있는 그대로의 컴포넌트를 렌더링하고
// 그렇지 않으면 홈으로 보내주고 상태는 받았던 위치 상태 그대로 가져가서 홈으로 보낸다
// 결론적으로 프론트에서도 게시글 수정에 관해 주소창에서의 직접적인 접근을 막을 수 있다.
export const EditProtectedRoute = ({ component: Component, ...rest}) => {
  // 로그인 한 유저 아이디(userId) === 글 작성자의 아이디(creatorId) 인 경우에만
  // post.id 뒤에 edit을 붙여 접속이 가능하도록 한다.
  const {userId} = useSelector((state) => state.auth);
  const {creatorId} = useSelector((state) => state.post);

  return (
    <Route 
      {...rest}
      render = {(props) => {
        if (userId === creatorId) {
          return <Component {...props} /> //물려받은 것을 그대로 돌려주기
        } else {
          return (
            <Redirect 
              to={{
                pathname: "/",
                state: {
                  from: props.location
                }// redux에서 주소 변환은 redux history에서 주소 받아와 
                // SPA 특징이 어느 곳의 주소를 새로고침 없이 내부 구성요소만 바꾸는 것인데
                // 그 때 history location을 사용. state에 값을 가져오는 것이다.
              }}
            />
          )
        }
      }}
    />
  )
}

export const ProfileProtectedRoute = ({ component: Component, ...rest}) => {
  // 로그인 한 유저 아이디(userId) === 글 작성자의 아이디(creatorId) 인 경우에만
  // post.id 뒤에 edit을 붙여 접속이 가능하도록 한다.
  const {userName} = useSelector((state) => state.auth);
  // userName : 현재 로그인 한 사람의 이름
  console.log(userName);
  return (
    <Route 
      {...rest}
      render = {(props) => {
        // 누군가가 url에 임의로 유저 이름을 입력해서 들어올 때를 대비해서
        // url에 넘어온 userName과 현재 로그인 사람이 같으면 프로필 페이지를 보여주고
        console.log(userName,'userName');
        console.log(props.match.params.userName,'url userName');
        // aAppNavBar에서 Link to로 '/user/user.name/profile 을 보내면서 user.name을 보낸다.
        if (props.match.params.userName === userName) {
          return <Component {...props} /> //물려받은 것을 그대로 돌려주기
        } else {
          // 다르면 홈으로 보내주기 (protect)
          return (      
            <Redirect 
              to={{
                pathname: "/",
                state: {
                  from: props.location
                }// redux에서 주소 변환은 redux history에서 주소 받아와 
                // SPA 특징이 어느 곳의 주소를 새로고침 없이 내부 구성요소만 바꾸는 것인데
                // 그 때 history location을 사용. state에 값을 가져오는 것이다.
              }}
            />
          )
        }
      }}
    />
  )
}