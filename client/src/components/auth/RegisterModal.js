import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CLEAR_ERROR_REQUEST, REGISTER_REQUEST } from '../../redux/types';
import { Alert, Button, Form, FormGroup, Input, Label, Modal, ModalBody, ModalHeader, NavLink } from 'reactstrap';

const RegisterModal = () => {
  const [modal, setModal] = useState(false);
  const [form, setValues] = useState({
    name: "",
    email: "",
    password: ""
  })
  const [localMsg, setLocalMsg] = useState("");
  const {errorMsg} = useSelector((state) => state.auth);
  // auth는 redux - reducers - index.js 에서 combine된 auth (authReducer) 를 의미한다.
  // authReducer의 errorMsg를 가져온다

  // 타입으로 리듀서에 의한 상태 관리 요청 보낼때 사용
  const dispatch = useDispatch();

  // x 표시 누를 때 error 없애주고 모달을 닫아주는 토글
  const handleToggle = () => {
    dispatch({
      type: CLEAR_ERROR_REQUEST
    })
    setModal(!modal)
  }

  //errorMsg 변경될때마다 localMsg 을 errorMsg 값으로 업뎃
  useEffect(()=> {
    try{
      setLocalMsg(errorMsg)
    }catch(e){
      console.log(e,"RegisterModal/useEffect Error")
    }
  }, [errorMsg]);

  const onChange = (e) => {
    setValues({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const onSubmit = (e) => {
    e.preventDefault();
    const {name, email,password} = form;
    const newUser = {name, email, password}
    console.log(newUser,"RegisterModal/newUser");

    // 상태 변화 (제출)
    dispatch({
      type: REGISTER_REQUEST,
      payload: newUser
    })
  }

  // presentor

  // react 구조화 방법 (컨테이너, 프레젠터)
  // 1. 함수 부분을 따로 떼서 컨테이너 , return {}을 통해 밖으로 표현하는 부분이 프레젠터
  // 2. 프레젠터와 컨테이너 두 개를 나눠서 작성하는 방식
  // 3. 이 방식은 파일을 모듈화하여 재사용이 가능하여 권장되는 방식
  // 4. 단점은 처음 입문자에게 직관적으로 이해하기 힘들다.

  // 그래서 지금처럼 쭉 나열하는 방식을 입문자에게 추천
  return (
    <div>
      {/* 따로 가는 곳이 없기 때문에 href="#" */}
      <NavLink onClick={handleToggle} href="#">
        Register
      </NavLink>
      <Modal isOpen={modal} toggle={handleToggle}>
        <ModalHeader toggle={handleToggle}>Register</ModalHeader>
        <ModalBody>
          {/* reactstrap은 색상의 이름을 대표 8가지 지었고 이름은 직관적으로 쓸 수 있게 표시
          danger = 불그스름한 계통의 색  node_modules - bootstrap - scss - bootstrap.scss, _variable.css 에서 참고*/}
          {localMsg ? <Alert color ="danger">{localMsg}</Alert> : null }
          <Form onSubmit={(e) => onSubmit(e)}>
            <FormGroup>
              <Label for="name">Name</Label>
              <Input 
                type="text"
                name="name"
                id="name"
                placeholder="Name"
                onChange={(e) => onChange(e)}
              />
              <Label for="email">Email</Label>
              <Input 
                type="email"
                name="email"
                id="email"
                placeholder="Email"
                onChange={(e) => onChange(e)}
              />
              <Label for="password">Password</Label>
              <Input 
                type="password"
                name="password"
                id="password"
                placeholder="Password"
                onChange={(e) => onChange(e)}
              />
              <Button color="dark" className="mt-2" block>Register</Button>
            </FormGroup>
          </Form>
        </ModalBody>
      </Modal>
    </div>
  )


}

export default RegisterModal;