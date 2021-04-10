/** 48강 postDetail 댓글 영역에 추가할 컴포넌트*/

import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Form, FormGroup, Input, Row } from 'reactstrap';
import { COMMENT_LOADING_REQUEST, COMMENT_UPLOADING_REQUEST } from '../../redux/types';

const Comments = ({
  id,
  userId,
  userName
}) => {

  const dispatch = useDispatch();
  const [form, setValues] = useState({
    contents: ""
  });
    // 직접 노드 객체에 접근해 수정
  // 댓글 작성 이후, textarea에 이전에 입력한 댓글이 남아있는 걸 방지. input textarea 초기화
  const resetValue = useRef(null);
  // 1. useRef 객체 생성

  const onSubmit = async(e) => {
    await e.preventDefault();
    const { contents } = form;

    console.log('onSubmit',contents)
    // 오직 인증된 유저만 댓글 달기 가능하므로 token 값 가져오기
    const token = localStorage.getItem("token");

    const body = {
      contents, token, id, userId, userName
    };


    dispatch({
      type: COMMENT_UPLOADING_REQUEST,
      payload: body
    })

    // 값 초기화
    console.log('resetValue: ', resetValue.current.value);
    // resetValue가 참조하는 노드 객체의 값을 빈값으로 해줘라
    resetValue.current.value = null;
    console.log('resetValue after: ', resetValue.current.value);
    setValues({contents: ""});
  };

  const onChange = (e) => {
    setValues({
      ...form,
      [e.target.name] : e.target.value
    });
    console.log('댓글 입력:',form.contents);
  }

  useEffect(()=> {
    dispatch({
      type:COMMENT_LOADING_REQUEST,
      payload: id
    })
  },[dispatch, id]);

  return (
    <>
      <Form onSubmit={onSubmit}>
        <FormGroup>
          <Row className="p-2"> 
            <div className="font-weight-bold m-1">
              Make Comment
            </div>
            <div className="my1"/>
            <Input 
              ref={resetValue}
              type="textarea"
              name="contents"
              id="contents"
              value={form.contents}
              onChange={onChange}
              placeholder="Comment"
            />
            <Button 
              color="primary"
              block
              className="mt-2 offset-md-10 col-md-2"
            >Submit</Button>
            {/*md 값보다 작게 된다면 block => 한 칸으로 다 채운다  */}
            {/* offset-md-10 : 화면 크기가 어느정도 이상이 되면 12등분을 나눠 10번째부터 시작! 대신 크기는 2다. */}
            {/* col-md-2 reactstrap은 11칸을 12등분하는데 그 중에서 12등분 중 2칸 차지 */}
          </Row>
        </FormGroup>
      </Form>
    </>
  );
}

export default Comments;