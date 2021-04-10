import React, { useEffect, useState } from 'react';
import { FormGroup, Input, Label, Modal, ModalBody, ModalHeader, NavLink, Form, Alert, Button } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { CLEAR_ERROR_REQUEST, LOGIN_REQUEST } from '../../redux/types';

//redux redux-saga 이용해 상태 관리
const LoginModal = () => {
  const [modal, setModal] = useState(false);
  const [localMsg, setLocalMsg] = useState('');
  const [form, setValues] = useState({
    email: "",
    password: "",
  });

  //redux에 있는 타입을 보낸다.
  const dispatch = useDispatch();
  const {errorMsg} = useSelector((state) => state.auth)

  useEffect(()=> {
    try{
      setLocalMsg(errorMsg)
    }catch(e) {
      console.log(e)
    }
  }, [errorMsg])

  const handleToggle = () => {
    dispatch({
      type: CLEAR_ERROR_REQUEST
    })
    setModal(!modal); //modal 닫기
  }

  const onChange = (e) => {
    setValues({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const onSubmit = (e) => {
    e.preventDefault();
    //리액트가 새로고침 안 하도록 막아줌
    const {email, password} = form
    const user = {email, password}
    console.log('onSubmit:',user);
    dispatch({
      type:LOGIN_REQUEST,
      payload: user
    })
  }

  return (
    <div>
      <NavLink onClick={handleToggle} href="#">
        Login
      </NavLink>
      <Modal isOpen={modal} toggle={handleToggle}>
          <ModalHeader toggle={handleToggle}>Login</ModalHeader>
          <ModalBody>
            {localMsg ? <Alert color="danger">{localMsg}</Alert> : null}
            <Form onSubmit={(e) => onSubmit(e)}>
              <FormGroup>
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
                <Button color='dark' style={{marginTop: "2rem"}} block>
                  Login
                </Button>
              </FormGroup>
            </Form>
          </ModalBody>

      </Modal>
    </div>
  )
};

export default LoginModal;