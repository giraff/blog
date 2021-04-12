import React, { Fragment, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import {useParams} from 'react-router-dom';
import { CLEAR_ERROR_REQUEST, PASSWORD_EDIT_UPLOADING_REQUEST } from '../../redux/types';
import Helmet from 'react-helmet';
import { Alert, Button, Card, CardBody, CardHeader, Col, Form, FormGroup, Input, Label } from 'reactstrap';

const Profile = () => {
  // 컨테이너 
  const dispatch = useDispatch();
  const {userId, errorMsg, successMsg, previousMatchMsg} = useSelector((state) => state.auth);
  const {userName} = useParams();
  
  const [form, setValues] = useState({
    previousPassword:"",
    password: "",
    rePassword:"",

  });

  const onChange = (e) => {
    setValues({
      ...form,
      [e.target.name]: e.target.value
    })
  };

  const onSubmit = async(e) => {
    e.preventDefault();
    const {previousPassword, password, rePassword} = form;
    const token = localStorage.getItem("token");
    const body = {
      previousPassword,
      password,
      rePassword,
      token,
      userId,
      userName
    };
    // password edit 전에 에러 메시지 비우기
    dispatch({
      type: CLEAR_ERROR_REQUEST
    });
    //password 수정 요청
    dispatch({
      type: PASSWORD_EDIT_UPLOADING_REQUEST,
      payload: body
    });
  }

  
  //프레젠터
  return (
    <Fragment>
      <Helmet title={`Profile | ${userName}님의 프로필`} />
      <Col sm="12" md={{}}>
        {/* 한 열을 12칸으로 나눌 때 sm은 브라우저 크기가 작을 때 기준 12칸 다 씀. md 중간정도 크기 이상이면 12칸 중 3번째에서 시작하여 크기 6짜리로 만들어라 */}
        <Card>
          <CardHeader>
            <strong>Edit Password</strong>
          </CardHeader>
          <CardBody>
            <Form onSubmit={onSubmit}>
              <FormGroup>
                <Label for="title">기존 비밀번호</Label>
                <Input 
                  type="password"
                  name="previousPassword"
                  id="previousPassword"
                  className="form-control mb-2"
                  onChange={onChange}
                  required
                />
                {
                  // 서버에서 온 메시지를 보여준다.
                  previousMatchMsg ? <Alert color="danger">{previousMatchMsg}</Alert>
                  : ""
                }
              </FormGroup>
              <FormGroup>
                <Label for="title">새 비밀번호</Label>
                <Input 
                  type="password"
                  name="password"
                  id="password"
                  className="form-control"
                  onChange={onChange}
                  required
                />
                {/* 새 비밀번호 적는 칸에는 굳이 에러 메시지가 나올 필요 없음 */}
              </FormGroup>
              <FormGroup>
                <Label for="title">비밀번호 확인</Label>
                <Input 
                  type="password"
                  name="rePassword"
                  id="rePassword"
                  className="form-control mb-2"
                  onChange={onChange}
                  required
                />
                {
                  // 서버에서 온 메시지를 보여준다.
                  errorMsg ? <Alert color="danger">{errorMsg}</Alert> : ""
                }
              </FormGroup>
              {/* 한 열을 12칸으로 나눈 col에서 크기 3짜리이며 9번째에서 시작한다. */}
              <Button color="success" block className="mt-4 mb-4 col-md-3 offset-9">제출하기</Button>
              {
                successMsg ? <Alert color="success">{successMsg}</Alert> : ""
              }
            </Form>
          </CardBody>
        </Card>
      </Col>
    </Fragment>
  );
}

export default Profile;